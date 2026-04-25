import mongoose from 'mongoose';
import seedAdmin from './seedAdmin.js';


const connectDB = async () => {
    try {
        // Replace with your MongoDB URI (Local or Atlas)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        seedAdmin()
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB