import { useState,createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [client, setClient] = useState();

  const updateUser = (newUserData,newClient) => {
    setUser(newUserData);
    setClient(newClient);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
