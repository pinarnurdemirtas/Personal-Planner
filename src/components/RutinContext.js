// UserContext.js
import React, { createContext, useState } from 'react';

// Kullanıcı bağlamını oluşturun
export const RutinContext = createContext();

// Kullanıcı sağlayıcısını oluşturun
export const RutinProvider = ({ children }) => {
  const [todos, setTodos] = useState(null);

  return (
    <RutinContext.Provider value={{ todos, setTodos }}>
      {children}
    </RutinContext.Provider>
  );
};
