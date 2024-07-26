"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOwner: false
}

export const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        setIsOwner: (state, action) => {
            state.isOwner = action.payload;
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const ownerActions = ownerSlice.actions;