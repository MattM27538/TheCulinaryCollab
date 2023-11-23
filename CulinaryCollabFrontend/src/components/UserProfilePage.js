import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, addDoc, getDocs, updateDoc, arrayUnion, collection } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import ViewRecipeModal from './ViewRecipeModal';
import './UserProfilePage.css';
const UserProfilePage = () => {	       
	const [originalUsername, setOriginalUsername] = useState('');
	const { uid } = useParams();
	const navigate = useNavigate();
	const [userProfile, setUserProfile] = useState(null);
	const [profilePic, setProfilePic] = useState('');
	const [personalRecipes, setPersonalRecipes] = useState([]);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';
	const handleSendFriendRequest = async (recipientId) => {
		if (!auth.currentUser) {
			alert("No user logged in");
			return;
		}


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


			const currentUserData = currentUserSnap.data();
			if (currentUserData.friendsList && currentUserData.friendsList.includes(recipientId)) {
				alert("You are already friends with this user.");
				return;
			}
			if (currentUserData.friendRequests && currentUserData.friendRequests.some(request => request.uid === recipientId)) {
				alert("You have already sent a friend request to this user.");
				return;
			}
			const request = {
				uid: auth.currentUser.uid,
				username: currentUserData.username
			};
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
					const querySnapshot = await getDocs(personalRecipesRef);
					const fetchedRecipes = querySnapshot.docs
						.map(doc => ({ id: doc.id, ...doc.data() }))
						.filter(recipe => recipe.id !== 'initial');
					setPersonalRecipes(fetchedRecipes);
				} catch (error) {
					console.error('Error fetching personal recipes:', error);
				}
			}
		};

		fetchPersonalRecipes();
	}, [uid, userProfile]);

	const openViewModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsViewModalOpen(true);
	};

	const closeViewModal = () => {
		setIsViewModalOpen(false);
		setSelectedRecipe(null);
	};
	const canSaveRecipe = (recipe) => {
		return !recipe.createdBy || (recipe.createdBy.email !== auth.currentUser?.email);
	};


	const saveRecipe = async (recipeData) => {
		if (!auth.currentUser) {
			console.error("No user logged in");
			return;
		}

		const user = auth.currentUser;
		const extendedRecipeData = {
			...recipeData,
			createdBy: {
				uid: user.uid,
				username: userProfile.username,
				email: userProfile.email
			}
		};

		try {
			const savedRecipesRef = collection(firestore, `users/${user.uid}/savedRecipes`);
			await addDoc(savedRecipesRef, extendedRecipeData);
			console.log('Recipe saved successfully');
		} catch (error) {
			console.error('Error saving recipe: ', error);
		}
	};

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

		{/* Display personal recipes in a grid */}
		<div className="personal-recipes-grid">
		{personalRecipes.map(recipe => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{}
			</div>
		))}
		</div>

		{/* Recipe view modal */}
		<ViewRecipeModal 
		isOpen={isViewModalOpen} 
		onClose={closeViewModal} 
		recipe={selectedRecipe} 
		onSave={() => saveRecipe(selectedRecipe)} 
		showSaveOption={selectedRecipe && canSaveRecipe(selectedRecipe)}
		/>
		</div>
	);
};

export default UserProfilePage;
