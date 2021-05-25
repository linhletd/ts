import React, { useState, useMemo } from 'react';
import ReactSelectFormik from '../../../components/Form/ReactSelectFormik';
import APIProvider from '../../../util/api/url/APIProvider';
import { useGet } from '../../../hooks/useRequest';
import ErrorBoundary from '../../Fallback/ErrorBoundary';

export default function SelectWithRemoteData(props) {
  return (
    <ErrorBoundary>
      <_SelectWithRemoteData {...props} />
    </ErrorBoundary>
  );
}
function _SelectWithRemoteData(props) {
  let { apiKey, queryObj, labelField, valueField, placeholder, initialQuery, setLabel, excludes, supplimentOptions, ...rest } = props;
  let [query, changeQuery] = useState(initialQuery || {});
  queryObj && (queryObj[props.field] = changeQuery);
  let { data = [], status } = useGet([apiKey, query], APIProvider.getUrl(apiKey), {
    params: {
      size: 100,
      ...query,
    },
  });
  function generateLabel(obj) {
    if (labelField instanceof Array) {
      let label = '';
      labelField.map((cur, i) => {
        label += ` ${i !== 0 ? ' - ' : ''}${obj[cur]}`;
      });
      return label;
    }
    return obj[labelField || 'name'];
  }
  function getOptions(arr) {
    let opts = arr.reduce((acc, cur) => {
      let value = valueField ? cur[valueField] : cur.id;
      if (!excludes || (excludes && !excludes.includes(value))) {
        acc.push({
          value,
          label: generateLabel(cur),
        });
      }
      return acc;
    }, []);
    if (supplimentOptions) {
      opts.push(...supplimentOptions);
    }
    return opts;
  }
  let options = useMemo(() => {
    return getOptions(data.content || data);
  }, [data]);
  if (status === 'loading') {
    placeholder = 'loading...';
  } else if (status === 'error') {
    placeholder = 'load failed!';
  }
  return <ReactSelectFormik placeholder={placeholder} options={options} setLabel={setLabel} {...rest} />;
}
