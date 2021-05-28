import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import {useForm, useWatch} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {mutate} from 'swr';

import { Button } from 'react-bootstrap';
import ButtonLoading from 'src/components/common/button/ButtonLoading';
import ButtonRefreshData from 'src/components/common/button/ButtonRefreshData';

import Select from 'src/components/common/form/Select';
import DatePicker from 'src/components/common/form/DatePicker';
import Input from 'src/components/common/form/Input';
import SelectAsync from 'src/components/common/form/SelectAsync';
import SelectSearch from 'src/components/common/form/SelectSearch';
import InputPhone from 'src/components/common/form/InputPhone';
import InputNumber from 'src/components/common/form/InputNumber';
import { callPost, createFetcher } from 'src/util/request';
import Constants from 'src/util/Constants';
import APIProvider from '../../../util/api/url/APIProvider';
import useDealFilterValidation from './DealFilterValidation';
// import ButtonCreate from 'src/components/common/button/ButtonCreate';
// import DealDownload from 'src/components/generic/DownloadByFilter';
// import ContactListAction from '../Action/ContactListAction';
// import AssignDataButton from '../Action/DataAssign';
// import AutoDataAssignConfig from '../Action/AutoDataAssignConfig';
// import BrowserProvider from '../../../util/browser/BrowserProvider';
// import FilterShortCutSlide from './FilterShorcutSlide';

// import ImportAssign from '../Action/ImportAssign';
// import AutoDataAssign from '../Action/AutoDataAssign';
// import ImportGoogleSheet from '../Action/ImportGoogleSheet';
// import ErrorBoundary from 'src/components/generic/ErrorBoundary';

function getStageLabel(stage) {
  return `${stage.description} - ${stage.level}`;
}
const defaultValues = {
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
};


export default function DealFilterform({ setFilterData, handleKeyReload, filterToPayload, listChecked }) {
  const { t } = useTranslation();
  const DealFilterValidation = useDealFilterValidation();
  const [resetIdx, resetSlideColor] = useState(1);
  const { data: stages } = useSWR(['DEFAULT_DEAL_STAGE'], createFetcher(APIProvider.getUrl('DEAL_LIST_STAGE_DEFAULT'), { params: { type: 'FOR_DEAL' } }));
  
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(DealFilterValidation),
    mode: "onBlur"
  });

  let levelOptions = useMemo(() => {
    if(!stages) return [];
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
  // function requestDownload(filterData) {
  //   return callPost(APIProvider.getUrl('DEAL_EXPORT_FILE'), filterData || {});
  // }
  const onSubmitHandler = (values) => {
    setFilterData(values);
  };

  const handleReset = () => {
    reset(defaultValues);
    resetSlideColor(Date.now());
    setFilterData({});
  };


  function handleChangeTimeType(timeType) {
    if (!timeType) {
      setValue('startTime', '');
      setValue('endTime', '');
    }
  }
  function handleChangeLevel(level) {
    setValue('stage', '' );
  }

  let filterData = filterToPayload(getValues());

  return (
    <form className=".was-validated pt-3" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="row mb-3">
        <div className="col-3">
          <Select
            name="timeType"
            control={control}
            errors={errors}
            options={addlabel(Constants.PAGES.CONTACT_DEAL.TIME_TYPE, true)}
            placeholder={t('page.deal.filter.field.dateKind.placeHolder')}
          />
        </div>
        <div className="col-3">
          <IsolatedDateRender effect={handleChangeTimeType} name="startTime" control={control} errors={errors} placeholderText={t('page.deal.filter.field.startDate.placeHolder')} timeOfDay="start" />
        </div>
        <div className="col-3">
          <IsolatedDateRender effect={handleChangeTimeType} name="endTime" control={control} errors={errors} placeholderText={t('page.deal.filter.field.endDate.placeHolder')} timeOfDay="end" />
        </div>
        <div className="col-3">
          <InputPhone name="phone" control={control} errors={errors} placeholder={t('page.deal.filter.field.phoneNumber.placeHolder')} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <SelectAsync
            name="owner"
            control={control}
            errors={errors}
            apiKey="DEPARTMENT_TYPE_LIST_USER"
            supplimentOptions={[{ value: true, label: t('page.deal.filter.option.noOwner.placeHolder') }]}
            labelField="userName"
            query={{ type: 'SALE' }}
            placeholder={t('page.ticket.filter.owner.placeholder')}
          />
        </div>
        <div className="col-3">
          <SelectAsync
            isMulti
            name="departments"
            control={control}
            errors={errors}
            apiKey={'DEPARTMENT_FIND_BY_TYPE'}
            placeholder={t('page.contact.assignData.departments.placeholder')}
            query={{ type: 'SALE' }}
          />
        </div>
        <div className="col-3">
          <SelectAsync
            isMulti
            name="campaignsGroup"
            control={control}
            errors={errors}
            query={{ type: 'CAMPAIGN_GROUP' }}
            apiKey={'CONFIG_TYPE'}
            labelField="configKey"
            placeholder={t('page.contact.assignData.campaignGroup.placeholder')}
          />
        </div>
        <div className="col-3">
          <SelectSearch isMulti name="campaigns" control={control} errors={errors} placeholder={t('page.contact.assignData.campaign.placeholder')} apiKey={'CAMPAIGN_LIST'} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <Select
            name="hasAccount"
            control={control}
            errors={errors}
            options={[
              { value: true, label: t('page.deal.filter.option.label.hasAccount') },
              { value: false, label: t('page.deal.filter.option.label.hasNoAccount') },
            ]}
            placeholder={t('page.deal.filter.field.trial.placeHolder')}
          />
        </div>
        <div className="col-3">
          <InputNumber name="learnDateFrom" control={control} errors={errors} placeholder={t('page.deal.filter.field.dayFrom.placeHolder')} min={0} />
        </div>
        <div className="col-3">
          <InputNumber name="learnDateTo" control={control} errors={errors} placeholder={t('page.deal.filter.field.dayTo.placeHolder')} min={0} />
        </div>
        <div className="col-3">
          <Input {...register("account")} errors={errors} placeholder={t('page.deal.filter.field.accountName.placeHolder')} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <Select name="status" control={control} errors={errors} options={addlabel(Constants.PAGES.CONTACT_DEAL.DEAL_STATUS)} placeholder={t('page.deal.filter.field.status.placeHolder')} />
        </div>
        <div className="col-3">
          <Select name="level" control={control} errors={errors} options={levelOptions} placeholder={t('page.deal.filter.field.stage.placeHolder')} />
        </div>
        <div className="col-3">
          <IsolatedRenderStage stages={stages} effect={handleChangeLevel} isMulti name="stage" control={control} errors={errors} placeholder={t('page.deal.detail.accountState.reason.placeHolder')} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <Select
            name="paymentMethod"
            control={control}
            errors={errors}
            options={addlabel(Constants.PAGES.CONTACT_DEAL.PAYMENT_METHOD, true)}
            placeholder={t('page.deal.filter.field.paymentMethod.placeHolder')}
          />
        </div>
        <div className="col-3">
          <Select
            name="paymentStatus"
            control={control}
            errors={errors}
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
              mutate('DEAL_FILTER');
              resetSlideColor(Date.now());
            }}
            icon="paper-plane"
          >
            {t('page.sms.filter.button')}
          </ButtonLoading>
          <Button className="mr-2" onClick={() => handleReset(reset)}>
            <i className="fas fa-redo-alt"></i>
          </Button>
          <div className="">
            <ButtonRefreshData handleReload={handleKeyReload} />
          </div>
        </div>

        {/* <div className="">
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
        </div> */}
      </div>
      {/* <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="col-sm-10 col-md-7 mt-3">
          <FilterShortCutSlide stages={stages} setFilter={formik.setValues} getStageLabel={getStageLabel} filterToPayload={filterToPayload} resetIdx={resetIdx} />
        </div>
        <div className="row mt-3">
          <ImportAssign handleReload={handleKeyReload} templateFile="upload_user_assign.xlsx" />
          <ErrorBoundary>
            <AutoDataAssign className="mr-2" handleKeyReload={handleKeyReload} />
          </ErrorBoundary>
        </div>
      </div> */}
    </form>
  );
}

function IsolatedDateRender({effect, ...rest}){
  const timeType = useWatch({
    control: rest.control,
    name: 'timeType',
  })
  useEffect(()=>{
    effect(timeType);
  }, [timeType])
  
  return <DatePicker disabled={!timeType} {...rest}/>
}
function IsolatedRenderStage({stages, effect, ...rest}){
  const level = useWatch({
    control: rest.control,
    name: 'level',
  })
  
  let stageOptions = useMemo(() => {
    if(!stages || !level) return [];
    return stages
      .filter((cur) => {
        return cur.level && cur.level.startsWith(level.value + '.');
      })
      .sort((a, b) => Number(a.level[3]) - Number(b.level[3]))
      .map((cur) => {
        return {
          value: cur.id,
          label: getStageLabel(cur),
        };
      });
  }, [level, stages]);

  console.log(stageOptions)

  useEffect(()=>{
    effect(level);
  }, [level])

  return <Select options={stageOptions} disabled={!level} {...rest}/>
}