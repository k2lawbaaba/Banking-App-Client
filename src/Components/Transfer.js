import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import debounce from "lodash/debounce";

const GET_ACCOUNT = gql`
  query getAccount($accountNum: String!) {
    GetReceiverAccount(accountNum: $accountNum) {
      name
      AccountNumber
    }
  }
`;
const TRANSFER = gql`
  mutation TransferMoney(
    $userId: String!
    $receiverAccount: String!
    $amount: Float!
    $Narration: String
  ) {
    Transfer(
      userId: $userId
      receiverAccount: $receiverAccount
      amount: $amount
      Narration: $Narration
    ) {
      message
    }
  }
`;

const Transfer = (prop) => {
  const [accountNo, setAccountNo] = useState("");

  /* to toggle the components for the beneficiary's
    accoount and the transfer component*/
  const [details, setDetails] = useState(false);

  const [Transfer] = useMutation(TRANSFER);

  //fetch the receiver account details
  const [getAccount, {data }] = useLazyQuery(GET_ACCOUNT);

  const validateInput = yup.object({
    Amount: yup
      .string()
      .required("Amount is required")
      .matches(/^([1-9]\d{0,}(\.\d{1,4})?|0(\.\d{1,4})?)$/, "Invalid amount"),
    Narration: yup.string(),
  });

  // to toggle the form
  const handleReceiverAccount = debounce((e) => {
    e.preventDefault();
    let accountNum = e.target.value;
    let acctRegex = /^([0-9]\d{10})$/;
    if (acctRegex.test(accountNum)) {
      setAccountNo(accountNum);
      // console.log(accountNum)
      setDetails(!details);

      getAccount({
        variables: {
          accountNum: accountNum,
        },
      });
    }
  }, 100);

  // if (data && data.GetReceiverAccount !== null) {
  //   (data.GetReceiverAccount);
  // }

  const formik = useFormik({
    initialValues: {
      Amount: "",
      Narration: "",
    },
    validationSchema: validateInput,
    onSubmit: async (values, { resetForm }) => {
      try {
        const transferred = await Transfer({
          variables: {
            userId: prop.id,
            receiverAccount: accountNo,
            amount: parseFloat(values.Amount),
            Narration: values.Narration,
          },
        });
        if (transferred) {
          if (transferred.data.Transfer.message.includes("₦")) {
            alert(transferred.data.Transfer.message);

            resetForm();
          } else alert(transferred.data.Transfer.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });
  return (
    <div className="transfer">
      {details && data && (
        <div className="displayAccount-details">
          {data.GetReceiverAccount !== null ? (
            <div className="user-details">
              <p>{data.GetReceiverAccount.name}</p>
              <p>
                {data.GetReceiverAccount.AccountNumber}
                <button onClick={() => setDetails(!details)}>Change</button>
              </p>
            </div>
          ) : (
            <div>
              <h6>Account not found</h6>
              <button onClick={() => setDetails(!details)}>Change</button>
            </div>
          )}
        </div>
      )}
      {!details ? (
        <div>
          <label htmlFor="receiver">Beneficiary's Account Number</label>
          <br />
          <input
            type="number"
            name="receiverAccount"
            placeholder="input account number"
            onChange={handleReceiverAccount}
          />
          <br />
        </div>
      ) : (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="amount">Amount</label>
            <br />
            <input
              type="text"
              name="Amount"
              placeholder="Enter Amount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Amount}
            />
            {formik.touched.Amount && formik.errors.Amount && (
              <p className="dashboard-error-message">{formik.errors.Amount}</p>
            )}
            <br />
            <label htmlFor="Narration">Narration(Optional)</label>
            <br />
            <input
              type="text"
              name="Narration"
              placeholder="Enter Narration"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Narration}
            />
            <br />
            <button type="submit" id="transfer-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Transfer;
