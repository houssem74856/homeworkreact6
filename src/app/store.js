import { configureStore } from '@reduxjs/toolkit'
import cityReducer from '../features/city'
import weatherInfosReducer from '../features/weatherInfos'

export default configureStore({
    reducer : {
        city : cityReducer,
        weatherInfos : weatherInfosReducer,
    },
})