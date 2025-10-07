// src/pages/user/UserRegisterPage.tsx
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../src/contexts/AuthContext"; 

const { Title, Text } = Typography;

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [isSuccess, setIsSuccess] = useState(false);

  const checkUsername = async (_: any, value: string) => {
    if (!value) {
      return Promise.resolve(); 
    }
    try {
      const response = await axios.get("/users", {
        params: { username: value }
      });
      const existingUsers = response.data;
      if (existingUsers.length > 0) {
        return Promise.reject(new Error("Tên đã có rồi!"));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error("Failed to check username. Please try again."));
    }
  };

  const onFinish = async (values: any) => {
    const { username, password } = values;
    try {
      
      await axios.post("/users", {
        username,
        password,
      });
      
      
      const loginResponse = await axios.get("/users", { params: { username } });
      const users = loginResponse.data;
      if (users.length > 0 && users[0].password === password) {
        const mockToken = 'user-mock-token'; 
        login(mockToken, false); 
        setIsSuccess(true);
        message.success("Register and login successful!");
        navigate("/information"); 
      }
    } catch (error) {
      message.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100%",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://res.cloudinary.com/dypbjah3c/image/upload/v1759421677/2ac775bd5067aeac50620b4071349ace249dc22c_bigzxc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        html {
          overflow: hidden;
          height: 100%;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.9)",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 4 }}>
          <span role="img" aria-label="lock">🔒</span> Sign Up
        </Title>
        {isSuccess && (
          <Text type="success" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
            Register successful!
          </Text>
        )}
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter your username!" },
              { validator: checkUsername }
            ]}
          >
            <Input size="large" placeholder="Username here..." />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password size="large" placeholder="Password here..." />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm Password here..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: "#16A34A", borderColor: "#16A34A" }}>
              Sign Up
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 12 }}>
            Already have an account? <a onClick={() => navigate("/userLogin")}>Sign In</a>
          </div>
        </Form>
      </div>
    </div>
  );
}