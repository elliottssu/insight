/**
 * 定制Task套件 Suite
 * 套件使用规范：
 * 1. 创建task的在suite添加“SuiteA”
 * 2. 在发送消息处拦截处理名为“SuiteA”套件
 * 3. 只有定时任务支持套件，即套件绑定是和任务绑定的
 */
import { Service } from 'egg';

export default class Suite extends Service {
    /**
     * 延迟1s执行（示例，这里可以对消息体操作，支持await）
     * @param msgContent 消息体
     */
    public async suiteA(msgContent) {
        const timeout = ms => new Promise(res => setTimeout(res, ms));
        await timeout(1000);
        return msgContent;
    }
}
