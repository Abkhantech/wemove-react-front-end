import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const resendOtpForDeliveryCarrier = createAsyncThunk(
  ActionTypes.RESEND_OTP_FOR_DELIVERY_CARRIER,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/resendOTP", "post", body);
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

export const checkIfDeliveryCarrierExists = createAsyncThunk(
  ActionTypes.CHECK_IF_DELIVERY_CARRIER_EXISTS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/checkIfExists", "post", body);
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

export const registerDeliveryCarrierWithFiles = createAsyncThunk(
  ActionTypes.REGISTER_DELIVERY_CARRIER_WITH_FILES,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/register-with-files", "post", body);
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

export const registerDeliveryCarrier = createAsyncThunk(
  ActionTypes.REGISTER_DELIVERY_CARRIER,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/register", "post", body);
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

export const deliveryCarrierLogin = createAsyncThunk(
  ActionTypes.DELIVERY_CARRIER_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/login", "post", body);
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

export const verifyDeliveryCarrierOtp = createAsyncThunk(
  ActionTypes.VERIFY_DELIVERY_CARRIER_OTP,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("delivery-carrier/verify-otp", "post", body);
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
export const getDeliveryCarrierAgainstId = createAsyncThunk(
  ActionTypes.GET_DELIVERY_CARRIER_AGAINST_ID,
  async (id: any, { rejectWithValue }) => {
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

export const activateDeliveryCarrier = createAsyncThunk(
  ActionTypes.ACTIVATE_DELIVERY_CARRIER_STATUS,
  async (body: any, { rejectWithValue }) => {
    try {
      const { id } = body;
      const res = apiCall(`/delivery-carrier/${id}`, "patch", body);
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
