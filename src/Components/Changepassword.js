import React, { useEffect, useState } from "react";
import "../Stylings/Changepassword.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $userId: String!
    $oldPassword: String!
    $newPassword: String!
  ) {
    ChangePassword(
      userId: $userId
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      message
    }
  }
`;
const CHANGE_PIN = gql`
  mutation changePIN($userId: String!, $oldPIN: String!, $newPIN: String!) {
    ChangePIN(userId: $userId, oldPIN: $oldPIN, newPIN: $newPIN) {
      message
    }
  }
`;

function ChangePwdAndPIN(prop) {
  // declaring the hooks state of the mutattions
  const [ChangePassword] = useMutation(CHANGE_PASSWORD);
  const [ChangePIN] = useMutation(CHANGE_PIN);

  const [click, setClick] = useState(false);

  const [switchPinAndPassword, setSwitchPinAndPassword] = useState(false);

  const handleEditClicked = (e) => {
    e.preventDefault();
    // console.log("clcik1", clicked);
    if (!click) {
      setClick(true);
      setSwitchPinAndPassword(false);
    } else {
      setClick(false);
      setSwitchPinAndPassword(true);
    }
  };
  const handleEditClicked2 = (e) => {
    e.preventDefault();
    // console.log("clcik1", clicked);
    if (!switchPinAndPassword) {
      setClick(true);
      setSwitchPinAndPassword(true);
    } else {
      setClick(false);
      setSwitchPinAndPassword(false);
    }
  };

  const validationSchema = yup.object({
    currentPassword: yup.string().required("Current Password is required"),

    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const validationPIN = yup.object({
    currentPIN: yup.string().required("Current PIN is required"),

    newPIN: yup
      .string()
      .required("PIN is required")
      .min(4, "PIN must be 4 digits")
      .max(4, "PIN must be max 4 digits")
      .matches(/^\d+$/, "PIN must contain only digits"),
  });

  const formikPassword = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const passwordChanged = await ChangePassword({
          variables: {
            userId: prop.id,
            oldPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        });
        if (passwordChanged) {
        
          if (
            passwordChanged.data.ChangePassword.message.includes("successfully")
          )
          {
            resetForm()
            alert (passwordChanged.data.ChangePassword.message);
          }
          else alert (passwordChanged.data.ChangePassword.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  const formikPIN = useFormik({
    initialValues: {
      currentPIN: "",
      newPIN: "",
    },
    validationSchema: validationPIN,
    onSubmit: async (values, { resetForm }) => {
      try {
        const PINChanged = await ChangePIN({
          variables: {
            userId: prop.id,
            oldPIN: values.currentPIN,
            newPIN: values.newPIN,
          },
        });
        console.log(PINChanged);
        if (PINChanged) {
          if (
            PINChanged.data.ChangePIN.message.includes("successfully")
          )
          {
            resetForm()
            alert (PINChanged.data.ChangePIN.message);

          }
          else alert (PINChanged.data.ChangePIN.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <div className="cp-body">
      <div className="cp-sec">
        <div className="cp-head">
          <h3>Login & Security</h3>
        </div>

        <div>
          <div className="cp-password">
            <button onClick={handleEditClicked}>Password</button>
            <button onClick={handleEditClicked2}>Pin</button>
          </div>
          {!click ? (
            <hr className="cp-hr" />
          ) : !switchPinAndPassword ? (
            <div>
              <form
                className="cp-forms"
                onSubmit={formikPassword.handleSubmit}
                method="put"
                action="/api/ChangePwdAndPIN"
              >
                <label>Current password:</label>
                <br></br>
                <input
                  type="password"
                  name="currentPassword"
                  onChange={formikPassword.handleChange}
                  onBlur={formikPassword.handleBlur}
                  value={formikPassword.values.currentPassword}
                  placeholder="Enter your current password"
                />
                {formikPassword.touched.currentPassword &&
                  formikPassword.errors.currentPassword && (
                    <p className="chngPwd-error-message">
                      {formikPassword.errors.currentPassword}
                    </p>
                  )}
                <br></br>
                <label>New password:</label>
                <br />
                <input
                  type="password"
                  name="newPassword"
                  onChange={formikPassword.handleChange}
                  onBlur={formikPassword.handleBlur}
                  value={formikPassword.values.newPassword}
                  placeholder="Enter your new password"
                />
                {formikPassword.touched.newPassword && formikPassword.errors.newPassword && (
                  <p className="chngPwd-error-message">
                    {formikPassword.errors.newPassword}
                  </p>
                )}
                <br />
                <label>Confirm new password:</label>
                <br />
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={formikPassword.handleChange}
                  onBlur={formikPassword.handleBlur}
                  value={formikPassword.values.confirmPassword}
                  placeholder="Confirm your password"
                />
                {formikPassword.touched.confirmPassword &&
                  formikPassword.errors.confirmPassword && (
                    <p className="chngPwd-error-message">
                      {formikPassword.errors.confirmPassword}
                    </p>
                  )}

                <br />
                <button className="cp-btn" type="submit">
                  Confirm
                </button>
              </form>
            </div>
          ) : (
            <form
              className="cp-forms"
              onSubmit={formikPIN.handleSubmit}
              method="put"
              action="/api/ChangePwdAndPIN"
            >
              <label>Current PIN:</label>
              <br></br>
              <input
                type="password"
                name="currentPIN"
                onChange={formikPIN.handleChange}
                onBlur={formikPIN.handleBlur}
                value={formikPIN.values.currentPIN}
                placeholder="Enter your current PIN or default 0000"
              />
              {formikPIN.touched.currentPIN && formikPIN.errors.currentPIN && (
                <p className="chngPwd-error-message">
                  {formikPIN.errors.currentPIN}
                </p>
              )}
              <br></br>
              <label>New PIN:</label>
              <br />
              <input
                type="password"
                name="newPIN"
                onChange={formikPIN.handleChange}
                onBlur={formikPIN.handleBlur}
                value={formikPIN.values.newPIN}
                placeholder="Enter your new PIN"
              />
              {formikPIN.touched.newPIN && formikPIN.errors.newPIN && (
                <p className="chngPwd-error-message">
                  {formikPIN.errors.newPIN}
                </p>
              )}
              <br />
              <button className="cp-btn" type="submit">
                Confirm
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePwdAndPIN;
