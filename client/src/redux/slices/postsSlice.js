import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";

//This is not your profile, this is users profile which you will get when you go to a users profile.
export const getUserProfile = createAsyncThunk('user/getUserProfile', async (body) => {
    try{
        const response = await axiosClient.post('/user/getUserProfile', body);
        console.log('user profile', response);
        return response.result;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return Promise.reject(error);
    }
});

export const likeAndUnlikePost = createAsyncThunk('post/likeAndUnlike', async(body) => {
    try{
        const response = await axiosClient.post('/posts/like', body);
        return response.result.post; 
    } catch (error) {
        return Promise.reject(error);
    }
});

const postsSlice = createSlice({
    name:'postsSlice',
    initialState: {
        userProfile: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userProfile = action.payload;
        })
        .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
            const post = action.payload;
            console.log('liked post',post)
            const index = state?.userProfile?.posts?.findIndex(item => item._id === post._id);
            // If index !== -1, it means a post with the same _id as post._id exists in the array
            if(index != undefined && index != -1) {
                state.userProfile.posts[index] = post;
            }

        })
    },
});

export default postsSlice.reducer;
