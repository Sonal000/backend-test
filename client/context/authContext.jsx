"use client"
import { createContext, useReducer } from "react";
import { useEffect } from "react";
// import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload ,loading: false};
    case "LOGOUT":
      return { ...state, user: null,loading: false };
    case "LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null ,loading:true });

  // eslint-disable-next-line no-unused-vars
  // const checkUserLoggedIn = async () => {
  //     dispatch({ type: "LOADING" });
  //   try {
  //     const response = await axios({
  //       method: "get",
  //       url: `http://localhost:3000/api/v1/views`,
  //       withCredentials: true,
  //     });
  //     dispatch({ type: "LOGIN", payload: response.data.user });
  //   } catch (error) {
  //     dispatch({ type: "LOGOUT" });
  //   }
  //   // }
  // };

  useEffect(() => {
    // checkUserLoggedIn();
    const user  = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"LOGIN",payload:user});
    }else{
      dispatch({type:"LOGOUT"});
    }
  }, []);

  // const user = getLoggedinUser();
  return (
    <AuthContext.Provider value={{ ...state,dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};

// export function useAuthContext() {
//     const user = useContext(AuthContext);
//     return user;
// }
