import React from 'react';
import Header from '../layout/Header';
import StudentSidebar from './StudentSidebar';
import './StudentLayout.css';

/**
 * StudentLayout 學生中心專用佈局
 * 包含頂部 Header、左側側邊導航、右側內容區
 */
const StudentLayout = ({ children }) => {
    return (
        <div className="student-layout">
            <Header />
            <div className="student-layout-body">
                <StudentSidebar />
                <main className="student-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
