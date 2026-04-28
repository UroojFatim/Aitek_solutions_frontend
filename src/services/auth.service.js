import { AUTH_ENDPOINTS } from "@/constants/auth.constants";
import httpClient from "./httpClient";

const authService = {
  signIn: async ({email, password}) => {
    console.log('Calling sign-in endpoint with:', { email, password });
    return await httpClient.post(AUTH_ENDPOINTS.SIGN_IN, { email, password });
  },

  signOut: async () => {
    return await httpClient.post(AUTH_ENDPOINTS.SIGN_OUT);
  },

  signUp: async (email, password) => {
    return await httpClient.post(AUTH_ENDPOINTS.SIGN_UP, { email, password });
  },

  validate: async () => {
    console.log('Calling validate endpoint');
    return await httpClient.get(AUTH_ENDPOINTS.VALIDATE);
  },

  requestForgotPassword: async (email) => {
    return await httpClient.post(AUTH_ENDPOINTS.REQUEST_FORGOT_PASSWORD, { email });
  },

  forgotPassword: async (token, newPassword) => {
    return await httpClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { token, newPassword });
  },
  
  changePassword: async ({ current_password, new_password }) => {
    return await httpClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, { current_password, new_password });
  },
};

export default authService;