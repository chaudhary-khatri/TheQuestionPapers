// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOGIfnmr_hkf85h6-7wngePIvCPDKEb8k",
    authDomain: "thequestionpaper-409f0.firebaseapp.com",
    databaseURL: "https://thequestionpaper-409f0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thequestionpaper-409f0",
    storageBucket: "thequestionpaper-409f0.appspot.com",
    messagingSenderId: "798858195313",
    appId: "1:798858195313:web:65f7dd64b82f6e7f4ac6d0",
    measurementId: "G-3R5D88WF9Q",
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Feedback section
const feedbackHeader = document.getElementById('feedback-header');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name'); // Added name input

// Check user authentication status
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        emailInput.value = user.email; // Auto-fill email input
        nameInput.value = user.displayName || ''; // Auto-fill name input if available
        // Check user role
        const userRole = await getUserRole(user.uid);
        displayFeedbackOptions(userRole); // Show/hide reply options based on role
    } else {
        // User is not signed in
        feedbackHeader.innerText = 'Please log in for feedback and rating';
        nameInput.value = ''; // Clear the name input
        emailInput.value = ''; // Clear the email input
    }
});

// Feedback form submission handling
document.getElementById('feedback-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('feedback-text').value;

    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in/log in to submit feedback and ratings.'); // Prompt user to sign in
        feedbackHeader.innerText = 'Please log in for feedback and rating'; // Change header text
        return;
    }

    const selectedRating = Array.from(document.querySelectorAll('.star')).filter(star => star.classList.contains('selected')).length;

    try {
        const feedbackDoc = await addDoc(collection(db, 'feedback'), {
            name: name,
            email: email,
            message: message,
            rating: selectedRating,
            createdAt: new Date(),
            reply: '', // Initialize with an empty string for replies
        });

        // Display feedback immediately after submission
        displayFeedback(feedbackDoc.id, name, message, selectedRating);

        document.getElementById('feedback-response').innerText = 'Thank you for your feedback!';
        document.getElementById('feedback-form').reset();
    } catch (error) {
        document.getElementById('feedback-response').innerText = 'Error submitting feedback. Please try again.';
        console.error('Error adding feedback: ', error);
    }
});

// Function to fetch and display feedback from Firestore
async function fetchFeedback() {
    const feedbackCollection = collection(db, 'feedback');
    const feedbackSnapshot = await getDocs(feedbackCollection);
    const feedbackDisplay = document.getElementById('feedback-display');
    feedbackDisplay.innerHTML = ''; // Clear existing feedback

    feedbackSnapshot.forEach((doc) => {
        const feedbackData = doc.data();
        displayFeedback(doc.id, feedbackData.name, feedbackData.message, feedbackData.rating, feedbackData.reply);
    });
}

// Function to display feedback
async function displayFeedback(docId, name, message, selectedRating, reply) {
    const feedbackDisplay = document.getElementById('feedback-display');
    const feedbackItem = document.createElement('div');
    feedbackItem.classList.add('feedback-item');
    feedbackItem.innerHTML = `
        <strong>${name}</strong>
        <div class="rating-display">${'★'.repeat(selectedRating)}${'☆'.repeat(5 - selectedRating)}</div>
        <p>${message}</p>
        <div class="reply-section">
            <strong>TheQuestionPaper:</strong>
            <p id="reply-${docId}">${reply || 'No reply yet.'}</p>
            <input type="text" class="reply-input" placeholder="Type your reply here..." style="display:none;" />
            <button class="reply-button" data-doc-id="${docId}" style="display:none;">Reply</button>
        </div>
    `;

    // Append feedback item to display
    feedbackDisplay.appendChild(feedbackItem);

    // Check if user is an admin
    const user = auth.currentUser;
    if (user) {
        const userRole = await getUserRole(user.uid);
        if (userRole === 'admin') {
            // Show reply option only for admin
            const replyInput = feedbackItem.querySelector('.reply-input');
            const replyButton = feedbackItem.querySelector('.reply-button');
            replyInput.style.display = 'inline'; // Show reply input for admin
            replyButton.style.display = 'inline'; // Show reply button for admin

            // Add event listener to reply button
            replyButton.addEventListener('click', async () => {
                const replyMessage = replyInput.value.trim();
                if (replyMessage) {
                    await handleReply(docId, replyMessage); // Register the reply
                    replyInput.value = ''; // Clear the input field after reply
                } else {
                    alert('Please enter a reply before submitting.'); // Alert if input is empty
                }
            });
        }
    }
}

// Function to handle replies and update Firestore
async function handleReply(docId, replyMessage) {
    const feedbackRef = doc(db, 'feedback', docId);
    try {
        await updateDoc(feedbackRef, {
            reply: replyMessage, // Update the reply field
        });
        fetchFeedback(); // Refresh the feedback display
    } catch (error) {
        console.error('Error replying to feedback: ', error);
    }
}

// Function to check user role
async function getUserRole(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        return userDoc.data().role; // Assuming 'role' is the field name
    }
    return null; // Role not found
}

// Call fetchFeedback on page load
window.onload = () => {
    fetchFeedback();
};

// Rating functionality
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach((star) => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value'); // Get the value of the clicked star
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        highlightStars(star.getAttribute('data-value')); // Highlight stars on hover
    });

    star.addEventListener('mouseout', () => {
        updateStars(); // Remove highlight when mouse leaves
    });
});

function highlightStars(rating) {
    stars.forEach((star) => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('highlight');
        } else {
            star.classList.remove('highlight');
        }
    });
}

function updateStars() {
    stars.forEach((star) => {
        if (star.getAttribute('data-value') <= selectedRating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}
