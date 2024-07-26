"use client";
import { createSlice } from "@reduxjs/toolkit";

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
    }
});

export const signerActions = signerSlice.actions;