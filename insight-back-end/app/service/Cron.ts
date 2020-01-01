/**
 * 定时任务 Service
 */
import { Service } from 'egg';
const schedule = require('node-schedule');
import Workday from './Workday';

let taskList: any = {}; // 所有定时任务集合 任务ID和对应的调度对象

export default class Cron extends Service {
    /**
     * 创建任务
     * @param id 任务ID
     * @param cron cron表达式
     * @param isWorkday 是否是工作日
     */
    public async create(id: number, cron: string, isWorkday: boolean) {
        const { ctx } = this;

        // 判断机器人是否存在
        if (taskList[id]) {
            return;
        }

        const task = schedule.scheduleJob(cron, async () => {

            // 过滤掉不满足工作日（cron是每天执行）
            if (isWorkday && !Workday.getWorkday()) {
                return;
            }

            // 获取机器人ID
            const taskInfo: any = await ctx.repo.Task.findOne({ id });
            // 发送企业微信内容
            const sendStatus = await ctx.service.cron.sendWechart(taskInfo.robotId, taskInfo.msgType, taskInfo.msgContent, taskInfo.suite, '1', taskInfo.userId, taskInfo.id, taskInfo.remark);
            if (sendStatus) {
                ctx.logger.info(`任务ID：${id}，任务执行成功！`);
            } else {
                ctx.logger.info(`任务ID：${id}，任务执行失败！`);
            }
        });
        taskList[id] = task;
        ctx.logger.info(`任务ID：${id}，创建成功！`);
    }

    /**
     * 取消任务
     * @param id 任务ID
     * @param cron cron表达式
     */
    public cancel(id: number) {
        const { ctx } = this;

        if (taskList[id]) {
            taskList[id].cancel();
            delete taskList[id];
        }
        ctx.logger.info(`任务ID：${id}，取消成功！`);
    }

    /**
     * 取消某个机器人下面的所有任务
     * @param robotId 机器人ID
     */
    public async cancelRobotAll(robotId: number) {
        const { ctx } = this;

        // 查询所有task
        const list = await ctx.repo.Task.find({ where: { robotId } });
        for (const i of list) {
            ctx.service.cron.cancel(i.id);
        }
        return true;
    }

    /**
     * 发送企业微信
     */
    public async sendWechart(robotId: string, msgType: string, msgContent: string, suite: string = '', methond: string, userId: string, taskId: number, remark: string) {
        const { ctx } = this;
        let text: any = JSON.parse(msgContent);

        // 根据套件内容 定制化文本内容
        if (suite === 'suiteA') {
            text = await ctx.service.suite.suiteA(JSON.parse(msgContent));
        }

        // 查找企业微信机器人地址
        const filter: any = { id: robotId };
        const robotInfo = await ctx.repo.Robot.findOne(filter);
        if (!robotInfo) return false;

        // 日志参数
        const paramsLog: any = {
            robotId,
            taskId,
            userId,
            methond, // 0 手动 1 自动
            msgContent,
            msgType,
            remark,
        };

        // 发送企业微信消息
        const params = {
            msgtype: msgType,
            [msgType]: text,
        };
        let weichartInfo;
        try {
            weichartInfo = await ctx.curl(robotInfo.webhook, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(params),
            });
        } catch (error) {
            paramsLog.status = '0';
            await ctx.repo.Log.save(paramsLog);
            return false;
        }

        if (weichartInfo.data.errcode !== 0) {
            paramsLog.status = '0';
            await ctx.repo.Log.save(paramsLog);
            return false;
        }

        paramsLog.status = '1';
        await ctx.repo.Log.save(paramsLog);
        return true;
    }

    /**
     * 任务查询并执行
     */
    public async getTaskAndRun() {
        taskList = [];
        const { ctx } = this;
        const list = await ctx.repo.Task.find({ status: '1' });
        for (const i of list) {
            ctx.service.cron.create(i.id, i.cron, i.isWorkday);
        }
        return list;
    }

}
