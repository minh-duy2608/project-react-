import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  DatePicker,
  message,
  Modal,
  Select,
} from "antd";
import {
  InfoCircleOutlined,
  BarsOutlined,
  HistoryOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./CategoryPage.css";

const { Title, Text } = Typography;

interface Category {
  id: number;
  name: string;
  image: string;
  status: string;
}

interface MonthlyCategory {
  id: number;
  month: string;
  categories: {
    id: number;
    categoryId: number;
    limit: number;
  }[];
}

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState<any>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/categories");
      const cats = await res.json();
      setCategories(cats);
    } catch {
      message.error("Không thể tải danh mục!");
    }
  };

  const fetchMonthlyData = async (selectedMonth: string) => {
    try {
      const res = await fetch("http://localhost:8080/monthlyCategories");
      const monthly = await res.json();

      let existing = monthly.find(
        (m: MonthlyCategory) => m.month === selectedMonth
      );

      if (!existing) {
        const newMonthly = {
          id: Date.now(),
          month: selectedMonth,
          categories: [],
        };
        const createRes = await fetch(
          "http://localhost:8080/monthlyCategories",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMonthly),
          }
        );
        if (!createRes.ok) throw new Error("Không thể tạo monthly category!");
        existing = await createRes.json();
      }

      setMonthlyData(existing);
      await fetchRemainingMoney(selectedMonth, existing.id);
    } catch {
      message.error("Không thể tải dữ liệu tháng!");
    }
  };

  const fetchRemainingMoney = async (
    selectedMonth: string,
    monthlyCategoryId: number
  ) => {
    try {
      const budgetRes = await fetch(
        `http://localhost:8080/monthlyBudgets?month=${selectedMonth}`
      );
      const budgetData = await budgetRes.json();
      const budgetValue = budgetData[0]?.budget ?? 0;

      const transRes = await fetch(
        `http://localhost:8080/transactions?monthlyCategoryId=${monthlyCategoryId}`
      );
      const transData = await transRes.json();
      const totalSpent = transData.reduce(
        (sum: number, t: any) => sum + (t.total ?? 0),
        0
      );

      setRemaining(budgetValue - totalSpent);
    } catch {
      setRemaining(0);
    }
  };

  useEffect(() => {
    if (month) {
      const formattedMonth = month.format("YYYY-MM");
      fetchMonthlyData(formattedMonth);
    }
  }, [month]);

  // ✅ Sửa phần kiểm tra giới hạn tổng
  const handleAddCategory = async () => {
    if (!selectedCategory || !limit || !month) {
      message.warning("Vui lòng chọn danh mục, nhập giới hạn và tháng!");
      return;
    }

    const formattedMonth = month.format("YYYY-MM");
    const limitValue = Number(limit);

    if (isNaN(limitValue) || limitValue <= 0) {
      message.warning("Giới hạn phải là số dương!");
      return;
    }

    // ✅ Lấy ngân sách tháng
    const budgetRes = await fetch(
      `http://localhost:8080/monthlyBudgets?month=${formattedMonth}`
    );
    const budgetData = await budgetRes.json();
    const budgetValue = budgetData[0]?.budget ?? 0;

    // ✅ Tính tổng limit hiện tại
    const totalCurrentLimit =
      monthlyData?.categories.reduce((sum, c) => sum + c.limit, 0) || 0;

    if (totalCurrentLimit + limitValue > budgetValue) {
      message.warning("Tổng giới hạn các danh mục vượt quá ngân sách tháng!");
      return;
    }

    const isExist = monthlyData?.categories.some(
      (c) => c.categoryId === selectedCategory
    );
    if (isExist) {
      message.warning("Danh mục này đã tồn tại trong tháng!");
      return;
    }

    const newCat = {
      id: Date.now(),
      categoryId: selectedCategory,
      limit: limitValue,
    };

    try {
      const updatedCategories = [...(monthlyData?.categories || []), newCat];
      const res = await fetch(
        `http://localhost:8080/monthlyCategories/${monthlyData?.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: updatedCategories }),
        }
      );
      if (!res.ok) throw new Error("Không thể cập nhật danh mục!");
      setMonthlyData({ ...monthlyData!, categories: updatedCategories });
      message.success("Thêm danh mục thành công!");
      setSelectedCategory(null);
      setLimit("");
      await fetchRemainingMoney(formattedMonth, monthlyData!.id);
    } catch {
      message.error("Không thể thêm danh mục!");
    }
  };

  

  const handleLogoutClick = () => setIsLogoutModalVisible(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/userlogin";
  };
  const handleCancelLogout = () => setIsLogoutModalVisible(false);

  const currentMonth = month ? month.format("YYYY-MM") : "";
  const filteredCategories =
    monthlyData && monthlyData.month === currentMonth
      ? monthlyData.categories
      : [];

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
            icon={<InfoCircleOutlined />}
            className="side-btn"
            block
            onClick={() => navigate("/information")}
          >
            Information
          </Button>
          <Button
            type="primary"
            icon={<BarsOutlined />}
            className="side-btn active"
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

            {/* --- Chỉ hiển thị Số tiền còn lại --- */}
            <div className="card money-card">
              <Text className="muted">💵 Số tiền còn lại</Text>
              <div className="big-green">
                {remaining.toLocaleString()} VND
              </div>
            </div>

            <div className="card month-card">
              <Text className="muted">📅 Chọn tháng:</Text>
              <DatePicker
                picker="month"
                style={{ width: 220 }}
                value={month}
                onChange={setMonth}
              />
            </div>

            <div className="card category-container">
              <div className="category-header">
                <span className="emoji">💼</span> Quản lý danh mục (Theo tháng)
              </div>

              <div className="category-inputs">
                <Select
                  placeholder="Tên danh mục"
                  style={{ width: "35%" }}
                  value={selectedCategory || undefined}
                  onChange={(v) => setSelectedCategory(v)}
                >
                  {categories
                    .filter((c) => c.status === "Active")
                    .map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                </Select>
                <Input
                  placeholder="Giới hạn (VND)"
                  style={{ width: "35%" }}
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
                <Button
                  type="primary"
                  style={{
                    width: "25%",
                    fontWeight: 500,
                    background: "#4F46E5",
                    border: "none",
                  }}
                  onClick={handleAddCategory}
                >
                  Thêm danh mục
                </Button>
              </div>

              <div className="category-grid">
                {filteredCategories.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <div key={item.id} className="category-item">
                      <div className="category-left">
                        {cat?.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <DollarOutlined />
                        )}
                      </div>
                      <div className="category-right">
                        <div className="cat-name">{cat?.name}</div>
                        <div className="cat-limit">
                          {(item.limit ?? 0).toLocaleString()} ₫
                        </div>
                      </div>
                      
                    </div>
                  );
                })}
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
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
      </Modal>
    </div>
  );
};

export default CategoryPage;
