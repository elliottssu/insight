// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthLogin from '../../../app/middleware/authLogin';
import ExportAuthPermission from '../../../app/middleware/authPermission';

declare module 'egg' {
  interface IMiddleware {
    authLogin: typeof ExportAuthLogin;
    authPermission: typeof ExportAuthPermission;
  }
}
