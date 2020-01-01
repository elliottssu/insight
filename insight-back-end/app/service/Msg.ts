/**
 * 消息 Service
 */
export default class Msg {

    /**
     * 成功
     * @param data
     * @param msg
     * @param code
     */
    static success(data: any= '', msg: string = 'success', code: number = 0) {
        return {
            code,
            data,
            msg,
        };
    }

    /**
     * 失败
     * @param msg
     * @param data
     * @param code
     */
    static error(msg: string = 'error', data: string= '', code: number = 1) {
        return {
            code,
            data,
            msg,
        };
    }
}
