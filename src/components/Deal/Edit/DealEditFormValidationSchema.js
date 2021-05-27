import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useDealEditFormValidationSchema() {
  const { t } = useTranslation();
  return useMemo(() => {
    return yup.object({
      fullName: yup.string().required(t('form.validate.deal.fullName')),
      phone: yup
        .string()
        .required(t('form.validate.deal.phone.m1'))
        .test('len1', t('form.validate.deal.phone.m2'), (val) => {
          if (!val) {
            return true;
          }
          return (!val.startsWith('2') && val.length === 9) || (val.startsWith('2') && val.length === 10);
        }),
      campaign: yup.string().required(t('form.validate.deal.campaign')),
    });
  }, []);
}

export function useDataAssignValidationSchema() {
  let { t } = useTranslation();
  return useMemo(() => {
    return yup.object({
      assignUsers: yup
        .array()
        .typeError(t('form.validate.deal.assignUsers.m1'))
        .required(t('form.validate.deal.assignUsers.m1'))
        .test('arrtest', t('form.validate.deal.assignUsers.m2'), (arr) => {
          return (
            !!arr &&
            !!arr.length &&
            arr.every((elem) => {
              return elem.verified;
            })
          );
        }),
      timeType: yup.string().required(t('form.validate.deal.timeType')),
      // campaignsGroup: yup.string().required('Nhóm chiến dịch là bắt buộc'),
      startTime: yup.number().default(0).required(t('form.validate.deal.startTime')),
      endTime: yup.number().required(t('form.validate.deal.endTime.m1')).moreThan(yup.ref('startTime'), t('form.validate.deal.endTime.m2')),
      numOfObjectAssign: yup.number().required(t('form.validate.deal.numOfObjectAssign.m1')).typeError(t('form.validate.deal.numOfObjectAssign.m2')),
    });
  }, []);
}
export function useDataAssignByListSchema() {
  let { t } = useTranslation();
  return useMemo(() => {
    return yup.object({
      users: yup
        .array()
        .typeError(t('form.validate.deal.users.m1'))
        .required(t('form.validate.deal.users.m1'))
        .test('arrtest', t('form.validate.deal.users.m2'), (arr) => {
          return (
            !!arr &&
            !!arr.length &&
            arr.every((elem) => {
              return elem.verified;
            })
          );
        }),
    });
  }, []);
}
