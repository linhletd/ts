import React, { useMemo, useState } from 'react';
import ComponentValidator from '../../../auth/components/Validator';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import Input from '../../../components/Form/CustomInputFormik';
import Alert from '../../../components/Modal/Alert';
import { callPost } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import ButtonLoading from '../../../components/Button/ButtonLoading';
import { queryCache } from 'react-query';

export default (props) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ show: false });
  const [isSubmitting, setSubmitting] = useState(false);

  const ImportForm = () => {
    const schema = useMemo(() => {
      return yup.object({
        sheetId: yup.string().required(t('form.validate.deal.gsheet')),
        sheetName: yup.string().required(t('form.validate.deal.gsheet.name')),
      });
    }, []);
    async function handleSubmit(values) {
      handleClose();
      setSubmitting(true);
      const { data, code } = await callPost(`${APIProvider.getUrl('DEAL_IMPORT_GSHEET')}?sheetId=${values.sheetId}&sheetName=${values.sheetName}`);
      setSubmitting(false);
      if (code === 200 || code === 202) {
        queryCache.invalidateQueries('DEAL_FILTER');
        return alertResult();
      }
      alertResult(data.message || t('app.generics.update.fail'));
    }
    return (
      <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={{ sheetId: '', sheetName: '' }}>
        {(formik) => {
          return (
            <Form>
              <div className="col">
                <div>
                  <Input field="sheetId" label={t('page.deal.action.importGsheet.sheetId')} formik={formik} />
                </div>
                <div>
                  <Input field="sheetName" label={t('page.deal.action.importGsheet.sheetName')} formik={formik} />
                </div>
                <button className="btn btn-primary" type="submit" onClick={formik.handleSubmit}>
                  {t('app.generics.submit')}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  function handleClick() {
    setAlert({
      show: true,
      content: <ImportForm />,
      backdrop: 'static',
      feetless: true,
    });
  }
  function alertResult(error) {
    setAlert({
      show: true,
      content: error ? <p className="text-danger">{error}</p> : <p>{t('app.generics.update.complete')}</p>,
    });
  }
  function handleClose() {
    setAlert({ show: false });
  }
  return (
    <ComponentValidator allowedAuthorities={['canListAllDeal']} authorityKey="permissions">
      <ButtonLoading onClick={handleClick} loading={isSubmitting} {...props}>
        {t('page.deal.action.importGsheet')}
      </ButtonLoading>
      <Alert handleClose={handleClose} title={t('page.deal.action.importGsheet')} {...alert} />
    </ComponentValidator>
  );
};
