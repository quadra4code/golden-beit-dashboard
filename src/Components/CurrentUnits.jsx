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
const CurrentUnits = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [paginatedUnits, setPaginatedUnits] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [unitStatuses, setUnitStatuses] = useState();
  const [statusFilter, setStatusFilter] = useState();
  const [unitRequests, setUnitRequests] = useState();
  const itemsPerPage = 20;
  const {handleUnAuth, token, openNotificationWithIcon,} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-units',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedUnits(res.data.data.all);
      setUnitStatuses(res.data.data.statuses);
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
  }, []);
  const handleFilterBy = (e) => {
    console.log(e);
    setStatusFilter(e);
    setPaginatedUnits([]);
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-units',
      {
        status_id: e,
        search_keyword: searchTerm
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).then((res) => {
      console.log(res.data);
      setPaginatedUnits(res.data.data.all);
      setUnitStatuses(res.data.data.statuses);
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
  console.log(unitStatuses);
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-units',
      {
        page_number:pageNumber,
        status_id: statusFilter,
        search_keyword: searchTerm
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then(res => {
        console.log(res.data);
        setPaginatedUnits(res.data.data.all);
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
    console.log(event.target.value);
    console.log(searchTerm);
    // setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-units',
      {
        status_id: statusFilter,
        search_keyword: event.target.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then(res => {
        // console.log(res.data);
        setPaginatedUnits(res.data.data.all);
        setPagination(res.data.data.pagination)
        setCurrentPage(res.data.data.pagination.current_page)
      })
      .catch(err => {
        if(err.status===401){
          handleUnAuth()
        }  
        console.log(err);
        // setCurrentPage(1);
      })
      .finally(() => {
        // setLoading(false)
      }
      );
  };
  // const filteredData = paginatedUnits && paginatedUnits.filter(item =>
  //   item.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const menuProps = (id) => ({
    items: [
      // {
      //   label: paginatedUnits&& paginatedUnits.find((item) => item.id === id).hidden
      //     ? 'إظهار الوحدة'
      //     : 'إخفاء الوحدة',
      //     key: '1',
      //   icon: paginatedUnits&& paginatedUnits.find((item) => item.id === id).hidden
      //     ? <FaRegEye />
      //     : <FaRegEyeSlash />,
      //   // icon: <FaRegEyeSlash />,
      //   onClick: () => handleHideUnit(id),
      // },
      {
        label: 'طلبات الوحدة',
        key: '1',
        icon: <LuGitPullRequestArrow />,
        onClick: () => handleGetUnitReq(id),
      },
      {
        label: paginatedUnits&& paginatedUnits.find((item) => item.id === id).featured
          ? 'إلغاء تمييز الوحدة'
          : 'تمييز الوحدة',
          key: '2',
        icon: paginatedUnits&& paginatedUnits.find((item) => item.id === id).featured
          ? <FaStar />
          : <FaRegStar />,
        onClick: () => handleFeaturedUnit(id),
      },
      // {
      //   label: ' تغيير حالة الوحدة',
      //   key: '4',
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
    .delete(`https://api.goldenbeit.com/core/delete-unit/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedUnits(paginatedUnits.filter((item) => item.id !== id));
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
      setPaginatedUnits(prevUnit =>
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
  const handleFeaturedUnit = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/toggle-unit-featured/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` }}
    )
    .then((res) => {
      console.log(res.data);
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
  const handleChangeUnitStatus = (status_id,item_id) => {
    console.log(status_id,item_id);
    axios
    .get(`https://api.goldenbeit.com/dashboard/update-unit-status/${item_id}/${status_id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedUnits(prevUnit =>
        prevUnit.map(item =>
          item.id === item_id ? { ...item, status_obj: res.data } : item
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
                placeholder="ابحث ..."
              />
              <Select
                defaultValue="الكل"
                style={{
                  width: 120,
                }}
                onChange={(e)=>handleFilterBy(e)}
                options={unitStatuses}
              />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>عنوان الوحدة</th>
                    {/* <th>الاجمالى</th> */}
                    <th>النوع</th>
                    <th>الطرح</th>
                    <th>المشروع</th>
                    <th>المدينة</th>
                    <th>الاوفر</th>
                    <th>رقم الوحدة</th>
                    <th>رقم العمارة</th>
                    <th>الدور</th>
                    <th>عدد الطلبات</th>
                    <th>حالة الوحدة</th>
                    <th>اسم العميل</th>
                    <th>رقم الهاتف</th>
                    <th>اخر تحديث</th>
                    {/* <th>الظهور</th> */}
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUnits&& paginatedUnits.length > 0 ? (
                    paginatedUnits.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <a target="_blank" href={`https://goldenbeit.com/all-units/${item.id}`} className="order-link">#{item.id}</a>
                          {/* {item.id} */}
                        </td>
                        <td>{item.title}</td>
                        {/* <td>{item.total_price_obj.price_value}</td> */}
                        <td>{item.unit_type}</td>
                        <td>{item.proposal_str ? item.proposal_str : "-----"}</td>
                        <td>{item.project}</td>
                        <td>{item.city}</td>
                        <td>{item.over_price_obj.price_value}</td>
                        <td>{item.unit_number}</td>
                        <td>{item.building_number ? item.building_number : "----"}</td>
                        <td>{item.floor ? item.floor : "----"}</td>
                        <td>{item.requests_count}</td>
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
                        <td>{item.created_by_obj.full_name}</td>
                        <td>{item.created_by_obj.phone_number}</td>
                        <td>{item.updated_at}</td>
                        {/* <td>{item.hidden? 'مخفي': 'ظاهر'}</td> */}
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
          {/* <div className="container">
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
                    <th>خيارات</th> 
                  </tr>
                </thead>
                <tbody>
                  {unitRequests&& unitRequests.length > 0 ? (
                    unitRequests.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.user_id}
                        </td>
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
          </div> */}
        </main>
      )}
    </>
  );
};

export default CurrentUnits;