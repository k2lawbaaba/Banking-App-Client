import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "../Stylings/signUp.css";
import { useMutation, gql } from "@apollo/client";

const SIGNUP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $Username: String!
    $Email: String!
    $PhoneNumber: String!
    $Password: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      Username: $Username
      Email: $Email
      PhoneNumber: $PhoneNumber
      Password: $Password
    ) {
      message
    }
  }
`;

const SignUp = () => {
  // const [message, setMsg] = useState();
  const [signUp] = useMutation(SIGNUP);

  // Validation for user inputs using yup
  const validationSchema = yup.object({
    firstName: yup.string().required(" First name is required"),
    lastName: yup.string().required(" Last name is required"),
    Username: yup
      .string()
      .required(" Username is required")
      .min(3, "Username must be minimum of 3 characters")
      .matches(
        /^(?![0-9])[a-zA-Z0-9_]{3,}$/,
        `Username can't start with number or contain white space`
      ),
    PhoneNumber: yup
      .string()
      .required(" Phone number is required")
      .matches(/^(0)[7-9]{1}[0-9]{9}$/, "Invalid phone number"),
    Email: yup
      .string()
      .email("Invalid email: 'example@gmail.com'")
      .required(" Email is required"),

    Password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain UPPERCASE, DIGIT, and SPECIAL CHARACTERS"
      ),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref("Password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      Username: "",
      PhoneNumber: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      //   Handle form submission
      try {
        const response = await signUp({
          variables: {
            firstName: values.firstName,
            lastName: values.lastName,
            Username: values.Username,
            Email: values.Email,
            PhoneNumber: values.PhoneNumber,
            Password: values.Password,
          },
        });

        if (response) {
          if (response.data.signUp.message === "Account created successfully") {
            alert(response.data.signUp.message);
            resetForm();
          } else alert(response.data.signUp.message);
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    },
  });

  return (
    <div className="signup">
      <h1>Open an account</h1>
      <form
        onSubmit={formik.handleSubmit}
        method="post"
        className="signup-form"
      >
        <label htmlFor="firstName">Firstname:</label>
        <br />
        <input
          name="firstName"
          className="sp-input-testing"
          type="text"
          id="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <p className="signup-error-message">{formik.errors.firstName}</p>
        )}
        <br />
        <label htmlFor="lastName">Lastname:</label>
        <br />
        <input
          name="lastName"
          className="sp-input-testing"
          type="text"
          id="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="signup-error-message">{formik.errors.lastName}</p>
        )}
        <br />
        <label htmlFor="Username">Username:</label>
        <br />
        <input
          name="Username"
          className="sp-input-testing"
          type="text"
          id="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.Username}
        />

        {formik.touched.Username && formik.errors.Username && (
          <p className="signup-error-message">{formik.errors.Username}</p>
        )}
        <br />
        <label htmlFor="Email">Email:</label>
        <br />

        <input
          name="Email"
          className="sp-input-testing"
          type="email"
          id="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.Email}
        />

        {formik.touched.Email && formik.errors.Email && (
          <p className="signup-error-message">{formik.errors.Email}</p>
        )}
        <br />
        <label htmlFor="PhoneNumber">Phone Number:</label>
        <br />

        <input
          name="PhoneNumber"
          className="sp-input-testing"
          type="text"
          id="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.PhoneNumber}
        />

        {formik.touched.PhoneNumber && formik.errors.PhoneNumber && (
          <p className="signup-error-message">{formik.errors.PhoneNumber}</p>
        )}
        <br />
        <label htmlFor="Password">Password:</label>
        <br />

        <input
          name="Password"
          id="password"
          className="sp-input-testing"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.Password}
        />

        {formik.touched.Password && formik.errors.Password && (
          <p className="signup-error-message">{formik.errors.Password}</p>
        )}
        <br />
        <label htmlFor="Confirm Password">Confirm Password:</label>
        <br />

        <input
          name="ConfirmPassword"
          id="password"
          className="sp-input-testing"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ConfirmPassword}
        />
        {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword && (
          <p className="signup-error-message">
            {formik.errors.ConfirmPassword}
          </p>
        )}
        <br />
        <button className="signup-btn" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};
export default SignUp;
