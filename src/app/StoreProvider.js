'use client'
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from 'redux-persist';

import { makeStore } from '../lib/store';

export default function StoreProvider({ children }) {

  const store = makeStore();
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}