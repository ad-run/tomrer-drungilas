
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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
const kontaktFormDB = ref(database, 'kontaktForm-TD');

document.getElementById('contactForm').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    var name = getElementValue('name');
    var email = getElementValue('email');
    var message = getElementValue('message');

  

    // Save data to Firebase Realtime Database
    push(kontaktFormDB, {
        name: name,
        email: email,
        message: message
    });
    // Show Bootstrap Modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    // Reset form
    document.getElementById('contactForm').reset();
}

function getElementValue(id) {
    return document.getElementById(id).value;
}

