import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function DealFilterValidation() {
  let { t } = useTranslation();
  return useMemo(() => {
    return yup.object({
      phone: yup.string().test('len1', t('form.validate.deal.phone.m2'), (val) => {
        if (!val) {
          return true;
        }
        return (!val.startsWith('2') && val.length === 9) || (val.startsWith('2') && val.length === 10);
      }),
      startTime: yup.number().default(0).notRequired(),
      endTime: yup.number().notRequired().moreThan(yup.ref('startTime'), t('form.validate.deal.endTime.m2')),
      learnDateFrom: yup.number().default(0).notRequired(),
      learnDateTo: yup.number().notRequired().min(yup.ref('learnDateFrom'), t('form.validate.deal.endTime.m2')),
    });
  }, []);
}
