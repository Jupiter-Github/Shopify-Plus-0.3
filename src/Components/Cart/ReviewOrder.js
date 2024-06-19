import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";

const displayPaymentDetails = (paymentMethod, paymentMethodData) => {
  if (paymentMethod === "UPI")
    return (
      <>
        <p>UPI id:{paymentMethodData.upiId}</p>
      </>
    );
  else if (paymentMethod === "Credit/Debit Card")
    return (
      <>
        <p className="mb-0">
          Card Holder Name:{paymentMethodData.cardDetails.cardHolderName}
        </p>
        <p className="mb-0">
          Card Number:{paymentMethodData.cardDetails.cardNumber}
        </p>
      </>
    );
};

const ReviewOrder = () => {
  const cartData = useSelector((state) => state.cartData);
  const userAddress = useSelector((state) => state.userAddress);
  const paymentDetails = useSelector(
    (state) => state.activeUserData.paymentDetails
  );
  const { paymentMethod, paymentMethodData } = paymentDetails;
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    pincode,
    email,
    mobileNumber,
  } = userAddress;

  const [open, setOpen] = useState("");

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  return (
    <>
      <Accordion className=" rounded-3  AddShadow" open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="1">
            <h6 className="m-0">Order Summary ({cartData?.length} items)</h6>
          </AccordionHeader>
          <AccordionBody
            className=" OrderSummaryItem  rounded-3"
            accordionId="1"
          >
            {cartData?.map((value, index) => (
              <Row className=" border-bottom  py-2" key={index}>
                <Col xs="3" md="2" className=" p-0 text-center">
                  <img className="ResizeImg" src={value.image} alt="product" />
                </Col>
                <Col xs="6" md="8" title={value.title}>
                  <p className="mb-0">{value.title}</p>
                  <span>Qty: {value.quantity}</span>
                </Col>
                <Col xs="3" md="2">
                  ${value.price}
                </Col>
              </Row>
            ))}
          </AccordionBody>
        </AccordionItem>
      </Accordion>

      <div className=" mt-4 p-2 rounded-3  AddShadow  ">
        <h5>Deliver to</h5>
        <h6 className="mb-0">
          {firstName} {lastName}
        </h6>
        <p className="mb-0">
          {address},{city},{state},{pincode}
        </p>
        <p className="mb-0">{email}</p>
        <p>{mobileNumber}</p>
      </div>

      <div className=" my-4 p-2 rounded-3  AddShadow   ">
        <h5>Payment Detail</h5>
        <p className="mb-0">Payment Method:{paymentMethod}</p>
        {displayPaymentDetails(paymentMethod, paymentMethodData)}
      </div>
    </>
  );
};

export default ReviewOrder;
