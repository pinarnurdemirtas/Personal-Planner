import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, List, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Rutin = () => {
  const { user, rutins, setRutins } = useContext(UserContext);
  const [inputValue, setInputValue] = useState('');

  const apiUrlRutins = 'https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2';

  useEffect(() => {
    if (user) {
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
        } catch (error) {
          console.error('Error fetching rutins:', error);
        }
      };

      const storedRutins = JSON.parse(localStorage.getItem(`rutins_${user.username}`));
      if (storedRutins) {
        setRutins(storedRutins);
      } else {
        fetchRutins();
      }
    }
  }, [user, setRutins]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddRutin = async () => {
    if (inputValue.trim() !== '') {
      const newId = uuidv4(); // Yeni id'yi hesaplayın
      const newRutin = {
        rutins: inputValue,
        username: user.username,
        rutinId: newId, // Yeni id'yi burada ekleyin
      };
      try {
        // Yeni rutini eklemek için API'ye istek yapıyoruz
        const response = await axios.post(apiUrlRutins, [Object.values(newRutin)]);
  
        // Yeni rutini updatedRutins array'ine ekliyoruz
        const updatedRutins = [...rutins, { ...newRutin, id: newId }];
        setRutins(updatedRutins);
        setInputValue('');
        localStorage.setItem(`rutins_${user.username}`, JSON.stringify(updatedRutins));
        console.log('Added rutin:', response.data, newId);
      } catch (error) {
        console.error('Error adding rutin:', error.response);
      }
    }
  };
  
  const handleDeleteRutin = async (id) => {
    try {
      const rutinToDelete = rutins.find((rutin) => rutin.id === id);
  
      if (!rutinToDelete) {
        console.error('Rutin not found');
        return;
      }
  
      console.log('Deleting rutin with id:', rutinToDelete.id);
  
      // Update the state to remove the deleted rutin
      const updatedRutins = rutins.filter((rutin) => rutin.id !== id);
      setRutins(updatedRutins);
  
      // Update local storage if needed
      localStorage.setItem(`rutins_${user.username}`, JSON.stringify(updatedRutins));
  
      // Simulate API call for feedback (no actual deletion)
   
  
    } catch (error) {
      console.error('Error deleting rutin:', error);
    }
  };
  
  
  

  return (
    <Card bordered={true} title={<h1>Routines</h1>}>
      <div>
        <Input
          placeholder="Add new rutin"
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: '300px', marginRight: '10px' }}
        />
        <Button type="primary" onClick={handleAddRutin} icon={<PlusOutlined />}>
          Add
        </Button>
        <List
          style={{ marginTop: '20px', maxWidth: '500px' }}
          bordered
          dataSource={rutins}
          renderItem={(rutin) => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => handleDeleteRutin(rutin.id)}>
                  Delete
                </Button>,
              ]}
            >
              {rutin.rutins}
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default Rutin;
