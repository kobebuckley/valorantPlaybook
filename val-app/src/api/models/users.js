import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    username: String,
    hashedPassword: String,
    isAdmin: Boolean
});

export const User = mongoose.model('User', userSchema);
