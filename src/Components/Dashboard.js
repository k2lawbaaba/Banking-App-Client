import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import "../Stylings/Dashboard.css";
import Transfer from "./Transfer";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Transaction from "./TransactionHistory";
import OverlayComponent from "./OverlayComp";
import Profile from "./Profile_info";
import ChangePasswordAndPIN from "./Changepassword";
import Table from "react-bootstrap/Table";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import Cookies from "js-cookie";
import jwtDecoder from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Query for the graphQl
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

const GET_TRANSACTION = gql`
  query GetTransactHistory($userId: String!) {
    Transaction(userId: $userId) {
      id
      account
      accountHolder
      receiverAccount
      receiverName
      Amount
      Narration
      typeOfTransaction
      Date
    }
  }
`;
const LOGOUT = gql`
  query logOut {
    LogOut {
      message
    }
  }
`;

const Dashboard = () => {
  let navigate = useNavigate();
  const [userData, setUserData] = useState([]);

  let date = new Date().toLocaleDateString();
  const [time, setTime] = useState();

  // to switch Components within the Dashboard
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Retrieve the token from the Cookies
  useEffect(() => {
    //   getting the time of the day
    const tim = new Date().getHours();
    if (tim < 12) setTime("Good Morning");
    else if (tim < 18) setTime("Good Afternoon");
    else setTime("Good Evening");

    let userCookies = Cookies.get("userToken");
    if (userCookies) {
      const token = jwtDecoder(userCookies);
      setUserData(token);
    }
  }, []);

  // varifying that the token exists
  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, []);

  // destructuring the decoded token
  const { id, exp } = userData;
  const expirationTime = exp;
  const currentTime = Math.floor(Date.now() / 1000);

  if (expirationTime < currentTime) {
    // Token has expired, redirect to homepage

    navigate("/");
  }

  // getting the Account details graphql query
  const {
    loading: loadingAccount,
    error: accountError,
    data: accountData,
    refetch: accountRefetch,
  } = useQuery(GET_ACCOUNT, {
    variables: {
      id: id,
    },
  });

  // getting the transaction history details graphql query
  const {
    loading: loadingTransactHIstory,
    error: transactionError,
    data: transactionData,
    refetch,
  } = useQuery(GET_TRANSACTION, {
    variables: {
      userId: id,
    },
  });

  // initialize the log out query using useLazyQuery
  const [logOut] = useLazyQuery(LOGOUT);

  if (loadingAccount || loadingTransactHIstory) {
    // return <p>Loading....</p>;
    return (
      <div className="loadingPage">
        <img
          src={require("../images/loading2.gif")}
          width="3rem"
          height="3rem"
        />
      </div>
    );
  }
  if (accountError || transactionError) {
    {
      return (
        <div className="TimeOutPage">
          <img
            src={require("../images/419-status-code.png")}
            alt="419 Timeout"
          />
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Please log in again
          </button>
          <div></div>
        </div>
      );
    }
  }

  const transacts = transactionData.Transaction;

  // console.log(transactionData);
  // destructure the data.Account data
  const { name, Balance, AccountNumber } = accountData.Account;

  const handleComponentSwitch = (component) => {
    setSelectedComponent(component);
    setShowOverlay(true);
  };
  const handleCloseSwitched = () => {
    setShowOverlay(false);
    refetch();
    accountRefetch();
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Navbar className=" dashboard-navbar ">
          <Container>
            <Navbar.Brand href="#home" className="nav-brand">
              Dashboard
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <NavDropdown
                title={name}
                id="basic-nav-dropdown"
                className="dashboard-nav-dropdwn"
              >
                <NavDropdown.Item
                  onClick={() => {
                    logOut();
                    navigate("/");
                  }}
                  className="dashboard-dropwn"
                >
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>
      <div className="dashboard-main">
        <div className="dashboard-actions">
          <a
            onClick={() => {
              handleComponentSwitch(<Transfer id={id} />);
            }}
          >
            Transfer
          </a>

          <a
            onClick={() => {
              handleComponentSwitch(<Deposit id={id} />);
              refetch();
              accountRefetch();
            }}
          >
            Deposit
          </a>

          <a
            onClick={() => {
              handleComponentSwitch(<Withdraw id={id} />);
              refetch();
              accountRefetch();
            }}
          >
            Withdraw
          </a>

          <a
            onClick={() => {
              handleComponentSwitch(
                <Transaction
                  transaction={transacts}
                  accountNo={AccountNumber}
                />
              );
              refetch();
              accountRefetch();
            }}
          >
            Transaction History
          </a>

          <div>
            <Dropdown className="dropdownProfile">
              <Dropdown.Toggle variant="" id="dropdown-basic">
                Profile
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    handleComponentSwitch(
                      <Profile userDetails={accountData.Account} />
                    );
                    refetch();
                    accountRefetch();
                  }}
                  className="profile"
                >
                  View Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    handleComponentSwitch(<ChangePasswordAndPIN id={id} />);
                  }}
                  className="profile"
                >
                  Change Password or PIN
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    logOut();
                    navigate("/");
                  }}
                  className="profile"
                >
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* <a>Sign Out</a> */}
        </div>
        <div className="dashboard-display">
          <div className="inner-display">
            <h5>{`Available Balance: NGN ${Balance}`}</h5>
            <p>{date}</p>
          </div>
          <div className="main-display">
            {/* the selected component gets displayed here */}
            {showOverlay ? (
              <OverlayComponent
                component={selectedComponent}
                onClose={handleCloseSwitched}
              />
            ) : (
              <div className="welcomeMsg">
                <h4>
                  {time}, {name.split(" ")[0]}
                </h4>
                <br />
                <h5>Transactions History </h5>
                <hr />
                <div className="db-content">
                  <Table borderless hover responsive className="transaction">
                    {transacts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="No_History">
                          <h3>NO TRANSACTION HISTORY</h3>
                        </td>
                      </tr>
                    ) : (
                      <div className="transactDiv">
                        {transacts.map((trans) => (
                          <tr key={trans.id} className="transactRow">
                            <td>{trans.Date}</td>
                            <td
                              className={
                                trans.typeOfTransaction == "DEPOSIT" ||
                                trans.receiverAccount == AccountNumber
                                  ? "DepositColor"
                                  : "Others"
                              }
                            >
                              {" "}
                              {trans.typeOfTransaction == "DEPOSIT" ||
                              trans.receiverAccount == AccountNumber
                                ? `+${trans.Amount}`
                                : `-${trans.Amount}`}
                            </td>
                            <td>
                              {trans.typeOfTransaction === "TRANSFER"
                                ? trans.receiverAccount == AccountNumber
                                  ? "FT/Credit"
                                  : "FT/Debit"
                                : trans.typeOfTransaction}
                            </td>

                            <td>
                              {trans.typeOfTransaction === "TRANSFER"
                                ? `FT/${trans.receiverName}/`
                                : " "}

                              {trans.typeOfTransaction === "TRANSFER"
                                ? trans.account == AccountNumber
                                  ? `${trans.receiverAccount}/`
                                  : `${trans.account}/`
                                : ""}

                              {trans.Narration}
                            </td>
                          </tr>
                        ))}
                      </div>
                    )}
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
