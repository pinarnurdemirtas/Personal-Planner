import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Card, Row, Col, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

function Profile({ data }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState(null); // Kullanıcı bilgilerini saklamak için state
  const [isEditing, setIsEditing] = useState(false); // Profil düzenlemelerini saklamak için state
  const [formData, setFormData] = useState({
    // Form verilerini saklamak için state
    username: "",
    name: "",
    surname: "",
    mail: "",
    tel: "",
    img: "",
  });

  useEffect(() => {
    // Kullanıcı bulunamadıysa ana sayfaya yönlendir
    if (!user) {
      navigate("/");
      return;
    }

    const getUserInfo = () => {
      for (const userData of data) {
        if (userData.username === user.username) {
          //Giriş yapan kullanıcıyı bulma
          return userData;
        }
      }
      return null;
    };

    // Kullanıcı bilgilerini çek ve state'i güncelle
    const fetchedUserInfo = getUserInfo();
    if (fetchedUserInfo) {
      setUserInfo(fetchedUserInfo);

      // Form verilerini doldur
      setFormData({
        username: fetchedUserInfo.username,
        name: fetchedUserInfo.name,
        surname: fetchedUserInfo.surname,
        mail: fetchedUserInfo.mail,
        tel: fetchedUserInfo.tel,
        img: fetchedUserInfo.img,
        id: fetchedUserInfo.row_id, // Doğru alan adını kullanın
      });
    }
  }, [data, user, navigate]);

  useEffect(() => {
    // userInfo değiştiğinde
    if (userInfo) {
      console.log("User Info:", userInfo);
    }
  }, [userInfo]);

  // form elemanında herhangi bir değer değiştiğinde çalışacak
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Profil güncelleme işlemini gerçekleştiren handleSave fonksiyonu
  const handleSave = async () => {
    try {
      // ID (row_id) yoksa hata ver
      if (!formData.id) {
        throw new Error("User ID (row_id) is required.");
      }

      const apiUrl = `https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa1`;

      // İstek gönderimi için gerekli bilgileri oluşturma
      const requestBody = {
        row_id: formData.id,
        name: formData.name,
        email: formData.mail,
      };

      // API'ye PUT isteği gönderme
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Başarılı değilse hata ver
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      // Güncellenmiş kullanıcı bilgisini state'e kaydet ve düzenleme modunu kapat
      const updatedUser = await response.json();
      setUserInfo(updatedUser);
      setIsEditing(false);
    } catch (error) {
      message.error(
        `An error occurred while updating the profile: ${error.message}`
      );
    }
  };

  // Düzenleme modunu açan handleEdit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Düzenleme modunu kapatan noEdit
  const noEdit = () => {
    setIsEditing(false);
  };

  // Kullanıcı bilgisi yüklenmediyse
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <Card
        bordered={true}
        style={{ width: 400 }}
        title={
          <div style={{ maxHeight: 110 }}>
            <Row>
              <Col span={8}>
                <img
                  style={{ paddingRight: 30, paddingTop: 10 }}
                  alt="example"
                  src={formData.img}
                />
              </Col>
              <Col span={16}>
                <h2 style={{ paddingTop: 20 }}>{formData.name}'s Profile</h2>
              </Col>
            </Row>
          </div>
        }
      >
        {isEditing ? ( // Düzenleme modunda ise düzenleme formunu ve save butonunu göster
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Username: </span>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Name: </span>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Surname: </span>
              <Input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>E-mail: </span>
              <Input
                name="mail"
                value={formData.mail}
                onChange={handleChange}
              />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Telephone: </span>
              <Input name="tel" value={formData.tel} onChange={handleChange} />
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={noEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          // Düzenleme modunda değilse profil bilgilerini göster ve düzenleme butonunu göster
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Username: </span>
              {formData.username}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Name: </span>
              {formData.name}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Surname: </span>
              {formData.surname}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>E-mail: </span>
              {formData.mail}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Telephone: </span>
              {formData.tel}
            </p>
            <Button type="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Profile;
