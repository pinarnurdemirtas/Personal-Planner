import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Button, List } from "antd";

const Rapor = () => {
  const { user } = useContext(UserContext);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState([]);

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

      <div>
        <h3>To Do List</h3>
        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={getListData()}
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
              </div>
            </List.Item>
          )}
        />
      </div>

      <div>
        <h3>Plans</h3>
        <List
          style={{ marginTop: "20px" }}
          bordered
          dataSource={getListData3()}
          renderItem={(plan) => (
            <List.Item actions={[]}>
              <div>
                <h3>{plan.content}</h3>
                <p>Date: {plan.date}</p>
                <p>Time: {plan.time}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Rapor;
