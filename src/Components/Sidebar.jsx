// import React, { useState } from 'react';
import { MdLogout } from "react-icons/md";
import logo from '../assets/Images/LOGO-(2).png'
import { BsBuildings } from "react-icons/bs";
import { BsClipboardData } from "react-icons/bs";
import { MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { AiOutlinePullRequest } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { GrArticle } from "react-icons/gr";
import { AiOutlinePartition } from "react-icons/ai";
import { MdOutlineRateReview } from "react-icons/md";
export const Sidebar = () => {
  const navigate = useNavigate();
  // const handleParentApplicationsData = ()=> {
  //   setIsApplication("parentApplications");
  //   getParentApplicationsData();
  //   setIsParent(true)
  // }
  // const handleStudentApplicationsData = ()=> {
  //   setIsApplication("studentApplications");
  //   getStudentApplicationsData();
  //   setIsParent(false);
  // }
  // const handleContactData = ()=> {
  //   setIsApplication("contactUs");
  //   getContactData();
  //   setIsParent(false);
  // }
  // const handleUsersData = ()=> {
  //   setIsApplication("users");
  //   getUsersData();
  //   setIsParent(false);
  // }
  // const handleDonationData = (type)=> {
  //   setIsApplication("donations");
  //   type === 'one-time'?
  //   getDonationsData(true)
  //   :
  //   getDonationsData(false);
  //   setIsParent(false);
  // }
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('staffRoles');
    window.location.href = `${window.location.origin}/login`
  };
  const getMenuItems = () => {
    const staffRoles = localStorage.getItem('staffRoles');
    
    const allMenuItems = {
      salesMenu: [
        {
          key: '7',
          icon: <AiOutlinePullRequest />,
          label: 'إدارة الطلبات',
          route: 'paginated-orders'
        },
      ],
      adminMenu: [
        {
          key: 'sub1',
          label: 'الموارد البشرية',
          icon: <BsClipboardData />,
          children: [
            { key: '1', label: 'الموظفين', route: "paginated-staff" },
            { key: '2', label: 'العملاء', route: "paginated-clients" }
          ],
        },
        {
          key: 'sub2',
          label: 'إدارة الوحدات ',
          icon: <BsClipboardData />,
          children: [
            { key: '3', label: 'الوحدات الجديدة', route: "paginated-new-units" },
            { key: '4', label: 'الوحدات الحالية', route: "paginated-current-units" },
            { key: '5', label: 'الوحدات المميزة', route: "paginated-featured-units" },
            { key: '6', label: 'الوحدات المرفوضة', route: "paginated-rejected-units" },
            { key: '7', label: 'الوحدات المحذوفة', route: "paginated-deleted-units" }
          ],
        },
        { key: '8', icon: <AiOutlinePullRequest />, label: 'إدارة  الطلبات', route: "paginated-orders" },
        { key: '9', icon: <GrArticle />, label: 'إدارة  المقالات', route: "paginated-articles" },
        { key: '10', icon: <AiOutlinePartition />, label: 'إدارة  الاستشارات', route: "paginated-consultations" },
        { key: '11', icon: <MdOutlineRateReview />, label: 'إدارة  التقييمات', route: "paginated-reviews" },
        { key: '12', icon: <MailOutlined />, label: 'إدارة رسائل التواصل', route: "paginated-emails" },
      ]
    };

    const logoutItem = {
      key: '13',
      icon: <MdLogout />,
      label: 'Log Out',
    };

    const isSalesOnly = staffRoles && 
      staffRoles.includes('Sales') && 
      !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role));

    return [
      ...(isSalesOnly ? allMenuItems.salesMenu : allMenuItems.adminMenu),
      logoutItem
    ];
  };

  const items = getMenuItems();

  const onClick = (e) => {
    if (e.key === '13') {
      handleLogout();
    } else {
      // Find the item with the matching key and route
      const item = items.find(item => item.key === e.key || (item.children && item.children.find(child => child.key === e.key)));
      console.log(item)
      if (item && item.route) {
        navigate(item.route);
      } else {
        navigate('/');
      }
    }
  };
  // const itemss = [
  //   {
  //     key: 'sub1',
  //     label: 'الموارد البشرية',
  //     icon: <BsClipboardData />,
  //     children: [
  //       {
  //         key: '1',
  //         label: 'الموظفين',
  //       },
  //       {
  //         key: '2',
  //         label: 'العملاء',
  //       }
  //     ],
  //   },
  //   {
  //     key: 'sub2',
  //     label: 'إدارة الوحدات ',
  //     icon: <BsClipboardData />,
  //     children: [
  //       {
  //         key: '3',
  //         label: 'الوحدات الجديدة',
  //       },
  //       {
  //         key: '4',
  //         label: 'الوحدات الحالية',
  //       },
  //       {
  //         key: '5',
  //         label: 'الوحدات المميزة',
  //       },
  //       {
  //         key: '6',
  //         label: 'الوحدات المحذوفة',
  //       }
  //     ],
  //   },
  //   // {
  //   //   key: '3',
  //   //   icon: <BsBuildings />,
  //   //   label: 'إدارة  الوحدات',
  //   //   // onClick	:handleContactData
  //   // },
  //   {
  //     key: '7',
  //     icon: <AiOutlinePullRequest />,
  //     label: 'إدارة الطلبات',
  //     // onClick	:handleContactData
  //   },
  //   {
  //     key: '8',
  //     icon: <GrArticle />,
  //     label: 'إدارة  المقالات',
  //     // onClick	:handleContactData
  //   },
  //   {
  //     key: '9',
  //     icon: <AiOutlinePartition />,
  //     label: 'إدارة  الاستشارات',
  //     // onClick	:handleContactData
  //   },
  //   {
  //     key: '10',
  //     icon: <MdOutlineRateReview />,
  //     label: 'إدارة  التقييمات',
  //     // onClick	:handleContactData
  //   },
  //   {
  //     key: '11',
  //     icon: <MailOutlined />,
  //     label: 'إدارة رسائل التواصل',
  //     // onClick	:handleContactData
  //   },
  //   {
  //     key: '12',
  //     icon: <MdLogout />,
  //     label: 'Log Out',
  //     // onClick	:handleLogout
  //   },
  // ];
  // const [openKeys, setOpenKeys] = useState(['sub1']); // Default open submenu
  // const onOpenChange = (keys) => {
  //   const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
  //   if (latestOpenKey) {
  //     setOpenKeys([latestOpenKey]);
  //   } else {
  //     setOpenKeys([]);
  //   }
  // };

  // const onClick = (e) => {
  //   console.log('click ', e);
  //   if(e.key === '13'){
  //     handleLogout();
  //   }
  //   else if(e.key === '1'){
  //     navigate('paginated-staff');
  //   }
  //   else if(e.key === '2'){
  //     navigate('paginated-clients');
  //   }
  //   else if(e.key === '3'){
  //     navigate('paginated-new-units');
  //   }
  //   else if(e.key === '4'){
  //     navigate('paginated-current-units');
  //   }
  //   else if(e.key === '5'){
  //     navigate('paginated-featured-units');
  //   }
  //   else if(e.key === '6'){
  //     navigate('paginated-rejected-units');
  //   }
  //   else if(e.key === '7'){
  //     navigate('paginated-deleted-units');
  //   }
  //   else if(e.key === '8'){
  //     navigate('paginated-orders');
  //   }
  //   else if(e.key === '9'){
  //     navigate('paginated-articles');
  //   }
  //   else if(e.key === '10'){
  //     navigate('paginated-consultations');
  //   }
  //   else if(e.key === '11'){
  //     navigate('paginated-reviews');
  //   }
  //   else if(e.key === '12'){
  //     navigate('paginated-emails');
  //   }
  //   else {
  //     navigate('/');
  //   }
  // };
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
      // defaultSelectedKeys={['1']}
      // defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
    </section>
  );
};
