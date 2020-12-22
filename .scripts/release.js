const { cyan, dim, green, red, yellow } = require('kleur');
const execa = require('execa');
const Listr = require('listr');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const common = require('./common');
const fs = require('fs-extra');

async function main() {
  try {
    const dryRun = process.argv.indexOf('--dry-run') > -1;

    if (!process.env.GH_TOKEN) {
      throw new Error('env.GH_TOKEN is undefined');
    }

    const version = await common.getNewVersion('release');
    if (typeof version === 'undefined') return;

    checkProductionRelease();

    const tasks = [];
    const changelog = findChangelog();

    // Repo must be clean
    common.checkGit(tasks);

    const NPM_TAG = 'latest';

    if(!dryRun) {
      // Copy license
      packages.forEach(package => { copyLicenseToPackage(package, tasks); });

      // copy changelog
      packages.forEach(package => { copyChangelogToPackage(package, tasks); });

      // publish each package in NPM
      common.publishPackages(tasks, common.packages, version, NPM_TAG);

      // push tag to git remote
      publishGit(tasks, version, changelog, NPM_TAG);
    }

    const listr = new Listr(tasks);
    await listr.run();

    // Dry run doesn't publish to npm or git
    if (dryRun) {
      console.log(`
        \n${yellow('Did not publish. Remove the "--dry-run" flag to publish:')}\n${green(version)} to ${cyan(NPM_TAG)}\n
      `);
    } else {
      console.log(`\nvime ${version} published to ${NPM_TAG}!! 🎉\n`);
    }

  } catch (err) {
    console.log('\n', red(err), '\n');
    process.exit(1);
  }
}

function checkProductionRelease() {
  const corePath = common.projectPath('core');
  const hasEsm = fs.existsSync(path.join(corePath, 'dist', 'esm'));
  const hasCjs = fs.existsSync(path.join(corePath, 'dist', 'cjs'));
  if (!hasEsm || !hasCjs) {
    throw new Error('@vime/core build is not a production build');
  }
}

function publishGit(tasks, version, changelog, npmTag) {
  const gitTag = `v${version}`;

  tasks.push(
    {
      title: `Tag latest commit ${dim(`(${gitTag})`)}`,
      task: () => execa('git', ['tag', `${gitTag}`], { cwd: common.rootDir })
    },
    {
      title: 'Push branches to remote',
      task: () => execa('git', ['push'], { cwd: common.rootDir })
    },
    {
      title: 'Push tags to remove',
      task: () => execa('git', ['push', '--follow-tags'], { cwd: common.rootDir })
    },
    {
      title: 'Publish Github release',
      task: () => publishGithub(version, gitTag, changelog, npmTag)
    }
  );
}

function copyLicenseToPackage(package, tasks) {
  const pkg = common.readPkg(package);
  const licenseFileName = 'LICENSE';
  const licensePath = path.resolve(common.rootDir, licenseFileName);
  const pkgLicensePath = path.resolve(common.projectPath(package), licenseFileName);

  tasks.push({
    title: `copying license to ${pkg.name}`,
    task: () => fs.copyFile(licensePath, pkgLicensePath),
  });
}

function copyChangelogToPackage(package, tasks) {
  const pkg = common.readPkg(package);
  const changelogFileName = 'CHANGELOG.md';
  const changelogPath = path.resolve(common.rootDir, changelogFileName);
  const pkgChangelogPath = path.resolve(common.projectPath(package), changelogFileName);

  tasks.push({
    title: `copying changelog to ${pkg.name}`,
    task: () => fs.copyFile(changelogPath, pkgChangelogPath),
  });
}

function findChangelog() {
  const lines = fs.readFileSync('CHANGELOG.md', 'utf-8').toString().split('\n');
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,2} \d/.test(line)) {
      if (start === -1) {
        start = i + 1;
      } else {
        end = i - 1;
        break;
      }
    }
  }

  if(start === -1 || end === -1) {
    throw new Error('changelog diff was not found');
  }

  return lines.slice(start, end).join('\n').trim();
}

async function publishGithub(version, gitTag, changelog, npmTag) {
  // If the npm tag is next then publish as a prerelease
  const prerelease = npmTag === 'next' ? true : false;

  const octokit = new Octokit({
    auth: process.env.GH_TOKEN
  });

  let branch = (await execa('git', ['symbolic-ref', '--short', 'HEAD'])).stdout;

  if (!branch) {
    branch = 'master';
  }

  await octokit.repos.createRelease({
    owner: 'vimejs',
    repo: 'vime',
    target_commitish: branch,
    tag_name: gitTag,
    name: version,
    body: changelog,
    prerelease: prerelease
  });
}

main();