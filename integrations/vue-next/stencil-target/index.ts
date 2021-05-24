import { OutputTargetCustom } from '@stencil/core/internal';
import path from 'path';

import { sortComponents } from '../../../src/utils/target';
import { generateVueNextFiles } from './generateVueNextFiles';

const OUTPUT_DIR = path.resolve(__dirname, '../src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components/index.ts');

export const vueNextOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'vue-next-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('vue-next [start]', true);

    const output = await generateVueNextFiles(
      sortComponents(buildCtx.components),
    );

    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);

    await Promise.all(
      output.components.map(file => {
        const filePath = path.resolve(
          OUTPUT_DIR,
          'components',
          `${file.name}.ts`,
        );
        return compilerCtx.fs.writeFile(filePath, file.content);
      }),
    );

    timespan.finish('vue-next [end]');
  },
});
