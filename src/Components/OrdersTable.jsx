import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Select } from 'antd';
import { BsTrash } from "react-icons/bs";
import { LuGitPullRequestArrow } from "react-icons/lu";
const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [unitStatuses, setUnitStatuses] = useState();
  const [salesStaff, setSalesStaff] = useState();
  const [statusFilter, setStatusFilter] = useState();
  const [unitRequests, setUnitRequests] = useState();
  const itemsPerPage = 20;
  // Get all modal/order state from context
  const {
    setIsModalOpen,
    refuseMsg,
    handleUnAuth,
    setModalType,
    token,
    openNotificationWithIcon,
    selectedStatuses,
    setSelectedStatuses,
    pendingStatusChange,
    setPendingStatusChange,
    paginatedOrders,
    setPaginatedOrders,
    updateOrderStatus,
    handleModalOk,
    handleModalCancel
  } = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
      .post('https://api.goldenbeit.com/dashboard/paginated-requests',
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
        setUnitStatuses(res.data.data.request_statuses);
        setSalesStaff(res.data.data.sales_staff);
        setPagination(res.data.data.pagination);
        setLoading(false);
      })
      .catch((err) => {
        if (err.status === 401) {
          handleUnAuth();
        }
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const handleFilterBy = (e) => {
    console.log(e);
    setStatusFilter(e);
    setPaginatedOrders([]);
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-requests',
      {
        status_id: e,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).then((res) => {
      console.log(res.data);
      setPaginatedOrders(res.data.data.all);
      setUnitStatuses(res.data.data.request_statuses);
      setPagination(res.data.data.pagination);
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
  }
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-units',
      {
        page_number:pageNumber,
        status_id: statusFilter,
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
        label: 'حذف الطلب',
        key: '1',
        icon: <BsTrash />,
        onClick: () => handleDeleteUnit(id),
        danger: true,
      },
    ],
  });
  const handleDeleteUnit = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/core/cancel-request/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(paginatedOrders.filter((item) => item.id !== id));
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
  const handleHideUnit = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/toggle-unit-hide/${id}`,
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
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleGetUnitReq = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/unit-requests-user/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setUnitRequests(res.data.data);
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleChangeSalesStaff = (sales_id, order_id) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/assign-sales-request', 
      {
        sales_id: sales_id,
        request_id: order_id,
      }, 
      { headers: { 'Authorization': `Bearer ${token}` } })
    .then((res) => {
      console.log(res.data);
      setPaginatedOrders(prevUnit =>
        prevUnit.map(item =>
          item.id === order_id ? { ...item, sales_obj: res.data } : item
        )
      );
      openNotificationWithIcon('success', `${res.data.msg}`);
    })
    .catch((err) => {
      console.log(err);
      if (err.status === 401) handleUnAuth();
      openNotificationWithIcon('error', `${err.response.data.msg}`);
    });
  };
  const handleChangeOrderStatus = (status_id, item_id) => {
    if (status_id == 2) {
      setModalType('orders');
      setPendingStatusChange({ orderId: item_id, statusId: status_id });
      setIsModalOpen(true);
      // Don't update status yet
      return;
    }
    // Update status immediately
    updateOrderStatus(status_id, item_id);
  };
  // const updateOrderStatus = (status_id, item_id) => {
  //   axios.patch('https://api.goldenbeit.com/dashboard/change-request-status', {
  //     request_id: item_id,
  //     status_id,
  //     status_msg: refuseMsg
  //   }, { headers: { 'Authorization': `Bearer ${token}` } })
  //     .then((res) => {
  //       setPaginatedOrders(prevUnit =>
  //         prevUnit.map(item =>
  //           item.id === item_id ? { ...item, status_obj: res.data } : item
  //         )
  //       );
  //       setSelectedStatuses(prev => ({ ...prev, [item_id]: status_id }));
  //       openNotificationWithIcon('success', `${res.data.msg}`);
  //     })
  //     .catch((err) => {
  //       if (err.status === 401) handleUnAuth();
  //       openNotificationWithIcon('error', `${err.response.data.msg}`);
  //     });
  // };
  // handleModalOk and handleModalCancel are now provided by context
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
                placeholder="ابحث  ..."
              />
              {/* <Select
                defaultValue="الكل"
                style={{
                  width: 120,
                }}
                onChange={(e)=>handleFilterBy(e)}
                options={unitStatuses}
              /> */}
              <Select
                defaultValue='الكل'
                onChange={(e)=>handleFilterBy(e)}
                style={{
                  width: 120,
                }}
                options={unitStatuses&& unitStatuses.map(s => ({
                  label: s.label,
                  value: s.code
                }))}
              />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>عنوان الوحدة</th>
                    <th>سعر الاوفر</th>
                    {/* <th>إجمالى السعر</th> */}
                    <th>تاريخ الطلب</th>
                    <th>حالة الطلب</th>
                    <th> سبب الرفض</th>
                    <th>مسؤل المبيعات</th>
                    <th>الاسم</th>
                    {/* <th>اسم المستخدم</th>
                    <th>البريد الالكتروني</th>
                    <th>توثيق البريد الالكتروني</th>
                    <th>حالة الحساب</th> */}
                    {/* <th>اخر دخول</th> */}
                    <th>أرقام الهاتف</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders&& paginatedOrders.length > 0 ? (
                    paginatedOrders.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.over_price_obj.price_value} {item.over_price_obj.currency} </td>
                        {/* <td>{item.total_price_obj.currency} {item.total_price_obj.price_value}</td> */}
                        <td>{item.created_at}</td>
                        {/* <td>{item.status_obj.name}</td> */}
                        <td>
                          <Select
                            value={selectedStatuses[item.id] ?? item.status_obj.code}
                            style={{ width: 120 }}
                            onChange={(e) => handleChangeOrderStatus(e, item.id)}
                            options={unitStatuses&& unitStatuses.map(s => ({
                              label: s.label,
                              value: s.code
                            }))}
                          />
                        </td>
                        <td>{item.status_msg || '---'} </td>
                        <td>
                          <Select
                            defaultValue={item.sales_obj?.name ||  'غير محدد'}
                            style={{ width: 120 }}
                            onChange={(e) => handleChangeSalesStaff(e, item.id)}
                            options={salesStaff&& salesStaff.map(s => ({
                              label: s.first_name + ' ' + s.last_name,
                              value: s.id
                            }))}
                          />
                        </td>
                        <td>{item.first_name} {item.last_name}</td>
                        {/* <td>{item.username}</td>
                        <td>{item.email?item.email:'لا يوجد'}</td> */}
                        {/* <td>{item.last_login?item.last_login:'لا يوجد'}</td> */}
                        <td>{item.phone_numbers_list.length>0?
                          item.phone_numbers_list.map((phone)=>
                          <><span key={phone.phone_number_id}>
                              {phone.phone_number}
                            </span> <br/>
                          </>):'لا يوجد'}
                        </td>
                        {/* <td>{item.email_confirmed? 'موثق': 'غير موثق'}</td>
                        <td>{item.is_active? 'مفعل': 'غير مفعل'}</td> */}
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
        </main>
      )}
    </>
  );
};

export default OrdersTable;