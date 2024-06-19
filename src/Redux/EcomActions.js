import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  SET_LOGIN_STATUS,
  CLEAR_CART,
  SET_USER_ADDRESS,
  SET_STATE_PROPERTY,
} from "./EcomTypes";
import { db } from "../firebase-config";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

const setStateProperty = (key, value) => {
  return {
    type: SET_STATE_PROPERTY,
    payload: { key, value },
  };
};

const setLoginStatus = (boolVal) => {
  return {
    type: SET_LOGIN_STATUS,
    payload: boolVal,
  };
};

const addToCart = (...cartItem) => {
  return {
    type: ADD_TO_CART,
    payload: cartItem,
  };
};

const incrementCartItem = (id) => {
  return {
    type: INCREMENT_CART_ITEM,
    payload: id,
  };
};

const decrementCartItem = (id) => {
  return {
    type: DECREMENT_CART_ITEM,
    payload: id,
  };
};

const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};

const setUserAddress = (userAddress, boolValue) => {
  return {
    type: SET_USER_ADDRESS,
    payload: { userAddress, boolValue },
  };
};

const fetchProductDetail = (id) => {
  return (dispatch) => {
    fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setStateProperty("productDetail", data));
      });
  };
};

const collectionRef = collection(db, "users");

const fetchUserDataFromDb = (uid) => {
  return (dispatch, getState) => {
    const docRef = doc(collectionRef, uid);
    getDoc(docRef).then((docSnap) => {
      dispatch(setStateProperty("activeUserData", docSnap.data()));
    });
  };
};

const updateUserDataInDb = (key, keyValue) => {
  return (dispatch, getState) => {
    const Uid = getState().activeUserData.uid;
    const docRef = doc(collectionRef, Uid);
    const dataToUpdate = {};
    dataToUpdate[key] = keyValue;
    updateDoc(docRef, dataToUpdate).then(() => {
      dispatch(fetchUserDataFromDb(Uid));
    });
  };
};

export {
  fetchProductDetail,
  setLoginStatus,
  addToCart,
  incrementCartItem,
  decrementCartItem,
  clearCart,
  setUserAddress,
  fetchUserDataFromDb,
  updateUserDataInDb,
  setStateProperty,
};
