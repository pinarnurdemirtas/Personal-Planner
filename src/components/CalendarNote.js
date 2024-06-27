import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { Calendar } from "antd";
import axios from "axios";


const CalendarNote = () => {
  // Kullanıcı bağlamını kullan
  const { user } = useContext(UserContext);

  // State'ler ve yükleme durumları
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [plan, setPlan] = useState([]);
  const [rutinsLoading, setRutinsLoading] = useState(true);
  const [todosLoading, setTodosLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(true);


  const apiUrl =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH";

  // Rutinleri, todos'ları ve planları al
  useEffect(() => {
    // Rutinleri getir
    const fetchRutins = async () => {
      try {
        const response = await axios.get(`${apiUrl}?tabId=sayfa2`);
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
        setRutinsLoading(false);
      } catch (error) {
        console.error("Rutinler getirilirken hata oluştu:", error);
        setRutinsLoading(false);
      }
    };

    // Todos'ları getir
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${apiUrl}?tabId=sayfa3`);
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
        setTodosLoading(false);
      } catch (error) {
        console.error("Todos getirilirken hata oluştu:", error);
        setTodosLoading(false);
      }
    };

    // Planları getir
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`${apiUrl}?tabId=sayfa4`);
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
        setPlanLoading(false);
      } catch (error) {
        console.error("Planlar getirilirken hata oluştu:", error);
        setPlanLoading(false);
      }
    };

    // Eğer kullanıcı varsa, yerel depodan verileri kontrol et ve gerekirse yeniden getir
    if (user) {
      const storedRutins = JSON.parse(
        localStorage.getItem(`rutins_${user.username}`)
      );
      if (storedRutins) {
        fetchRutins();
        setRutins(storedRutins);
        setRutinsLoading(false);
      } else {
        fetchRutins();
      }

      const storedTodos = JSON.parse(
        localStorage.getItem(`todos_${user.username}`)
      );
      if (storedTodos) {
        fetchTodos();
        setTodos(storedTodos);
        setTodosLoading(false);
      } else {
        fetchTodos();
      }

      const storedPlan = JSON.parse(
        localStorage.getItem(`plan_${user.username}`)
      );
      if (storedPlan) {
        fetchPlan();
        setPlan(storedPlan);
        setPlanLoading(false);
      } else {
        fetchPlan();
      }
    }
  }, [user]);

  // Rutin verilerini döndür
  const getListData = () => {
    if (!rutins.length) return [];

    return rutins.map((rutin) => ({
      type: "rutin",
      content: rutin.rutins,
      day: rutin.day,
      time: rutin.time,
    }));
  };
  
  // Tarih hücresi içeriğini ayarla
  const dateCellRender = (value) => {
    const listData = getListData();
    const updatedListData = [];

    // Günün hafta içi adını al
    const dayOfWeek = value.format("dddd");

    // Rutinleri gün bazında ekle
    listData.forEach((rutin) => {
      if (rutin.day.toLowerCase() === dayOfWeek.toLowerCase()) {
        updatedListData.push({
          type: "rutin",
          content: rutin.content,
          time: rutin.time,
        });
      }
    });

    // Todos'ları tarihe göre ekle
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

    // Planları tarihe göre ekle
    plan.forEach((planItem) => {
      if (value.format("YYYY-MM-DD") === planItem.date) {
        updatedListData.push({
          type: "plan",
          content: planItem.plan,
          time: planItem.time,
        });
      }
    });

    // Güncellenmiş veri listesini döndür
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
              {item.time && (
                <>
                  <br />
                  {item.time}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Veri tipine göre arka plan rengi al
  const getBackgroundColor = (type) => {
    switch (type) {
      case "rutin":
        return "#2db7f5"; 
      case "todo":
        return "#87d068"; 
      case "plan":
        return "#ffa500"; 
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
