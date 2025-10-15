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
    if (!value) return Promise.resolve();
    try {
      const response = await axios.get("http://localhost:8080/users", {
        params: { username: value },
      });
      const existingUsers = response.data;
      if (existingUsers.length > 0) {
        return Promise.reject(new Error("Username already exists!"));
      }
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error("Failed to check username."));
    }
  };

  const onFinish = async (values: any) => {
    const { username, password } = values;
    try {
      // ✅ 1️⃣ Tạo user mới trong /users
      const postRes = await axios.post("http://localhost:8080/users", {
        username,
        password,
      });

      const user = postRes.data;

      // ✅ 2️⃣ Tạo profile trống tương ứng trong /profiles
      await axios.post("http://localhost:8080/profiles", {
        id: user.id,
        name: username,
        email: "",
        phone: "",
        gender: "",
        budget: "",
      });

      // ✅ 3️⃣ Lưu token + userId để chuyển hướng luôn
      const mockToken = "user-mock-token";
      localStorage.setItem("token", mockToken);
      localStorage.setItem("userId", user.id);

      login(mockToken, false);
      setIsSuccess(true);
      message.success("Register and login successful!");
      navigate("/userLogin");
    } catch (error) {
      message.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://res.cloudinary.com/dypbjah3c/image/upload/v1759421677/2ac775bd5067aeac50620b4071349ace249dc22c_bigzxc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; }
        html { overflow: hidden; height: 100%; }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.9)",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 4 }}>
          🔒 Sign Up
        </Title>
        {isSuccess && (
          <Text
            type="success"
            style={{ display: "block", textAlign: "center", marginBottom: 24 }}
          >
            Register successful!
          </Text>
        )}
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter your username!" },
              { validator: checkUsername },
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
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm password..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ backgroundColor: "#16A34A", borderColor: "#16A34A" }}
            >
              Sign Up
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 12 }}>
            Already have an account?{" "}
            <a onClick={() => navigate("/userLogin")}>Sign In</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
