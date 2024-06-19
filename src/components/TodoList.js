import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from "axios";
import { Input, Button, List, Row, Col, Card, DatePicker, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;

const TodoList = () => {
  const { user, todos, setTodos } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [selectedDates, setSelectedDates] = useState(null);

  const apiUrlTodos = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrlTodos);
        if (response.data && response.data.data) {
          const fetchedTodos = response.data.data
            .filter(todo => todo.username === user.username) // Filter by username
            .map((todo, index) => ({
              ...todo,
              id: index + 1, // Add unique IDs
              rowId: todo.rowId || index + 1, // Ensure rowId is set correctly
            }));
          setTodos(fetchedTodos);
          localStorage.setItem(`todos_${user.username}`, JSON.stringify(fetchedTodos));
        } else {
          console.error('API response does not contain expected data format:', response.data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.username}`));
    if (storedTodos) {
      setTodos(storedTodos);
    } else {
      fetchTodos();
    }
  }, [user, setTodos]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.username}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  const handleAddTodo = async () => {
    if (inputValue.trim() !== "" && selectedDates) {
      const startDate = selectedDates[0].format("YYYY-MM-DD");
      const endDate = selectedDates[1].format("YYYY-MM-DD");

      const newTodo = {
        text: inputValue,
        username: user.username,
        startDate: startDate,
        endDate: endDate,
        completed: false,
      };

      try {
        const response = await axios.post(apiUrlTodos, [Object.values(newTodo)]);
        const newRowId = response.data.rowId;  // Assuming the API returns the row ID of the newly created row
        const updatedTodos = [...todos, { ...newTodo, id: todos.length + 1, rowId: newRowId }];
        setTodos(updatedTodos);
        setInputValue("");
        setSelectedDates(null);
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const todoToDelete = todos.find((todo) => todo.id === id);
      if (!todoToDelete) {
        console.error('Todo not found');
        return;
      }

      // Simulate deletion in API
      // Replace this with actual API delete call if available
      // const response = await axios.delete(`${apiUrlTodos}/${todoToDelete.rowId}`);

      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <Card bordered={true} title={<h1>To Do List</h1>}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Input
            placeholder="Add new todo"
            value={inputValue}
            onChange={handleInputChange}
          />
        </Col>
        <Col span={8}>
          <Space direction="vertical">
            <RangePicker
              onChange={handleDateChange}
              value={selectedDates}
              format="YYYY-MM-DD"
            />
          </Space>
        </Col>
        <Col span={8}>
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
                onClick={() => handleToggleComplete(todo.id)}
              >
                {todo.completed ? "Undo" : "Complete"}
              </Button>,
              <Button onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </Button>,
            ]}
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
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
