import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthentication = () => {
  const signin = async (data) => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_URL}/users/login`,
        data: {
          email: data.email,
          password: data.password,
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw new Error(error.response);
    }
  };
  const signout = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${API_URL}/users/logout`,
        withCredentials: true,
      });
      // alert("User created successfully".response);
      return response;
    } catch (error) {
      // console.log("error",error.response.data.message);
      // setError("root", {
      //   message: error.response.data.message,
      // });
      throw new Error(error.response.data.message);
    }
  };

  const signup = async (data) => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_URL}/users/signup`,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          image: data.image,
          mobileNumber: data.mobileNumber,
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.message);
    }
  };

  return { signin, signup, signout };
};
