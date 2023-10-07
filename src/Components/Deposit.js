import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";

const DEPOSIT =gql`
  mutation Do_Deposit($userId: String!, $amount:Float!){
    Deposit(userId:$userId, amount:$amount){
      message
    }
  }
`

const Deposit =(prop)=>{

    const [Deposit]= useMutation(DEPOSIT);


    // validatting the user input
    const validateInput = yup.object({
        Amount: yup
          .string()
          .required("Amount is required")
          .matches(/^([1-9]\d{0,}(\.\d{1,4})?|0(\.\d{1,4})?)$/, "Invalid amount"),
      });

      const formik = useFormik({
        initialValues: {
          Amount: "",
        },
        validationSchema: validateInput,
        onSubmit: async (values, {resetForm}) => {
          try {
            const deposited = await Deposit({
              variables:{
                userId: prop.id,
                amount:parseFloat(values.Amount)
              }
            })

            if(deposited){
              if(deposited.data.Deposit.message.includes("ransaction successful"))
              {
                alert(deposited.data.Deposit.message);
                resetForm();
              }
              else 
                alert(deposited.data.Deposit.message);
            }
          } catch (error) {
            console.log(error.message);
          }
        
        },
      });
    return <div className="deposit">

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
            
            <button type="submit" id="transfer-btn">
              Deposit
            </button>
          </form>
    </div>
}
export default Deposit;