import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

export default class AppService {
  appHost: string;

  constructor() {
    this.appHost = `${window.location.protocol}//${window.location.host}`;
  }

  static getAxiosInstance(config?: CreateAxiosDefaults): AxiosInstance {
    // returns an axios instance which can be used by services
    // to make remote calls
    const instance = axios.create(config);

    // Add request interceptor to include auth token
    instance.interceptors.request.use((requestConfig) => {
      const token = localStorage.getItem('access-token');
      if (token) {
        try {
          const tokenData = JSON.parse(token);
          if (tokenData.token) {
            requestConfig.headers.Authorization = `Bearer ${tokenData.token}`;
          }
        } catch (e) {
          console.error('Failed to parse token from localStorage', e);
        }
      }
      return requestConfig;
    });

    return instance;
  }
}
