import { Controller } from 'egg';
import Msg from '../service/Msg';
import Util from '../service/Util';

export default class PermissionController extends Controller {

  // 权限查询
  public async getPermission() {
    const { ctx } = this;
    const { robotId } = ctx.query;
    if (Util.emptyVaild(robotId)) return ctx.body = Msg.success([]);

    const filter: any = {
      relations: [ 'user' ],
      where: {
        robotId,
      },
      order: {
        createDate: 'DESC',
      },
    };
    const list = await ctx.repo.Permission.find(filter);

    const permissionList = list.map(e => {
      return {
        role: e.role,
        username: e.user.username,
      };
    });

    ctx.body = Msg.success(permissionList);
  }

  // 权限创建
  public async createPermission() {
    const { ctx } = this;
    const { robotId, username, role } = ctx.request.body;
    if (Util.emptyVaild(robotId, username, role)) return ctx.body = Msg.error('数据不能为空');

    // 判断用户是否存在
    const userInfo: any = await ctx.repo.User.findOne({ username });
    if (!userInfo) return ctx.body = Msg.error('用户不存在');

    // 判断权限是否存在
    const permissionInfo: any = await ctx.repo.Permission.findOne({ robotId, userId: userInfo.id, });
    if (permissionInfo) return ctx.body = Msg.error('权限已存在：' + permissionInfo.role);

    const params = {
      robotId,
      userId: userInfo.id,
      role,
    };

    await ctx.repo.Permission.save(params);
    ctx.body = Msg.success();
  }

  // 权限删除
  public async removePermission() {
    const { ctx } = this;
    const { robotId, username } = ctx.request.body;

    if (Util.emptyVaild(robotId, username)) return ctx.body = Msg.error('数据不能为空');

    const userInfo: any = await ctx.repo.User.findOne({ username });
    if (!userInfo) return ctx.body = Msg.error('用户不存在');
    if (userInfo.id === Util.getUserId(ctx)) return ctx.body = Msg.error('不可以删除自己');

    const params = {
      robotId,
      userId: userInfo.id,
    };
    await ctx.repo.Permission.delete(params);

    ctx.body = Msg.success();
  }

}
