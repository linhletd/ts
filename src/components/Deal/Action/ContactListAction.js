import React, { useState } from 'react';
import DropdownMenu from '../../Common/DropdownMenu';
import Alert from '../../../components/Modal/Alert';
import { useTranslation } from 'react-i18next';
import DataAssignByDealList from './DataAssignByDealList';
import ModalAccountTrial from './ModalAccountTrial';

export default function DealListAction({ listChecked, filterData, handleReload }) {
  let { t } = useTranslation();
  let [alert, setAlert] = useState({ show: false });
  function handleClose() {
    setAlert({ show: false });
  }
  let validated = !!(listChecked && listChecked.length);
  function alertInvalidData() {
    setAlert({
      show: true,
      title: t('app.generics.warning'),
      content: t('page.deal.list.alert.invalidList'),
      feetless: true,
    });
  }
  function alertDataAssignForm() {
    if (!validated) {
      return alertInvalidData();
    }
    setAlert({
      title: t('page.contact.modal.userManager.text'),
      show: true,
      content: <DataAssignByDealList listChecked={listChecked} setAlert={setAlert} handleReload={handleReload} />,
      backdrop: 'static',
      feetless: true,
    });
  }
  function alertTrialCreateContent() {
    if (!validated) {
      return alertInvalidData();
    }
    setAlert({
      title: t('page.contact.modal.accountTrial.text'),
      show: true,
      content: <ModalAccountTrial listChecked={listChecked} filterData={filterData} setAlert={setAlert} handleReload={handleReload} />,
      backdrop: 'static',
      feetless: true,
    });
  }
  let list = [
    {
      text: t('page.contact.modal.userManager.text'),
      handleClick() {
        alertDataAssignForm();
      },
    },
    {
      text: t('page.contact.modal.accountTrial.text'),
      handleClick() {
        alertTrialCreateContent();
      },
    },
  ];
  return (
    <>
      <DropdownMenu title={t('app.generics.action1')} list={list} />
      <Alert handleClose={handleClose} {...alert} />
    </>
  );
}
