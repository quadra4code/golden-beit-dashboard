import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const StatusTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [status, setStatus] = useState();
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newStatusName, setNewStatusName] = useState('');      // value typed in the add row input
  const [newStatusCode, setNewStatusCode] = useState('');      // value typed in the add row input
  const [newStatusColor, setNewStatusColor] = useState('#000000');      // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editNameValue, setEditNameValue] = useState('');      // value typed while editing
  const [editCodeValue, setEditCodeValue] = useState('');      // value typed while editing
  const [editColorValue, setEditColorValue] = useState('');      // value typed while editing
  const resetAddRow  = () => { setIsAdding(false); setNewStatusName(''); setNewStatusCode(''); setNewStatusColor('#000000');};
  const resetEditRow = () => { setEditRowId(null); setEditNameValue(''); setEditCodeValue(''); setEditColorValue(''); };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-status',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      // console.log(res.data);
      setStatus(res.data.data);
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

  const createStatus = (newStatusName) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-status',
      {
        name : newStatusName,
        code : newStatusCode,
        color: newStatusColor
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setStatus(res.data.data)
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

  const updateStatus = (statusId, statusName) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-status/${statusId}`,
      {
        name: statusName,
        code: editCodeValue,
        color: editColorValue
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setStatus(res.data.data)
      let updatedStatus = res.data.data;
      setStatus(prevStatus =>
        prevStatus.map(item =>
          item.id === statusId ? {
            ...item,
            id: updatedStatus.id,
            name: updatedStatus.name,
            code: updatedStatus.code,
            color: updatedStatus.color,
            hidden: updatedStatus.hidden,
            updated_at: updatedStatus.updated_at,
            updated_by_name: updatedStatus.updated_by_name
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

  const hideStatus = (statusId, statusName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-status/${statusId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setStatus(res.data.data)
      setStatus(prevStatus =>
        prevStatus.map(item =>
          item.id === statusId ? {
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

  const deleteStatus = (statusId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-status/${statusId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setStatus(status.filter((item) => item.id !== statusId))
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
    setStatus(prev => [
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

  const handleOpenRowEdit = (id, currentName, currentCode, currentColor) => {
    resetAddRow();
    setEditRowId(id);
    setEditNameValue(currentName);
    setEditCodeValue(currentCode);
    setEditColorValue(currentColor);
  }

  // for the newly-added row
  const handleSaveNew = () => {
    if (!newStatusName.trim() || !newStatusCode || !newStatusColor) return;   // empty guard
    createStatus(newStatusName);
    resetAddRow();
  };
  const handleCancelNew = () => {
    // setting status to previous
    setStatus(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editNameValue.trim() || !editCodeValue || !editColorValue) return;
    updateStatus(editRowId, editNameValue);
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name, code, color) => ({
    items: [
      {
        label: status&& status.find((item) => item.id === id).hidden
          ? 'إظهار الحالة'
          : 'إخفاء الحالة',
          key: '1',
        icon: status&& status.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideStatus(id),
      },
      {
        label: 'تعديل الحالة',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name,code,color),
      },
      {
        label: 'حذف الحالة ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteStatus(id),
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
              <button className='table-btn' onClick={handleNewRow}>أضف حالة</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>الحالة</th>
                    <th>الكود</th>
                    <th>اللون</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {status&& status.length > 0 ? (
                    status.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-status-name"
                                autoFocus
                                className="table-input"
                                onChange={e => setNewStatusName(e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                id="new-status-code"
                                className="table-input"
                                maxLength={2}
                                onChange={e => setNewStatusCode(e.target.value)}
                              />
                            </td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'center'}}>
                                <input
                                  id="new-status-color"
                                  type='color'
                                  onChange={e => setNewStatusColor(e.target.value)}
                                  style={{width: '80%', height: '40px', border: 'none', background: 'none', borderRadius: '50%'}}
                                />
                              </div>
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
                                id='edit-status-name'
                                autoFocus
                                className="table-input"
                                value={editNameValue}
                                onChange={e => setEditNameValue(e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                id='edit-status-code'
                                className="table-input"
                                maxLength={2}
                                value={editCodeValue}
                                onChange={e => setEditCodeValue(e.target.value)}
                              />
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <input
                                  type="color"
                                  id="edit-status-color"
                                  value={editColorValue || '#000000'}
                                  onChange={e => setEditColorValue(e.target.value)}
                                  style={{ width: '80%', height: '40px', border: 'none', background: 'none', borderRadius: '50%'}}
                                />
                              </div>
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
                          <td>{item.code}</td>
                          <td><div style={{ borderRadius: '50%', backgroundColor: item.color, height: '40px', width: '40px', justifySelf: 'center'}}></div></td>
                          <td>{item.updated_at}</td>
                          <td>{item.updated_by_name}</td>
                          <td>
                            <span className={`state-span ${item.hidden ? 'still' : 'done'}`}>
                              {item.hidden ? 'مخفي' : 'ظاهر'}
                            </span>
                          </td>
                          <td>
                            <Dropdown menu={menuProps(item.id, item.name, item.code, item.color)}>
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
                      <td colSpan="6">لا يوجد حالات</td>
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

export default StatusTable;