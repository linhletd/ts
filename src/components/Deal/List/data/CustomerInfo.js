import React from 'react';
import { useTranslation } from 'react-i18next';
import BrowserProvider from 'src/util/browser/BrowserProvider';
import APIProvider from 'src/util/api/url/APIProvider';

import useSWR from 'swr';

const style = { lineHeight: 1.2 };

export default function CustomerInfo({ row }) {
  const { t } = useTranslation();
  let { data, error } = useSWR(['CONTACT_LIST_CHILD', row.contact.id], APIProvider.getUrl('CONTACT_LIST_CHILD'), {
    params: {
      contactId: row.contact.id,
    },
  });

  if(!data){
    return error ? t('error') + '!' : 'loading...'
  }

  return (
    <>
      <div className="float-left col-10">
        <div>
          &nbsp;
          {t('page.contact.customer.text.name')}: { row.name}&nbsp;
        </div>
        <p>
          {t('page.contact.customer.text.phone')} :
          <a className="p-1" href={BrowserProvider.getUrl('DEAL_EDIT', [{ value: row.id }])} target="_blank">
            <strong> {row.phone}</strong>
          </a>
        </p>

        <small style={style}>
          <p>
            {t('page.contact.customer.text.address')} : {row.address}
          </p>
          <p>
            {t('page.contact.customer.text.userName')} :&nbsp;
            {row.email || 'N/A'}
          </p>
          <p>
            {t('page.contact.customer.text.class')} {data?.length ? data.map(cur=> cur.studentClass).join('; ').slice(50) + '...': error ? t('error') + '!' : 'loading...' || 'N/A'}
          </p>
        </small>
      </div>
    </>
  );
}
