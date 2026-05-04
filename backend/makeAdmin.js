const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Replace 'your_email@example.com' with the actual email of the user you want to make admin
        const result = await mongoose.connection.db.collection('users').findOneAndUpdate(
            { email: 'rk5907919@gmail.com' }, // Change this to your actual registered email
            { $set: { role: 'admin' } }
        );

        if (result.value) {
            console.log('User updated to admin successfully');
        } else {
            console.log('User not found');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

makeAdmin();