import { BrowserFactory, BrowserOptionInterface, EngineFactory } from '@edit-trace/engine';

async function handler(event) {
  const body = event?.body;

  const shopEngine = await EngineFactory.build(body?.shopCode);
  const browserOptions: BrowserOptionInterface = EngineFactory.scan(shopEngine);

  const browser = await BrowserFactory.createBrowser(browserOptions);
  const product = await shopEngine.product(body?.targetUrl, browser);

  return {
    statusCode: 200,
    body: JSON.stringify({ product }),
  };
}
