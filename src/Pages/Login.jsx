import React,{useState, useContext} from 'react';
import { AiOutlineLogin } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import {AppContext} from '../Context/AppContext';
import axios from 'axios';
export const Login = () => {
  const {openNotificationWithIcon,contextHolder} = useContext(AppContext)
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  // const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      openNotificationWithIcon('error', 'عملية خاطئه', 'من فضلك ادخل البيانات بشكل صحيح');
      return;
    }
    axios
    .post('https://api.goldenbeit.com/dashboard/staff-login', {
      username,
      password,
    })
    .then((res) => {
      console.log(res.data);
      const response = res.data.data;
      localStorage.setItem('golden-beit-dashboard-token', response.access_token);
      localStorage.setItem('name', response.user.full_name);
      localStorage.setItem('staffRoles', response.user.role);
      if (response.user.role.includes('Sales')) {
        window.location.href = '/paginated-orders';
      }
      else {
        window.location.href = `/`
      }
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error', 'عملية خاطئه', err.message);
    })
  };
  return (
    <>
      {contextHolder}
      <main className='login'>
        <div className="form-cont">
          <h1>من فضلك قم بإدخال بيانات الدخول</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder='رقم الهاتف' onChange={(e)=>{setUsername(e.target.value)}}/>
            <input type="password" placeholder='كلمة المرور'onChange={(e)=>{setPassword(e.target.value)}}/>
            <button>
              تسجيل الدخول
              <AiOutlineLogin />
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
