// src/components/LandingPage.js
import React from "react";
import Authentication from "./Authentication";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        backgroundColor: "#f7f8fc",
      }}
    >
      {/* Header Section */}
      <Box
        component="header"
        sx={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          level="h1"
          sx={{
            fontSize: "2.5rem",
            margin: "0",
            color: "#333",
          }}
        >
          Welcome to Carm App
        </Typography>
        <Typography
          level="title-sm"
          sx={{
            fontSize: "1rem",
            color: "#666",
            marginTop: "10px",
          }}
        >
          Manage your tasks efficiently and stay organized.
        </Typography>
      </Box>

      {/* Main Section */}
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* AuthForm is used here for user authentication */}
        <Authentication />
      </Box>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#888",
        }}
      >
      <Typography level="body-xs"> © {new Date().getFullYear()} Chakradhar. All rights reserved.</Typography> 
      </Box>
    </Box>
  );
};

export default LandingPage;
