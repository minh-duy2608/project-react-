// src/pages/user/UserLoginPage.tsx
import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../src/contexts/AuthContext";

const { Title, Text } = Typography;

export default function UserLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setErrorMsg(null);

    try {
      const response = await axios.get("http://localhost:8080/users", {
        params: { username },
      });

      const users = response.data;
      if (users.length === 0 || users[0].password !== password) {
        setErrorMsg("Incorrect username or password!");
        return;
      }

      const user = users[0];
      const mockToken = "user-mock-token";

      // ✅ Lưu token và userId
      localStorage.setItem("token", mockToken);
      localStorage.setItem("userId", user.id);

      login(mockToken, false);
      setIsSuccess(true);
      navigate("/information");
    } catch (error) {
      setErrorMsg("Failed to connect to server. Please try again later.");
      console.error("Login error:", error);
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
        overflow: "hidden",
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
        <Title level={3} style={{ textAlign: "center", marginBottom: 15 }}>
          🔐 Sign In
        </Title>

        {isSuccess && (
          <Text
            type="success"
            style={{ display: "block", textAlign: "center", marginBottom: 24 }}
          >
            Sign In Successfully
          </Text>
        )}

        {errorMsg && (
          <Text
            style={{
              color: "red",
              display: "block",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {errorMsg}
          </Text>
        )}

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input size="large" placeholder="Username here..." />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password size="large" placeholder="Password here..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
            >
              Sign In
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 12 }}>
            Don’t have an account?{" "}
            <a onClick={() => navigate("/userRegister")}>Sign Up Now</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
