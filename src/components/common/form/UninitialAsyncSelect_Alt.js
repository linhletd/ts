import React from 'react';
import AsyncSelect_Alt from './AsyncSelect_Alt';
import ReactSelectFormik from '../../../components/Form/ReactSelectFormik';
export default function UninitialAsyncSelect({ query, ...props }) {
  if (!query) {
    return <ReactSelectFormik options={[]} {...props} />;
  }
  return <AsyncSelect_Alt {...props} query={query} />;
}
