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

    /**
     * 针对天气API进行特殊化处理
     * @param msgContent 消息体
     */
    public async suiteB(msgContent) {
        const ctx = this.ctx;
        const Msg = ctx.model.Msg;
        //发起请求 TextApiValue地址
      var result = await  ctx.curl('https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=28459496%20&appsecret=3LLEHtTQ',{
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      if(result.status == 200||202||201){
        //
        //msgContent处理成json
        msgContent = JSON.parse(msgContent);
        //赋值给msgContent
        msgContent.content = `时间：${result.data.date} ${result.data.week} \n天气：${result.data.wea}  \n风力：${result.data.wind} \n湿度：${result.data.humidity} \n空气质量：${result.data.air_tips}`;
        // msgContent.content = result.data.toString();
        msgContent = JSON.stringify(msgContent);
      }else{
        return ctx.body = Msg.error('天气API请求失败');
      }
        return msgContent;
    }
}
