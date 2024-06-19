import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Log out butonuna tıklandı."); // Buton tıklanması kontrolü
    // Kullanıcıyı /login sayfasına yönlendir
    navigate("/");
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
