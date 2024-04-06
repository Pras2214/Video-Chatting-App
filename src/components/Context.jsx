import { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [client, setClient] = useState();
  const [usersObj,setUsersObj] = useState();

  const updateUser = (newUserData, newClient, newUsersObj) => {
    setUser(newUserData);
    setClient(newClient);
    setUsersObj(newUsersObj);
  };

  return (
    <UserContext.Provider value={{ user, client, usersObj, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
