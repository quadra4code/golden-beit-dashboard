import React, { useContext } from 'react'
import { Sidebar } from '../Components/Sidebar'
import { AppContext } from '../Context/AppContext'
import Table from '../Components/StaffTable'
import { Statics } from '../Components/Statics'
import { Outlet } from 'react-router-dom'
import Popup from '../Components/Popup'

const Home = () => {
  const {contextHolder} = useContext(AppContext)
  return (
    <main className='home'>
      <Popup/>
      {contextHolder}
      <Sidebar/>
      <section className='content'>
        <div className="chart"><Statics/></div>
        <div className="data-view">
          <Outlet/>
        </div>
      </section>
    </main>
  )
}

export default Home