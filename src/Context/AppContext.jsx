import React, { createContext } from 'react';
import { notification } from 'antd';
const AppContext = createContext()
const AppProvider = ({children}) => {
  const [api, contextHolder] = notification.useNotification();
  const token = localStorage.getItem('token')
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description
    });
  };
  return (
    <AppContext.Provider value={{openNotificationWithIcon,contextHolder,token}}>
      {children}
    </AppContext.Provider>
  )
}

export {AppContext, AppProvider}