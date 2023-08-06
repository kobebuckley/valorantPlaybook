import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    username: String,
    hashedPassword: String,
    isAdmin: Boolean
});

export const User = mongoose.model('User', userSchema);



// const user1 = new User({
//     id: generateUniqueId(),
//     name: 'apple',
//     username: 'applesRus',
//     hashedPassword: 'passwordgoeshere?', 
//     isAdmin: false,
// });

// user1.save()
// .then(savedUser => {
//     console.log('User saved:', savedUser);
// })
// .catch(error => {
//     console.error('Error saving user:', error);
// });


// export const User = mongoose.model('User', userSchema);
