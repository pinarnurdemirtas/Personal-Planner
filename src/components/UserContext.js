// UserContext.js
import React, { createContext, useState } from 'react';

// Kullanıcı bağlamını oluşturun
export const UserContext = createContext();

// Kullanıcı sağlayıcısını oluşturun
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
