import { Controller } from 'egg';
import Msg from '../service/Msg';
import Util from '../service/Util';

export default class UserController extends Controller {

  // 用户登录
  public async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (Util.emptyVaild(username, password)) return ctx.body = Msg.error('数据不能为空');

    const params = {
      username,
      password: Util.encryptString(password.trim()), // 密码md5加密
    };

    // 这里的登录，如果企业内部有用户API可以直接调用，因为其他接口需要用到userID，因此将内部用户id覆盖User表的id字段

    const userInfo = await ctx.repo.User.findOne(params);
    if (!userInfo) return ctx.body = Msg.error('用户名或密码错误');

    const { id, nickname } = userInfo;
    ctx.session.userId = id;
    ctx.body = Msg.success(nickname);
  }

  // 用户注册
  public async register() {
    const { ctx } = this;
    const { username, password, nickname } = ctx.request.body;
    if (Util.emptyVaild(username, password)) return ctx.body = Msg.error('数据不能为空');

    const userCount = await ctx.repo.User.count();

    const params = {
      nickname,
      username,
      password: Util.encryptString(password.trim()), // 密码md5加密
      isSuperAdmin: userCount === 0 ? true : false, // 第一位注册的为超级管理员
    };

    const userInfo = await ctx.repo.User.findOne({ username });
    if (userInfo) return ctx.body = Msg.error('用户名已存在');

    ctx.repo.User.save(params);
    ctx.body = Msg.success();
  }

  // 用户退出登录
  public async loginOut() {
    const { ctx } = this;
    ctx.session.userId = null;
    ctx.body = Msg.success();
  }
}
