export class EngineFactory {
  static async build(shopCode: string) {
    const engineModule = await import(`./${shopCode}/index`);
    return engineModule['default'];
  }
}
