const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, default: 0 },
        comment: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    offer: { type: Number },
    productPictures: [
        { img: { type: String } }
    ],
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    reviews: [reviewSchema],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: Date

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);