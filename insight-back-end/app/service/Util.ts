/**
 * 工具 Service
 */
const crypto = require('crypto');

export default class Util {

    /**
     * 非空验证
     * @param ...args 传入需要验证的个数
     */
    static emptyVaild(...args) {
        let empty = false;
        for (const e of args) {
            if (e !== 0 && !e && e !== false) {
                empty = true;
                break;
            }
        }
        return empty;
    }

    /**
     * 获取缓存中的用户ID
     * @param ctx 对象
     */
    static getUserId(ctx: any) {
        return ctx.session.userId;
    }

    /**
     * 加密字符串，MD5 hash
     * @param str 字符串
     */
    static encryptString(str: string) {
        const md5 = crypto.createHash('md5');
        const newStr = md5.update(str).digest('hex');
        return newStr;
    }
}
