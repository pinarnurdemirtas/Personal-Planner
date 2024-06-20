import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Button, List, Select } from "antd";

const { Option } = Select;

const Rapor = () => {
  const { user } = useContext(UserContext);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const apiUrlRutins = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";
  const apiUrlTodos = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";
  const apiUrlPlan = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";

  useEffect(() => {
    const fetchRutins = async () => {
      try {
        const response = await axios.get(apiUrlRutins);
        const filteredRutins = response.data.data
          .filter((rutin) => rutin.username === user.username)
          .map((rutin, index) => ({
            ...rutin,
            id: index + 1,
          }));
        setRutins(filteredRutins);
        localStorage.setItem(`rutins_${user.username}`, JSON.stringify(filteredRutins));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routines:", error);
        setLoading(false);
      }
    };

    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrlTodos);
        const filteredTodos = response.data.data
          .filter((todo) => todo.username === user.username)
          .map((todo, index) => ({
            ...todo,
            id: index + 1,
          }));
        setTodos(filteredTodos);
        localStorage.setItem(`todos_${user.username}`, JSON.stringify(filteredTodos));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    };

    const fetchPlan = async () => {
      try {
        const response = await axios.get(apiUrlPlan);
        const filteredPlan = response.data.data
          .filter((plan) => plan.username === user.username)
          .map((plan, index) => ({
            ...plan,
            id: index + 1,
          }));
        setPlan(filteredPlan);
        localStorage.setItem(`plan_${user.username}`, JSON.stringify(filteredPlan));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    if (user) {
      const storedRutins = JSON.parse(localStorage.getItem(`rutins_${user.username}`));
      if (storedRutins) {
        setRutins(storedRutins);
        setLoading(false);
      } else {
        fetchRutins();
      }

      const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.username}`));
      if (storedTodos) {
        setTodos(storedTodos);
        setLoading(false);
      } else {
        fetchTodos();
      }

      const storedPlans = JSON.parse(localStorage.getItem(`plan_${user.username}`));
      if (storedPlans) {
        setPlan(storedPlans);
        setLoading(false);
      } else {
        fetchPlan();
      }
    }
  }, [user]);

  const filterPlansAndTodos = (selectedMonth, selectedYear, selectedDay) => {
    const filteredTodos = todos.filter(todo => {
      const todoDate = new Date(todo.startDate);
      return (
        todoDate.getMonth() === selectedMonth &&
        todoDate.getFullYear() === selectedYear &&
        (selectedDay === '' || todoDate.getDate() === selectedDay)
      );
    });

    const filteredPlans = plan.filter(plan => {
      const planDate = new Date(plan.date);
      return (
        planDate.getMonth() === selectedMonth &&
        planDate.getFullYear() === selectedYear &&
        (selectedDay === '' || planDate.getDate() === selectedDay)
      );
    });

    return { filteredTodos, filteredPlans };
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };

  const getListData = () => {
    if (!todos.length) return [];
    return todos.map((todo) => ({
      text: todo.text,
      startDate: todo.startDate,
      endDate: todo.endDate,
    }));
  };

  const getListData2 = () => {
    if (!rutins.length) return [];
    return rutins.map((rutin) => ({
      type: "info",
      content: rutin.rutins,
      day: rutin.day,
      time: rutin.time
    }));
  };

  const getListData3 = () => {
    if (!plan.length) return [];
    return plan.map((plan) => ({
      type: "info",
      content: plan.plan,
      date: plan.date,
      time: plan.time,
    }));
  };

  const { filteredTodos, filteredPlans } = filterPlansAndTodos(selectedMonth, selectedYear, selectedDay);

  return (
    <div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Button
          style={{ height: 50, width: 250 }}
          type="primary"
          onClick={() => alert("It has been successfully sent to your e-mail address.")}
        >
          <h4>Send to my e-mail address</h4>
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, paddingTop:30}}>
  <Select
    value={selectedYear}
    style={{ width: 120, marginRight: 10 }}
    onChange={handleYearChange}
    placeholder="Year"
  >
    <Option value={''}>Year</Option>
    <Option value={2022}>2022</Option>
    <Option value={2023}>2023</Option>
    <Option value={2024}>2024</Option>
    {/* Add more years as needed */}
  </Select>
  <Select
    value={selectedMonth}
    style={{ width: 120, marginRight: 10 }}
    onChange={handleMonthChange}
    placeholder="Month"
  >
    <Option value={''}>Month</Option>
    <Option value={0}>January</Option>
    <Option value={1}>February</Option>
    <Option value={2}>March</Option>
    <Option value={3}>April</Option>
    <Option value={4}>May</Option>
    <Option value={5}>June</Option>
    <Option value={6}>July</Option>
    <Option value={7}>August</Option>
    <Option value={8}>September</Option>
    <Option value={9}>October</Option>
    <Option value={10}>November</Option>
    <Option value={11}>December</Option>
  </Select>
  <Select
    value={selectedDay}
    style={{ width: 120 }}
    onChange={handleDayChange}
    placeholder="Day"
  >
    <Option value={''}>Day</Option>
    {[...Array(31).keys()].map(day => (
      <Option key={day + 1} value={day + 1}>{day + 1}</Option>
    ))}
  </Select>
</div>

      <div>
        <h3>Plans</h3>
        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={filteredPlans}
          renderItem={(plan) => (
            <List.Item actions={[]}>
              <div>
                <h3>{plan.plan}</h3>
                <p>Date: {plan.date}</p>
                <p>Time: {plan.time}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
      
      <div>
        <h3>To Do List</h3>
        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={filteredTodos}
          renderItem={(todo) => (
            <List.Item actions={[]} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              <div>
                <h3>{todo.text}</h3>
                <p>Date: {todo.startDate}</p>
                <p>Time: {todo.endDate}</p>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div>
        <h3>Routines</h3>
        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={getListData2()}
          renderItem={(rutin) => (
            <List.Item actions={[]}>
              <div>
                <h3>{rutin.content}</h3>
                <h5>{rutin.day}</h5>
                <p>{rutin.time}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Rapor;
