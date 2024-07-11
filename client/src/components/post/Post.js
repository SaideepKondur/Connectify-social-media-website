import React from 'react';
import Avatar from '../avatar/Avatar';
// import background from '../../assets/background.jpg'
import './Post.scss';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { likeAndUnlikePost } from '../../redux/slices/postsSlice';
// import toast from 'react-hot-toast';
// import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';

function Post({post}) {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handlePostLiked() {
        // dispatch(showToast({
        //     type: TOAST_SUCCESS,
        //     message: 'liked or unliked'
        // }))
        dispatch(likeAndUnlikePost({
            postId: post._id
        }))
    }

  return (
    <div className='Post'>
        <div className="heading" onClick={() => navigate(`/profile/${post.owner._id}`)}>
            <Avatar src= {post.owner?.avatar?.url} />
            <h4>{post.owner?.name}</h4>
        </div>
        <div className="content">
            <img src={post?.image?.url} alt="" />
        </div>
        <div className="footer">
            <div className="like" onClick={handlePostLiked}>
                {post.isLiked ? <FaHeart style={{color: 'red'}} className='icon'/> : <FaRegHeart className='icon'/>}
                <h4>{`${post.likesCount} likes`}</h4>  
            </div>
            <p className="caption">{post.caption}</p>
            <h6 className='time-ago'>{post?.timeAgo}</h6>
        </div>
    </div>
  )
}

export default Post