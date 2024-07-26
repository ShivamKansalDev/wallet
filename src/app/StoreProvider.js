"use client";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistorStore } from "../lib/store";
import { CircularProgress, Grid } from "@mui/material";

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
        <Grid container justifyContent="center" alignContent="center" height={'100vh'}>
          <CircularProgress size={20}/>
        </Grid>
      )}
    </Provider>
  );
}
