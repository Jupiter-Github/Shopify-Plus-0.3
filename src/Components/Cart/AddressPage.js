import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAddress, updateUserDataInDb } from "../../Redux/EcomActions";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import InputField from "./InputField";
import { Row, Col, Button } from "reactstrap";

const AddressPage = () => {
  const dispatch = useDispatch();
  const isAddressAdded = useSelector((state) => state.isAddressAdded);
  const [isPinValid, setisPinValid] = useState(isAddressAdded);
  const userAddress = useSelector((state) => state.userAddress);

  const {
    firstName = "",
    lastName = "",
    mobileNumber = "",
    email = "",
    address = "",
    pincode = "",
    city = "",
    state = "",
  } = userAddress;

  const getPinData = (e, setFieldValue) => {//to authenticate Pincode and set state and city name
    let pincode = e.target.value;
    pincode = pincode.replace(/\D+/g, "");
    setFieldValue("pincode", pincode);
    if (pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((response) => response.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            setisPinValid(true);
            setFieldValue("city", data[0].PostOffice[0].District);
            setFieldValue("state", data[0].PostOffice[0].State);
          } else {
            setisPinValid(false);
            toast.error("INVALID PIN");
            setFieldValue("pincode", "");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setisPinValid(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          firstName,
          lastName,
          mobileNumber,
          email,
          address,
          pincode,
          city,
          state,
        }}
        validationSchema={Yup.object({
          pincode: Yup.number()
            .required("Enter your pincode")
            .min(100000, "Pincode must consist of 6 digit")
            .max(999999, "Pincode must consist of 6 digit"),
          firstName: Yup.string()
            .matches(/^[a-zA-Z]+$/, "Only chracters from a-z allowed")
            .required("Enter your first name")
            .max(20, "Name should less 20 chracter"),
          lastName: Yup.string()
            .matches(/^[a-zA-Z]+$/, "Only chracters from a-z allowed")
            .required("Enter your last name")
            .max(20, "Name should less 20 chracter"),
          mobileNumber: Yup.string()
            .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
            .required("Mobile number is required"),
          address: Yup.string()
            .required("Enter required address details")
            .min(10, "Minimum 10 characters required"),
          city: Yup.string().required("Enter your City"),
          email: Yup.string().email("Invalid Email"),
        })}
        onSubmit={(values) => {
          toast.success("Address Saved..");
          dispatch(updateUserDataInDb("address", values));
          dispatch(setUserAddress(values, true));
        }}
      >
        {(formik) => (
          <Form className="AddShadow rounded-4 px-4 py-3">
            <InputField
              id="pincode"
              name="pincode"
              label="*Pin Code"
              disabled={false}
              valid={isPinValid}
              handleChange={(e) => getPinData(e, formik.setFieldValue)}
            />
            <Row>
              <Col md={4}>
                <InputField
                  id="firstName"
                  name="firstName"
                  disabled={!isPinValid}
                  label="*First Name"
                />
              </Col>
              <Col md={4}>
                <InputField
                  id="lastName"
                  name="lastName"
                  disabled={!isPinValid}
                  label="*Last Name"
                />
              </Col>
              <Col md={4}>
                <InputField
                  id="mobileNumber"
                  name="mobileNumber"
                  disabled={!isPinValid}
                  label="*Mobile Number"
                />
              </Col>
            </Row>
            <InputField
              id="address"
              name="address"
              disabled={!isPinValid}
              label="*Address"
            />
            <Row>
              <Col md={4}>
                {" "}
                <InputField
                  id="email"
                  name="email"
                  disabled={!isPinValid}
                  label="E-mail(Optional)"
                />
              </Col>
              <Col md={4}>
                {" "}
                <InputField
                  id="city"
                  name="city"
                  disabled={!isPinValid}
                  label="*City"
                />
              </Col>
              <Col md={4}>
                <InputField id="state" name="state" label="*State" disabled />
              </Col>
            </Row>

            <Button
              type="submit"
              className="bg-dark rounded-pill me-md-4"
              block
            >
              Save Address
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddressPage;
