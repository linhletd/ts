import React, { useState, useEffect } from 'react';
import DataAssignByDealListForm from './DataAssignByDealListForm';
import { callPost, callGet } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import { useTranslation } from 'react-i18next';

export default function DataAssign({ listChecked, setAlert, handleReload }) {
  let { t } = useTranslation();
  let [responseMessage, setResponseMessage] = useState('');
  let [isProcessing, setProcessing] = useState(false);
  let [intervalStore] = useState({});
  useEffect(() => {
    return () => {
      clearInterval(intervalStore.itv);
    };
  });

  async function onSubmitHandler(values) {
    responseMessage && setResponseMessage('');
    setProcessing(true);
    let vals = {};
    vals.users = values.users.map((cur) => cur.value);
    vals.objectIds = listChecked;

    let { code, data } = await callPost(APIProvider.getUrl('DEAL_ASSIGN'), vals);
    if (code === 200) {
      checkJobStatus(data);
    } else {
      setResponseMessage(data && data.message);
      setProcessing(false);
    }
  }
  function handleClose() {
    setAlert({
      show: false,
    });
  }

  function alertSuccess(errorMessage) {
    setAlert({
      show: true,
      content: errorMessage ? <p className="text-danger">{errorMessage}</p> : <p>{t('page.contact.modal.userManager.success')}</p>,
      title: t('app.generics.warning'),
      handleClose: () => {
        setAlert({
          show: false,
        });
        handleReload();
      },
    });
  }
  async function checkJobStatus(jobId) {
    if (intervalStore.itv) {
      clearInterval(intervalStore.itv);
    }
    intervalStore.itv = setInterval(async () => {
      let { data, code } = await callGet(APIProvider.getUrl('JOB_STATUS'), { params: { jobId } });
      if (code === 200) {
        if (typeof data === 'object' && data.isSuccess) {
          clearInterval(intervalStore.itv);
          alertSuccess(data.result);
          return;
        } else if (typeof data !== 'object' || data.isSuccess === null) {
          return;
        }
      }
      clearInterval(intervalStore.itv);
      setResponseMessage(`${t('page.contact.modal.userManager.false')}.${data.result && JSON.parse(data.result).error ? JSON.parse(data.result).error : ''}`);

      setProcessing(false);
    }, 1000);
  }
  return <DataAssignByDealListForm onSubmitHandler={onSubmitHandler} handleClose={handleClose} responseMessage={responseMessage} isProcessing={isProcessing} ownerType="SALE" />;
}
