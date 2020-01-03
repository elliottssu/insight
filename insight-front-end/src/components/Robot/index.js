/**
 * 机器人部分
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd';

import imgRobot from '../../images/robot.png';
import imgAdd from '../../images/add.png';
import RobotForm from '../RobotForm';

import './index.less';

@inject('RobotStore', 'TaskStore', 'LogStore', 'TaskStore')
@observer
class Robot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  // 选择机器人
  selectRobot = (index) => {
    const { robotList } = this.props.RobotStore;

    const robotInfo = robotList.find((e) => { return e.id === index; }) || {};

    this.props.RobotStore.isLoadingRobot = true;
    localStorage.setItem('selectedRobotId', String(index));
    this.props.RobotStore.selectedRobotId = index;
    this.props.RobotStore.isLoadingRobot = false;
    this.props.RobotStore.robotInfo = robotInfo;
    // 初始化数据
    const params = { robotId: robotInfo.id };
    this.props.TaskStore.resetAll();
    this.props.TaskStore.getTaskList(params);
    this.props.LogStore.getLogList(params);
    this.props.TaskStore.getCron();
  };


  render() {
    const {
      robotList, selectedRobotId, isModelCreateVisable,
    } = this.props.RobotStore;

    const robotListPublic = robotList.filter((e) => { return e.status === 'public'; });
    const robotListPrivate = robotList.filter((e) => { return e.status === 'private'; });

    const renderRobitList = (robotListCurrent, publishStatus) => {
      return (
        <div className={!robotListCurrent.length ? 'robot-warp robot-warp-empty' : 'robot-warp'}>
          {
            robotListCurrent.map((item, index) => {
              return (
                <div className="robot-item" key={index}>
                  <div className={selectedRobotId === item.id ? 'robot-header robot-active' : 'robot-header'} onClick={() => { return this.selectRobot(item.id); }}>
                    <div className="robot-avatar d-flex justify-content-center align-items-center">
                      <span className="color-white-deep"><img src={imgRobot} alt="robot" height="50" /></span>
                    </div>
                    {item.status === 1 ? <div className="robot-sign" /> : null}
                  </div>
                  <div className="robot-footer">{item.name}</div>
                </div>
              );
            })
          }
          {publishStatus ? (
            <div className="robot-item">
              <div className="robot-header" onClick={() => { return this.props.RobotStore.showModelCreate(); }}>
                <div className="robot-avatar robot-empty d-flex justify-content-center align-items-center">
                  <span className="color-white-deep"><img src={imgAdd} alt="add" height="30" /></span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    };

    return (
      <div>
        <section className="mt-40 mt-sm-50">
          <div className="title-main f-18">
            <span>公共机器人</span>
            <span className="color-white-light f-14 ml-8">
              （共
              {robotListPublic.length}
              个）
            </span>
          </div>
          <div className="mt-15">
            {renderRobitList(robotListPublic)}
          </div>
        </section>
        <section className="mt-40 mt-sm-50">
          <div className="title-main f-18  position-relative">
            <span>我的机器人</span>
            <span className="color-white-light f-14 ml-8">
              （共
              {robotListPrivate.length}
              个）
            </span>

          </div>
          <div className="mt-15">
            {renderRobitList(robotListPrivate, true)}
            {
              !robotListPrivate.length ? (<div className="d-flex justify-content-center align-items-center color-white-normal f-12">这里很空，快来添加一个属于你的机器人</div>) : null
            }
          </div>
        </section>

        <Modal
          title="新增机器人"
          visible={isModelCreateVisable}
          onCancel={this.props.RobotStore.handleCancel}
          footer={null}
          destroyOnClose
        >
          <RobotForm />
        </Modal>
      </div>
    );
  }
}
export default Robot;
