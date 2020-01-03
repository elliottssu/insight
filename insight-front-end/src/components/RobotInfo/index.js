/**
 * 机器人信息
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Modal, message } from 'antd';
import { CommonUtil } from '../../utils';
import { RobotService } from '../../services';
import RobotForm from '../RobotForm';
import PermissionForm from '../PermissionForm';


import './index.less';

const { confirm } = Modal;

@inject('RobotStore', 'TaskStore', 'LogStore', 'PermissionStore')
@observer
class RobotInfo extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  // 机器人删除
  robotRemove = (robot) => {
    const { props } = this;
    confirm({
      title: `你确定要删掉『${robot.name}』机器人吗？`,
      content: '此操作会删除掉和此机器人相关的所有任务、日志、权限等相关数据',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        RobotService.removeRobot({ robotId: robot.id }).then((result) => {
          if (result.data.code === 0) {
            localStorage.removeItem('selectedRobotId');
            props.RobotStore.getRobotList().then((robotInfo) => {
              const params = { robotId: robotInfo.id };
              props.TaskStore.getTaskList(params);
              props.LogStore.getLogList(params);
              props.TaskStore.getCron();
              message.success('机器人删除成功');
            });
          }
        });
      },
      onCancel() {

      },
    });
  }


  render() {
    const { taskList } = this.props.TaskStore;
    const { isModelPermissionVisable } = this.props.PermissionStore;
    const {
      robotInfo, isLoadingRobot, isInitRobot, isModelEditVisable,
    } = this.props.RobotStore;


    return (
      <section className="d-flex align-items-center m-h-70">
        <div className="robot-status">
          <img width="65" src={CommonUtil.getRobotStatus(isLoadingRobot, taskList.length)} alt="robot" />
        </div>

        {
          isInitRobot ? (
            <div className="ml-8 m-w-57">
              <h3>{robotInfo.name || 'Robot Name'}</h3>
              <span className="color-white-light f-14">{robotInfo.description || 'Robot Description'}</span>
            </div>
          ) : (<div>&nbsp;</div>)
        }
        {
          robotInfo.name && robotInfo.role === 'admin' ? (
            <div className="ml-auto">
              <Icon type="cluster" title="修改权限" onClick={() => { return this.props.PermissionStore.showModelPermission(); }} className="a-main f-14" />
              <Icon type="form" title="编辑" onClick={() => { return this.props.RobotStore.showModelEdit(); }} className="a-main f-14 ml-10" />
              <Icon type="delete" title="移除" onClick={() => { return this.robotRemove(robotInfo); }} className="a-main f-14 ml-10" />
            </div>
          ) : (<div>&nbsp;</div>)
        }
        <Modal
          title={`『${robotInfo.name}』编辑机器人`}
          visible={isModelEditVisable}
          onCancel={this.props.RobotStore.handleCancel}
          footer={null}
          destroyOnClose
        >
          <RobotForm robotInfo={robotInfo} />
        </Modal>
        <Modal
          title={`『${robotInfo.name}』管理权限 - ${robotInfo.status === 'public' ? '公共' : '私人'}机器人`}
          visible={isModelPermissionVisable}
          onCancel={this.props.PermissionStore.handleCancel}
          footer={null}
          destroyOnClose
        >
          <PermissionForm robotInfo={robotInfo} />
        </Modal>
      </section>
    );
  }
}
export default RobotInfo;
