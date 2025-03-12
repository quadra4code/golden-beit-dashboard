import React,{useContext} from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { TiFlowChildren } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const ConsultsChildren = () => {
  const {
    paginatedConsultChildren, 
    setIsConsultChildren,
    setPaginatedConsultChildren,
    handleEditConsultChildren,
    setIsEditConsultChildren,setConsultBody,
    setIsConsult,paginatedConsults,
    setConsultChildId, setPaginatedConsults,
    token, openNotificationWithIcon,
    setIsOpenPopup,setConsultTitle 
  } = useContext(AppContext);
  const handleOpenPopup = () => {
    setIsConsultChildren(true); 
    setIsOpenPopup(true); 
  };
  const handleEditConsult = (id,title,body) => {
    console.log(`id:${id},title:${title},body:${body}`);
    setConsultChildId(id)
    setIsEditConsultChildren(true)
    setConsultBody(body)
    setConsultTitle(title)
    setIsConsultChildren(true); 
    setIsOpenPopup(true); 
  };
  const menuProps = (id, title, body) => ({
    items: [
      {
        label: paginatedConsultChildren&& paginatedConsultChildren.find((item) => item.id === id).hidden
          ? 'إظهار الاستشارة'
          : 'إخفاء الاستشارة',
          key: '1',
        icon: paginatedConsultChildren&& paginatedConsultChildren.find((item) => item.id === id).hidden
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
        label: 'حذف الاستشارة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => handleDeleteConsult(id),
      },
    ],
  });
  const handleHideConsult = (id) => {
    axios
    .patch(`https://golden-gate-three.vercel.app/dashboard/toggle-hidden-consultation/${id}`,
      {},
      {headers:{Authorization:`Bearer ${token}`}}
    )
    .then((res)=>{
      console.log(res.data);
      setPaginatedConsultChildren(prevConsult =>
        prevConsult.map(item =>
          item.id === id ? { ...item, hidden: !item.hidden } : item
        )
      );
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleDeleteConsult = (id) => {
    axios
    .delete(`https://golden-gate-three.vercel.app/dashboard/delete-consultation/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res)=>{
      openNotificationWithIcon('success',`${res.data.msg}`)
      setPaginatedConsultChildren(paginatedConsultChildren.filter((item) => item.id !== id))
    })
    .catch((err)=>{
      openNotificationWithIcon('error',`${err.response.data.msg}`)
      console.log(err)
    })
  }
  return (
    <div className="container">
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
                    <Dropdown menu={menuProps(item.id, item.title, item.body)}>
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
  )
}

export default ConsultsChildren