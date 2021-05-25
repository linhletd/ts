import { useState, useEffect } from 'react';
import { callGet, callPost } from '../../hooks/useRequest';
import APIProvider from '../../util/api/url/APIProvider';
export function usePollingReload(timestamp, url, params) {
  let [res, setData] = useState({ status: 'loading', data: undefined });
  let limit = 8;
  let count = 0;
  async function callRequest() {
    return await callGet(url, params).then(({ data, code }) => {
      if (code === 200) {
        if ((data.content.length && data.content[0].timestamp >= timestamp) || timestamp < Date.now() - 3600 * 1000) {
          return { data, status: 'success' };
        } else {
          if (count === limit) {
            return { data, status: 'success' };
          }
          //retry
          count++;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(callRequest());
            }, 1000);
          });
        }
      } else {
        if (count === limit) {
          return { data: undefined, status: 'error' };
        }
        //retry
        count++;
        return callRequest();
      }
    });
  }

  useEffect(async () => {
    setData({ status: 'loading', data: undefined });
    let res = await callRequest();
    setData(res);
  }, [timestamp]);

  return res;
}

export function useCheckfilterTotal(values, url) {
  let [total, setTotal] = useState('checking...');
  let fields = ['timeType', 'startTime', 'endTime', 'campaigns', 'campaignsGroup', 'departments'];
  let vals = {};
  let dep = [];
  fields.map((field) => {
    if (values[field]) {
      if (values[field] instanceof Array) {
        vals[field] = values[field].map((cur) => cur.value);
      } else {
        vals[field] = values[field];
      }
      dep.push(vals[field]);
    }
  });
  // vals.noOwner = true;
  vals.status = 'NEW';
  useEffect(async () => {
    total !== 'checking...' && setTotal('checking...');
    let { code, data } = await callPost(url, vals);
    if (code === 200) {
      setTotal(data.totalElements);
    } else {
      total !== 'checking...' && setTotal('checking...');
    }
  }, [JSON.stringify(dep)]);
  return total;
}

export function useGetCampaignListByGroupList(campaignsGroup) {
  let [data, setState] = useState({ campaignList: [], status: 'loading' });
  useEffect(() => {
    if (!campaignsGroup || (campaignsGroup instanceof Array && !campaignsGroup.length)) {
      return { campaignList: [], status: 'success' };
    }
    Promise.all(
      campaignsGroup.map((cur) =>
        callGet(APIProvider.getUrl('CAMPAIGN_BY_GROUP'), {
          params: {
            group_id: cur.value,
          },
        }),
      ),
    ).then((arr) => {
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].code === 200) {
          result = result.concat(arr[i].data);
        }
      }
      result = result.map((cur) => ({ value: cur.id, label: cur.name || 'null' }));
      setState({
        campaignList: result,
        status: 'success',
      });
    });
  }, [campaignsGroup]);
  return data;
}
