import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOGIfnmr_hkf85h6-7wngePIvCPDKEb8k",
    authDomain: "thequestionpaper-409f0.firebaseapp.com",
    databaseURL: "https://thequestionpaper-409f0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thequestionpaper-409f0",
    storageBucket: "thequestionpaper-409f0.appspot.com",
    messagingSenderId: "798858195313",
    appId: "1:798858195313:web:65f7dd64b82f6e7f4ac6d0",
    measurementId: "G-3R5D88WF9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profilePicture = document.getElementById('profilePicture');
    const logoutButton = document.getElementById('logoutButton');
    const uploadButton = document.getElementById('uploadButton');
    const profilePicInput = document.getElementById('profilePicInput');
    const editProfileButton = document.getElementById('editProfileButton');

    // Create a new edit profile section
    const editProfileContainer = document.createElement('div');
    editProfileContainer.classList.add('edit-profile-container');
    editProfileContainer.innerHTML = `
        <h2>Edit Profile</h2>
        <label for="editFirstName">First Name:</label>
        <input type="text" id="editFirstName" placeholder="First Name" />
        <label for="editLastName">Last Name:</label>
        <input type="text" id="editLastName" placeholder="Last Name" />
        <button id="saveProfileButton">Save Changes</button>
        <button id="cancelEditButton">Cancel</button>
    `;
    editProfileContainer.style.display = 'none'; // Hide initially
    document.querySelector('.profile-container').appendChild(editProfileContainer); // Append to profile container

    // Check user authentication status
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    profileName.textContent = `${userData.firstName} ${userData.lastName}`;
                    profileEmail.textContent = user.email;
                    profileFirstName.textContent = userData.firstName || 'Not Available';
                    profileLastName.textContent = userData.lastName || 'Not Available';

                    // Display profile picture if available
                    if (userData.profilePicture) {
                        profilePicture.src = userData.profilePicture;
                    }
                } else {
                    console.error('User document not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            // Redirect to signin if not logged in
            window.location.href = 'signin.html';
        }
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'signin.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    });

    // Handle profile picture upload
    uploadButton.addEventListener('click', () => {
        profilePicInput.click(); // Trigger file input click
    });

    profilePicInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];

        if (file) {
            const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);

            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);

                // Update user document with new profile picture URL
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userDocRef, { profilePicture: downloadURL });

                // Update the profile picture displayed on the page
                profilePicture.src = downloadURL;
                alert('Profile picture uploaded successfully!');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    });

    // Handle Edit Profile button
    editProfileButton.addEventListener('click', () => {
        editProfileContainer.style.display = 'block'; // Show edit profile section
        document.getElementById('editFirstName').value = profileFirstName.textContent;
        document.getElementById('editLastName').value = profileLastName.textContent;
    });

    // Handle Save Changes button
    document.getElementById('saveProfileButton').addEventListener('click', async () => {
        const updatedFirstName = document.getElementById('editFirstName').value;
        const updatedLastName = document.getElementById('editLastName').value;

        const user = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);

        try {
            await updateDoc(userDocRef, {
                firstName: updatedFirstName,
                lastName: updatedLastName,
            });

            // Update displayed profile info
            profileFirstName.textContent = updatedFirstName;
            profileLastName.textContent = updatedLastName;
            profileName.textContent = `${updatedFirstName} ${updatedLastName}`;

            // Hide edit profile section
            editProfileContainer.style.display = 'none';
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });

    // Handle Cancel button
    document.getElementById('cancelEditButton').addEventListener('click', () => {
        editProfileContainer.style.display = 'none'; // Hide edit profile section
    });
});

// Add the following inside the onAuthStateChanged function after fetching user data

// Fetch and display user downloads
const downloadsList = document.getElementById('downloadsList');
downloadsList.innerHTML = ''; // Clear the list before populating

try {
    const downloadsRef = doc(db, 'users', user.uid); // Reference to user document
    const userDoc = await getDoc(downloadsRef);
    const userDownloads = userDoc.data().downloads || []; // Assuming downloads is an array

    if (userDownloads.length > 0) {
        userDownloads.forEach(download => {
            const listItem = document.createElement('li');
            listItem.textContent = download; // Assuming download is the title or name of the file
            downloadsList.appendChild(listItem);
        });
    } else {
        downloadsList.innerHTML = '<li>No downloads available.</li>';
    }
} catch (error) {
    console.error('Error fetching user downloads:', error);
}
