import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "AuthSlice",
    initialState: {
        userData: JSON.parse(localStorage.getItem("userData")) || null
    },
    reducers : {
        addUserData: (state, action) => {
            state.userData = action.payload
            localStorage.setItem("userData", JSON.stringify(action.payload))
        },
        removeuserData: (state, action) => {
            state.userData = null
            localStorage.removeItem("userData")
        }
    }
})

export const {addUserData, removeuserData} = authSlice.actions;
export default authSlice.reducer;