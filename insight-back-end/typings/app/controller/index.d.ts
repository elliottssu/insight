// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHtml = require('../../../app/controller/html');
import ExportLog from '../../../app/controller/log';
import ExportPermission from '../../../app/controller/permission';
import ExportRobot from '../../../app/controller/robot';
import ExportTask from '../../../app/controller/task';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    html: ExportHtml;
    log: ExportLog;
    permission: ExportPermission;
    robot: ExportRobot;
    task: ExportTask;
    user: ExportUser;
  }
}
