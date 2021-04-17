const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const semver = require('semver');
const Listr = require('listr');
const { bold, cyan, yellow, reset, dim } = require('kleur');
const { promisify } = require('util');
const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const { release } = require('os');

const rootDir = path.join(__dirname, '../');

const packages = [
  'core',
  'integrations/angular',
  'integrations/react',
  'integrations/svelte',
  'integrations/vue',
  'integrations/vue-next',
  // 'docs',
];

function readPkg(project) {
  const packageJsonPath = packagePath(project);
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

function writePkg(project, pkg) {
  const packageJsonPath = packagePath(project);
  const text = JSON.stringify(pkg, null, 2);
  return fs.writeFileSync(packageJsonPath, `${text}\n`);
}

function packagePath(project) {
  return path.join(rootDir, project, 'package.json');
}

function projectPath(project) {
  return path.join(rootDir, project);
}

async function getNewVersion(step) {
  const bump = promisify(conventionalRecommendedBump);
  const { releaseType, reason } = await bump({ preset: 'angular' });
  const { version: oldVersion } = readPkg('core');
  const newVersion = semver.inc(oldVersion, releaseType);
  return newVersion;
}

function checkGit(tasks) {
  tasks.push(
    {
      title: 'Check current branch',
      task: () =>
        execa('git', ['symbolic-ref', '--short', 'HEAD'])
          .then((r) => r.stdout)
          .then((branch) => {
            if (branch.indexOf('release') === -1) {
              throw new Error(`Must be on "release" branch.`);
            }
          }),
    },
    // {
    //   title: 'Check local working tree',
    //   task: () =>
    //     execa('git', ['status', '--porcelain']).then(r => r.stdout).then(status => {
    //       if (status !== '') {
    //         throw new Error(`Unclean working tree. Commit or stash changes first.`);
    //       }
    //     })
    // },
    {
      title: 'Check remote history',
      task: () =>
        execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
          .then((r) => r.stdout)
          .then((result) => {
            if (result !== '0') {
              throw new Error(`Remote history differs. Please pull changes.`);
            }
          }),
    }
  );
}

const isValidVersion = (input) => Boolean(semver.valid(input));

function preparePackage(tasks, package, version, install) {
  const projectRoot = projectPath(package);
  const pkg = readPkg(package);

  const packageTasks = [];

  if (version) {
    packageTasks.push({
      title: `${pkg.name}: validate new version`,
      task: () => {
        if (!isVersionGreater(pkg.version, version)) {
          throw new Error(
            `New version \`${version}\` should be higher than current version \`${pkg.version}\``
          );
        }
      },
    });

    if (install) {
      packageTasks.push({
        title: `${pkg.name}: install npm dependencies`,
        task: async () => {
          // await fs.remove(path.join(projectRoot, 'node_modules'));
          await execa('npm', ['i', '--legacy-peer-deps'], { cwd: projectRoot });
        },
      });
    }
  }

  if (package !== 'docs') {
    if (package !== 'core') {
      packageTasks.push({
        title: `${pkg.name}: npm link @vime/core`,
        task: () =>
          execa('npm', ['link', '@vime/core', '--legacy-peer-deps'], {
            cwd: projectRoot,
          }),
      });
    }

    if (version) {
      packageTasks.push({
        title: `${pkg.name}: lint`,
        task: () => execa('npm', ['run', 'lint'], { cwd: projectRoot }),
      });
    }

    packageTasks.push({
      title: `${pkg.name}: build`,
      task: () => execa('npm', ['run', 'build'], { cwd: projectRoot }),
    });

    // link @vime/core for integrations
    if (package === 'core') {
      packageTasks.push({
        title: `${pkg.name}: npm link`,
        task: () =>
          execa('npm', ['link', '--legacy-peer-deps'], { cwd: projectRoot }),
      });
    }

    if (version) {
      packageTasks.push({
        title: `${pkg.name}: update @vime/core dep to ${version}`,
        task: () => {
          updateDependency(pkg, '@vime/core', version);
          writePkg(package, pkg);
        },
      });
    }
  }

  if (package === 'docs') {
    packageTasks.push({
      title: `${pkg.name}: update @vime/react dep to ${version}`,
      task: () => {
        updateDependency(pkg, '@vime/react', version);
        writePkg(package, pkg);
      },
    });
  }

  tasks.push({
    title: `Prepare ${bold(pkg.name)}`,
    task: () => new Listr(packageTasks),
  });
}

function updatePackageVersions(tasks, packages, version) {
  packages.forEach((package) => {
    updatePackageVersion(tasks, package, version);

    tasks.push({
      title: `${package} update @vime/core dependency, if present ${dim(
        `(${version})`
      )}`,
      task: async () => {
        if (package !== 'core') {
          const pkg = readPkg(package);
          updateDependency(pkg, '@vime/core', version);
          writePkg(package, pkg);
        }
      },
    });

    // @vime/angular needs to update the dist version
    if (package === 'integrations/angular') {
      const distPackage = path.join(package, 'dist/vime/angular');

      updatePackageVersion(tasks, distPackage, version);

      tasks.push({
        title: `${package} update @vime/core dependency, if present ${dim(
          `(${version})`
        )}`,
        task: async () => {
          const pkg = readPkg(distPackage);
          updateDependency(pkg, '@vime/core', version);
          writePkg(distPackage, pkg);
        },
      });
    }
  });
}

function updatePackageVersion(tasks, package, version) {
  const projectRoot = projectPath(package);

  tasks.push({
    title: `${package}: update package.json ${dim(`(${version})`)}`,
    task: async () => {
      await execa('npm', ['version', version], { cwd: projectRoot });
    },
  });
}

function publishPackages(tasks, packages, version, npmTag = 'latest') {
  // Verify version
  packages.forEach((package) => {
    if (package === 'core') return;

    tasks.push({
      title: `${package}: check version (must match: ${version})`,
      task: () => {
        const pkg = readPkg(package);

        if (version !== pkg.version) {
          throw new Error(
            `${pkg.name} version ${pkg.version} must match ${version}`
          );
        }
      },
    });
  });

  // Publish
  packages.forEach((package) => {
    let projectRoot = projectPath(package);

    if (package === 'integrations/angular') {
      projectRoot = path.join(projectRoot, 'dist/vime/angular');
    }

    tasks.push({
      title: `${package}: publish to ${npmTag} tag`,
      task: async () => {
        await execa('npm', ['publish', '--tag', npmTag], { cwd: projectRoot });
      },
    });
  });
}

function updateDependency(pkg, dependency, version) {
  if (pkg.dependencies && pkg.dependencies[dependency]) {
    pkg.dependencies[dependency] = version;
  }

  if (pkg.devDependencies && pkg.devDependencies[dependency]) {
    pkg.devDependencies[dependency] = version;
  }

  if (pkg.peerDependencies && pkg.peerDependencies[dependency]) {
    pkg.peerDependencies[dependency] = version;
  }
}

function isVersionGreater(oldVersion, newVersion) {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return true;
}

module.exports = {
  checkGit,
  isValidVersion,
  isVersionGreater,
  getNewVersion,
  packages,
  packagePath,
  preparePackage,
  projectPath,
  publishPackages,
  readPkg,
  rootDir,
  updateDependency,
  updatePackageVersion,
  updatePackageVersions,
  writePkg,
};
