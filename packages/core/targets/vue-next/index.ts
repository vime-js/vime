import path from 'path';
import { OutputTargetCustom } from '@stencil/core/internal';
import { sortComponents } from '../targetHelpers';
import { generateVueNextFiles } from './generateVueNextFiles';

const OUTPUT_DIR = path.resolve(__dirname, '../../../vue-next/src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components/index.ts');

export const vueNextOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'vue-next-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('generate vue-next started', true);

    const output = await generateVueNextFiles(sortComponents(buildCtx.components));

    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);

    await Promise.all(output.components.map((file) => {
      const filePath = path.resolve(OUTPUT_DIR, 'components', `${file.name}.ts`);
      return compilerCtx.fs.writeFile(filePath, file.content);
    }));

    timespan.finish('generate vue-next finished');
  },
});
