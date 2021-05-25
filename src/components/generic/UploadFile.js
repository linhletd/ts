import React, { useEffect, useState } from 'react';
import ButtonUploadExcel from '../../components/Button/ButtonUploadExcel';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Modal/Alert';
import { callUpload, callGet, callPost } from '../../hooks/useRequest';
import APIProvider from '../../util/api/url/APIProvider';
import ResponseMessage from './ResponseMessage';

export default function UploadFile({ willSendParams, ...props }) {
  const { t } = useTranslation();

  let [file, setFile] = useState();
  let [alert, setAlert] = useState({ show: false });
  let [isProcessing, setProcessingState] = useState(false);
  let [intervalStore] = useState({});

  const handleClickUpload = (data) => {
    setFile(data);
    setAlert({
      show: true,
      content: t('app.genericts.file.uploading'),
    });
    setProcessingState(true);
  };
  useEffect(() => {
    if (typeof file === 'object') {
      executeUpload();
    }
  }, [file]);
  const alertSuccess = () => {
    setAlert({
      show: true,
      content: t('app.generics.file.imported'),
      handleClose: () => {
        setAlert({ show: false });
        props.handleReload && props.handleReload(true);
      },
    });
    setProcessingState(false);
  };
  const executeUpload = async () => {
    let response = await callUpload(APIProvider.getUrl('UPLOAD'), file);
    if (response.code === 200) {
      setAlert({
        show: true,
        content: t('app.genericts.file.uploaded'),
      });
      executeUploadExcel(response.data);
    } else {
      setAlert({
        show: true,
        content: <p className="text-danger">{t('app.genericts.file.upload.error')}</p>,
      });
      setProcessingState(false);
    }
  };

  const executeUploadExcel = async (filePath) => {
    setAlert({
      show: true,
      content: t('app.genericts.file.importing'),
    });
    let request;
    if (willSendParams) {
      request = callPost(`${APIProvider.getUrl(props.keyApi)}?file=${filePath}`);
    } else {
      const urlFile = { file: filePath };
      request = callPost(APIProvider.getUrl(props.keyApi), urlFile);
    }
    let response = await request;
    if (response.code === 200) {
      if (response.data && typeof response.data === 'string') {
        executeJobStatus(response.data);
      } else {
        alertSuccess();
      }
    } else {
      setAlert({
        show: true,
        content: <ResponseMessage error={response.data.message} />,
      });
      setProcessingState(false);
    }
  };

  const executeJobStatus = (jobId) => {
    setAlert({
      show: true,
      content: t('app.genericts.file.importing'),
    });
    if (intervalStore.itv) {
      clearInterval(intervalStore.itv);
    }
    intervalStore.itv = setInterval(async () => {
      let { data, code } = await callGet(APIProvider.getUrl('JOB_STATUS'), { params: { jobId } });
      if (code === 200) {
        if (data.isSuccess) {
          clearInterval(intervalStore.itv);
          alertSuccess();
          setProcessingState(false);
          return;
        } else if (data.isSuccess === null) {
          return;
        }
      }
      setAlert({
        show: true,
        content: <ResponseMessage error={`${t('app.generics.file.import.error')}`} />,
      });
      clearInterval(intervalStore.itv);
      setProcessingState(false);
    }, 1000);
  };

  return (
    <>
      <ButtonUploadExcel className="mr-2" label={props.title} onChange={handleClickUpload} loading={isProcessing} templateFile={props.templateFile} />
      <Alert
        title={t('app.genericts.importFile')}
        handleClose={() => {
          setAlert({ show: false });
        }}
        {...alert}
      />
    </>
  );
}
