import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonLoading from '../../../components/Button/ButtonLoading';
import { Form, Formik } from 'formik';

import UserLoginFormValidationSchema from './UserLoginFormValidationSchema';
import Input from '../../../components/Form/Input';

export default function UserLoginForm({ onSubmitHandler }) {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('page.login.text.login-to-system')}</h1>
      <Formik enableReinitialize initialValues={{ username: '', password: '' }} validationSchema={UserLoginFormValidationSchema} onSubmit={onSubmitHandler}>
        {(formik) => (
          <Form className=".was-validated">
            <Input
              field="username"
              label={t('page.login.text.username')}
              placeholder={t('page.login.text.username.placeholder')}
              isValid={formik.touched.username && formik.errors.username}
              type="text"
            />
            <Input
              field="password"
              label={t('page.login.text.password')}
              placeholder={t('page.login.text.password.placeholder')}
              isValid={formik.touched.password && formik.errors.password}
              type="password"
            />
            <div className="form-group">
              <ButtonLoading type="submit" loading={formik.isSubmitting} onClick={formik.handleSubmit} icon="paper-plane">
                {t('page.login.text.login')}
              </ButtonLoading>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
