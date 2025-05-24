import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { IoMdDoneAll } from "react-icons/io";
import { BsTrash } from "react-icons/bs";

const EmailsTable = () => {
  const [paginatedEmails, setPaginatedEmails] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const itemsPerPage = 20;
  const {handleUnAuth, token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://api.goldenbeit.com/dashboard/paginated-contact-us',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setPaginatedEmails(res.data.data.all);
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
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-contact-us',
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
  const handleChangeStatus = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/solve-contact-us/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res)=>{
      console.log(res);
      setPaginatedEmails(prevEmail =>
        prevEmail.map(item=> 
          item.id === id ? {...item, status:{...item.status, name:'تم الحل'} }:item
        )
      )
      setIsDone(true)
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
      console.log(err)
    })
  }
  const handleDeleteMsg = (id) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-contact-us/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res)=>{
      setPaginatedEmails(paginatedEmails.filter((item) => item.id !== id))
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err)=>{
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',`${err.response.data.msg}`)
      console.log(err)
    })
  }
  const menuProps = (id) => ({
    items: [
      {
        label: 'حل الرسالة',
        key: '1',
        icon: <IoMdDoneAll />,
        onClick: () => handleChangeStatus(id),
      },
      {
        label: 'حذف الرسالة',
        key: '2',
        icon: <BsTrash />,
        danger:true,
        onClick: () => handleDeleteMsg(id),
      },
    ],
  });
  // const filteredData = paginatedUnits && paginatedUnits.filter(item =>
  //   item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
                    <th>رقم الهاتف</th>
                    <th>البريد الإلكتروني</th>
                    <th>تاريخ الانشاء</th>
                    <th>تاريخ التحديث</th>
                    <th> محتوى الرسالة</th>
                    <th>حالة الرسالة</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmails&& paginatedEmails.length > 0 ? (
                    paginatedEmails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.phone_number}</td>
                        <td>{item.email?item.email:'لا يوجد' }</td>
                        <td>{item.created_at}</td>
                        <td>{item.updated_at}</td>
                        <td>{item.message}</td>
                        <td>
                          <span className={`state-span ${item.status.name==='تم الحل'?'done':'still'}`}>{item.status.name}</span>
                        </td>
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

export default EmailsTable;