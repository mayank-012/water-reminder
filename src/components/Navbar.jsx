import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import "../css/Navbar.css"

function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign-out failed:", error.message);
      });
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Container>
            <Button variant="contained" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Container>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
