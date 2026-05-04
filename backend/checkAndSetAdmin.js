const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const checkAndSetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB:', process.env.MONGO_URI);

        const email = 'rk5907919@gmail.com'; // your email

        // First check if user exists
        const before = await mongoose.connection.db.collection('users').findOne({ email });
        if (!before) {
            console.log('❌ User NOT FOUND with email:', email);
            mongoose.connection.close();
            return;
        }

        console.log('✅ User found:', before.name, '| Current role:', before.role);

        // Force update the role
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email },
            { $set: { role: 'admin' } }
        );

        console.log('Update result - matchedCount:', result.matchedCount, '| modifiedCount:', result.modifiedCount);

        // Verify after update
        const after = await mongoose.connection.db.collection('users').findOne({ email });
        console.log('✅ Role after update:', after.role);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

checkAndSetAdmin();
