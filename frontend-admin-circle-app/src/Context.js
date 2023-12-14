import React, { useReducer } from "react";

const Context = React.createContext();

const initialState = {
  token: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "logout":
      return initialState;
    case "login":
      return { ...state, token: action.payload };
    default:
      return { ...state };
  }
};

function ContextProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

const ContextConsumer = Context.Consumer;

export { Context, ContextProvider, ContextConsumer };
