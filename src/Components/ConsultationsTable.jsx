import React, { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { TiFlowChildren } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import ConsultsChildren from './ConsultsChildren';
const ConsultationsTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const {handleUnAuth, paginatedConsultChildren, setPaginatedConsultChildren,setIsEditConsult,setConsultBrief,setIsConsult,paginatedConsults,setConsultId, setPaginatedConsults,token, openNotificationWithIcon,setIsOpenPopup,setConsultName } = useContext(AppContext);
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-consult-types',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedConsults(res.data.data);
      setLoading(false);
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);
  const handleOpenPopup = (id) => {
    setIsConsult(true); 
    setIsOpenPopup(true); 
  };
  const handleEditConsult = (id,title,body) => {
    console.log(id,title,body);
    setConsultId(id)
    setIsEditConsult(true)
    setConsultBrief(body)
    setConsultName(title)
    setIsConsult(true); 
    setIsOpenPopup(true); 
  };
  const handleDeleteConsults = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-consult-type/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res)=>{
      openNotificationWithIcon('success',`${res.data.msg}`)
      setPaginatedConsults(paginatedConsults.filter((item) => item.id !== id))
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
      console.log(err)
    })
  }
  const handleHideConsult = (id) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-consult-type/${id}`,
      {},
      {headers:{Authorization:`Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data);
      setPaginatedConsults(prevConsult =>
        prevConsult.map(item =>
          item.id === id ? { ...item, hidden: !item.hidden } : item
        )
      );
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleShowChildren = (id) => {
    setConsultId(id)
    axios
    .get(`https://api.goldenbeit.com/dashboard/all-consultations/${id}`,
      {headers:{Authorization:`Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data);
      setPaginatedConsultChildren(res.data.data);
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const menuProps = (id, title, body) => ({
    items: [
      {
        label: paginatedConsults&& paginatedConsults.find((item) => item.id === id).hidden
          ? 'إظهار الاستشارة'
          : 'إخفاء الاستشارة',
          key: '1',
        icon: paginatedConsults&& paginatedConsults.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        // icon: <FaRegEyeSlash />,
        onClick: () => handleHideConsult(id),
      },
      
      {
        label: 'تعديل الاستشارة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleEditConsult(id,title,body),
      },
      {
        label: 'عرض الاستشارات',
        key: '3',
        icon: <TiFlowChildren />,
        onClick: () => handleShowChildren(id),
      },
      {
        label: 'حذف الاستشارة ',
        key: '4',
        icon: <BsTrash />,
        danger:true,
        onClick: () => handleDeleteConsults(id),
      },
    ],
  });
  // const childrenMenuProps = (id, title, body) => ({
  //   items: [
  //     {
  //       label: paginatedConsultChildren&& paginatedConsultChildren.find((item) => item.id === id).hidden
  //         ? 'إظهار الاستشارة'
  //         : 'إخفاء الاستشارة',
  //         key: '1',
  //       icon: paginatedConsultChildren&& paginatedConsultChildren.find((item) => item.id === id).hidden
  //         ? <FaRegEye />
  //         : <FaRegEyeSlash />,
  //       // icon: <FaRegEyeSlash />,
  //       onClick: () => handleHideConsult(id),
  //     },
      
  //     {
  //       label: 'تعديل الاستشارة',
  //       key: '2',
  //       icon: <FaPen />,
  //       onClick: () => handleEditConsult(id,title,body),
  //     },
  //     {
  //       label: 'عرض الاستشارات',
  //       key: '3',
  //       icon: <TiFlowChildren />,
  //       onClick: () => handleShowChildren(id),
  //     },
  //     {
  //       label: 'حذف الاستشارة ',
  //       key: '4',
  //       icon: <BsTrash />,
  //       danger:true,
  //       onClick: () => handleDeleteConsults(id),
  //     },
  //   ],
  // });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className='table_page'>
          <div className="container">
            <div className="table-header">
              <button className='table-btn' onClick={handleOpenPopup}>أضف استشارة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>نوع الاستشارة</th>
                    <th>بريف الاستشارة</th>
                    <th>تاريخ الانشاء</th>
                    <th>حالة الاستشارة</th>
                    <th>انشئ بواسطة</th>
                    <th>تم التحديث بواسطة</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConsults&& paginatedConsults.length > 0 ? (
                    paginatedConsults.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.brief}</td>
                        <td>{item.created_at}</td>
                        <td>
                          <span className={`state-span ${item.hidden?'still':'done'}`}>{item.hidden? 'مخفي': 'ظاهر'}</span>
                        </td>
                        <td>{item.created_by_obj.full_name}</td>
                        <td>{item.updated_by_obj&& item.updated_by_obj.full_name}</td>
                        <td>
                          <Dropdown menu={menuProps(item.id, item.name, item.brief)}>
                            <Button>
                              <Space>
                                خيارات
                                <DownOutlined />
                              </Space>
                            </Button>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ConsultsChildren />
          {/* <div className="container">
            <div className="table-header">
              <button className='table-btn' onClick={handleOpenPopup}>أضف استشارة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>عنوان الاستشارة</th>
                    <th>نص الاستشارة</th>
                    <th>تاريخ الانشاء</th>
                    <th>حالة الاستشارة</th>
                    <th>انشئ بواسطة</th>
                    <th>تم التحديث بواسطة</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConsultChildren&& paginatedConsultChildren.length > 0 ? (
                    paginatedConsultChildren.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.body}</td>
                        <td>{item.created_at}</td>
                        <td>
                          <span className={`state-span ${item.hidden?'still':'done'}`}>{item.hidden? 'مخفي': 'ظاهر'}</span>
                        </td>
                        <td>{item.created_by_obj.full_name}</td>
                        <td>{item.updated_by_obj&& item.updated_by_obj.full_name}</td>
                        <td>
                          <Dropdown menu={childrenMenuProps(item.id, item.name, item.brief)}>
                            <Button>
                              <Space>
                                خيارات
                                <DownOutlined />
                              </Space>
                            </Button>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}
        </main>
      )}
    </>
  );
};

export default ConsultationsTable;