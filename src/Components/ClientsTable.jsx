import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import axios from 'axios';
const ClientsTable = () => {
  // const { winnersData, loading } = useContext(AppContext);
  const [paginatedClients, setPaginatedClients] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const {token} = useContext(AppContext);
  
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/paginated-clients',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedClients(res.data.data.all);
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
    axios.post('https://golden-gate-three.vercel.app/dashboard/paginated-clients',
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
        setPaginatedClients(res.data.data.all);
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
  // const filteredData = paginatedUnits && paginatedUnits.filter(item =>
  //   item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const menuProps = (id) => ({
    items: [
      {
        label: paginatedClients&& paginatedClients.find((item) => item.id === id).is_active
          ? 'إلغاء تفعيل الحساب'
          : 'تفعيل الحساب',
        key: '1',
        icon: <UserOutlined />,
        onClick: () => handleChangeAccountStatus(id),
      },
      {
        label: 'حذف العميل',
        key: '2',
        icon: <BsTrash />,
        onClick: () => handleDeleteEmployee(id),
        danger: true,
      },
    ],
  });
  const handleDeleteEmployee = (id) => {
    axios
    .delete(`https://golden-gate-three.vercel.app/dashboard/delete-staff/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedClients(paginatedClients.filter((item) => item.id !== id));
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    })
  };
  const handleChangeAccountStatus = (id) => {
    axios
    .get(`https://golden-gate-three.vercel.app/dashboard/toggle-user-status/${id}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedClients(prevStaff =>
        prevStaff.map(item =>
          item.id === id ? { ...item, is_active: !item.is_active } : item
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
                  {paginatedClients&& paginatedClients.length > 0 ? (
                    paginatedClients.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
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

export default ClientsTable;