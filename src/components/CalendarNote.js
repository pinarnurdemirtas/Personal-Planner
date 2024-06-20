import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { Calendar, Badge } from "antd";
import axios from "axios";
import moment from "moment";

const CalendarNote = () => {
  const { user } = useContext(UserContext);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrlRutins =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";
  const apiUrlTodos =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";
  const apiUrlPlan =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";

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
        localStorage.setItem(
          `rutins_${user.username}`,
          JSON.stringify(filteredRutins)
        );
        setLoading(false);
      } catch (error) {
        console.error("Rutinler getirilirken hata oluştu:", error);
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
        localStorage.setItem(
          `todos_${user.username}`,
          JSON.stringify(filteredTodos)
        );
        setLoading(false);
      } catch (error) {
        console.error("Todos getirilirken hata oluştu:", error);
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
        localStorage.setItem(
          `plan_${user.username}`,
          JSON.stringify(filteredPlan)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    if (user) {
      const storedRutins = JSON.parse(
        localStorage.getItem(`rutins_${user.username}`)
      );
      if (storedRutins) {
        setRutins(storedRutins);
        setLoading(false);
      } else {
        fetchRutins();
      }

      const storedTodos = JSON.parse(
        localStorage.getItem(`todos_${user.username}`)
      );
      if (storedTodos) {
        setTodos(storedTodos);
        setLoading(false);
      } else {
        fetchTodos();
      }
      const storedPlans = JSON.parse(
        localStorage.getItem(`plan_${user.username}`)
      );
      if (storedPlans) {
        setPlan(storedPlans);
        setLoading(false);
      } else {
        fetchPlan();
      }
    }
  }, [user]);

  const getListData = () => {
    if (!rutins.length) return [];

    const listData = rutins.map((rutin) => ({
      type: "info",
      content: rutin.rutins,
      day: rutin.day,
      time: rutin.time,
    }));

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData();
    const updatedListData = [];

    const dayOfWeek = value.format('dddd'); // Get the day of the week (e.g., 'Monday')

    // Add rutin events for the current day of the week
    listData.forEach((rutin) => {
      if (rutin.day.toLowerCase() === dayOfWeek.toLowerCase()) {
        updatedListData.push({
          type: "rutin",
          content: rutin.content,
          time: rutin.time,
        });
      }
    });

    // Add todos and plans for the specific date
    todos.forEach((todo) => {
      if (
        value.format("YYYY-MM-DD") >= todo.startDate &&
        value.format("YYYY-MM-DD") <= todo.endDate
      ) {
        updatedListData.push({
          type: "todo",
          content: todo.text,
        });
      }
    });

    plan.forEach((planItem) => {
      if (value.format("YYYY-MM-DD") === planItem.date) {
        updatedListData.push({
          type: "plan",
          content: planItem.plan,
          time: planItem.time,
        });
      }
    });

    return (
      <ul className="events">
        {updatedListData.map((item, index) => (
          <li
            key={index}
            style={{
              backgroundColor: getBackgroundColor(item.type),
              borderRadius: "4px",
              margin: "5px 0",
              padding: "2px 5px",
              color: "#fff",
            }}
          >
            <span>
              {item.content}
              {item.time && <><br />{item.time}</>}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "rutin":
        return "#2db7f5"; // Orange for routines
      case "todo":
        return "#87d068"; // Green for todos
      case "plan":
        return "#ffa500"; // Blue for plans
      default:
        return "transparent";
    }
  };

  return (
    <div className="site-calendar-demo-card">
      <Calendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default CalendarNote;
