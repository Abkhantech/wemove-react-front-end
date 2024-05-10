import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createThieMoveRequest = createAsyncThunk(
  ActionTypes.CREATE_MOVE_REQUEST,
  async (params: any, { rejectWithValue }) => {
    try {
      const { body, consumerId } = params;
      console.log(body)
      const res = await apiCall(`/move-request/createMoveRequest/${consumerId}`, 'post', body);
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

export const getAllMoveRequestsByConsumerID = createAsyncThunk(
  ActionTypes.GET_ALL_MOVE_REQUESTS_BY_CONSUMER_ID,
  async (consumerId: number, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/move-request/getAllMoveRequests/${consumerId}`, 'get');
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

export const getMoveRequestById = createAsyncThunk(
  ActionTypes.GET_MOVE_REQUEST_BY_ID,
  async (moveRequestId: string, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/move-request/${moveRequestId}`, 'get');
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

export const updateMoveRequestById = createAsyncThunk(
  ActionTypes.UPDATE_MOVE_REQUEST_BY_ID,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/move-request/updateMoveRequest`, 'patch', body);
      return res;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        console.log(error, '>>>')
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const createCheckoutSession = createAsyncThunk(
  ActionTypes.CREATE_CHECKOUT_SESSION,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/move-request/checkoutSession`, 'post', body);
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