/**
 * http请求的统一出口
 */
import axios from 'axios';

// 处理统一处理
axios.interceptors.request.use(
  (request) => {
    const selectedRobotId = localStorage.getItem('selectedRobotId') || '';
    if (selectedRobotId) {
      request.headers.robot = selectedRobotId;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 未登陆重定向登陆页面
    if (error.response.status === 403) {
      window.location.href = '/login';
    }
    // 没有权限
    if (error.response.status === 401) {
      console.log('暂无权限');
      localStorage.removeItem('selectedRobotId');
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default axios;
