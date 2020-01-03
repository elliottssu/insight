/**
 * task service
 */
import dataProxy from '../dataProxy';

export default {
  // 任务查询
  getTask(params) {
    return new Promise((resolve, reject) => {
      dataProxy.get(`${process.env.REACT_APP_URL}/api/task/getTask`, { params }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 任务创建即时消息
  createMessage(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/task/createMessage`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 任务创建定时消息
  createTask(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/task/createTask`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 任务修改
  updateTask(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/task/updateTask`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 任务删除
  removeTask(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/task/removeTask`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
