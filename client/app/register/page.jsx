"use client";
import React,{useEffect} from "react";
import { useForm } from "react-hook-form";
import {useAuthentication } from "@/api/useAuthentication" 
import {useRouter} from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";

const page = () => {
  // const [formdata,setFormdata] = useState({
  //   name:"",
  //   email:"",
  //   password:"",
  // })

  const {user,loading} = useAuthContext();
  const navigation = useRouter();

  useEffect(() => {
    if(!loading && user){
      navigation.push("/");
    }
  }, [loading,user]);


  const previewFile = (file) => {
    if (!file || !(file instanceof Blob)) {
      setError('image',{error:"Invalid image format"});
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const uploadfile = async (file) => {
    if (!file || !(file instanceof Blob)) {
      return false;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(false);
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setChanged(true);
    previewFile(file);
  };




const {signup} = useAuthentication();

  const {
    register,
    handleSubmit,
    watch,
setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {
    if(data.password !== data.passwordConfirm){
      setError('root',{message:"Password not matched"})
    }else{
      if (data.image && data.image[0]) {
        data.image = await uploadfile(data.image[0]);
      } else {
        data.image = false;
      }
      
      try {
        const response = await signup(data);
        if (response.status === 201) {

          alert("User created successfully");
          navigation.push('/login')
        } else {
          alert("User not created");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col p-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Register</h1>
      </div>
      <div className="w-[95%] max-w-[900px] py-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="John"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <span className="text-xs text-red-400">
                  First name is required!
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   "
                placeholder="Doe"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="text-xs text-red-400">
                  Last name is required!
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="jhondoe@gmail.com"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-400">
                  Valid email is required!
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="+947********"
                {...register("mobileNumber", {
                  required: true,
                  pattern: /^\+\d{1,4}\d{9}$/,
                })}
              />
              {errors.mobileNumber && (
                <span className="text-xs text-red-400">
                  Valid phone number is required!
                </span>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              {...register("image", {
                required: true,
                pattern: /\.(jpe?g|png|gif|svg)$/i,
              })}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
            />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF{" "}
            </p>

            {errors.image && (
              <span className="text-xs text-red-400">
                Valid image is required!
              </span>
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
              {...register("password", { required: true ,minLength:8})}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="•••••••••"
            />
            {errors.password && (
              <span className="text-xs text-red-400">
                password is required!
              </span>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              {...register("passwordConfirm", { required: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="•••••••••"
            />
            {errors.passwordConfirm && (
              <span className="text-xs text-red-400">
                Confirm your password!
              </span>
            )}
            {errors.root && (
              <span className="text-xs text-red-400">
                {errors.root.message}
                
              </span>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center d "
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
