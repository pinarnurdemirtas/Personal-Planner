import React, { useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserProvider from './components/UserContext';
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Profile from "./components/Profile";
import Plan from './components/Plan';
import TodoList from './components/TodoList';
import Rutin from "./components/Rutin";
import Rapor from "./components/Rapor";
import Logout from "./components/Logout";



const App = () => {
  const [validUsers, setValidUsers] = useState([]);
  
  const apiUrlValidUsers = 'https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa1';

  useEffect(() => {
    const fetchValidUsers = async () => {
      try {
        const response = await axios.get(apiUrlValidUsers);
        console.log('Valid Users API response:', response.data);
        setValidUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching valid users:', error);
      }
    };
    fetchValidUsers();
  }, []); 

console.log(validUsers);


  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login data={validUsers} />} />
          <Route path="/homepage" element={<Homepage data={validUsers}/>} />
          <Route path="/Profile" element={<Profile data={validUsers}/>} />
          <Route path="/Plan" element={<Plan data={validUsers}/>} />
          <Route path="/TodoList" element={<TodoList data={validUsers}/>} />
          <Route path="/Rutin" element={<Rutin data={validUsers}/>} />
          <Route path="/Rapor" element={<Rapor data={validUsers}/>} />
          <Route path="/Logout" element={<Logout data={validUsers}/>} />
        </Routes>
      </Router>
    </UserProvider> //Kullanıcı bilgilerini tüm bileşenlere verir
  ); 
};

export default App;
