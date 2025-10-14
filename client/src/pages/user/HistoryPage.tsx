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
  Select,
} from "antd";
import {
  InfoCircleOutlined,
  BarsOutlined,
  HistoryOutlined,
  DeleteOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "./HistoryPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Phân trang logic (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMonthlyCategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/categories");
      setCategories(res.data);
    } catch {
      message.error("Không thể tải dữ liệu danh mục!");
    }
  };

  const fetchMonthlyCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/monthlyCategories");
      setMonthlyCategories(res.data);
    } catch {
      message.error("Không thể tải dữ liệu tháng!");
    }
  };

  const fetchBudgetAndTransactions = async (selectedMonth: string) => {
    try {
      const normalizedMonth = dayjs(selectedMonth, "MM/YYYY").format("YYYY-MM");
      const monthDisplay = dayjs(selectedMonth, "MM/YYYY").format("MM/YYYY");

      const budgetRes = await axios.get(
        `http://localhost:8080/monthlyBudgets?month=${normalizedMonth}`
      );
      const budgetValue = budgetRes.data[0]?.budget || 0;

      const monthData = await axios.get(
        `http://localhost:8080/monthlyCategories?month=${normalizedMonth}`
      );
      if (monthData.data.length === 0) {
        message.info(`Không có danh mục cho tháng ${monthDisplay}!`);
        setRemainingMoney(budgetValue);
        setTransactions([]);
        setFilteredTransactions([]);
        return;
      }

      const monthlyCategory = monthData.data[0];
      const monthlyCategoryId = monthlyCategory.id;

      const transRes = await axios.get(
        `http://localhost:8080/transactions?monthlyCategoryId=${monthlyCategoryId}`
      );

      const allData = monthlyCategory.categories.map((catItem: any) => {
        const categoryInfo = categories.find(
          (c) => c.id === catItem.categoryId
        );
        const transaction = transRes.data.find(
          (t: any) => t.categoryId === catItem.categoryId
        );
        return {
          id: catItem.id,
          categoryId: catItem.categoryId,
          categoryName: categoryInfo ? categoryInfo.name : "Không xác định",
          total: transaction ? transaction.total : 0,
          description: transaction ? transaction.description : "—",
          limit: catItem.limit,
        };
      });

      const totalSpent = transRes.data.reduce(
        (sum: number, t: any) => sum + t.total,
        0
      );
      const remaining = budgetValue - totalSpent;

      setTransactions(allData);
      setRemainingMoney(remaining >= 0 ? remaining : 0);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu!");
      setRemainingMoney(0);
      setTransactions([]);
      setFilteredTransactions([]);
    }
  };

  useEffect(() => {
    if (!month) {
      setFilteredTransactions([]);
      setRemainingMoney(0);
      return;
    }
    const selectedMonth = dayjs(month).format("MM/YYYY");
    fetchBudgetAndTransactions(selectedMonth);
  }, [month, monthlyCategories]);

  useEffect(() => {
    if (transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    const filtered = transactions.filter((t) =>
      t.categoryName?.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredTransactions(filtered.sort((a, b) => a.total - b.total));
    setCurrentPage(1);
  }, [transactions, searchValue]);

  const triggerWarning = (
    categoryName: string,
    spent: number,
    limit: number
  ) => {
    setWarningMessage(
      `Danh mục "${categoryName}" đã vượt giới hạn: ${spent.toLocaleString()} / ${limit.toLocaleString()} VND`
    );
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2000);
  };

  const handleAdd = async () => {
    if (!amount || !month || !selectedCategory) {
      message.warning("Vui lòng chọn danh mục và nhập đầy đủ thông tin!");
      return;
    }

    const amountValue = Number(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      message.warning("Số tiền phải lớn hơn 0!");
      return;
    }

    const normalizedMonth = dayjs(month).format("YYYY-MM");
    const matched = monthlyCategories.find((m) => m.month === normalizedMonth);
    if (!matched) {
      message.warning("Tháng này chưa được tạo trong hệ thống!");
      return;
    }

    const categoryData = matched.categories.find(
      (cat: any) => cat.categoryId === selectedCategory
    );
    const limit = categoryData?.limit || 0;
    if (limit < 1) {
      message.warning("Danh mục này không có giới hạn chi tiêu!");
      return;
    }

    const transRes = await axios.get(
      `http://localhost:8080/transactions?monthlyCategoryId=${matched.id}&categoryId=${selectedCategory}`
    );

    const totalSpent = transRes.data.reduce(
      (sum: number, t: any) => sum + t.total,
      0
    );

    if (totalSpent + amountValue > limit) {
      const categoryName =
        categories.find((c) => c.id === selectedCategory)?.name ||
        "Không xác định";
      triggerWarning(categoryName, totalSpent + amountValue, limit);
      return;
    }

    const newItem = {
      id: Date.now(),
      createdDate: dayjs().format("YYYY-MM-DD"),
      total: amountValue,
      description: note || "",
      categoryId: selectedCategory,
      monthlyCategoryId: matched.id,
    };

    try {
      await axios.post("http://localhost:8080/transactions", newItem);
      message.success("Đã thêm giao dịch!");
      setAmount("");
      setNote("");
      setSelectedCategory(null);
      fetchBudgetAndTransactions(dayjs(month).format("MM/YYYY"));
    } catch {
      message.error("Không thể thêm giao dịch!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/transactions/${id}`);
      message.success("Đã xóa giao dịch!");
      fetchBudgetAndTransactions(dayjs(month).format("MM/YYYY"));
    } catch {
      message.error("Không thể xóa giao dịch!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
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

  // ✅ Chỉ xử lý dữ liệu bằng logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="page-root">
      {/* Giữ nguyên toàn bộ UI và CSS */}
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
        {/* sidebar giữ nguyên */}
        <aside className="sidebar">
          <Button
            icon={<InfoCircleOutlined />}
            block
            className={`side-btn ${
              location.pathname === "/information" ? "active" : ""
            }`}
            onClick={() => navigate("/information")}
          >
            Information
          </Button>
          <Button
            icon={<BarsOutlined />}
            block
            className={`side-btn ${
              location.pathname === "/categoryUser" ? "active" : ""
            }`}
            onClick={() => navigate("/categoryUser")}
          >
            Category
          </Button>
          <Button
            icon={<HistoryOutlined />}
            block
            className={`side-btn ${
              location.pathname === "/history" ? "active" : ""
            }`}
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        </aside>

        {/* phần content giữ nguyên */}
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

            {/* giữ nguyên layout + Table UI */}
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
                <Select
                  placeholder="Chọn danh mục"
                  style={{ width: "30%" }}
                  value={selectedCategory ?? undefined}
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {transactions.map((cat) => (
                    <Option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </Option>
                  ))}
                </Select>
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
                      placeholder="Tìm theo tên danh mục"
                      style={{ width: 240 }}
                      onSearch={setSearchValue}
                      allowClear
                    />
                  </div>
                </div>

                {filteredTransactions.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={{
                      current: currentPage,
                      pageSize: itemsPerPage,
                      total: filteredTransactions.length,
                      onChange: (page) => setCurrentPage(page),
                    }}
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

      {/* cảnh báo giữ nguyên */}
      {showWarning && (
        <div className="warning-modal">
          <AlertOutlined />
          <div>
            <strong>Cảnh báo tài chính</strong>
            <div>{warningMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
