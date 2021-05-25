import React, { useMemo } from 'react';
import MultiSelect from './MultiSelect';
import { useGet } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import ErrorBoundary from '../../Fallback/ErrorBoundary';

export default function AsyncMultiSelect(props) {
  return (
    <ErrorBoundary>
      <_AsyncMultiSelect {...props} />
    </ErrorBoundary>
  );
}

function _AsyncMultiSelect({ apiKey, query, labelField, ...rest }) {
  let { data = [] } = useGet([apiKey], APIProvider.getUrl(apiKey), {
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
    return obj[labelField || 'name'] || 'null';
  }
  function getOptions(arr) {
    return arr.reduce((acc, cur) => {
      if (labelField == 'userName') {
        acc.push({
          value: cur.id,
          label: generateLabel(cur),
          verified: true,
        });
      } else {
        acc.push({
          value: cur.id,
          label: generateLabel(cur),
        });
      }

      return acc;
    }, []);
  }
  let options = useMemo(() => {
    return getOptions(data.content || data);
  }, [data]);
  return <MultiSelect options={options} {...rest} />;
}
