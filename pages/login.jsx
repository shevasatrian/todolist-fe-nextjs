import { useMutation } from "@/hooks/useMutation"
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Login() {
    const router = useRouter()
    const { mutate } = useMutation()
    const [payload, setPayload] = useState({
        email: "",
        password: "",
    })

    const HandleSubmit = async () => {
        const response = await mutate({url: "https://localhost:7211/apiAuth/Login", payload})
        console.log("response : ",response.data)
        if (!response.token) {
            Swal.fire({
                title: "Login Failed",
                text: "Email or Password incorrect",
                icon: "error"
              });
        } else {
            Swal.fire({
                title: `Welcome Back`,
                text: "Success Login",
                icon: "success"
              });
            Cookies.set("token", response?.token, { expires: new Date(response?.data?.expires), path: "/" })
            console.log(response)
            router.push("/")
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {/* <LayoutComponent metaTitle="Login"> */}
                <div metaTitle="Login" className="bg-gray-50 flex items-center justify-center min-h-screen ">
                    <div className="flex flex-wrap md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-md">
                        <div className="hidden md:block md:w-1/2">
                            <Image src="/login-img2.jpg" alt="login-image" layout="responsive" width={400} height={800} priority className="rounded-l-2xl shadow-md" />
                            
                        </div>
                        <div className="w-full md:w-1/2 p-6 md:p-8 my-auto">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">To do list</h1>
                                <p className="text-gray-500 text-sm md:text-base">Welcome back, Login to your account</p>
                            </div>

                            {/* Login Form */}
                            <form className="mt-6 space-y-4" 
                                    onSubmit={(event) => {
                                        event.preventDefault(); // Mencegah halaman refresh
                                        HandleSubmit();
                                    }}>
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={payload?.email}
                                    onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                                    placeholder="example@example.com"
                                    className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    required />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <input 
                                            id="password" 
                                            name="password"
                                            value={payload?.password}
                                            onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                                            placeholder="Enter your password"
                                            className="w-full  px-4 py-2 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            type={showPassword ? "text" : "password"}
                                            required 
                                        />
                                        <div
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Button */}
                                <button 
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    Login
                                </button>
                            </form>

                            {/* Additional Actions */}
                            <div className="mt-4 text-center text-sm text-gray-500">
                            <p>
                                Don&apos;t have an account? 
                                <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link>
                            </p>
                            <p className="mt-1">
                                <a href="#" className="text-blue-500 hover:underline">Forgot your password?</a>
                            </p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            {/* </LayoutComponent> */}
            
            
        </>
    )
}