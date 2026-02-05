import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientSlice.js";
import caseReducer from "./slices/caseSlice.js";
import documentReducer from "./slices/documentSlice.js";
import taskReducer from "./slices/taskSlice.js";
import teamReducer from "./slices/teamSlice.js";
import appointmentReducer from "./slices/appointmentSlice.js";
import dashboardReduer from "./slices/dashboardSlice.js";
import authReducer from "./slices/authSlice.js";
import assistantTaskSlice from "./slices/assistantSlices/assistantTaskSlice.js";


const store = configureStore({
    reducer : {
        clients : clientsReducer,
        cases : caseReducer,
        documents : documentReducer,
        tasks : taskReducer,
        team : teamReducer,
        auth : authReducer,
        appointments : appointmentReducer,
        dashboard : dashboardReduer,
        assistantTasks : assistantTaskSlice 
    },

    middleware : (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck : false,
        })
    }
});

export default store;