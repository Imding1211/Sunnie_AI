import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../data/testimonialsData';
import './TestimonialsSection.css';

/**
 * TestimonialsSection 學員見證區塊元件
 * 顯示學員成功轉職的見證與評價
 */
const TestimonialsSection = () => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                fill={index < rating ? 'var(--color-cta)' : 'none'}
                stroke={index < rating ? 'var(--color-cta)' : 'var(--color-border)'}
            />
        ));
    };

    return (
        <section className="testimonials-section section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">他們都成功轉職了</h2>
                    <p className="section-subtitle">學長姐真心話</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-card">
                            <div className="testimonial-photo-wrapper">
                                <img
                                    src={testimonial.photo}
                                    alt={testimonial.name}
                                    className="testimonial-photo"
                                />
                            </div>

                            <h4 className="testimonial-name">{testimonial.name}</h4>
                            <p className="testimonial-role">{testimonial.previous_role}</p>

                            <div className="testimonial-rating">
                                {renderStars(testimonial.rating)}
                            </div>

                            <p className="testimonial-text">「{testimonial.testimonial}」</p>

                            <div className="testimonial-achievement">
                                {testimonial.achievement}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
