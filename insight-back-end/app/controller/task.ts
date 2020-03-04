import { Controller } from 'egg';
import Msg from '../service/Msg';
import Util from '../service/Util';

export default class RobotController extends Controller {

  // 任务查询
  public async getTask() {
    const { ctx } = this;
    const { robotId } = ctx.query;
    if (Util.emptyVaild(robotId)) return ctx.body = Msg.success([]);

    const list = await ctx.repo.Task.find({
      where: { robotId },
    });
    ctx.body = Msg.success(list);
  }

  // 任务创建即时消息
  public async createMessage() {
    const { ctx } = this;
    const { robotId, msgType, msgContent, remark, suite } = ctx.request.body;
    if (Util.emptyVaild(robotId, msgType, msgContent)) return ctx.body = Msg.error('数据不能为空');

    let sendStatus;
    try {
      sendStatus = await ctx.service.cron.sendWechart(robotId, msgType, msgContent, suite, '0', Util.getUserId(ctx), -1, remark);
    } catch (error) {
      return ctx.body = Msg.error('消息发送成功但是写入数据库失败，可能是内容太长了');
    }

    if (!sendStatus) return ctx.body = Msg.error('API调用异常');

    ctx.body = Msg.success();
  }

  // 任务创建定时消息
  public async createTask() {
    const { ctx } = this;
    const { robotId, msgType, msgContent, suite, remark, cron, cronText, isWorkday } = ctx.request.body;
    if (Util.emptyVaild(robotId, msgType, msgContent, cron, cronText, isWorkday)) return ctx.body = Msg.error('数据不能为空');
    if (!isWorkday && Util.emptyVaild(cron, cronText)) return ctx.body = Msg.error('数据不能为空');

    const params = {
      userId: Util.getUserId(ctx),
      robotId, msgType, msgContent, cron, cronText, isWorkday,
      status: '1',
      suite: suite || '',
      remark: remark || '',
    };

    let taskInfo;
    try {
      taskInfo = await ctx.repo.Task.save(params);
    } catch (error) {
      return ctx.body = Msg.error('创建任务失败，请检查输入内容是否合适');
    }

    // 加入任务调度
    ctx.service.cron.create(taskInfo.id, taskInfo.cron, taskInfo.isWorkday);

    ctx.body = Msg.success();
  }

  // 任务修改
  public async updateTask() {
    const { ctx } = this;
    const { taskId, status } = ctx.request.body;
    if (Util.emptyVaild(taskId, status)) return ctx.body = Msg.error('数据不能为空');

    const filter = {
      id: taskId,
    };
    const params = {
      status,
    };
    await ctx.repo.Task.update(filter, params);

    // 修改任务调度（先删除，再加入）
    if (status === '1') {
      const taskInfo: any = await ctx.repo.Task.findOne(filter);
      ctx.service.cron.cancel(taskId);
      ctx.service.cron.create(taskInfo.id, taskInfo.cron, taskInfo.isWorkday);
    } else {
      ctx.service.cron.cancel(taskId);
    }
    ctx.body = Msg.success();
  }

  // 任务删除
  public async removeTask() {
    const { ctx } = this;
    const { taskId } = ctx.request.body;
    const filter = {
      id: taskId,
    };
    await ctx.repo.Task.delete(filter);

    // 删除任务调度
    ctx.service.cron.cancel(taskId);

    ctx.body = Msg.success();
  }

}
