import Request from '../util/api/engine/Request';
import { getToken } from '../util/TokenProvider';

type method = 'get'|'post'|'put'|'patch'|'delete';

const REQUEST = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};

export const createFetcher = (url: string, dataParam?:  any, operation?: method) => {
  if(!operation){
    operation = 'get';
  }
  console.debug(`useRequest - _getData - url: ${url}, dataParam: ${JSON.stringify(dataParam)}`);
  let parameters = '';
  if(dataParam && dataParam.params){
    let query = new URLSearchParams()
    Object.keys(dataParam.params).map((key) => {
      query.set(key, dataParam.params[key])
    })
  }
  let config = {
    headers: {
      Authentication: getToken(),
    },
  };
  console.debug(`useRequest - _getData - config: ${JSON.stringify(config)}`);
  return async () => {
    let req: Promise<any>;
    if (operation === REQUEST.POST) {
      req = call(Request[REQUEST.POST](url, dataParam, config), true);
    } else {
      req = call(Request[REQUEST.GET](url + '?' + parameters, config), true);
    }
    let res = await req;
    return res.data;
  };
};


// async region  -------------------------------------------------------------------------------------------
export async function callDelete(url: string) {
  return call(Request[REQUEST.DELETE](url, { headers: { Authentication: getToken() } }));
}

export async function callLogin(url: string, dataParam?: any) {
  return call(Request[REQUEST.POST](url, dataParam));
}

export async function callPost(url: string, dataParam?: any) {
  return call(Request[REQUEST.POST](url, dataParam, { headers: { Authentication: getToken() } }));
}

export async function callPut(url: string, dataParam?: any) {
  return call(Request[REQUEST.PUT](url, dataParam, { headers: { Authentication: getToken() } }));
}

export async function callGet(url: string,  dataParam?: any) {
  let parameters = '';
  if (dataParam && dataParam.params) {
    parameters = Object.keys(dataParam.params)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(dataParam.params[k]);
      })
      .join('&');
    console.debug(`useRequest - callGet - url: ${url}, parameters: ${parameters}`);
  }
  return call(Request[REQUEST.GET](url + '?' + parameters, { headers: { Authentication: getToken() } }));
}

export async function callUpload(url: string, file: Blob) {
  let formData = new FormData();
  formData.append('file', file);
  return call(Request[REQUEST.POST](url, formData, { headers: { Authentication: getToken(), 'Content-Type': 'multipart/form-data' } }));
}

async function call(request: Promise<any>, isHook?: boolean) {
  try {
    const data = await request;
    console.log(`useRequest - call - data: ${data}`);
    return { code: 200, data: data.data };
  } catch (error) {
    let hasNetworkError = error.message === 'Network Error' && { message: 'Network Error' };
    if (isHook) return Promise.reject({ data: hasNetworkError || error.response?.data, code: hasNetworkError ? -1 : error.response?.status });
    console.error(`useRequest - call- error: ${JSON.stringify(error)}`);
    if (hasNetworkError) {
      return { code: -1, data: hasNetworkError };
    }
    console.error(`useRequest - call - error: ${JSON.stringify(error.response.status)}`);
    let { status, data } = error.response;
    return {
      code: status,
      data: status >= 500 ? { message: 'Internal Server Error' } : { message: (data && data.message) || 'Unknown Error' },
    };
  }
}
