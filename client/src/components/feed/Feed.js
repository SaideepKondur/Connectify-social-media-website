import React, { useEffect } from 'react';
import './Feed.scss';
import Post from '../post/Post';
import Follower from '../follower/Follower';
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from '../../redux/slices/feedSlice';
import { SlUserFollow } from "react-icons/sl";

function Feed() {
    const dispatch = useDispatch();
    const feedData = useSelector(state => state.feedDataReducer.feedData);

    useEffect(() => {
        dispatch(getFeedData());
    }, [dispatch]);

    return (
        <div className="Feed">
            <div className='container'>
                <div className="left-part">
                    {feedData?.posts && feedData.posts.length > 0 ? (
                        feedData.posts.map(post => <Post key={post._id} post={post} />)
                    ) : (
                        <div className="no-posts">
                            <SlUserFollow size={225} />
                            <p>It looks a bit empty here. <br/> Follow more users to see their posts.</p>
                        </div>
                    )}
                    {console.log("feedData from feed.js try-2", feedData)}
                </div>
                <div className="right-part">
                    {feedData?.followings && feedData.followings.length > 0 && (
                        <div className="following">
                            <h3 className="title">You Are Following</h3>
                            {feedData?.followings
                                .slice()
                                .reverse()
                                .slice(0, 3)
                                .map((user) => (
                                    <Follower key={user._id} user={user} />
                                ))}
                        </div>
                    )}
                    <div className='suggestions'>
                        <h3 className='title'>Suggested For You</h3>
                        {feedData?.suggestions?.slice().reverse().slice(0, 4).map(user => <Follower key={user._id} user={user} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feed;
