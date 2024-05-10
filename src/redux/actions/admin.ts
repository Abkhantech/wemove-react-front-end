import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const adminLogin = createAsyncThunk(
  ActionTypes.ADMIN_LOGIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`admin/login`, "post", body);
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

export const getAllLocalCarriers = createAsyncThunk(
  ActionTypes.GET_ALL_LOCAL_CARRIERS,
  async () => {
    try {
      const res = await apiCall("admin/local_carriers", "get");
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return error.response.data.message;
      } else {
        return error.message;
      }
    }
  }
);

export const getAllPickupCarriers = createAsyncThunk(
  ActionTypes.GET_ALL_PICKUP_CARRIERS,
  async () => {
    try {
      const res = await apiCall("admin/pickup_carriers", "get");
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return error.response.data.message;
      } else {
        return error.message;
      }
    }
  }
);

export const getAllDeliveryCarriers = createAsyncThunk(
  ActionTypes.GET_ALL_DELIVERY_CARRIERS,
  async () => {
    try {
      const res = await apiCall("admin/delivery_carriers", "get");
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return error.response.data.message;
      } else {
        return error.message;
      }
    }
  }
);

export const findAllMoveRequestsForAdmin = createAsyncThunk(
  ActionTypes.FETCH_ALL_MOVE_REQUESTS_FOR_ADMIN,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/admin/display-move-requests-for-admin`, 'get',undefined, {offset: body.offset, limit: body.limit});
      return res;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
