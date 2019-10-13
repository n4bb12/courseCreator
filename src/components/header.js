import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GoogleAuth from './googleAuth';


const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link ><Link to="/">Stream Home</Link></Nav.Link>
                    <Nav.Link ><Link to="/streams/show">Steam Show</Link></Nav.Link>
                    <GoogleAuth />
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item>Stream List</NavDropdown.Item>
                        <NavDropdown.Item>Stream Create</NavDropdown.Item>
                        <NavDropdown.Item>Stream Edit</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;