import React, { useState, useContext } from 'react';
import { Button, Modal } from 'antd';
import { AppContext } from '../Context/AppContext';
const ConfirmPopup = () => {
  const {handleModalOk, handleModalCancel,isModalOpen, setIsModalOpen, setRefuseMsg, modalType} = useContext(AppContext);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    // if (modalType === 'orderRefuse') {
    //   // Handle confirm action
    //   console.log('orderRefuse');
    // } else if (modalType === 'addUnit') {
    //   // Handle edit action
    //   console.log('addUnit');
    // }
    setIsModalOpen(false);
  };
  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title="قم بإدخال سبب الرفض"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleModalOk}
        cancelText="إلغاء"
        okText="تأكيد"
        onCancel={handleModalCancel}
      >
        <textarea onChange={(e)=>setRefuseMsg(e.target.value)}></textarea>
      </Modal>
    </>
  );
};
export default ConfirmPopup;