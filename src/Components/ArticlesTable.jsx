import React, { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { IoMdDoneAll } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const ArticlesTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  // const { winnersData, loading } = useContext(AppContext);
  const [loading, setLoading] = useState();
  const {handleUnAuth, setIsEditArticle,setArtId,setArtBody,setArtTitle,paginatedArticles,setPaginatedArticles,token, openNotificationWithIcon,setIsOpenPopup, setIsAddArticle} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-articles',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedArticles(res.data.data);
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
  const handleOpenPopup = (/*id*/) => {
    setIsAddArticle(true); 
    setIsOpenPopup(true); 
  };
  const handleEditArticle = (id,title,body) => {
    console.log(id,title,body);
    
    setArtId(id)
    setArtBody(body)
    setArtTitle(title)
    setIsEditArticle(true); 
    setIsOpenPopup(true); 
  };
  const handleDeleteArticle = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-article/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res)=>{
      openNotificationWithIcon('success',`${res.data.msg}`)
      setPaginatedArticles(paginatedArticles.filter((item) => item.id !== id))
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
      console.log(err)
    })
  }
  const handleHideArticle = (id) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-article/${id}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` }}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedArticles(prevArticle =>
        prevArticle.map(item =>
          item.id === id ? { ...item, hidden: !item.hidden } : item
        )
      );
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const menuProps = (id, title, body) => ({
    items: [
      {
        label: paginatedArticles&& paginatedArticles.find((item) => item.id === id).hidden
          ? 'إظهار المقالة'
          : 'إخفاء المقالة',
          key: '1',
        icon: paginatedArticles&& paginatedArticles.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        // icon: <FaRegEyeSlash />,
        onClick: () => handleHideArticle(id),
      },
      
      {
        label: 'تعديل المقالة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleEditArticle(id,title,body),
      },
      {
        label: 'حذف المقالة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => handleDeleteArticle(id),
      },
    ],
  });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className='table_page'>
          <div className="container">
            <div className="table-header">
              <button className='table-btn' onClick={handleOpenPopup}>أضف مقالة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>صورة المقالة</th>
                    <th>عنوان المقالة</th>
                    <th>أساسية</th>
                    <th>تاريخ الانشاء</th>
                    <th>حالة المقالة</th>
                    <th>نص المقالة</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles&& paginatedArticles.length > 0 ? (
                    paginatedArticles.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                          {item.image === null ? (
                            "لا يوجد صورة"
                            ):
                            (
                              <img src={item.image}
                                alt="article-image"
                                style={{maxHeight:'50px',maxWidth:'200px',
                                  borderRadius:'10px'}}/>
                            )}
                        </td>
                        <td>{item.title}</td>
                        <td>
                          <span className={`state-span ${item.is_main?'still':'done'}`}>{item.is_main? 'غير أساسية': 'أساسية'}</span>
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          <span className={`state-span ${item.hidden?'still':'done'}`}>{item.hidden? 'مخفي': 'ظاهر'}</span>
                        </td>
                        <td>{item.body}</td>
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
        </main>
      )}
    </>
  );
};

export default ArticlesTable;