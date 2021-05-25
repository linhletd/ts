import React, { useState } from 'react';

import { Form, Formik } from 'formik';

import BlueSwitch from '../Form/BlueSwitch';
import { callPut, callUpload } from '../../hooks/useRequest';
import APIProvider from '../../util/api/url/APIProvider';
import Alert from '../Modal/Alert';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

export default function UserStatus({ row }) {
  const [{ message, show, buttonList }, setMessage] = useState({ message: '', show: false, buttonList: null }); //page.user.edit.dialog.text
  const { t } = useTranslation();

  if (row) {
    row.password = '';
  }
  Object.keys(row).map((key) => {
    if (row[key] === null) {
      row[key] = ''; //yup type error neu gia tri bang null
    }
    if (key === 'is_active') {
      row['isActive'] = row['is_active'];
      delete row['is_active'];
    }
  });
  const onSubmitHandler = async (values, actions) => {
    actions.setSubmitting(true);
    let url = '';
    if (values.avatar && typeof values.avatar === 'object') {
      console.debug(`UserEdit - avatar: ${values.avatar}`);
      let { data, code } = await callUpload(APIProvider.getUrl('UPLOAD', null), values.avatar);
      if (code === 200) {
        url = data;
      } else {
        return setMessage({
          message: (
            <>
              {t('page.user.edit.dialog.upload.error.text')}
              <p style={{ color: 'red' }}>{data.message}</p>
            </>
          ),
          show: true,
        });
      }
      console.debug(`UserEdit - upload url: ${url}`);
    }
    values.avatar = url;
    let vals = {};
    Object.keys(values).map((cur) => {
      if (!/^\s*$/.test(values[cur])) {
        vals[cur] = values[cur];
      }
    });
    !values.quote ? (vals.quote = 0) : (vals.quote = parseInt(values.quote));
    const { code, data } = await callPut(`${APIProvider.getUrl('USER_ITEM')}?id=${row.id}`, vals);
    console.debug(`UserEdit - code: ${JSON.stringify(code)}`);
    if (code === 200) {
      actions.setSubmitting(false);

      return setMessage({ message: t('page.user.edit.dialog.text'), show: true });
    }
    setMessage({
      message: (
        <>
          {t('page.user.edit.dialog.error.text')}
          <p style={{ color: 'red' }}>{data.message}</p>
        </>
      ),
      show: true,
    });
  };
  return (
    <div>
      <Formik enableReinitialize initialValues={row} onSubmit={onSubmitHandler}>
        {(formik) => {
          const handleClose = () => {
            setMessage({ message: '', show: false });

            formik.setFieldValue('isActive', formik.values.isActive);
          };

          const handleChangeStatus = (field, value) => {
            formik.setFieldValue(field, value);
            let buttons = (
              <>
                <Button variant="primary" onClick={formik.handleSubmit}>
                  {t('app.generics.save')}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  {t('app.generics.cancel')}
                </Button>
              </>
            );
            setMessage({ message: t('page.user.edit.status.confirm'), show: true, buttonList: buttons });
          };
          return (
            <Form className=".was-validated" onSubmit={formik.handleSubmit}>
              <BlueSwitch setFieldValue={formik.setFieldValue} value={formik.values.isActive} onHandleChange={handleChangeStatus} />
              <Alert show={show} handleClose={handleClose} title={t('app.generics.warning')} content={message} buttonList={buttonList} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
