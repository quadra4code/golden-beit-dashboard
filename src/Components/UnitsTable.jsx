import React, { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
const StaffTable = () => {
  // const { winnersData, loading } = useContext(AppContext);
  const [paginatedUnits, setPaginatedUnits] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState();
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const {token} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .post('https://golden-gate-three.vercel.app/dashboard/paginated-unit-requests',
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
  const filteredData = paginatedUnits && paginatedUnits.filter(item =>
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
                    <th>عنوان الوحدة</th>
                    <th>سعر الوحدة</th>
                    <th>تاريخ الطلب</th>
                    <th>عدد الوحدات المطلوبة</th>
                    <th>حالة الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.unit_title}</td>
                        <td>{item.price_obj.price_type} <br /> {item.price_obj.price}</td>
                        <td>{item.created_at}</td>
                        <td>{item.requests_count}</td>
                        <td>{item.unit_status}</td>
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