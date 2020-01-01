/**
 * log service
 */
import dataProxy from '../dataProxy';

export default {
  // 任务查询
  getLog(params) {
    return new Promise((resolve, reject) => {
      dataProxy.get(`${process.env.REACT_APP_URL}/api/log/getLog`, { params }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
