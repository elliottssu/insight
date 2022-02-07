/**
 * task store
 */

import { action, observable } from 'mobx';

import { TaskService } from '../services';

class TaskStore {
  @observable taskList = [];

  @observable hourValue = '00' // 时间——小时

  @observable minuteValue = '00' // 时间——分钟

  @observable secondValue = '00' // 时间——秒

  @observable weekList = [] // 时间——周

  @observable msgTypeValue = 'text' // 消息类型

  @observable mentionTypeValue = '0' // 提醒类型

  @observable publishCron = '' // 发布cron表达式

  @observable publishCronText = '' // 发布cron表达式解释

  @observable publishIsWorkday = false // 发布是否是工作日

  @observable publishIsCustomizeCron = false // 发布是否自定义cron表达式

  @observable publishCustomizeCron = '' // 发布自定义cron表达式

  @observable publishModel = 0 // 发布模式 0: 即时消息 1:定时消息

  @observable publishMentionValue = '' // 发布提醒列表字段

  @observable publishTextContent = '' // 发布文本内容

  @observable publishMarkdownContent = '' // 发布Markdown内容

  @observable publishImageBase65 = '' // 发布图片base64

  @observable publishImageMd5 = '' // 发布图片MD5

  @observable publishNewsTitle = '' // 发布图文标题

  @observable publishNewsDescription = '' // 发布图文描述

  @observable publishNewsUrl = '' // 发布图文点击后跳转的链接

  @observable publishNewsPicurl = '' // 发布图文图文消息的图片链接


  // 获取任务列表
  @action getTaskList = (params) => {
    TaskService.getTask(params).then((result) => {
      if (result.data.code !== 0) return;
      this.taskList = result.data.data;
    });
  }

  // 拼接cron表达式
  @action getCron = () => {
    let publishCronText = '';
    let publishCron = '';
    const time = `${this.hourValue}:${this.minuteValue}:${this.secondValue}`;
    publishCron = `${this.minuteValue} ${this.hourValue}`;
    this.weekList = this.weekList.sort();

    // 处理cron
    if (this.weekList.length === 0) {
      publishCron += ` ${(new Date()).getDate()} ${(new Date()).getMonth() + 1} *`;
    } else if (this.weekList.length === 7) {
      publishCron += ' * * *';
    } else {
      publishCron += ` * * ${this.weekList.join(',')}`;
    }

    if (this.weekList.length === 0) {
      publishCronText = `今天 ${time} 执行一次`;
    } else if (this.weekList.length === 7) {
      publishCronText = `每天 ${time} 执行`;
    } else if (this.weekList.length === 2 && this.weekList.includes('6') && this.weekList.includes('7')) {
      publishCronText = `每个周末 ${time} 执行`;
    } else {
      const week = [];
      let weekText = '';

      const weekOption = [{ value: '7', label: '日' }, { value: '1', label: '一' }, { value: '2', label: '二' }, { value: '3', label: '三' }, { value: '4', label: '四' }, { value: '5', label: '五' }, { value: '6', label: '六' }];

      // 连续整数
      if (this.weekList.length > 2
        && this.weekList.length - 1 === this.weekList[this.weekList.length - 1] - this.weekList[0]) {
        const weekJoin = [this.weekList[0], this.weekList[this.weekList.length - 1]];
        weekJoin.forEach((e) => {
          const { label } = weekOption.find((i) => { return i.value === e; });
          week.push(`周${label}`);
          weekText = week.join('至');
        });
      } else {
        this.weekList.forEach((e) => {
          const { label } = weekOption.find((i) => { return i.value === e; });
          week.push(`周${label}`);
        });
        weekText = week.join('、');
      }

      publishCronText = `每个 ${weekText} ${time} 执行`;
    }

    // 开启工作日模式（cron调整为每天执行，在后台逻辑过滤掉假期）
    if (this.publishIsWorkday) {
      publishCron = `${this.minuteValue} ${this.hourValue} * * *`;
      publishCronText = `每个工作日 ${time} 执行`;
    }

    // 开启自定义cron表达式模式（前端输入自定义cron表达式）
    if (this.publishIsCustomizeCron) {
      publishCron = this.publishCustomizeCron;
      publishCronText = `按自定义cron表达式${publishCron}执行`;
    }

    this.publishCron = publishCron;
    this.publishCronText = publishCronText;
  }

  // 选择发布模式
  @action selectModel = (index) => {
    this.publishModel = index;
  };

  // 重置发布内容(部分)
  @action resetPublish = () => {
    this.hourValue = '00';
    this.minuteValue = '00';
    this.secondValue = '00';
    this.weekList = [];

    // this.mentionTypeValue = '0'; // 发布成功后保留状态
    this.publishCron = '';
    this.publishCronText = '';
    this.publishIsWorkday = false;
    this.publishIsCustomizeCron = false;
    this.publishCustomizeCron = '';

    this.publishMentionValue = '';
    this.publishTextContent = '';
    this.publishMarkdownContent = '';
    this.publishImageBase65 = '';
    this.publishImageMd5 = '';
    this.publishNewsTitle = '';
    this.publishNewsDescription = '';
    this.publishNewsUrl = '';
    this.publishNewsPicurl = '';

    this.getCron();
  }

  // 重置内容(全部)
  @action resetAll = () => {
    this.resetPublish();
    this.publishModel = 0;
    this.msgTypeValue = 'text';
  }

  // 星期下拉变化
  @action handleWeekChange = (week) => {
    const weekIndex = this.weekList.indexOf(week);
    if (weekIndex > -1) {
      this.weekList.splice(weekIndex, 1);
    } else {
      this.weekList.push(week);
    }

    // 更新星期  则重置工作日
    this.publishIsWorkday = false;
    this.getCron();
  };


  // 处理通用文本类数据变化
  @action handleTextChange = (name, e) => {
    const content = (e.target.value).trim();
    this[name] = content;

    if (name === 'publishCustomizeCron') {
      this[name] = e.target.value;
      this.getCron();
    }
  }

  // 处理通用下拉类数据变化
  @action handleDropdownChange = (name, value) => {
    this[name] = value;

    // 选择时间重置corn表达式
    if (name === 'hourValue' || name === 'minuteValue' || name === 'secondValue') {
      this.getCron();
    }
  }

  // 处理通用开关类数据变化
  @action handleSwitchChange = (name, value) => {
    this[name] = value;
    // 更新工作日 则重置星期
    if (name === 'publishIsWorkday') {
      this.weekList = [];
    }
    this.getCron();
  }
}

export default new TaskStore();
