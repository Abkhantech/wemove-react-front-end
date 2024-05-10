import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../apis/api";

export const skipTrace = createAsyncThunk(
  ActionTypes.GET_SKIP_TRACE,
  async (body: any, { rejectWithValue }) => {
    try {
      const {id, ...params} = body
      console.log(params,'---------',id)
      const res = await apiCall(`skip-trace/${id}/search`, "post", params);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        console.log(error,'the error')
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const MLS = createAsyncThunk(
  ActionTypes.GET_MLS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`mls/property-scouting`, "post", body);
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

export const getMLSRecords = createAsyncThunk(
  ActionTypes.GET_MLS_RECORDS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`mls/getAllMLSRecords`, "get", undefined, {offset: body.offset, limit: body.limit});
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

export const getSkipTraceRecords = createAsyncThunk(
  ActionTypes.GET_SKIP_TRACE_RECORDS,
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`skip-trace/${body.date}/getAllSkipTraceRecords`, "get", undefined, {offset: body.offset, limit: body.limit});
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


