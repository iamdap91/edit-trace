export class EngineInterface {
  product: (targetUrl, options) => Promise<unknown>;
}
