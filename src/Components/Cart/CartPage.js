import React, { useEffect } from "react";
import CartProduct from "./CartProduct";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "reactstrap";
import { setStateProperty, updateUserDataInDb } from "../../Redux/EcomActions";

const CartPage = () => {
  const cartData = useSelector((state) => state.cartData);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const subTotalAmount = cartData.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  useEffect(() => {
    const roundedSubTotal = parseFloat(subTotalAmount.toFixed(2));
    dispatch(setStateProperty("subTotal", roundedSubTotal));
  }, [subTotalAmount]);

  const handleClick = () => {
    dispatch(updateUserDataInDb("cartItems", cartData));
    dispatch(setStateProperty("cartComponentName", "SavedAddressList"));
  };

  return (
    <>
      <div className="AddShadow p-1">
        {" "}
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <CartProduct />
          </tbody>
        </Table>
      </div>
      {isLoggedIn && (
        <div className="mt-3 float-md-end ">
          <Button className="bg-dark rounded-pill" onClick={handleClick} block>
            Continue to Add Address
          </Button>
        </div>
      )}
    </>
  );
};

export default CartPage;
