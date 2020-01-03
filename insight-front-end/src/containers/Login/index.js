import React from 'react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';
import {
  Form, Icon, Input, Button, message,
} from 'antd';
import { UserService } from '../../services';
import logo from '../../images/logo.png';

import './index.less';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {

  }

  // 登陆
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.username || !values.password) {
          message.error('用户名或密码不能为空');
          return;
        }

        this.setState({ loading: true });
        UserService.login(values).then((result) => {
          this.setState({ loading: false });
          if (result.data.code !== 0) {
            message.error(result.data.msg);
            return;
          }
          localStorage.setItem('name', result.data.data);
          this.props.history.push('/');
        });
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;

    return (
      <div className="login-wrapper">
        <div className="login-form">
          <div className="login-title mb-30">
            <img src={logo} height="40" alt="logo" />
            <div className="glitch f-12" data-text="企业微信群机器人">企业微信群机器人</div>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', { rules: [{ required: false, message: '请输入用户名' }] })(
                <Input prefix={<Icon type="user" />} size="large" placeholder="用户名" />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', { rules: [{ required: false, message: '请输入密码' }] })(
                <Input prefix={<Icon type="lock" />} type="password" size="large" placeholder="密码" />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-100" loading={loading}>登录</Button>
              <div className="color-white-normal d-flex justify-content-between align-items-center">
                <span className="occupied" />
                <span className="f-12">
                  没有账号？立即
                  <Link to="/register">注册</Link>
                </span>
                <a href="https://github.com/Elliottssu/insight" rel="noopener noreferrer" target="_blank" className="f-18 d-flex align-items-center"><Icon type="github" /></a>
              </div>
            </Form.Item>
          </Form>


        </div>
        <div className="solar">
          <div className="planet mars">
            <div className="overlay" />
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(Form.create({ name: 'horizontal_login' })(Login));
