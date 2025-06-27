import { useState, useContext, useEffect } from 'react';
import Loader from './Loader';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { DownOutlined,  } from '@ant-design/icons';
import { Button, Dropdown, Space, Select } from 'antd';
import { BsTrash } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

const ProjectsTable = () => {
  const staffRoles = localStorage.getItem('staffRoles');
  if (staffRoles && staffRoles.includes('Sales') && !['Manager', 'Admin', 'Superuser'].some(role => staffRoles.includes(role))) {
    window.location.href = `${window.location.origin}/paginated-orders`
  }

  const [loading, setLoading] = useState();
  const [projects, setProjects] = useState();
  const [unitTypes, setUnitTypes] = useState();
  const [newProjectUnitTypes, setNewProjectUnitTypes] = useState([]);
  const [isAdding, setIsAdding]   = useState(false);   // true while a brand-new row is open
  const [newProjectName, setNewProjectName] = useState('');      // value typed in the add row input
  const [editRowId, setEditRowId] = useState(null);    // id of the row being edited
  const [editValue, setEditValue] = useState('');      // value typed while editing
  const [editProjectUnitTypes, setEditProjectUnitTypes] = useState([]);
  const [editSelectChanged, setEditSelectChanged] = useState(false);
  const resetAddRow  = () => { setIsAdding(false); setNewProjectName(''); setNewProjectUnitTypes([]); };
  const resetEditRow = () => { setEditRowId(null); setEditValue(''); setEditProjectUnitTypes([]); setEditSelectChanged(false); };
  const {handleUnAuth,token, openNotificationWithIcon} = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    axios
    .get('https://api.goldenbeit.com/dashboard/all-projects',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    .then((res) => {
      // console.log(res.data);
      setProjects(res.data.data);
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err);
      openNotificationWithIcon('error',err.response.data.msg)
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const createProject = (newProjectName) => {
    axios
    .post('https://api.goldenbeit.com/dashboard/create-project',
      {
        name : newProjectName,
        unit_type_ids: newProjectUnitTypes
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setProjects(res.data.data)
      openNotificationWithIcon('success',`${res.data.msg}`)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      console.log(err.response.data.data);
      openNotificationWithIcon('error',`${err.response.data.msg}`)
    });
  }

  const updateProject = (projectId, projectName) => {
    axios
    .put(`https://api.goldenbeit.com/dashboard/update-project/${projectId}`,
      {
        name: projectName,
        unit_type_ids: editProjectUnitTypes
      },
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setProjects(res.data.data)
      let updatedProject = res.data.data;
      setProjects(prevProject =>
        prevProject.map(item =>
          item.id === projectId ? {
            ...item,
            id: updatedProject.id,
            name: updatedProject.name,
            relation: updatedProject.relation,
            hidden: updatedProject.hidden,
            updated_at: updatedProject.updated_at,
            updated_by_name: updatedProject.updated_by_name
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

  const hideProject = (projectId, projectName) => {
    axios
    .patch(`https://api.goldenbeit.com/dashboard/toggle-hidden-project/${projectId}`,
      {},
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      // setProjects(res.data.data)
      setProjects(prevProject =>
        prevProject.map(item =>
          item.id === projectId ? {
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

  const deleteProject = (projectId) => {
    axios
    .delete(`https://api.goldenbeit.com/dashboard/delete-project/${projectId}`,
      {headers: { 'Authorization': `Bearer ${token}` },}
    )
    .then((res) => {
      // console.log(res.data);
      setProjects(projects.filter((item) => item.id !== projectId))
      openNotificationWithIcon('success',res.data.msg)
    })
    .catch((err) => {
      if(err.status===401){
        handleUnAuth()
      }
      openNotificationWithIcon('error',err.response.data.msg)
      console.log(err);
    });
  }

  const getUnitTypes = () => {
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
      openNotificationWithIcon('error',err.response.data.msg)
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const handleNewRow = () => {
    if (isAdding) return;
    getUnitTypes();
    // prepend a temporary object so it renders immediately
    setProjects(prev => [
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
    getUnitTypes();
    resetAddRow();
    setEditRowId(id);
    setEditValue(currentName);
    setEditProjectUnitTypes(projects.find(item => item.id === id).relation.map(ut => ut.unit_type_id));
  }

  // for the newly-added row
  const handleSaveNew = () => {
    if (!newProjectName.trim() || !newProjectUnitTypes.length) {
      openNotificationWithIcon('error', 'الرجاء إدخال اسم المشروع وأنواع الوحدات المرتبطة');
      return;
    } // empty guard
    createProject(newProjectName);
    resetAddRow();
  };

  const handleCancelNew = () => {
    // setting projects to previous
    setProjects(prev => prev.filter(r => r.id !== 'tmp-new'));
    resetAddRow();
  };

  // for an existing row
  const handleSaveEdit = () => {
    if (!editValue.trim() || !editProjectUnitTypes.length) {
      openNotificationWithIcon('error', 'الرجاء إدخال اسم المشروع وأنواع الوحدات المرتبطة');
      return;
    } // empty guard
    // else if (editValue === projects.find(item => item.id === editRowId).name){
    //   openNotificationWithIcon('info', 'لا يوجد تغيير في اسم المشروع');
    //   return;
    // }
    else if (editProjectUnitTypes.length === 0 || (!editSelectChanged && editValue === projects.find(item => item.id === editRowId).name)) {
      openNotificationWithIcon('error', 'الرجاء اختيار أنواع الوحدات المرتبطة بالمشروع أو تغيير اسم المشروع');
      return;
    }
    updateProject(editRowId, editValue);
    resetEditRow();
  };
  const handleCancelEdit = resetEditRow;

  const menuProps = (id, name) => ({
    items: [
      {
        label: projects&& projects.find((item) => item.id === id).hidden
          ? 'إظهار المشروع'
          : 'إخفاء المشروع',
          key: '1',
        icon: projects&& projects.find((item) => item.id === id).hidden
          ? <FaRegEye />
          : <FaRegEyeSlash />,
        onClick: () => hideProject(id),
      },
      {
        label: 'تعديل المشروع',
        key: '2',
        icon: <FaPen />,
        onClick: () => handleOpenRowEdit(id,name),
      },
      {
        label: 'حذف المشروع ',
        key: '3',
        icon: <BsTrash />,
        danger:true,
        onClick: () => deleteProject(id),
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
              <button className='table-btn' onClick={handleNewRow}>أضف مشروع</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المسلسل</th>
                    <th>المشروع</th>
                    <th>أنواع الوحدات المرتبط بها</th>
                    <th>آخر تحديث</th>
                    <th>آخر محدث</th>
                    <th>حالة الظهور</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {projects&& projects.length > 0 ? (
                    projects.map((item, index) => {
                      // NEW ROW  –––––––––––––––––––––––––––––
                      if (item._isTemp) {
                        return (
                          <tr key="tmp-new">
                            <td>—</td>
                            <td>
                              <input
                                id="new-project-name"
                                autoFocus
                                className="table-input"
                                value={newProjectName}
                                onChange={e => setNewProjectName(e.target.value)}
                              />
                            </td>
                            <td>
                              <Select
                                mode="multiple"
                                placeholder="اختر أنواع الوحدات"
                                style={{ width: "100%" }}
                                onChange={(e) => setNewProjectUnitTypes(e)}
                                  options={unitTypes&& unitTypes.map(c => ({
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
                              <button onClick={handleSaveNew} className="table-btn-ok">✓</button>
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
                                id='edit-project-name'
                                autoFocus
                                className="table-input"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                />
                            </td>
                            <td>
                              <Select
                                mode="multiple"
                                placeholder="اختر أنواع الوحدات"
                                value={editProjectUnitTypes}
                                style={{ width: "100%" }}
                                onChange={(e) => {setEditProjectUnitTypes(e); setEditSelectChanged(true);}}
                                options={unitTypes&& unitTypes.map(c => ({
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
                          <td>
                            {Array.isArray(item.relation) && item.relation.length > 0
                              ? item.relation.map(ut => ut.unit_type_name).join(' | ')
                              : '—'}
                          </td>
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
                      <td colSpan="6">لا يوجد مشاريع</td>
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

export default ProjectsTable;