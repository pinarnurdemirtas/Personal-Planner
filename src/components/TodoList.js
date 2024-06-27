import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Input, Button, List, Row, Col, Card, DatePicker, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const TodoList = () => {
  // Kullanıcı bilgilerini ve todos state'ini UserContext'ten al
  const { user, todos, setTodos } = useContext(UserContext);

  const [inputValue, setInputValue] = useState(""); // Yeni todo girişi
  const [selectedDates, setSelectedDates] = useState(null); // Seçilen tarih aralığı
  const [loading, setLoading] = useState(false); // Veri yüklenirken durum

  const apiUrlTodos =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";

  // Todo'ları getiren fonksiyon
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrlTodos); // Todos'ları API'den getir
      const data = response.data.data; // API'den gelen veri
      const filteredTodos = data
        .filter((todo) => todo.username === user.username) // Sadece kullanıcıya ait olanları filtrele
        .map((todo, index) => ({
          ...todo,
          id: index + 1,
        })); // Her todo'ya benzersiz bir ID ata
      setTodos(filteredTodos); // Todos state'ini güncelle
      localStorage.setItem(
        `todos_${user.username}`,
        JSON.stringify(filteredTodos)
      ); // Local storage'a todos'ları kaydet
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrlTodos, user.username, setTodos]);

  // Component ilk render olduğunda ve user değiştiğinde fetchTodos fonksiyonunu çalıştır
  useEffect(() => {
    if (user) {
      const storedTodos = JSON.parse(
        localStorage.getItem(`todos_${user.username}`)
      ); // Local storage'dan todos'ları getir
      if (storedTodos) {
        fetchTodos();
        setTodos(storedTodos);
      } else {
        fetchTodos();
      }
    }
  }, [user, setTodos, fetchTodos]);

  // Yeni todo ekleme fonksiyonu
  const handleAddTodo = async () => {
    if (inputValue.trim() !== "" && selectedDates) {
      const startDate = selectedDates[0].format("YYYY-MM-DD"); // Seçilen tarih aralığının başlangıç tarihi
      const endDate = selectedDates[1].format("YYYY-MM-DD"); // Seçilen tarih aralığının bitiş tarihi

      const newTodo = {
        text: inputValue,
        username: user.username,
        startDate: startDate,
        endDate: endDate,
      }; // Yeni todo objesi

      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
          body: JSON.stringify([Object.values(newTodo)]), // Yeni todo'yu diziye çevirir
        };

        const response = await fetch(apiUrlTodos, requestOptions); // API'ye POST gönder
        const data = await response.json(); // API'den dönen JSON verisi

        const newRowId = data.rowId; // Yeni oluşturulan todo'nun satır ID'si
        const updatedTodos = [
          ...todos,
          { ...newTodo, id: todos.length + 1, rowId: newRowId }, // todos dizisine yeni todo ekle
        ];
        setTodos(updatedTodos); // Todos state'ini güncelle
        setInputValue(""); // Input değerini temizle
        setSelectedDates(null); // Seçilen tarih aralığını temizle
        localStorage.setItem(
          `todos_${user.username}`,
          JSON.stringify(updatedTodos)
        ); // Local storage'a güncellenmiş todos'ları kaydet
      } catch (error) {
        console.error("Error adding todo:", error); // Hata durumunda konsola hata yazdır
      }
    }
  };

  // Todo silme fonksiyonu
  const handleDeleteTodo = async (id) => {
    try {
      const todoToDelete = todos.find((todo) => todo.id === id); // Silinecek todo'yu bul

      if (!todoToDelete) {
        console.error("Todo not found"); // Eğer todo bulunamazsa hata yazdır
        return;
      }

      axios
        .delete(apiUrlTodos, {
          params: {
            row_id: todoToDelete.row_id,
          },
        })
        .then((response) => {
          console.log("Successful deletion:", response); // Silme işlemi başarılı ise konsola yazdır

          // Silinen todo hariç diğer todos'ları güncelle
          const updatedTodo = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodo);

          localStorage.setItem(
            `todos_${user.username}`,
            JSON.stringify(updatedTodo)
          ); // Local storage'a güncellenmiş todos'ları kaydet
        });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Input değeri değiştiğinde çağrılan fonksiyon
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Tarih aralığı değiştiğinde çağrılan fonksiyon
  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  return (
    <Card bordered={true} title={<h1>To Do List</h1>} loading={loading}>
      <Row gutter={[15]}>
        <Col span={5}>
          <Input
            placeholder="Add new todo"
            value={inputValue}
            onChange={handleInputChange}
          />
        </Col>
        <Col span={5}>
          <Space direction="vertical">
            <RangePicker
              onChange={handleDateChange}
              value={selectedDates}
              format="YYYY-MM-DD"
            />
          </Space>
        </Col>
        <Col span={5}>
          <Button
            type="primary"
            onClick={handleAddTodo}
            icon={<PlusOutlined />}
            disabled={!inputValue || !selectedDates}
          >
            Add Todo
          </Button>
        </Col>
      </Row>

      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => handleDeleteTodo(todo.id)}
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>,
            ]}
          >
            <div>
              <h3>{todo.text}</h3>
              <p>Start: {todo.startDate}</p>
              <p>End: {todo.endDate}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TodoList;
