import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Typography,
  DatePicker,
  Modal,
  Select,
  Form,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  HistoryOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InformationPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

const InformationPage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    budget: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isChangeInfoVisible, setIsChangeInfoVisible] = useState(false);
  const [isChangePassVisible, setIsChangePassVisible] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formInfo] = Form.useForm();
  const [formPass] = Form.useForm();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(Number(id));
      axios.get(`http://localhost:8080/profiles/${id}`).then((res) => {
        setUserInfo(res.data);
        formInfo.setFieldsValue(res.data);
      });
    } else {
      message.error("Không tìm thấy người dùng, vui lòng đăng nhập lại!");
      window.location.href = "/userlogin";
    }
  }, [formInfo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => setIsLogoutModalVisible(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/userlogin";
    setIsLogoutModalVisible(false);
  };
  const handleCancelLogout = () => setIsLogoutModalVisible(false);

  const handleSaveInfo = async () => {
    try {
      const values = await formInfo.validateFields();
      if (!userId) return;
      await axios.put(`http://localhost:8080/profiles/${userId}`, values);
      setUserInfo(values);
      message.success("Cập nhật thông tin thành công!");
      setIsChangeInfoVisible(false);
    } catch {
      message.error("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  const handleSavePassword = async () => {
    try {
      const values = await formPass.validateFields();
      if (!userId) return;

      const res = await axios.get(`http://localhost:8080/users/${userId}`);
      const user = res.data;

      if (values.oldPassword !== user.password) {
        message.error("Mật khẩu cũ không đúng!");
        return;
      }
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không trùng khớp!");
        return;
      }

      await axios.put(`http://localhost:8080/users/${userId}`, {
        ...user,
        password: values.newPassword,
      });

      message.success("Đổi mật khẩu thành công!");
      setIsChangePassVisible(false);
      formPass.resetFields();
    } catch {
      message.error("Vui lòng nhập đầy đủ và chính xác thông tin!");
    }
  };

  const handleSaveBudget = () => message.success("Ngân sách đã được lưu!");

  return (
    <div className="page-root">
      <header className="app-header">
        <div className="header-left">📒 Tài Chính Cá Nhân K24_Rikkei</div>

        <div
          className="header-right"
          onClick={() => setOpenDropdown(!openDropdown)}
          ref={dropdownRef}
        >
          <span>Tài khoản</span>
          <span className="arrow-down">&#8744;</span>

          {openDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogoutClick}>
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="main-wrap">
        <aside className="sidebar">
          <Button
            type="primary"
            icon={<InfoCircleOutlined />}
            className="side-btn active"
            block
            onClick={() => navigate("/information")}
          >
            Information
          </Button>
          <Button
            icon={<BarsOutlined />}
            className="side-btn"
            block
            onClick={() => navigate("/categoryUser")}
          >
            Category
          </Button>
          <Button
            icon={<HistoryOutlined />}
            className="side-btn"
            block
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        </aside>

        <section className="content">
          <div className="banner">
            <div className="banner-title">🎯 Kiểm soát chi tiêu thông minh</div>
            <div className="banner-sub">
              Theo dõi ngân sách và thu chi hàng tháng dễ dàng
            </div>
          </div>

          <div className="center-column">
            <Title level={3} className="page-title">
              📊 Quản Lý Tài Chính Cá Nhân
            </Title>

            <div className="card money-card">
              <Text className="muted">Số tiền còn lại</Text>
              <div className="big-green">0 VND</div>
            </div>

            <div className="card month-card">
              <Text className="muted">📅 Chọn tháng:</Text>
              <DatePicker picker="month" style={{ width: 220 }} />
            </div>

            <div className="card budget-card">
              <span className="emoji">💰 Ngân sách tháng:</span>
              <Input
                placeholder="VD: 5000000"
                value={userInfo.budget}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, budget: e.target.value })
                }
                style={{ width: 220 }}
              />
              <Button
                type="primary"
                onClick={handleSaveBudget}
                className="save-btn"
              >
                Lưu
              </Button>
            </div>

            <div className="card user-card">
              <Title level={4} className="section-title">
                Quản Lý Thông tin cá nhân
              </Title>

              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Text strong className="label">
                    Name <span className="required">*</span>
                  </Text>
                  <Input value={userInfo.name} disabled />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Email <span className="required">*</span>
                  </Text>
                  <Input value={userInfo.email} disabled />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Phone <span className="required">*</span>
                  </Text>
                  <Input value={userInfo.phone} disabled />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Gender <span className="required">*</span>
                  </Text>
                  <Input value={userInfo.gender} disabled />
                </Col>
              </Row>

              <div className="action-row">
                <Button className="purple-btn" onClick={() => setIsChangeInfoVisible(true)}>
                  Change Information
                </Button>
                <Button className="purple-btn" onClick={() => setIsChangePassVisible(true)}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isChangeInfoVisible}
        onOk={handleSaveInfo}
        onCancel={() => setIsChangeInfoVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={formInfo}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        open={isChangePassVisible}
        onOk={handleSavePassword}
        onCancel={() => setIsChangePassVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={formPass}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Mật khẩu xác nhận không trùng khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận đăng xuất"
        open={isLogoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn đăng xuất không?</p>
      </Modal>
    </div>
  );
};

export default InformationPage;
