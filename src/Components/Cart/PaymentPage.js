import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import upiIcon from "../../PaymentIcons/upiIcon.png";
import codIcon from "../../PaymentIcons/codIcon.png";
import cardIcon from "../../PaymentIcons/cardIcon.png";
import {
  Row,
  Col,
  Button,
  Input,
  Collapse,
  InputGroupText,
  InputGroup,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { updateUserDataInDb, setStateProperty } from "../../Redux/EcomActions";
import InputField from "./InputField";

const collapseBodyContent = (
  paymentMethod,
  userPaymentData,
  setUserPaymentData
) => {
  const cardNumberFormate = (e, setFieldValue) => {
    let Cnum = e.target.value;
    Cnum = Cnum.replace(/\D+/g, "")
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setFieldValue("cardNumber", Cnum);
  };

  const expirydateFormate = (e, setFieldValue) => {
    let value = e.target.value;
    value = value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d{1,2})/, "$1/$2")
      .replace(/^(\d{2})\/(\d{2}).*/, "$1/$2");
    setFieldValue("expiryDate", value);
  };

  if (paymentMethod === "UPI")
    return (
      <Formik // FORM for payment method BY UPI
        initialValues={{
          upiUser: "",
          upiBankName: "",
        }}
        validationSchema={Yup.object({
          upiUser: Yup.string().required("Enter UPI UserName"),
          upiBankName: Yup.string()
            .matches(/^[a-zA-Z]+$/, "Only characters from a-z allowed")
            .required("Bank name cannot be empty"),
        })}
        onSubmit={(values, { resetForm }) => {
          const { upiUser, upiBankName } = values;
          setUserPaymentData({
            ...userPaymentData,
            paymentMethodData: {
              upiId: `${upiUser}@${upiBankName}`,
            },
          });
          toast.success(`${paymentMethod} details saved`);
          // resetForm();
        }}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col md="8">
                {" "}
                <FormGroup>
                  <label className="mb-1"> Enter UPI ID</label>
                  <InputGroup>
                    {" "}
                    <Input
                      invalid={
                        formik.touched.upiUser && !!formik.errors.upiUser
                      }
                      placeholder="username"
                      {...formik.getFieldProps("upiUser")}
                    />
                    <InputGroupText>@</InputGroupText>
                    <Input
                      invalid={
                        formik.touched.upiBankName &&
                        !!formik.errors.upiBankName
                      }
                      {...formik.getFieldProps("upiBankName")}
                      placeholder="bank"
                    />
                    <FormFeedback invalid>
                      {formik.errors.upiUser || formik.errors.upiBankName}
                    </FormFeedback>
                  </InputGroup>
                  <Button type="submit" className=" mt-2 bg-dark rounded-pill">
                    Save UPI Details
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    );
  else if (paymentMethod === "Credit/Debit Card")
    return (
      <Formik // FORM for payment method BY CARD
        initialValues={{
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardHolderName: "",
        }}
        validationSchema={Yup.object({
          cardNumber: Yup.string()
            .matches(
              /^\d{4} \d{4} \d{4} \d{4}$/,
              "Card Number must be exactly 16 digits"
            )
            .required("Card Number is required"),
          cardHolderName: Yup.string()
            .matches(/^[a-zA-Z]+$/, "Only characters from a-z allowed")
            .required("Name cannot be empty")
            .max(20, "Name should be less than 20 characters"),
          expiryDate: Yup.string()
            .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date")
            .required("Expiry Date is required"),
          cvv: Yup.string()
            .matches(/^\d{3}$/, "Invald CVV")
            .required("CVV is required"),
        })}
        onSubmit={(values, { resetForm }) => {
          setUserPaymentData({
            ...userPaymentData,
            paymentMethodData: {
              cardDetails: values,
            },
          });
          toast.success(`${paymentMethod} details saved`);
          // resetForm();
        }}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col md={6}>
                {" "}
                <InputField
                  id="cardNumber"
                  name="cardNumber"
                  label="Card Number"
                  handleChange={(e) => {
                    cardNumberFormate(e, formik.setFieldValue);
                  }}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />{" "}
              </Col>
              <Col md={6}>
                {" "}
                <InputField
                  id="cardHolderName"
                  name="cardHolderName"
                  label="Card Holder Name"
                />
              </Col>
              <Col md={6}>
                {" "}
                <InputField
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry Date"
                  handleChange={(e) => {
                    expirydateFormate(e, formik.setFieldValue);
                  }}
                  maxLength="5"
                  placeholder="MM/YY"
                />
              </Col>
              <Col md={6}>
                {" "}
                <InputField label="CVV" id="cvv" name="cvv" maxLength="3" />
              </Col>
            </Row>
            <Button type="submit" className="bg-dark rounded-pill">
              Save Card Details
            </Button>
          </Form>
        )}
      </Formik>
    );
};

const PaymentPage = ({ setDisableButton }) => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [userPaymentData, setUserPaymentData] = useState({});
  const { paymentMethodData = {} } = userPaymentData;

  const Options = [
    {
      paymentMethod: "UPI",
      paymentIcon: upiIcon,
      showCollapes: true,
    },
    {
      paymentMethod: "Credit/Debit Card",
      paymentIcon: cardIcon,
      showCollapes: true,
    },
    {
      paymentMethod: "Cash On Delivery",
      paymentIcon: codIcon,
      showCollapes: false,
    },
  ];

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    if (value === "Cash On Delivery") {
      setUserPaymentData({
        paymentMethod: value,
        paymentMethodData: {
          cod: value,
        },
      });
    } else setUserPaymentData({ paymentMethod: value, paymentMethodData: {} }); //if user change option in between
  };

  const handleFinalClick = () => {
    dispatch(updateUserDataInDb("paymentDetails", userPaymentData));
    setDisableButton(false);
    dispatch(setStateProperty("cartComponentName", "ReviewOrder"));
  };

  const handleBack = () => {
    dispatch(setStateProperty("cartComponentName", "SavedAddressList"));
  };
  return (
    <>
      {Options.map((option, index) => (
        <Row key={index} className="AddShadow rounded-4 py-2 mx-2  my-3 ">
          <Col className="d-flex justify-content-between">
            <div className="paymentMethodNameDiv">
              <span className="paymentIcon  me-3">
                <img src={option.paymentIcon} alt="" />
              </span>
              <span>{option.paymentMethod}</span>
            </div>
            <Input
              type="radio"
              checked={selectedOption === option.paymentMethod}
              onChange={() => handleOptionChange(option.paymentMethod)}
            />
          </Col>
          {option.showCollapes && (
            <Collapse
              className=" mt-2 border-top py-2"
              isOpen={selectedOption === option.paymentMethod}
            >
              {collapseBodyContent(
                option.paymentMethod,
                userPaymentData,
                setUserPaymentData
              )}
            </Collapse>
          )}
        </Row>
      ))}

      <div className="mt-2 d-flex float-md-end ">
        <Button
          onClick={handleBack}
          className=" me-2  bg-dark rounded-pill d-none d-md-inline"
        >
          Back
        </Button>
        <Button
          disabled={!Object?.keys(paymentMethodData).length > 0}
          onClick={handleFinalClick}
          className="bg-dark rounded-pill"
          block
        >
          Review final Order
        </Button>
      </div>
    </>
  );
};

export default PaymentPage;
