import React from "react";
import styles from "./navbar.module.scss";
import {Nav, Navbar} from 'react-bootstrap';

export default function Navigate() {
  return (
    <Navbar fixed="top" bg="primary" variant="dark" className={styles["navbar"]}>
      <Nav.Link href="/" className="nav-link">TradiStonks</Nav.Link>
      <Nav.Link href="/register" className="nav-link">Register</Nav.Link>
      <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
    </Navbar>
  );
}
