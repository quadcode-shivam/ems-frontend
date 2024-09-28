import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from "reactstrap";

import routes from "routes.js";

function DemoNavbar(props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("#080B0F");
  const sidebarToggle = React.useRef();

  const toggle = () => {
    setIsOpen(!isOpen);
    setColor(isOpen ? "#080B0F" : "#4a5a5f"); 
  };

  const getBrand = () => {
    for (const route of routes) {
      if (route.collapse) {
        for (const view of route.views) {
          if (view.path === location.pathname) {
            return view.name;
          }
        }
      } else if (route.path === location.pathname) {
        return route.name;
      }
    }
    return "Brand";
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  React.useEffect(() => {
    const updateColor = () => {
      setColor(window.innerWidth < 993 && isOpen ? "#4a5a5f" : "#080B0F"); // Adjust color on resize
    };

    window.addEventListener("resize", updateColor);
    return () => window.removeEventListener("resize", updateColor);
  }, [isOpen]);

  React.useEffect(() => {
    if (window.innerWidth < 993 && document.documentElement.classList.contains("nav-open")) {
      document.documentElement.classList.remove("nav-open");
      sidebarToggle.current.classList.remove("toggled");
    }
  }, [location]);

  return (
    <Navbar
      style={{ backgroundColor: location.pathname.includes("full-screen-maps") ? "#080B0F" : color }}
      expand="lg"
      className="navbar-absolute fixed-top"
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={openSidebar}
              aria-label="Toggle sidebar"
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle} aria-label="Toggle navigation">
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
            <NavItem>
              <Link to="#pablo" className="nav-link">
                <i className="now-ui-icons users_single-02" />
                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
