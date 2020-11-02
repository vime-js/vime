import path from 'path';
import { OutputTargetCustom } from '@stencil/core/internal';
import { generateReactFiles } from './generateReactFiles';
import { sortComponents } from '../targetHelpers';

const OUTPUT_DIR = path.resolve(__dirname, '../../../react/src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components.ts');

export const reactOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'react-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('generate react started', true);

    const output = await generateReactFiles(sortComponents(buildCtx.components));

    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);

    await Promise.all(output.components.map((file) => {
      const filePath = path.resolve(OUTPUT_DIR, 'components', `${file.name}.tsx`);
      return compilerCtx.fs.writeFile(filePath, file.content);
    }));

    timespan.finish('generate react finished');
  },
});
