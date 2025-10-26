import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export default class API {
  private axiosInstance: AxiosInstance;
  private token: string;
  private autoDeconstruct: boolean = true;

  /**
   * @param {string} token - Booth token for backend access
   * @param {boolean} autoDeconstructData - for response's data that has data field, deconstruct into response's data
   */
  constructor(token: string, autoDeconstructData?: boolean) {
    this.autoDeconstruct = autoDeconstructData!;
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: window.electron.config.API_URL,

      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    this.initializeInterceptors();
  }
  private initializeInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Token'] = this.token;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.autoDeconstruct) {
          response.data = response.data.data;
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}
