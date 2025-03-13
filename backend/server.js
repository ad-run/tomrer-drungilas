require("dotenv").config(); // Load .env variables
const admin = require("firebase-admin");


const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString()
);
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kontaktform-td-default-rtdb.firebaseio.com"
});

const db = admin.database();
console.log("🔥 Firebase DB connected:", process.env.FIREBASE_DATABASE_URL);

const express = require("express");
const cors = require("cors");

const sanitizeHtml = require("sanitize-html");
const rateLimit = require("express-rate-limit"); //Import rateLimit
const bodyParser = require("body-parser");
const verifyRecaptcha = require("./utils/recaptcha");
const app = express();

app.use(bodyParser.json()); // For parsing application/json

const port = process.env.PORT || 3000;

// Firebase Realtime Database reference

const messagesRef = db.ref("messages");

// CORS Configuration (Make this more restrictive for production!)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Allow only from your frontend URL in production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};


/*The line origin: process.env.FRONTEND_URL || "*" , within your CORS configuration, is designed to control which origins (websites or domains) are allowed to make requests to your backend server.

process.env.FRONTEND_URL : This part attempts to get the URL of your frontend application from the environment variable FRONTEND_URL . This is a crucial practice for security. You should set this variable in your .env file.

|| "*" : The || "*" is a fallback mechanism. If the FRONTEND_URL environment variable is not set (e.g., if you're running locally and haven't set it yet), then the origin will default to "*" . The wildcard "*" allows requests from any origin, which is extremely risky in a production environment.

Purpose and Security:

The main purpose of this line is to create a flexible CORS configuration:

Development: When developing locally, you likely don't have a production frontend URL set. The "*" wildcard allows requests from any origin (like your local development server) for easy development.

Production: In your production environment, you must set the FRONTEND_URL environment variable to the exact URL of your deployed frontend application. This restriction is critical for security: it prevents malicious websites from making requests to your backend server and potentially exploiting vulnerabilities. Only your intended frontend can communicate with your backend.

Setting FRONTEND_URL :

Before deploying your application to production, add the FRONTEND_URL variable to your .env file (or your production environment configuration). For instance, if your frontend is deployed at https://your-app.com , add this to your .env file:

FRONTEND_URL=https://your-app.com
In summary, the line is a safe and flexible way to handle CORS configurations across different environments but requires careful management of the FRONTEND_URL environment variable to maintain security. Always be cautious to avoid using the wildcard "*" in any kind of production or deployment environment.*/
//Rate limiting to prevent reCAPTCHA abuse.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Initialize Firebase Admin SDK (Securely using environment variables)
//console.log("All environment variables:", process.env);//
console.log("Server started on port:", port);



// Test Firebase Connection route
app.get("/test", async (req, res) => {
  try {
    await db.ref("test").set({ message: "Test entry" });
    res.json({ success: true, message: "Firebase connection successful" });
  } catch (error) {
    console.error("Error testing Firebase connection:", error);
    res.status(500).json({ error: "Firebase connection failed!" });
  }
});

// Contact form submission route (with improved error handling)
app.post("/api/contact", async (req, res) => {
  console.log("Received POST request to /api/contact");
  console.log("Request body:", req.body);

  try {
    const { name, email, message, recaptchaToken } = req.body;

    // Input validation (more specific)
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!message) missingFields.push("message");
    if (
      !recaptchaToken ||
      typeof recaptchaToken !== "string" ||
      recaptchaToken.trim() === ""
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid reCAPTCHA token" });
    }
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res
        .status(400)
        .json({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ["p", "b", "i", "em", "strong", "a", "br", "ul", "ol", "li"],
      allowedAttributes: {
        a: ["href", "target"],
      },
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    // Save to Firebase
    await db.ref("messages").push({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
    });
    console.log("Message saved successfully to Firebase");
    res
      .status(200)
      .json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    console.error("Error handling /api/contact:", error);
    res.status(500).json({ success: false, error: error.message }); // Send more specific error message
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
