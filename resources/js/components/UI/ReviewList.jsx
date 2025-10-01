import React from 'react';
import { useQuery } from 'react-query';
import axios from '../../config/axios';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

const ReviewList = ({ productId }) => {
    const { data: reviews, isLoading } = useQuery(
        ['reviews', productId],
        () => axios.get(`/api/products/${productId}/reviews`).then(res => res.data)
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
                    ) : (
                        <StarIcon key={star} className="w-4 h-4 text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!reviews?.data?.length) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.data.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="flex-1">
                            {/* Review Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-black">{review.user?.name}</h4>
                                    <div className="flex items-center space-x-2">
                                        {renderStars(review.rating)}
                                        <span className="text-sm text-gray-600">
                                            {formatDate(review.created_at)}
                                        </span>
                                        {review.is_verified_purchase && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Review Comment */}
                            {review.comment && (
                                <p className="text-gray-700 mb-4">{review.comment}</p>
                            )}

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                    {review.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`/storage/${image}`}
                                            alt={`Review image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => window.open(`/storage/${image}`, '_blank')}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Review Videos */}
                            {review.videos && review.videos.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {review.videos.map((video, index) => (
                                        <video
                                            key={index}
                                            src={`/storage/${video}`}
                                            controls
                                            className="w-full max-w-md rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {reviews.last_page > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: reviews.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-2 rounded-lg ${
                                page === reviews.current_page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList;
