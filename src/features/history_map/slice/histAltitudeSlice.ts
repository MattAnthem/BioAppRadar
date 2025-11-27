import { createSlice } from "@reduxjs/toolkit";



export const histAltitudeSlice = createSlice({
    name: 'altitude',
    initialState: {
        currentAltitude: 0  
    },
    reducers: {
        changeHistAltitude: (state, action) => {
          state.currentAltitude = action.payload;
        },
    }
});

export const { changeHistAltitude } = histAltitudeSlice.actions;
export default histAltitudeSlice.reducer;