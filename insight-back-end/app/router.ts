import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  const authLogin = app.middleware.authLogin();
  const authPermission = app.middleware.authPermission();

  router.post('/api/user/login', controller.user.login);              // 用户登录
  router.post('/api/user/register', controller.user.register);        // 用户注册
  router.post('/api/user/loginOut', controller.user.loginOut);        // 用户登录

  router.get('/api/robot/getRobot', authLogin, controller.robot.getRobot);             // 机器人查询
  router.post('/api/robot/createRobot', authLogin, controller.robot.createRobot);      // 机器人创建
  router.post('/api/robot/updataRobot', authLogin, authPermission, controller.robot.updataRobot);      // 机器人修改
  router.post('/api/robot/removeRobot', authLogin, authPermission, controller.robot.removeRobot);      // 机器人删除

  router.get('/api/task/getTask', authLogin, authPermission, controller.task.getTask);                 // 任务查询
  router.post('/api/task/createMessage', authLogin, authPermission, controller.task.createMessage);    // 任务创建即时消息
  router.post('/api/task/createTask', authLogin, authPermission, controller.task.createTask);          // 任务创建定时消息
  router.post('/api/task/updateTask', authLogin, authPermission, controller.task.updateTask);          // 任务修改
  router.post('/api/task/removeTask', authLogin, authPermission, controller.task.removeTask);          // 任务删除

  router.get('/api/log/getLog', authLogin, authPermission, controller.log.getLog);                     // 日志查询

  router.get('/api/permission/getPermission', authLogin, authPermission, controller.permission.getPermission);                     // 权限查询
  router.post('/api/permission/createPermission', authLogin, authPermission, controller.permission.createPermission);              // 权限创建
  router.post('/api/permission/removePermission', authLogin, authPermission, controller.permission.removePermission);              // 权限删除
};
