/**
 * permission service
 */
import dataProxy from '../dataProxy';

export default {
  // 权限查询
  getPermission(params) {
    return new Promise((resolve, reject) => {
      dataProxy.get(`${process.env.REACT_APP_URL}/api/permission/getPermission`, { params }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 权限创建
  createPermission(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/permission/createPermission`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 权限删除
  removePermission(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/permission/removePermission`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
