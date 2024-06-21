import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Col,
  Select,
  Layout,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

function Login({ data }) {
  const { Option } = Select;
  const { Header } = Layout;

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { setUser } = useContext(UserContext);
  const [isRegistering, setIsRegistering] = useState(false); // New state variable

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
      message.error("Incorrect password or username");
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
      gender: values.gender,
    };
    try {
      const response = await axios.post(
        "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa1",
        [Object.values(user)]
      );

      const updatedUsers = [...users, { ...user }];
      setUsers(updatedUsers);
      window.location.reload();
    } catch (error) {
      console.error("Error adding rutin:", error.response);
    }
  };

  return (
    <div>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#02143b",
            maxHeight: 45,
          }}
        >
          <h3 style={{ color: "#F5F5F5" }}>WELCOME TO PERSONAL PLANNER :)</h3>
        </Header>
      </Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#002040",
        }}
      >
        <Row gutter={16} style={{ width: "90%", maxWidth: 1200 }}>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 135,
              }}
            >
              <h1 style={{ marginBottom: 24, color: "#F5F5F5" }}>
                {isRegistering ? "REGISTER" : "LOG IN"}
              </h1>
              <Card
                bordered={true}
                style={{
                  width: 500,
                  minHeight: 400,
                  backgroundColor: "#F5F5F5",
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  borderRadius: 8,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  color: "white",
                }}
              >
                {isRegistering ? (
                  <Form
                    style={{ paddingTop: 12 }}
                    name="register"
                    className="register-form"
                    onFinish={register}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Name!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            placeholder="Name"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="surname"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Surname!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            placeholder="Surname"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="mail"
                          rules={[
                            {
                              required: true,
                              message: "Please input your E-mail!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined />}
                            placeholder="E-mail"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="username"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Username!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Password!",
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="gender"
                          rules={[
                            {
                              required: true,
                              message: "Please select your Gender!",
                            },
                          ]}
                        >
                          <Select placeholder="Gender" className="g">
                            <Option value="https://api.dicebear.com/8.x/adventurer/svg?seed=Cookie&flip=true">
                              Female
                            </Option>
                            <Option value="https://api.dicebear.com/8.x/adventurer/svg?seed=Cuddles&flip=true">
                              Male
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="tel"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Telephone Number!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Telephone Number"
                            style={{ borderColor: "#002040" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "center", paddingTop: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="register-form-button"
                        style={{ width: 200 }}
                      >
                        Register
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form
                    style={{ paddingTop: 15 }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Username!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Username"
                        style={{ borderColor: "#002040" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        style={{ borderColor: "#002040" }}
                        placeholder="Password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox style={{ color: "#002040" }}>
                          Remember me
                        </Checkbox>
                      </Form.Item>
                      <div style={{ paddingTop: 15 }}>
                        <a href="">Forgot password</a>
                      </div>
                    </Form.Item>
                    <Form.Item
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 24,
                      }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="purple-button"
                        style={{ width: 200 }}
                      >
                        Log in
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <Button
                    type="link"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering
                      ? "Already have an account? Log in"
                      : "Don't have an account? Register"}
                  </Button>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
