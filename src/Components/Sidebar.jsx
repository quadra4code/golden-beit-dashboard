import React, { useState } from 'react';
import logo from '../assets/images/LOGO (2).png';
import { MdLogout } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { BsClipboardData } from "react-icons/bs";
import { MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
export const Sidebar = () => {
  const navigate = useNavigate();
  const handleParentApplicationsData = ()=> {
    setIsApplication("parentApplications");
    getParentApplicationsData();
    setIsParent(true)
  }
  const handleStudentApplicationsData = ()=> {
    setIsApplication("studentApplications");
    getStudentApplicationsData();
    setIsParent(false);
  }
  const handleContactData = ()=> {
    setIsApplication("contactUs");
    getContactData();
    setIsParent(false);
  }
  const handleUsersData = ()=> {
    setIsApplication("users");
    getUsersData();
    setIsParent(false);
  }
  const handleDonationData = (type)=> {
    setIsApplication("donations");
    type === 'one-time'?
    getDonationsData(true)
    :
    getDonationsData(false);
    setIsParent(false);
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = `${window.location.origin}/login`
  };
  const items = [
    {
      key: 'sub1',
      label: 'الموارد البشرية',
      icon: <BsClipboardData />,
      children: [
        {
          key: '1',
          label: 'الموظفين',
        },
        {
          key: '2',
          label: 'العملاء',
        }
      ],
    },
    {
      key: '3',
      icon: <MailOutlined />,
      label: 'إدارة رسائل التواصل',
      // onClick	:handleContactData
    },
    {
      key: '4',
      icon: <BsBuildings />,
      label: 'إدارة  الوحدات',
      // onClick	:handleContactData
    },
    {
      key: '5',
      icon: <MdLogout />,
      label: 'Log Out',
      // onClick	:handleLogout
    },
  ];
  const [openKeys, setOpenKeys] = useState(['sub1']); // Default open submenu
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };
  const onClick = (e) => {
    console.log('click ', e);
    if(e.key === '5'){
      handleLogout();
    }
    else if(e.key === '1'){
      navigate('paginated-staff');
    }
    // else if(e.key === '2'){
    //   navigate('paginated-clients');
    // }
    else{
      navigate('/');
    }
  };
  return (
    <section className='sidenav'>
      <div className='logo-holder'>
        <img src={logo} alt="logo" />
        <span>Golden Beit</span>
      </div>
      {/* <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        items={items}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      /> */}
      <Menu
      onClick={onClick}
      style={{
        width: 256,
      }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
    </section>
  );
};
