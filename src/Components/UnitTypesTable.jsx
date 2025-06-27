import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const UnitTypesTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [unitTypes, setUnitTypes] = useState();
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newUnitName, setNewUnitName] = useState('');  // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editValue, setEditValue] = useState('');      // value typed while editing
  const resetAddRow  = () => { setIsAdding(false); setNewUnitName(''); };
  const resetEditRow = () => { setEditRowId(null); setEditValue('');   };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-unit-types',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      // console.log(res.data);
      setUnitTypes(res.data.data);
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

  const createUnitType = (newUnitTypeName) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-unit-type',
      {
        name : newUnitTypeName,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      setUnitTypes(res.data.data)
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

  const updateUnitType = (unitTypeId, unitTypeName) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-unit-type/${unitTypeId}`,
      {
        name: unitTypeName
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setUnitTypes(res.data.data)
      let updatedUnitType = res.data.data;
      setUnitTypes(prevUnitType =>
        prevUnitType.map(item =>
          item.id === unitTypeId ? {
            ...item,
            id: updatedUnitType.id,
            name: updatedUnitType.name,
            hidden: updatedUnitType.hidden,
            updated_at: updatedUnitType.updated_at,
            updated_by_name: updatedUnitType.updated_by_name
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
  
  const hideUnitType = (unitTypeId, unitTypeName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-unit-type/${unitTypeId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setUnitTypes(res.data.data)
      setUnitTypes(prevUnitType =>
        prevUnitType.map(item =>
          item.id === unitTypeId ? {
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
  
  const deleteUnitType = (unitTypeId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-unit-type/${unitTypeId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setUnitTypes(unitTypes.filter((item) => item.id !== unitTypeId))
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
    setUnitTypes(prev => [
      ...prev,
      {
        id: 'tmp-new',           // any unique placeholder key
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
    if (!newUnitName.trim()) return;   // empty guard
    createUnitType(newUnitName);
    resetAddRow();
  };
  const handleCancelNew = () => {
    // setting unit types to previous
    setUnitTypes(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    updateUnitType(editRowId, editValue);   // you already have this fn
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name) => ({
    items: [
      {
        label: unitTypes&& unitTypes.find((item) => item.id === id).hidden
          ? 'إظهار نوع الوحدة'
          : 'إخفاء نوع الوحدة',
          key: '1',
        icon: unitTypes&& unitTypes.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideUnitType(id),
      },
      
      {
        label: 'تعديل نوع الوحدة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name),
      },
      {
        label: 'حذف نوع الوحدة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteUnitType(id),
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
              <button className='table-btn' onClick={handleNewRow}>أضف نوع وحدة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>نوع الوحدة</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {unitTypes&& unitTypes.length > 0 ? (
                    unitTypes.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-unit-type-name"
                                autoFocus
                                className="table-input"
                                value={newUnitName}
                                onChange={e => setNewUnitName(e.target.value)}
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
                                id="edit-unit-type-name"
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
                      <td colSpan="6">لا يوجد أنواع وحدات</td>
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

export default UnitTypesTable;