import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, List, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Rutin = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const apiUrlRutins =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";

  useEffect(() => {
    const fetchRutins = async () => {
      try {
        const response = await axios.get(apiUrlRutins);
        setTodos(response.data.data.map((todo, index) => ({ ...todo, id: index + 1 }))); // Her todo elemanına benzersiz bir id atıyoruz
  
      } catch (error) {
        console.error("Error fetching rutins:", error);
      }
    };

    fetchRutins();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        rutins: inputValue,
        completed: null // Yeni eklenen todo varsayılan olarak tamamlanmamış olarak ayarlanır
      };
      try {
        const response = await axios.post(apiUrlRutins, [Object.values(newTodo)]); // Doğru sütunları kullanarak bir dizi oluştur
        setTodos([...todos, { ...newTodo, id: response.data.row_id }]);
        
        setInputValue("");
        console.log("Added todo:", response.data);
      } catch (error) {
        console.error("Error adding todo:", error.response);
      }
    } 
  }; console.log("eklenenler", todos);

  

  
  const handleDeleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${apiUrlRutins}&row_id=${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      console.log("Todo deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  
  
  const handleToggleComplete = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    
    try {
      const response = await axios.put(`${apiUrlRutins}/${id}`, [Object.values(updatedTodo)]);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      console.log("Todo completion status updated successfully:", response.data);
    } catch (error) {
      console.error("Error toggling todo complete:", error.response);
    }
  };
  

  return (
    <Card bordered={true} title={<h1>Routines</h1>}>
      <div>
        <Input
          placeholder="Add new todo"
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleAddTodo} icon={<PlusOutlined />}>
          Add
        </Button>
        <List
          style={{ marginTop: "20px", maxWidth: "500px" }}
          bordered
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleToggleComplete(todo.id)}
                >
                  {todo.completed ? "Undo" : "Complete"}
                </Button>,
                <Button type="danger" onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </Button>,
              ]}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.rutins}
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default Rutin;
