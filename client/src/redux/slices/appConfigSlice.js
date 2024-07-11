import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";


// here 'user/getMyInfo' is just the name of your thunk and not the path. you can give any random name here
export const getMyInfo = createAsyncThunk('user/getMyInfo', async () => {
    try{
        // here '/user/getMyInfo' is the path which will be used to get the info.
        const response = await axiosClient.get('/user/getMyInfo');
        console.log('api called data', response);
        return response.result;
    } catch (error) {
        console.log("getting error from getMyInfo thunk")
        return Promise.reject(error);
    }
})



export const updateMyProfile = createAsyncThunk('user/updateMyProfile', async (body) => {
    try{
        const response = await axiosClient.put('/user/', body);
        return response.result;
    } catch (error) {
        return Promise.reject(error);
    }
})

export const deleteMyProfile = createAsyncThunk('user/deleteMyProfile', async () => {
    try{
        const response = await axiosClient.delete('/user/');
        return response.result;
    } catch (error) {
        console.error('Error deleting user profile @ appConfigSlice.js:', error);
        return Promise.reject(error);
    }
})

const appConfigSlice = createSlice({
    name:'appConfigSlice',
    initialState: {
        isLoading: false,
        toastData: {},
        myProfile: null
        // myProfile: {}
    },
    reducers:{
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        showToast: (state, action) => {
            state.toastData = action.payload;

        },
        clearProfile: (state) => {
            console.log('state.myProfile before @ appconfigslice', state.myProfile )
            state.myProfile = null;
            console.log('state.myProfile after @ appconfigslice', state.myProfile )
        }
    },

    // ExtraReducers are used in a slice if you want to use a seperate async thunk within that slice. 
    // Foreg. In this case we are using the getMyInfo async thunk to get the user info and store it in 'myProfile' of the appConfigSlice
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            state.myProfile = action.payload.user;
        })
        .addCase(updateMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload.user;
        })
        .addCase(deleteMyProfile.fulfilled, (state) => {
            state.myProfile = null; 
        });
    },
});

export default appConfigSlice.reducer;

export const {setLoading, showToast, clearProfile} = appConfigSlice.actions;