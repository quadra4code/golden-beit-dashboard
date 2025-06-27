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
        {
          key: 'sub3',
          label: 'إدارة البيانات الأساسية ',
          icon: <BsClipboardData />,
          children: [
            { key: '13', label: 'أنواع الوحدات', route: "all-unit-types" },
            { key: '14', label: 'الطروحات', route: "all-proposals" },
            { key: '15', label: 'المشاريع', route: "all-projects" },
            { key: '16', label: 'المدن', route: "all-cities" },
            { key: '17', label: 'المناطق', route: "all-regions" },
            { key: '18', label: 'حالات الوحدات', route: "all-status" },
          ],
        },
        { key: '19', icon: <MdLogout />, label: 'Log Out' },
      ]
    };

    const isSalesOnly = staffRoles && 
      staffRoles.includes('Sales') && 
      !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role));

    return [
      ...(isSalesOnly ? allMenuItems.salesMenu : allMenuItems.adminMenu)
    ];
  };

  const items = getMenuItems();

  const onClick = (e) => {
      // Find the item with the matching key and route
      const item = items.find(item => item.key === e.key || (item.children && item.children.find(child => child.key === e.key)));
      if (item && item.route) {
        navigate(item.route);
      }
      else if (item && item.children) {
        const subItem = item.children.find(ch => ch.key === e.key);
        navigate(subItem.route);
      }
      else if (item.label === 'Log Out'){
        handleLogout();
        }
      else {
        navigate('/');
      }
  };

  return (
    <section className='sidenav'>
      <div className='logo-holder'>
        <img src={logo} alt="logo" />
        <span>Golden Beit</span>
      </div>
      <Menu
      onClick={onClick}
      style={{
        width: 256,
      }}
      mode="inline"
      items={items}
    />
    </section>
  );
};
