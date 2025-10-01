import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../config/axios';
import { StarIcon, PhotoIcon, VideoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, orderId, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [hoveredRating, setHoveredRating] = useState(0);
    const queryClient = useQueryClient();

    const createReviewMutation = useMutation(
        (formData) => {
            const data = new FormData();
            data.append('product_id', productId);
            if (orderId) data.append('order_id', orderId);
            data.append('rating', rating);
            data.append('comment', comment);
            
            images.forEach((image, index) => {
                data.append(`images[${index}]`, image);
            });
            
            videos.forEach((video, index) => {
                data.append(`videos[${index}]`, video);
            });

            return axios.post('/api/reviews', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['products', productId]);
                queryClient.invalidateQueries('reviews');
                toast.success('Review submitted successfully!');
                onSuccess?.();
                onClose();
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        }
    );

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setImages([...images, ...files]);
    };

    const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (videos.length + files.length > 3) {
            toast.error('Maximum 3 videos allowed');
            return;
        }
        setVideos([...videos, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeVideo = (index) => {
        setVideos(videos.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        createReviewMutation.mutate();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-black">Write a Review</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Rating *
                        </label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none"
                                >
                                    {star <= (hoveredRating || rating) ? (
                                        <StarIconSolid className="w-8 h-8 text-yellow-400" />
                                    ) : (
                                        <StarIcon className="w-8 h-8 text-gray-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {rating === 0 ? 'Select a rating' : 
                             rating === 1 ? 'Poor' :
                             rating === 2 ? 'Fair' :
                             rating === 3 ? 'Good' :
                             rating === 4 ? 'Very Good' : 'Excellent'}
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Comment (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Share your experience with this product..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Photos (Optional)
                        </label>
                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <PhotoIcon className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">Add Photos (Max 5)</span>
                            </label>
                            
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Review ${index + 1}`}
                                                className="w-full h-20 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Videos (Optional)
                        </label>
                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={handleVideoUpload}
                                className="hidden"
                                id="video-upload"
                            />
                            <label
                                htmlFor="video-upload"
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <VideoIcon className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">Add Videos (Max 3)</span>
                            </label>
                            
                            {videos.length > 0 && (
                                <div className="space-y-2">
                                    {videos.map((video, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                            <VideoIcon className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm text-gray-600 flex-1">{video.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeVideo(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createReviewMutation.isLoading || rating === 0}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                        >
                            {createReviewMutation.isLoading ? (
                                <>
                                    <LoadingSpinner size="small" className="mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
