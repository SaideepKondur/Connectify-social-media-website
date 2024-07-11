import React, { useEffect, useState } from 'react';
import Avatar from '../avatar/Avatar';
import './Follower.scss';
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser } from '../../redux/slices/feedSlice';
import { useNavigate } from 'react-router-dom';

function Follower({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const feedData = useSelector(state => state.feedDataReducer.feedData);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsFollowing(feedData.followings.some(item => item._id === user._id));
    }, [feedData, user._id]);

    function handleUserFollow() {
        dispatch(followAndUnfollowUser({
            userIdToFollow: user._id
        }));
    }

    return (
        // <div className={`Follower ${isHovered ? 'hovered' : ''}`} onClick={() => navigate(`/profile/${user._id}`)}
        <div className={`Follower ${isHovered ? 'hovered' : ''}`} 
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
            <div className='user-info' onClick={() => navigate(`/profile/${user._id}`)}>
                <Avatar src={user?.avatar?.url} />
                <p className='name'>{user?.name}</p>
            </div>
            <h5 onClick={handleUserFollow} className={isFollowing ? 'hover-link unfollow-link' : 'followlink'}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </h5>
        </div>
    );
}

export default Follower;
