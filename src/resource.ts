import got from 'got';
import _ from 'lodash';
import queryString from 'querystring';

async function doRequest(
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  parameters?: any,
) {
  const data = parameters || {};
  let result: any;
  if (method === 'GET') {
    result = await got
      .get(url, {
        searchParams: queryString.stringify(data),
      })
      .json();
  } else if (method === 'DELETE') {
    result = await got
      .delete(url, {
        searchParams: queryString.stringify(data),
      })
      .json();
  } else if (method === 'PUT') {
    result = await got.put(url, { json: data }).json();
  } else if (method === 'PATCH') {
    result = await got.patch(url, { json: data }).json();
  } else {
    result = await got.post(url, { json: data }).json();
  }
  return result.node;
}

class Resource<T> {
  constructor(private readonly baseUrl: string, private readonly path: string) {}

  public async add(value: T): Promise<string> {
    const url = `${this.baseUrl}${this.path}`;
    const result = await doRequest('POST', url, value);
    return _.last(result.key.split('/')) || '';
  }

  public async set(id: string, value: T): Promise<string> {
    const url = `${this.baseUrl}${this.path}${id}`;
    const result = await doRequest('PUT', url, value);
    return _.last(result.key.split('/')) || '';
  }

  public async get(id: string): Promise<T> {
    const url = `${this.baseUrl}${this.path}${id}`;
    return doRequest('GET', url);
  }

  public async remove(id: string): Promise<T> {
    const url = `${this.baseUrl}${this.path}${id}`;
    return doRequest('DELETE', url);
  }

  public async modify(id: string, path: string, value: any): Promise<string> {
    const url = `${this.baseUrl}${this.path}${id}/${path}`;
    const result = await doRequest('PATCH', url, value);
    return _.last(result.key.split('/')) || '';
  }
}

function createResource<T>(baseUrl: string, path: string) {
  return new Resource<T>(baseUrl, path);
}

export { createResource, Resource };
