import { basicBuild } from '../../rollup';

const name = 'preview';

export default basicBuild({ name, hasLite: false });