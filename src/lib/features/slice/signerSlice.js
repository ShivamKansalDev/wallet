"use client";
import { createSlice } from "@reduxjs/toolkit";
// import storage from 'redux-persist/lib/storage';
import {storage} from "@/lib/store";

const initialState = {
    signer: null
}

export const signerSlice = createSlice({
    name: 'signer',
    initialState,
    reducers: {
        setSigner: (state, action) => {
            state.signer = action.payload;
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const signerActions = signerSlice.actions;