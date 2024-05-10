import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerConsumer = createAsyncThunk(
  ActionTypes.CONSUMER_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`users/register`, "post", body);
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

export const getConsumerById = createAsyncThunk(
  ActionTypes.GET_CONSUMER_BY_ID,
  async (consumerId: number, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/users/getUser/${consumerId}`, "get");
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

export const updateConsumerById = createAsyncThunk(
  ActionTypes.UPDATE_CONSUMER_BY_ID,
  async (body: any, { rejectWithValue }) => {
    try {
      const { consumerId } = body;
      const res = await apiCall(`/users/${consumerId}`, "patch", body);
      return res;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const consumerLogin = createAsyncThunk(
  ActionTypes.CONSUMER_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      console.log(body, "BODY in API method");
      const res = await apiCall(`/users/login`, "post", body);
      console.log("Response is", res);
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

export const verifyConsumerOtp = createAsyncThunk(
  ActionTypes.VERIFY_CONSUMER_OTP,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/users/verifyOtp`, "post", body);
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

export const getMoveDistance = createAsyncThunk(
  ActionTypes.GET_MOVE_DISTANCE,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/users/Distance`, "post", body);
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

export const getMoveDistanceForAdmin = createAsyncThunk(
  ActionTypes.GET_MOVE_DISTANCE,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/users/test-Distance`, "post", body);
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
