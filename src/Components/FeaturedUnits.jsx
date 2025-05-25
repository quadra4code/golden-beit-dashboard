import  { useState, useContext, useEffect } from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Select } from 'antd';
import { MdCancel } from "react-icons/md";
const FeaturedUnits = () => {
  const [paginatedUnits, setPaginatedUnits] = useState();
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
    .post('https://api.goldenbeit.com/dashboard/paginated-featured-units',
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
      // setUnitStatuses(res.data.data.statuses);
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
  console.log(unitStatuses);
  const handlePaginate = (pageNumber) => {
    setLoading(true);
    axios.post('https://api.goldenbeit.com/dashboard/paginated-featured-units',
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
    setCurrentPage(1); 
  };
  const menuProps = (id) => ({
    items: [
      {
        label: 'إلغاء التمميز',
        key: '1',
        icon: <MdCancel />,
        onClick: () => handleUnFeatured(id),
      },
    ],
  });
  const handleUnFeatured = (id) => {
    axios
    .get(`https://api.goldenbeit.com/dashboard/toggle-unit-featured/${id}`,
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
                    <th>النوع</th>
                    <th>رقم الوحدة</th>
                    <th>رقم العمارة</th>
                    <th>الاوفر</th>
                    <th>الاجمالى</th>
                    <th>عدد الطلبات</th>
                    <th>اخر تحديث</th>
                    <th>حالة الوحدة</th>
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
                        <td>{item.unit_type}</td>
                        <td>{item.unit_number}</td>
                        <td>{item.building_number}</td>
                        <td>{item.over_price_obj.price_value}</td>
                        <td>{item.total_price_obj.price_value}</td>
                        <td>{item.requests_count}</td>
                        <td>{item.created_at}</td>
                        {/* <td>
                          <Select
                            defaultValue={item.status_obj.name}
                            style={{
                              width: 120,
                            }}
                            onChange={(e)=>handleChangeUnitStatus(e,item.id)}
                            options={unitStatuses}
                          />
                        </td> */}
                        <td>{item.status_obj.name}</td>
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
        </main>
      )}
    </>
  );
};

export default FeaturedUnits;