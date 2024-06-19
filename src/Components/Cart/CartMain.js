import React, { useState } from "react";
import LoginModal from "../LoginModal";
import OrderSummary from "./OrderSummary";
import CartPage from "./CartPage";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import AddressPage from "./AddressPage";
import PaymentPage from "./PaymentPage";
import ReviewOrder from "./ReviewOrder";
import CartBreadCrumb from "./CartBreadCrumb";
import SavedAddressList from "./SavedAddressList";
import emptyCart from "../Images/emptyCart.png";

const getElement = (compName, setDisableButton) => {
  switch (compName) {
    case "CartPage":
      return <CartPage />;
    case "SavedAddressList":
      return <SavedAddressList />;
    case "AddressPage":
      return <AddressPage />;
    case "PaymentPage":
      return <PaymentPage setDisableButton={setDisableButton} />;
    case "ReviewOrder":
      return <ReviewOrder />;
    default:
      return null;
  }
};

const CartMain = () => {
  const cartComponent = useSelector((state) => state.cartComponentName);
  const [disableButton, setDisableButton] = useState(true);
  const cartData = useSelector((state) => state.cartData);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {cartData.length > 0 ? (
        <Container fluid className="mt-5 ">
          <Row>
            <Col className=" py-3" xs="12" md="8" xl="9 ">
              <CartBreadCrumb />
              {getElement(cartComponent, setDisableButton)}
            </Col>
            <Col xs="12" md="4" xl="3">
              <OrderSummary
                setModal={setShowModal}
                disableButton={disableButton}
              />
            </Col>
          </Row>{" "}
          <LoginModal modal={showModal} setModal={setShowModal} />
        </Container>
      ) : (
        <Container className="text-center mt-5 " fluid>
          <Row className="  justify-content-center">
            <Col xs="12" md="6">
              <img src={emptyCart} alt="Empty Cart" className="  img-fluid" />
              <h2>Your Cart is Empty</h2>
              <p className="text-muted">
                Add items to your cart to see them here.
              </p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default CartMain;
