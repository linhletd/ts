import React, { useState, useEffect } from 'react';
import ButtonLoading from '../../components/Button/ButtonLoading';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Modal/Alert';
import { callGet } from '../../hooks/useRequest';
import APIProvider from '../../util/api/url/APIProvider';
import ResponseMessage from './ResponseMessage';

export default function DealDownload({ requestDownload, Component, ...rest }) {
  const { t } = useTranslation();
  let [alert, setAlert] = useState({ show: false });
  let [intervalStore] = useState({});
  let [isProcessing, setProcessingState] = useState(false);
  async function handleClick() {
    setProcessingState(true);
    let response = await requestDownload();
    if (response.code === 200) {
      checkJobStatusAndDownload(response.data);
    } else {
      setAlert({
        show: true,
        content: <ResponseMessage error={response.data.message} messagePrefix="" />,
      });
      setProcessingState(false);
    }
  }
  useEffect(() => {
    return () => {
      clearInterval(intervalStore.itv);
    };
  });
  async function checkJobStatusAndDownload(jobId) {
    if (intervalStore.itv) {
      clearInterval(intervalStore.itv);
    }
    intervalStore.itv = setInterval(async () => {
      let { data, code } = await callGet(APIProvider.getUrl('JOB_STATUS'), { params: { jobId } });
      console.log(typeof data);
      if (code === 200) {
        if (typeof data === 'object' && data.isSuccess) {
          clearInterval(intervalStore.itv);
          let filePath = JSON.parse(data.result).filePath;
          let link = document.createElement('a');
          // link.target = '_blank';
          link.href = process.env.REACT_APP_BASE_URL_STATE + filePath;
          let filename = filePath.match(/\/([^/]+$)/)[1];
          link.download = filename;
          link.click();
          setProcessingState(false);
          return;
        } else if (typeof data !== 'object' || data.isSuccess === null) {
          return;
        }
      }
      clearInterval(intervalStore.itv);
      setProcessingState(false);
      setAlert({
        show: true,
        content: <ResponseMessage error={t('app.generics.list.download.error')} messagePrefix="" />,
      });
    }, 1000);
  }
  return (
    <>
      {Component ? (
        <Component handleClick={handleClick} loading={isProcessing} {...rest} />
      ) : (
        <ButtonLoading className="mr-2" onClick={handleClick} loading={isProcessing} {...rest}>
          <i className="fa fa-download" aria-hidden="true"></i>
        </ButtonLoading>
      )}
      <Alert
        {...alert}
        title={t('app.generics.list.download')}
        handleClose={() => {
          setAlert({ show: false });
        }}
      />
    </>
  );
}
