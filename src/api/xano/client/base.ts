import axios, { AxiosInstance } from "axios";
import { Config } from "../../../config.js";
import { authInterceptor } from "./interceptors/auth.js";
import { responseInterceptor } from "./interceptors/response.js";

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: Config) {
    this.client = axios.create({
      baseURL: config.xano.apiUrl,
      timeout: config.xano.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const [onFulfilledHandler, onErrorHandler] = authInterceptor(
      config.xano.apiKey,
    );
    const [onResponseFulledHandler, onResponseErrorHandler] =
      responseInterceptor();
    this.client.interceptors.request.use(onFulfilledHandler, onErrorHandler);
    this.client.interceptors.response.use(
      onResponseFulledHandler,
      onResponseErrorHandler,
    );
  }

  get axiosInstance(): AxiosInstance {
    return this.client;
  }
}
