import React, { useState, useEffect } from "react";
import { Button, Navbar, NavbarBrand, Popover, PopoverBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLoginStatus,
  setStateProperty,
  fetchUserDataFromDb,
  clearCart,
  updateUserDataInDb,
} from "../Redux/EcomActions";
import LoginModal from "./LoginModal";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { Avatar, IconButton, Badge } from "@mui/material";
import { AiOutlineShoppingCart } from "react-icons/ai";
import webLogo from "./Images/webLogo.gif";
import logOutImg from "./Images/logOutImg.jpg";
import Lottie from "lottie-react";
import loginUserAnimation2 from "./Images/loginUserAnimation2.json";

const NavBar = () => {
  const [badgeValue, setBadgeValue] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const cartData = useSelector((state) => state.cartData);
  const activeUserData = useSelector((state) => state.activeUserData) || {};
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    // to set activeUserdata on every reload
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user;
        dispatch(fetchUserDataFromDb(uid));
      } else {
        // if the user token expired in-between the session
        dispatch(setLoginStatus(false));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const { displayName = "", email = "" } = activeUserData;

  useEffect(() => {
    // to set Badge Value on cart item change
    setBadgeValue(cartData.length);
    // setBadgeValue(isLoggedIn ? cartData.length : 0);
  }, [isLoggedIn, cartData]);

  const handleCartClick = () => {
    dispatch(setStateProperty("cartComponentName", "CartPage"));
    navigate("/CartMain");
  };

  const handleLoginLogout = () => {
    setShowPopover(!showPopover);
    if (isLoggedIn) {
      dispatch(updateUserDataInDb("cartItems", cartData)); // to add userCartitems to db because what if user presses logout without pressing addAddress button
      Swal.fire({
        title: "Are you leaving?",
        toast: true,
        text: "Are you sure you want to Logout!",
        imageUrl: logOutImg,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout",
        customClass: {
          title: "swal2-center-text",
          htmlContainer: "swal2-center-text",
          actions: "swal2-center-actions",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          signOut(auth).then(() => {
            dispatch(clearCart());
            dispatch(setStateProperty("activeUserData", {}));
            // navigate("/");
          });
        }
      });
    } else {
      setShowModal(!showModal);
    }
  };

  return (
    <>
      <Navbar className="p-0" fixed="top" color="light">
        <NavbarBrand href="/">
          <img
            alt="logo"
            src={webLogo}
            style={{
              height: 30,
              width: 30,
            }}
          />
          Shopify Plus
        </NavbarBrand>
        <div>
          
          <IconButton className=" mt-1 " onClick={handleCartClick}>
            <Badge badgeContent={badgeValue} color="primary">
              <AiOutlineShoppingCart />
            </Badge>
          </IconButton>

          <IconButton id="loginButton">
            <Avatar sx={{ bgcolor: "#0D6EFD" }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Popover
            isOpen={showPopover}
            placement="bottom"
            target="loginButton"
            trigger="legacy"
            toggle={() => setShowPopover(!showPopover)}
          >
            <PopoverBody className="text-center">
              {isLoggedIn && (
                <div>
                  <p className="mb-0">{email} </p>
                  <Lottie
                    className="mx-auto"
                    style={{ width: "120px" }}
                    animationData={loginUserAnimation2}
                    loop={true}
                  />
                  <h6>Hi,{displayName}!!</h6>
                </div>
              )}
              <Button color="primary" onClick={handleLoginLogout}>
                {" "}
                {isLoggedIn ? " LogOut" : "Login"}
              </Button>
            </PopoverBody>
          </Popover>

          <LoginModal modal={showModal} setModal={setShowModal} />
        </div>
      </Navbar>
    </>
  );
};

export default NavBar;
