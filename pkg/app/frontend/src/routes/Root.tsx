import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Root() {
    return (
        <>
            <Navbar />
            <div className="h-full pt-10">
                <Outlet />
            </div>
        </>
    );
}
