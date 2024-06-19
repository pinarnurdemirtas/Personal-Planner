import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch todos from localStorage
      const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.username}`));
      if (storedTodos) {
        setTodos(storedTodos);
      }

      // Fetch plan from localStorage
      const storedPlan = JSON.parse(localStorage.getItem(`plan_${user.username}`));
      if (storedPlan) {
        setPlan(storedPlan);
      }
    }
  }, [user]);

  // Save todos to localStorage when todos state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.username}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  // Save plan to localStorage when plan state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(plan));
    }
  }, [plan, user]);

  return (
    <UserContext.Provider value={{ user, setUser, rutins, setRutins, todos, setTodos, plan, setPlan }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
