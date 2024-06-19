import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from "axios";
import { Input, Button, List, Row, Col, Card, DatePicker, TimePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const Plan = () => {
  const { user, plan, setPlan } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const apiUrlPlans = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(apiUrlPlans);
        console.log('API response:', response);

        if (response.data && response.data.data) {
          const fetchedPlans = response.data.data
            .filter(plan => plan.username === user.username) // Filter by username
            .map((plan, index) => ({
              ...plan,
              id: index + 1, // Add unique IDs
              rowId: plan.rowId || index + 1, // Ensure rowId is set correctly
            }));
          setPlan(fetchedPlans);
          localStorage.setItem(`plan_${user.username}`, JSON.stringify(fetchedPlans));
        } else {
          console.error('API response does not contain expected data format:', response.data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    const storedPlan = JSON.parse(localStorage.getItem(`plan_${user.username}`));
    if (storedPlan) {
      setPlan(storedPlan);
    } else {
      fetchPlans();
    }
  }, [user, setPlan]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(plan));
    }
  }, [plan, user]);

  const handleAddPlan = async () => {
    if (inputValue.trim() !== "" && selectedDate && selectedTime) {
      const date = selectedDate.format("YYYY-MM-DD");
      const time = selectedTime.format("HH:mm");

      const newPlan = {
        plan: inputValue,
        date: date,
        time: time,
        username: user.username,
        completed: false, // Initial completion state
      };

      try {
        const response = await axios.post(apiUrlPlans, [Object.values(newPlan)]);
        const newRowId = response.data.rowId;  // Assuming the API returns the row ID of the newly created row
        const updatedPlan = [...plan, { ...newPlan, id: plan.length + 1, rowId: newRowId }];
        setPlan(updatedPlan);
        setInputValue("");
        setSelectedDate(null);
        setSelectedTime(null);
        localStorage.setItem(`plan_${user.username}`, JSON.stringify(updatedPlan));
      } catch (error) {
        console.error("Error adding plan:", error);
      }
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      const planToDelete = plan.find(plan => plan.id === id);
  
      if (!planToDelete) {
        console.error('Plan not found');
        return;
      }

      const updatedPlan = plan.filter(plan => plan.id !== id);
      setPlan(updatedPlan);
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(updatedPlan));
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleToggleComplete = async (id) => {
    try {
      const updatedPlan = plan.map((plan) =>
        plan.id === id ? { ...plan, completed: !plan.completed } : plan
      );

      setPlan(updatedPlan);
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(updatedPlan));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
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
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <TimePicker
            placeholder="Select Time"
            value={selectedTime}
            onChange={handleTimeChange}
            format="HH:mm"
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button
            type="primary"
            onClick={handleAddPlan}
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
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
              <Button onClick={() => handleDeletePlan(plan.id)}>
                Delete
              </Button>,
              <Button
                type={plan.completed ? "default" : "primary"}
                onClick={() => handleToggleComplete(plan.id)}
              >
                {plan.completed ? "Undo" : "Complete"}
              </Button>
            ]}
            style={{
              textDecoration: plan.completed ? "line-through" : "none",
            }}
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
