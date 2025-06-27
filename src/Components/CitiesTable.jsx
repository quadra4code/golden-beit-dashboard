import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const CitiesTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [cities, setCities] = useState();
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newCityName, setNewCityName] = useState('');      // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editValue, setEditValue] = useState('');      // value typed while editing
  const resetAddRow  = () => { setIsAdding(false); setNewCityName(''); };
  const resetEditRow = () => { setEditRowId(null); setEditValue('');   };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-cities',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      // console.log(res.data);
      setCities(res.data.data);
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

  const createCity = (newCityName) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-city',
      {
        name : newCityName,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setCities(res.data.data)
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    });
  }

  const updateCity = (cityId, cityName) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-city/${cityId}`,
      {
        name: cityName
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setCities(res.data.data)
      let updatedCity = res.data.data;
      setCities(prevCity =>
        prevCity.map(item =>
          item.id === cityId ? {
            ...item,
            id: updatedCity.id,
            name: updatedCity.name,
            hidden: updatedCity.hidden,
            updated_at: updatedCity.updated_at,
            updated_by_name: updatedCity.updated_by_name
          } : item
        )
      );
      openNotificationWithIcon('success', res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    });
  }

  const hideCity = (cityId, cityName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-city/${cityId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setCities(res.data.data)
      setCities(prevCity =>
        prevCity.map(item =>
          item.id === cityId ? {
            ...item,
            hidden: res.data.data.hidden,
            updated_at: res.data.data.updated_at,
            updated_by_name: res.data.data.updated_by_name
          } : item
        )
      );
      openNotificationWithIcon('success', res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    });
  }

  const deleteCity = (cityId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-city/${cityId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setCities(cities.filter((item) => item.id !== cityId))
      openNotificationWithIcon('success',res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
    });
  }

  const handleNewRow = () => {
    if (isAdding) return;
    // prepend a temporary object so it renders immediately
    setCities(prev => [
      ...prev,
      {
        id: 'tmp-new',           // unique placeholder key
        name: '',
        hidden: false,
        updated_at: '—',
        updated_by: '—',
        _isTemp: true            // flag so we can spot it later
      },
    ]);
    setIsAdding(true);
  }

  const handleOpenRowEdit = (id, currentName) => {
    resetAddRow();
    setEditRowId(id);
    setEditValue(currentName);
  }

  // for the newly-added row
  const handleSaveNew = () => {
    if (!newCityName.trim()) return;   // empty guard
    createCity(newCityName);
    resetAddRow();
  };
  const handleCancelNew = () => {
    // setting cities to previous
    setCities(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    updateCity(editRowId, editValue);
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name) => ({
    items: [
      {
        label: cities&& cities.find((item) => item.id === id).hidden
          ? 'إظهار المدينة'
          : 'إخفاء المدينة',
          key: '1',
        icon: cities&& cities.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideCity(id),
      },
      {
        label: 'تعديل المدينة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name),
      },
      {
        label: 'حذف المدينة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteCity(id),
      },
    ],
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className='table_page'>
          <div className="container">
            <div className="table-header">
              <button className='table-btn' onClick={handleNewRow}>أضف مدينة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>المدينة</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {cities&& cities.length > 0 ? (
                    cities.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-city-name"
                                autoFocus
                                className="table-input"
                                value={newCityName}
                                onChange={e => setNewCityName(e.target.value)}
                              />
                            </td>
                            <td colSpan={2}>—</td>
                            <td>
                              <span className="state-span done">ظاهر</span>
                            </td>
                            <td>
                              <button onClick={handleSaveNew}  className="table-btn-ok">✓</button>
                              <button onClick={handleCancelNew} className="table-btn-cancel">✕</button>
                            </td>
                          </tr>
                        );
                      }
                      // EDITING EXISTING ROW  ––––––––––––––––
                      if (editRowId === item.id) {
                        return (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                              <input
                                id="edit-city-name"
                                autoFocus
                                className="table-input"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                              />
                            </td>
                            <td>{item.updated_at}</td>
                            <td>{item.updated_by_name}</td>
                            <td>
                              <span className={`state-span ${item.hidden ? 'still' : 'done'}`}>
                                {item.hidden ? 'مخفي' : 'ظاهر'}
                              </span>
                            </td>
                            <td>
                              <button onClick={handleSaveEdit} className="table-btn-ok">✓</button>
                              <button onClick={handleCancelEdit} className="table-btn-cancel">✕</button>
                            </td>
                          </tr>
                        );
                      }
                      // NORMAL (read-only) ROW  ––––––––––––––
                      return (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.updated_at}</td>
                          <td>{item.updated_by_name}</td>
                          <td>
                            <span className={`state-span ${item.hidden ? 'still' : 'done'}`}>
                              {item.hidden ? 'مخفي' : 'ظاهر'}
                            </span>
                          </td>
                          <td>
                            <Dropdown menu={menuProps(item.id, item.name)}>
                              <Button>
                                <Space>
                                  خيارات
                                  <DownOutlined />
                                </Space>
                              </Button>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6">لا يوجد مدن</td>
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

export default CitiesTable;