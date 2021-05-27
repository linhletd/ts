import React, { useState, useEffect } from 'react';
import DataAssignForm from './DataAssignForm';
import Alert from '../../../components/Modal/Alert';
import { callPost, callGet } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

export default function DataAssign(props) {
  let { t } = useTranslation();
  let [alert, setAlert] = useState({ show: false });
  function alertForm() {
    setAlert({
      show: true,
      size: 'xl',
      feetless: true,
      backdrop: 'static',
      content: <DataAssignContent setAlert={setAlert} {...props} />,
    });
  }
  function handleClose() {
    setAlert({
      show: false,
    });
  }
  !alert.size && (alert.size = 'md');
  return (
    <>
      <Button variant="primary" className="mr-2" onClick={alertForm}>
        {t('page.contact.assignData')}
      </Button>
      <Alert title={t('page.contact.assignData.title')} handleClose={handleClose} {...alert} />
    </>
  );
}

function DataAssignContent({ setAlert, handleReload }) {
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
    Object.keys(values).map((key) => {
      if (values[key]) {
        if (values[key] instanceof Array) {
          vals[key] = values[key].map((cur) => cur.value);
        } else {
          vals[key] = values[key];
        }
      }
      if (vals['numOfObjectAssign']) vals['numOfObjectAssign'] = parseInt(vals['numOfObjectAssign']);
    });
    if (vals.campaignsGroup && vals.campaigns && vals.campaigns.length) {
      delete vals.campaignsGroup;
    }
    let { code, data } = await callPost(APIProvider.getUrl('DEAL_ASSIGN_ALL'), vals);
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
  function alertSuccess() {
    setAlert({
      show: true,
      content: <p>{t('page.contact.assignData.success.content')}</p>,
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
          alertSuccess();
          return;
        } else if (typeof data !== 'object' || data.isSuccess === null) {
          return;
        }
      }
      clearInterval(intervalStore.itv);
      setResponseMessage(data.result || t('app.generics.undefinedError'));
      setProcessing(false);
    }, 1000);
  }
  return <DataAssignForm onSubmitHandler={onSubmitHandler} handleClose={handleClose} responseMessage={responseMessage} isProcessing={isProcessing} />;
}
