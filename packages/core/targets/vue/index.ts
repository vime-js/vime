import path from 'path';
import { OutputTargetCustom } from '@stencil/core/internal';
import { sortComponents } from '../targetHelpers';
import { generateVueFiles } from './generateVueFiles';

const OUTPUT_DIR = path.resolve(__dirname, '../../../vue/src');
const PROXIES_FILE = path.resolve(OUTPUT_DIR, 'components/index.ts');

export const vueOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'vue-library',
  async generator(_, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan('generate vue started', true);

    const output = await generateVueFiles(sortComponents(buildCtx.components));

    await compilerCtx.fs.writeFile(PROXIES_FILE, output.entry);

    await Promise.all(output.components.map((file) => {
      const filePath = path.resolve(OUTPUT_DIR, 'components', `${file.name}.ts`);
      return compilerCtx.fs.writeFile(filePath, file.content);
    }));

    timespan.finish('generate vue finished');
  },
});
