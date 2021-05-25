import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import Table from 'react-bootstrap/Table';
import UserNameFromId from '../Other/UserNameFromId';

import BrowserProvider from '../../util/browser/BrowserProvider';

import Avatar from './Avatar';
import { AllCheckBox, CheckBox1 } from './CheckBox';
import ContactTime from './ContactTime';
import ConfigProduct from './ConfigProduct';
import ConfigCampaignGroup from './ConfigCampaignGroup';
import DataOverlay from './DataOverlay';
import DeleteButton from './DeleteButton';
import DealPackage from './DealPackage';
import ListPhoneSms from '../Phone/ListPhoneSms';
import ListRowUser from './ListRowUser';
import ListDepartmentUser from './ListDepartmentUser';
import RowCampaign from './RowCampaign';
import RowCampaignGroup from './RowCampaignGroup';
import RowCallListen from './RowCallListen';
import RowCustomerInfo from './RowCustomerInfo';
import Timestamp from './Timestamp';
import TicketTypeParent from '../../pages/TicketType/Detail/TicketTypeParent';
import TicketTypeRoot from '../../pages/TicketType/Detail/TicketTypeRoot';
import OrderCode from '../../pages/Shipment/Components/OrderCode';
import OrderAddress from '../../pages/Shipment/Components/OrderAddress';
import OrderPackage from '../../pages/Shipment/Components/OrderPackage';
import OrderDate from '../../pages/Shipment/Components/OrderDate';
import OrderStatus from '../../pages/Shipment/Components/OrderStatus';
import OrderNote from '../../pages/Shipment/Components/OrderNote';
import OrderMoney from '../../pages/Shipment/Components/OrderMoney';
import OrderCustomer from '../../pages/Shipment/Components/OrderCustomer';
import PipelineByStage from '../../pages/Stage/Detail/PipelineByStage';
import LearnTime from './LearnTime';
import UserStatus from './UserStatus';
import VoucherDiscount from './VoucherDiscount';
import VoucherName from './VoucherName';
import VoucherCampaign from './VoucherCampaign';
import VoucherProduct from './VoucherProduct';
import VoucherStatus from './VoucherStatus';
import VoucherActiveCode from './VoucherActiveCode';
import '../../assets/css/TableSticky.css';
import ErrorBoundary from '../../pages/Fallback/ErrorBoundary';

function Td(props) {
  return (
    <td>
      <ErrorBoundary>{props.children}</ErrorBoundary>
    </td>
  );
}
function Group(props) {
  return props.children;
}

export default function DataTable({ ...props }) {
  let { apiKeys, handleReload, nameField, noButton, nestedColumn, checkedList, startNo, totalElements } = props;
  if (!apiKeys) apiKeys = {};
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
            {!noButton && <th></th>}
          </tr>
        </thead>
        <tbody>
          {props.data &&
            props.data.map((row, index) => {
              const id = row['id'] ? row['id'] : row['_id'];
              const userID = nestedColumn ? row['user']['id'] : id;
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
                    if (column.type === 'image') {
                      return (
                        <Td key={key}>
                          <Avatar link={row[column.dataField]} alt="" />
                        </Td>
                      );
                    }
                    if (column.type === 'timestamp') {
                      return (
                        <Td key={key}>
                          <Timestamp timestamp={row[column.dataField]} />
                        </Td>
                      );
                    }
                    if (column.type === 'callAgent') {
                      return (
                        <Td key={key}>
                          <p>{row.actor ? row.actor.id : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'callListen') {
                      return (
                        <Td key={key}>
                          <RowCallListen row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'callPhone') {
                      return (
                        <Td key={key}>
                          <p>{row.object ? row.object.id : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'callStatus') {
                      return (
                        <Td key={key}>
                          <p>{row.context ? row.context.disposition : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'callTime') {
                      return (
                        <Td key={key}>
                          <Timestamp timestamp={row.timestamp} />
                        </Td>
                      );
                    }
                    if (column.type === 'callType') {
                      return (
                        <Td key={key}>
                          <p>{row.context ? row.context.type : ''}</p>
                        </Td>
                      );
                    }

                    if (column.type === 'campaign') {
                      return (
                        <Td key={key}>
                          <RowCampaign row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'campaignName') {
                      return (
                        <Td key={key}>
                          <p>{row.campaign && row.campaign.name ? row.campaign.name : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'campaignGroup') {
                      return (
                        <Td key={key}>
                          <RowCampaignGroup row={row} deal={column.dataField} />
                        </Td>
                      );
                    }
                    if (column.type === 'configCampaignGroup') {
                      return (
                        <Td key={key}>
                          <ConfigCampaignGroup row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'contactTime') {
                      return (
                        <Td key={key}>
                          <ContactTime row={row} deal={column.dataField} />
                        </Td>
                      );
                    }
                    if (column.type === 'configProduct') {
                      return (
                        <Td key={key}>
                          <ConfigProduct id={row['configProduct']} />
                        </Td>
                      );
                    }
                    if (column.type === 'configSaleType') {
                      return (
                        <Td key={key}>
                          <ConfigProduct id={row['configSaleType']} />
                        </Td>
                      );
                    }

                    if (column.type === 'customerInfo') {
                      return (
                        <Td key={key}>
                          <RowCustomerInfo row={row} deal={column.dataField} />
                        </Td>
                      );
                    }
                    if (column.type === 'orderCustomer') {
                      return (
                        <Td style={{ width: '15%' }} key={key}>
                          <OrderCustomer row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'orderCode') {
                      return (
                        <Td key={key}>
                          <OrderCode row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'address') {
                      return (
                        <Td style={{ width: '10%' }} key={key}>
                          <OrderAddress row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'dealPackage') {
                      return (
                        <Td key={key}>
                          <OrderPackage row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'orderDate') {
                      return (
                        <Td key={key}>
                          <OrderDate row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'dealReason') {
                      return (
                        <Td key={key}>
                          <p>{row.stage.description ? row.stage.description : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'orderStatus') {
                      return (
                        <Td key={key}>
                          <OrderStatus row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'orderNote') {
                      return (
                        <Td key={key}>
                          <OrderNote row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'orderMoney') {
                      return (
                        <Td key={key}>
                          <OrderMoney row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'pipelineOfStage') {
                      return (
                        <Td key={key}>
                          <PipelineByStage id={row['id']} row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'department') {
                      return (
                        <Td key={key}>
                          <p>{row.department ? row.department.name : ''}</p>
                        </Td>
                      );
                    }

                    if (column.type === 'dealPackage') {
                      return (
                        <Td key={key}>
                          <DealPackage row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'owner') {
                      return (
                        <Td key={key}>
                          <p>{row.owner ? row.owner.userName : ''}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'createdAt') {
                      let date = new Date(row.createdAt);
                      return (
                        <Td key={key}>
                          <p>{date.toLocaleString()}</p>
                        </Td>
                      );
                    }
                    if (column.type === 'phoneNumber') {
                      return (
                        <Td key={key}>
                          <ListPhoneSms row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'voucherName') {
                      return (
                        <Td key={key}>
                          <VoucherName row={row} />{' '}
                        </Td>
                      );
                    }
                    if (column.type === 'voucherCampaign') {
                      return (
                        <Td key={key}>
                          {' '}
                          <VoucherCampaign row={row} />
                        </Td>
                      );
                    }
                    if (column.dataField === 'voucherProduct') {
                      return (
                        <Td key={key}>
                          <VoucherProduct row={row} />
                        </Td>
                      );
                    }

                    if (column.type === 'editUserDepartment') {
                      return (
                        <Td key={key}>
                          <Link role="button" className="btn btn-primary mr-2" to={BrowserProvider.getUrl('DEPARTMENT_USER_EDIT', [{ value: userID }])}>
                            {t('page.department.list.column.button.edit')}
                          </Link>
                        </Td>
                      );
                    }

                    if (column.type === 'role') {
                      return (
                        <Td key={key} style={{ width: 'auto' }}>
                          <ListRowUser id={row['id']} />
                        </Td>
                      );
                    }
                    if (column.type === 'departmentUser') {
                      return (
                        <Td key={key} style={{ width: 'auto' }}>
                          <ListDepartmentUser id={row['id']} />
                        </Td>
                      );
                    }
                    if (column.type === 'nameOfCampaign') {
                      return (
                        <Td key={key}>
                          <p>{row.name}</p>
                        </Td>
                      );
                    }

                    if (column.type === 'rootIdTicketType') {
                      return (
                        <Td key={key}>
                          <TicketTypeRoot rootId={row[column.dataField]} />
                        </Td>
                      );
                    }
                    if (column.type === 'parentIdTicketType') {
                      return (
                        <Td key={key}>
                          <TicketTypeParent parentId={row[column.dataField]} />
                        </Td>
                      );
                    }
                    if (column.dataField === 'survivePercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numDealUntreated / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.dataField === 'knmPercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numDealUntreated / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.dataField === 'survivePercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numDealUntreated / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.dataField === 'orderPercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numOrder / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.type === 'timeLearn') {
                      return (
                        <Td key={key}>
                          <LearnTime row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'custome') {
                      return <Td key={key}>{typeof column.Content === 'function' ? <column.Content row={row} {...column.props} /> : column.Content}</Td>;
                    }
                    if (column.dataField === 'discount') {
                      return (
                        <Td key={key}>
                          <VoucherDiscount row={row} />
                        </Td>
                      );
                    }
                    if (column.dataField === 'refundPercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numRefund / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.dataField === 'refundPercent') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numRefund / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.dataField === 'crmRevenue ') {
                      return (
                        <Td key={key}>
                          <p> {row.totalDeal === '0' ? '0 %' : (row.numOrder / row.totalDeal) * 100 + '%'} </p>
                        </Td>
                      );
                    }
                    if (column.type === 'status') {
                      return (
                        <Td key={key}>
                          <VoucherStatus row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'codeActive') {
                      return (
                        <Td key={key}>
                          <VoucherActiveCode row={row} />
                        </Td>
                      );
                    }
                    if (column.type === 'userStatus') {
                      return (
                        <Td key={key}>
                          <UserStatus row={row} />
                        </Td>
                      );
                    }
                    if (!row[column.dataField]) {
                      return <Td key={key}> </Td>;
                    }
                    return (
                      <Td key={key}>
                        <DataOverlay textContent={column.nestedField ? row[column.dataField][column.nestedField] : row[column.dataField]} title={column.text} maxTextLength={50} />
                      </Td>
                    );
                  })}
                  {!noButton && (
                    <Td>
                      <Link role="button" className="btn btn-primary mr-2 " to={BrowserProvider.getUrl(props.urlKey, [{ value: userID }])}>
                        {t('components.datatable.text.edit')}
                      </Link>
                      {!props.hideBtnRemove && !props.deactiveKey ? (
                        <DeleteButton className="mr-2" recordId={row['id']} apiKey={apiKeys.deleteRow} handleReload={handleReload} recordName={row[nameField]} />
                      ) : (
                        ''
                      )}
                      {props.showBtnApprove && !row['isActive'] && (
                        <a className="btn btn-success text-white mx-2" role="button" onClick={() => props.handleApproveAutoCall(row['id'])}>
                          <i className="fas fa-check pr-2" />
                          {t('components.datatable.text.approve')}
                        </a>
                      )}
                    </Td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </ErrorBoundary>
  );
}
