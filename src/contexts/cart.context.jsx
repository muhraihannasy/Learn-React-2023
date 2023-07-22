import { createContext, useState, useEffect, useReducer } from "react";

export const CartContext = createContext({
  isCartOpen: true,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  setIsCartOpen: () => {},
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
});

const CART_ACTION_TYPE = {
  ADD_TO_CART: "ADD_TO_CART",
};

const INITIAL_STATE = {
  isCartOpen: true,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

const CartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ACTION_TYPE.ADD_TO_CART:
      return {
        ...state,
        ...payload,
      };
    default:
      throw new Error("Invalid action");
  }
};

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartProvider = ({ children }) => {
  const [{ isCartOpen, cartItems, cartCount, cartTotal }, dispatch] =
    useReducer(CartReducer, INITIAL_STATE);

  const updateCartItems = (cartItems) => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    const newCartTotal = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );

    const payload = {
      cartItems: cartItems,
      cartCount: newCartCount,
      cartTotal: newCartTotal,
    };
    dispatch({ type: CART_ACTION_TYPE.ADD_TO_CART, payload });
  };

  const addItemToCart = (productToAdd) => {
    const newCartItem = addCartItem(cartItems, productToAdd);
    updateCartItems(newCartItem);
  };

  const removeItemToCart = (cartItemToRemove) => {
    const newCartItem = removeCartItem(cartItems, cartItemToRemove);
    updateCartItems(newCartItem);
  };

  const clearItemFromCart = (cartItemToClear) => {
    const newCartItem = clearCartItem(cartItems, cartItemToClear);
    updateCartItems(newCartItem);
  };

  const value = {
    isCartOpen,
    setIsCartOpen: () => {},
    cartItems,
    cartCount,
    cartTotal,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
