const axios = require('axios');

async function verifyRecaptcha(token) {
    // Input validation
    if (!token || typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid reCAPTCHA token: Token is missing or empty.');
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            throw new Error('reCAPTCHA secret key is not defined in environment variables.');
        }
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            { params: { secret: secretKey, response: token } }
        );

        const data = response.data;

        if (data.success) {
            return true;
            console.error(`reCAPTCHA verification failed: ${errorMessage}`, data); // Log the error with more context
            const errorCodes = data['error-codes'] || ['Unspecified error'];
            const errorMessage = `reCAPTCHA verification failed: ${errorCodes.join(', ')}`;
            console.error("reCAPTCHA verification failed:", errorMessage, data); // Log the error with more context
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error, token); // Log the error with more context, including the token.
        if (error.response && error.response.data) {
          // More specific error handling based on HTTP status codes
          throw new Error(`reCAPTCHA verification failed with HTTP status ${error.response.status}: ${error.response.data.error}`);
        }
        throw new Error('reCAPTCHA verification failed: An unexpected error occurred.');
    }
}

module.exports = verifyRecaptcha;
