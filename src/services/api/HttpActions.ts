export default class HttpActions {
  private baseURL: string;
  private headers: Headers;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private constructUrl(urlSuffix: string): string {
    return this.baseURL + urlSuffix;
  }

  public addHeader(header: string, value: string) {
    const { headers } = this;

    if (headers.has(header)) {
      this.removeHeader(header);
    }
    headers.append(header, value);
  }

  public removeHeader(header: string) {
    const { headers } = this;

    headers.delete(header);
  }

  private async request<T>(urlSuffix: string, init: RequestInit): Promise<T> {
    const response = await fetch(this.constructUrl(urlSuffix), {
      ...init,
      headers : this.headers,
    });

    if (!response.ok) {
      throw response.status;
    }

    return response.json() as Promise<T>;
  }

  public get<T>(urlSuffix: string): Promise<T> {
    return this.request(urlSuffix, {
      method : 'GET',
    });
  }

  public post<T>(urlSuffix: string, data?: any): Promise<T> {
    return this.request(urlSuffix, {
      body : JSON.stringify(data),
      method : 'POST',
    });
  }

  public put<T>(urlSuffix: string, data?: any): Promise<T> {
    return this.request(urlSuffix, {
      body : JSON.stringify(data),
      method : 'PUT',
    });
  }

  public patch<T>(urlSuffix: string, data?: any): Promise<T> {
    return this.request(urlSuffix, {
      body : JSON.stringify(data),
      method : 'PATCH',
    });
  }

  public delete<T>(urlSuffix: string): Promise<T> {
    return this.request(urlSuffix, {
      method : 'DELETE',
    });
  }
}
