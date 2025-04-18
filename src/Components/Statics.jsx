import React, {useContext, useEffect} from 'react'
import { BsClipboardData } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdMarkEmailUnread } from "react-icons/md";
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
export const Statics = () => {
  const {handleUnAuth, token}= useContext(AppContext)
  const statics = {
    donationsAmount: 1000,
    totalApplications: 100,
    totalEmails: 100
  }
  useEffect(()=>{
    axios
    .get('https://api.goldenbeit.com/dashboard/main-statistics',
      {headers:{ 'Authorization' : `Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data.data);
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    })
  })
  return (
    <div className="statics-cont">
      <div className='static'>
        <BsGraphUpArrow/>
        <div className="col">
          <h1>
            <MdAttachMoney/>
            {statics && statics.donationsAmount}
          </h1>
          <span>
            Total Number
          </span>
        </div>
      </div>
      <div className='static'>
        <BsClipboardData/>
        <div className="col">
          <h1>{statics && statics.totalApplications}</h1>
          <span>All submitted Units</span>
        </div>
      </div>
      <div className='static'>
        <MdMarkEmailUnread/>
        <div className="col">
          <h1>{statics && statics.totalEmails}</h1>
          <span>Total Incoming Emails</span>
        </div>
      </div>
    </div>
  )
}
