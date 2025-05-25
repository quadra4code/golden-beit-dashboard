import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Select } from 'antd';
import { BsTrash } from "react-icons/bs";
import { LuGitPullRequestArrow } from "react-icons/lu";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { PiStampFill } from "react-icons/pi";
import { TbRubberStampOff } from "react-icons/tb";
const ReviewsTable = () => {
  const [paginatedReviews, setPaginatedReviews] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [unitStatuses, setUnitStatuses] = useState();
  const [unitRequests, setUnitRequests] = useState();
  const itemsPerPage = 20;
  const {handleUnAuth, token, openNotificationWithIcon,} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-reviews',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedReviews(res.data.data.all);
      // setUnitStatuses(res.data.data.statuses);
      setPagination(res.data.data.pagination);
      setLoading(false);
    })
    .catch((err) => {
      // if(err.status===401){
      //   handleUnAuth()
      // }
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-reviews',
      {
        page_number:pageNumber
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then(res => {
        console.log(res.data);
        setPaginatedReviews(res.data.data.all);
        setPagination(res.data.data.pagination)
      })
      .catch(err => {
        if(err.status===401){
          handleUnAuth()
        }  
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      }
      );
    setCurrentPage(pageNumber)
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };
  const menuProps = (id) => ({
    items: [
      {
        label: paginatedReviews&& paginatedReviews.find((item) => item.id === id).is_hidden
          ? 'إظهار التقييم'
          : 'إخفاء التقييم',
          key: '1',
        icon: paginatedReviews&& paginatedReviews.find((item) => item.id === id).is_hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        // icon: <FaRegEyeSlash />,
        onClick: () => handleHideReview(id),
      },
      {
        label: 'حذف التقييم',
        key: '2',
        icon: <BsTrash />,
        danger: true,
        onClick: () => handleDeleteReview(id),
      },
    ],
  });
  const handleHideReview = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/toggle-hidden-review/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res);
      setPaginatedReviews(prevUnit =>
        prevUnit.map(item =>
          item.id === id ? { ...item, is_hidden: !item.is_hidden } : item
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
  const handleDeleteReview = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-review/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res);
      setPaginatedReviews(paginatedReviews.filter((item) => item.id !== id));
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
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className='table_page'>
          <div className="container">
            <div className="table-header">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="ابحث باسمك ..."
              />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>صورة العميل</th>
                    <th>رسالة التقييم</th>
                    <th> التقييم </th>
                    <th>الأسم</th>
                    <th>رقم الهاتف</th>
                    <th>الحالة</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews&& paginatedReviews.length > 0 ? (
                    paginatedReviews.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.client_obj.image === null ? (
                            "لا يوجد صورة"
                            ):
                            (
                              <img src={item.client_obj.image}
                                alt="image of client"
                                style={{maxHeight:'50px',maxWidth:'200px',
                                  borderRadius:'10px'}}/>
                            )}
                        </td>
                        <td>{item.review}</td>
                        <td>{item.rate}</td>
                        <td>{item.client_obj.first_name} {item.client_obj.last_name} </td>
                        <td>{item.client_obj.phone_number}</td>
                        <td>{item.is_hidden === false ? 'ظاهر' : 'مخفي' }</td>
                        <td>
                          <Dropdown menu={menuProps(item.id)}>
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
                      <td colSpan="5">لا يوجد بيانات متاحة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={pagination&& pagination.total_pages}
              paginate={handlePaginate}
              currentPage={currentPage}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default ReviewsTable;