import axios from "axios";
import { createDiscreteApi } from "naive-ui";

const { notification } = createDiscreteApi(["notification"]);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    const errMsg = error.response.data.errors
      .map((err: { param: string; msg: string }) => {
        return err.param || "" + err.msg;
      })
      .join("\n");

    notification.error({ title: errMsg, duration: 5000 });
    return Promise.reject(error);
  }
);

export default api;
