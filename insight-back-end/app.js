// app.js
const schedule = require('node-schedule');

class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didReady() {
        const ctx = await this.app.createAnonymousContext();
        const n1 = await ctx.service.cron.getTaskAndRun();
        ctx.logger.info(`################################## 定时任务加载完成！, 本次加载 ${n1.length}个任务`);
    }
}

module.exports = AppBootHook;