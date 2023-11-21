import React, { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove, arrayUnion, runTransaction } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './SocialPage.css';

const SocialPage = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [friendRequests, setFriendRequests] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null); // Define this state if you're using it
	const [friends, setFriends] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);  // Define this state if you're using it
	const navigate = useNavigate();
	const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';

	useEffect(() => {
		const fetchUsers = async () => {
			const usersRef = collection(firestore, 'users');
			try {
				const querySnapshot = await getDocs(usersRef);
				const usersList = querySnapshot.docs.map(doc => ({
					uid: doc.id,
					username: doc.data().username,
					profilePic: ''
				}));
				const usersWithPics = await Promise.all(
					usersList.map(async (user) => {
						const picRef = ref(storage, `profilePictures/${user.uid}`);
						try {
							const picURL = await getDownloadURL(picRef);
							return { ...user, profilePic: picURL };
						} catch (error) {
							console.error('Error fetching profile picture:', error);
							return { ...user, profilePic: defaultProfilePicUrl };
						}
					})
				);

				setUsers(usersWithPics);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		const fetchFriendsList = async () => {
			if (auth.currentUser) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				try {
					const userSnap = await getDoc(userRef);
					if (userSnap.exists() && userSnap.data().friendsList) {
						// Fetch friends' user data based on their UIDs
						const friendsUids = userSnap.data().friendsList;
						const friendsPromises = friendsUids.map(async (friendUid) => {
							const friendSnap = await getDoc(doc(firestore, 'users', friendUid));
							if (friendSnap.exists()) {
								// Get the profile picture URL, if available
								let profilePicUrl = defaultProfilePicUrl; // Your default profile picture URL
								try {
									const profilePicRef = ref(storage, `profilePictures/${friendUid}`);
									profilePicUrl = await getDownloadURL(profilePicRef);
								} catch (error) {
									console.error('Error fetching profile picture for friend:', error);
									// If there's an error, the default profile picture URL will be used
								}
								return {
									uid: friendUid,
									username: friendSnap.data().username,
									profilePic: profilePicUrl
								};
							} else {
								return null;
							}
						});

						const friendsData = await Promise.all(friendsPromises);
						setFriends(friendsData.filter(Boolean)); // Filter out any null values and update state
					}
				} catch (error) {
					console.error('Error fetching friends list:', error);
				}
			}
		};


		fetchFriendsList();

		const fetchFriendRequests = async () => {
			if (auth.currentUser) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				try {
					const userSnap = await getDoc(userRef);
					if (userSnap.exists() && userSnap.data().friendRequests) {
						setFriendRequests(userSnap.data().friendRequests);
					}
				} catch (error) {
					console.error('Error fetching friend requests:', error);
				}
			}
		};

		fetchUsers();
		fetchFriendRequests();
	}, []);

	const handleAccept = async (requestingUserid) => {
		console.log("handle accept called <---");
		console.log("Current user: ", auth.currentUser);
		console.log("Requesting user: ", requestingUserid);
		const currentUserid = auth.currentUser.uid;

		const currentUserRef = doc(firestore, 'users', currentUserid);
		const requestingUserRef = doc(firestore, 'users', requestingUserid);
		try {
			await runTransaction(firestore, async (transaction) => {
				const currentUserDoc = await transaction.get(currentUserRef);
				const requestingUserDoc = await transaction.get(requestingUserRef);

				if (!currentUserDoc.exists() || !requestingUserDoc.exists()) {
					throw new Error('Document not found');
				}
				const currentUserData = currentUserDoc.data();
				const requestingUserData = requestingUserDoc.data();
				const updatedFriendRequests = currentUserData.friendRequests.filter(req => req.uid !== requestingUserid);
				transaction.update(currentUserRef, {
					friendsList: arrayUnion(requestingUserid),
					friendRequests: updatedFriendRequests
				});
				transaction.update(requestingUserRef, {
					friendsList: arrayUnion(currentUserid)
				});
			});
			console.log("Friend request accepted");
			setFriendRequests(friendRequests.filter(req => req.uid !== requestingUserid));
			const newFriendData = {
				uid: requestingUserid,
				username: requestingUserid.username,
				profilePic: requestingUserid.profilePic || defaultProfilePicUrl
			};
			setFriends([...friends, newFriendData]);
		} catch (error) {
			console.error("Error accepting friend request: ", error);
		}
	};


	const handleReject = async (requestingUserId) => {
		const currentUserRef = doc(firestore, 'users', auth.currentUser.uid);
		try {
			const currentUserSnap = await getDoc(currentUserRef);
			if (currentUserSnap.exists()) {
				const currentUserData = currentUserSnap.data();
				const updatedFriendRequests = currentUserData.friendRequests.filter(request => request.uid !== requestingUserId);

				await updateDoc(currentUserRef, {
					friendRequests: updatedFriendRequests
				});
				setFriendRequests(updatedFriendRequests);

				console.log("Friend request rejected");
			} else {
				console.log("Current user document not found");
			}
		} catch (error) {
			console.error("Error rejecting friend request: ", error);
		}
	};

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
		navigate(`/user/${user.uid}`);
	};

	const filteredUsers = users.filter(user =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="social-page-container">
		<div className="users-section">
		<h1>All Users</h1>
		<input
		type="text"
		placeholder="Search users..."
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
		/>
		<ul className="users-list">
		{filteredUsers.map((user, index) => (
			<li key={index} className="user-item" onClick={() => handleUserClick(user)}>
			<span className="username">{user.username}</span>
			<img src={user.profilePic || defaultProfilePicUrl} alt={user.username} className="user-profile-picture" />
			</li>
		))}
		</ul>

		{}
		{/* ... existing users list and user search logic ... */}
		</div>

		<div className="friend-requests-section">
		<button onClick={() => setShowDropdown(!showDropdown)}>Friend Requests</button>
		{showDropdown && (
			<div className="friend-requests-dropdown">
			<ul>
			{friendRequests.map((request, index) => (
				<li key={index}>
				{request.username} {/* Display the username of the request sender */}
				<button onClick={() => handleAccept(request.uid)}>Accept</button>
				<button onClick={() => handleReject(request.uid)}>Reject</button>
				</li>
			))}
			</ul>
			</div>
		)}

		</div>
		<div className="friends-list">
		<h2>My Friends</h2>
		<ul>
		{friends.map((friend, index) => (
			<li key={index} className="friend-item">
			<span className="friend-username">{friend.username}</span>
			<img src={friend.profilePic} alt={`${friend.username}'s Profile`} className="friend-profile-picture" />
			</li>
		))}
		</ul>
		</div>
		</div>
	);
};

export default SocialPage;

