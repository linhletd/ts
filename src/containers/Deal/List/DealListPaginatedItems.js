import React, { useState, useEffect, useMemo } from 'react';
import {useRouter} from 'next/router';
import { useTranslation } from 'react-i18next';

import Pagination from 'react-js-pagination';

import DataTable from 'src/components/common/table/DataTable';
import {createFetcher} from 'src/util/request';
import APIProvider from 'src/util/api/url/APIProvider';
import FallbackPage from 'src/components/generic/FallbackPage';
import SelectPageSize from 'src/components/generic/SelectPageSize';
import Payment from './data/Payment';
import Campaign from './data/Campaign';
import Timeline from './data/Timeline';
import CustomerInfo from './data/CustomerInfo';
import useSWR from 'swr'

//TODO: spinner all page
export default function DealListPaginatedItems({ setListChecked, checkedList, filterData }) {
  const router = useRouter();
  const { t } = useTranslation();
  let [store] = useState({ data: null });
  let query = new URLSearchParams(router.query);
  let page = Number(query.get('page'));
  let size = Number(query.get('size'));
  query.set('sort', 'createdAt,desc');

  const stableCacheKey = useMemo(()=>{
    return {page, size, filterData}
  }, [page, size, filterData]);

  let apiUrlQuery = new URLSearchParams({size, page: page -1, sort: 'createdAt,desc'});

  let { data, error } = useSWR(['DEAL_FILTER', stableCacheKey], createFetcher(`${APIProvider.getUrl('DEAL_FILTER')}?${apiUrlQuery.toString()}`, filterData, 'post'));

  useEffect(() => {
    if (checkedList && checkedList.length) {
      setListChecked([]);
    }
    if (data && data.totalPages && data.totalPages < page) {
      query.set('page', data.totalPages);
      router.replace(`${router.pathname}?${query.toString()}`, undefined, {shallow: true});
    } else if (data && !data.totalPages && page !== 1) {
      query.set('page', '1');
      router.replace(`${router.pathname}?${query.toString()}`, undefined, {shallow: true})
    }
  }, [data]);

  if (!data) {
    return <FallbackPage isLoading={!error} code={error?.code} />;
  }

  data && (store.data = data);
  data = store.data;
  const columns = [
    {
      type: 'check',
      handleCheck: setListChecked,
    },
    {
      type: 'custome',
      text: t('page.deal.list.column.contact'),
      Content: CustomerInfo,
    },
    {
      type: 'custome',
      text: t('page.deal.list.column.time'),
      Content: Timeline
    },
    {
      dataField: 'dealPackage',
      text: t('page.deal.list.column.dealPackage'),
      nestedField: 'name',
    },
    {
      type: 'custome',
      text: t('page.deal.list.column.campaign'),
      Content: Campaign
    },

    {
      dataField: 'owner',
      nestedField: 'userName',
      text: t('page.deal.list.column.owner'),
    },
    {
      type: 'timestamp',
      dataField: 'nextActivityDate',
      text: t('page.deal.list.column.nextActivityDate'),
    },
    {
      dataField: 'stage',
      text: t('page.deal.list.column.stage'),
      nestedField: 'name',
    },

    {
      type: 'custome',
      text: t('page.deal.list.column.closedLostReason'),
      Conntent({row}){return <p>{row.stage.description}</p>}
    },
    {
      dataField: 'status',
      text: t('page.deal.list.column.status'),
    },
    {
      type: 'custome',
      text: t('app.generics.payment'),
      Content: Payment
    },
  ];

  const handleChangeSize = (size) => {
    query.set('size', size);
    router.push(`${router.pathname}?${query.toString()}`, undefined, {shallow: true});
  };
  function handlePageChange(pageNumber) {
    query.set('page', pageNumber);
    router.push(`${router.pathname}?${query.toString()}`, undefined, {shallow: true});
  }
  return (
    <>
      <DataTable data={data.content} columns={columns} checkedList={checkedList} urlKey={'DEAL_EDIT'} noButton={true} startNo={data.number * data.size} totalElements={data.totalElements} />

      <div className="row justify-content-between">
        <div className="col">
          <Pagination
            activePage={data.number + 1}
            onChange={handlePageChange}
            itemsCountPerPage={data.size}
            totalItemsCount={data.totalElements || 0}
            pageRangeDisplayed={5}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>

        <div className="col-4 col-sm-3 col-md-2 justify-content-end">
            <SelectPageSize setSize={handleChangeSize} size={size} />
        </div>
      </div>
    </>
  );
}
