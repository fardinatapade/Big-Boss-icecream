import React, { useState, Suspense, lazy } from "react";
import { Layout, Menu, Drawer, Button, Flex, Avatar, Divider } from "antd";
import { MenuOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  FaHome,
  FaFileInvoiceDollar,
  FaIceCream,
  FaUsers,
  FaTruck,
  FaHistory,
} from "react-icons/fa";

import Spinner from "./Spinner";
import AllBills from "./AllBills";

const Homepage = lazy(() => import("./Homepage"));
const CreateBill = lazy(() => import("./CreateBill"));
const IcecreamRates = lazy(() => import("./IcecreamRates"));
const StaffCharges = lazy(() => import("./StaffCharges"));
const CateringInfo = lazy(() => import("./CateringInfo"));

const { Header, Sider, Content } = Layout;

const DashBoard = () => {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");

  const menuItems = [
    { key: "1", icon: <FaHome />, label: "Home Page" },
    { key: "2", icon: <FaFileInvoiceDollar />, label: "Create Bill" },
    { key: "3", icon: <FaIceCream />, label: "Icecream Rates" },
    { key: "4", icon: <FaUsers />, label: "Staff Charges" },
    { key: "5", icon: <FaTruck />, label: "Catering Info" },
    { key: "6", icon: <FaHistory />, label: "All Bills" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const getActiveTitle = () => {
    const activeItem = menuItems.find((item) => item.key === selectedKey);
    return activeItem ? activeItem.label : "Dashboard";
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <Homepage setSelectedKey={setSelectedKey} />;
      case "2":
        return <CreateBill />;
      case "3":
        return <IcecreamRates />;
      case "4":
        return <StaffCharges />;
      case "5":
        return <CateringInfo />;
      case "6":
        return <AllBills />;
      default:
        return <Homepage setSelectedKey={setSelectedKey} />;
    }
  };

  const renderSidebarContent = (isDrawer = false) => (
    <Flex vertical style={{ height: "100%", padding: "20px 16px" }}>
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          background: "linear-gradient(135deg, #CA2D2A, #F6643E)",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 10px 20px -5px rgba(202, 45, 42, 0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            top: "-30px",
            right: "-30px",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "0.5px",
            color: "#fff",
          }}
        >
          BIG-BOSS
        </h2>
        <div
          style={{
            opacity: 0.9,
            marginTop: 6,
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            color: "#fff",
          }}
        >
          Ice Cream
        </div>
      </div>

      <div
        style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}
        className="custom-scrollbar"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            setSelectedKey(e.key);
            if (isDrawer) setOpen(false);
          }}
          items={menuItems}
          style={{
            border: "none",
            background: "transparent",
          }}
          inlineIndent={16}
        />
      </div>

      <Divider style={{ margin: "16px 0", borderColor: "#f1f5f9" }} />

     

      <Button
        danger
        type="primary"
        block
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{
          height: 48,
          borderRadius: "10px",
          fontWeight: 700,
          background: "rgba(239, 68, 68, 0.08)",
          color: "#dc2626",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          boxShadow: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#dc2626";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
          e.currentTarget.style.color = "#dc2626";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Logout
      </Button>
    </Flex>
  );

  return (
    <Layout
      style={{ height: "100vh", overflow: "hidden", background: "#f4f6f9" }}
    >
      <Sider
        width={290}
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        style={{
          background: "#fff",
          height: "calc(100vh - 32px)",
          position: "sticky",
          top: 16,
          left: 0,
          margin: "16px 0 16px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
        }}
        className="d-none d-lg-block"
      >
        {renderSidebarContent(false)}
      </Sider>

      <Drawer
        placement="left"
        width={290}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        bodyStyle={{ padding: 0, background: "#fff" }}
      >
        {renderSidebarContent(true)}
      </Drawer>

      <Layout
        style={{
          background: "transparent",
          margin: "16px",
          height: "calc(100vh - 32px)",
          overflow: "hidden",
        }}
      >
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "12px",
            boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            height: "70px",
            flexShrink: 0,
          }}
        >
          <Flex align="center" gap={16}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: "18px" }} />}
              onClick={() => setOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
              className="d-lg-none"
            />

            <Flex align="center" gap={10}>
              <div
                style={{
                  width: "6px",
                  height: "24px",
                  background: "linear-gradient(to bottom, #CA2D2A, #F6643E)",
                  borderRadius: "4px",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  color: "#1e293b",
                  fontWeight: 800,
                  fontSize: "22px",
                  letterSpacing: "-0.5px",
                }}
              >
                {getActiveTitle()}
              </h4>
            </Flex>
          </Flex>

          <Button
            type="text"
            danger
            icon={<LogoutOutlined style={{ fontSize: "15px" }} />}
            onClick={handleLogout}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              padding: "8px 16px",
              height: "40px",
              background: "#FFF1F1",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span className="d-none d-sm-inline">Logout</span>
          </Button>
        </Header>

        <Content
          style={{
            marginTop: "16px",
            height: "calc(100% - 86px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              height: "100%",
              overflowY: "auto",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              position: "relative",
            }}
            className="custom-scrollbar"
          >
            
            <Suspense fallback={<Spinner />}>{renderContent()}</Suspense>
          </div>
        </Content>
      </Layout>

      <style>{`
        .ant-menu-item {
          height: 50px !important;
          line-height: 50px !important;
          border-radius: 10px !important;
          margin: 6px 0 !important;
          font-weight: 600 !important;
          color: #64748b !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .ant-menu-item .ant-menu-item-icon {
          font-size: 16px !important;
          transition: transform 0.25s ease !important;
        }
        .ant-menu-item:hover {
          background: rgba(202, 45, 42, 0.05) !important;
          color: #CA2D2A !important;
        }
        .ant-menu-item:hover .ant-menu-item-icon {
          transform: scale(1.1);
        }
        .ant-menu-item-selected, 
        .ant-menu-item-selected:hover {
          background: linear-gradient(135deg, #CA2D2A, #F6643E) !important;
          color: #ffffff !important;
          box-shadow: 0 8px 16px -4px rgba(202, 45, 42, 0.3) !important;
        }
        .ant-menu-item-selected .ant-menu-item-icon,
        .ant-menu-item-selected:hover .ant-menu-item-icon {
          color: #ffffff !important;
          transform: scale(1) !important;
        }
        .ant-menu-item::after {
          display: none !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (max-width: 991px) {
          .d-lg-none { display: flex !important; }
          .d-none { display: none !important; }
        }
        @media (max-width: 575px) {
          .d-sm-inline { display: none !important; }
        }
        .ant-spin-nested-loading .ant-spin-blur::after {
          opacity: 0.4;
        }
      `}</style>
    </Layout>
  );
};

export default DashBoard;
