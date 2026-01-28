import React from 'react';
import { Award, Users, MessageCircle, GraduationCap } from 'lucide-react';
import Badge from '../ui/Badge';
import './TrustBadges.css';

/**
 * TrustBadges 信任徽章條元件
 * 顯示品牌信任指標（講師背景、學員數、班級規模、社群支援）
 */
const TrustBadges = () => {
    const badges = [
        {
            icon: <Award size={20} />,
            text: "資展國際 AI 應用工程講師"
        },
        {
            icon: <GraduationCap size={20} />,
            text: "500+ 位學員完課"
        },
        {
            icon: <Users size={20} />,
            text: "小班制 6-10 人"
        },
        {
            icon: <MessageCircle size={20} />,
            text: "Discord 社群支援"
        }
    ];

    return (
        <section className="trust-badges-section">
            <div className="container">
                <div className="trust-badges-wrapper">
                    {badges.map((badge, index) => (
                        <Badge
                            key={index}
                            icon={badge.icon}
                            text={badge.text}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
