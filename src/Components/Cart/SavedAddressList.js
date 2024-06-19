import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserDataInDb,
  setUserAddress,
  setStateProperty,
} from "../../Redux/EcomActions";
import { Button, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import AddressPage from "./AddressPage";

const SavedAddressList = () => {
  const dispatch = useDispatch();
  const isAddressAdded = useSelector((state) => state.isAddressAdded);
  const userAddress = useSelector((state) => state.userAddress);
  const [isOpen, setIsOpen] = useState(false);
  const dbAddress = useSelector((state) => state.activeUserData.address);

  useEffect(() => {
    if (Object.keys(dbAddress).length) {
      dispatch(setUserAddress(dbAddress, true));
    }
  }, []);

  const goNextPage = () => {
    dispatch(setStateProperty("cartComponentName", "PaymentPage"));
  };

  const toggleOffcanvas = () => {
    setIsOpen(!isOpen);
  };

  const handleDeleteAddress = () => {
    dispatch(setUserAddress({}, false));
    dispatch(updateUserDataInDb("address", {}));
  };

  const handleBack = () => {
    dispatch(setStateProperty("cartComponentName", "CartPage"));
  };

  if (isAddressAdded) {
    return (
      <>
        <div className=" mt-4 p-2 rounded-3 AddShadow   ">
          <h5>Delivery Address</h5>
          <h6 className="mb-0">
            {userAddress.firstName} {userAddress.lastName}
          </h6>
          <p className="mb-0">
            {userAddress.address},{userAddress.city},{userAddress.state},
            {userAddress.pincode}
          </p>
          <p className="mb-0">{userAddress.email}</p>
          <div className="mt-2">
            <Button
              onClick={toggleOffcanvas}
              className=" bg-dark rounded-pill me-2"
            >
              Edit
            </Button>
            <Button
              onClick={handleDeleteAddress}
              className="bg-dark rounded-pill"
            >
              Delete
            </Button>
          </div>
        </div>

        <Offcanvas
          direction="end"
          isOpen={isOpen}
          toggle={toggleOffcanvas}
          className="CanvasWidth"
        >
          <OffcanvasHeader toggle={toggleOffcanvas}>
            Edit Address
          </OffcanvasHeader>
          <OffcanvasBody>
            <AddressPage toggle={toggleOffcanvas} />{" "}
          </OffcanvasBody>
        </Offcanvas>

        <div className="mt-3 d-flex float-md-end ">
          <Button
            onClick={handleBack}
            className="bg-dark me-2 rounded-pill d-none d-md-inline "
          >
            Back
          </Button>
          <Button onClick={goNextPage} className="  bg-dark rounded-pill" block>
            Add Payment
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <AddressPage />
      </>
    );
  }
};

export default SavedAddressList;
