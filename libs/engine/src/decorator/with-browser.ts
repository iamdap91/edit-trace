import { WITH_BROWSER_META_DATA } from '../constants';

export function WithBrowser(options?): MethodDecorator {
  return function (target) {
    Reflect.defineProperty(target, WITH_BROWSER_META_DATA, {
      configurable: true,
      enumerable: true,
      value: { ...options } || {},
      writable: false,
    });
  };
}
