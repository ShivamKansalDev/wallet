"use client";
import { createSlice } from "@reduxjs/toolkit";
// import storage from 'redux-persist/lib/storage';
import {storage} from "@/lib/store";

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