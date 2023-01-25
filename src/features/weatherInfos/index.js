import { createSlice } from '@reduxjs/toolkit'

export const weatherInfosSlice = createSlice({
    name : 'weatherInfos',
    initialState : {
        temperature : null,
        weather : null,
        wind : null
    },
    reducers : {
        getWeatherInfos : (state,action) => {
            state.temperature = action.payload.temperature
            state.weather = action.payload.weather
            state.wind = action.payload.wind
        }
    }
})

export const { getWeatherInfos } = weatherInfosSlice.actions

export default weatherInfosSlice.reducer