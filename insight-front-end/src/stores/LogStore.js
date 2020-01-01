/**
 * log store
 */

import { action, observable } from 'mobx';
import { LogService } from '../services';

class LogStore {
  @observable logList = [];

  // 获取日志
  @action getLogList = (params) => {
    LogService.getLog(params).then((result) => {
      if (result.data.code !== 0) return;
      this.logList = result.data.data;
    });
  }
}

export default new LogStore();
