import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema({
    tenderNumber: { type: String, required: true, unique: true },
    tenderName: { type: String },
    tenderStatus: { type: String },
    publicationDate: { type: Date },
    applicationStartDate: { type: Date },
    applicationEndDate: { type: Date },
}, {
    timestamps: true,
});
export const PostModel = mongoose.model('Post', PostSchema);
//# sourceMappingURL=Post.js.map