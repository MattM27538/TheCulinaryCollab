import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
	const [userData, setUserData] = useState(null);
	const [profilePic, setProfilePic] = useState('');
	const [uploading, setUploading] = useState(false);
	const user = auth.currentUser;


  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
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
		<div>
		<h1>Profile Page</h1>
		<div>
		<div>
		<h2>Username: {userData || 'No username set'}</h2>
		<h2>Email: {user.email}</h2>
		</div>
		<div>
		<img
		src={profilePic || 'default-profile-pic-url'}
		alt="Profile"
		style={{ height: '100px', width: '100px', borderRadius: '50%', backgroundColor: 'transparent' }}
		onMouseOver={e => e.target.style.opacity = profilePic ? 0.6 : 1}
		onMouseOut={e => e.target.style.opacity = 1}
		onClick={() => document.getElementById('fileInput').click()}
		/>
		<input
		type="file"
		id="fileInput"
		accept="image/*"
		style={{ display: 'none' }}
		onChange={handleProfilePicChange}
		/>
		</div>
		</div>
		{uploading && <p>Uploading...</p>}
		</div>
	);
};

export default ProfilePage;

