import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connections: [],
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    clearConnections: (state) => {
      state.connections = [];
    },
  },
});

export const { setConnections, clearConnections } = connectionSlice.actions;
export const selectConnections = (state) => state.connection.connections;
export default connectionSlice.reducer;
