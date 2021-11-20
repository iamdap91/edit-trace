export class EngineInterface {
  product: (targetUrl, browser) => Promise<unknown>;
}
