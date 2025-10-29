import { createSlice } from "@reduxjs/toolkit";

interface TopbarState {
    isShowUserPopup: boolean;
    isShowLangPopup: boolean;
    activeLang: string;
}

const initialState: TopbarState = {
    isShowLangPopup: false,
    isShowUserPopup: false,
    activeLang: 'English'
}

const topbarSlice = createSlice({
    name: 'topbar',
    initialState,
    reducers: {
        toggleShowUserPopup: (state) => {
            state.isShowUserPopup = !state.isShowUserPopup;
        },
        toggleShowLangPopup: (state) => {
            state.isShowLangPopup = !state.isShowLangPopup;
        },
        hideUserPopup: (state) => {
            state.isShowUserPopup = false;
        }, 
        hideLangPopup: (state) => {
            state.isShowLangPopup = false;
        },
        changeActiveLang: (state, action) => {
            state.activeLang = action.payload;
        }
    }
})

export const { toggleShowLangPopup, toggleShowUserPopup, hideUserPopup, hideLangPopup, changeActiveLang } = topbarSlice.actions;
export default topbarSlice.reducer;