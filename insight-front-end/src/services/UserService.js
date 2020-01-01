/**
 * user service
 */
import dataProxy from '../dataProxy';

export default {
  // 用户登录
  login(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/user/login`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 用户注册
  register(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/user/register`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 用户退出登录
  loginOut(params) {
    return new Promise((resolve, reject) => {
      dataProxy.post(`${process.env.REACT_APP_URL}/api/user/loginOut`, params).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
