import axios, { AxiosResponse } from "axios";

type onFulfilled<T> = (value: T) => T | Promise<T>;
type onRejected = ((error: any) => any) | null;

export const responseInterceptor = (): [
  onFulfilled<AxiosResponse>,
  onRejected,
] => {
  return [
    (response: AxiosResponse): AxiosResponse => {
      console.log("Got a response from axios: ", response.data);
      return response;
    },
    (error: any): any => {
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
