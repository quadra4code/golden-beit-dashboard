import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye, FaRegSquareCheck } from "react-icons/fa6";
import { TbSquareX } from "react-icons/tb";
import { RiImageEditFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { useRef } from 'react';

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
      // console.log(res.data);
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
    // console.log(id,title,body);
    
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
      // console.log(res.data);
      setPaginatedArticles(prevArticle =>
        prevArticle.map(item =>
          item.id === id ? { ...item, hidden: !item.hidden,
            updated_at: res.data.data.updated_at,
            updated_by_name: res.data.data.updated_by_name,
          } : item
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
  const toggleArticleMain = (id) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-main-article/${id}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` }}
    )
    .then((res) => {
      // console.log(res.data);
      let articleToChange = paginatedArticles&& paginatedArticles.find((a) => a.id === id)
      setPaginatedArticles(prevArticle =>
        prevArticle.map(item =>
          item.is_main === true && item.id !== id && !articleToChange.is_main ? { ...item, is_main: !item.is_main,
            updated_at: res.data.data.updated_at,
            updated_by_name: res.data.data.updated_by_name,
          } : item
        )
      );
      setPaginatedArticles(prevArticle =>
        prevArticle.map(item =>
          item.id === id ? { ...item, is_main: !item.is_main } : item
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

  // File input ref for triggering file dialog

  const fileInputRef = useRef(null);

  // Handler for file input change
  const handleImageChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
    // You can now upload the file using FormData and axios
    const formData = new FormData();
    formData.append('image', file);
    axios
      .put(`https://api.goldenbeit.com/dashboard/update-article/${id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      )
      .then((res) => {
        setPaginatedArticles(prevArticle =>
          prevArticle.map(item =>
            item.id === id ? { ...item, image_url: res.data.data.image_url,
              updated_at: res.data.data.updated_at,
              updated_by_name: res.data.data.updated_by_name,
            } : item
          )
        );
        openNotificationWithIcon('success', `${res.data.msg}`);
      })
      .catch((err) => {
        if (err.status === 401) {
          handleUnAuth();
        }
        openNotificationWithIcon('error', `${err.response?.data?.msg || 'حدث خطأ'}`);
      });
  };

  const menuProps = (id, title, body) => ({
    items: [
      {
        label: paginatedArticles && paginatedArticles.find((item) => item.id === id).hidden
          ? 'إظهار المقالة'
          : 'إخفاء المقالة',
        key: '1',
        icon: paginatedArticles && paginatedArticles.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => handleHideArticle(id),
      },
      {
        label: paginatedArticles && paginatedArticles.find((item) => item.id === id).is_main
          ? 'غير أساسى'
          : 'أساسى',
        key: '2',
        icon: paginatedArticles && paginatedArticles.find((item) => item.id === id).is_main
          ? <TbSquareX />
          : <FaRegSquareCheck />,
        onClick: () => toggleArticleMain(id),
      },
      {
        label: (
          <span
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            تغيير صورة المقالة
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={event => handleImageChange(id, event)}
            />
          </span>
        ),
        key: '3',
        icon: <RiImageEditFill />,
      },
      {
        label: 'تعديل المقالة',
        key: '4',
        icon: <FaPen />,
        onClick: () => handleEditArticle(id, title, body),
      },
      {
        label: 'حذف المقالة ',
        key: '5',
        icon: <BsTrash />,
        danger: true,
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
                    <th>اسم المنشئ</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
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
                          {item.image_url === null ? (
                            "لا يوجد صورة"
                            ):
                            (
                              <img src={item.image_url}
                                alt="article-image"
                                style={{maxHeight:'50px',maxWidth:'200px',
                                  borderRadius:'10px'}}/>
                            )}
                        </td>
                        <td>{item.title}</td>
                        <td>
                          <span className={`state-span ${item.is_main?'done':'still'}`}>{item.is_main? 'أساسية': 'غير أساسية'}</span>
                        </td>
                        <td>{item.created_at}</td>
                        <td>{item.created_by_name}</td>
                        <td>{item.updated_at}</td>
                        <td>{item.updated_by_name}</td>
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
                      <td colSpan="5">لا يوجد مقالات</td>
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