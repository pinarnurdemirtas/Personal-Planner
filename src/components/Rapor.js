import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Button, List, Select, message } from "antd";

const { Option } = Select;

const Rapor = () => {
  const { user } = useContext(UserContext); // Kullanıcı bilgisini usercontext'ten al
  const [rutins, setRutins] = useState([]); // Rutin verilerini saklamak için state tanımla
  const [todos, setTodos] = useState([]); // Yapılacakları saklamak için state tanımla
  const [loading, setLoading] = useState(true); // Yükleniyor durumunu yönetmek için state tanımla
  const [plan, setPlan] = useState([]); // Planları saklamak için state tanımla
  const [selectedMonth, setSelectedMonth] = useState(''); // Seçili ayı saklamak için state tanımla
  const [selectedYear, setSelectedYear] = useState(''); // Seçili yılı saklamak için state tanımla
  const [selectedDay, setSelectedDay] = useState(''); // Seçili günü saklamak için state tanımla

  
  const apiUrlRutins = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";
  const apiUrlTodos = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";
  const apiUrlPlan = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";

  // Kullanıcı değiştiğinde veya bileşen yüklendiğinde verileri getir
  useEffect(() => {
    const fetchRutins = async () => {
      try {
        const response = await axios.get(apiUrlRutins); // Rutin verilerini API'den al
        const filteredRutins = response.data.data
          .filter((rutin) => rutin.username === user.username) // Sadece kullanıcının rutinlerini filtrele
          .map((rutin, index) => ({
            ...rutin,
            id: index + 1,
          }));
        setRutins(filteredRutins); // Filtrelenmiş rutinleri state'e kaydet
        localStorage.setItem(`rutins_${user.username}`, JSON.stringify(filteredRutins)); // Yerel depolamada rutinleri sakla
        setLoading(false); // Yükleme durumunu güncelle
      } catch (error) {
        console.error("Error fetching routines:", error); 
        setLoading(false); // Yükleme durumunu güncelle
      }
    };

    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrlTodos); // Yapılacakları API'den al
        const filteredTodos = response.data.data
          .filter((todo) => todo.username === user.username) // Sadece kullanıcının yapılacaklarını filtrele
          .map((todo, index) => ({
            ...todo,
            id: index + 1,
          }));
        setTodos(filteredTodos); // Filtrelenmiş yapılacakları state'e kaydet
        localStorage.setItem(`todos_${user.username}`, JSON.stringify(filteredTodos)); // Yerel depolamada yapılacakları sakla
        setLoading(false); // Yükleme durumunu güncelle
      } catch (error) {
        console.error("Error fetching todos:", error); 
        setLoading(false); // Yükleme durumunu güncelle
      }
    };

    const fetchPlan = async () => {
      try {
        const response = await axios.get(apiUrlPlan); // Plan verilerini API'den al
        const filteredPlan = response.data.data
          .filter((plan) => plan.username === user.username) // Sadece kullanıcının planlarını filtrele
          .map((plan, index) => ({
            ...plan,
            id: index + 1,
          }));
        setPlan(filteredPlan); // Filtrelenmiş planları state'e kaydet
        localStorage.setItem(`plan_${user.username}`, JSON.stringify(filteredPlan)); // Yerel depolamada planları sakla
        setLoading(false); // Yükleme durumunu güncelle
      } catch (error) {
        console.error("Error fetching plans:", error); // Plan verilerini alma hatası
        setLoading(false); // Yükleme durumunu güncelle
      }
    };

    if (user) {
      const storedRutins = JSON.parse(localStorage.getItem(`rutins_${user.username}`)); // Yerel depolamadan rutinleri al
      if (storedRutins) {
        fetchRutins(); // Yerel depolamadaki rutinleri getir
        setRutins(storedRutins); // Bağlamdaki rutinleri ayarla
        setLoading(false); // Yükleme durumunu güncelle
      } else {
        fetchRutins(); // Yerel depolamada rutin yoksa API'den rutinleri getir
      }

      const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.username}`)); // Yerel depolamadan yapılacakları al
      if (storedTodos) {
        fetchTodos(); // Yerel depolamadaki yapılacakları getir
        setTodos(storedTodos); // Bağlamdaki yapılacakları ayarla
        setLoading(false); // Yükleme durumunu güncelle
      } else {
        fetchTodos(); // Yerel depolamada yapılacak yoksa API'den yapılacakları getir
      }

      const storedPlans = JSON.parse(localStorage.getItem(`plan_${user.username}`)); // Yerel depolamadan planları al
      if (storedPlans) {
        fetchPlan(); // Yerel depolamadaki planları getir
        setPlan(storedPlans); // Bağlamdaki planları ayarla
        setLoading(false); // Yükleme durumunu güncelle
      } else {
        fetchPlan(); // Yerel depolamada plan yoksa API'den planları getir
      }
    }
  }, [user]);

  // Seçilen ay, yıl ve gün parametrelerine göre plan ve yapılacakları filtrele
  const filterPlansAndTodos = (selectedMonth, selectedYear, selectedDay) => {
    const filteredTodos = todos.filter(todo => {
      const todoDate = new Date(todo.startDate); // todo'nun başlangıç tarihini al
      return (
        todoDate.getFullYear() === selectedYear && // Yıl eşleşiyor mu?
        (selectedMonth === '' || todoDate.getMonth() === selectedMonth) && // Ay eşleşiyor mu?
        (selectedDay === '' || todoDate.getDate() === selectedDay) // Gün eşleşiyor mu?
      );
    });
  
    const filteredPlans = plan.filter(plan => {
      const planDate = new Date(plan.date); // Plan tarihini al
      return (
        planDate.getFullYear() === selectedYear && // Yıl eşleşiyor mu?
        (selectedMonth === '' || planDate.getMonth() === selectedMonth) && // Ay eşleşiyor mu?
        (selectedDay === '' || planDate.getDate() === selectedDay) // Gün eşleşiyor mu?
      );
    });
  
    return { filteredTodos, filteredPlans }; // Filtrelenmiş yapılacaklar ve planları döndür
  };

  const { filteredTodos, filteredPlans } = filterPlansAndTodos(selectedMonth, selectedYear, selectedDay);


  // Ay seçimi değiştiğinde
  const handleMonthChange = (value) => {
    setSelectedMonth(value); // Seçili ayı güncelle
  };

  // Yıl seçimi değiştiğinde
  const handleYearChange = (value) => {
    setSelectedYear(value); // Seçili yılı güncelle
  };

  // Gün seçimi değiştiğinde
  const handleDayChange = (value) => {
    setSelectedDay(value); // Seçili günü güncelle
  };

  // Rutin verilerini List component'i için formatla
  const getListData2 = () => {
    if (!rutins.length) return []; // Eğer rutinler boşsa boş bir dizi döndür
    return rutins.map((rutin) => ({
      type: "info",
      content: rutin.rutins, // Rutin içeriği
      day: rutin.day, // Rutin günü
      time: rutin.time // Rutin saati
    }));
  };



  return (
    <div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Button
          style={{ height: 50, width: 250 }}
          type="primary"
          onClick={() => message.success("It has been successfully sent to your e-mail address.")}
        >
          <h4>Send to my e-mail address</h4>
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, paddingTop:30}}>
  <Select
    value={selectedYear}
    style={{ width: 120, marginRight: 10 }}
    onChange={handleYearChange}
    className="g"
  >
    <Option value={''}>Year</Option>
    <Option value={2020}>2020</Option>
    <Option value={2021}>2021</Option>
    <Option value={2022}>2022</Option>
    <Option value={2023}>2023</Option>
    <Option value={2024}>2024</Option>
    
  </Select>
  <Select
    value={selectedMonth}
    style={{ width: 120, marginRight: 10 }}
    onChange={handleMonthChange}
    className="g"
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
    className="g"
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
