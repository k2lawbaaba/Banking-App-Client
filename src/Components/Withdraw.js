import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";

// graphql client query
const WITHDRAW = gql`
  mutation do_Withdraw( $userId:String!, $amount:Float! ){
    Withdraw(userId:$userId, amount:$amount){
      message
    }
  }
`

const Withdraw =(prop)=>{

  const [Withdraw]=useMutation(WITHDRAW);

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
            const withdrawn = await Withdraw({
              variables:{
                userId : prop.id ,
                amount: parseFloat(values.Amount),
              }
            })
            if(withdrawn){
              if(withdrawn.data.Withdraw.message.includes("ransaction successful")){
                alert(withdrawn.data.Withdraw.message)
                resetForm();
              }
              else
              alert(withdrawn.data.Withdraw.message)

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
              Withdraw
            </button>
          </form>
    </div>
}
export default Withdraw;