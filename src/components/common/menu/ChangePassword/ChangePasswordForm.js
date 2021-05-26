import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import Input from '../../../components/Form/Input';
import { callPut } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import ChangePasswordValidationSchema from './ChangePasswordValidateSchema';

export default function ChangePasswordForm({ setMessage }) {
  let { t } = useTranslation();
  async function onSubmitHandler(values, actions) {
    if (values.old_password === values.new_password) {
      actions.setFieldError('new_password', 'Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }
    let { code } = await callPut(APIProvider.getUrl('USER_CHANGE_PASSWORD'), values);
    if (code === 200) {
      setMessage({
        show: false,
        content: '',
      });
    } else if (code === 400) {
      actions.setFieldError('old_password', 'Mật khẩu hiện tại không đúng');
    }
  }
  return (
    <Formik enableReinitialize initialValues={{ old_password: '', new_password: '' }} validationSchema={ChangePasswordValidationSchema} onSubmit={onSubmitHandler}>
      {(formik, isSubmitting, handleSubmit) => (
        <Form className=".was-validated">
          <Input
            field="old_password"
            label={t('components.rightbarlinks.changePassword.old')}
            placeholder={t('components.rightbarlinks.changePassword.old.placeholder')}
            isValid={formik.touched.old_password && formik.errors.old_password}
            type="password"
          />
          <Input
            field="new_password"
            label={t('components.rightbarlinks.changePassword.new')}
            placeholder={t('components.rightbarlinks.changePassword.new.placeholder')}
            isValid={formik.touched.new_password && formik.errors.new_password}
            type="password"
          />
          <div className="form-group">
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} icon="paper-plane">
              {t('app.generics.save')}
            </Button>
            <Button
              onClick={() => {
                setMessage({ show: false, content: '' });
              }}
              style={{ marginLeft: '10px' }}
              variant="secondary"
            >
              {t('app.generics.cancel')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
