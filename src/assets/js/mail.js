import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPw7hyuWJ1hJMkxoTBQyT93PAJ00q1HHY",
    authDomain: "kontaktform-td.firebaseapp.com",
    databaseURL: "https://kontaktform-td-default-rtdb.firebaseio.com",
    projectId: "kontaktform-td",
    storageBucket: "kontaktform-td.appspot.com",
    messagingSenderId: "340704782949",
    appId: "1:340704782949:web:5fc2c1e5f564ae36b4748c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Database reference
const kontaktFormDB = ref(database, 'kontaktForm-TD');

// Listen for form submission
document.getElementById('contactForm').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    
    var name = getElementValue('name');
    var email = getElementValue('email');
    var message = getElementValue('message');

    console.log(name, email, message);

    // Save data to Firebase
    push(kontaktFormDB, {
        name: name,
        email: email,
        message: message
    });

    // Reset form
    document.getElementById('contactForm').reset();
}

// Function to get input values
const getElementValue = (id) => {
    return document.getElementById(id).value;
};
