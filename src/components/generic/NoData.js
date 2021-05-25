import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NoData({ status, text }) {
  let { t } = useTranslation();
  return (
    <>
      {status === 'nodata' && <small className="text-danger">{text || t('app.generics.nodata')}</small>}
      {status === 'loading' && <small className="text-secondary">{t('app.generics.loading')}</small>}
      {status === 'error' && <small className="text-danger">{t('app.generics.error')}</small>}
    </>
  );
}
