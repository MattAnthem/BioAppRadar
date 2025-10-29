import { createSlice } from "@reduxjs/toolkit";

export type AlertType = "info" | "error" | "success"

interface AlertState {
    isShow: boolean;
    alertType: AlertType; 
    message: string;
}

const initialState: AlertState = {
    alertType: 'info',
    isShow: false,
    message: ''
}

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        displayAlert: (state, action) => {
            const { alertType, message } = action.payload;
            state.isShow = true;
            state.alertType = alertType;
            state.message = message;
        },
        hideAlert: (state) => {
            state.isShow = false
        }
    }
})

export const { displayAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;