/**
 * 任务列表
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
import {
  Tooltip, Modal, message, Icon,
} from 'antd';

import { TaskService } from '../../services';

import './index.less';

const { confirm } = Modal;

@inject('LogStore', 'TaskStore', 'RobotStore')
@observer
class TaskList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  // 任务修改
  taskUpdate = (item) => {
    const params = {
      taskId: item.id,
      status: item.status === '0' ? '1' : '0',
    };
    TaskService.updateTask(params).then((result) => {
      if (result.data.code === 0) {
        this.props.TaskStore.getTaskList({ robotId: item.robotId });
        message.success(item.status === '0' ? '已启动' : '已暂停');
      }
    });
  }

  // 任务删除
  taskRemove = (item) => {
    const { props } = this;
    confirm({
      title: '你确定要删掉此任务吗？',
      content: '删除任务无法复原，但会保留历史执行记录',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const params = {
          taskId: item.id,
        };
        TaskService.removeTask(params).then((result) => {
          if (result.data.code === 0) {
            props.TaskStore.getTaskList({ robotId: item.robotId });
            message.success('删除成功');
          }
        });
      },
      onCancel() {

      },
    });
  }

  // 任务临时触发
  taskSend = (item) => {
    const { props } = this;

    confirm({
      title: '你确定要手动触发一次此条消息吗？',
      content: `将发送一条内容：${item.remark || ''}`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const params = {
          robotId: item.robotId,
          msgType: item.msgType,
          msgContent: item.msgContent,
          suite: item.suite,
          remark: item.remark,
        };

        TaskService.createMessage(params).then((result) => {
          if (result.data.code !== 0) {
            message.error(result.data.msg);
          } else {
            message.success('手动触发成功');
          }
          props.LogStore.getLogList({ robotId: item.robotId });
        });
      },
      onCancel() {

      },
    });
  }

  renderTitle = (item) => {
    const content = item.replace(/(\r\n)|(\n)/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  render() {
    const { robotInfo } = this.props.RobotStore;
    const { taskList } = this.props.TaskStore;

    return (
      <section className="card-warp mt-20">
        <div className="card-title title-main">
          <span className="color-white-normal f-18">定时任务列表</span>
          <span className="color-white-light f-14 ml-8">
          （正在执行
          {taskList.length}
          个定时任务）
          </span>
        </div>
        <div className="card-content fixed-height">
          {taskList.length
            ? (
              <div>
                {
                  taskList.map((item, index) => {
                    return (
                      <Tooltip
                        title={this.renderTitle(item.remark || '')}
                        key={index}
                      >
                        <div className="content-item d-flex justify-content-around align-items-center">
                          {item.status === '1' ? (<div className="tag tag-success tag-active">Runing</div>) : (<div className="tag tag-default">Stop</div>)}
                          <div className="ml-15 f-14 m-w-50 text-nowrap">
                            {item.cronText.replace(/今天/, dayjs(item.createDate).format('YYYY年MM月DD日'))}
                          </div>
                          {/* 只有管理员才可以编辑 */}
                          {robotInfo.role === 'admin' ? (
                            <div className="ml-auto">
                              <Icon type="shake" title="手动触发" onClick={() => { return this.taskSend(item); }} className="a-main f-14" />
                              <span />
                              {item.status === '1'
                                ? (<Icon type="pause-circle" title="暂停" onClick={() => { return this.taskUpdate(item); }} className="a-main f-14 ml-10" />)
                                : (<Icon type="play-circle" title="开始" onClick={() => { return this.taskUpdate(item); }} className="a-main f-14 ml-10" />)}
                              <Icon type="delete" title="移除" onClick={() => { return this.taskRemove(item); }} className="a-main f-14 ml-10" />
                            </div>
                          ) : (
                              <div className="ml-auto">&nbsp;</div>
                          )}
                        </div>
                      </Tooltip>
                    );
                  })
                }
              </div>
            )
            : (<p className="text-center pt-40">暂无定时任务</p>)}
        </div>
      </section>
    );
  }
}
export default TaskList;
