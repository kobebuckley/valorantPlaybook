import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String, required: true },
  agent: { type: String, required: true },
  userId: { type: String, required: true },
  reactions: {
    thumbsUp: { type: Number, default: 0 },
    hooray: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    rocket: { type: Number, default: 0 },
    eyes: { type: Number, default: 0 },
  },
  moderated: {
    type: Boolean, 
    default: true, 
  },});





export const Post = mongoose.model('Post', postSchema);

