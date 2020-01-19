/**
 * robot store
 */

import { action, observable } from 'mobx';
import { RobotService } from '../services';

class RobotStore {
  @observable robotInfo = {};

  @observable robotList = [];

  @observable selectedRobotId = 0;

  @observable isLoadingRobot = true; // 是否在加载机器人

  @observable isInitRobot = false; // 是否初始化机器人完成

  @observable isModelCreateVisable = false;

  @observable isModelEditVisable = false;

  // 获取robot
  @action getRobotList = () => {
    return new Promise((resolve) => {
      RobotService.getRobot().then((result) => {
        if (result.data.code !== 0) return;
        const robotList = result.data.data;
        let selectedRobotId = localStorage.getItem('selectedRobotId');
        if (!selectedRobotId) {
          selectedRobotId = robotList.length ? robotList[0].id : 0;
          localStorage.setItem('selectedRobotId', String(selectedRobotId));
        }

        selectedRobotId = Number(selectedRobotId);
        const robotInfo = robotList.find((e) => { return e.id === selectedRobotId; }) || {};

        this.isLoadingRobot = false;
        this.isInitRobot = true;
        this.robotInfo = robotInfo;
        this.selectedRobotId = selectedRobotId;
        this.robotList = robotList;

        resolve(robotInfo);
      });
    });
  }

  // 显示模态框
  @action showModelCreate = () => {
    this.isModelCreateVisable = true;
  }

  @action showModelEdit = () => {
    this.isModelEditVisable = true;
  }

  // 隐藏模态框
  @action handleCancel = () => {
    this.isModelCreateVisable = false;
    this.isModelEditVisable = false;
  };
}

export default new RobotStore();
