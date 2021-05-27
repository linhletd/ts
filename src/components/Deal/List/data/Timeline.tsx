import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export default function ContactTime({ row }) {
  const { t } = useTranslation();

  function dateTime(timestamp, hastime?) {
    if (typeof timestamp !== 'number') {
      return null;
    }
    return format(timestamp, hastime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy');
  }
  return (
    <>
        <p>
        {t('page.contact.time.createAt')}: {dateTime(row.createdAt)}
        </p>
        <p>
        {t('page.contact.time.activatedDate')}: {dateTime(row.activatedDate)}
        </p>
        <p>
        {t('page.contact.time.registeredDate')}: {dateTime(row.registeredDate)}
        </p>
        <p>
        {t('page.deal.time.ownerAssignedDate')}: {dateTime(row.assignedDate)}
        </p>
        <p>
        {t('page.deal.time.lastContacted')}: {dateTime(row.lastContacted)}
        </p>
        <p>
        {t('page.deal.detail.side.lastLearnDate')}: {dateTime(row.lastLearnDate)}
        </p>
    </>
  );
}
