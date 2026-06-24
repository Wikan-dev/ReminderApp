import ButtonCustom from "../components/buttonCustom";
import CustomInputTemplate from "../components/customInputTemplate";
import googleLogo from "../assets/svg/google-icon-logo-svgrepo-com.svg"
import { GoogleLogin } from "../function/googleLogin";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const navigate = useNavigate();

    const { registerUser, isLoading: loading, error} = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isSucces = await registerUser(email, password, name);
        if (isSucces) {
            alert("akun berhasil di tambahkan")
        }
    }

    return (
        <div className="p-5 bg-primary-2 h-screen">
            {error ? <p className="text-red-500 text-center mb-4 font-jost text-lg font-semibold">{error}</p> :
                <p className="text-primary-3 text-center mb-4 font-jost text-lg font-semibold">akun berhasil di buat</p>
            }
            <h1 className="font-jost text-8xl text-center mb-10">Rmndr.</h1>
            <form className="flex flex-col gap-5 mb-10" onSubmit={handleSubmit}>
                <CustomInputTemplate disabled={loading} value={name} onChange={setName} title="username" type="text" placeholder="username here" />
                <CustomInputTemplate disabled={loading} value={email} onChange={setEmail} title="Email" type="email" placeholder="Email here" />
                <CustomInputTemplate disabled={loading} value={password} onChange={setPassword} title="Password" type="text" placeholder="Password here" />
                <ButtonCustom text={loading ? "Mohon tunggu" : "Sign Up"} disabled={loading}  />
            </form>
            <div className="flex flex-col gap-2">
                <h1 className="font-jost text-md text-center cursor-default">or</h1>
                <button type="submit" disabled={loading} onClick={GoogleLogin} className="bg-white hover:bg-gray-100 transition-all duration-200  py-4 px-7.5 flex gap-5 rounded-cust w-full items-center cursor-pointer"> 
                    <img className="w-10.5 h-10.5" src={googleLogo} alt="login with google" />
                    <h1 className="font-jost text-md">Login Using Google</h1>
                </button>
            </div>
            <h1 className="font-jost text-2xl mt-5 cursor-default" >Already have an account? <span className="font-bold cursor-pointer" onClick={() => navigate('/Login')}>Sign In Now</span></h1>
        </div>
    )
}