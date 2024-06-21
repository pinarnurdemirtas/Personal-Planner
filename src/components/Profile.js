import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Card, Row, Col, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

function Profile({ data }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    mail: "",
    tel: "",
    img: "",
    id: "" // Include id in formData if needed
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const getUserInfo = () => {
      for (const userData of data) {
        if (userData.username === user.username) {
          return userData;
        }
      }
      return null;
    };

    const fetchedUserInfo = getUserInfo();
    if (fetchedUserInfo) {
      setUserInfo(fetchedUserInfo);
      setFormData({
        username: fetchedUserInfo.username,
        name: fetchedUserInfo.name,
        surname: fetchedUserInfo.surname,
        mail: fetchedUserInfo.mail,
        tel: fetchedUserInfo.tel,
        img: fetchedUserInfo.img,
        id: fetchedUserInfo.row_id // Ensure the correct field name is used
      });
    }
  }, [data, user, navigate]);

  useEffect(() => {
    if (userInfo) {
      console.log("User Info:", userInfo); // Log userInfo to check the structure
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.id) {
        throw new Error("User ID (row_id) is required.");
      }
  
      const apiUrl = `https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa1`;
      console.log("Sending request to:", apiUrl);
      console.log("Form data:", JSON.stringify(formData));
  
      const requestBody = {
        row_id: formData.id,
        name: formData.name,
        email: formData.mail
        // Add other fields as needed for your API
      };
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }
  
      const updatedUser = await response.json();
      setUserInfo(updatedUser);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(`An error occurred while updating the profile: ${error.message}`);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const noEdit = () => {
    setIsEditing(false);
  };

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
                  src={userInfo.img}
                />
              </Col>
              <Col span={16}>
                <h2 style={{ paddingTop: 20 }}>{userInfo.name}'s Profile</h2>
              </Col>
            </Row>
          </div>
        }
      >
        {isEditing ? (
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Username: </span>
              <Input name="username" value={formData.username} onChange={handleChange} />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Name: </span>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Surname: </span>
              <Input name="surname" value={formData.surname} onChange={handleChange} />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>E-mail: </span>
              <Input name="mail" value={formData.mail} onChange={handleChange} />
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Telephone: </span>
              <Input name="tel" value={formData.tel} onChange={handleChange} />
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
      <Button type="primary" onClick={handleSave}>
        Save
      </Button>
      <Button  onClick={noEdit}>
        Cancel
      </Button>
    </div>
          </div>
        ) : (
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Username: </span>
              {userInfo.username}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Name: </span>
              {userInfo.name}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Surname: </span>
              {userInfo.surname}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>E-mail: </span>
              {userInfo.mail}
            </p>
            <p style={{paddingBottom:12}}>
              <span style={{ fontWeight: "bold" }}>Telephone: </span>
              {userInfo.tel}
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
