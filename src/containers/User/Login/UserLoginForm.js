import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonLoading from 'src/components/common/button/ButtonLoading';
import UserLoginFormValidationSchema from './UserLoginFormValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'src/components/common/form/Input';
import { useForm } from "react-hook-form";

export default function UserLoginForm({onSubmitHandler}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(UserLoginFormValidationSchema),
    mode: "onBlur"
  });

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='col p-3'>
      <div className='mb-3'>
        <Input errors = {errors} label={t('page.login.text.username')} {...register("username")} />
      </div>
      <div className='mb-3'>
        <Input type='password' errors = {errors} label={t('page.login.text.password')} {...register("password")} />
      </div>
      <ButtonLoading loading={isSubmitting} type='submit'>{t('page.login.text.login')}</ButtonLoading>
    </form>
  );
}
