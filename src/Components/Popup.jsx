import React,{useState, useContext} from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { Select } from 'antd';
const Popup = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(null);
  const [role_name, setRole_name] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const {
    token, handleUnAuth,isChangePass,consultBody,consultTitle,
    setIsChangePass,isAddArticle,createArticle,setConsultTitle,
    openNotificationWithIcon,isAddNewEmployee,ArtTitle,setConsultBody,
    setArtTitle,ArtId,isEditConsult,handleEditConsult,handleAddConsultChildren,
    ArtBody, setArtBody,handleEditArticle,isEditArticle,isEditConsultChildren,
    setConsultName,consultName,consultBrief,setConsultBrief,
    isOpenPopup, setIsOpenPopup, roles, handleAddNewEmployee,
    isConsult,createConsult,isConsultChildren,handleEditConsultChildren,
  } = useContext(AppContext);
  const handleClose = ()=> {
    setIsOpenPopup(false);
  }
  const handleChangePassReq = () => {
    axios
    .post('https://api.goldenbeit.com/accounts/change-password',
      {
        old_password: oldPass,
        new_password: newPass,
        confirm_new_password: confirmPass
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setIsChangePass(false);
      setIsOpenPopup(false)
      openNotificationWithIcon('success','تم تغيير كلمة المرور بنجاح')
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err.status);
    });
  }
  if(isAddNewEmployee){
    return (
    <main className={`popup ${isOpenPopup ? 'active' : ''}`}>
      <div className='popup_inner'>
        <form className='change-pass' >
          <input type='text' required onChange={(e)=>setFirst_name(e.target.value)} placeholder='الأسم الأول'/>
          <input type='text' onChange={(e)=>setLast_name(e.target.value)} placeholder='الأسم الأخير'/>
          <input type='text'required onChange={(e)=>setUsername(e.target.value)} placeholder='رقم الهاتف'/>
          <input type='email' onChange={(e)=>setEmail(e.target.value)} placeholder='البريد الإلكتروني'/>
          <Select
            defaultValue="الصلاحية"
            style={{
              width: '100%',
            }}
            labelInValue
            onChange={(e)=>setRole_name(e.label)}
            options={roles}
          />
          {/* <select name="role_name" id="" onChange={(e)=>setRole_name(e.target.value)}>
            <option hidden disabled selected>الصلاحية</option>
            {roles && roles.map((role)=>(
              <option value={role.name}>{role.name}</option>
            ))}
          </select> */}
        </form>
        <div className="btns">
          <button onClick={()=>handleAddNewEmployee(first_name,last_name,username,email,role_name)} className='rate-btn'>إضافة موظف</button>
          <button onClick={handleClose} className='close-btn'>اغلاق</button>
        </div>
      </div>
    </main>
    )
  }
  if(isAddArticle){
    return (
    <main className={`popup ${isOpenPopup ? 'active' : ''}`}>
      <div className='popup_inner'>
        <form className='change-pass' >
          <input value={ArtTitle} type='text' required onChange={(e)=>setArtTitle(e.target.value)} placeholder='عنوان المقالة'/>
          <textarea value={ArtBody}  rows='8' onChange={(e)=>setArtBody(e.target.value)} placeholder='نص المقالة'/>
        </form>
        <div className="btns">
          <button onClick={()=>createArticle(ArtTitle,ArtBody)} className='rate-btn'>إضافة مقالة</button>
          <button onClick={handleClose} className='close-btn'>اغلاق</button>
        </div>
      </div>
    </main>
    )
  }
  if(isEditArticle){
    return (
    <main className={`popup ${isOpenPopup ? 'active' : ''}`}>
      <div className='popup_inner'>
        <form className='change-pass' >
          <input value={ArtTitle} type='text' required onChange={(e)=>setArtTitle(e.target.value)} placeholder='عنوان المقالة'/>
          <textarea value={ArtBody}  rows='8' onChange={(e)=>setArtBody(e.target.value)} placeholder='نص المقالة'/>
        </form>
        <div className="btns">
          <button onClick={()=>handleEditArticle(ArtTitle,ArtBody)} className='rate-btn'> تعديل المقالة</button>
          <button onClick={handleClose} className='close-btn'>اغلاق</button>
        </div>
      </div>
    </main>
    )
  }
  if(isConsultChildren){
    return (
    <main className={`popup ${isOpenPopup ? 'active' : ''}`}>
      <div className='popup_inner'>
        <form className='change-pass' >
          <input value={consultTitle} type='text' required onChange={(e)=>setConsultTitle(e.target.value)} placeholder='عنوان الاستشارة'/>
          <textarea value={consultBody}  rows='8' onChange={(e)=>setConsultBody(e.target.value)} placeholder='نص الاستشارة'/>
        </form>
        <div className="btns">
          <button onClick={isEditConsultChildren&&isConsultChildren? handleEditConsultChildren:handleAddConsultChildren} className='rate-btn'>حفظ</button>
          <button onClick={handleClose} className='close-btn'>اغلاق</button>
        </div>
      </div>
    </main>
    )
  }
  // update-consult-type
  if(isConsult){
    return (
    <main className={`popup ${isOpenPopup ? 'active' : ''}`}>
      <div className='popup_inner'>
        <form className='change-pass' >
          <input value={consultName} type='text' required onChange={(e)=>setConsultName(e.target.value)} placeholder='نوع الاستشارة'/>
          <input value={consultBrief} type='text' required onChange={(e)=>setConsultBrief(e.target.value)} placeholder='بريف الاستشارة'/>
        </form>
        <div className="btns">
          <button onClick={isEditConsult&&isConsult? handleEditConsult:createConsult} className='rate-btn'>حفظ</button>
          <button onClick={handleClose} className='close-btn'>اغلاق</button>
        </div>
      </div>
    </main>
    )
  }
  if(isChangePass){
    return (
      <main className={`popup ${isOpen ? 'active' : ''}`}>
        <div className='popup_inner'>
          <h2>{popupHeader}</h2>
          <form className='change-pass' onSubmit={handleChangePassReq}>
            <input type='password' onChange={(e)=>setOldPass(e.target.value)} placeholder='كلمة المرور الحالية'/>
            <input type='password' onChange={(e)=>setNewPass(e.target.value)} placeholder='كلمة المرور الجديدة'/>
            <input type='password' onChange={(e)=>setConfirmPass(e.target.value)} placeholder='تأكيد كلمة المرور الجديدة'/>
          </form>
          <div className="btns">
            <button onClick={handleAddNewEmployee} className='rate-btn'>إضافة موظف</button>
            <button onClick={handleClose} className='close-btn'>اغلاق</button>
          </div>
        </div>
      </main>
    )
  }
}

export default Popup