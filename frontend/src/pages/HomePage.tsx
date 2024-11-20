// src/pages/HomePage.tsx
import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto mt-10 p-4">
            <h2 className="text-4xl font-bold mb-4">Welcome to My Project</h2>
            <p className="text-lg mb-6">
                This is a modern React application that helps you manage and analyze websites efficiently.
                You can add websites, run checks using our backend services, and view comprehensive data reports.
            </p>
            <p className="text-lg">
                Get started by signing up or logging in. Once authenticated, you can navigate to your personalized dashboard
                to add new websites and access powerful data insights.
            </p>
        </div>
    );
};

export default HomePage;
