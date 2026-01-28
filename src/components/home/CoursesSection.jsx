import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { courses } from '../data/coursesData';
import './CoursesSection.css';

/**
 * CoursesSection 主推課程區塊元件
 * 顯示精選課程列表
 */
const CoursesSection = () => {
    const navigate = useNavigate();

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const handleViewMore = () => {
        navigate('/courses');
    };

    return (
        <section className="courses-section section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">最受歡迎的課程</h2>
                    <p className="section-subtitle">
                        精選業界最實用的課程內容，由資深講師親授，幫助你快速掌握核心技能
                    </p>
                </div>

                <div className="courses-grid">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            image={course.thumbnail}
                            imageAlt={course.title}
                            title={course.title}
                            description={course.description}
                            hoverable={true}
                            onClick={() => handleCourseClick(course.id)}
                            footer={
                                <>
                                    <div className="course-price">
                                        <span className="price-current">NT$ {course.price.toLocaleString()}</span>
                                        {course.original_price && (
                                            <span className="price-original">NT$ {course.original_price.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <Button variant="primary" size="small">
                                        立即查看
                                    </Button>
                                </>
                            }
                        />
                    ))}
                </div>

                <div className="section-cta">
                    <Button
                        variant="ghost"
                        size="medium"
                        onClick={handleViewMore}
                    >
                        查看更多課程 <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;
