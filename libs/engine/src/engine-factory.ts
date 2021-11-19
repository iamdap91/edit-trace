import { EngineInterface } from './interfaces';

export class EngineFactory {
  static async build(shopCode: string): Promise<EngineInterface> {
    const engineModule = await import(`./${shopCode}/index`);

    const engine = new engineModule['default']();
    if (!engine) {
      throw new Error('엔진 생성 실패');
    }

    return engine;
  }
}
