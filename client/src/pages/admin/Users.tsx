import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Table,
  Input,
  Button,
  Avatar,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import lockIcon from "../../icons/LockIcon.png";
import unlockIcon from "../../icons/ActiveIcon.png";
import dashboardIcon from "../../icons/Dashboard.png";
import userIcon from "../../icons/UserIcon.png";
import categoryIcon from "../../icons/UserCategory.png";
import signOutIcon from "../../icons/SignOutIcon.png";

const { Header, Sider, Content } = Layout;

// ✅ CustomPagination giữ nguyên UI cũ
interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}
const CustomPagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const [isPrevClicked, setIsPrevClicked] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);

  const pagesToShow = [];
  let startPage = Math.max(1, current - 2);
  let endPage = Math.min(totalPages, current + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) endPage = Math.min(5, totalPages);
    else if (endPage === totalPages) startPage = Math.max(totalPages - 4, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const handlePrevClick = () => {
    if (current > 1) {
      setIsPrevClicked(true);
      onChange(current - 1);
      setTimeout(() => setIsPrevClicked(false), 200);
    }
  };

  const handleNextClick = () => {
    if (current < totalPages) {
      setIsNextClicked(true);
      onChange(current + 1);
      setTimeout(() => setIsNextClicked(false), 200);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <button
        style={{
          width: 40,
          height: 40,
          border: "1px solid #d9d9d9",
          borderRadius: 4,
          background: isPrevClicked ? "#4338CA" : "transparent",
          color: isPrevClicked ? "#fff" : "#000",
          cursor: current === 1 ? "default" : "pointer",
        }}
        onClick={handlePrevClick}
        disabled={current === 1}
      >
        {"<"}
      </button>

      {pagesToShow.map((page) => (
        <button
          key={page}
          style={{
            width: 40,
            height: 40,
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            background: current === page ? "#4338CA" : "transparent",
            color: current === page ? "#fff" : "#000",
            cursor: "pointer",
          }}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        style={{
          width: 40,
          height: 40,
          border: "1px solid #d9d9d9",
          borderRadius: 4,
          background: isNextClicked ? "#4338CA" : "transparent",
          color: isNextClicked ? "#fff" : "#000",
          cursor: current === totalPages ? "default" : "pointer",
        }}
        onClick={handleNextClick}
        disabled={current === totalPages}
      >
        {">"}
      </button>
    </div>
  );
};

// ================================

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
}

const Users: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // ✅ Lấy dữ liệu 1 lần duy nhất (fetch all)
  useEffect(() => {
    fetch("http://localhost:8080/profiles")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setFilteredData(res);
      })
      .catch(() => message.error("Không thể tải danh sách người dùng!"));
  }, []);

  // ✅ Lọc theo ô tìm kiếm (không gọi API)
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // ✅ Xử lý khóa/mở tài khoản
  const handleLockUnlock = (id: number, isLock: boolean) => {
    const updated = data.map((item) =>
      item.id === id
        ? { ...item, status: isLock ? "Deactivate" : "Active" }
        : item
    );
    setData(updated);
    setFilteredData(updated);

    // Vẫn lưu vào db.json để giữ dữ liệu
    fetch(`http://localhost:8080/profiles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.find((i) => i.id === id)),
    })
      .then(() =>
        message.success(`User ${isLock ? "locked" : "unlocked"} successfully!`)
      )
      .catch(() => message.error("Lỗi khi cập nhật trạng thái!"));
  };

  // ✅ Phân trang logic
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { title: "STT", dataIndex: "id", key: "id", width: 70 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: 500,
            backgroundColor:
              status === "Active"
                ? "rgba(82,196,26,0.1)"
                : "rgba(255,77,79,0.1)",
            color: status === "Active" ? "#52c41a" : "#ff4d4f",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: status === "Active" ? "#52c41a" : "#ff4d4f",
            }}
          />
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <img
          src={record.status === "Active" ? unlockIcon : lockIcon}
          alt={record.status === "Active" ? "Unlock" : "Lock"}
          style={{ width: 15, height: 20, cursor: "pointer" }}
          onClick={() => handleLockUnlock(record.id, record.status === "Active")}
        />
      ),
    },
  ];

  // ✅ Menu trái giữ nguyên UI cũ
  const menuItems = [
    {
      key: "/dashboard",
      label: (
        <Link
          to="/dashboard"
          style={{
            color: location.pathname === "/dashboard" ? "#4338CA" : "#000",
            fontWeight: location.pathname === "/dashboard" ? 700 : 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={dashboardIcon}
            alt="Dashboard"
            style={{
              width: 16,
              height: 16,
              marginRight: 8,
              filter: location.pathname === "/dashboard" ? "none" : "grayscale(100%)",
            }}
          />
          Dashboard
        </Link>
      ),
    },
    {
      key: "/users",
      label: (
        <Link
          to="/users"
          style={{
            color: location.pathname === "/users" ? "#4338CA" : "#000",
            fontWeight: location.pathname === "/users" ? 700 : 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={userIcon}
            alt="Users"
            style={{
              width: 16,
              height: 16,
              marginRight: 8,
              filter: location.pathname === "/users" ? "none" : "grayscale(100%)",
            }}
          />
          Users
        </Link>
      ),
    },
    {
      key: "/category",
      label: (
        <Link
          to="/category"
          style={{
            color: location.pathname === "/category" ? "#4338CA" : "#000",
            fontWeight: location.pathname === "/category" ? 700 : 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={categoryIcon}
            alt="Category"
            style={{
              width: 16,
              height: 16,
              marginRight: 8,
              filter: location.pathname === "/category" ? "none" : "grayscale(100%)",
            }}
          />
          Category
        </Link>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Sidebar */}
      <Sider width={240} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
        <div
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: "bold" }}>
            <span>Financial </span>
            <span style={{ color: "#4338CA" }}>Manager</span>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ marginTop: 16, borderRight: 0 }}
        />

        <div style={{ position: "absolute", bottom: 16, left: 20 }}>
          <Button
            type="link"
            icon={<img src={signOutIcon} alt="Sign Out" width={16} />}
            style={{ color: "#000" }}
          >
            Sign out
          </Button>
        </div>
      </Sider>

      {/* Content */}
      <Layout style={{ background: "#fff" }}>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 24,
          }}
        >
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        </Header>

        <Content style={{ margin: 24, padding: 24, background: "#fff" }}>
          <div style={{ marginBottom: 36, textAlign: "right" }}>
            <Input
              placeholder="Search here..."
              suffix={<SearchOutlined />}
              style={{ width: 250, height: 45 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            rowKey="id"
          />

          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 120,
            }}
          >
            <CustomPagination
              current={currentPage}
              total={filteredData.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Users;
