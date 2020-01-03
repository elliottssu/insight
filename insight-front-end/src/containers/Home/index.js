import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { Menu, Dropdown, Icon } from 'antd';
import { Link } from 'react-router-dom';

import {
  Robot, RobotInfo, Task, TaskForm, Log,
} from '../../components';
import { UserService } from '../../services';

import { CommonUtil } from '../../utils';
import ImgLogo from '../../images/logo.png';

import './index.less';

@inject('LogStore', 'TaskStore', 'RobotStore')
@observer
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    this.props.RobotStore.getRobotList().then((robotInfo) => {
      const params = { robotId: robotInfo.id };
      this.props.TaskStore.getTaskList(params);
      this.props.LogStore.getLogList(params);
      this.props.TaskStore.getCron();
    });
  }

  // 退出登录
  loginOut = () => {
    UserService.loginOut();
  }

  render() {
    const { robotInfo, isInitRobot } = this.props.RobotStore;
    const name = localStorage.getItem('name') || '';


    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" className="a-main d-flex align-items-center" href="https://github.com/Elliottssu/insight/wiki/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">
            <Icon type="question" className="mr-6" />
            常见问题
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" className="a-main d-flex align-items-center" href="https://github.com/Elliottssu/insight/wiki/%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3">
            <Icon type="read" className="mr-6" />
            使用文档
          </a>
        </Menu.Item>
        <Menu.Item>
          <Link to="/login" className="a-main d-flex align-items-center" onClick={this.loginOut}>
            <Icon type="logout" className="mr-6" />
            退出登录
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="container">
        <div className="m-h-70  d-flex justify-content-between align-items-center">
          <span className="occupied" />
          <img src={ImgLogo} height="40" alt="logo" />
          <Dropdown overlay={menu} placement="bottomRight">
            <Icon type="menu" className="f-18 cursor-pointer" />
          </Dropdown>
        </div>
        <div className="row mt-20">
          <div className="col-md-6 ">
            {/* 欢迎 */}
            <section className="position-relative">
              <h2 className="f-32 f-weight-normal">
                你好，
                {CommonUtil.getShortName(name)}
              </h2>
              <p className="color-white-light f-14">欢迎来到Insight，来看看你的企业微信群机器人吧！</p>
            </section>
            {/* 机器人列表 */}
            {isInitRobot ? <Robot /> : null}
          </div>

          <div className="col-md-6 mt-sm-50">
            {/* 机器人说明 */}
            <RobotInfo />
            {/* 创建即时或定时任务 */}
            {robotInfo.role === 'admin' ? (<TaskForm />) : null}
            {/* 定时任务列表 */}
            <Task />
            {/* 历史执行记录 */}
            <Log />
          </div>
        </div>
        <div className="footer mt-20 f-12 color-white-light d-flex justify-content-center align-items-center p-10">
          <span>©2020 Insight, producted in&nbsp;</span>
          <a href="https://github.com/Elliottssu/insight" rel="noopener noreferrer" target="_blank" className="a-gray">github</a>
        </div>
      </div>
    );
  }
}

export default hot(module)(Home);
