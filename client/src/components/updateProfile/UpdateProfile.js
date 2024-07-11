import React, { useEffect, useState } from 'react';
import './UpdateProfile.scss';
import user from "../../assets/user.png";
import { useSelector, useDispatch } from 'react-redux';
import { deleteMyProfile, updateMyProfile, clearProfile } from '../../redux/slices/appConfigSlice';
import { useNavigate } from 'react-router-dom';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';
import ConfirmationModel from '../confirmationModel/ConfirmationModel';

function UpdateProfile() {
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userImg, setUserImg] = useState('');
    const [profileDeleted, setProfileDeleted] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setName(myProfile?.name || '');
        setBio(myProfile?.bio || '');
        setUserImg(myProfile?.avatar?.url);
    }, [myProfile]);

    useEffect(() => {
        if (profileDeleted) {
            navigate('/login');
        }
    }, [profileDeleted, navigate]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setUserImg(fileReader.result);
                console.log('img data', fileReader.result);
            }
        }
    }

    function capitalizeWords(value) {
        return value.replace(/\b\w/g, char => char.toUpperCase());
    }

    function handleSubmit(e) {
        e.preventDefault();
        const capitalizedUserName = capitalizeWords(name);
        dispatch(updateMyProfile({
            name: capitalizedUserName,
            bio,
            userImg
        }));
    }

    // Function to limit name to 18 characters
    function handleNameChange(e) {
        const newName = e.target.value;
        if (newName.length <= 18) {
            setName(newName);
        }
    }

    function handleBioChange(e) {
        const newBio = e.target.value;
        if (newBio.length <= 150) {
            setBio(newBio);
        }
    }

    async function handleConfirmDelete() {
        const profile = await dispatch(deleteMyProfile());
        dispatch(clearProfile());
        removeItem(KEY_ACCESS_TOKEN);
        profile.payload === 'user deleted' ? navigate('/login') : navigate('/');
    }

    return (
        <div className='UpdateProfile'>
            <div className="container">
                <div className="left-part">
                    <div className="input-user-img">
                        <label htmlFor="inputImg" className="labelImg"><img src={userImg ? userImg : user} alt={name} /></label>
                        <input className="inputImg" id="inputImg" type='file' accept='image/*' onChange={handleImageChange} />
                        <h4>Profile Picture</h4>
                    </div>
                </div>
                <div className="right-part">
                    <form onSubmit={handleSubmit}>
                        <h3>Name</h3>
                        <input value={name} type="text" className="input-text" placeholder='Your Name' onChange={handleNameChange} />
                        <h3>Bio</h3>
                        <input value={bio} type="text" className="input-text" placeholder='Describe yourself…' onChange={handleBioChange} />
                        {/* <input value={bio} type="text" className="input-text" placeholder='Describe yourself…' onChange={(e) => setBio(e.target.value)} /> */}
                        <input type='submit' className="btn-primary" onClick={handleSubmit} />
                    </form>
                    <button className="delete-account btn-primary" onClick={() => setShowModel(true)}>Delete Account</button>
                </div>
            </div>
            {showModel && <ConfirmationModel onConfirm={handleConfirmDelete} onCancel={() => setShowModel(false)} />}
        </div>
    );
}

export default UpdateProfile;
