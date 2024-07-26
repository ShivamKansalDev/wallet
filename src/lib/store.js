"use client";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { signerSlice } from './features/slice/signerSlice';
import { ownerSlice } from './features/slice/ownerSlice';

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

export const storage = typeof window !== "undefined" ? createWebStorage(" ") : createNoopStorage();

// const storage = persistStorage;

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const reducer = combineReducers({
  [signerSlice?.name]: signerSlice?.reducer,
  [ownerSlice?.name]: ownerSlice?.reducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  })
}

export const store = makeStore();

export const persistorStore = persistStore(store);

export const logout = async() => {
  let persistor = persistStore(store);
  await persistor.purge();
}

export const interceptLoading = (value) => {
  const store = makeStore();
//   store.dispatch(loadingActions.setLoading(value));
}