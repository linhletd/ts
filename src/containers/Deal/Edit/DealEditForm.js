import React from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Formik } from 'formik';

import useDealEditFormValidationSchema from './DealEditFormValidationSchema';
import Input from '../../../components/Form/CustomInputFormik';
import PhoneInput from '../../../components/Form/PhoneInput';
// import Select from '../../../components/Form/ReactSelectFormik';

import ButtonLoading from '../../../components/Button/ButtonLoading';
import ButtonBack from '../../../components/Button/ButtonBack';
import AsyncSelect from '../../Common/AsyncSearchSelect/AsyncSelect_Alt';
import UninitialAsyncSelect from '../../Common/AsyncSearchSelect/UninitialAsyncSelect_Alt';
import SearchAsyncSelect from '../../Common/AsyncSearchSelect/SearchAsyncSelect';
// import ContactSearch from '../../Common/ContactSelectFormik';
import { getInfo } from '../../../util/TokenProvider';
import { callPost } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import { useHasAccess } from '../../../hooks/useAuthority';
// import {callGet} from '../../../hooks/useRequest';

let style = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '20px',
  alignItems: 'start',
  marginBottom: '15px',
};
export default function DealEditForm({ data, onSubmitHandler }) {
  console.debug(`DealEditForm - data: ${JSON.stringify(data)}`);
  const { t } = useTranslation();
  const DealEditFormValidationSchema = useDealEditFormValidationSchema();
  // function addLabel(value, label) {
  //   if (value) return { label: label || value, value: value };
  // }
  let initData = {};
  ['phone', 'fullName', 'province', 'district', 'address', 'campaign'].map((cur) => {
    initData[cur] = '';
  });
  let userId = getInfo().userId;
  initData.owner = userId;
  let canListAllDeal = useHasAccess(['canListAllDeal'], 'permissions');
  let canUpdateAllDeal = useHasAccess(['canUpdateAllDeal'], 'permissions');
  let canSelectAnyCampaign = canListAllDeal && canUpdateAllDeal;

  return (
    <div>
      <Formik enableReinitialize initialValues={initData} validationSchema={DealEditFormValidationSchema} onSubmit={onSubmitHandler}>
        {(formik) => {
          async function handleChangePhone(field, phone) {
            formik.setFieldValue(field, phone);
            if (phone.length >= 9) {
              let { data, code } = await callPost(APIProvider.getUrl('CONTACT_FILTER'), { phone });
              if (code === 200 && data.content.length) {
                data = data.content[0];
                let { address, province, district, campaign } = formik.values;
                formik.setValues({
                  ...formik.values,
                  fullName: data.fullName,
                  phone: phone,
                  // contact: data.id,
                  address: address || data.address || '',
                  province: province || (data.province && data.province.id) || '',
                  district: district || (data.district && data.district.id) || '',
                  campaign: campaign || (data.campaign && data.campaign.id) || '',
                });
              }
            }
          }
          let { province } = formik.values;
          return (
            <Form className=".was-validated">
              <div style={style}>
                <PhoneInput field="phone" formik={formik} handleChange={handleChangePhone} label={t('page.deal.edit.text.phone')} placeholder={' --- '} />
                <Input field="fullName" formik={formik} label={t('page.deal.edit.text.name')} placeholder={' --- '} type="text" />
                <AsyncSelect field="province" formik={formik} apiKey={'PROVINCE_LIST'} label={t('page.deal.edit.text.province')} placeholder={' --- '} />
                <UninitialAsyncSelect
                  field="district"
                  formik={formik}
                  query={(province && { key: province, id: province }) || false}
                  apiKey={'PROVINCE_LIST_DISTRICT'}
                  label={t('page.deal.edit.text.district')}
                  placeholder={' --- '}
                />
                <Input field="address" formik={formik} label={t('page.deal.edit.text.address')} placeholder={' --- '} type="text" />
                {canSelectAnyCampaign ? (
                  <SearchAsyncSelect field="campaign" subFilter={{ isActive: true }} apiKey="CAMPAIGN_LIST" formik={formik} label={t('page.deal.edit.text.campaign')} placeholder={' --- '} />
                ) : (
                  <AsyncSelect field="campaign" apiKey="CAMPAIGN_BY_CURRENT_USER" formik={formik} label={t('page.deal.edit.text.campaign')} placeholder={' --- '} />
                )}
                <SearchAsyncSelect
                  isDisabled={!canUpdateAllDeal}
                  field="owner"
                  labelField="userName"
                  filterName="userName"
                  apiKey="USER_LIST"
                  formik={formik}
                  defaultValue={(data && { value: data.owner.id, label: data.owner.userName }) || { label: getInfo().username, value: getInfo().userId }}
                  label={t('page.deal.edit.text.owner')}
                  placeholder={' --- '}
                />
              </div>
              <div className="btn-toolbar">
                <ButtonLoading className="btn-space" type="submit" loading={formik.isSubmitting ? true : undefined} onClick={formik.handleSubmit} icon="paper-plane">
                  {t('app.generics.save')}
                </ButtonLoading>
                <ButtonBack />
                {/* <NavBack /> */}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
