import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import { GoPlus } from "react-icons/go";
import axios from 'axios';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
const StaffTable = () => {
  // const [paginatedStaff, setPaginatedStaff] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { paginatedStaff, setPaginatedStaff, token, setIsAddNewEmployee, setIsOpenPopup, setRoles} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/paginated-staff',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedStaff(res.data.data.all);
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
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://golden-gate-three.vercel.app/dashboard/staff-roles',
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      setRoles(res.data.data);
      console.log(res.data);
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
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
        setPaginatedStaff(res.data.data.all);
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
  const handleOpenPopup = () => {
    setIsAddNewEmployee(true); 
    setIsOpenPopup(true); 
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };
  const filteredData = paginatedStaff && paginatedStaff.filter(item =>
    item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // const handleMenuClick = (e) => {
  //   message.info('Click on menu item.');
  //   console.log('click', e);
  // };
  const menuProps = (id) => ({
    items: [
      {
        label: 'صلاحية الموظف',
        key: '1',
        icon: <UserOutlined />,
      },
      {
        label: 'إلغاء / تفعيل الحساب',
        key: '2',
        icon: <UserOutlined />,
      },
      {
        label: 'حذف الموظف',
        key: '4',
        icon: <UserOutlined />,
        onClick: () => handleDeleteEmployee(id),
        danger: true,
      },
    ],
  });
  const handleDeleteEmployee = (id) => {
    setLoading(true);
    axios
    .delete(`https://golden-gate-three.vercel.app/dashboard/delete-staff/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedStaff(paginatedStaff.filter((item) => item.id !== id));
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
    .finally(() => {  
      setLoading(false);
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
              <button className='table-btn' onClick={() => handleOpenPopup(true)}>
                <GoPlus/>
                إضافة موظف جديد
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>أرقام الهاتف</th>
                    <th>البريد الإلكتروني</th>
                    <th>الصلاحية</th>
                    <th>توثيق الايميل</th>
                    <th>حالة الحساب</th>
                    <th>اّخر دخول</th>
                    <th>تاريخ الدخول</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.first_name} {item.last_name}</td>
                        <td>{item.username}</td>
                        <td>{item.phone_numbers_list.length>0?
                          item.phone_numbers_list.map((phone)=>
                            <><span key={phone.phone_number_id}>
                              {phone.phone_number} {phone.phone_number_confirmed?'موثق':'غير موثق'}
                            </span> <br/>
                          </>):'لا يوجد'}
                        </td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>{item.email_confirmed? 'موثق': 'غير موثق'}</td>
                        <td>{item.is_active? 'مفعل': 'غير مفعل'}</td>
                        <td>{item.last_login}</td>
                        <td>{item.date_joined}</td>
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

export default StaffTable;