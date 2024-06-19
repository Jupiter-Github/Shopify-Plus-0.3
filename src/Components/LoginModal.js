import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setLoginStatus,
  setStateProperty,
  addToCart,
} from "../Redux/EcomActions";
import { db, auth } from "../firebase-config";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import loginImg from "./Images/loginImg.jpg";
import { Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";

const LoginModal = ({ modal, setModal }) => {
  const dispatch = useDispatch();
  const uiRef = useRef(null);
  const toggle = () => {
    setModal(!modal);
  };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId:
          "277241443311-oa43kj36pg9cedmodv1sdpqqb3qo7atm.apps.googleusercontent.com",
        customParameters: {
          prompt: "select_account",
        },
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        getUserDataFromDb(authResult.user);
        dispatch(setLoginStatus(true));
        toggle();
        return false;
      },
    },
  };
  useEffect(() => {
    if (!uiRef.current) {
      uiRef.current =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(auth);
    }
    if (modal) {
      uiRef.current.start("#firebaseui-auth-container", uiConfig);
    }
    return () => {
      uiRef.current.reset();
    };
  }, [modal]);
  const getUserDataFromDb = (user) => {
    const { uid, displayName, email } = user;
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    getDoc(docRef).then((docSnap) => {
      if (!docSnap.exists()) {
        setDoc(docRef, {
          uid,
          displayName,
          email,
          cartItems: [],
          address: {},
          paymentDetails: {},
          orderedItems: {},
          finalBillAmount: 0,
        }).then(() => {
          getUserDataFromDb(user);
        });
        console.log("USER DOES NOT EXIST IN DB");
      } else {
        const dbData = docSnap.data();
        dispatch(setStateProperty("activeUserData", dbData));
        if (dbData.cartItems.length > 0)
          dispatch(addToCart(...dbData.cartItems));
      }
    });
  };

  return (
    <>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Please Login First!</ModalHeader>
        <ModalBody>
          <Row className="g-0">
            <Col xs="12" md="6">
              <img src={loginImg} alt="login Img" className=" img-fluid" />
            </Col>
            <Col
              xs="12"
              md="6"
              className="justify-content-center d-flex align-items-center"
            >
              <div id="firebaseui-auth-container"></div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LoginModal;
