import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const resendOtpForLocalCarrier = createAsyncThunk(
  ActionTypes.RESEND_OTP_FOR_LOCAL_CARRIER,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/resendOTP", "post", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const checkIfLocalCarrierExists = createAsyncThunk(
  ActionTypes.CHECK_IF_LOCAL_CARRIER_EXISTS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/checkIfExists", "post", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerLocalCarrierWithFiles = createAsyncThunk(
  ActionTypes.REGISTER_LOCAL_CARRIER_WITH_FILES,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/register-with-files", "post", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerLocalCarrier = createAsyncThunk(
  ActionTypes.REGISTER_LOCAL_CARRIER,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/register", "post", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        const err = rejectWithValue(error.response.data.message);
        console.log("ERROR FROM HERE---->");
        return err;
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const localCarrierLogin = createAsyncThunk(
  ActionTypes.LOCAL_CARRIER_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/login", "post", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const verifyLocalCarrierOtp = createAsyncThunk(
  ActionTypes.VERIFY_LOCAL_CARRIER_OTP,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("local-carrier/verify-otp", "post", body);
      localStorage.setItem("jwtToken", res);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const getLocalCarrierAgainstId = createAsyncThunk(
  ActionTypes.GET_LOCAL_CARRIER_AGAINST_ID,
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/delivery-carrier/${id}`, "get");
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const activateLocalCarrier = createAsyncThunk(
  ActionTypes.ACTIVATE_LOCAL_CARRIER_STATUS,
  async (body: any, { rejectWithValue }) => {
    try {
      const { id } = body;
      const res = apiCall(`/local-carrier/${id}`, "patch", body);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export {};
