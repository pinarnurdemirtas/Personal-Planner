import React, { useState } from "react";
import {
  FileOutlined,
  PieChartOutlined,
  CalendarOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Profile from "./Profile";
import Plan from "./Plan";
import TodoList from "./TodoList";
import Rutin from "./Rutin";
import CalendarNote from "./CalendarNote";
import Rapor from "./Rapor";
import Logout from "./Logout";

const { Header, Content, Footer, Sider } = Layout;

// Menünün her bir öğesini oluşturmak için 
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Menü öğelerinin tanımlanması
const items = [
  getItem("Profile", "1", <UserOutlined />),
  getItem("Plan", "6", <HomeOutlined />),
  getItem("To Do List", "2", <FileOutlined />),
  getItem("Routines", "5", <BellOutlined />),
  getItem("Calendar", "3", <CalendarOutlined />),
  getItem("Document", "7", <FolderOutlined />),
  getItem("Log Out", "4", <PieChartOutlined />),
];

const Homepage = ({ data }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("1"); // Seçili menü öğesini takip edecek bir durum tanımlayın

  // Menü öğesine tıklandığında durumu güncelleyen fonksiyon
  const handleMenuClick = ({ key }) => {
    setSelectedMenuItem(key); 
  };

  // Seçili menü öğesine göre ilgili bileşeni render eden fonksiyon
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "1":
        return <Profile data={data} />;
      case "2":
        return <TodoList />;
      case "3":
        return <CalendarNote />;
      case "4":
        return <Logout />;
      case "5":
        return <Rutin />;
      case "6":
        return <Plan />;
      case "7":
        return <Rapor />;
      default:
        return null;
    }
  };

  
  const {
    token: { colorBgContainer, borderRadiusLG }, //arkaplan rengi ve kenar yuvarlaklığını ayarlar
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", overflow: "auto" }}>
      <Sider>
        <div className="demo-logo-vertical">
          <h3 style={{ color: "white", paddingLeft: 15 }}>PERSONAL PLANNER</h3>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick} 
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "10px 15px" }}>
        
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              maxHeight: 700,
              overflow: "auto",
            }}
          >
            {renderContent()} 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Homepage;
