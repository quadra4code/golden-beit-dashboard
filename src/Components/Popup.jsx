import React,{useState, useContext} from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
const Popup = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(null);
  const [role_name, setRole_name] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const {token, handleUnAuth,isChangePass, setIsChangePass,
        openNotificationWithIcon,isAddNewEmployee, setIsAddNewEmployee,
        isOpenPopup, setIsOpenPopup, roles, handleAddNewEmployee} = useContext(AppContext);
  const handleClose = ()=> {
    setIsOpenPopup(false);
  }
  const handleChangePassReq = () => {
    axios
    .post('https://golden-gate-three.vercel.app/accounts/change-password',
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
        <form className='change-pass' onSubmit={handleChangePassReq}>
          <input type='text' required onChange={(e)=>setFirst_name(e.target.value)} placeholder='الأسم الأول'/>
          <input type='text' onChange={(e)=>setLast_name(e.target.value)} placeholder='الأسم الأخير'/>
          <input type='text'required onChange={(e)=>setUsername(e.target.value)} placeholder='رقم الهاتف'/>
          <input type='email' onChange={(e)=>setEmail(e.target.value)} placeholder='البريد الإلكتروني'/>
          <select name="role_name" id="" onChange={(e)=>setRole_name(e.target.value)}>
            <option hidden disabled selected>الصلاحية</option>
            {roles && roles.map((role)=>(
              <option value={role.name}>{role.name}</option>
            ))}
          </select>
        </form>
        <div className="btns">
          <button onClick={()=>handleAddNewEmployee(first_name,last_name,username,email,role_name)} className='rate-btn'>إضافة موظف</button>
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