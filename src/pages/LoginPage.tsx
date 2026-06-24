import ButtonCustom from "../components/buttonCustom";
import CustomInputTemplate from "../components/customInputTemplate";
import googleLogo from "../assets/svg/google-icon-logo-svgrepo-com.svg"
import { GoogleLogin } from "../function/googleLogin";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="p-5 bg-primary-2 h-screen">
            <h1 className="font-jost text-8xl text-center mb-10">Rmndr.</h1>
            <form className="flex flex-col gap-5 mb-10" onSubmit={handleSubmit}>
                <CustomInputTemplate disabled={loading} value={email} onChange={setEmail} title="Email" type="email" placeholder="Email here" />
                <CustomInputTemplate disabled={loading} value={password} onChange={setPassword} title="Password" type="text" placeholder="Password here" />
            </form>
            <div className="flex flex-col gap-2">
                <ButtonCustom text="Login"  />
                <h1 className="font-jost text-md text-center cursor-default">or</h1>
                <button type="submit" disabled={loading} onClick={GoogleLogin} className="bg-white hover:bg-gray-100 transition-all duration-200  py-4 px-7.5 flex gap-5 rounded-cust w-full items-center cursor-pointer"> 
                    <img className="w-10.5 h-10.5" src={googleLogo} alt="login with google" />
                    <h1 className="font-jost text-md">Login Using Google</h1>
                </button>
            </div>
            <h1 className="font-jost text-2xl mt-5 cursor-default" >Don't have any account? <span className="font-bold cursor-pointer">Register Now</span></h1>
        </div>
    )
}