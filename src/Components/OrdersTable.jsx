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
import { FaPen } from "react-icons/fa";
const OrdersTable = () => {
  const [paginatedOrders, setPaginatedOrders] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [unitStatuses, setUnitStatuses] = useState();
  const [unitRequests, setUnitRequests] = useState();
  const itemsPerPage = 20;
  const {token, openNotificationWithIcon,} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/paginated-requests',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(res.data.data.all);
      setUnitStatuses(res.data.data.statuses);
      setPagination(res.data.data.pagination);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://golden-gate-three.vercel.app/dashboard/paginated-units',
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
        setPaginatedOrders(res.data.data.all);
        setPagination(res.data.data.pagination)
      })
      .catch(err => {
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
  // const filteredData = paginatedOrders && paginatedOrders.filter(item =>
  //   item.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const menuProps = (id) => ({
    items: [
      {
        label: paginatedOrders&& paginatedOrders.find((item) => item.id === id).hidden
          ? 'إظهار الوحدة'
          : 'إخفاء الوحدة',
          key: '1',
        icon: paginatedOrders&& paginatedOrders.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        // icon: <FaRegEyeSlash />,
        onClick: () => handleHideUnit(id),
      },
      {
        label: 'طلبات الوحدة',
        key: '2',
        icon: <LuGitPullRequestArrow />,
        onClick: () => handleGetUnitReq(id),
      },
      // {
      //   label: ' تغيير حالة الوحدة',
      //   key: '3',
      //   icon: <FaPen />,
      //   onClick: () => handleChangeUnitStatus(id),
      // },
      {
        label: 'حذف الوحدة',
        key: '3',
        icon: <BsTrash />,
        onClick: () => handleDeleteUnit(id),
        danger: true,
      },
    ],
  });
  const handleDeleteUnit = (id) => {
    axios
    .delete(`https://golden-gate-three.vercel.app/core/delete-unit/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(paginatedOrders.filter((item) => item.id !== id));
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleHideUnit = (id) => {
    axios
    .get(`https://golden-gate-three.vercel.app/dashboard/toggle-unit-hide/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(prevUnit =>
        prevUnit.map(item =>
          item.id === id ? { ...item, hidden: !item.hidden } : item
        )
      );
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleGetUnitReq = (id) => {
    axios
    .get(`https://golden-gate-three.vercel.app/dashboard/unit-requests-user/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setUnitRequests(res.data.data);
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleChangeUnitStatus = (status_id,item_id) => {
    console.log(status_id,item_id);
    axios
    .get(`https://golden-gate-three.vercel.app/dashboard/update-unit-status/${item_id}/${status_id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(prevUnit =>
        prevUnit.map(item =>
          item.id === item_id ? { ...item, status_obj: res.data } : item
        )
      );
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    });
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
                    <th>المسلسل</th>
                    <th>عنوان الوحدة</th>
                    <th>سعر الاوفر</th>
                    <th>إجمالى السعر</th>
                    <th>تاريخ الطلب</th>
                    <th>عدد الوحدات المطلوبة</th>
                    <th>حالة الطلب</th>
                    <th>الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders&& paginatedOrders.length > 0 ? (
                    paginatedOrders.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.over_price_obj.currency} {item.over_price_obj.price_value}</td>
                        <td>{item.total_price_obj.currency} {item.total_price_obj.price_value}</td>
                        <td>{item.created_at}</td>
                        <td>{item.requests_count}</td>
                        {/* <td>{item.status_obj.name}</td> */}
                        <td>
                          <Select
                            defaultValue={item.status_obj.name}
                            style={{
                              width: 120,
                            }}
                            onChange={(e)=>handleChangeUnitStatus(e,item.id)}
                            options={unitStatuses}
                          />
                        </td>
                        <td>{item.hidden? 'مخفي': 'ظاهر'}</td>
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
                      <td colSpan="5">No data available</td>
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
          <div className="container">
            <div className="table-header">
              <h1>طلبات الوحدة</h1>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>البريد الإلكتروني</th>
                    <th>أرقام الهاتف</th>
                    <th>كود الدعوة</th>
                    <th>الصلاحية</th>
                    <th>توثيق الايميل</th>
                    <th>حالة الحساب</th>
                    <th>اّخر دخول</th>
                    <th>تاريخ الدخول</th>
                    {/* <th>خيارات</th> */}
                  </tr>
                </thead>
                <tbody>
                  {unitRequests&& unitRequests.length > 0 ? (
                    unitRequests.map((item, index) => (
                      <tr key={index}>
                        <td>{item.user_id}</td>
                        <td>{item.first_name} {item.last_name}</td>
                        <td>{item.username}</td>
                        <td>{item.email?item.email:'لا يوجد'}</td>
                        <td>{item.phone_numbers_list.length>0?
                          item.phone_numbers_list.map((phone)=>
                          <><span key={phone.phone_number_id}>
                              {phone.phone_number} {phone.phone_number_confirmed?'موثق':'غير موثق'}
                            </span> <br/>
                          </>):'لا يوجد'}
                        </td>
                        <td>{item.referral_code}</td>
                        <td>{item.role?item.role:'لا يوجد'}</td>
                        <td>{item.email_confirmed? 'موثق': 'غير موثق'}</td>
                        <td>{item.is_active? 'مفعل': 'غير مفعل'}</td>
                        <td>{item.last_login?item.last_login:'لا يوجد'}</td>
                        <td>{item.date_joined?item.date_joined:'لا يوجد'}</td>
                        {/* <td>
                          <Dropdown menu={menuProps(item.id)}>
                            <Button>
                              <Space>
                                خيارات
                                <DownOutlined />
                              </Space>
                            </Button>
                          </Dropdown>
                        </td> */}
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

export default OrdersTable;