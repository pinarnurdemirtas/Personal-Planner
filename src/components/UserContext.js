import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // localStorage'dan kaydedilmiş todos'u al
    const storedTodos = JSON.parse(localStorage.getItem(`todos_${user?.username}`));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, [user]);

  // todos state'i değiştiğinde localStorage'e kaydet
  useEffect(() => {
    localStorage.setItem(`todos_${user?.username}`, JSON.stringify(todos));
  }, [todos, user]);

  console.log('vv', todos);
  return (
    <UserContext.Provider value={{ user, setUser, rutins, setRutins, todos, setTodos }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
