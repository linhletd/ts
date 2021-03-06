import React, { useMemo, useState } from 'react';

import DealListPaginatedItems from './DealListPaginatedItems';
import DealFilterForm from '../Filter/DealFilterForm';
import RouteQueryValidator from 'src/components/generic/RouteQueryParamsValidator';
import ErrorBoundary from 'src/components/generic/ErrorBoundary';
import {mutate} from 'swr'

export default function DealList() {
  return <RouteQueryValidator Component={_DealList} />;
}
function _DealList() {

  const [filterData, setFilterData] = useState({})
  const [checkedList, setListChecked] = useState([]);
  const handleReload = () => {
    //more logic here
    mutate('DEAL_LIST')
  };
  let vals = useMemo(() => {
    return filterToPayload(filterData);
  }, [filterData]);
  return (
    <div className='col'>
      <ErrorBoundary>
        <DealFilterForm filterToPayload={filterToPayload} setFilterData={setFilterData} listChecked={checkedList} handleKeyReload={handleReload} />
      </ErrorBoundary>
      <DealListPaginatedItems filterData={vals} checkedList={checkedList} setListChecked={setListChecked} />
    </div>
  );
}

function filterToPayload(filterData) {
  const getArray = (arr) => {
    return arr.reduce((list, cur) => {
      return list.concat(cur.value);
    }, []);
  };
  let { timeType, learnDateFrom, learnDateTo, ...rest } = filterData;
  let vals:any= {};
  Object.keys(rest).map((cur) => {
    if (rest[cur] instanceof Array) {
      rest[cur].length && (vals[cur] = getArray(rest[cur]));
    }
    else if (rest[cur]) {
      vals[cur] = rest[cur]?.value || rest[cur]?.value;
    }
  });
  if (vals.owner) {
    if (typeof vals.owner === 'boolean') {
      vals.noOwner = true;
      delete vals.owner;
    } else {
      vals.owner = [vals.owner];
      delete vals.noOwner;
    }
  }
  if (vals.stage) {
    delete vals.level;
  }
  if (vals.startTime || vals.endTime) {
    vals.timeType = timeType;
  }
  if (learnDateFrom) {
    vals.learnDateFrom = Number(learnDateFrom);
  }
  if (learnDateTo) {
    vals.learnDateTo = Number(learnDateTo);
  }
  return vals;
}
