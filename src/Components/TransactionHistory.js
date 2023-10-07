import React from "react";
import Table from "react-bootstrap/Table";

function Transaction(prop) {
  const transaction = prop.transaction;
  const accountNo = prop.accountNo;
  // console.log(accountNo);
  // console.log(transaction);
  return (
    <div className="transact">
      <h5>Transactions History </h5>
      <hr />
      <div className="db-content">
        <Table borderless hover responsive className="transaction">
          <tbody>
            {transaction.length === 0 ? (
              <tr>
                <td colSpan={8} className="No_History">
                  <h3>NO TRANSACTION HISTORY</h3>
                </td>
              </tr>
            ) : (
              <div className="transactDiv">
                {transaction.map((trans) => (
                  <tr
                    key={trans.id}
                    className="transactionRow"
                    onClick={() => alert(trans.id)}
                  >
                    <td>{trans.Date.split(",")[0]}</td>
                    <td
                      className={
                        trans.typeOfTransaction === "DEPOSIT" ||
                        trans.receiverAccount === accountNo
                          ? "DepositColor"
                          : "Others"
                      }
                    >
                      {trans.typeOfTransaction === "DEPOSIT" ||
                      trans.receiverAccount === accountNo
                        ? `+${trans.Amount}`
                        : `-${trans.Amount}`}
                    </td>
                    <td>{trans.account}</td>
                    <td>
                      {trans.typeOfTransaction === "TRANSFER"
                        ? trans.receiverAccount === accountNo
                          ? "FT/Credit"
                          : "FT/Debit"
                        : trans.typeOfTransaction}
                    </td>
                    <td>
                      {trans.typeOfTransaction === "TRANSFER"
                        ? `FT/${trans.receiverName}/`
                        : " "}

                      {trans.typeOfTransaction === "TRANSFER"
                        ? trans.account === accountNo
                          ? `${trans.receiverAccount}/`
                          : `${trans.account}/`
                        : ""}

                      {trans.Narration}
                    </td>

                  </tr>
                ))}
              </div>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Transaction;
