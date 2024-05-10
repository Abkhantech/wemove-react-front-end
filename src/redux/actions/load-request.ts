import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const createLoadRequest = createAsyncThunk(
  ActionTypes.CREATE_LOAD_REQUEST,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/load-request`, "post", body);
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

export const getLoadrequestAgainstDc = createAsyncThunk(
  ActionTypes.GET_LOAD_REQUEST_AGAINST_DC,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `/load-request/getLoadrequestAgainstDc/${body.deliveryCarrierId}/${body.date}`,
        "get"
      );
      console.log(res);
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
