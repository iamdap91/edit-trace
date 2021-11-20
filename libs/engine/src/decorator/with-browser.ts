import { WITH_BROWSER_META_DATA } from '../constants';
import { BrowserOptionInterface } from '../interfaces';

export function WithBrowser(options?: BrowserOptionInterface): MethodDecorator {
  return function (target) {
    Reflect.defineProperty(target, WITH_BROWSER_META_DATA, {
      configurable: true,
      enumerable: true,
      value: { ...options } || {},
      writable: false,
    });
  };
}
