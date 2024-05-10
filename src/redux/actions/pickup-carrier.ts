import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const resendOtpForPickupCarrier = createAsyncThunk(
  ActionTypes.RESEND_OTP_FOR_PICKUP_CARRIER,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("pickup-carrier/resendOTP", "post", body);
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

export const checkIfPickupCarrierExists = createAsyncThunk(
  ActionTypes.CHECK_IF_PICKUP_CARRIER_EXISTS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("pickup-carrier/checkIfExists", "post", body);
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

export const registerPickupCarrierWithFiles = createAsyncThunk(
  ActionTypes.REGISTER_PICKUP_CARRIER_WITH_FILES,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("pickup-carrier/register-with-files", "post", body);
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

export const pickupCarrierLogin = createAsyncThunk(
  ActionTypes.PICKUP_CARRIER_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("pickup-carrier/login", "post", body);
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

export const verifyPickupCarrierOtp = createAsyncThunk(
  ActionTypes.VERIFY_PICKUP_CARRIER_OTP,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("pickup-carrier/verify-otp", "post", body);
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

export const activatePickupCarrier = createAsyncThunk(
  ActionTypes.ACTIVATE_PICKUP_CARRIER_STATUS,
  async (body: any, { rejectWithValue }) => {
    try {
      const { id } = body;
      const res = apiCall(`/pickup-carrier/${id}`, "patch", body);
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

export const getAllMoveRequest = createAsyncThunk(
  ActionTypes.GET_ALL_MOVE_REQUEST,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/pickup-carrier/moveRequests/${id}`, "get");
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
