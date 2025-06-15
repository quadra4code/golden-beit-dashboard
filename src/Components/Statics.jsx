import React, {useContext, useEffect, useState} from 'react'
import { BsBuildingFillCheck } from "react-icons/bs";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { BsBuildingFillAdd } from "react-icons/bs";
import { FaUserClock } from "react-icons/fa";
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
export const Statics = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    return;
  }

  const {handleUnAuth, token}= useContext(AppContext)
  const [statics, setStatics] = useState(null);
  const [activeVisitorsCount, setActiveVisitorsCount] = useState(null);
  // const statics = {
  //   donationsAmount: 1000,
  //   totalApplications: 100,
  //   totalEmails: 100
  // }
  useEffect(()=>{
    axios
    .get('https://api.goldenbeit.com/dashboard/main-statistics',
      {headers:{ 'Authorization' : `Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data.data);
      setStatics(res.data.data);
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    })
  },[])
  useEffect(()=>{
    handleActiveVisitorsCount();
    setInterval(()=>{
      handleActiveVisitorsCount();
    }, 300000);
  },[])
  const handleActiveVisitorsCount = () => {
    axios
    .get('https://api.goldenbeit.com/dashboard/active-visitors-count',
      {headers:{ 'Authorization' : `Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data.data);
      setActiveVisitorsCount(res.data.data);
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    })
  }
  return (
    <div className="statics-cont">
      <div className='static'>
        <FaUserClock/>
        <div className="col">
          <h1>
            {activeVisitorsCount && activeVisitorsCount.active_visitors_count}
          </h1>
          <span>
            العدد الحالي للزوار
          </span>
        </div>
      </div>
      <div className='static'>
        <BsBuildingFillAdd/>
        <div className="col">
          <h1>
            {statics && statics.requested_units}
          </h1>
          <span>
            عدد الوحدات المطلوبة
          </span>
        </div>
      </div>
      <div className='static'>
        <BsBuildingFillCheck/>
        <div className="col">
          <h1>{statics && statics.sold_units}</h1>
          <span>عدد الوحدات المباعة </span>
        </div>
      </div>
      <div className='static'>
        <PiBuildingApartmentFill/>
        <div className="col">
          <h1>{statics && statics.all_units}</h1>
          <span>إجمالي عدد الوحدات</span>
        </div>
      </div>
    </div>
  )
}
