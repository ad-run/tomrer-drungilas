document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form field values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const recaptchaToken = grecaptcha.getResponse();

    // Check reCAPTCHA
    if (!recaptchaToken) {
        alert('Please complete the reCAPTCHA');
        return;
    }

    // Get button and loading indicator
    const submitButton = document.querySelector("button[type='submit']");
    const loadingIndicator = document.getElementById("recaptcha-loading");

    // Disable the button and show the loading indicator
    submitButton.disabled = true;
    loadingIndicator.style.display = 'block';

    try {
        console.log('Submitting form...');

        // Send data to backend API
        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, recaptchaToken }),
        });

        // Handle response from backend
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            console.error('Backend error:', errorMessage);
            alert(`Error submitting form: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.success) {
            alert(`Error submitting form: ${data.error}`);
            throw new Error(data.error);
        }

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Reset the form
        document.getElementById("contact-form").reset();
        grecaptcha.reset();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An unexpected error occurred. Please try again later.");
    } finally {
        submitButton.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});



/*

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

// Get elements
const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const form = document.getElementById("contact-form");
const submitButton = form.querySelector('button[type="submit"]');
const loadingIndicator = document.createElement('div');
loadingIndicator.style.display = 'none';
loadingIndicator.textContent = 'Submitting...';
form.appendChild(loadingIndicator);

// Initialize Firebase outside the event handler
const firebaseConfig = {

    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

//Event Listener
document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const recaptchaToken = grecaptcha.getResponse();

    //Check Recaptcha (more robust check)
    if (!recaptchaToken) {
        alert('Please complete the reCAPTCHA');
        return;
    }

    //Disable button and show loading indicator
    submitButton.disabled = true;
    loadingIndicator.style.display = 'block';

    try {
        console.log('Submitting form...');

        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, recaptchaToken }),
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json().catch(() => ({ error: "Could not parse error response" }));
                if (errorData && errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (jsonError) {
                console.error("Failed to parse error JSON:", jsonError);
                errorMessage = `HTTP error! status: ${response.status}. Could not parse error response.`;
            }
            console.error('Backend error:', errorMessage);
            alert(`Error submitting form: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.success) {
            alert(`Error submitting form: ${data.error}`);
            throw new Error(data.error);
        }

        const uniqueID = uuidv4();
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, { name, email, message, uniqueID });
        successModal.show();
        form.reset();
        grecaptcha.reset();

    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An unexpected error occurred. Please try again later.");
    } finally {
        submitButton.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});
*/