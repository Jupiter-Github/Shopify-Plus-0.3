import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  SET_LOGIN_STATUS,
  CLEAR_CART,
  SET_USER_ADDRESS,
  SET_STATE_PROPERTY,
} from "./EcomTypes";

const intialState = {
  productDetail: [],
  isLoggedIn: JSON.parse(localStorage.getItem("loginStatus")) === true,
  cartData: JSON.parse(localStorage.getItem("cartData")) || [],
  subTotal: 0,
  cartComponentName: "CartPage",
  isAddressAdded: false,
  userAddress: {},
  activeUserData: {},
};

const EcomReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_STATE_PROPERTY:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case SET_LOGIN_STATUS:
      localStorage.setItem("loginStatus", action.payload);
      return {
        ...state,
        isLoggedIn: action.payload,
      };

    case ADD_TO_CART:
      const mergedCart = [...state.cartData, ...action.payload];
      const updatedCartAdd = mergedCart.reduce((acc, item) => {
        const existItem = acc.find((value) => value.id === item.id);
        if (existItem) {
          existItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      localStorage.setItem("cartData", JSON.stringify(updatedCartAdd));
      return {
        ...state,
        cartData: updatedCartAdd,
      };

    case CLEAR_CART:
      localStorage.removeItem("cartData");
      return {
        ...state,
        cartData: [],
      };

    case INCREMENT_CART_ITEM:
      const updatedCartQuantityInc = state.cartData.map((value) =>
        value.id === action.payload
          ? { ...value, quantity: value.quantity + 1 }
          : value
      );
      localStorage.setItem("cartData", JSON.stringify(updatedCartQuantityInc));
      return {
        ...state,
        cartData: updatedCartQuantityInc,
      };

    case DECREMENT_CART_ITEM:
      const updatedCartQuantityDec = state.cartData
        .map((value) =>
          value.quantity > 0 && value.id === action.payload
            ? { ...value, quantity: value.quantity - 1 }
            : value
        )
        .filter((value) => value.quantity !== 0);
      localStorage.setItem("cartData", JSON.stringify(updatedCartQuantityDec));
      return {
        ...state,
        cartData: updatedCartQuantityDec,
      };

    case SET_USER_ADDRESS:
      return {
        ...state,
        userAddress: action.payload.userAddress,
        isAddressAdded: action.payload.boolValue,
      };

    default:
      return state;
  }
};

export { EcomReducer };
