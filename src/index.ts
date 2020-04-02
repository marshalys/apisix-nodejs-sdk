import { createResource, Resource } from './resource';

interface RouterOption {
  uri?: string;
  uris?: string[];
  desc?: string;
  host?: string;
  hosts?: string[];
  remote_addr?: string;
  remote_addrs?: string[];
  methods?: string[];
  priority?: number;
  vars?: string[];
  filter_func?: string;
  plugins?: Record<string, any>;
  upstream?: Record<string, any>;
  upstream_id?: string;
  service_id?: string;
  service_protocol?: string;
}

interface ServiceOption {
  plugins?: Record<string, any>;
  upstream?: Record<string, any>;
  upstream_id?: string;
  desc?: string;
}

interface ConsumerOption {
  username: string;
  plugins?: Record<string, any>;
  desc?: string;
}

interface UpstreamOption {
  type: 'roundrobin' | 'chash';
  nodes: Record<string, number>;
  hash_on?: 'vars' | 'header' | 'cookie' | 'consumer';
  key?: string;
  checks?: Record<string, any>;
  retries?: number;
  enable_websocket?: boolean;
  timeout?: Record<string, number>;
  desc?: string;
}

interface SslOption {
  cert: string;
  key: string;
  sni: string;
}

class Client {
  private readonly routeResource: Resource<RouterOption>;
  private readonly serviceResource: Resource<ServiceOption>;
  private readonly consumerResource: Resource<ConsumerOption>;
  private readonly upstreamResource: Resource<UpstreamOption>;
  private readonly sslResource: Resource<SslOption>;

  constructor(baseUrl: string, authKey?: string) {
    this.routeResource = createResource<RouterOption>(baseUrl, 'routes', authKey);
    this.serviceResource = createResource<ServiceOption>(baseUrl, 'services', authKey);
    this.consumerResource = createResource<ConsumerOption>(baseUrl, 'consumers', authKey);
    this.upstreamResource = createResource<UpstreamOption>(baseUrl, 'upstreams', authKey);
    this.sslResource = createResource<SslOption>(baseUrl, 'ssl', authKey);
  }

  public getRouteResource() {
    return this.routeResource;
  }

  public getServiceResource() {
    return this.serviceResource;
  }

  public getConsumerResource() {
    return this.consumerResource;
  }

  public getUpstreamResource() {
    return this.upstreamResource;
  }

  public getSslResource() {
    return this.sslResource;
  }
}

export { Client };
