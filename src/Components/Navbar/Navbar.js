import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const activeNavLink = useLocation().pathname;
  return (
    <div className="Navbar">
      <header className="Navbar-header">
        <nav>
          <ul  className={`${styles.navMenu} `}>
            <li>
              <NavLink to="/home" className={activeNavLink==="/home"?styles.activeLink:styles.navLink} >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={activeNavLink==="/products"?styles.activeLink:styles.navLink} >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/flcps" className={activeNavLink==="/flcps"?styles.activeLink:styles.navLink} >
                FLCPS
              </NavLink>
            </li>
            <li>
              <NavLink to="/dispatch" className={activeNavLink==="/dispatch"?styles.activeLink:styles.navLink} >
                Dispatch
              </NavLink>
            </li>
            <li>
              <NavLink to="/fmea" className={activeNavLink==="/fmea"?styles.activeLink:styles.navLink} >
                FMEA
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}