import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./User";
export const store = configureStore({
    reducer: {
        user: UserReducer,
        update:UserReducer,
        add:UserReducer,
    }
})