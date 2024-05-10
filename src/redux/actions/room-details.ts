import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const fetchInventoryFromVideo = createAsyncThunk(
  ActionTypes.GET_INVENTORY_FROM_VIDEO,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        "room-details/create-room-details",
        "post",
        body
      );
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

export const updateRoomDetails = createAsyncThunk(
  ActionTypes.UPDATE_ROOM_DETAILS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `room-details/update-room-details`,
        "patch",
        body
      );
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

export const getInventoryVolume = createAsyncThunk(
  ActionTypes.CALCULATE_INVENTORY_VOLUME,
  async (moveRequestId: string, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `room-details/calculate-total-cubic-feet/${moveRequestId}`,
        "get"
      );
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