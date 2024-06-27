import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import {
  Input,
  Button,
  List,
  Row,
  Col,
  Card,
  DatePicker,
  TimePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const Plan = () => {
  const { user, plan, setPlan } = useContext(UserContext); //useContextten planları ve kullanıcıyı al
  const [inputValue, setInputValue] = useState(""); // Yeni plan girişi
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const apiUrlPlans =
    "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";

  // Planları getiren ve yerel depolamaya yazan useEffect
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(apiUrlPlans); // API'den planları getir
        const data = response.data.data; // API yanıtından veriyi al
        const filteredPlans = data
          .filter((plan) => plan.username === user.username) // Sadece mevcut kullanıcıya ait planları filtrele
          .map((plan, index) => ({
            ...plan,
            id: index + 1,
          }));
        setPlan(filteredPlans); // Filtrelenmiş planları usercontexte ayarla
        localStorage.setItem(
          `plan_${user.username}`,
          JSON.stringify(filteredPlans)
        ); // Yerel depolamaya güncellenmiş planları yaz
      } catch (error) {
        console.error("Planlar alınırken hata oluştu:", error); // Hata durumunda konsola hata yazdır
      }
    };

    const storedPlan = JSON.parse(
      localStorage.getItem(`plan_${user.username}`)
    ); // Yerel depolamadan planları al
    if (storedPlan) {
      //Yerel depolamada plan varsa hem onları göster hem de API'den gelenleri
      fetchPlans();
      setPlan(storedPlan);
    } else {
      fetchPlans(); // Yerel depolamada plan yoksa API'deki planları göster
    }
  }, [user, setPlan]); // Kullanıcı veya setplan değiştiğinde useEffect'i tetikle

  // Planlar güncellendiğinde yerel depolamaya yazan useEffect
  useEffect(() => {
    if (user) {
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(plan)); // Planları yerel depolamaya yaz
    }
  }, [plan, user]); // Plan veya kullanıcı değiştiğinde useEffect'i tetikle

  // Yeni bir plan eklemek için işlev
  const handleAddPlan = async () => {
    if (inputValue.trim() !== "" && selectedDate && selectedTime) {
      const date = selectedDate.format("YYYY-MM-DD"); // Seçilen tarihi biçimlendir
      const time = selectedTime.format("HH:mm"); // Seçilen saati biçimlendir

      // Aynı tarihte ve saatte zaten bir plan varsa kontrol et
      const warning = plan.find((p) => p.date === date && p.time === time);

      if (warning) {
        // Kullanıcıya onay için bir uyarı göster
        const confirmed = window.confirm(
          `${date} tarihinde zaten bir plan var. Yine de bu plan eklenilsin mi?`
        );

        if (!confirmed) {
          return; // Kullanıcı işlemi iptal etti, devam etme
        }
      }

      const newplan = {
        plan: inputValue,
        date: date,
        time: time,
        username: user.username,
      };

      try {
        const myHeaders = new Headers(); //içeriğinin JSON formatında olduğunu belirtir
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
          body: JSON.stringify([Object.values(newplan)]), // newplan'i bir diziye dönüştür
        };

        const response = await fetch(apiUrlPlans, requestOptions); // Planı API'ye ekle
        const data = await response.json(); // API JSON verisi döndürüyorsa

        const newRowId = data.rowId; // Yeni eklenen planın satır id'si
        const updatedPlans = [
          ...plan,
          { ...newplan, id: plan.length + 1, rowId: newRowId }, //plan dizisine yeni plan ekle
        ];
        setPlan(updatedPlans); // Planları bağlama ayarla
        setInputValue(""); // Input değerini temizle
        setSelectedDate(null); // Seçili tarihi temizle
        setSelectedTime(null); // Seçili saati temizle

        localStorage.setItem(
          `plan_${user.username}`,
          JSON.stringify(updatedPlans)
        ); // Yerel depolamaya güncellenmiş planları yaz
      } catch (error) {
        console.error("Plan eklenirken hata oluştu:", error); // Hata durumunda konsola hata yazdır
      }
    }
  };

  // Plan silmek için işlev
  const handleDeletePlan = async (id) => {
    try {
      const planToDelete = plan.find((plan) => plan.id === id); // Silinecek planı bul

      if (!planToDelete) {
        console.error("Silinecek plan bulunamadı"); // Plan bulunamazsa konsola hata yazdır
        return;
      }

      axios
        .delete(apiUrlPlans, {
          params: {
            row_id: planToDelete.row_id,
          },
        })
        .then((response) => {
          console.log("Silme işlemi başarılı:", response); // Silme işlemi başarılıysa konsola başarı yazdır

          // Silinen planı state'ten kaldır
          const updatedPlan = plan.filter((plan) => plan.id !== id);
          setPlan(updatedPlan); // Planları bağlama ayarla

          // yerel depolamayı güncelle
          localStorage.setItem(
            `plan_${user.username}`,
            JSON.stringify(updatedPlan)
          );
        });
    } catch (error) {
      console.error("Plan silinirken hata oluştu:", error); // Hata durumunda konsola hata yazdır
    }
  };

  // Input değeri değiştiğinde
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Input değerini güncelle
  };

  // Tarih seçildiğinde
  const handleDateChange = (date) => {
    setSelectedDate(date); // Seçilen tarihi güncelle
  };

  // Saat seçildiğinde
  const handleTimeChange = (time) => {
    setSelectedTime(time); // Seçilen saati güncelle
  };

  return (
    <Card bordered={true} title={<h1>Planner</h1>}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8}>
          <Input
            placeholder="Add new plan"
            value={inputValue}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={12} sm={6}>
          <DatePicker
            placeholder="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <TimePicker
            placeholder="Select Time"
            value={selectedTime}
            onChange={handleTimeChange}
            format="HH:mm"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button
            type="primary"
            onClick={handleAddPlan}
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
            disabled={!inputValue || !selectedDate || !selectedTime}
          >
            Add Plan
          </Button>
        </Col>
      </Row>

      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={plan}
        renderItem={(plan) => (
          <List.Item
            actions={[
              <Button
                onClick={() => handleDeletePlan(plan.id)}
                icon={<DeleteOutlined />}
                type="primary"
              >
                Delete
              </Button>,
            ]}
          >
            <div>
              <h3>{plan.plan}</h3>
              <p>Date: {plan.date}</p>
              <p>Time: {plan.time}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Plan;
