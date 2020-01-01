import { Controller } from 'egg';
import { Not } from 'typeorm';
import Msg from '../service/Msg';
import Util from '../service/Util';

export default class RobotController extends Controller {

  // 机器人查询
  public async getRobot() {
    const { ctx } = this;
    let robotList = await ctx.repo.Robot.find();

    const userId = Util.getUserId(ctx);
    const userInfo: any = await ctx.repo.User.findOne({ id: userId });
    const permissionList = await ctx.repo.Permission.find({ userId });

    robotList.forEach(async (robotInfo: any) => {
      robotInfo.role = ctx.service.permission.getPermission(userInfo, permissionList, robotInfo); // 更新权限
      if (robotInfo.role !== 'admin') {
        delete robotInfo.webhook;
      }
    });

    robotList = robotList.filter((e: any) => e.role !== 'none');

    ctx.body = Msg.success(robotList);
  }

  // 机器人创建
  public async createRobot() {
    const { ctx } = this;
    const { name, description, webhook, status } = ctx.request.body;

    if (Util.emptyVaild(name, description, webhook, status)) return ctx.body = Msg.error('数据不能为空');

    if (name.length > 6) return ctx.body = Msg.error('名字太长，最多6个字符');
    const infoName = await ctx.repo.Robot.findOne({ name });
    if (infoName) return ctx.body = Msg.error('机器人名已存在，换一个吧');
    const infoHook = await ctx.repo.Robot.findOne({ webhook });
    if (infoHook) return ctx.body = Msg.error('webhook已存在，换一个吧');

    const params = {
      userId: Util.getUserId(ctx),
      name,
      description,
      webhook,
      status,
    };

    // 写入机器人
    const infoRobot = await ctx.repo.Robot.save(params);

    // 写入权限，创建者默认为管理员
    const paramsP = {
      robotId: infoRobot.id,
      userId: infoRobot.userId,
      role: 'admin',
    };
    await ctx.repo.Permission.save(paramsP);

    ctx.body = Msg.success();
  }

  // 机器人修改
  public async updataRobot() {
    const { ctx } = this;

    const { id, name, description, webhook, status } = ctx.request.body;
    if (Util.emptyVaild(name, description, webhook, status)) return ctx.body = Msg.error('数据不能为空');

    // 判断机器人名称，除了本条记录是否和其他重复
    const robotInfoName = await ctx.repo.Robot.findOne({ id: Not(id), name });
    if (robotInfoName) return ctx.body = Msg.error('名称已经占用，换一个名字吧');

    // 判断webhook是否存在，除了本条记录是否和其他重复
    const robotInfoWebhook = await ctx.repo.Robot.findOne({ id: Not(id), webhook });
    if (robotInfoWebhook) return ctx.body = Msg.error('Webhook地址已经占用，换一个吧');

    const params = {
      name,
      description,
      webhook,
      status,
    };

    await ctx.repo.Robot.update({ id }, params);

    ctx.body = Msg.success();
  }

  // 机器人删除
  public async removeRobot() {
    const { ctx } = this;
    const { robotId } = ctx.request.body;
    if (Util.emptyVaild(robotId)) return ctx.body = Msg.error('数据不能为空');

    await ctx.repo.Robot.delete({ id: robotId });   // 删除Robot
    await ctx.service.cron.cancelRobotAll(robotId); // 删除任务调度
    await ctx.repo.Task.delete({ robotId });        // 删除Task
    await ctx.repo.Log.delete({ robotId });         // 删除Log
    await ctx.repo.Permission.delete({ robotId });  // 删除permission

    ctx.body = Msg.success();
  }

}
