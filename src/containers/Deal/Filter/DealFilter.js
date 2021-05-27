import React from 'react';
import DealFilterForm from './DealFilterForm';
export default function DealFilter({ filterData, ...rest }) {
  const initData = {
    timeType: '',
    phone: '',
    startTime: '',
    endTime: '',
    owner: '',
    departments: '',
    campaigns: '',
    campaignsGroup: '',
    hasAccount: '',
    learnDateFrom: '',
    learnDateTo: '',
    account: '',
    status: '',
    stage: '',
    level: '',
    paymentStatus: '',
    paymentMethod: '',
    ...filterData,
  };

  return (
    <>
      <DealFilterForm data={initData} {...rest} />
    </>
  );
}
