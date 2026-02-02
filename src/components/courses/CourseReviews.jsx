import React from 'react';
import { Star } from 'lucide-react';

/**
 * CourseReviews 學員評價區
 * 顯示評分分佈圖與評論列表
 */
const CourseReviews = ({ reviews, avgRating, totalReviews }) => {
    const { distribution, list } = reviews;

    // 計算最大百分比用於 bar 寬度
    const maxPercent = Math.max(...Object.values(distribution));

    return (
        <div className="course-reviews">
            <h2 className="text-xl font-bold text-gray-900 mb-6">學員評價</h2>

            {/* Rating Overview */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold text-gray-900">{avgRating}</span>
                    <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={20}
                                className={i <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 mt-1">
                        {totalReviews} 則評價
                    </span>
                </div>

                {/* Distribution Bars */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => {
                        const percent = distribution[rating] || 0;
                        const barWidth = maxPercent > 0 ? (percent / maxPercent) * 100 : 0;

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-600">{rating}</span>
                                </div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-12 text-right">
                                    {percent}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {list.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {review.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseReviews;
