import React from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import { useAuth } from "../authContex";

const Authentication = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { user, isEmailVerified, setUser, setIsEmailVerified } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => {
    setShowEmailSent(false);
    setIsSignup((prev) => !prev);
  };

  const handleAuth = async (action) => {
    if (action === "Signin") {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        if (userCredential.user.emailVerified) {
          setUser(userCredential.user);
          setIsEmailVerified(userCredential.user.emailVerified);
          navigate("/todos");
        } else {
          setShowEmailSent(true);
        }
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    } else {
      if (formData.password === formData.confirmPassword) {
        try {
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          setIsSignup(false);
          sendEmailVerification(auth.currentUser!);
          setShowEmailSent(true);
        } catch (error) {
          alert(error.code);
          if (error.code === "auth/email-already-in-use") {
            setIsSignup(false);
          }
        }
      } else {
        alert("Password and Confirm Password Doesn't match");
      }
    }
  };

  useEffect(() => {
    if (user && isEmailVerified) {
      navigate("/todos");
    }
  }, [isEmailVerified]);

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        maxWidth: 400,
        textAlign: "center",
      }}
    >
      <Typography level="h4" sx={{ mb: 2 }}>
        {isSignup ? "Signup" : "Signin"}
      </Typography>
      <form>
        <Box sx={{ mb: 2, justifyContent: "start" }}>
          <Input
            value={formData.email}
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ width: "100%" }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Input
            value={formData.password}
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            sx={{ width: "100%" }}
          />
        </Box>
        {isSignup && (
          <Box sx={{ mb: 2 }}>
            <Input
              value={formData.confirmPassword}
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              sx={{ width: "100%" }}
            />
          </Box>
        )}
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleAuth(isSignup ? "Signup" : "Signin");
          }}
          sx={{
            width: "100%",
            padding: "10px",
            backgroundColor: isSignup ? "#4CAF50" : "#008CBA",
            color: "#fff",
            borderRadius: 1,
            mt: 2,
          }}
        >
          {isSignup ? "Signup" : "Signin"}
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        {isSignup ? (
          "Already have an account?"
        ) : showEmailSent ? (
          <Typography color="success">
            {" "}
            Please verify email to login{" "}
          </Typography>
        ) : (
          "Don't have an account?"
        )}{" "}
        <Link
          onClick={toggleForm}
          sx={{
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isSignup ? "Signin" : "Signup"}
        </Link>
      </Typography>
    </Box>
  );
};

export default Authentication;
