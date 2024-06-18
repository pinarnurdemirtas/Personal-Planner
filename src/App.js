import React, { useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Homepage from "./components/Homepage";
import Rutin from "./components/Rutin";
import UserProvider from './components/UserContext';




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
          <Route path="/homepage" element={<Homepage data={validUsers} />} />
          <Route path="/profile" element={<Profile data={validUsers} />} />
  
          <Route path="/rutin" element={<Rutin />} />

        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
