import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonLoading from 'src/components/common/button/ButtonLoading';
import UserLoginFormValidationSchema from './UserLoginFormValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'src/components/common/form/Input';
import { useForm } from "react-hook-form";

export default function UserLoginForm() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(UserLoginFormValidationSchema),
    mode: "onBlur"
  });
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mr-3'>
        <Input errors = {errors} label={t('page.login.text.username')} {...register("userName")} />
      </div>
      <div className='mr-3'>
        <Input type='password' errors = {errors} label={t('page.login.text.password')} {...register("password")} />
      </div>
      <ButtonLoading loading={isSubmitting}>{t('page.login.text.login')}</ButtonLoading>
    </form>
  );
}
