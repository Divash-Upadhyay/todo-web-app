// src/store/persistedReducer.ts
import storage from "redux-persist/lib/storage"; // Local storage
import { persistReducer } from "redux-persist";
import authReducer from "./authSlice";
import todoReducer from "./todoSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","todos"],
};


export const persistedAuthReducer = persistReducer(persistConfig, authReducer);
export const persistedTodoReducer = persistReducer(persistConfig, todoReducer);
