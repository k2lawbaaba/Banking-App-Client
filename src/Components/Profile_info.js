import React, { useEffect, useRef, useState } from "react";
import "../Stylings/Profile_info.css";
import pic from "../images/user.webp";
import Table from "react-bootstrap/Table";
import { useQuery, gql } from "@apollo/client";
import Cookies from "js-cookie";
import jwtDecoder from "jwt-decode";

const GET_ACCOUNT = gql`
  query GetAccount($id: String!) {
    Account(id: $id) {
      name
      email
      Phone
      AccountNumber
      Balance
    }
  }
`;

function ProfileInfo(props) {
 

  const [imgSrc, setImageScr] = useState(pic);
  const [userProfile, setUserProfile] = useState([]);

  const { name, email, Phone, AccountNumber } = props.userDetails;

  return (
    <div className="pi-body">
      <section className="pi-sec">
        <div className="pi-head">
          <h2>Personal info</h2>
        </div>
        <div className="pi-update">
          <img
            src={
              userProfile.profilePic ? `${userProfile.profilePic}` : `${imgSrc}`
            }
            alt="Profile picture"
            className="pi-pic"
          />
        </div>
      </section>

      <Table borderless size="sm">
        <tbody>
          <tr>
            <td className="profileCells">Name</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td className="profileCells">Phone Number</td>
            <td>{Phone}</td>
          </tr>
          <tr>
            <td className="profileCells">Email</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td className="profileCells">Account Number</td>
            <td>{AccountNumber}</td>
          </tr>
          <tr>
            <td className="profileCells">BVN</td>
            <td>{'00' + Phone}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default ProfileInfo;
