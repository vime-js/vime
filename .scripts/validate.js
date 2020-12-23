const execa = require('execa');
const { red } = require('kleur');
const Listr = require('listr');

async function main() {
  try {
    const tasks = [];

    tasks.push({
      title: 'Check local working tree',
      task: () =>
        execa('git', ['status', '--porcelain']).then(r => r.stdout).then(status => {
          if (status !== '') {
            throw new Error(`Unclean working tree. There are files that have not been committed after a build/lint step.`);
          }
        })
    })

    const listr = new Listr(tasks);
    await listr.run();
  }  catch (err) {
    console.log('\n', red(err), '\n');
    process.exit(1);
  }
}

main();