import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { Card, Form, Input, Checkbox, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";

function Login({ data }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  

  const onFinish = (values) => {
    console.log("Success:", values);
    const isValidUser = data.some(
      (user) =>
        user.username === values.username && user.password === values.password
    );
    if (isValidUser) {
      setUser(values); // Kullanıcı bilgilerini context'e ekleyin
      navigate("/homepage");
    } else {
      setAlertVisible(true);
     
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ display: "grid", placeItems: "center", paddingTop: 80 }}>
      <h1>Personal Planner</h1>
      <Card
        title="LOG IN"
        bordered={true}
        style={{
          width: 500,
          backgroundColor: "#E6E6FA",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        {alertVisible && (
        <Alert
          message={<h5>Warning!</h5>}
          description={<p>Please input your correct username and password!</p>}
        
        />
      )}
      </Card>
    </div>
  );
}

export default Login;
