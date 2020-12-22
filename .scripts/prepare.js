const { dim, bold, cyan, red, yellow } = require('kleur');
const execa = require('execa');
const Listr = require('listr');
const semver = require('semver');
const common = require('./common');
const path = require('path');
const fs = require('fs-extra');

async function main() {
  try {
    if (!process.env.GH_TOKEN) {
      throw new Error('env.GH_TOKEN is undefined');
    }

    const version = await common.getNewVersion('prepare');
    if (typeof version === 'undefined') return;

    const install = process.argv.indexOf('--no-install') < 0;
    const ci = process.argv.indexOf('--ci') > -1;

    // Compile and verify packages
    await preparePackages(common.packages, version, install);

    if (ci) {
      console.log(yellow('CI detected.'));
      await gitCommitRelease(version);
    } else {
      console.log(`\nvime ${version} prepared 🤖\n`);
      console.log(`Next steps:`);
      console.log(`  Verify CHANGELOG.md`);
      console.log(`  git commit -m "chore(release): v${version}"`);
      console.log(`  npm run release\n`);
    }
  } catch(err) {
    console.log('\n', red(err), '\n');
    process.exit(1);
  }
}

async function gitCommitRelease(version) {
  console.log(bold(cyan(`Committing release v${version}.`)));
  await execa('git', ['add', '.'], { cwd: common.rootDir });
  return execa('git', ['commit', '-m', `chore(release): publish v${version} 🥳`], { cwd: common.rootDir });
}

async function preparePackages(packages, version, install) {
  // Execution order matters
  const tasks = [];

  // Check git is nice and clean local and remote
  common.checkGit(tasks);

  // Test we're good with git
  validateGit(tasks, version);

  // Add all the prepare scripts
  // Run all these tasks before updating package.json version
  packages.forEach(package => {
    common.preparePackage(tasks, package, version, install);
  });

  // Add update package.json of each project
  common.updatePackageVersions(tasks, packages, version);

  // Generate changelog
  generateChangeLog(tasks);

  const listr = new Listr(tasks, { showSubtasks: true });
  await listr.run();
}

function validateGit(tasks, version) {
  tasks.push(
    {
      title: `Validate git tag ${dim(`(v${version})`)}`,
      task: () => execa('git', ['fetch'])
        .then(() => {
          return execa('npm', ['config', 'get', 'tag-version-prefix']);
        })
        .then(r => r.stdout)
        .then(
          output => {
            tagPrefix = output;
          },
          () => {}
        )
        .then(() => execa('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${version}`]))
        .then(r => r.stdout)
        .then(
          output => {
            if (output) {
              throw new Error(`Git tag \`${tagPrefix}${version}\` already exists.`);
            }
          },
          err => {
            // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
            // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
            if (err.stdout !== '' || err.stderr !== '') {
              throw err;
            }
          }
        )
    },
  );
}

function generateChangeLog(tasks) {
  tasks.push({
    title: `Generate CHANGELOG.md`,
    task: () => execa('npm', ['run', 'changelog'], { cwd: common.rootDir }),
  });
}

main();