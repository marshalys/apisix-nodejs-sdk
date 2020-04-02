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
  private readonly urlPrefix: string;
  constructor(baseUrl: string, path: string, private readonly authKey?: string) {
    this.urlPrefix = `${baseUrl}${path}`;
  }

  public async add(value: T): Promise<string> {
    const url = this.getUrl();
    const result = await doRequest('POST', url, value);
    return _.last(result.key.split('/')) || '';
  }

  public async set(id: string, value: T): Promise<string> {
    const url = this.getUrl(id);
    const result = await doRequest('PUT', url, value);
    return _.last(result.key.split('/')) || '';
  }

  public async get(id: string): Promise<T> {
    const url = this.getUrl(id);
    const result = await doRequest('GET', url);
    return result.value;
  }

  public async remove(id: string): Promise<string> {
    const url = this.getUrl(id);
    const result = await doRequest('DELETE', url);
    return _.last(result.key.split('/')) || '';
  }

  public async modify(id: string, path: string, value: any): Promise<string> {
    const url = this.getUrl(id, path);
    const result = await doRequest('PATCH', url, value);
    return _.last(result.key.split('/')) || '';
  }

  private getUrl(id?: string, path?: string) {
    const paths = [`${this.urlPrefix}`];
    if (id) {
      paths.push(id);
    }
    if (path) {
      paths.push(path);
    }
    let url = paths.join('/');
    if (this.authKey) {
      url += `?api_key=${this.authKey}`;
    }
    return url;
  }
}

function createResource<T>(baseUrl: string, path: string, authKey?: string) {
  return new Resource<T>(baseUrl, path, authKey);
}

export { createResource, Resource };
