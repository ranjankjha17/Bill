import { configureStore} from '@reduxjs/toolkit'
import billReducer from '../reducers/bill'
import tempOrderReducer from '../reducers/temp_order'
import authSlice from '../reducers/login'
import logger from 'redux-logger'
const rootReducer={
    bill:billReducer,
    tempOrder:tempOrderReducer,
    auth:authSlice,
}


const store=configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({ serializableCheck: false}).concat(logger),
    devTools: process.env.NODE_ENV !== "production",

})



export default store