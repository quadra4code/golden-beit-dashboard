import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
const StaffTable = () => {
  // const { winnersData, loading } = useContext(AppContext);
  const [paginatedStaff, setPaginatedStaff] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const {token} = useContext(AppContext);
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
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className='table_page'>
          <div className="container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="ابحث باسمك ..."
            />
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الصلاحية</th>
                    <th>توثيق الايميل</th>
                    <th>حالة الحساب</th>
                    <th>اّخر دخول</th>
                    <th>تاريخ الدخول</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.first_name} {item.last_name}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>{item.email_confirmed? 'موثق': 'غير موثق'}</td>
                        <td>{item.is_active? 'مفعل': 'غير مفعل'}</td>
                        <td>{item.last_login}</td>
                        <td>{item.date_joined}</td>
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
              itemsPerPage={itemsPerPage}
              totalItems={filteredData ? filteredData.length : 0}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default StaffTable;