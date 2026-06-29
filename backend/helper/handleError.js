class handleError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "handleError"
        Error.captureStackTrace(this, handleError)
    }
} 

export default handleError