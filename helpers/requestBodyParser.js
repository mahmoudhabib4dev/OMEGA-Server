

const requestBodyParser = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                error.statusCode = 400;
                error.publicMessage = 'Invalid JSON request body';
                reject(error);
            }
        });
        req.on('error', err => reject(err));
    });
};


module.exports = requestBodyParser;