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
          outline: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            margin: "0 4px",
            cursor: "pointer",
            outline: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          outline: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleNextClick}
        disabled={current === totalPages}
      >
        {">"}
      </button>
    </div>
  );
};

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
}

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<User[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8080/profiles")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
    style: {
      borderBottom: location.pathname === "/dashboard" ? "1px solid #4338CA" : "none",
      padding: "8px 16px",
    },
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
    style: {
      borderBottom: location.pathname === "/users" ? "1px solid #4338CA" : "none",
      padding: "8px 16px",
    },
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
    style: {
      borderBottom: location.pathname === "/category" ? "1px solid #4338CA" : "none",
      padding: "8px 16px",
    },
  },
];

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%", // 🔥 canh thẳng hàng với header
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: 110,
              height: 28,
              backgroundColor:
                status === "Active"
                  ? "rgba(82,196,26,0.1)"
                  : "rgba(255,77,79,0.1)",
              color: status === "Active" ? "#52c41a" : "#ff4d4f",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor:
                  status === "Active" ? "#52c41a" : "#ff4d4f",
              }}
            />
            {status}
          </span>
        </div>
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
          onClick={() =>
            handleLockUnlock(record.id, record.status === "Active")
          }
        />
      ),
    },
  ];

  const handleLockUnlock = (id: number, isLock: boolean) => {
    const updated = data.map((item) =>
      item.id === id
        ? { ...item, status: isLock ? "Deactivate" : "Active" }
        : item
    );
    setData(updated);

    fetch(`http://localhost:8080/profiles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        updated.find((item) => item.id === id)
      ),
    })
      .then((response) => response.json())
      .then(() =>
        message.success(`User ${isLock ? "locked" : "unlocked"} successfully!`)
      )
      .catch((error) => console.error("Error updating data:", error));
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 8;

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sider
        width={240}
        style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
      >
        <div
          style={{
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            <span style={{ color: "#000" }}>Financial</span>{" "}
            <span style={{ color: "#4338CA" }}>Manager</span>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={["/users"]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: "16px" }}
          inlineIndent={0}
        />

        <div
          style={{
            position: "absolute",
            bottom: "0px",
            left: -100,
            right: 0,
          }}
        >
          <Button
            type="link"
            block
            style={{
              height: "40px",
              color: "#000000",
              border: "1px solid #f0f0f0",
              borderRadius: "6px",
              textAlign: "left",
              paddingLeft: "12px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
            }}
            icon={
              <img
                src={signOutIcon}
                alt="Sign Out"
                style={{ width: 16, height: 16, marginRight: 8 }}
              />
            }
          >
            Sign out
          </Button>
        </div>
      </Sider>

      <Layout style={{ background: "#fff" }}>
        <Header
          style={{
            height: "50px",
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            size="small"
          />
        </Header>

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <div style={{ marginBottom: 36, textAlign: "right", marginTop: 36 }}>
            <Input
              placeholder="Search here..."
              suffix={<SearchOutlined />}
              style={{ width: 250, height: 45 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            pagination={false}
            bordered={false}
          />

          <div
            style={{
              marginRight: 120,
              marginTop: 40,
              display: "flex",
              justifyContent: "flex-end",
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
