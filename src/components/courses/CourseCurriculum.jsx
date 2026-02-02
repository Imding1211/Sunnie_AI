import React, { useState } from 'react';
import { ChevronDown, Play, Lock } from 'lucide-react';

/**
 * CourseCurriculum 課程大綱手風琴元件
 * 展開/收合式章節，顯示單元標題與時數
 */
const CourseCurriculum = ({ curriculum }) => {
    // 預設展開第一個章節
    const [expandedSections, setExpandedSections] = useState(['s1']);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const getTotalDuration = (lessons) => {
        let totalMinutes = 0;
        lessons.forEach(lesson => {
            const [min, sec] = lesson.duration.split(':').map(Number);
            totalMinutes += min + sec / 60;
        });
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return hours > 0 ? `${hours} 小時 ${minutes} 分鐘` : `${minutes} 分鐘`;
    };

    const getLessonIcon = (lesson) => {
        if (lesson.isPreview) {
            return <Play size={16} className="text-green-600" />;
        }
        return <Lock size={16} className="text-gray-400" />;
    };

    return (
        <div className="course-curriculum">
            <h2 className="text-xl font-bold text-gray-900 mb-6">課程大綱</h2>

            {/* Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{curriculum.length} 個章節</span>
                <span>•</span>
                <span>{curriculum.reduce((acc, s) => acc + s.lessons.length, 0)} 個單元</span>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
                {curriculum.map((section) => {
                    const isExpanded = expandedSections.includes(section.id);
                    const previewCount = section.lessons.filter(l => l.isPreview).length;

                    return (
                        <div
                            key={section.id}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronDown
                                        size={20}
                                        className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {section.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {section.lessons.length} 個單元 • {getTotalDuration(section.lessons)}
                                            {previewCount > 0 && (
                                                <span className="ml-2 text-green-600">
                                                    • {previewCount} 個可預覽
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Section Content (Lessons) */}
                            {isExpanded && (
                                <div className="divide-y divide-gray-100">
                                    {section.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getLessonIcon(lesson)}
                                                <span className={`text-sm ${lesson.isPreview ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {lesson.title}
                                                </span>
                                                {lesson.isPreview && (
                                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                                                        預覽
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {lesson.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseCurriculum;
