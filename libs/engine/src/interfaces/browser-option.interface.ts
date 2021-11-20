import { BrowserLaunchArgumentOptions, LaunchOptions } from 'puppeteer';

export interface BrowserOptionInterface extends LaunchOptions, BrowserLaunchArgumentOptions {
  fastMode?: boolean;
}
