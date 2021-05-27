import React from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import Table from 'react-bootstrap/Table';
import UserNameFromId from './UserNameFromId';
import Avatar from './Avatar';
import { AllCheckBox, CheckBox1 } from './CheckBox';
import DataOverlay from './DataOverlay';
import Timestamp from './Timestamp';
import ErrorBoundary from 'src/components/generic/ErrorBoundary';

function Td(props) {
  return (
    <td>
      <ErrorBoundary>{props.children || ''}</ErrorBoundary>
    </td>
  );
}
function Group(props) {
  return props.children;
}

export default function DataTable({ ...props }) {
  let { checkedList, startNo, totalElements } = props;
  console.debug(`DataTable - columns: ${JSON.stringify(props.columns)}`);
  const { t } = useTranslation();
  let hasCheck = !!props.columns.find((elem) => elem.type === 'check');
  return (
    <ErrorBoundary hasBigSizeMessage>
      {typeof totalElements === 'number' && (
        <div className="float-right mb-3 mt-3" style={{ fontSize: '20px' }}>
          {t('page.deal.filter.field.numberOfData')}&nbsp; <strong>{totalElements} </strong>
        </div>
      )}
      <Table striped bordered hover style={{ fontSize: 14 }}>
        <thead>
          <tr>
            {!hasCheck && <th>{t('app.generics.no')}</th>}
            {props.columns.map((column, index) => {
              if (column.type === 'checkable') {
                return (
                  <th key={index}>
                    <AllCheckBox handleCheck={column.handleCheck} data={props.data} checkedList={checkedList} />
                    &nbsp;
                    {column.text}
                  </th>
                );
              }
              if (column.type === 'check') {
                return (
                  <Group key={index}>
                    <th>
                      <AllCheckBox handleCheck={column.handleCheck} data={props.data} checkedList={checkedList} />
                      {column.text}
                    </th>
                    <th>{t('app.generics.no')}</th>
                  </Group>
                );
              }
              return <th key={index}>{column.text}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {props.data &&
            props.data.map((row, index) => {
              return (
                <tr key={row.id}>
                  {!hasCheck && <Td>{(startNo || 0) + index + 1}</Td>}
                  {props.columns.map((column, columnIndex) => {
                    console.debug(`DataTable - column: ${column.dataField}, field: ${row[column.dataField]}, row: ${JSON.stringify(row)}`);
                    let key = index + '-' + columnIndex;
                    if (column.dataField === 'createdBy' || column.dataField === 'updatedBy') {
                      return (
                        <Td key={key}>
                          <UserNameFromId userId={row[column.dataField]} />
                        </Td>
                      );
                    }
                    if (column.type === 'boolean') {
                      if (column.nestedField)
                        return (
                          <Td key={key}>
                            <Switch checked={row[column.dataField][column.nestedField]} onChange={(value) => console.debug(`DataTable - switch - value: ${value}`)} onColor={'#3374ff'} disabled />
                          </Td>
                        );
                      return (
                        <Td key={key}>
                          <Switch checked={row[column.dataField]} onChange={(value) => console.debug(`DataTable - switch - value: ${value}`)} onColor={'#3374ff'} disabled />
                        </Td>
                      );
                    }
                    if (column.type === 'check') {
                      return (
                        <Group key={key}>
                          <Td>
                            <CheckBox1 row={row} handleCheck={column.handleCheck} checkedList={checkedList} />
                          </Td>
                          <Td>{(startNo || 0) + index + 1}</Td>
                        </Group>
                      );
                    }
                    if (column.type === 'checkable') {
                      return (
                        <Td key={key}>
                          <CheckBox1 row={row} handleCheck={column.handleCheck} checkedList={checkedList} />
                        </Td>
                      );
                    }
                    if (column.type === 'custome') {
                      let props = column.props || {};
                      return <Td key={key}>{typeof column.Content === 'function' ? <column.Content row={row} {...props} /> : column.Content}</Td>;
                    }
                    if (column.type === 'image') {
                      return (
                        <Td key={key}>
                          <Avatar link={row[column.dataField]} alt="" />
                        </Td>
                      );
                    }
                    if (column.type === 'timestamp' || column.dataField ==='createdAt' || column.dataField ==='updatedAt') {
                      return (
                        <Td key={key}>
                          <Timestamp timestamp={row[column.dataField]} />
                        </Td>
                      );
                    }
                    return (
                      <Td key={key}>
                        <DataOverlay textContent={column.nestedField ? row[column.dataField] && row[column.dataField][column.nestedField] : row[column.dataField]} title={column.text} maxTextLength={50} />
                      </Td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </ErrorBoundary>
  );
}
