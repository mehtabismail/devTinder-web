import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    clearRequests: (state) => {
      state.requests = [];
    },
  },
});

export const { setRequests, clearRequests } = requestsSlice.actions;
export const selectRequests = (state) => state.requests.requests;
export default requestsSlice.reducer;
