import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import './SocialPage.css';
const SocialPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const defaultProfilePicUrl =
  'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';

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

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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
    </div>
  );
};

export default SocialPage;
