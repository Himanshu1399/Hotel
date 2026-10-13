// loggerMiddleware.js
const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleDateString()}] ${req.method} to ${req.url}`);
    
    next(); 
};

module.exports = logger;
