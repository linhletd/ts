import React, { useState, useEffect } from 'react';
import AsyncSelect from './AsyncSelect';
import ReactSelectFormik from '../../../components/Form/ReactSelectFormik';
export default function UninitialAsyncSelect({ queryObj, ...props }) {
  let [altQueryObj] = useState({});
  let [whereToGo, go] = useState(props.initialQuery);
  queryObj[props.field] = (params) => {
    if (!params) {
      go(false);
    } else if (altQueryObj[props.field]) {
      altQueryObj[props.field](params);
    } else {
      go(true);
    }
  };
  useEffect(() => {
    if (props.initialQuery) {
      go(props.initialQuery);
    }
  }, [!props.initialQuery]);
  if (!whereToGo) {
    altQueryObj[props.field] = null;
    return <ReactSelectFormik options={[]} {...props} />;
  }
  return <AsyncSelect {...props} queryObj={altQueryObj} />;
}
