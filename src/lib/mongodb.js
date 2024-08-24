import mongoose from 'mongoose';

const MongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Db Connection Failed", error);
        throw new Error('Database connection failed');
    }
};
export default MongoDb;