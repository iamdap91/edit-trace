import { BrowserOptionInterface, EngineInterface } from '../interfaces';
import { WITH_BROWSER_META_DATA } from '../constants';

export class EngineFactory {
  static async build(shopCode: string): Promise<EngineInterface> {
    const engineModule = await import(`../${shopCode}/index`);

    const engine = new engineModule['default']();
    if (!engine) {
      throw new Error('엔진 생성 실패');
    }

    return engine;
  }

  static scan(instance: EngineInterface): BrowserOptionInterface {
    return Reflect.get(instance, WITH_BROWSER_META_DATA);
  }
}
