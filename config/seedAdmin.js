import bcrypt from 'bcrypt';
import User from '../models/User.js';


const seedAdmin = async () => {
    try {
        // Check if any admin already exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await User.create({
                name: 'Admin',
                email: 'admin@demo.com',
                password: hashedPassword,
                role: 'admin'
            });

            console.log('Admin user seeded successfully.');
        } else {
            console.log('Admin user already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding admin data:', error);
    }
};


export default seedAdmin