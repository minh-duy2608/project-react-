import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Table,
  Input,
  Button,
  Avatar,
  message,
  Modal,
  Upload,
} from "antd";
import {
  LogoutOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

// Icons
import lockIcon from "../../icons/LockIcon.png";
import unlockIcon from "../../icons/ActiveIcon.png";
import dashboardIcon from "../../icons/Dashboard.png";
import userIcon from "../../icons/UserIcon.png";
import categoryIcon from "../../icons/UserCategory.png";
import signOutIcon from "../../icons/SignOutIcon.png";
import moneySavingIcon from "../../icons/TienTichLuy.png";
import gasMoneyIcon from "../../icons/TienXang.png";
import foodMoneyIcon from "../../icons/TienAn.png";
import entertainmentMoneyIcon from "../../icons/TienDiChoi.png";
import childMoneyIcon from "../../icons/TienChoCon.png";
import backupMoneyIcon from "../../icons/TienDuPhong.png";
import repairMoneyIcon from "../../icons/TienSuaDo.png";
import coffeeMoneyIcon from "../../icons/TienCaPhe.png";
import deleteIcon from "../../icons/DeleteIcon.png";

const { Header, Sider, Content } = Layout;

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ current, total, pageSize, onChange }) => {
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
          boxShadow: "none",
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
            boxShadow: "none",
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
          boxShadow: "none",
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

interface Category {
  id: number;
  name: string;
  image: string;
  status: string;
}

const Category: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "", status: "Active" });
  const [editCategory, setEditCategory] = useState({ id: 0, name: "", image: "", status: "Active" });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [editUploadedImage, setEditUploadedImage] = useState<string | null>(null);
  const [editUploadedFileName, setEditUploadedFileName] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8080/categories')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const menuItems = [
    {
      key: "/dashboard",
      label: (
        <Link
          to="/dashboard"
          style={{
            color: location.pathname === "/dashboard" ? "#4338CA" : "#000",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={dashboardIcon}
            alt="Dashboard"
            style={{ width: 16, height: 16, marginRight: 8 }}
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
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={userIcon}
            alt="Users"
            style={{ width: 16, height: 16, marginRight: 8 }}
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
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={categoryIcon}
            alt="Category"
            style={{ width: 16, height: 16, marginRight: 8 }}
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
    { 
      title: "Image", 
      dataIndex: "image", 
      key: "image", 
      render: (image: string) => (
        <img 
          src={image} 
          alt="Category Icon" 
          style={{ width: 24, height: 24, objectFit: 'contain' }} 
        />
      ) 
    },
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
            backgroundColor: status === "Active" ? "rgba(82,196,26,0.1)" : "rgba(255,77,79,0.1)",
            color: status === "Active" ? "#52c41a" : "#ff4d4f",
            borderRadius: "12px",
            padding: "2px 10px",
            fontSize: "13px",
            fontWeight: 500,
            minWidth: 100,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: status === "Active" ? "#52c41a" : "#ff4d4f",
              display: "inline-block",
            }}
          />
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: { status: string; id: number; }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            style={{
              backgroundColor: "#FF9500",
              color: "#fff",
              border: "none",
              padding: "0 15px",
              height: "30px",
              borderRadius: "4px",
              width: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            style={{
              backgroundColor: record.status === "Active" ? "#ff4d4f" : "#52c41a",
              color: "#fff",
              border: "none",
              padding: "0 15px",
              height: "30px",
              borderRadius: "4px",
              width: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleLockUnlock(record.id, record.status === "Active")}
          >
            {record.status === "Active" ? "Block" : "Unblock"}
          </Button>
        </div>
      ),
    },
  ];

  const handleLockUnlock = (id: number, isLock: boolean) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: isLock ? "Inactive" : "Active",
            }
          : item
      )
    );
    fetch(`http://localhost:8080/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data.find(item => item.id === id), status: isLock ? "Inactive" : "Active" }),
    })
      .then(response => response.json())
      .then(() => message.success(`Category ${isLock ? "blocked" : "unblocked"} successfully!`))
      .catch(error => console.error('Error updating data:', error));
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 8;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!newCategory.name || !newCategory.image) {
      message.error("Please fill all fields!");
      return;
    }
    const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    const newCategoryData = { id: newId, ...newCategory };

    fetch('http://localhost:8080/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategoryData),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add category');
        return response.json();
      })
      .then(() => {
        setData([...data, newCategoryData]);
        setNewCategory({ name: "", image: "", status: "Active" });
        setUploadedImage(null);
        setUploadedFileName(null);
        setIsModalVisible(false);
        message.success("Category added successfully!");
      })
      .catch(error => {
        console.error('Error adding category:', error);
        message.error("Failed to add category!");
      });
  };

  const handleCancel = () => {
    setNewCategory({ name: "", image: "", status: "Active" });
    setUploadedImage(null);
    setUploadedFileName(null);
    setIsModalVisible(false);
  };

  const handleEdit = (id: number) => {
    const categoryToEdit = data.find(item => item.id === id);
    if (categoryToEdit) {
      setEditCategory({ ...categoryToEdit });
      setEditUploadedImage(categoryToEdit.image);
      setEditUploadedFileName("existing_image.png"); // Tên file mẫu, có thể thay đổi
      setIsEditModalVisible(true);
    }
  };

  const handleEditOk = () => {
    if (!editCategory.name || !editCategory.image) {
      message.error("Please fill all fields!");
      return;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item.id === editCategory.id ? { ...editCategory } : item
      )
    );
    fetch(`http://localhost:8080/categories/${editCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCategory),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to edit category');
        return response.json();
      })
      .then(() => {
        setIsEditModalVisible(false);
        message.success("Category edited successfully!");
      })
      .catch(error => {
        console.error('Error editing category:', error);
        message.error("Failed to edit category!");
      });
  };

  const handleEditCancel = () => {
    setEditCategory({ id: 0, name: "", image: "", status: "Active" });
    setEditUploadedImage(null);
    setEditUploadedFileName(null);
    setIsEditModalVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, name: e.target.value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCategory({ ...editCategory, name: e.target.value });
  };

  const handleImageChange = (value: string) => {
    setNewCategory({ ...newCategory, image: value });
  };

  const handleEditImageChange = (value: string) => {
    setEditCategory({ ...editCategory, image: value });
  };

  const handleStatusChange = (value: string) => {
    setNewCategory({ ...newCategory, status: value });
  };

  const handleEditStatusChange = (value: string) => {
    setEditCategory({ ...editCategory, status: value });
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setNewCategory({ ...newCategory, image: imageUrl });
      setUploadedImage(imageUrl);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleEditUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setEditCategory({ ...editCategory, image: imageUrl });
      setEditUploadedImage(imageUrl);
      setEditUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setUploadedFileName(null);
    setNewCategory({ ...newCategory, image: "" });
  };

  const handleEditDeleteImage = () => {
    setEditUploadedImage(null);
    setEditUploadedFileName(null);
    setEditCategory({ ...editCategory, image: "" });
  };

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
          defaultSelectedKeys={["/category"]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: "16px" }}
          inlineIndent={0}
        />

        <div style={{ position: "absolute", bottom: "0px", left: -100, right: 0 }}>
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
            icon={<img src={signOutIcon} alt="Sign Out" style={{ width: 16, height: 16, marginRight: 8 }} />}
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
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" size="small" />
        </Header>

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36 }}>
            <Button
              style={{
                backgroundColor: "#4338CA",
                color: "#fff",
                border: "none",
                padding: "0 15px",
                height: "45px",
                borderRadius: "4px",
              }}
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add Category
            </Button>
            <Input
              placeholder="Search here..."
              suffix={<SearchOutlined />}
              style={{ width: 250, height: 45 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            pagination={false}
            bordered={false}
          />

          <div style={{ marginRight: 120, marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
            <CustomPagination
              current={currentPage}
              total={filteredData.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
            />
          </div>

          <Modal
            title="Add New Category"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Save"
            cancelText="Cancel"
            centered
          >
            <div style={{ marginBottom: 16 }}>
              <label>Name <span style={{ color: "red" }}>*</span></label>
              <Input
                value={newCategory.name}
                onChange={handleInputChange}
                style={{ width: "100%", marginTop: 8, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Upload
                name="image"
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/png"
                customRequest={() => {}}
              >
                <div
                  style={{
                    width: "2620%",
                    height: 35,
                    backgroundColor: "#FF7800",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
              </Upload>
            </div>
            {uploadedImage && (
              <div
                style={{
                  marginBottom: 16,
                  position: "relative",
                  backgroundColor: "rgba(128, 128, 128, 0.3)",
                  padding: 10,
                  borderRadius: 4,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={uploadedImage}
                    alt="Uploaded Icon"
                    style={{ width: 50, height: 50, objectFit: "contain", verticalAlign: "middle" }}
                  />
                  <span style={{ marginLeft: 10, fontSize: "12px", color: "#666", verticalAlign: "middle" }}>
                    {uploadedFileName}
                  </span>
                </div>
                <img
                  src={deleteIcon}
                  alt="Delete Icon"
                  style={{ width: 24, height: 24, cursor: "pointer" }}
                  onClick={handleDeleteImage}
                />
              </div>
            )}
            <hr />
          </Modal>

          <Modal
            title="Edit Category"
            visible={isEditModalVisible}
            onOk={handleEditOk}
            onCancel={handleEditCancel}
            okText="Save"
            cancelText="Cancel"
            centered
          >
            <div style={{ marginBottom: 16 }}>
              <label>Name <span style={{ color: "red" }}>*</span></label>
              <Input
                value={editCategory.name}
                onChange={handleEditInputChange}
                style={{ width: "100%", marginTop: 8, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Upload
                name="image"
                beforeUpload={handleEditUpload}
                showUploadList={false}
                accept="image/png"
                customRequest={() => {}}
              >
                <div
                  style={{
                    width: "2620%",
                    height: 35,
                    backgroundColor: "#FF7800",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
              </Upload>
            </div>
            {editUploadedImage && (
              <div
                style={{
                  marginBottom: 16,
                  position: "relative",
                  backgroundColor: "rgba(128, 128, 128, 0.3)",
                  padding: 10,
                  borderRadius: 4,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={editUploadedImage}
                    alt="Uploaded Icon"
                    style={{ width: 50, height: 50, objectFit: "contain", verticalAlign: "middle" }}
                  />
                  <span style={{ marginLeft: 10, fontSize: "12px", color: "#666", verticalAlign: "middle" }}>
                    {editUploadedFileName}
                  </span>
                </div>
                <img
                  src={deleteIcon}
                  alt="Delete Icon"
                  style={{ width: 24, height: 24, cursor: "pointer" }}
                  onClick={handleEditDeleteImage}
                />
              </div>
            )}
            <hr />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Category;