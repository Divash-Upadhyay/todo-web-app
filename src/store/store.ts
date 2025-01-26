// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { persistedAuthReducer, persistedTodoReducer } from "./persistedReducer";


const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    todos: persistedTodoReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);

export default store;
