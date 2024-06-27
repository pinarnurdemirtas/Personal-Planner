import React, { createContext, useState, useEffect } from "react";

// Kullanıcı verilerini paylaşmak için UserContext oluşturduk
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Kullanıcı, rutinler, yapılacaklar ve planlar için state tanımları
  const [user, setUser] = useState(null);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [plan, setPlan] = useState([]);

  // Yerel depolamadan kullanıcı verilerini çek
  useEffect(() => {
    if (user) {
      // Yapılacaklar listesini yerel depolamadan çek
      const storedTodos = JSON.parse(
        localStorage.getItem(`todos_${user.username}`)
      );
      if (storedTodos) {
        setTodos(storedTodos);
      }

      // Planları yerel depolamadan çek
      const storedPlan = JSON.parse(
        localStorage.getItem(`plan_${user.username}`)
      );
      if (storedPlan) {
        setPlan(storedPlan);
      }

      // Rutinleri yerel depolamadan çek
      const storedRutins = JSON.parse(
        localStorage.getItem(`rutins_${user.username}`)
      );
      if (storedRutins) {
        setRutins(storedRutins);
      }
    }
  }, [user]);

  // Todos state'i değiştiğinde, yerel depolamaya kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.username}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  // Plan state'i değiştiğinde, yerel depolamaya kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem(`plan_${user.username}`, JSON.stringify(plan));
    }
  }, [plan, user]);

  // Rutins state'i değiştiğinde, yerel depolamaya kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem(`rutins_${user.username}`, JSON.stringify(rutins));
    }
  }, [rutins, user]);

  // Kullanıcı verilerini ve fonksiyonlarını çocuk bileşenlere aktarma
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        rutins,
        setRutins,
        todos,
        setTodos,
        plan,
        setPlan,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
