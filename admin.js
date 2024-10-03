// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js';
import { deleteDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to handle adding a university
async function handleAddUniversity(event) {
    event.preventDefault();
    const universityInput = document.getElementById('newUniversity');
    const universityName = universityInput.value;

    try {
        await addDoc(collection(db, 'universities'), { name: universityName });
        alert('University added successfully!');
        universityInput.value = '';
        await populateUniversitiesDropdown();
    } catch (error) {
        console.error('Error adding university: ', error);
        alert('Error adding university. Please try again.');
    }
}

// Function to handle adding a course
async function handleAddCourse(event) {
    event.preventDefault();
    const courseInput = document.getElementById('newCourse');
    const courseName = courseInput.value;
    const universitySelect = document.getElementById('courseUniversity');
    const universityId = universitySelect.value;
    const semesterInput = document.getElementById('semester');
    const semester = semesterInput.value;

    try {
        if (!universityId) {
            alert('Please select a university.');
            return;
        }

        const universityDocRef = doc(db, 'universities', universityId);
        await addDoc(collection(universityDocRef, 'courses'), {
            name: courseName,
            semester: semester,
        });
        alert('Course added successfully!');
        courseInput.value = '';
        semesterInput.value = '';
        await populateCoursesDropdown(universityId);
    } catch (error) {
        console.error('Error adding course: ', error);
        alert('Error adding course. Please try again.');
    }
}

// Function to handle adding a subject
async function handleAddSubject(event) {
    event.preventDefault();
    const subjectInput = document.getElementById('newSubject');
    const subjectName = subjectInput.value;
    const universityId = document.getElementById('subjectUniversity').value;
    const courseId = document.getElementById('subjectCourse').value;

    try {
        if (!universityId || !courseId) {
            alert('Please select a university and a course.');
            return;
        }

        const courseDocRef = doc(db, 'universities', universityId, 'courses', courseId);
        await addDoc(collection(courseDocRef, 'subjects'), {
            name: subjectName,
        });
        alert('Subject added successfully!');
        subjectInput.value = '';
    } catch (error) {
        console.error('Error adding subject: ', error);
        alert('Error adding subject. Please try again.');
    }
}
// Function to handle uploading question papers with URL handling
async function handleUploadQuestionPapers(event) {
    event.preventDefault();
    const universityId = document.getElementById('uploadUniversity').value;
    const courseId = document.getElementById('uploadCourse').value;
    const subjectId = document.getElementById('uploadSubject').value;
    const files = document.getElementById('uploadFiles').files;

    try {
        if (!universityId || !courseId || !subjectId) {
            alert('Please select a university, course, and subject.');
            return;
        }

        const universityDocRef = doc(db, 'universities', universityId);
        const courseDocRef = doc(universityDocRef, 'courses', courseId);
        const subjectDocRef = doc(courseDocRef, 'subjects', subjectId);
        const questionPapersCollectionRef = collection(subjectDocRef, 'questionPapers');

        for (const file of files) {
            // Upload file to Firebase Storage
            const storageRef = ref(storage, `questionPapers/${universityId}/${courseId}/${subjectId}/${file.name}`);
            await uploadBytes(storageRef, file);

            // Get the file's download URL
            const downloadURL = await getDownloadURL(storageRef);

            // Store the PDF URL in Firestore
            await addDoc(questionPapersCollectionRef, {
                name: file.name,
                pdfUrl: downloadURL,
                createdAt: new Date(),
            });

            alert(`Uploaded ${file.name} successfully!`);
        }
    } catch (error) {
        console.error('Error uploading question papers: ', error);
        alert('Error uploading question papers. Please try again.');
    }
}

// Function to handle deleting a university
async function handleDeleteUniversity(event) {
    event.preventDefault();
    const universitySelect = document.getElementById('deleteUniversity');
    const universityId = universitySelect.value;

    try {
        await deleteDoc(doc(db, 'universities', universityId));
        alert('University deleted successfully!');
        await populateUniversitiesDropdown();
    } catch (error) {
        console.error('Error deleting university: ', error);
        alert('Error deleting university. Please try again.');
    }
}

// Function to handle deleting a course
async function handleDeleteCourse(event) {
    event.preventDefault();
    const universitySelect = document.getElementById('deleteCourseUniversity');
    const courseSelect = document.getElementById('deleteCourse');
    const universityId = universitySelect.value;
    const courseId = courseSelect.value;

    try {
        await deleteDoc(doc(db, 'universities', universityId, 'courses', courseId));
        alert('Course deleted successfully!');
        await populateCoursesDropdown(universityId);
    } catch (error) {
        console.error('Error deleting course: ', error);
        alert('Error deleting course. Please try again.');
    }
}

// Function to handle deleting a subject
async function handleDeleteSubject(event) {
    event.preventDefault();
    const universitySelect = document.getElementById('deleteSubjectUniversity');
    const courseSelect = document.getElementById('deleteSubjectCourse');
    const subjectSelect = document.getElementById('deleteSubject');
    const universityId = universitySelect.value;
    const courseId = courseSelect.value;
    const subjectId = subjectSelect.value;

    try {
        await deleteDoc(doc(db, 'universities', universityId, 'courses', courseId, 'subjects', subjectId));
        alert('Subject deleted successfully!');
        await populateSubjectsDropdown(universityId, courseId);
    } catch (error) {
        console.error('Error deleting subject: ', error);
        alert('Error deleting subject. Please try again.');
    }
}

// Function to populate the universities dropdown
async function populateUniversitiesDropdown() {
    const universitySelects = [
        document.getElementById('courseUniversity'),
        document.getElementById('subjectUniversity'),
        document.getElementById('uploadUniversity'),
        document.getElementById('deleteUniversity'),
        document.getElementById('deleteCourseUniversity'),
        document.getElementById('deleteSubjectUniversity')
    ];

    for (const select of universitySelects) {
        select.innerHTML = '<option value="">Select University</option>';
        const querySnapshot = await getDocs(collection(db, 'universities'));
        querySnapshot.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            select.appendChild(option);
        });
    }
}

// Function to populate courses dropdown based on selected university
async function populateCoursesDropdown(universityId) {
    const courseSelects = [
        document.getElementById('subjectCourse'),
        document.getElementById('uploadCourse'),
        document.getElementById('deleteCourse'),
        document.getElementById('deleteSubjectCourse')
    ];

    for (const select of courseSelects) {
        select.innerHTML = '<option value="">Select Course</option>';

        if (universityId) {
            const universityDocRef = doc(db, 'universities', universityId);
            const querySnapshot = await getDocs(collection(universityDocRef, 'courses'));
            querySnapshot.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${doc.data().name} (Semester: ${doc.data().semester})`;
                select.appendChild(option);
            });
        }
    }
}

// Function to populate subjects dropdown based on selected university and course
async function populateSubjectsDropdown(universityId, courseId) {
    const subjectSelects = [
        document.getElementById('uploadSubject'),
        document.getElementById('deleteSubject')
    ];

    for (const select of subjectSelects) {
        select.innerHTML = '<option value="">Select Subject</option>';

        if (universityId && courseId) {
            const querySnapshot = await getDocs(collection(db, 'universities', universityId, 'courses', courseId, 'subjects'));
            querySnapshot.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = doc.data().name;
                select.appendChild(option);
            });
        }
    }
}

// Wait for DOM to load and set up event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await populateUniversitiesDropdown();

    // Add event listeners for form submissions
    document.getElementById('addUniversityForm').addEventListener('submit', handleAddUniversity);
    document.getElementById('addCourseForm').addEventListener('submit', handleAddCourse);
    document.getElementById('addSubjectForm').addEventListener('submit', handleAddSubject);
    document.getElementById('uploadQuestionPapersForm').addEventListener('submit', handleUploadQuestionPapers);
    document.getElementById('deleteUniversityForm').addEventListener('submit', handleDeleteUniversity);
    document.getElementById('deleteCourseForm').addEventListener('submit', handleDeleteCourse);
    document.getElementById('deleteSubjectForm').addEventListener('submit', handleDeleteSubject);

    // Update dropdowns when university selections change
    document.getElementById('courseUniversity').addEventListener('change', (e) => populateCoursesDropdown(e.target.value));
    document.getElementById('subjectUniversity').addEventListener('change', (e) => populateCoursesDropdown(e.target.value));
    document.getElementById('uploadUniversity').addEventListener('change', (e) => populateCoursesDropdown(e.target.value));
    document.getElementById('deleteCourseUniversity').addEventListener('change', (e) => populateCoursesDropdown(e.target.value));
    document.getElementById('deleteSubjectUniversity').addEventListener('change', (e) => populateCoursesDropdown(e.target.value));

    // Update subjects dropdown when course selections change
    document.getElementById('uploadCourse').addEventListener('change', (e) => populateSubjectsDropdown(document.getElementById('uploadUniversity').value, e.target.value));
    document.getElementById('deleteSubjectCourse').addEventListener('change', (e) => populateSubjectsDropdown(document.getElementById('deleteSubjectUniversity').value, e.target.value));
});
