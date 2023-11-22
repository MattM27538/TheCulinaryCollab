import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProfilePage.css';
const defaultProfilePic = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';

const ProfilePage = () => {
	const [userData, setUserData] = useState(null);
	const [profilePic, setProfilePic] = useState('');
	const [uploading, setUploading] = useState(false);
	const [bio, setBio] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const user = auth.currentUser;

const handleEditBio = () => {
  setIsEditing(true);
};
const handleSaveBio = async () => {
  const userRef = doc(firestore, 'users', user.uid);
  try {
    await updateDoc(userRef, { bio: bio });
    setIsEditing(false);
  } catch (error) {
    console.error('Error saving bio: ', error);
  }
};
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
	      if (userSnap.exists()) {
		      const userData = userSnap.data();
		      setUserData(userData.originalUsername);
		      setBio(userData.bio || '');
		      setUserData(userData.originalUsername);
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          try {
            const photoURL = await getDownloadURL(storageRef);
            setProfilePic(photoURL);
          } catch (error) {
            console.error('Error fetching profile picture: ', error);
          }
        }
      }
    };
    fetchUserData();
  }, [user]);
	const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        setUploading(true);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(snapshot.ref);
            setProfilePic(photoURL);

            const userRef = doc(firestore, 'usernames', user.displayName.toLowerCase());
            await updateDoc(userRef, { profilePic: photoURL });
            setUploading(false);
        } catch (error) {
            console.error("Error uploading file: ", error);
            setUploading(false);
        }
    };

	if (!user) {
		return <div>Please log in to view this page.</div>;
	}
return (
  <div className="profile-container">
    <img
      src={profilePic || defaultProfilePic}
      alt="Profile"
      className="profile-picture"
      onClick={() => document.getElementById('fileInput').click()}
    />
    <input
      type="file"
      id="fileInput"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handleProfilePicChange}
    />
    {uploading && <p>Uploading...</p>}

    <h2 className="username">{userData || 'No username set'}</h2>
    <p className="email">{user.email}</p>

    <div className="bio-box">
      <h2>Bio:</h2>
      {isEditing ? (
        <>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bio-textarea"
          />
          <button onClick={handleSaveBio}>Save</button>
        </>
      ) : (
        <>
          <p className={`bio-content ${!bio && 'bio-empty'}`}>
            {bio || 'No bio set'}
          </p>
          <button onClick={handleEditBio}>Edit</button>
        </>
      )}
    </div>
  </div>
);
};

export default ProfilePage;

