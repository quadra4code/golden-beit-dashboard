import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import { GoPlus } from "react-icons/go";
import axios from 'axios';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Select } from 'antd';
import { BsTrash } from "react-icons/bs";
const StaffTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  // const [paginatedStaff, setPaginatedStaff] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [options, setOptions] = useState();
  const itemsPerPage = 20;
  const { handleUnAuth,  paginatedStaff, setPaginatedStaff, token, setIsAddNewEmployee, setIsOpenPopup, setRoles, roles,openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-staff',
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
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/staff-roles',
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      const formattedOptions = res.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setOptions(formattedOptions);
      setRoles(formattedOptions);
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
    axios.post('https://api.goldenbeit.com/dashboard/paginated-staff',
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
  const handleOpenPopup = () => {
    setIsAddNewEmployee(true); 
    setIsOpenPopup(true); 
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };
  // const filteredData = paginatedStaff && paginatedStaff.filter(item =>
  //   item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // const handleMenuClick = (e) => {
  //   message.info('Click on menu item.');
  //   console.log('click', e);
  // };
  const menuProps = (id) => ({
    items: [
      // {
      //   label: 'صلاحية الموظف',
      //   key: '1',
      //   icon: <UserOutlined />,
      // },
      {
        label: paginatedStaff&& paginatedStaff.find((item) => item.id === id).is_active
          ? 'إلغاء تفعيل الحساب'
          : 'تفعيل الحساب',
        key: '1',
        icon: <UserOutlined />,
        onClick: () => handleChangeAccountStatus(id),
      },
      {
        label: 'حذف الموظف',
        key: '2',
        icon: <BsTrash />,
        onClick: () => handleDeleteEmployee(id),
        danger: true,
      },
    ],
  });
  const handleDeleteEmployee = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-staff/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedStaff(paginatedStaff.filter((item) => item.id !== id));
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
  const handleChangeAccountStatus = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/toggle-user-status/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedStaff(prevStaff =>
        prevStaff.map(item =>
          item.id === id ? { ...item, is_active: !item.is_active } : item
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
  console.log(paginatedStaff)
  const handleChangeUnitStatus = (perm_id,staff_id) => {
    const selectedOption = options.find(opt=>opt.value === perm_id).label
    console.log(selectedOption,staff_id);
    axios
    .patch('https://api.goldenbeit.com/dashboard/change-staff-permissions',
      {
        staff_id,
        perms_list:[selectedOption]
      },
      {headers:{Authorization:`Bearer ${token}`}}
    )
    .then((res)=>{
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  }
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
              <button className='table-btn' onClick={handleOpenPopup}>
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
                    <th>تاريخ التسجيل</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStaff&& paginatedStaff.length > 0 ? (
                    paginatedStaff.map((item, index) => (
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
                        <td>{item.email ? item.email : "-----"}</td>
                        <td>
                          <Select
                            defaultValue={item.role}
                            style={{
                              width: 120,
                            }}
                            // onChange={handleChangeUnitStatus}
                            onChange={(value)=>handleChangeUnitStatus(value,item.id)}
                            options={options}
                          />
                        </td>
                        {/* <td>{item.role}</td> */}
                        <td>{item.email_confirmed? 'موثق': 'غير موثق'}</td>
                        <td>{item.is_active? 'مفعل': 'غير مفعل'}</td>
                        <td>{item.last_login ? item.last_login : "-----"}</td>
                        <td>{item.date_joined ? item.date_joined : "-----"}</td>
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