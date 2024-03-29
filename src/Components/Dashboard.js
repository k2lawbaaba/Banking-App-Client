import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
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
import jwtDecoder from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

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
  let location = useLocation();

  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const [showBal, setShowBal] = useState(false);



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowBal=()=> setShowBal(true);
  const handleHideBal=()=> setShowBal(false);


 
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

    let userCookies = location.state
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
    return (
      <div className="TimeOutPage">
      <div>
        <img
          src={require("../images/session_exp.webp")}
          alt="419 Timeout"
        />
      </div>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Log in again
        </button>
    
      </div>
    );
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
                    console.log(location.state);
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
        <div className="dashboard-action">
        <Button variant="Secondary" className="d-lg-none" onClick={handleShow}>
        <img src={require('../images/open_menu_icon.png')} alt="openmenu"/>
      </Button>

      {/* <Alert variant="info" className="d-none d-lg-block">
        Resize your browser to show the responsive offcanvas toggle.
      </Alert> */}

      <Offcanvas show={show} onHide={handleClose} responsive="lg" className="canvass">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{" "}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="dashboard-actions">
          {/* <p className="mb-0">
            This is content within an <code>.offcanvas-lg</code>.
          </p> */}
          
       
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
          </Offcanvas.Body>
      </Offcanvas>
        </div>
          {/* <a>Sign Out</a> */}
        <div className="dashboard-display">
          <div className="inner-display">
          <div>

          {!showBal ?
          <button onClick={handleShowBal}><h5>Balance</h5> <img src={require('../images/eye-icons.png')} alt=""/></button>
          :
          <button onClick={handleHideBal}><h5>Balance</h5> <img src={require('../images/icons8-invisible.png')} alt=""/></button>
          }
            <h4>{showBal && `₦${Number(Balance).toLocaleString()}`}</h4>
          </div>
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
                                ? `+${Number(trans.Amount).toLocaleString()}`
                                : `-${Number(trans.Amount).toLocaleString()}`}
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
