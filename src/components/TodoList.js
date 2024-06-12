import React, { useState } from "react";
import { Input, Button, List, Row, Col, Card, DatePicker, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment"; // moment kütüphanesini dahil edin

const { RangePicker } = DatePicker;

const TodoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "" && selectedDates) {
      setTodos([
        ...todos,
        {
          text: <h5>{inputValue}</h5>,
          dates: selectedDates,
          completed: false,
          id: Math.floor(Math.random() * 100000), // Generate unique ID
        },
      ]);
      setInputValue("");
      setSelectedDates(null);
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Card bordered={true} title={<h1>To Do List</h1>}>
      <Row>
        <Col>
          <div>
            <Input
              placeholder="Add new todo"
              value={inputValue}
              onChange={handleInputChange}
              style={{ width: "300px", marginRight: "10px" }}
            />
          </div>
        </Col>
        <Col style={{ paddingRight: 20, paddingLeft: 10 }}>
          <div>
            <Space direction="vertical">
              <RangePicker onChange={handleDateChange} value={selectedDates} />
            </Space>
          </div>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleAddTodo}
            icon={<PlusOutlined />}
            disabled={!inputValue || !selectedDates}
          >
            Add
          </Button>
        </Col>
      </Row>
      <div>
        <List
          style={{ marginTop: "20px", width: "800px" }}
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
              <div>
                <div>{todo.text}</div>
                <div>
                  {moment(todo.dates[0]).format("YYYY-MM-DD")} -{" "}
                  {moment(todo.dates[1]).format("YYYY-MM-DD")}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default TodoList;
