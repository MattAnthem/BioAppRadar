import { createSlice } from "@reduxjs/toolkit";




export const altitudeSlice = createSlice({
    name: 'altitude',
    initialState: {
        currentAltitude: 0   
    },
    reducers: {
        changeAltitude: (state, action) => {
          state.currentAltitude = action.payload
        },
    }
});

export const { changeAltitude } = altitudeSlice.actions;
export default altitudeSlice.reducer;
