import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export  function useAuthContext() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuthContext must be used within an AuthProvider");
        // console.log("useAuthContext must be used within an AuthProvider");
    }
    return auth;
}
