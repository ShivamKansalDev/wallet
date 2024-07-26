"use client";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistorStore } from "../lib/store";
import { CircularProgress } from "@mui/material";

export default function StoreProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate persistor={persistorStore}>{children}</PersistGate>
      ) : (
        <CircularProgress size={20} />
      )}
    </Provider>
  );
}
