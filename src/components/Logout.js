import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate(); //yönlendirme için navigate tanımla

  const handleLogout = () => {
    navigate("/");   // Kullanıcıyı login sayfasına yönlendir
  };

  return (
    <div style={{ display: "grid", placeItems: "center", paddingTop: 90 }}>
      <h2>Are you sure you want to log out?</h2>
      <Button type="primary" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
}

export default Logout;
