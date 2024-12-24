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

export default function Register() {
    const router = useRouter()
    const { mutate } = useMutation()
    const [payload, setPayload] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [fill, setFill] = useState({
        firstName: "",
        email: "",
        password: "",
    })

    const validateForm = () => {
        let valid = true;
        let fillErrors = { firstName: "", email: "", password: "" }

        if (!payload.firstName.trim()) {
            fillErrors.firstName = "First name is required"
            valid = false
        }

        if (!payload.email.trim()) {
            fillErrors.email = "Email is required"
            valid = false
        }

        if (!payload.password.trim()) {
            fillErrors.password = "Password is required"
            valid = false
        } else if (payload.password.trim().length < 6) {
            fillErrors.password = "Password must have minimum 6 characters"
            valid = false
        }

        setFill(fillErrors)
        return valid
    }

    const HandleSubmit = async () => {
        if (!validateForm()) return

        const ifEmailExist = await mutate({
            url: "https://localhost:7211/apiAuth/CheckEmailIfExist", 
            payload: { email: payload.email }
        })

        if (ifEmailExist?.exists) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: "Email is already registered. Please use a different email.",
            });
            return
        }

        const response = await mutate({url: "https://localhost:7211/apiAuth/Register", payload})
        console.log("response : ",response)
        if (!response) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: "An error occurred during registration. Please try again.",
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Your account has been successfully registered.",
            }).then(() => {
                router.push("/login"); // Redirect ke halaman login
            });
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {/* <LayoutComponent metaTitle="Register"> */}
            <div className="bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-md p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">To do list</h1>
                        <p className="text-gray-500 text-sm md:text-base">Hello, Register your account</p>
                    </div>

                    {/* Login Form */}
                    <form className="mt-6 space-y-4" 
                            onSubmit={(event) => {
                                event.preventDefault(); // Mencegah halaman refresh
                                HandleSubmit();
                            }}>
                        {/* First name Input */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value={payload?.firstName}
                            onChange={(event) => setPayload({ ...payload, firstName: event.target.value })}
                            placeholder="First Name"
                            className={`w-full mt-1 px-4 py-2 bg-gray-50 border ${
                                        fill.firstName
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none`} />
                            {fill.firstName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {fill.firstName}
                                </p>
                            )}
                        </div>

                        {/* Las name Input */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            value={payload?.lastName}
                            onChange={(event) => setPayload({ ...payload, lastName: event.target.value })}
                            placeholder="First Name"
                            className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                        </div>

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
                            className={`w-full mt-1 px-4 py-2 bg-gray-50 border ${
                                fill.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none`} />
                            {fill.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {fill.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                name="password"
                                value={payload?.password}
                                onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2 bg-gray-50 border ${
                                    fill.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none`} 
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </div>
                            </div>
                            {fill.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {fill.password}
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <button 
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                            Register
                        </button>
                    </form>

                    {/* Additional Actions */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <p>
                            have an account? 
                             <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* </LayoutComponent> */}
            
            
        </>
    )
}