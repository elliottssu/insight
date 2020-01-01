// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCron from '../../../app/service/Cron';
import ExportMsg from '../../../app/service/Msg';
import ExportPermission from '../../../app/service/Permission';
import ExportSuite from '../../../app/service/Suite';
import ExportUtil from '../../../app/service/Util';
import ExportWorkday from '../../../app/service/Workday';

declare module 'egg' {
  interface IService {
    cron: ExportCron;
    msg: ExportMsg;
    permission: ExportPermission;
    suite: ExportSuite;
    util: ExportUtil;
    workday: ExportWorkday;
  }
}
