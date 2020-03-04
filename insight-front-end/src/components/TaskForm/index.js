/**
 * 任务表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select, Input, Button } from 'antd';
import { TaskService } from '../../services';
import MsgText from './MsgText';
import MsgMarkdown from './MsgMarkdown';
import MsgImage from './MsgImage';
import MsgNews from './MsgNews';
import Timing from './Timing';
import Tab from '../Tab';

import './index.less';

const { Option } = Select;
const { TextArea } = Input;

// 提醒类型下拉配置
const mentionTypeOption = [
  { value: '0', label: '只发消息' },
  { value: '1', label: '@所有人' },
  { value: '2', label: '@指定人' },
];

@inject('TaskStore', 'LogStore', 'TaskStore', 'RobotStore', 'CommonStore')
@observer
class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSendLoading: false,
      isTaskLoading: false,
    };
  }


  // 提交发布表单 暂时默认使用文本
  handleSubmit = () => {
    const { robotInfo } = this.props.RobotStore;
    const {
      msgTypeValue, mentionTypeValue,
      publishModel, publishMentionValue,
      publishCron, publishCronText, publishIsWorkday,
      publishTextContent,
      publishMarkdownContent,
      publishImageBase65, publishImageMd5,
      publishNewsTitle, publishNewsDescription, publishNewsUrl, publishNewsPicurl,
    } = this.props.TaskStore;

    const publishMentionList = publishMentionValue.split(',');

    // 校验手机号空
    if (mentionTypeValue === '2' && !publishMentionList.length) {
      this.props.CommonStore.alertMessage('error', '手机号不能为空喔');
      return;
    }

    // 校验手机号格式
    const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    const isValid = publishMentionList.every((e) => { return reg.test(e); });
    if (mentionTypeValue === '2' && !isValid) {
      this.props.CommonStore.alertMessage('error', '手机号格式不对，您再检查检查');
      return;
    }

    // 生成提醒
    let mentionedMobileList = [];
    if (mentionTypeValue === '1') {
      mentionedMobileList = ['@all'];
    } else if (mentionTypeValue === '2') {
      mentionedMobileList = publishMentionList;
    }

    let msgContentObj = {}; // 消息体
    let remark = ''; // 备注

    if (msgTypeValue === 'text') {
      // 内容为空
      if (!publishTextContent) { this.props.CommonStore.alertMessage('error', '写点内容吧'); return; }
      // 内容短
      if (publishTextContent.length < 3) { this.props.CommonStore.alertMessage('error', '内容字数太短，至少写3个字'); return; }

      msgContentObj = {
        content: publishTextContent,
        mentioned_mobile_list: mentionedMobileList,
      };
      remark = publishTextContent;
    } else if (msgTypeValue === 'markdown') {
      // 内容为空
      if (!publishMarkdownContent) { this.props.CommonStore.alertMessage('error', '写点内容吧'); return; }
      // 内容短
      if (publishMarkdownContent.length < 3) { this.props.CommonStore.alertMessage('error', '内容字数太短，至少写3个字'); return; }

      msgContentObj = {
        content: publishMarkdownContent,
      };
      remark = publishMarkdownContent;
    } else if (msgTypeValue === 'image') {
      // 内容为空
      if (!publishImageBase65 || !publishImageMd5) { this.props.CommonStore.alertMessage('error', '请填写图片内容'); return; }

      msgContentObj = {
        base64: publishImageBase65,
        md5: publishImageMd5,
      };
      remark = '图片类型';
    } else if (msgTypeValue === 'news') {
      // 内容为空
      if (!publishNewsTitle) { this.props.CommonStore.alertMessage('error', '写点标题吧'); return; }
      if (!publishNewsUrl) { this.props.CommonStore.alertMessage('error', '跳转链接不能为空喔'); return; }

      msgContentObj = {
        articles: [
          {
            title: publishNewsTitle,
            description: publishNewsDescription,
            url: publishNewsUrl,
            picurl: publishNewsPicurl,
          },
        ],
      };

      remark = publishNewsTitle;
    }


    const params = {
      robotId: robotInfo.id,
      msgType: msgTypeValue,
      msgContent: JSON.stringify(msgContentObj),
      remark,
    };

    const paramsText = {
      robotId: robotInfo.id,
      msgType: 'text',
      msgContent: JSON.stringify({
        content: '记的关注喔',
        mentioned_mobile_list: mentionedMobileList,
      }),
      remark: '记的关注喔',
    };

    // 即时消息
    const isRepeat = msgTypeValue !== 'text' && mentionTypeValue !== '0'; // @有内容并且非文本会重复发
    if (publishModel === 0) {
      this.createMessage(params, paramsText, isRepeat);
      return;
    }
    // 定时消息（比即时消息多一个定时器）
    if (publishModel === 1) {
      if (!publishCron || !publishCronText) { this.props.CommonStore.alertMessage('error', '记得选一个时间哈'); return; }
      const timing = {
        cron: publishCron,
        cronText: publishCronText,
        isWorkday: publishIsWorkday,
      };
      this.createTask({ ...params, ...timing }, { ...paramsText, ...timing }, isRepeat);
    }
  }

  // 发送即时消息
  createMessage = (params, paramsText, isRepeat) => {
    this.setState({ isSendLoading: true });
    TaskService.createMessage(params).then((result) => {
      this.setState({ isSendLoading: false });
      if (result.data.code !== 0) { this.props.CommonStore.alertMessage('error', '发布失败，请检查机器人是否正常或填写内容是否过长或不规范'); return; }
      if (!isRepeat) {
        this.resetDate('消息发送成功啦');
        return;
      }
      // 非文本消息，如果有@则再单独发一条@的
      TaskService.createMessage(paramsText).then(() => {
        this.resetDate('消息发送成功啦');
      });
    });
  }


  // 发送定时消息
  createTask = (params, paramsText, isRepeat) => {
    this.setState({ isTaskLoading: true });
    TaskService.createTask(params).then((result) => {
      this.setState({ isTaskLoading: false });
      if (result.data.code !== 0) { this.props.CommonStore.alertMessage('error', '发布失败，请检查机器人是否正常或填写内容是否过长或不规范'); return; }

      if (!isRepeat) {
        this.resetDate('定时成功啦');
        return;
      }
      // 非文本消息，如果有@则再单独发一条@的
      TaskService.createTask(paramsText).then(() => {
        this.resetDate('定时成功啦');
      });
    });
  }

  // 重置数据
  resetDate = (msg) => {
    const { robotInfo } = this.props.RobotStore;
    this.props.TaskStore.getTaskList({ robotId: robotInfo.id });
    this.props.LogStore.getLogList({ robotId: robotInfo.id });
    this.props.CommonStore.alertMessage('success', msg);
    this.props.TaskStore.resetPublish();
  }

  render() {
    const {
      publishModel, msgTypeValue, publishMentionValue, mentionTypeValue,
    } = this.props.TaskStore;
    const { message } = this.props.CommonStore;
    const { isSendLoading, isTaskLoading } = this.state;

    return (
      <section className="card-warp mt-20">
        {/* 发布切换 */}
        <div className="card-title title-main"><Tab /></div>
        {/* 发布表单 */}
        <div className="card-content mt-20">
          <div>
            {/* 定时模块 */}
            {publishModel === 1 ? (<Timing />) : null}

            {/* 提醒 */}
            <Select
              defaultValue={mentionTypeValue}
              style={{ width: 100 }}
              onChange={(e) => { return this.props.TaskStore.handleDropdownChange('mentionTypeValue', e); }}
            >
              {
                mentionTypeOption.map((item, index) => { return (<Option value={item.value} key={index}>{item.label}</Option>); })
              }
            </Select>

            {mentionTypeValue === '2' ? (
              <TextArea
                value={publishMentionValue}
                placeholder="输入需要@成员的手机号，用英文逗号隔开..."
                maxLength={500}
                className="mt-15"
                onChange={(e) => { return this.props.TaskStore.handleTextChange('publishMentionValue', e); }}
                autoSize={{ minRows: 2, maxRows: 5 }}
              />
            ) : null}

            {/* 文本类型 */}
            {msgTypeValue === 'text' ? (<MsgText />) : null}
            {msgTypeValue === 'markdown' ? (<MsgMarkdown />) : null}
            {msgTypeValue === 'image' ? (<MsgImage />) : null}
            {msgTypeValue === 'news' ? (<MsgNews />) : null}

            <div className="mt-15 d-flex justify-content-between align-items-center">
              <div>&nbsp;</div>
              <div className="text-left">
                {message.status === 1 ? (<div>{message.type === 'success' ? (<span className="f-14 text-green">{message.content}</span>) : (<span className="f-14 text-red">{message.content}</span>)}</div>) : ''}
              </div>
              <div className="text-right">
                {publishModel === 0
                  ? (<Button className="btn-main" loading={isSendLoading} onClick={() => { return this.handleSubmit(); }}>立即发送</Button>)
                  : (<Button className="btn-main" loading={isTaskLoading} onClick={() => { return this.handleSubmit(); }}>定时发送</Button>)}
              </div>
            </div>
          </div>
        </div>
      </section>

    );
  }
}
export default TaskForm;
