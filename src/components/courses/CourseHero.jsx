import React from 'react';
import { Star, Users, Play } from 'lucide-react';

/**
 * CourseHero 課程詳情頂部英雄區
 * 顯示課程標題、副標題、評分、講師資訊與預覽圖
 */
const CourseHero = ({ course }) => {
    return (
        <div className="course-hero bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Course Info */}
                    <div className="order-2 lg:order-1">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-6">
                            {course.subtitle}
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-yellow-400">{course.rating}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i <= Math.round(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-400">({course.reviews} 則評價)</span>
                            </div>

                            {/* Students */}
                            <div className="flex items-center gap-1 text-gray-300">
                                <Users size={16} />
                                <span>{course.total_students?.toLocaleString()} 學員</span>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                            <img
                                src={course.instructor_avatar}
                                alt={course.instructor}
                                className="w-10 h-10 rounded-full bg-gray-600"
                            />
                            <div>
                                <p className="text-sm text-gray-400">講師</p>
                                <p className="font-medium">{course.instructor}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Course Thumbnail / Video Preview */}
                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group cursor-pointer">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                    <Play size={28} className="text-[var(--color-primary)] ml-1" />
                                </div>
                            </div>
                            {/* Preview Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-800">
                                免費預覽
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseHero;
