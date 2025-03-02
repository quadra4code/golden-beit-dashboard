import React, { createContext, useState } from 'react';
import { notification } from 'antd';
import axios from 'axios';
const AppContext = createContext()
const AppProvider = ({children}) => {
  const [api, contextHolder] = notification.useNotification();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [paginatedStaff, setPaginatedStaff] = useState();
  const [isAddNewEmployee, setIsAddNewEmployee] = useState(false);
  const [roles, setRoles] = useState();
  const [isChangePass, setIsChangePass] = useState(false);
  const token = localStorage.getItem('token');
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description
    });
  };
  const handleUnAuth = async() => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    await setTimeout(()=>{
      openNotificationWithIcon('error','قم يتسجيل الدخول من جديد ');
    },3000)
    window.location.href='/'
  }
  const handleAddNewEmployee = (first_name, last_name, username, email, role_name) => {
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/add-staff',
      {
        first_name,
        last_name,
        username,
        email,
        role_name
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsAddNewEmployee(false);
      setIsOpenPopup(false);
      setPaginatedStaff(res.data.data.all);
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    });
  }
  return (
    <AppContext.Provider value={{isChangePass, setIsChangePass, 
      isAddNewEmployee, setIsAddNewEmployee, isOpenPopup, setIsOpenPopup,
      handleUnAuth,openNotificationWithIcon,contextHolder,token,
      roles,setRoles,handleAddNewEmployee,paginatedStaff, setPaginatedStaff
      }}>
      {children}
    </AppContext.Provider>
  )
}

export {AppContext, AppProvider}