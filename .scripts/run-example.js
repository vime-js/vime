import { spawn } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import Prompts from 'prompts';
import path from 'upath';
import minimist from 'minimist';
import { fileURLToPath } from 'url';

const { prompts } = Prompts;

const args = minimist(process.argv.slice(2));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.resolve(__dirname, '../examples');

const examples = readdirSync(examplesDir).filter(
  dirName => !dirName.startsWith('.'),
);

const exampleArg = args._[0];

const exampleArgIndex = examples.findIndex(example => example === exampleArg);

const exampleIndex =
  exampleArgIndex >= 0
    ? exampleArgIndex
    : await prompts.select({
        message: 'Pick an example',
        choices: examples,
        initial: 0,
      });

const example = examples[exampleIndex];
const exampleDir = path.resolve(examplesDir, example);
const relativePathToExample = path.relative(process.cwd(), exampleDir);
const examplePkgPath = path.resolve(exampleDir, 'package.json');
const examplePkgContent = JSON.parse(readFileSync(examplePkgPath).toString());

const scripts = Object.keys(examplePkgContent.scripts);
const scriptArg = args.script;
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

spawn('npm', ['run', script, `--prefix=${relativePathToExample}`], {
  stdio: 'inherit',
});
