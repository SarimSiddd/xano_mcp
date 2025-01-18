import axios, { InternalAxiosRequestConfig } from "axios";

type onFulfilled<T> = (value: T) => T | Promise<T>;
type onRejected = ((error: any) => any) | null;

export const authInterceptor = (
  apiKey: string,
): [onFulfilled<InternalAxiosRequestConfig>, onRejected] => {
  return [
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      config.headers.Authorization = `Bearer ${apiKey}`;
      return config;
    },
    (error: any): void => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(
            "Got an error in the response",
            error.response?.data?.message,
          );
        } else if (error.request) {
          console.log(
            "Got an error in the request",
            error.request?.data?.message,
          );
        } else {
          console.log("Some unknown axios error occurred");
        }
      }

      throw "Non axios error occurred";
    },
  ];
};
