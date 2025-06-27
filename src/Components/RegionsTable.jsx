import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space, Select } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const RegionsTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [regions, setRegions] = useState();
  const [cities, setCities] = useState();
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newRegionName, setNewRegionName] = useState('');      // value typed in the add row input
  const [newRegionCityId, setNewRegionCityId] = useState('');      // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editValue, setEditValue] = useState('');      // value typed while editing
  const [editCityValue, setEditCityValue] = useState('');      // value typed while editing
  const resetAddRow  = () => { setIsAdding(false); setNewRegionName(''); setNewRegionCityId(''); };
  const resetEditRow = () => { setEditRowId(null); setEditValue(''); setEditCityValue(''); };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-regions',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      console.log(res.data);
      setRegions(res.data.data);
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

  const getAllCities = () => {
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
  }

  const createRegion = (newRegionName, cityId) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-region',
      {
        name : newRegionName,
        city_id: cityId
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setRegions(res.data.data)
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

  const updateRegion = (regionId, regionName, cityId) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-region/${regionId}`,
      {
        name: regionName,
        city_id: cityId
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setRegions(res.data.data)
      let updatedRegion = res.data.data;
      setRegions(prevRegion =>
        prevRegion.map(item =>
          item.id === regionId ? {
            ...item,
            id: updatedRegion.id,
            name: updatedRegion.name,
            city_obj: {city_id: updatedRegion.city_obj.city_id, city_name: updatedRegion.city_obj.city_name},
            hidden: updatedRegion.hidden,
            updated_at: updatedRegion.updated_at,
            updated_by_name: updatedRegion.updated_by_name
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

  const hideRegion = (regionId, regionName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-region/${regionId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setRegions(res.data.data)
      setRegions(prevRegion =>
        prevRegion.map(item =>
          item.id === regionId ? {
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

  const deleteRegion = (regionId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-region/${regionId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setRegions(regions.filter((item) => item.id !== regionId))
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
    getAllCities();
    setRegions(prev => [
      ...prev,
      {
        id: 'tmp-new',           // unique placeholder key
        name: '',
        city_id: '',
        hidden: false,
        updated_at: '—',
        updated_by: '—',
        _isTemp: true            // flag so we can spot it later
      },
    ]);
    setIsAdding(true);
  }

  const handleOpenRowEdit = (id, currentName) => {
    getAllCities();
    resetAddRow();
    setEditRowId(id);
    setEditValue(currentName);
  }

  // for the newly-added row
  const handleSaveNew = () => {
    if (!newRegionName.trim()) return;   // empty guard
    createRegion(newRegionName, newRegionCityId);
    resetAddRow();
  };
  const handleCancelNew = () => {
    // setting regions to previous
    setRegions(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    updateRegion(editRowId, editValue, editCityValue);
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name) => ({
    items: [
      {
        label: regions&& regions.find((item) => item.id === id).hidden
          ? 'إظهار المنطقة'
          : 'إخفاء المنطقة',
          key: '1',
        icon: regions&& regions.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideRegion(id),
      },
      {
        label: 'تعديل المنطقة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name),
      },
      {
        label: 'حذف المنطقة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteRegion(id),
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
              <button className='table-btn' onClick={handleNewRow}>أضف منطقة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>المنطقة</th>
                    <th>المدينة</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {regions&& regions.length > 0 ? (
                    regions.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-region-name"
                                autoFocus
                                className="table-input"
                                value={newRegionName}
                                onChange={e => setNewRegionName(e.target.value)}
                              />
                            </td>
                            <td>
                              <Select
                                placeholder="اختر المدينة"
                                style={{ width: 120 }}
                                onChange={(e) => setNewRegionCityId(e)}
                                options={cities&& cities.map(c => ({
                                  label: c.name,
                                  value: c.id
                                }))}
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
                                id="edit-region-name"
                                autoFocus
                                className="table-input"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                              />
                            </td>
                            <td>
                              <Select
                                placeholder="اختر المدينة"
                                defaultValue={item.city_obj.city_name}
                                style={{ width: 120 }}
                                onChange={(e) => setEditCityValue(e)}
                                options={cities&& cities.map(c => ({
                                  label: c.name,
                                  value: c.id
                                }))}
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
                          <td>{item.city_obj.city_name}</td>
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
                      <td colSpan="6">لا يوجد مناطق</td>
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

export default RegionsTable;