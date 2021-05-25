import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import SaveButton from '../../components/Button/SaveButton';

import { usePaginatedGet } from '../../hooks/useRequest';
import Pagination from 'react-js-pagination';
import APIProvider from '../../util/api/url/APIProvider';
import DataTable from '../../components/Table/DataTable';
import RouteQueryValidator from './RouteQueryParamsValidator';
import { Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import Input from '../../components/Form/CustomInputFormik';

let defaultParams = { page: 1, size: 10, sort: 'createdAt,desc', filter: Symbol('not-required') };
export default function PermissionCheck(props) {
  return <RouteQueryValidator Component={_PermissionCheck} defaultParams={defaultParams} {...props} />;
}

function _PermissionCheck({ checkedList = [], handleCheck, ...rest }) {
  const { t } = useTranslation();
  let history = useHistory();
  let location = useLocation();
  let query = new URLSearchParams(location.search);
  let page = Number(query.get('page'));
  let size = Number(query.get('size'));
  let sort = query.get('sort');
  let params = { sort, size };

  let initFormData = useMemo(() => {
    let init = { name: '', code: '' };
    if (!query.has('filter')) {
      return init;
    } else {
      let arr = query.get('filter').split(';');
      arr.map((cur) => {
        let test = cur.match(/^(.+)=="\*(.+)\*"$/);
        if (test && test.length === 3 && (test[1] === 'name' || test[1] === 'code')) {
          init[test[1]] = test[2];
        }
      });
      return init;
    }
  }, [query.get('filter')]);

  if (query.has('filter') && (initFormData.name || initFormData.code)) {
    params.filter = query.get('filter');
  }
  const { resolvedData, status } = usePaginatedGet(['GET_CHECK_PERMISSION_LIST', { params }], page, APIProvider.getUrl('PERMISSION_LIST'), params);

  if (query.has('filter') && !initFormData.name && !initFormData.code) {
    query.delete('filter');
    return <Redirect to={`${location.pathname}?${query.toString()}`} />;
  }
  if (resolvedData && resolvedData.totalPages > 1 && resolvedData.totalPages < page) {
    query.set('page', resolvedData.totalPages);
    return <Redirect to={`${location.pathname}?${query.toString()}`} />;
  }
  function handleSubmitFilter(values) {
    if (values && Object.keys(values).length !== 0) {
      let filterParams = '';
      Object.keys(values).map((key) => {
        if (values[key] === '') {
          return;
        }
        filterParams += `${key}=="*${values[key]}*";`;
      });
      filterParams ? query.set('filter', filterParams.slice(0, filterParams.length - 1)) : query.delete('filter');
    }
    if (query.has('filter') && page > 1) {
      query.set('page', 1);
    }
    history.push(`${location.pathname}?${query.toString()}`);
  }

  function handlePageChange(pageNumber) {
    query.set('page', pageNumber);
    history.push(`${location.pathname}?${query.toString()}`);
  }
  let permissions = resolvedData?.content || [];
  const columns = [
    {
      dataField: 'name',
      text: t('page.permission.list.column.name'),
    },
    {
      dataField: 'code',
      text: t('page.permission.list.column.code'),
    },
    {
      dataField: 'uri',
      text: t('page.permission.list.column.uri'),
    },
    {
      dataField: 'method',
      text: t('page.permission.list.column.method'),
    },
    {
      type: 'checkable',
      text: t('page.role.permission.list.column.isActive'),
      handleCheck,
    },
  ];
  return (
    <>
      <Filter onSubmitHandler={handleSubmitFilter} initData={initFormData} curPage={page} query={query} />
      {status === 'success' && (
        <>
          <DataTable columns={columns} data={permissions} noButton={true} checkedList={checkedList} startNo={resolvedData.number * resolvedData.size} totalElements={resolvedData.totalElements} />
          <div className="row align-items-start justify-content-between px-3">
            <Pagination
              activePage={resolvedData.number + 1}
              itemsCountPerPage={resolvedData.size}
              totalItemsCount={resolvedData.totalElements}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
            <SaveButton {...rest} />
          </div>
        </>
      )}
    </>
  );
}

function Filter({ onSubmitHandler, initData, curPage, query }) {
  let history = useHistory();
  let location = useLocation();
  const { t } = useTranslation();
  return (
    <Formik initialValues={initData} enableReinitialize onSubmit={onSubmitHandler}>
      {(formik) => {
        function handleReset() {
          formik.setValues({ name: '', code: '' });
          query.delete('filter');
          if (curPage > 1) {
            query.set('page', 1);
          }
          history.push(`${location.pathname}?${query.toString()}`);
        }
        return (
          <Form>
            <div className="row over-sticky mb-3">
              <div className="col-3">
                <Input field="name" formik={formik} placeholder={t('page.permission.filter.name')} />
              </div>
              <div className="col-3">
                <Input field="code" formik={formik} placeholder={t('page.permission.filter.code')} />
              </div>
              <div className="row mx-3 align-items-start">
                <Button className="mr-2" type="submit" onClick={formik.handeSubmit}>
                  {t('app.generics.search')}
                </Button>
                <Button type="submit" onClick={handleReset}>
                  <i className="fas fa-redo-alt"></i>
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
