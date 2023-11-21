import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import './UserProfilePage.css';
const UserProfilePage = () => {
        const { uid } = useParams();
        const navigate = useNavigate();
        const [userProfile, setUserProfile] = useState(null);
        const [profilePic, setProfilePic] = useState('');
	const [personalRecipes, setPersonalRecipes] = useState([]);
        const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';
        const handleSendFriendRequest = async (recipientId) => {
                if (!auth.currentUser) {
                        alert("No user logged in");
                        return;
                }

                // Ensure recipientId is the UID of the user to receive the friend request
                if (recipientId === auth.currentUser.uid) {
                        alert("You cannot send a friend request to yourself.");
                        return;
                }

                const currentUserRef = doc(firestore, 'users', auth.currentUser.uid);
                const recipientRef = doc(firestore, 'users', recipientId);

                try {
                        const currentUserSnap = await getDoc(currentUserRef);
                        if (!currentUserSnap.exists()) {
                                alert("Current user not found");
                                return;
                        }

                        // Check if the recipient is already in the current user's friends list
                        const currentUserData = currentUserSnap.data();
                        if (currentUserData.friendsList && currentUserData.friendsList.includes(recipientId)) {
                                alert("You are already friends with this user.");
                                return;
                        }

                        // Check if a friend request has already been sent
                        if (currentUserData.friendRequests && currentUserData.friendRequests.some(request => request.uid === recipientId)) {
                                alert("You have already sent a friend request to this user.");
                                return;
                        }

                        // Create a request object using the current user's data
                        const request = {
                                uid: auth.currentUser.uid,
                                username: currentUserData.username
                        };

                        // Send the friend request to the recipient's friendRequests array
                        await updateDoc(recipientRef, {
                                friendRequests: arrayUnion(request)
                        });

                        alert("Friend request sent successfully!");
                } catch (error) {
                        console.error("Error sending friend request: ", error);
                        alert("Failed to send friend request.");
                }
        };

        useEffect(() => {
                const fetchUserProfile = async () => {
                        try {
                                const userRef = doc(firestore, 'users', uid);
                                const userSnap = await getDoc(userRef);

                                if (userSnap.exists()) {
                                        setUserProfile(userSnap.data());

                                        try {
                                                const profilePicRef = ref(storage, `profilePictures/${uid}`);
                                                const picUrl = await getDownloadURL(profilePicRef);
                                                setProfilePic(picUrl);
                                        } catch {
                                                setProfilePic(defaultProfilePicUrl);
                                        }
                                }
                        } catch (error) {
                                console.error('Error fetching user profile:', error);
                        }
                };

                fetchUserProfile();
        }, [uid]);

useEffect(() => {
    const fetchPersonalRecipes = async () => {
      if (userProfile && auth.currentUser && userProfile.friendsList && userProfile.friendsList.includes(auth.currentUser.uid)) {
        const personalRecipesRef = collection(firestore, `users/${uid}/personalRecipes`);
        try {
            const querySnapshot = await getDoc(personalRecipesRef);
            const fetchedRecipes = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPersonalRecipes(fetchedRecipes);
        } catch (error) {
            console.error('Error fetching personal recipes:', error);
        }
      }
    };

    fetchPersonalRecipes();
  }, [uid, userProfile]);


        if (!userProfile) {
                return <div>Loading...</div>;
        }

        return (
                <div className="user-profile-page">
                <div className="user-info-box">
                <img src={profilePic || defaultProfilePicUrl} alt={`${userProfile.username}'s Profile`} className="profile-pic" />
                <h1>{userProfile.username}</h1>
                <p className="bio">{userProfile.bio || 'No bio available'}</p>
                </div>
                <div className="user-action-buttons">
                <button className="back-button" onClick={() => navigate('/social')}>Back to Social Page</button>
                <button className="send-friend-request" onClick={() => handleSendFriendRequest(uid)}>Send Friend Request</button>
                </div>
		      {auth.currentUser && userProfile.friendsList && userProfile.friendsList.includes(auth.currentUser.uid) && (
        <div className="personal-recipes-section">
          <h2>Personal Recipes</h2>
          <ul>
            {personalRecipes.map(recipe => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </ul>
        </div>
      )}
                </div>
        );
};
export default UserProfilePage;

