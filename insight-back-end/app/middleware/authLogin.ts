/**
 * 登录拦截器
 */
import Util from '../service/Util';

module.exports = () => {
    return async function authLogin(ctx, next) {
        if (Util.getUserId(ctx)) return await next();
        ctx.status = 403;
    };
};
