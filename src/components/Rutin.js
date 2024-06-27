import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { v4 as uuidv4 } from "uuid";
import { Input, Button, List, Card, Select, TimePicker } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const Rutin = () => {
  const { user, rutins, setRutins } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [selectedDay, setSelectedDay] = useState(""); // Seçilen gün için state
  const [selectedTime, setSelectedTime] = useState(null); // Seçilen saat için state
  const { Option } = Select;
  const apiUrlRutins =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";

  useEffect(() => {
    if (user) {
      const fetchRutins = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        try {
          const response = await fetch(apiUrlRutins, requestOptions);
          const result = await response.text();
          console.log("Fetched data:", result); // Log fetched data

          const data = JSON.parse(result);
          const filteredRutins = data.data
            .filter((rutin) => rutin.username === user.username)
            .map((rutin, index) => ({
              ...rutin,
              id: index + 1,
            }));
          console.log("Filtered rutins:", filteredRutins); // Log filtered rutins
          setRutins(filteredRutins);
          localStorage.setItem(
            `rutins_${user.username}`,
            JSON.stringify(filteredRutins)
          );
        } catch (error) {
          console.error("Error fetching rutins:", error);
        }
      };

      const storedRutins = JSON.parse(
        localStorage.getItem(`rutins_${user.username}`)
      );
      if (storedRutins) {
        fetchRutins();
        setRutins(storedRutins);
      } else {
        fetchRutins();
      }
    }
  }, [user, setRutins]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddRutin = async () => {
    if (inputValue.trim() !== "" && selectedDay && selectedTime) {
      const newId = uuidv4(); // Yeni id'yi hesaplayın
      const newRutin = {
        rutins: inputValue,
        day: selectedDay,
        time: selectedTime.format("HH:mm"),
        username: user.username,
        rutinID: newId,
      };

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify([Object.values(newRutin)]),
        redirect: "follow",
      };

      try {
        const response = await fetch(apiUrlRutins, requestOptions);
        const result = await response.json();
        console.log("Add rutin response:", result); // Log add rutin response

        // Yeni rutini updatedRutins array'ine ekliyoruz
        const updatedRutins = [...rutins, { ...newRutin, id: newId }];
        setRutins(updatedRutins);
        setInputValue("");
        setSelectedDay(null);
        setSelectedTime(null);
        localStorage.setItem(
          `rutins_${user.username}`,
          JSON.stringify(updatedRutins)
        );
        console.log("Updated rutins:", updatedRutins); // Log updated rutins
      } catch (error) {
        console.error("Error adding rutin:", error);
      }
    } else {
      console.log("Please fill all the fields."); // Log if fields are not filled
    }
  };

  const handleDeleteRutin = async (id) => {
    try {
      const rutinToDelete = rutins.find((rutin) => rutin.id === id);

      if (!rutinToDelete) {
        console.error("Rutin not found");
        return;
      }

      console.log("Rutin to delete:", rutinToDelete); // Log the rutin to delete

      axios
        .delete(apiUrlRutins, {
          params: {
            row_id: rutinToDelete.row_id,
          },
        })
        .then((response) => {
          console.log("Silme işlemi başarılı:", response);

          // Update the state to remove the deleted rutin
          const updatedRutins = rutins.filter((rutin) => rutin.id !== id);
          setRutins(updatedRutins);

          // Update local storage if needed
          localStorage.setItem(
            `rutins_${user.username}`,
            JSON.stringify(updatedRutins)
          );

          console.log("Updated rutins after deletion:", updatedRutins); // Log updated rutins after deletion
        })
        .catch((error) => {
          console.error("Silme işlemi sırasında hata oluştu:", error);
        });
    } catch (error) {
      console.error("Error deleting rutin:", error);
    }
  };

  return (
    <Card bordered={true} title={<h1>Routines</h1>}>
      <div>
        <Input
          placeholder="Add new rutin"
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Select
          placeholder="Select day"
          value={selectedDay}
          onChange={(value) => setSelectedDay(value)}
          style={{ width: "150px", marginRight: "10px" }}
        >
          <Option value="Monday">Monday</Option>
          <Option value="Tuesday">Tuesday</Option>
          <Option value="Wednesday">Wednesday</Option>
          <Option value="Thursday">Thursday</Option>
          <Option value="Friday">Friday</Option>
          <Option value="Saturday">Saturday</Option>
          <Option value="Sunday">Sunday</Option>
        </Select>
        <TimePicker
          placeholder="Select time"
          value={selectedTime}
          format="HH:mm"
          onChange={(time) => setSelectedTime(time)}
          style={{ marginRight: "10px" }}
        />
        <Button
          type="primary"
          onClick={handleAddRutin}
          icon={<PlusOutlined />}
          disabled={!inputValue || !selectedDay || !selectedDay}
        >
          Add
        </Button>
        <List
          style={{ marginTop: "20px", width: 1100 }}
          bordered
          dataSource={rutins}
          renderItem={(rutin) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleDeleteRutin(rutin.id)}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>,
              ]}
            >
              <h3 style={{ width: 170 }}>{rutin.rutins}</h3>
              <div style={{ width: 150 }}>
                <h5>{rutin.day}</h5>
                <p>{rutin.time}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default Rutin;
