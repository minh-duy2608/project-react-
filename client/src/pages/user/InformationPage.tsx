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

  // 🆕 State cho ngân sách tháng
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthlyBudget, setMonthlyBudget] = useState<string>("");
  const [remainingMoney, setRemainingMoney] = useState<number>(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formInfo] = Form.useForm();
  const [formPass] = Form.useForm();

  // Lấy thông tin người dùng
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

  // Ẩn dropdown khi click ra ngoài
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

  // --- Đăng xuất ---
  const handleLogoutClick = () => setIsLogoutModalVisible(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/userlogin";
    setIsLogoutModalVisible(false);
  };
  const handleCancelLogout = () => setIsLogoutModalVisible(false);

  // --- Lưu thông tin cá nhân ---
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

  // --- Đổi mật khẩu ---
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

  // --- 🆕 Lưu ngân sách tháng ---
  const handleSaveMonthlyBudget = async () => {
    if (!selectedMonth) {
      message.warning("Vui lòng chọn tháng!");
      return;
    }
    if (!monthlyBudget) {
      message.warning("Vui lòng nhập ngân sách!");
      return;
    }
    // ✅ Ngăn nhập tiền âm hoặc 0
    if (Number(monthlyBudget) <= 0) {
      message.warning("Ngân sách phải lớn hơn 0!");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/monthlyBudgets?month=${selectedMonth}`
      );
      const existing = res.data[0];

      if (existing) {
        await axios.put(`http://localhost:8080/monthlyBudgets/${existing.id}`, {
          ...existing,
          budget: Number(monthlyBudget),
        });
        message.success("Cập nhật ngân sách tháng thành công!");
      } else {
        await axios.post(`http://localhost:8080/monthlyBudgets`, {
          month: selectedMonth,
          budget: Number(monthlyBudget),
        });
        message.success("Thêm ngân sách tháng mới thành công!");
      }

      fetchTransactionsAndCalculate(Number(monthlyBudget));
    } catch (error) {
      message.error("Không thể lưu ngân sách!");
    }
  };

  // --- 🆕 Lấy ngân sách & giao dịch khi chọn tháng ---
  useEffect(() => {
    const fetchBudget = async () => {
      if (!selectedMonth) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/monthlyBudgets?month=${selectedMonth}`
        );
        if (res.data.length > 0) {
          const budgetValue = res.data[0].budget;
          setMonthlyBudget(budgetValue.toString());
          fetchTransactionsAndCalculate(budgetValue);
        } else {
          setMonthlyBudget("");
          setRemainingMoney(0);
        }
      } catch {
        message.error("Không thể tải ngân sách tháng!");
      }
    };
    fetchBudget();
  }, [selectedMonth]);

  // 🧮 Tính số tiền còn lại
  const fetchTransactionsAndCalculate = async (budgetValue: number) => {
    try {
      const monthData = await axios.get(
        `http://localhost:8080/monthlyCategories?month=${selectedMonth}`
      );

      if (monthData.data.length === 0) {
        setRemainingMoney(budgetValue);
        return;
      }

      const monthlyCategoryId = monthData.data[0].id;
      const transRes = await axios.get(
        `http://localhost:8080/transactions?monthlyCategoryId=${monthlyCategoryId}`
      );
      const totalSpent = transRes.data.reduce(
        (sum: number, t: any) => sum + t.total,
        0
      );

      setRemainingMoney(budgetValue - totalSpent);
    } catch {
      setRemainingMoney(budgetValue);
    }
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
              <Text className="muted">💵 Số tiền còn lại</Text>
              <div className="big-green">
                {remainingMoney.toLocaleString()} VND
              </div>
            </div>

            <div className="card month-card">
              <Text className="muted">📅 Chọn tháng:</Text>
              <DatePicker
                picker="month"
                style={{ width: 220 }}
                onChange={(date, dateString) => setSelectedMonth(Array.isArray(dateString) ? dateString[0] || "" : dateString)}
              />
            </div>

            <div className="card budget-card">
              <span className="emoji">💰 Ngân sách tháng:</span>
              <Input
                placeholder="VD: 5000000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                style={{ width: 220 }}
              />
              <Button
                type="primary"
                onClick={handleSaveMonthlyBudget}
                className="save-btn"
              >
                Lưu
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InformationPage;
