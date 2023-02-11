import { createSlice } from '@reduxjs/toolkit'

export const citySlice = createSlice({
    name : 'city',
    initialState : { 
        city: 'Algiers',
    },
    reducers : {
        newCity: (state, action) => {
            state.city = action.payload.city
        },
    }
})

export const { newCity } = citySlice.actions

export default citySlice.reducer