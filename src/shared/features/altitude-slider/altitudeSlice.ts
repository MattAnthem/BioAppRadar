import { createSlice } from "@reduxjs/toolkit";

//altitude static options from 0 to 5000 meters step 100 meters
const altitudeOptions: number[] = Array.from({length: 51}, (_, i) => i * 100);



export const altitudeSlice = createSlice({
    name: 'altitude',
    initialState: {
        altitudeOptions: altitudeOptions.toReversed(),
        currentAltitudeIndex: altitudeOptions.length - 1    
    },
    reducers: {
        changeAltitude: (state, action) => {
            const newIndex = action.payload;
            if (newIndex >= 0 && newIndex < state.altitudeOptions.length) {
              state.currentAltitudeIndex = newIndex;
            }
          },
    }
});

export const { changeAltitude } = altitudeSlice.actions;
export default altitudeSlice.reducer;
