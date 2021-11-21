import { spawn } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import Prompts from 'prompts';
import minimist from 'minimist';
import path from 'upath';
import { fileURLToPath } from 'url';

const { prompts } = Prompts;

const args = minimist(process.argv.slice(2));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sandboxRootDir = path.resolve(__dirname, '../sandbox');

const sandboxChildDirs = readdirSync(sandboxRootDir).filter(
  dirName => !dirName.startsWith('.'),
);

const sandboxArg = args._[0];

const sandboxArgIndex = sandboxChildDirs.findIndex(
  example => example === sandboxArg,
);

const sandboxIndex =
  sandboxArgIndex >= 0
    ? sandboxArgIndex
    : await prompts.select({
        message: 'Pick a sandbox:',
        choices: sandboxChildDirs,
        initial: 0,
      });

const sandbox = sandboxChildDirs[sandboxIndex];
const sandboxDir = path.resolve(sandboxRootDir, sandbox);
const relativePathToSandbox = path.relative(process.cwd(), sandboxDir);

const sandboxPkgPath = path.resolve(sandboxDir, 'package.json');
const sandboxPkgContent = JSON.parse(readFileSync(sandboxPkgPath).toString());

const scripts = Object.keys(sandboxPkgContent.scripts);
const scriptArg = args.s ?? args.script;
const scriptArgIndex = scripts.findIndex(script => script === scriptArg);

const scriptIndex =
  scriptArgIndex >= 0
    ? scriptArgIndex
    : await prompts.select({
        message: 'Pick a script',
        choices: scripts,
        initial: 0,
      });

const script = scripts[scriptIndex];

spawn('npm', ['run', script, `--prefix=${relativePathToSandbox}`], {
  stdio: 'inherit',
});
