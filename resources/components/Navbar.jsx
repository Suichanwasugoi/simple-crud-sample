import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Navbar = () => {
    const [activeMenu, setActiveMenu] = useState('home');
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveMenu(currentPath.replace('/', '') || 'home');
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Simple Crud
                </Typography>

                {/* Desktop Links */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/"
                        onClick={() => setActiveMenu('home')}
                        sx={{ textTransform: 'none', fontWeight: activeMenu === 'home' ? 'bold' : 'normal' }}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/simplecrud"
                        onClick={() => setActiveMenu('simplecrud')}
                        sx={{ textTransform: 'none', fontWeight: activeMenu === 'simplecrud' ? 'bold' : 'normal' }}
                    >
                        Simple Crud
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/about"
                        onClick={() => setActiveMenu('about')}
                        sx={{ textTransform: 'none', fontWeight: activeMenu === 'about' ? 'bold' : 'normal' }}
                    >
                        About
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/contact"
                        onClick={() => setActiveMenu('contact')}
                        sx={{ textTransform: 'none', fontWeight: activeMenu === 'contact' ? 'bold' : 'normal' }}
                    >
                        Contact
                    </Button>
                </Box>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <Button color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            component={Link}
                            href="/"
                            onClick={() => {
                                setActiveMenu('home');
                                handleMenuClose();
                            }}
                        >
                            Home
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            href="/simplecrud"
                            onClick={() => {
                                setActiveMenu('simplecrud');
                                handleMenuClose();
                            }}
                        >
                            Simple Crud
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            href="/about"
                            onClick={() => {
                                setActiveMenu('about');
                                handleMenuClose();
                            }}
                        >
                            About
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            href="/contact"
                            onClick={() => {
                                setActiveMenu('contact');
                                handleMenuClose();
                            }}
                        >
                            Contact
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
