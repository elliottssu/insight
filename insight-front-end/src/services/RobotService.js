/**
 * robot service
 */
import dataProxy from '../dataProxy';

export default {
  // 机器人查询
  getRobot(params) {
    return new Promise((resolve, reject) => {
      dataProxy.get(`${process.env.REACT_APP_URL}/api/robot/getRobot`, { params }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 机器人创建
  createRobot(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/robot/createRobot`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 机器人修改
  updataRobot(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/robot/updataRobot`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 机器人删除
  removeRobot(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/robot/removeRobot`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
