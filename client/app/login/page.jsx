"use client";
import React,{useEffect} from "react";
import { useForm } from "react-hook-form";
import { useAuthentication } from "@/api//useAuthentication";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const { signin } = useAuthentication();
  const { dispatch,user,loading } = useAuthContext();
  const navigation = useRouter();

  useEffect(() => {
    if(!loading && user){
      navigation.push("/");
    }
  }, [loading,user]);



  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await signin(data);
      if (response.status === 200) {
        
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        dispatch({ type: "LOGIN", payload: response.data.data.user });
        alert("Signin successfully");
        navigation.push("/");
      } else {
        alert("Signin failed");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col p-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Login</h1>
      </div>
      <div className="w-[95%] max-w-[500px] py-5 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900  w-full"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="jhondoe@gmail.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-red-400">email is required!</span>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="•••••••••"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-xs text-red-400">
                password is required!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center d "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
