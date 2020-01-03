/**
 * 机器人表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Form, Input, Button, message, Switch,
} from 'antd';
import { RobotService } from '../../services';

import './index.less';

const { TextArea } = Input;

@inject('RobotStore', 'TaskStore', 'LogStore', 'TaskStore')
@observer
class RobotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmLoading: false,
      isSwitchCheck: false,
    };
  }

  componentWillMount() {
    const { robotInfo } = this.props;

    if (robotInfo && robotInfo.status === 'public') {
      this.setState({ isSwitchCheck: true });
    }
  }


  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          name: values.name.trim(),
          description: values.description.trim(),
          webhook: values.webhook.trim(),
          status: values.status ? 'public' : 'private',
        };
        this.setState({ isConfirmLoading: true });


        const { robotInfo } = this.props;

        if (robotInfo) { // 更新
          params.id = robotInfo.id;
          RobotService.updataRobot(params).then((result) => {
            this.setState({ isConfirmLoading: false });
            if (result.data.code !== 0) {
              message.error(result.data.msg);
              return;
            }
            this.props.RobotStore.handleCancel();
            message.success('机器人更新成功');
            this.props.RobotStore.getRobotList();
          });
        } else { // 创建
          RobotService.createRobot(params).then((result) => {
            this.setState({ isConfirmLoading: false });
            if (result.data.code !== 0) {
              message.error(result.data.msg);
              return;
            }
            this.props.RobotStore.handleCancel();
            message.success('机器人创建成功');
            this.props.RobotStore.getRobotList();
          });
        }
      }
    });
  };

  // 处理开关
  handleSwitchChange = (value) => {
    this.setState({ isSwitchCheck: value });
  }


  render() {
    const { isConfirmLoading, isSwitchCheck } = this.state;
    const { getFieldDecorator } = this.props.form;

    const { robotInfo } = this.props; // 通过是否有信息传过来判断是新建还是编辑


    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {
            getFieldDecorator('name', {
              initialValue: robotInfo ? robotInfo.name : '',
              rules: [{ required: true, message: '请输入机器人名字' }],
            })(<Input placeholder="机器人名字" size="large" maxLength={10} />)
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('description', {
              initialValue: robotInfo ? robotInfo.description : '',
              rules: [{ required: true, message: '请输入机器人介绍' }],
            })(<TextArea placeholder="机器人介绍" maxLength={500} autoSize={{ minRows: 3, maxRows: 6 }} />)
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('webhook', {
              initialValue: robotInfo ? robotInfo.webhook : '',
              rules: [{ required: true, pattern: /^https:\/\/qyapi.weixin.qq.com\/cgi-bin\/webhook\/send/, message: '请输入正确的机器人链接，建议从官方粘贴过来' }],
            })(<TextArea placeholder="Webhook地址" maxLength={500} autoSize={{ minRows: 3, maxRows: 6 }} />)
          }
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('status', {
            initialValue: robotInfo ? (robotInfo.status === 'public') : false,
            valuePropName: 'checked',
          })(<Switch checkedChildren="公共" unCheckedChildren="私有" onChange={this.handleSwitchChange} />)}
        </Form.Item>
        {
          robotInfo ? (
            <div className="color-white-normal">
              {
                isSwitchCheck
                  ? (<p className="f-12 mb-0">您选择了公共机器人，你可以查看和编辑，其他人只能查看但是不能编辑。</p>)
                  : (<p className="f-12 mb-0">您选择了私人机器人，只有你可以查看和编辑，其他人不行。</p>)
              }
              <p className="f-12 mt-6">更新此处，不会影响之前的权限分配。</p>
            </div>
          ) : (

              <div className="color-white-normal">
                {
                  isSwitchCheck
                    ? (<p className="f-12 mb-0">将为您创建一个公共机器人，你可以查看和编辑，其他人只能查看但是不能编辑。</p>)
                    : (<p className="f-12 mb-0">将为您创建一个私人机器人，只有你可以查看和编辑，其他人不行。</p>)
                }
                <p className="f-12 mt-6">稍后您也可以重新分配权限。</p>
              </div>
          )
        }

        <Form.Item wrapperCol={{ span: 24 }} className="text-right mb-0 mt-40">
          <Button onClick={this.props.RobotStore.handleCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={isConfirmLoading} className="ml-10">{robotInfo ? '更新' : '创建'}</Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create({ name: 'coordinated' })(RobotForm);
