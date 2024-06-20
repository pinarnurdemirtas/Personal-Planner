import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

function Profile({ data }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log("user", user);
  console.log("data", data);
  const getUserInfo = () => {
    for (const userData of data) {
      if (userData.username === user.username) {
        return userData;
      }
    }
  
    return null;
  };
 
  const userInfo = getUserInfo();
  
  if (userInfo) {
    console.log("Kullanıcı", userInfo); 
  } else {
    console.log('Kullanıcı bulunamadı.');
  }
 

  if (!user) {
    navigate("/");
  }

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <Card
        bordered={true}
        style={{
          width: 400
        }}
        title={
          <div style={{maxHeight:100}}>
            <Row>
              <Col span={8}>
                <img style={{ paddingRight: 30, paddingTop: 10}}
                  alt="example"
                  src={userInfo.img}
                />
              </Col>
              <Col span={16}>
                <h2 style={{ paddingTop: 20}} >{userInfo.name}'s  Profile</h2>
              </Col>
            </Row>
          </div>
        }
      >
        <div>
        <p>
      <span style={{ fontWeight: "bold" }}>Username: </span> {userInfo.username}
    </p>
    <p>
      <span style={{ fontWeight: "bold" }}>Name: </span> {userInfo.name}
    </p>
    <p>
      <span style={{ fontWeight: "bold" }}>Surname: </span> {userInfo.surname}
    </p>
    <p>
      <span style={{ fontWeight: "bold" }}>E-mail: </span> {userInfo.mail}
    </p>
    <p>
      <span style={{ fontWeight: "bold" }}>Telephone: </span> {userInfo.tel}
    </p>
        </div>
      </Card>
    </div>
  );
}
export default Profile;
