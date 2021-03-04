// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCron from '../../../app/service/Cron';
import ExportMsg from '../../../app/service/Msg';
import ExportPermission from '../../../app/service/Permission';
import ExportSuite from '../../../app/service/Suite';
import ExportUtil from '../../../app/service/Util';
import ExportWorkday from '../../../app/service/Workday';

declare module 'egg' {
  interface IService {
    cron: AutoInstanceType<typeof ExportCron>;
    msg: AutoInstanceType<typeof ExportMsg>;
    permission: AutoInstanceType<typeof ExportPermission>;
    suite: AutoInstanceType<typeof ExportSuite>;
    util: AutoInstanceType<typeof ExportUtil>;
    workday: AutoInstanceType<typeof ExportWorkday>;
  }
}
