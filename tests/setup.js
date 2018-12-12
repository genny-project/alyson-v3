/* global jest */

global.__DEV__ = true;

jest.mock( '../src/utils/payments/assemblyHtmlBridge.html', () => '' );
