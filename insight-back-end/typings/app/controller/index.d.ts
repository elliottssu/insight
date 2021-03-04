// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLog from '../../../app/controller/log';
import ExportPermission from '../../../app/controller/permission';
import ExportRobot from '../../../app/controller/robot';
import ExportTask from '../../../app/controller/task';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    log: ExportLog;
    permission: ExportPermission;
    robot: ExportRobot;
    task: ExportTask;
    user: ExportUser;
  }
}
