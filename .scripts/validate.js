const execa = require('execa');
const { bold, red } = require('kleur');
const Listr = require('listr');
const common = require('./common');

async function main() {
  try {
    const tasks = [];

    validatePackages(tasks, common.packages);

    const listr = new Listr(tasks, { showSubtasks: true });
    await listr.run();
  } catch (err) {
    console.log('\n', red(err), '\n');
    process.exit(1);
  }
}

function validatePackages(tasks, packages) {
  packages.forEach(package => {
    validatePackage(tasks, package);
  });
}

function validatePackage(tasks, package) {
  const projectRoot = common.projectPath(package);
  const pkg = common.readPkg(package);
  const validationTasks = [];

  validationTasks.push({
    title: `${pkg.name}: install npm dependencies`,
    task: async () => {
      // await fs.remove(path.join(projectRoot, 'node_modules'));
      await execa('npm', ['i', '--legacy-peer-deps'], { cwd: projectRoot });
    },
  });

  if (package !== 'core') {
    validationTasks.push({
      title: `${pkg.name}: npm link @vime/core`,
      task: () =>
        execa('npm', ['link', '@vime/core', '--legacy-peer-deps'], {
          cwd: projectRoot,
        }),
    });
  }

  validationTasks.push({
    title: `${pkg.name}: lint`,
    task: () => {
      try {
        execa('npm', ['run', 'format'], { cwd: projectRoot });
      } catch (e) {
        // ...
      }
    },
  });

  validationTasks.push({
    title: `${pkg.name}: build`,
    task: () => execa('npm', ['run', 'build'], { cwd: projectRoot }),
  });

  // link @vime/core for integrations
  if (package === 'core') {
    validationTasks.push({
      title: `${pkg.name}: npm link`,
      task: () =>
        execa('npm', ['link', '--legacy-peer-deps'], { cwd: projectRoot }),
    });
  }

  tasks.push({
    title: `Validate ${bold(pkg.name)}`,
    task: () => new Listr(validationTasks),
  });
}

main();
