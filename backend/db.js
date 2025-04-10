const mongoose = require('mongoose');
const conn = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URL);
        if (response) {
            console.log('Connected to MongoDB');
        }

    }
    catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

module.exports = conn;