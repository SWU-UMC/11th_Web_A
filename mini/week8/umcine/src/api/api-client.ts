import ky from "ky";
import { env } from "../config/env";

const apiClient = ky.create({
  prefix: env.apiBaseUrl,
});

export default apiClient;