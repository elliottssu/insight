/**
 * 权限拦截器
 */
import Util from '../service/Util';

// 只读白名单路由
const authPermissionNoneRouter = [
    '/api/task/getTask',
    '/api/log/getLog', ];

module.exports = () => {
    return async function authPermission(ctx, next) {

        const userId = Util.getUserId(ctx);
        const robotId = ctx.request.header.robot;
        if (!robotId) return false;
        const robotInfo = await ctx.repo.Robot.findOne({ id: Number(robotId) });
        if (!robotInfo) return false;
        const userInfo: any = await ctx.repo.User.findOne({ id: userId });
        const permissionList = await ctx.repo.Permission.find({ userId });
        const role = ctx.service.permission.getPermission(userInfo, permissionList, robotInfo);

        // 管理员开放所有接口
        if (role === 'admin') return await next();

        // 只读 只允许白名单
        if (role === 'readonly') {
            const url = ctx.request.url.split('?')[0];
            const isAuth = authPermissionNoneRouter.some(e => url.indexOf(e) > -1);
            if (isAuth) return await next();
        }

        ctx.status = 401;
    };
};
