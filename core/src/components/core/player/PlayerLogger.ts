import { isUndefined } from '../../../utils/unit';

export class Logger {
  public silent = false;

  log(...args: any[]) {
    if (!this.silent && !isUndefined(console)) console.log('[Vime tip]:', ...args);
  }

  warn(...args: any[]) {
    if (!this.silent && !isUndefined(console)) console.error('[Vime warn]:', ...args);
  }
}
