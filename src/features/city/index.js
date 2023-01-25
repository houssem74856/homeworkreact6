import { createSlice } from '@reduxjs/toolkit'

export const citySlice = createSlice({
    name : 'city',
    initialState : { 
        city: 'Algiers',
        lat : null,
        lon : null
    },
    reducers : {
        newCity: (state, action) => {
            state.city = action.payload.city
        },
        newLonLat : (state,action) => {
            state.lon = action.payload.lon
            state.lat = action.payload.lat
        }
    }
})

export const { newCity,newLonLat } = citySlice.actions

export default citySlice.reducer