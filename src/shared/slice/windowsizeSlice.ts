import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WindowSize = {
    width: number;
    height: number;
}

const initialState: WindowSize = {
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    width: typeof window !== "undefined" ? window.innerWidth : 0
}

const windowsizeSlice = createSlice({
    name: 'windowsize',
    initialState,
    reducers: {
        setWindowSize: (state, action: PayloadAction<WindowSize>) => {
            state.width = action.payload.width;
            state.height = action.payload.height;
        },
    }
})

export const { setWindowSize } = windowsizeSlice.actions;
export default windowsizeSlice.reducer;