import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useDataAssignByListSchema } from '../Edit/DealEditFormValidationSchema';
import ButtonLoading from '../../../components/Button/ButtonLoading';
// import AsyncMultiSelectFormikPagination from '../../Common/AsyncSearchSelect/AsyncMultiSelectFormikPagination';
import MutiUserChecked from '../../Common/AsyncSearchSelect/MultiUserChecked';
import { Button } from 'react-bootstrap';
import MultiSelect from '../../Common/AsyncSearchSelect/MultiSelect';
import { useGet } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';

export default function ContactAssignForm({ onSubmitHandler, handleClose, responseMessage, isProcessing, ownerType }) {
  let { t } = useTranslation();
  let DataAssignByListSchema = useDataAssignByListSchema();
  let { data, status } = useGet(['DEPARTMENT_TYPE_LIST_USER', { type: ownerType }], APIProvider.getUrl('DEPARTMENT_TYPE_LIST_USER'), { params: { type: ownerType } });
  let userList = useMemo(() => {
    if (!data) return [];
    return data.map((cur) => ({ value: cur.id, label: cur.userName, verified: true }));
  }, [data]);
  const [isUser, setIsUser] = useState(false);
  const handleClickIsUser = () => {
    setIsUser(!isUser);
  };

  let initialValues = {
    users: '',
  };
  return (
    <div>
      {responseMessage && <p className="text-danger">{`${t('app.generics.update.fail')}: ${responseMessage}`}</p>}
      <Formik enableReinitialize initialValues={initialValues} validationSchema={DataAssignByListSchema} onSubmit={onSubmitHandler}>
        {(formik) => {
          return (
            <Form className=".was-validated">
              <div>
                <div className="mb-3">
                  <input onChange={handleClickIsUser} type="checkbox" checked={isUser} />
                  <span onClick={handleClickIsUser} className="pl-2">
                    {t('page.contact.modal.listShare.span.text')}
                  </span>
                </div>
                {isUser ? (
                  <MultiSelect
                    field="users"
                    formik={formik}
                    overrideStrings={{ selectSomeItems: status === 'success' ? t('page.contact.assignData.usersSelect.placeholder') : status }}
                    options={userList}
                  />
                ) : (
                  // <AsyncMultiSelectFormikPagination field="users" apiKey="USER_LIST" labelField="userName" formik={formik} placeholder={t('page.contact.assignData.usersSelect.placeholder')} />
                  <MutiUserChecked field="users" formik={formik} placeholder={t('page.contact.assignData.users.placeholder')} validatedUserList={userList} />
                )}
              </div>
              <div className="btn-toolbar mt-3 row justify-content-end pr-4">
                <Button onClick={handleClose} variant="secondary" className="mr-2">
                  {t('app.generics.close')}
                </Button>
                <ButtonLoading className="btn-space" type="submit" loading={isProcessing} onClick={formik.handleSubmit} icon="paper-plane">
                  {t('app.generics.save')}
                </ButtonLoading>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
