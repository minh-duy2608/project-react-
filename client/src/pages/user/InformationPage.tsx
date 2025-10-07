import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Row, Col, Typography, DatePicker, Modal } from "antd";
import {
  InfoCircleOutlined,
  HistoryOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import "./InformationPage.css";

const { Title, Text } = Typography;

const InformationPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Nguyen Van A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    gender: "Male",
    budget: "",
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeInfo = () => {
    console.log("Change Information clicked");
  };

  const handleChangePassword = () => {
    console.log("Change Password clicked");
  };

  const handleSaveBudget = () => {
    console.log("Budget saved:", userInfo.budget);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setOpenDropdown(false);
    localStorage.removeItem("token");
    window.location.href = "/userlogin"; 
    setIsLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

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
          >
            Information
          </Button>
          <Button icon={<BarsOutlined />} className="side-btn" block>
            Category
          </Button>
          <Button icon={<HistoryOutlined />} className="side-btn" block>
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
                  <Input
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Email <span className="required">*</span>
                  </Text>
                  <Input
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Phone <span className="required">*</span>
                  </Text>
                  <Input
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong className="label">
                    Gender <span className="required">*</span>
                  </Text>
                  <Input
                    value={userInfo.gender}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, gender: e.target.value })
                    }
                  />
                </Col>
              </Row>

              <div className="action-row">
                <Button className="purple-btn" onClick={handleChangeInfo}>
                  Change Information
                </Button>
                <Button className="purple-btn" onClick={handleChangePassword}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

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