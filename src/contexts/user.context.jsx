import { createContext, useState, useEffect, useReducer } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
}

const INITIAL_STATE = {
  currentUser: null,
} 

const UserReducer = (state, action) => {
    const { type, payload } = action;

    console.log(payload );

    switch (type) {
      case USER_ACTION_TYPES.SET_CURRENT_USER:
        return {
          ...state,
          currentUser: payload
        }
        default: 
        throw new Error("Invalid action type");
    }
}


export const UserProvider = ({ children }) => {
  const [{currentUser}, dispatch] = useReducer(UserReducer, INITIAL_STATE);
  const value = { currentUser };

  const setCurrentUser = (user) => 
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user });
  

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
