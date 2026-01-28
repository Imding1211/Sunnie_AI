import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/home/HeroSection';
import TrustBadges from '../components/home/TrustBadges';
import CoursesSection from '../components/home/CoursesSection';
import ServicesSection from '../components/home/ServicesSection';
import PainPointsSection from '../components/home/PainPointsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FinalCTA from '../components/home/FinalCTA';

/**
 * HomePage 首頁
 * 整合所有首頁區塊元件
 */
const HomePage = () => {
    return (
        <MainLayout>
            <HeroSection />
            <TrustBadges />
            <CoursesSection />
            <ServicesSection />
            <PainPointsSection />
            <TestimonialsSection />
            <FinalCTA />
        </MainLayout>
    );
};

export default HomePage;
