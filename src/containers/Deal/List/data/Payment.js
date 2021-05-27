import React from 'react';
import {useTranslation} from 'react-i18next'

export default function Payment({ row }) {
    const {t} = useTranslation();
    return (
      <>
        <p>
          <span>{t('app.generics.method')}</span>:&nbsp;
          <span>{(row.paymentMethod && t(row.paymentMethod)) || 'N/A'}</span>
        </p>
        <p>
          <span>{t('app.generics.status')}</span>:&nbsp;
          <span>{(row.paymentStatus && t(row.paymentStatus)) || 'N/A'}</span>
        </p>
      </>
    );
}