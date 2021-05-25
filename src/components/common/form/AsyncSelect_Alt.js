import React, { useMemo, useEffect } from 'react';
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
  let { apiKey, query, labelField, valueField, placeholder, excludes, dataCallback, reqMethod, loadedCallback, supplimentOptions, keepDataOnOption, ...rest } = props;
  !query && (query = {});
  let params;
  if (reqMethod && reqMethod.toLowerCase() === 'post') {
    params = query;
  } else {
    params = {
      params: {
        size: 100,
        ...query,
      },
    };
  }
  let { data, status } = useGet([apiKey, query], APIProvider.getUrl(apiKey), params, reqMethod);
  useEffect(() => {
    if (data) {
      loadedCallback && loadedCallback(data);
    }
  }, [data]);
  !data && (data = []);
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
      let value = valueField ? cur[valueField] : cur.id;
      if (!excludes || (excludes && !excludes.includes(value))) {
        let option = {
          value,
          label: generateLabel(cur),
        };
        if (dataCallback) {
          option = dataCallback(option, cur);
        }
        if (keepDataOnOption) {
          option.data = cur;
        }
        option && acc.push(option);
      }
      return acc;
    }, []);
  }
  let options = useMemo(() => {
    if (supplimentOptions) {
      return supplimentOptions.concat(getOptions(data.content || data));
    } else {
      return getOptions(data.content || data);
    }
  }, [data]);
  if (status === 'loading') {
    placeholder = 'loading...';
  } else if (status === 'error') {
    placeholder = 'load failed!';
  }
  return <ReactSelectFormik placeholder={placeholder} options={options} {...rest} />;
}
