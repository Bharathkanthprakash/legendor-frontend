import React, { createContext, useContext } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  // Socket connection will be implemented later
  const socket = null;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
