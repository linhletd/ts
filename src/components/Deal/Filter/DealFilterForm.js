import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Formik } from 'formik';

import ButtonLoading from '../../../components/Button/ButtonLoading';
import { Button } from 'react-bootstrap';

import Select from '../../../components/Form/ReactSelectFormik';
import DatePicker from '../../../components/Form/DatePickerFormik';
import Input from '../../../components/Form/CustomInputFormik';
import AsyncMultiSelect from '../../Common/AsyncSearchSelect/AsyncMultiSelect';
import PhoneInput from '../../../components/Form/PhoneInput';
import NumberInput from '../../../components/Form/NumberInputFormik';
import { callPost, useGet } from '../../../hooks/useRequest';
import Constants from '../../../util/Constants';
import APIProvider from '../../../util/api/url/APIProvider';
import useDealFilterValidation from './DealFilterValidation';
import ButtonRefreshData from '../../../components/Button/ButtonRefreshData';
// import UploadFile from '../../Common/UploadFile';
import DealDownload from '../../Common/DownloadByFilter';
import ContactListAction from '../Action/ContactListAction';
import AssignDataButton from '../Action/DataAssign';
import AutoDataAssignConfig from '../Action/AutoDataAssignConfig';
import ButtonCreate from '../../../components/Button/ButtonCreate';
import BrowserProvider from '../../../util/browser/BrowserProvider';
import FilterShortCutSlide from './FilterShorcutSlide';
import MultiSelectSearch from '../../Common/AsyncSearchSelect/SearchMultiAsyncSelect';
import MultiSelect from '../../Common/AsyncSearchSelect/MultiSelect';
import AsyncSelect from '../../Common/AsyncSearchSelect/AsyncSelect_Alt';

import ImportAssign from '../Action/ImportAssign';
import AutoDataAssign from '../Action/AutoDataAssign';
import ImportGoogleSheet from '../Action/ImportGoogleSheet';
import ErrorBoundary from '../../Fallback/ErrorBoundary';
import { queryCache } from 'react-query';
function getStageLabel(stage) {
  return `${stage.description} - ${stage.level}`;
}

export default function DealFilterForm({ data, setFilterData, handleKeyReload, filterToPayload, listChecked }) {
  const { t } = useTranslation();
  const DealFilterValidation = useDealFilterValidation();
  let [resetIdx, resetSlideColor] = useState();
  let { data: stages = [] } = useGet('DEFAULT_DEAL_STAGE', APIProvider.getUrl('DEAL_LIST_STAGE_DEFAULT'), { params: { type: 'FOR_DEAL' } });

  // let userListOption = [{ value: true, label: t('page.deal.filter.option.noOwner.placeHolder') }, ...userList];

  let levelOptions = useMemo(() => {
    return stages
      .filter((cur) => /^L\d$/.test(cur.level))
      .sort((a, b) => Number(a.level[1]) - Number(b.level[1]))
      .map((cur) => {
        return {
          value: cur.level,
          label: cur.name,
        };
      });
  }, [stages]);
  function addlabel(arr, translate) {
    return arr.map((value) => {
      let label = translate ? t(value) : value;
      return { value, label };
    });
  }
  function requestDownload(filterData) {
    return callPost(APIProvider.getUrl('DEAL_EXPORT_FILE'), filterData || {});
  }

  const onSubmitHandler = (values) => {
    setFilterData(values);
  };

  const handleReset = (formik) => {
    formik.resetForm();
    resetSlideColor(Date.now());
    setFilterData({});
  };

  return (
    <div className="over-sticky">
      <Formik enableReinitialize initialValues={data} onSubmit={onSubmitHandler} validationSchema={DealFilterValidation}>
        {(formik) => {
          let { level, timeType } = formik.values;
          let stageOptions = useMemo(() => {
            return stages
              .filter((cur) => {
                return cur.level && cur.level.startsWith(level + '.');
              })
              .sort((a, b) => Number(a.level[3]) - Number(b.level[3]))
              .map((cur) => {
                return {
                  value: cur.id,
                  label: getStageLabel(cur),
                };
              });
          }, [level, stages]);
          function handleChangeTimeType(field, value) {
            if (!value) {
              return formik.setValues({ ...formik.values, timeType: '', startTime: '', endTime: '' });
            }
            formik.setFieldValue(field, value);
          }
          function handleChangelevel(field, value) {
            if (!value) {
              return formik.setValues({ ...formik.values, level: '', stage: '' });
            }
            formik.setFieldValue(field, value);
          }
          let filterData = filterToPayload(formik.values);
          return (
            <div className="col">
              <div className="row">
                <Form className=".was-validated col-12">
                  <div className="row mb-3">
                    <div className="col-3">
                      <Select
                        field="timeType"
                        formik={formik}
                        options={addlabel(Constants.PAGES.CONTACT_DEAL.TIME_TYPE, true)}
                        handleChange={handleChangeTimeType}
                        placeholder={t('page.deal.filter.field.dateKind.placeHolder')}
                      />
                    </div>
                    <div className="col-3">
                      <DatePicker field="startTime" formik={formik} placeholderText={t('page.deal.filter.field.startDate.placeHolder')} disabled={!timeType} timeOfDay="start" />
                    </div>
                    <div className="col-3">
                      <DatePicker field="endTime" formik={formik} placeholderText={t('page.deal.filter.field.endDate.placeHolder')} disabled={!timeType} timeOfDay="end" />
                    </div>
                    <div className="col-3">
                      <PhoneInput field="phone" formik={formik} placeholder={t('page.deal.filter.field.phoneNumber.placeHolder')} />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3">
                      <AsyncSelect
                        field="owner"
                        formik={formik}
                        apiKey="DEPARTMENT_TYPE_LIST_USER"
                        supplimentOptions={[{ value: true, label: t('page.deal.filter.option.noOwner.placeHolder') }]}
                        labelField="userName"
                        query={{ type: 'SALE' }}
                        placeholder={t('page.ticket.filter.owner.placeholder')}
                      />
                    </div>
                    <div className="col-3">
                      <AsyncMultiSelect
                        field="departments"
                        formik={formik}
                        apiKey={'DEPARTMENT_FIND_BY_TYPE'}
                        placeholder={t('page.contact.assignData.departments.placeholder')}
                        query={{ type: 'SALE' }}
                      />
                    </div>
                    <div className="col-3">
                      <AsyncMultiSelect
                        field="campaignsGroup"
                        formik={formik}
                        query={{ type: 'CAMPAIGN_GROUP' }}
                        apiKey={'CONFIG_TYPE'}
                        labelField="configKey"
                        placeholder={t('page.contact.assignData.campaignGroup.placeholder')}
                      />
                    </div>
                    <div className="col-3">
                      <MultiSelectSearch field="campaigns" formik={formik} placeholder={t('page.contact.assignData.campaign.placeholder')} apiKey={'CAMPAIGN_LIST'} />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3">
                      <Select
                        field="hasAccount"
                        formik={formik}
                        options={[
                          { value: true, label: t('page.deal.filter.option.label.hasAccount') },
                          { value: false, label: t('page.deal.filter.option.label.hasNoAccount') },
                        ]}
                        placeholder={t('page.deal.filter.field.trial.placeHolder')}
                      />
                    </div>
                    <div className="col-3">
                      <NumberInput field="learnDateFrom" formik={formik} placeholder={t('page.deal.filter.field.dayFrom.placeHolder')} min={0} />
                    </div>
                    <div className="col-3">
                      <NumberInput field="learnDateTo" formik={formik} placeholder={t('page.deal.filter.field.dayTo.placeHolder')} min={0} />
                    </div>
                    <div className="col-3">
                      <Input field="account" formik={formik} placeholder={t('page.deal.filter.field.accountName.placeHolder')} />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3">
                      <Select field="status" formik={formik} options={addlabel(Constants.PAGES.CONTACT_DEAL.DEAL_STATUS)} placeholder={t('page.deal.filter.field.status.placeHolder')} />
                    </div>
                    <div className="col-3">
                      <Select field="level" formik={formik} options={levelOptions} handleChange={handleChangelevel} placeholder={t('page.deal.filter.field.stage.placeHolder')} />
                    </div>
                    <div className="col-3">
                      <MultiSelect field="stage" formik={formik} options={stageOptions} placeholder={t('page.deal.detail.accountState.reason.placeHolder')} />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3">
                      <Select
                        field="paymentMethod"
                        formik={formik}
                        options={addlabel(Constants.PAGES.CONTACT_DEAL.PAYMENT_METHOD, true)}
                        placeholder={t('page.deal.filter.field.paymentMethod.placeHolder')}
                      />
                    </div>
                    <div className="col-3">
                      <Select
                        field="paymentStatus"
                        formik={formik}
                        options={addlabel(Constants.PAGES.CONTACT_DEAL.PAYMENT_STATUS, true)}
                        placeholder={t('page.deal.filter.field.paymentStatus.placeHolder')}
                      />
                    </div>
                  </div>
                  <div className="row justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                    <div className="d-flex mb-sm-3">
                      <ButtonLoading
                        className="btn-space mr-2"
                        type="submit"
                        loading={false}
                        onClick={(...args) => {
                          queryCache.invalidateQueries('DEAL_FILTER');
                          resetSlideColor(Date.now());
                          formik.handleSubmit(...args);
                        }}
                        icon="paper-plane"
                      >
                        {t('page.sms.filter.button')}
                      </ButtonLoading>
                      <Button className="mr-2" onClick={() => handleReset(formik)}>
                        <i className="fas fa-redo-alt"></i>
                      </Button>
                      <div className="">
                        <ButtonRefreshData handleReload={handleKeyReload} />
                      </div>
                    </div>

                    <div className="">
                      {/* <UploadFile keyApi="DEAL_IMPORT_FILE" title={t('page.contact.upload.text')} handleReload={handleKeyReload} templateFile="upload_deal.xlsx" /> */}
                      <ImportGoogleSheet className="mr-2" />
                      <DealDownload
                        requestDownload={() => {
                          return requestDownload(filterData);
                        }}
                      />
                      <ContactListAction listChecked={listChecked} filterData={filterData} handleReload={handleKeyReload} />
                      <AssignDataButton listChecked={listChecked} handleReload={handleKeyReload} />
                      <AutoDataAssignConfig handleReload={handleKeyReload} />
                      <ButtonCreate moduleCreate={BrowserProvider.getUrl('DEAL_CREATE')} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="col-sm-10 col-md-7 mt-3">
                      <FilterShortCutSlide stages={stages} setFilter={formik.setValues} getStageLabel={getStageLabel} filterToPayload={filterToPayload} resetIdx={resetIdx} />
                    </div>
                    <div className="row mt-3">
                      <ImportAssign handleReload={handleKeyReload} templateFile="upload_user_assign.xlsx" />
                      <ErrorBoundary>
                        <AutoDataAssign className="mr-2" handleKeyReload={handleKeyReload} />
                      </ErrorBoundary>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}
