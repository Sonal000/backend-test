"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const navigation = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user) {
      navigation.push("/login");
    }
  }, [loading, user]);

  return (
    <div className="w-screen h-[80vh]">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4">

           
          </div>
          <div className="flex flex-col items-center pb-10">
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={user?.image}
              alt="user image"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {user?.firstName}  {user?.lastName}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </span>
            <div className="flex mt-4 md:mt-6">

      
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
