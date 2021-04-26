import { OutputTargetCustom } from '@stencil/core/internal';
import path from 'path';

import { ignoreChecks, sortComponents } from '../../../src/utils/target';
import { generateSvelteFiles } from './generateSvelteFiles';
import {
  generate$$TypeDefs,
  generateSvelteTypings,
  replaceSvelteMethodDefs,
} from './generateSvelteTypings';
import { SvelteTargetConfig } from './SvelteTargetConfig';

const OUTPUT_DIR = path.resolve(__dirname, '../src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components/index.ts');

export const svelteOutputTarget = (
  outputTarget: SvelteTargetConfig = {},
): OutputTargetCustom => ({
  type: 'custom',
  name: 'svelte-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('generate svelte started', true);

    const output = await generateSvelteFiles(
      outputTarget,
      sortComponents(buildCtx.components),
    );
    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);
    const uncompiledDir = path.resolve(OUTPUT_DIR, 'svelte');
    const compiledDir = path.resolve(OUTPUT_DIR, 'components');

    await compilerCtx.fs.writeFile(
      path.resolve(uncompiledDir, 'index.js'),
      output.uncompiledEntry,
    );

    await Promise.all(
      output.uncompiledFiles.map(file => {
        const filePath = path.resolve(uncompiledDir, `${file.name}.svelte`);
        return compilerCtx.fs.writeFile(filePath, file.content);
      }),
    );

    await Promise.all(
      output.compiledFiles.map(file => {
        const filePath = path.resolve(compiledDir, `${file.name}.ts`);
        const { content, meta } = file;

        return compilerCtx.fs.writeFile(
          filePath,
          [
            ignoreChecks(),
            "import { Components, JSX } from '@vime/core';\n",
            generateSvelteTypings(meta),
            replaceSvelteMethodDefs(meta, generate$$TypeDefs(meta, content)),
          ].join('\n'),
        );
      }),
    );

    timespan.finish('generate svelte finished');
  },
});
