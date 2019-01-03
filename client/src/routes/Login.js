import React, { Component } from 'react';
import styles from './Login.css';
import {
  Form, Icon, Input, Button, Checkbox, message
} from 'antd';
import {post} from '../utils/request';
import config from '../config/index';
import { connect } from 'dva';
import {routerRedux } from 'dva/router';

class Login extends Component{
  constructor(props){
    super(props);
  }

  handleSubmit = (e) => {
    const that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const params = {
          name: values.userName,
          password: values.password
        };
        post(`${config.server}/login`, params).then((data)=>{
          console.log('返回', data);
          if(data.errcode == 0){
            message.success('登录成功');
            that.props.dispatch(
              routerRedux.push({
                pathname: '/position',
              })
            );
          }else{
            message.warn('账号或者密码不正确');
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
      <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default connect()(WrappedNormalLoginForm);
