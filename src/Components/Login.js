import React, { useState } from "react";
import "../Stylings/login.css";
import { useFormik } from "formik";
import * as yup from "yup";
import {useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const LOGIN = gql`
  mutation User_Login($Username: String!, $password: String!) {
    Login(Username: $Username, password: $password) {
      message
    }
  }
`;

const Login = () => {
  const [warning, setWarning] = useState("");
    const [Login]= useMutation(LOGIN);

  const navigate = useNavigate();

  // Validating the user login credentials with yup
  const validationSchema = yup.object({
    username: yup.string().required(" username is required"),
    Password: yup.string().required("Password is required"),
  });

  // Setting up formik for validation and submission of data to backend API
  const formik = useFormik({
    initialValues: {
      username: "",
      Password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
        try {
           const response=await Login({
            variables:{
                Username: values.username,
                password: values.Password
            }
           })
          //  console.log(response);
           if(response){
            if(response.data.Login.message === "Logged in successfully")
            {
                alert("Logged in successfully");
                navigate("/Dashboard");
                setWarning("")

            }
            else setWarning(response.data.Login.message )
    
           }
           else{
            alert("Failed to log in. Try Again later")
           }
        } catch (error) {
          
          console.log(error)
        }
    },
  });

  return (
    <div className="login">
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <h1>Login</h1>

        <p className="warning-message">{warning}</p>

        <label htmlFor="username">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
        </label>
        {formik.touched.username && formik.errors.username && (
          <p className="error-message">{formik.errors.username}</p>
        )}
        <br />
        <label htmlFor="password">
          <input
            type="password"
            name="Password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Password}
          />
        </label>
        {formik.touched.Password && formik.errors.Password && (
          <p className="error-message">{formik.errors.Password}</p>
        )}
        <br />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
