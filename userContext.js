import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const logout = ()=>{
        setUserData(null);
    }
    return (
        <UserContext.Provider value={{ userData, setUserData,logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => useContext(UserContext);