import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Row,
  Col,
  FormText,
  FormFeedback,
  Label,
  FormGroup,
  Form,
  Button,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  updateUserDataInDb,
  setStateProperty,
} from "../../Redux/EcomActions";
import orderPlaced from "../Images/orderPlaced.jpg";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const DISCOUNT_CODE = {
  DIS10: 0.1,
  DIS20: 0.2,
};

const OrderSummary = ({ disableButton, setModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const subTotal = useSelector((state) => state.subTotal);
  const cartData = useSelector((state) => state.cartData);
  const isAddressAdded = useSelector((state) => state.isAddressAdded);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const roundOff = (floatNum) => parseFloat(floatNum.toFixed(2));
  const tax = roundOff(0.18 * subTotal);

  const [state, setState] = useState({
    validation: "",
    discountCode: "",
    discountAmount: 0,
    shippingCharges: 0,
    cartTotal: 0,
    showConfetti: false,
  });

  const updateCartTotal = useCallback(() => {
    const { shippingCharges, discountAmount } = state;
    const newCartTotal = isAddressAdded
      ? subTotal + shippingCharges + tax - discountAmount
      : subTotal + tax - discountAmount;
    setState((prevState) => ({
      ...prevState,
      cartTotal: roundOff(newCartTotal),
    }));
  }, [
    subTotal,
    state.discountAmount,
    state.shippingCharges,
    isAddressAdded,
    tax,
  ]);

  useEffect(() => {
    const shippingCharges = isAddressAdded ? roundOff(0.1 * subTotal) : "TBD";
    setState((prevState) => ({ ...prevState, shippingCharges }));
    updateCartTotal();
  }, [isAddressAdded, subTotal, state.shippingCharges, state.discountAmount]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      discountAmount: 0,
      discountCode: "",
      validation: "",
    }));
  }, [subTotal]);

  const calculateDiscount = (e) => {
    e.preventDefault();
    const discount = DISCOUNT_CODE[state.discountCode] || 0;
    const discountAmount = roundOff(discount * subTotal);
    setState({
      ...state,
      discountAmount,
      validation: discount ? "Success" : "Unsuccessful",
    });
  };


  
  const handleCheckout = () => {
    if (isLoggedIn) {
      dispatch(updateUserDataInDb("cartItems", []));
      dispatch(updateUserDataInDb("orderedItems", cartData));
      dispatch(updateUserDataInDb("finalBillAmount", state.cartTotal));
      setState((prevState) => ({
        ...prevState,
        showConfetti: !prevState.showConfetti,
      }));
      Swal.fire({
        toast: true,
        title: "Your Order has been received!! ",
        text: "Thanks for your purchase!",
        imageUrl: orderPlaced,
        imageWidth: 300,
        imageHeight: 280,
        imageAlt: "Image",
        confirmButtonText: "Continue Shopping",
        customClass: {
          title: "swal2-center-text",
          htmlContainer: "swal2-center-text",
          actions: "swal2-center-actions",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(clearCart());
          navigate("/");
          dispatch(setStateProperty("cartComponentName", "CartPage"));
          dispatch(setStateProperty("subTotal", 0));
        }
      });
    } else {
      setModal(true);
    }
  };

  const amountData = [
    {
      heading: "Cart Subtotal:",
      value: `$${subTotal}`,
    },
    {
      heading: "Discount:",
      value: `-$${state.discountAmount}`,
      textColor: "text-light",
    },
    {
      heading: "Shipping:",
      value:
        state.shippingCharges === "TBD"
          ? state.shippingCharges
          : `+$${state.shippingCharges}`,
    },
    {
      heading: "Tax(18%):",
      value: `+$${tax}`,
    },
    {
      heading: "Cart Total:",
      value: `$${state.cartTotal}`,
      fontSize: "fs-4",
      alignItem: "align-items-center",
    },
  ];

  return (
    <>
      <Row>
        <Col xs="12">
          <div className="AddShadow rounded-4  mt-md-3 p-3 ">
            {" "}
            <Form onSubmit={(e) => calculateDiscount(e)}>
              <FormGroup>
                <Label>
                  <h3>Coupon Code</h3>
                </Label>
                <Input
                  className="rounded-pill"
                  value={state.discountCode}
                  disabled={state.validation === "Success"}
                  valid={state.validation === "Success"}
                  invalid={state.validation === "Unsuccessful"}
                  onChange={(e) =>
                    setState({ ...state, discountCode: e.target.value })
                  }
                />
                <FormText className="text-muted">
                  Use the codes 'DIS10', 'DIS20' to receive a 10%, 20% discount
                  respectively
                </FormText>
                <FormFeedback>Invalid Code</FormFeedback>
                <FormFeedback valid>
                  {state.discountCode} Applied
                  <Button
                    color="link"
                    onClick={() => {
                      setState({ ...state, validation: "" });
                    }}
                    size="sm"
                  >
                    Edit Coupon Code
                  </Button>
                </FormFeedback>
              </FormGroup>
              <Button className="bg-dark rounded-pill" block>
                Apply
              </Button>
            </Form>
          </div>
        </Col>
        <Col className="py-3" xs="12">
          <div className=" AmountCalculationDiv rounded-4 p-3  ">
            <h3>Cart Total</h3>
            {amountData.map((item, index) => (
              <p
                key={index}
                className={`d-flex justify-content-between m-0 ${item?.alignItem} `}
              >
                {item.heading}{" "}
                <strong className={`${item?.textColor} ${item?.fontSize}`}>
                  {item.value}
                </strong>{" "}
              </p>
            ))}
            <Button
              disabled={disableButton && isLoggedIn}
              onClick={handleCheckout}
              className="  bg-light text-dark rounded-pill"
              block
            >
              {isLoggedIn ? "Place Order" : "Proceed to Checkout"}
            </Button>
          </div>
        </Col>
      </Row>

      <Confetti
        width={width}
        height={height}
        style={{ pointerEvents: "none" }}
        numberOfPieces={state.showConfetti ? 900 : 0}
        recycle={false}
        gravity={0.2}
        onConfettiComplete={(confetti) => {
          setState({ ...state, showConfetti: false });
          confetti.reset();
        }}
      />
    </>
  );
};

export default OrderSummary;
