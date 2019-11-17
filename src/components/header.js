import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GoogleAuth from './googleAuth';


const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Course Creator Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link ><Link to="/">Home</Link></Nav.Link>
                    <Nav.Link ><Link to="/admin">Course Creator Admin</Link></Nav.Link>
                    <Nav.Link ><Link to="/dashboard">Profile Dashboard</Link></Nav.Link>
                    <Nav.Link ><Link to="/dashboard">Blog</Link></Nav.Link>
                    <GoogleAuth />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;