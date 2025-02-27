// Import Firebase modules
import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOGIfnmr_hkf85h6-7wngePIvCPDKEb8k",
  authDomain: "thequestionpaper-409f0.firebaseapp.com",
  projectId: "thequestionpaper-409f0",
  storageBucket: "thequestionpaper-409f0.appspot.com",
  messagingSenderId: "798858195313",
  appId: "1:798858195313:web:65f7dd64b82f6e7f4ac6d0",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// Function to populate the universities dropdown
async function populateUniversitiesDropdown() {
  const universitySelect = document.getElementById('university');
  universitySelect.innerHTML = '<option value="">Select University</option>';
  const querySnapshot = await getDocs(collection(db, 'universities'));
  querySnapshot.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().name;
    universitySelect.appendChild(option);
  });
}

// Function to populate course-semester dropdown based on selected university
async function populateCourseSemesterDropdown(universityId) {
  const courseSelect = document.getElementById('course-semester');
  courseSelect.innerHTML = '<option value="">Select Course and Semester</option>'; // Clear existing options

  if (universityId) {
    const querySnapshot = await getDocs(collection(db, 'universities', universityId, 'courses'));
    querySnapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = `${doc.data().name} (Semester: ${doc.data().semester})`;
      courseSelect.appendChild(option);
    });
  }
}

// Function to populate subjects dropdown based on selected university and course
async function populateSubjectsDropdown(universityId, courseId) {
  const subjectSelect = document.getElementById('subject');
  subjectSelect.innerHTML = '<option value="">Select Subject</option>'; // Clear existing options

  if (universityId && courseId) {
    const querySnapshot = await getDocs(collection(db, 'universities', universityId, 'courses', courseId, 'subjects'));
    querySnapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.data().name;
      subjectSelect.appendChild(option);
    });
  }
}

// Event listeners for dropdowns
document.addEventListener('DOMContentLoaded', async () => {
  await populateUniversitiesDropdown();

  const universitySelect = document.getElementById('university');
  universitySelect.addEventListener('change', async (event) => {
    const universityId = event.target.value;
    await populateCourseSemesterDropdown(universityId); // Populate course-semester dropdown
  });

  const courseSelect = document.getElementById('course-semester');
  courseSelect.addEventListener('change', async (event) => {
    const universityId = universitySelect.value;
    const courseId = event.target.value;
    await populateSubjectsDropdown(universityId, courseId); // Populate subjects dropdown
  });

  // Display the initial message in the results container
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '<h3 style="color: 	#708090; text-align: center;">Please Search For Results</h3>';

  // Handle search form submission
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const universityId = universitySelect.value;
    const courseId = courseSelect.value;
    const subjectId = document.getElementById('subject').value;

    // Display PDF links directly on the same page
    await displayPdfLinks(universityId, courseId, subjectId);
  });
});

// Function to display PDF links in search results in a 2x2 grid
async function displayPdfLinks(universityId, courseId, subjectId) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  // Firestore query to fetch question papers
  const questionPapersRef = collection(db, `universities/${universityId}/courses/${courseId}/subjects/${subjectId}/questionPapers`);
  const querySnapshot = await getDocs(questionPapersRef);

  if (querySnapshot.empty) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  // Create a grid container for 2x2 layout
  const gridContainer = document.createElement('div');
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  gridContainer.style.gap = '20px';

  // Media query for mobile devices
  const mediaQuery = window.matchMedia('(max-width: 600px)'); // iPhone 12 Pro has a width of 390px in portrait mode

  if (mediaQuery.matches) {
    gridContainer.style.gridTemplateColumns = '1fr'; // Switch to a single column layout on smaller screens
  }

  // Loop through the question papers and create a card for each PDF
  querySnapshot.forEach(async (doc) => {
    const data = doc.data();
    const pdfUrl = data.pdfUrl;

    // Create a card for the PDF
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.textAlign = 'center';
    card.style.borderRadius = '8px'; // Add border radius
    card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Add shadow for better aesthetics
    card.style.transition = 'transform 0.3s'; // Animation on hover

    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
    });


    // Create an icon for the PDF (using a question paper icon)
    const icon = document.createElement('img');
    icon.src = 'pdficon.png'; // Replace with your actual icon path
    icon.alt = 'PDF Preview';
    icon.style.width = '100px';
    icon.style.height = '100px';
    icon.style.marginBottom = '10px';

    // Make the icon responsive with a max-width
    icon.style.maxWidth = '100%'; // Ensures the icon scales with the container
    icon.style.height = 'auto'; // Maintains aspect ratio

    // On smaller screens, make the icon size smaller
    if (mediaQuery.matches) {
      icon.style.width = '70px'; // Adjust size for mobile devices
      icon.style.height = 'auto'; // Keep the aspect ratio
    }

    // Add a name for the PDF
    const pdfName = document.createElement('p');
    pdfName.textContent = data.pdfName || 'PDF Document';
    pdfName.style.fontSize = '16px'; // Regular text size for larger screens
    pdfName.style.marginTop = '10px';

    // Make the text size smaller on mobile
    if (mediaQuery.matches) {
      pdfName.style.fontSize = '12px'; // Smaller size for mobile
    }

    // Add event listener to open PDF in a new tab when icon is clicked
    icon.addEventListener('click', async () => {
      const pdfLink = await getDownloadURL(ref(storage, pdfUrl));
      window.open(pdfLink, '_blank');
    });

    card.appendChild(icon);
    card.appendChild(pdfName); // Append PDF name to the card

    // Add a link to the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.textContent = 'View PDF';
    link.style.display = 'block';
    link.style.color = '#007bff';
    link.style.textDecoration = 'none';
    link.style.marginTop = '10px';
    link.style.fontSize = '16px'; // Larger text for better readability

    // Make the text size smaller on mobile
    if (mediaQuery.matches) {
      link.style.fontSize = '10px'; // Adjust size for mobile
    }

    // Create a heading for the course and subject
    const heading = document.createElement('h3');
    heading.textContent = `${data.name}`;
    card.appendChild(heading);

    // Fetch the download URL and create a download button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download PDF';
    downloadButton.classList.add('download-button'); // Add this line
    downloadButton.onclick = async () => {
      const downloadUrl = await getDownloadURL(ref(storage, pdfUrl));
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${data.name}.pdf`; // Set the download filename
      a.click(); // Start download
    };
    card.appendChild(downloadButton);

    // Append the card to the grid container
    gridContainer.appendChild(card);
  });

  // Append the grid container to the results container
  resultsContainer.appendChild(gridContainer);
}
