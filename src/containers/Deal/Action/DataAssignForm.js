import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Formik } from 'formik';

import { useDataAssignValidationSchema } from '../Edit/DealEditFormValidationSchema';
import Input from '../../../components/Form/CustomInputFormik';
import Select from '../../../components/Form/ReactSelectFormik';

import ButtonLoading from '../../../components/Button/ButtonLoading';
import AsyncMultiSelect from '../../Common/AsyncSearchSelect/AsyncMultiSelect';
import DatePicker from '../../../components/Form/DatePickerFormik';
import MutiUserChecked from '../../Common/AsyncSearchSelect/MultiUserChecked';
import { Button } from 'react-bootstrap';
import { useGet } from '../../../hooks/useRequest';
import Constants from '../../../util/Constants';
import MultiSelect from '../../Common/AsyncSearchSelect/MultiSelect';
import SearchMultiSelect from '../../Common/AsyncSearchSelect/SearchMultiAsyncSelect';
import { useCheckfilterTotal, useGetCampaignListByGroupList } from '../../Common/hooks';
import APIProvider from '../../../util/api/url/APIProvider';

export default function ContactAssignForm({ onSubmitHandler, handleClose, isProcessing, responseMessage }) {
  let { t } = useTranslation();
  let DataAssignValidationSchema = useDataAssignValidationSchema();
  let { data, status } = useGet(['DEPARTMENT_TYPE_LIST_USER', { type: 'SALE' }], APIProvider.getUrl('DEPARTMENT_TYPE_LIST_USER'), { params: { type: 'SALE' } });
  let ownerOptions = useMemo(() => {
    if (data) {
      return data.map((cur) => ({ value: cur.id, label: cur.userName, verified: true }));
    }
  });
  const [isUser, setIsUser] = useState(false);
  const handleClickIsUser = () => {
    setIsUser(!isUser);
  };
  function addLabel(value, label) {
    if (value) return { label: label || value, value: value };
  }
  let fieldOpts = {
    timeType: Constants.PAGES.CONTACT_DEAL.TIME_TYPE.map((value) => ({ value, label: t(value) })),
    priority: [t('page.contact.modal.listShare.priority.2'), t('page.contact.modal.listShare.priority.1')].map((cur) => addLabel(cur)),
  };
  let initialValues = {
    timeType: '',
    startTime: '',
    endTime: '',
    priority: '',
    campaignsGroup: '',
    campaigns: '',
    departments: '',
    numOfObjectAssign: '',
    assignUsers: '',
  };
  return (
    <div className="col">
      {responseMessage && <p className="text-danger">{responseMessage}</p>}
      <Formik enableReinitialize initialValues={initialValues} validationSchema={DataAssignValidationSchema} onSubmit={onSubmitHandler}>
        {(formik) => {
          let style = {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 23%)',
            columnGap: '1%',
            rowGap: '10px',
            alignItems: 'start',
            justifyContent: 'center',
          };
          function handleChangeTimetype(field, value) {
            if (!value) {
              formik.setValues({ ...formik.values, timeType: '', startTime: '', endTime: '' });
            } else {
              formik.setFieldValue(field, value);
            }
          }
          function handleChangeCampaignGroup(field, value) {
            formik.setValues({ ...formik.values, campaignsGroup: value, campaigns: null });
          }
          let total = useCheckfilterTotal(formik.values, APIProvider.getUrl('DEAL_FILTER'));
          let { campaignsGroup } = formik.values;
          let campaignOptionsByGroup = useGetCampaignListByGroupList(campaignsGroup);
          return (
            <Form className=".was-validated">
              <div style={style}>
                <Select field="timeType" formik={formik} handleChange={handleChangeTimetype} options={fieldOpts['timeType']} placeholder={t('page.contact.assignData.dateType.placeholder')} />
                <DatePicker field="startTime" formik={formik} placeholder={t('page.contact.assignData.startTime.placeholder')} disabled={!formik.values.timeType} timeOfDay="start" />
                <DatePicker field="endTime" formik={formik} placeholder={t('page.contact.assignData.endTime.placeholder')} disabled={!formik.values.timeType} timeOfDay="end" />
                <Select field="priority" formik={formik} options={fieldOpts['priority']} placeholder={t('page.contact.assignData.priority.placeholder')} />
                <AsyncMultiSelect
                  field="campaignsGroup"
                  formik={formik}
                  handleChange={handleChangeCampaignGroup}
                  query={{ type: 'CAMPAIGN_GROUP' }}
                  apiKey={'CONFIG_TYPE'}
                  labelField="configKey"
                  placeholder={t('page.contact.assignData.campaignGroup.placeholder')}
                />
                {campaignsGroup && campaignsGroup instanceof Array && campaignsGroup.length ? (
                  <MultiSelect
                    field="campaigns"
                    formik={formik}
                    options={campaignOptionsByGroup.campaignList}
                    placeholder={t('page.contact.assignData.campaign.placeholder')}
                    apiKey={'CAMPAIGN_BY_GROUP'}
                  />
                ) : (
                  <SearchMultiSelect field="campaigns" formik={formik} placeholder={t('page.contact.assignData.campaign.placeholder')} apiKey={'CAMPAIGN_LIST'} />
                )}
                <AsyncMultiSelect field="departments" formik={formik} apiKey={'DEPARTMENT_FIND_BY_TYPE'} placeholder={t('page.contact.assignData.departments.placeholder')} query={{ type: 'SALE' }} />
                <Input
                  field="numOfObjectAssign"
                  formik={formik}
                  placeholder={t('page.contact.assignData.numContact.placeholder')}
                  type="text"
                  isValid={formik.touched.numOfObjectAssign && formik.errors.numOfObjectAssign}
                />
                <div style={{ gridArea: '3/1/3/5' }}>
                  <div className=" row mb-3">
                    <div className="col-6">
                      <input onChange={handleClickIsUser} type="checkbox" checked={isUser} />
                      <span onClick={handleClickIsUser} className="pl-2">
                        {t('page.contact.modal.listShare.span.text')}
                      </span>
                    </div>
                    <div className="col-6">
                      {t('app.generics.total')}:<strong className="ml-2">{total}</strong>
                    </div>
                  </div>
                  {isUser ? (
                    <MultiSelect field="assignUsers" formik={formik} placeholder={status === 'success' ? t('page.contact.assignData.usersSelect.placeholder') : status} options={ownerOptions} />
                  ) : (
                    // <AsyncMultiSelectFormikPagination field="assignUsers" apiKey="USER_LIST" labelField="userName" formik={formik} placeholder={t('page.contact.assignData.usersSelect.placeholder')} />
                    <MutiUserChecked field="assignUsers" formik={formik} placeholder={t('page.contact.assignData.users.placeholder')} validatedUserList={ownerOptions} />
                  )}
                </div>
              </div>
              <div className="btn-toolbar mt-3 row justify-content-end pr-4">
                <Button onClick={handleClose} variant="secondary" className="mr-2">
                  {t('app.generics.close')}
                </Button>
                <ButtonLoading className="btn-space" type="submit" loading={isProcessing} onClick={formik.handleSubmit} icon="paper-plane" disabled={!(typeof total === 'number' && total > 0)}>
                  {t('app.generics.save')}
                </ButtonLoading>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
