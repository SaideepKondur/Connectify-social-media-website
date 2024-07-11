const { populate } = require("dotenv");
const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const cloudinary = require('cloudinary').v2;
const { mapPostOutput } = require ("../utils/Utils")

const followOrUnfollowUserController = async (req, res) => {
    try {
        const {userIdToFollow} = req.body;
        const curUserId = req._id;
    
        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if(curUserId === userIdToFollow) {
            return res.send(error(409, 'Users cannot follow themselves'));
        }


        if(!userToFollow) {
            return res.send(error(404, 'User to follow not found'));
        }

        // followings => All the people whom the user is following, followers => All the people who are following the user.
        if(curUser.followings.includes(userIdToFollow)) { //already followed.
            const followingIndex = curUser.followings.indexOf(userIdToFollow); 
            curUser.followings.splice(followingIndex, 1);
    
            const followerIndex = userToFollow.followers.indexOf(curUser);  
            userToFollow.followers.splice(followerIndex, 1);
    
            
        } else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);

            
        }

        await userToFollow.save();
        await curUser.save();
        
        return res.send(success(200, {user: userToFollow}))
        
        
    } catch (e) {
        return res.send(error(500, e.message));
    };

};

const getPostsOfFollowing = async (req, res) => {
    try {
        const curUserId = req._id;

        const curUser = await User.findById(curUserId).populate('followings');
    
        const fullPosts = await Post.find({
            // Inside moongoose different operations are available, 'in' is one of them.
            'owner': {
                $in: curUser.followings
            },
        }).populate('owner');

        const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

        // console.log('posts here', posts)
        curUser.posts = posts;

        const followingsIds = curUser.followings.map(item => item._id);
        followingsIds.push(req._id);

        const suggestions = await User.find({
            // Inside moongoose different operations are available, 'nin : fullform notin' is one of them.
            _id: {
                $nin: followingsIds
            },
        });
    // Whenever you use await user.findById, then mongoDb brings in a lot of info inside the curUser. 
    // So if we use curUser._doc then we will diectly only get the useful information since it is stored inside the _doc,
        return res.send(success(200, {...curUser._doc, suggestions, posts}));
        
    } catch (e) {
        return res.send(error(500, e.message));
    }

};

const getMyPosts = async (req, res) => {
    try {
        const curUserId = req._id;
        const allUserPosts = await Post.find({
            owner: curUserId
        }).populate('likes');

        return res.send(success(200, {allUserPosts}))
        
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("the user Id geting in is:", userId);
        if(!userId) {
            // return res.send( 'userId is required')
            return res.send(error(400, 'userId is required'))
        }

        const allUserPosts = await Post.find({
            owner: userId
        }).populate('likes');

        return res.send(success(200, {allUserPosts}))
        
    } catch (e) {
        console.log('the error is:', e)
        return res.send(error(500, e.message));
    }
}

const deleteMyProfile = async (req, res) => {
    try {
        // console.log( "the incoming request", req);
        const curUserId = req._id;
        console.log( "the userId", curUserId);
        const curUser = await User.findById(curUserId);
        console.log( "the user:", curUser);
        
        // delete all posts
        await Post.deleteMany({
            owner: curUserId
        })

        // followings => All the people whom the user if following, followers => All the people who are following the user.

        // removed myself from my followers followings list
        // console.log( "the user followers are:", curUser.followers);
        curUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            if (follower) {
                const index = follower.followings.indexOf(curUserId);
                follower.followings.splice(index,1);
                await follower.save();
            }
        })

        // remove myself from my followings followers list
        curUser.followings.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            if (following) {
                const index = following.followers.indexOf(curUserId);
                following.followers.splice(index, 1);
                await following.save();
            }
        })

        // remove myself from all likes
        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            await post.save();
        })

        //delete the user
        await curUser.deleteOne();

        //delete the cookie as well
        res.clearCookie('jwt', {
            httpOnly:  true,
            secure: true,
        });
        

        return res.send(success(200, 'user deleted'))

    } catch (e) {
        console.log('the error is:', e)
        return res.send(error(500, e.message));
    }


}

const getMyInfo = async (req, res) => {
    try{
        const user = await User.findById(req._id);
        return res.send(success(200, {user}));
    } catch(e){
        return res.send(error(500, e.message));
    }
}

const updateUserProfile = async (req, res) => {
    try{
        const {name, bio, userImg} = req.body;

        const user = await User.findById(req._id);

        if(name) {
            user.name = name;
        }
        if(bio) {
            user.bio = bio;
        }
        if(userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg,{
                folder: 'profileImg'
            })
            user.avatar ={
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }

        }
        await user.save();
        return res.send(success(200,{user}))

    }catch(e){
        return res.send(error(500, e.message));
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }

        const user = await User.findById(userId).populate({
            path:'posts',
            populate: {
                path: 'owner'
            }
        });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const fullPosts = user.posts;
        const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

        return res.send(success(200, {...user._doc, posts}))

    } catch (e) {
        return res.send(error(500, e.message));
    }

    
}

module.exports = {
    followOrUnfollowUserController,
    getPostsOfFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateUserProfile,
    getUserProfile
}