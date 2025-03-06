import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';

const Navbar = () => {
    const [activeMenu, setActiveMenu] = useState('home')

    useEffect(() => {
      const currentPath = window.location.pathname;
      setActiveMenu(currentPath.replace('/', ''));
    }, [])
    

    return (
        <nav class="navbar navbar-expand-md bg-primary navbar-dark">
        <div class="container container-fluid">
            <a class="navbar-brand" href="/">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <Link href='/' className={`nav-link ${activeMenu === 'home' ? 'active' : ''}`}>Home</Link>
                </li>
                <li class="nav-item">
                    <Link href='/simplecrud' className={`nav-link ${activeMenu === 'simplecrud' ? 'active' : ''}`}>Simple Crud</Link>
                </li>
                <li class="nav-item">
                    <Link href='/about' className={`nav-link ${activeMenu === 'about' ? 'active' : ''}`}>About</Link>
                </li>
                <li class="nav-item">
                    <Link href='/contact' className={`nav-link ${activeMenu === 'contact' ? 'active' : ''}`}>Contact</Link>
                </li>
            </ul>
            </div>
        </div>
        </nav>
    );
}

export default Navbar