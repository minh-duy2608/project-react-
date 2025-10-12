import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Typography,
  DatePicker,
  Table,
  message,
  Popconfirm,
  Empty,
} from "antd";
import {
  InfoCircleOutlined,
  BarsOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "./HistoryPage.css";

const { Title, Text } = Typography;

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [month, setMonth] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [remainingMoney, setRemainingMoney] = useState(0);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [monthlyCategories, setMonthlyCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMonthlyCategories();
    fetchCategories();
  }, []);

  // 🟢 Lấy dữ liệu Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải dữ liệu danh mục!");
    }
  };

  // 🟢 Lấy dữ liệu Monthly Categories
  const fetchMonthlyCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/monthlyCategories");
      setMonthlyCategories(res.data);
    } catch (error) {
      console.error("Error fetching monthly categories:", error);
      message.error("Không thể tải dữ liệu tháng!");
    }
  };

  // 🟢 Lấy ngân sách & giao dịch khi chọn tháng
  const fetchBudgetAndTransactions = async (selectedMonth: string) => {
    try {
      // Normalize month format to match db.json
      const normalizedMonth = dayjs(selectedMonth, "MM/YYYY").format("YYYY-MM");
      const monthDisplay = dayjs(selectedMonth, "MM/YYYY").format("MM/YYYY");

      console.log("Fetching data for month:", normalizedMonth);

      // Fetch budget
      const budgetRes = await axios.get(
        `http://localhost:8080/monthlyBudgets?month=${normalizedMonth}`
      );
      const budgetValue = budgetRes.data[0]?.budget || 0;
      console.log("Budget fetched:", budgetValue);

      // Fetch monthlyCategories
      const monthData = await axios.get(
        `http://localhost:8080/monthlyCategories?month=${monthDisplay}`
      );
      console.log("Monthly categories fetched:", monthData.data);

      if (monthData.data.length === 0) {
        message.info(`Không có danh mục cho tháng ${monthDisplay}!`);
        setRemainingMoney(budgetValue);
        setTransactions([]);
        setFilteredTransactions([]);
        return;
      }

      const monthlyCategory = monthData.data[0];
      const monthlyCategoryId = monthlyCategory.id;
      console.log("Monthly Category ID:", monthlyCategoryId);

      // Fetch transactions
      const transRes = await axios.get(
        `http://localhost:8080/transactions?monthlyCategoryId=${monthlyCategoryId}`
      );
      console.log("Transactions fetched:", transRes.data);

      // Get valid category IDs from monthlyCategories
      const validCategoryIds = monthlyCategory.categories.map(
        (cat: any) => cat.categoryId
      );
      console.log("Valid Category IDs:", validCategoryIds);

      // Filter transactions
      const filteredTransactions = transRes.data
        .filter((t: any) => validCategoryIds.includes(t.categoryId))
        .map((t: any) => ({
          ...t,
          description: t.description || "", // Ensure Note is empty if not provided
        }));

      console.log("Filtered Transactions:", filteredTransactions);

      setTransactions(filteredTransactions);

      // Calculate remaining money
      const totalSpent = filteredTransactions.reduce(
        (sum: number, t: any) => sum + t.total,
        0
      );
      setRemainingMoney(budgetValue - totalSpent);
      console.log("Remaining Money:", remainingMoney);
    } catch (error) {
      console.error("Error fetching budget or transactions:", error);
      message.error("Không thể tải dữ liệu ngân sách hoặc giao dịch!");
      setRemainingMoney(0);
      setTransactions([]);
      setFilteredTransactions([]);
    }
  };

  // 🟢 Khi chọn tháng => tìm ID tháng tương ứng trong monthlyCategories => lọc transactions
  useEffect(() => {
    if (!month) {
      setFilteredTransactions([]);
      setRemainingMoney(0);
      return;
    }

    const selectedMonth = dayjs(month).format("MM/YYYY");
    fetchBudgetAndTransactions(selectedMonth);
  }, [month, monthlyCategories]);

  // 🟢 Cập nhật filteredTransactions khi transactions hoặc searchValue thay đổi
  useEffect(() => {
    if (transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    const filtered = transactions.filter((t) =>
      t.description?.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredTransactions(filtered.sort((a, b) => b.total - a.total));
  }, [transactions, searchValue]);

  const handleAdd = async () => {
    if (!amount) {
      message.warning("Vui lòng nhập số tiền!");
      return;
    }

    if (!month) {
      message.warning("Vui lòng chọn tháng trước khi thêm giao dịch!");
      return;
    }

    const selectedMonth = dayjs(month).format("MM/YYYY");
    const matched = monthlyCategories.find((m) => m.month === selectedMonth);

    if (!matched) {
      message.warning("Tháng này chưa được tạo trong hệ thống!");
      return;
    }

    // Ensure the categoryId is one of the valid categories for the selected month
    const validCategoryIds = matched.categories.map((cat: any) => cat.categoryId);
    const defaultCategoryId = validCategoryIds[0] || 1; // Fallback to 1 if no valid categories

    const newItem = {
      id: Date.now(),
      createdDate: dayjs().format("YYYY-MM-DD"),
      total: Number(amount),
      description: note || "", // Note is empty if not provided
      categoryId: defaultCategoryId,
      monthlyCategoryId: matched.id,
    };

    try {
      await axios.post("http://localhost:8080/transactions", newItem);
      setTransactions([...transactions, newItem]);
      message.success("Đã thêm giao dịch!");
      setAmount("");
      setNote("");
      // Cập nhật lại số tiền còn lại
      fetchBudgetAndTransactions(selectedMonth);
    } catch (error) {
      console.error("Error adding transaction:", error);
      message.error("Không thể thêm giao dịch!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      message.success("Đã xóa giao dịch!");
      // Cập nhật lại số tiền còn lại
      const selectedMonth = dayjs(month).format("MM/YYYY");
      fetchBudgetAndTransactions(selectedMonth);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Không thể xóa giao dịch!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Không xác định";
      },
    },
    {
      title: "Budget",
      dataIndex: "total",
      render: (v: any) => `${v.toLocaleString()} VND`,
    },
    {
      title: "Note",
      dataIndex: "description",
      render: (text: string) => text || "—",
    },
    {
      title: "Actions",
      render: (record: any) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      ),
    },
  ];

  const isInformation = location.pathname === "/information";
  const isCategory = location.pathname === "/categoryUser";
  const isHistory = location.pathname === "/history";

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
              <div
                className="dropdown-item"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/userlogin";
                }}
              >
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
            block
            className={`side-btn ${isInformation ? "active" : ""}`}
            onClick={() => navigate("/information")}
          >
            Information
          </Button>
          <Button
            icon={<BarsOutlined />}
            block
            className={`side-btn ${isCategory ? "active" : ""}`}
            onClick={() => navigate("/categoryUser")}
          >
            Category
          </Button>
          <Button
            icon={<HistoryOutlined />}
            block
            className={`side-btn ${isHistory ? "active" : ""}`}
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        </aside>

        <section className="content">
          <div className="banner">
            <div className="banner-title">💸 Lịch sử chi tiêu hàng tháng</div>
            <div className="banner-sub">
              Theo dõi chi tiết các giao dịch và ngân sách
            </div>
          </div>

          <div className="center-column">
            <Title level={3} className="page-title">
              📊 Quản Lý Giao Dịch
            </Title>

            <div className="container-fixed">
              <div className="card money-card">
                <Text className="muted">Số tiền còn lại</Text>
                <div className="big-green">
                  {remainingMoney.toLocaleString()} VND
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
            </div>

            <div className="container-fixed">
              <div className="card transaction-input">
                <Input
                  placeholder="Số tiền"
                  style={{ width: "30%" }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  placeholder="Tiền chi tiêu"
                  style={{
                    width: "30%",
                    background: "#DEE2E6",
                    border: "1px solid #DEE2E6",
                    color: "#111",
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                  value={
                    month
                      ? monthlyCategories.find(
                          (m) => m.month === dayjs(month).format("MM/YYYY")
                        )
                        ? "Tiền chi tiêu"
                        : "Chưa có danh mục"
                      : "Chọn tháng"
                  }
                  readOnly
                />
                <Input
                  placeholder="Ghi chú"
                  style={{ width: "30%" }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  type="primary"
                  style={{ width: "10%", background: "#4F46E5" }}
                  onClick={handleAdd}
                >
                  Thêm
                </Button>
              </div>

              <div className="card transaction-table">
                <div className="table-header">
                  <Text strong>📑 Lịch sử giao dịch (theo tháng)</Text>
                  <div className="table-actions">
                    <Button className="sort-btn">Sắp xếp theo giá</Button>
                    <Input.Search
                      placeholder="Tìm nội dung"
                      style={{ width: 240 }}
                      onSearch={setSearchValue}
                      allowClear
                    />
                  </div>
                </div>

                {filteredTransactions.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                  />
                ) : (
                  <Empty
                    description={
                      month
                        ? "Không có giao dịch nào trong tháng này"
                        : "Vui lòng chọn tháng để xem giao dịch"
                    }
                    style={{ marginTop: 20 }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;