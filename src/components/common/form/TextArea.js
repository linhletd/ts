import React from 'react';
import { ErrorMessage, Field } from 'formik';

export default function TextArea({ ...props }) {
  return (
    <div className="form-group">
      <label className={'mb-1'} htmlFor={props.field}>
        {props.label}
      </label>
      <Field rows={props.rows} as="textarea" name={props.field} className={props.isValid ? 'form-control is-invalid' : 'form-control'} placeholder={props.placeholder ? props.placeholder : ''} />
      <ErrorMessage name={props.field} component="div" className="invalid-feedback" />
    </div>
  );
}
