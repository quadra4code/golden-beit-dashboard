import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const ProposalsTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [proposals, setProposals] = useState();
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newProposalName, setNewProposalName] = useState('');      // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editValue, setEditValue] = useState('');      // value typed while editing
  const resetAddRow  = () => { setIsAdding(false); setNewProposalName(''); };
  const resetEditRow = () => { setEditRowId(null); setEditValue('');   };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-proposals',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      // console.log(res.data);
      setProposals(res.data.data);
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

  const createProposal = (newProposalName) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-proposal',
      {
        name : newProposalName,
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setProposals(res.data.data)
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

  const updateProposal = (proposalId, proposalName) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-proposal/${proposalId}`,
      {
        name: proposalName
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setProposals(res.data.data)
      let updatedProposal = res.data.data;
      setProposals(prevProposal =>
        prevProposal.map(item =>
          item.id === proposalId ? {
            ...item,
            id: updatedProposal.id,
            name: updatedProposal.name,
            hidden: updatedProposal.hidden,
            updated_at: updatedProposal.updated_at,
            updated_by_name: updatedProposal.updated_by_name
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

  const hideProposal = (proposalId, proposalName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-proposal/${proposalId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setProposals(res.data.data)
      setProposals(prevProposal =>
        prevProposal.map(item =>
          item.id === proposalId ? {
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

  const deleteProposal = (proposalId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-proposal/${proposalId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setProposals(proposals.filter((item) => item.id !== proposalId))
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
    setProposals(prev => [
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
    if (!newProposalName.trim()) return;   // empty guard
    createProposal(newProposalName);
    resetAddRow();
  };
  const handleCancelNew = () => {
    // setting proposals to previous
    setProposals(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    updateProposal(editRowId, editValue);
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name) => ({
    items: [
      {
        label: proposals&& proposals.find((item) => item.id === id).hidden
          ? 'إظهار الطرح'
          : 'إخفاء الطرح',
          key: '1',
        icon: proposals&& proposals.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideProposal(id),
      },
      {
        label: 'تعديل الطرح',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name),
      },
      {
        label: 'حذف الطرح ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteProposal(id),
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
              <button className='table-btn' onClick={handleNewRow}>أضف طرح</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>الطرح</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals&& proposals.length > 0 ? (
                    proposals.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-proposal-name"
                                autoFocus
                                className="table-input"
                                value={newProposalName}
                                onChange={e => setNewProposalName(e.target.value)}
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
                                id='edit-proposal-name'
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
                      <td colSpan="6">لا يوجد طروحات</td>
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

export default ProposalsTable;