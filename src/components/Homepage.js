import React, { useState } from 'react';
import {
  FileOutlined,
  PieChartOutlined,
  CalendarOutlined,
  UserOutlined,
  BellOutlined, 
  HomeOutlined, 
  FolderOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Profile from './Profile';
import CalendarNote from './CalendarNote';
import Logout from './Logout';
import Rutin from './Rutin';
import Plan from './Plan';
import Rapor from './Rapor';
import TodoList from './TodoList';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Profile', '1', <UserOutlined />),
  getItem('Plan', '6', <HomeOutlined />),
  getItem('To Do List', '2', <FileOutlined />),
  getItem('Routines', '5', <BellOutlined  />),
  getItem('Calendar', '3', <CalendarOutlined />),
  getItem('Document', '7', <FolderOutlined />),
  getItem('Log Out', '4', <PieChartOutlined />),
  
  
];

const Homepage = ({ data }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1'); // Seçili menü öğesini takip edecek bir durum tanımlayın

  const handleMenuClick = ({ key }) => {
    setSelectedMenuItem(key); // Menü öğesinin tıklandığında durumu güncelleyin
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <Profile data={data}/>;
      case '2':
        // return <TodoListComponent />; // Eğer bir TodoList bileşeni varsa burada gösterebilirsiniz
        return <TodoList />;
      case '3':
        return <CalendarNote />;
      case '4':
        // return <LogoutComponent />; // Eğer bir Logout bileşeni varsa burada gösterebilirsiniz
        return <Logout/>;
        case '5':
        // return <LogoutComponent />; // Eğer bir Logout bileşeni varsa burada gösterebilirsiniz
        return <Rutin/>;
        case '6':
        // return <LogoutComponent />; // Eğer bir Logout bileşeni varsa burada gösterebilirsiniz
        return <Plan/>;
        case '7':
        // return <LogoutComponent />; // Eğer bir Logout bileşeni varsa burada gösterebilirsiniz
        return <Rapor/>;
      default:
        return null;
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  return (
  
    <Layout style={{ minHeight: '100vh', overflow: 'auto'}}>
      <Sider>
        <div className="demo-logo-vertical" >
        <h3 style={{color: 'white', paddingLeft:15}}>PERSONAL PLANNER</h3>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick} // Menü öğesi tıklandığında tetiklenecek işlevi belirtin
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '10px 15px'}}>
          <Breadcrumb style={{ margin: '5px 0' }} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG, maxHeight:700, overflow: 'auto'
            }}
          >
            {renderContent()} {/* Duruma göre içeriği render etmek için oluşturulan fonksiyonu çağırın */}
          </div>
        </Content>
      </Layout>
    </Layout>
   
   
  );
};

export default Homepage;
