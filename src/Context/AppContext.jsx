import React, { createContext, useState } from 'react';
import { notification } from 'antd';
import axios from 'axios';
const AppContext = createContext()
const AppProvider = ({children}) => {
  const [api, contextHolder] = notification.useNotification();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [paginatedStaff, setPaginatedStaff] = useState();
  const [consultId, setConsultId] = useState(null);
  const [consultChildId, setConsultChildId] = useState(null);
  const [consultName,setConsultName] = useState();
  const [consultBrief,setConsultBrief] = useState();
  const [consultTitle,setConsultTitle] = useState();
  const [consultBody,setConsultBody] = useState();
  const [isAddNewEmployee, setIsAddNewEmployee] = useState(false);
  const [isAddArticle, setIsAddArticle] = useState(false);
  const [isConsult, setIsConsult] = useState(false);
  const [isConsultChildren,setIsConsultChildren] = useState(false);
  const [isEditArticle, setIsEditArticle] = useState(false);
  const [isEditConsult, setIsEditConsult] = useState(false);
  const [isEditConsultChildren, setIsEditConsultChildren] = useState(false);
  const [articleId, setArticleId] = useState(false);
  const [paginatedConsults, setPaginatedConsults] = useState();
  const [paginatedConsultChildren, setPaginatedConsultChildren] = useState();
  const [ArtTitle, setArtTitle] = useState(null);
  const [ArtBody, setArtBody] = useState(null);
  const [ArtId, setArtId] = useState(null);
  const [paginatedArticles, setPaginatedArticles] = useState();
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
    localStorage.removeItem('token');
    window.location.href = `${window.location.origin}/login`
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
  const createConsult = () => {
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/create-consult-type',
      {
        name:consultName,
        brief:consultBrief,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsConsult(false);
      setIsOpenPopup(false);
      setPaginatedConsults(res.data.data)
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
  const handleEditConsult = () => {
    console.log(consultId,consultBrief,consultName);
    axios
    .put(`https://golden-gate-three.vercel.app/dashboard/update-consult-type/${consultId}`,
      {
        name: consultName,
        brief: consultBrief
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setConsultBrief('');
      setConsultName('');
      setIsOpenPopup(false)
      setIsEditConsult(false)
      setPaginatedConsults(res.data.data)
      openNotificationWithIcon('success',res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    });
  }
  const createArticle = (title,body) => {
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/create-article',
      {
        title,
        body,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsAddArticle(false);
      setIsOpenPopup(false);
      setPaginatedArticles(res.data.data)
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
  const handleEditArticle = () => {
    console.log(ArtId,ArtTitle,ArtBody);
    axios
    .put(`https://golden-gate-three.vercel.app/dashboard/update-article/${ArtId}`,
      {
        title: ArtTitle,
        body: ArtBody,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setArtBody('');
      setArtTitle('');
      setIsOpenPopup(false)
      setIsEditArticle(false)
      setPaginatedArticles(res.data.data)
      openNotificationWithIcon('success',res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err.status);
    });
  }
  const handleAddConsultChildren = () => {
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/create-consultation',
      {
        title:consultTitle,
        body:consultBody,
        consultation_type_id:consultId
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsConsultChildren(false);
      setIsOpenPopup(false);
      setPaginatedConsultChildren(res.data.data)
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
  const handleEditConsultChildren = () => {
    console.log(consultChildId,consultTitle,consultBody);
    axios
    .put(`https://golden-gate-three.vercel.app/dashboard/update-consultation/${consultChildId}`,
      {
        title:consultTitle,
        body:consultBody,
        consultation_type_id:consultId
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsConsultChildren(false);
      setIsEditConsultChildren(false);
      setIsOpenPopup(false);
      setPaginatedConsultChildren(res.data.data)
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
      handleEditArticle,consultTitle,setConsultTitle,consultBody,setConsultBody,
      isAddNewEmployee, setIsAddNewEmployee, isOpenPopup, setIsOpenPopup,
      consultName,setConsultName,isEditConsultChildren, setIsEditConsultChildren,
      paginatedConsultChildren, setPaginatedConsultChildren,isConsultChildren,setIsConsultChildren,
      handleUnAuth,openNotificationWithIcon,contextHolder,token,isEditArticle,
      consultId, setConsultId,handleAddConsultChildren,handleEditConsultChildren,
      roles,setRoles,handleAddNewEmployee,paginatedStaff, setPaginatedStaff,
      setIsEditArticle,isAddArticle, setIsAddArticle,createArticle,
      paginatedArticles,setPaginatedArticles,handleEditConsult,
      articleId, setArticleId, ArtTitle, setArtTitle,ArtBody, setArtBody,
      ArtId,setArtId,isEditConsult, setIsEditConsult,consultChildId, setConsultChildId,
      paginatedConsults, setPaginatedConsults,isConsult, setIsConsult,
      createConsult,consultBrief,setConsultBrief
      }}>
      {children}
    </AppContext.Provider>
  )
}

export {AppContext, AppProvider}