import { Layout, Menu, Typography, Card, Row, Col, Statistic, List, Avatar, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined, LogoutOutlined } from '@ant-design/icons';
import dashboardIcon from '../../icons/Dashboard.png';
import userIcon from '../../icons/UserIcon.png';
import categoryIcon from '../../icons/UserCategory.png';
import signOutIcon from '../../icons/SignOutIcon.png'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Header, Sider, Content } = Layout;
const { Title: AntdTitle, Text } = Typography;

export default function Dashboard() {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState("12 Months");

  const data: ChartData<'line', number[], string> = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        label: 'Main Line',
        data: [30000, 32000, 35000, 38000, 45591, 42000, 44000, 46000, 47000, 48000, 49000, 50000],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', 
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Shadow Line',
        data: [26000, 30000, 34000, 37000, 44591, 41000, 43000, 45000, 46000, 47000, 48000, 49000],
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            return `${context[0].label} 2025`;
          },
          label: (context: TooltipItem<'line'>) => {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#8B91A2',
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: false,
        grid: { 
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: { 
          callback: (value: number) => `$${value.toLocaleString()}`,
          color: '#8B91A2',
          font: { size: 12 },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 6,
        hoverBorderWidth: 2,
      },
    },
  };

  const menuItems = [
    {
      key: "/dashboard",
      label: (
        <Link
          to="/dashboard"
          style={{
            color: location.pathname === "/dashboard" ? "#4338CA" : "#000",
            fontWeight: 700,
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
            fontWeight: 600,
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
            fontWeight: 600,
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

  const recentCustomers = [
    { 
      name: 'Jenny Wilson', 
      email: 'jenny.wilson@gmail.com', 
      amount: '$11,234', 
      city: 'Austin',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel'
    },
    { 
      name: 'Devon Lane', 
      email: 'devon-lane@gmail.com', 
      amount: '$11,159', 
      city: 'New York',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel'
    },
    { 
      name: 'Jane Cooper', 
      email: 'jane-cooper@gmail.com', 
      amount: '$10,483', 
      city: 'Toledo',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel'
    },
    { 
      name: 'Dianne Russell', 
      email: 'dianne-russell@gmail.com', 
      amount: '$9,084', 
      city: 'Naples',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel'
    },
  ];

  const getTimeRangeButtons = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center' }}>
      {['12 Months', '6 Months', '30 Days', '7 Days'].map((range) => (
        <Button
          key={range}
          type={timeRange === range ? 'primary' : 'default'}
          size="small"
          onClick={() => setTimeRange(range)}
          style={{
            borderRadius: '4px',
            borderColor: timeRange === range ? '#1890ff' : '#d9d9d9',
            backgroundColor: timeRange === range ? '#1890ff' : 'transparent',
            color: timeRange === range ? '#fff' : '#000',
          }}
        >
          {range}
        </Button>
      ))}
    </div>
  );

  const getPercentageIcon = (isIncrease: boolean) => isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />;

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sider
        width={240}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
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
          defaultSelectedKeys={["/dashboard"]}
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
          <Row gutter={[32, 24]}>
            <Col span={6}>
              <Card 
                bodyStyle={{ padding: '16px' }} 
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#8B91A2', fontSize: '14px' }}>USER</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Statistic
                    value={1500}
                    valueStyle={{ color: "#000000", fontSize: '24px', fontWeight: 600 }}
                    style={{ margin: 0 }}
                  />
                  <div style={{ color: "#52c41a", fontSize: '14px', fontWeight: 500 }}>
                    +36% <ArrowUpOutlined />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card 
                bodyStyle={{ padding: '16px' }} 
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#8B91A2', fontSize: '14px' }}>CATEGORY</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Statistic
                    value={500}
                    valueStyle={{ color: "#000000", fontSize: '24px', fontWeight: 600 }}
                    style={{ margin: 0 }}
                  />
                  <div style={{ color: "#ff4d4f", fontSize: '14px', fontWeight: 500 }}>
                    +14% <ArrowDownOutlined />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card 
                bodyStyle={{ padding: '16px' }} 
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#8B91A2', fontSize: '14px' }}>SPENDING</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Statistic
                    value={84382}
                    valueStyle={{ color: "#000000", fontSize: '24px', fontWeight: 600 }}
                    style={{ margin: 0 }}
                  />
                  <div style={{ color: "#52c41a", fontSize: '14px', fontWeight: 500 }}>
                    +36% <ArrowUpOutlined />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card 
                bodyStyle={{ padding: '16px' }} 
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#8B91A2', fontSize: '14px' }}>TOTAL MONEY</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Statistic
                    value={3493022}
                    valueStyle={{ color: "#000000", fontSize: '24px', fontWeight: 600 }}
                    prefix="$"
                    style={{ margin: 0 }}
                  />
                  <div style={{ color: "#52c41a", fontSize: '14px', fontWeight: 500 }}>
                    +36% <ArrowUpOutlined />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[32, 24]} style={{ marginTop: "24px" }}>
            <Col span={16}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, marginRight: '16px' }}>report money</span>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center', flexGrow: 1 }}>
                      {getTimeRangeButtons()}
                    </div>
                  </div>
                }
                extra={
                  <Button type="default" size="small" icon={<DownloadOutlined />} style={{ borderRadius: '4px' }}>
                    Export PDF
                  </Button>
                }
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ height: '300px', position: 'relative' }}>
                  <Line data={data} options={options} />
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                title={
                  <span style={{ fontWeight: 600 }}>Recent Customers</span>
                }
                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'auto' }}
                bodyStyle={{ padding: '16px' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recentCustomers}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '8px 0', borderBottom: index < recentCustomers.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <List.Item.Meta
                        avatar={<Avatar src={`${item.avatar}${index + 1}`} size="small" />}
                        title={<a href={`mailto:${item.email}`} style={{ fontWeight: 500 }}>{item.name}</a>}
                        description={item.email}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1890ff' }}>
                          {item.amount}
                        </div>
                        <div style={{ color: '#8B91A2', fontSize: '12px', marginLeft: '8px' }}>
                          {item.city}
                        </div>
                      </div>
                    </List.Item>
                  )}
                  style={{ height: 'auto', overflow: 'hidden' }}
                />
                <a href="#" style={{ color: '#8B91A2', display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>SEE ALL CUSTOMERS &gt;</a>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}