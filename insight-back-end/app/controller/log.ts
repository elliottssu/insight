import { Controller } from 'egg';
import Msg from '../service/Msg';
import Util from '../service/Util';

export default class LogController extends Controller {

  // 日志查询
  public async getLog() {
    const { ctx } = this;
    const { robotId } = ctx.query;
    if (Util.emptyVaild(robotId)) return ctx.body = Msg.success([]);

    const filter: any = {
      where: { robotId },
      order: {
        createDate: 'DESC',
      },
      take: 5,
    };
    const list = await ctx.repo.Log.find(filter);
    ctx.body = Msg.success(list);
  }

}
