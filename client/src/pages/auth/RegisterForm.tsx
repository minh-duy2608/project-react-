import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../src/contexts/AuthContext"; 

const { Title, Text } = Typography;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const onFinish = async (values: any) => {
    const { username, password } = values;
    try {
      const response = await axios.get("/admin");
      const admin = response.data;
      if (admin.username && admin.username !== "") {
        message.error("An admin account already exists!");
        return;
      }
      await axios.patch("/admin", {
        username,
        password,
      });
      
      const loginResponse = await axios.get("/admin");
      const newAdmin = loginResponse.data;
      if (newAdmin.username === username && newAdmin.password === password) {
        const mockToken = 'admin-mock-token'; 
        login(mockToken, true); 
        message.success("Register and login successful!");
        navigate("/dashboard"); 
      }
    } catch (error) {
      message.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#fff",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 4, fontWeight: 600 }}>
          Financial <span style={{ color: "#4338CA" }}>Manager</span>
        </Title>
        <Text type="secondary" style={{ color: "#0e0e0eff", display: "block", textAlign: "center", marginBottom: 24 }}>
          Please sign up
        </Text>

        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input size="large" placeholder="Please enter your username..." />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password size="large" placeholder="Please enter your password..." />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Checkbox>Remember me</Checkbox>
              <span>Already have an account? <a onClick={() => navigate("/adminLogin")}>click here!</a></span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: "#4338CA", borderColor: "#4338CA" }}>
              Sign Up
            </Button>
          </Form.Item>

          <p style={{ textAlign: "center", fontSize: 12, color: "#888" }}>
            © 2025 - Rikkei Education
          </p>
        </Form>
      </div>
    </div>
  );
}