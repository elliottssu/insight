/**
 * 权限表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Form, Input, message, Tag, Icon, Popconfirm,
} from 'antd';
import { PermissionService } from '../../services';

import './index.less';

@inject('PermissionStore')
@observer
class PermissionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddShow: {
        admin: false,
        readonly: false,
      },
      username: '',
    };
  }

  componentWillMount() {
    const { robotInfo } = this.props;
    this.props.PermissionStore.getPermissionList({ robotId: robotInfo.id });
  }

  // 权限删除
  permissionRemove = (username) => {
    const { robotInfo } = this.props;
    const params = {
      robotId: robotInfo.id,
      username,
    };
    PermissionService.removePermission(params).then((result) => {
      if (result.data.code !== 0) {
        message.error(result.data.msg);
        return;
      }
      message.success('用户删除成功');
      this.props.PermissionStore.getPermissionList({ robotId: robotInfo.id });
    });
  }

  // 权限创建
  permissionCreate = (role) => {
    const { username } = this.state;
    const { robotInfo } = this.props;
    const params = {
      robotId: robotInfo.id,
      role,
      username,
    };
    PermissionService.createPermission(params).then((result) => {
      if (result.data.code !== 0) {
        message.error(result.data.msg);
        return;
      }
      this.permissionAddHide(role);
      this.props.PermissionStore.getPermissionList({ robotId: robotInfo.id });
    });
  }

  // 显示添加输入框
  permissionAddShow = (role) => {
    this.setState({
      isAddShow: {
        [role]: true,
      },
    });
  }

  // 隐藏
  permissionAddHide = (role) => {
    this.setState({
      isAddShow: {
        [role]: false,
      },
    });
  }

  // 输入框改变
  onInputChange = (e) => {
    const content = (e.target.value).trim();
    this.setState({ username: content });
  }


  // 渲染内容
  renderItem = (role, dataList) => {
    const { isAddShow, username } = this.state;

    return (
      <div>
        <div className="wrapper-box">
          {
            dataList.map((item, index) => {
              return (
                <div className="wrapper-item d-flex justify-content-around align-items-center" key={index}>
                  <div className="text-nowrap mw-80">{item.username}</div>
                  <div className="ml-auto d-flex align-items-center">
                    <Popconfirm
                      title={`确定要移除用户${item.username}的权限吗？`}
                      onConfirm={() => { return this.permissionRemove(item.username); }}
                      okText="是"
                      cancelText="否"
                    >
                      <Icon type="close-circle" title="移除" className="a-main f-14" />
                    </Popconfirm>
                  </div>
                </div>
              );
            })
          }
          {
            !dataList.length ? (<span className="f-12">暂无权限配置</span>) : null
          }
        </div>
        <div className="mt-6">
          {
            isAddShow[role]
              ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Input placeholder="用户名" size="small" className="mw-80" value={username} onChange={this.onInputChange} />
                  <Icon type="plus-circle" title="添加" onClick={() => { return this.permissionCreate(role); }} className="a-main f-14 ml-10" />
                </div>
              )
              : (<Icon type="plus-circle" title="添加" onClick={() => { return this.permissionAddShow(role); }} className="a-main f-14" />)
          }

        </div>
      </div>
    );
  }


  render() {
    const { permissionList } = this.props.PermissionStore;

    const { robotInfo } = this.props; // 通过是否有信息传过来判断是新建还是编辑

    const adminList = permissionList.filter((e) => e.role === 'admin');
    const readonlyList = permissionList.filter((e) => e.role === 'readonly');


    return (
      <div>
        <div className="row">

          <div className="col-md-6">
            <p>
              <Tag color="#118060" className="f-16">管理员</Tag>
              <span className="f-12 color-white-light">可以管理任务和权限</span>
            </p>
            {this.renderItem('admin', adminList)}
          </div>
          <div className="col-md-6">
            <p>
              <Tag color="#985f1f" className="f-16">只读</Tag>
              <span className="f-12 color-white-light">只能看任务和日志</span>
            </p>
            {this.renderItem('readonly', readonlyList)}
            {robotInfo.status === 'public'
              ? <p className="f-12 mt-10 color-white-light">* 公共机器人所有人均是可读</p>
              : null}
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create({ name: 'coordinated' })(PermissionForm);
