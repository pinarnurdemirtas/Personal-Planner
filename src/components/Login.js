import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Card, Form, Input, Checkbox, Button, Alert, Row, Col, Select } from "antd";
import { useNavigate } from "react-router-dom";

function Login({ data }) {
  const { Option } = Select;
  
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const { setUser } = useContext(UserContext);

  const onFinish = (values) => {
    console.log("Success:", values);
    const isValidUser = data.some(
      (user) =>
        user.username === values.username && user.password === values.password
    );
    if (isValidUser) {
      setUser(values);
      navigate("/homepage");
    } else {
      setAlertVisible(true);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const register = async (values) => {
    const user = {
      username: values.username,
      password: values.password,
      name: values.name,
      surname: values.surname,
      mail: values.mail,
      tel: values.tel,
      gender: values.gender    
    };
    try {
      // Yeni rutini eklemek için API'ye istek yapıyoruz
      const response = await axios.post('https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa1', [Object.values(user)]);
      // Yeni rutini updatedRutins array'ine ekliyoruz
      const updatedUsers = [...users, { ...user}];
      setUsers(updatedUsers);
      window.location.reload();
      alert('Registration Successful :)');
      console.log('Added rutin:', response.data);
    } catch (error) {
      console.error('Error adding rutin:', error.response);
  
  }
  };
  
  
  
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5"}}>
      <Row gutter={16} style={{ width: "90%", maxWidth: 1200 }}>
        <Col span={12}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom:45}}>
            <h1 style={{ marginBottom: 24 }}>LOG IN</h1>
            <Card
              bordered={true}
              style={{
                width: "100%",
                minHeight: 400, // Kartın minimum yüksekliğini ayarladık
                backgroundColor: "#002040",
                display: "grid",
                placeItems: "center",
                padding: 24,
                borderRadius: 8,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                color: "white"
              }}
            >
              <Form
              style={{paddingTop:15}}
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox style={{color:"white"}}>Remember me</Checkbox>
                  </Form.Item>
                  <div style={{paddingTop:15}}>
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                  </div>
                </Form.Item>
                <Form.Item style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: 200 }}>
                    Log in
                  </Button>
                  
                </Form.Item>
              </Form>
              {alertVisible && (
                <Alert
                  message={<h5>Warning!</h5>}
                  description={<p>Please input your correct username and password!</p>}
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={{ color: '#002040', marginBottom: 24 }}>REGISTER</h1>
            <Card
              bordered={true}
              style={{
                width: "100%",
                minHeight: 400, // Kartın minimum yüksekliğini ayarladık
                backgroundColor: "#002040",
                display: "grid",
                placeItems: "center",
                padding: 24,
                borderRadius: 8,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                color: "white"
              }}
            >
              <Form
              style={{paddingTop:12}}
                name="register"
                className="register-form"
                onFinish={register}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please input your Name!' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="surname"
                      rules={[{ required: true, message: 'Please input your Surname!' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Surname" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="mail"
                      rules={[{ required: true, message: 'Please input your E-mail!' }]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="E-mail" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="gender"
                      rules={[{ required: true, message: 'Please select your Gender!' }]}
                    >
                      <Select placeholder="Gender">
                        <Option value="https://api.dicebear.com/8.x/adventurer/svg?seed=Cookie&flip=true">Female</Option>
                        <Option value="https://api.dicebear.com/8.x/adventurer/svg?seed=Cuddles&flip=true">Male</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="tel"
                      rules={[{ required: true, message: 'Please input your Telephone Number!' }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="Telephone Number" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item style={{ textAlign: 'center', paddingTop:10}}>
                  <Button type="primary" htmlType="submit" className="register-form-button" style={{ width: 200 }}>
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
