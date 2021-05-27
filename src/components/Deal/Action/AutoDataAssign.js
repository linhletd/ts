import React, { useState } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { useTranslation } from 'react-i18next';
import { callPost, useGet } from '../../../hooks/useRequest';
import Alert from '../../../components/Modal/Alert';
import ButtonLoading from '../../../components/Button/ButtonLoading';
import { queryCache } from 'react-query';

export default function AutoDataAssign() {
  let { t } = useTranslation();
  let [alert, setAlert] = useState({ show: false, content: '' });
  let [isLoading, setLoading] = useState(false);
  let { data: profile } = useGet(['USER_PROFILE'], APIProvider.getUrl('USER_PROFILE'));
  let { data: quota } = useGet(['USER_QUOTA'], APIProvider.getUrl('USER_QUOTA'));
  let totalQuota = profile?.quota;
  if (!totalQuota) totalQuota = 0;

  async function reqAutoDataAssign() {
    setLoading(true);
    let { data, code } = await callPost(APIProvider.getUrl('DEAL_AUTO_ASSIGN'));
    setLoading(false);
    if (code === 200) {
      setAlert({
        show: true,
        content: <p>{t('app.generics.update.success')}</p>,
        handleClose: () => {
          setAlert({ show: false });
          queryCache.invalidateQueries('DEAL_FILTER');
        },
      });
      return;
    }
    setAlert({
      show: true,
      content: <p className="text-danger">{data.message || t('app.generics.error')}</p>,
      handleClose: () => {
        setAlert({ show: false });
      },
    });
  }
  let isDisabled = quota && quota >= totalQuota;
  return (
    <>
      <ButtonLoading
        loading={isLoading}
        onClick={reqAutoDataAssign}
        className="mr-2"
        title={isDisabled ? 'Bạn đã rút đủ định mức ngày, bạn không thể rút thêm data!' : undefined}
        disabled={isDisabled}
      >
        {`${t('page.deal.list.autoDataAssign.name')} (${quota}/${totalQuota})`}
      </ButtonLoading>
      <Alert title={t('page.deal.list.autoDataAssign.title')} {...alert} />
    </>
  );
}
