import { OutputTargetCustom } from '@stencil/core/internal';
import path from 'path';

import { sortComponents } from '../../../src/utils/target';
import { generateReactFiles } from './generateReactFiles';

const OUTPUT_DIR = path.resolve(__dirname, '../src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components/index.ts');

export const reactOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'react-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('react [start]', true);

    const output = await generateReactFiles(
      sortComponents(buildCtx.components),
    );

    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);

    await Promise.all(
      output.components.map(file => {
        const filePath = path.resolve(
          OUTPUT_DIR,
          'components',
          `${file.name}.tsx`,
        );
        return compilerCtx.fs.writeFile(filePath, file.content);
      }),
    );

    timespan.finish('react [end]');
  },
});
