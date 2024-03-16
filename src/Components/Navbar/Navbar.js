import React from "react";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  {
    /* adding the states  */
  }
  const [isActive, setIsActive] = useState(false);
  {
    /* add the active class */
  }
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  {
    /* clean up function to remove the active class */
  }
  const removeActive = () => {
    setIsActive(false);
  };
  return (
    <>
      <div className="Navbar">
        <header className="Navbar-header">
          <nav>
            <ul
              className={`${styles.navMenu} ${isActive ? styles.active : ""}`}
            >
              <li onClick={removeActive}>
                <a href="#home" className={`${styles.navLink}`}>
                  Home
                </a>
              </li>
              <li onClick={removeActive}>
                <a href="#home" className={`${styles.navLink}`}>
                  Products
                </a>
              </li>
              <li onClick={removeActive}>
                <a href="#home" className={`${styles.navLink}`}>
                  FLCPS
                </a>
              </li>
              <li onClick={removeActive}>
                <a href="#home" className={`${styles.navLink}`}>
                  Dispatch
                </a>
              </li>
              <li onClick={removeActive}>
                <a href="#home" className={`${styles.navLink}`}>
                  FMEA
                </a>
              </li>
            </ul>
            <div
              className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
              onClick={toggleActiveClass}
            >
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
            </div>
          </nav>
        </header>
      </div>
      <div className={styles.container}>
        <div className={styles.leftbox}>
          <button type="button" className={styles.btn}>
            Add new product
          </button>
          <button type="button" className={styles.btn}>
            Edit product
          </button>
        </div>
        <div className={styles.middlebox}>
          <button type="button" className={styles.btn}>
            Add sub-assembly
          </button>
          <button type="button" className={styles.btn}>
            Add component
          </button>
        </div>
        <div className={styles.rightbox}>
          <button type="button" className={styles.btn}>
            View
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.col}>
          <div className={styles.leftcol}>
            <h1 className={styles.h1}>Product detail</h1>
            </div>
          <div className={styles.rightcol}>
            <div>
               <h1 className={styles.h2}>Main assembly</h1>
            </div>
            <div>
               One of three columns
             </div>
            </div>
        </div>
      </div>
    </>
  );
}
