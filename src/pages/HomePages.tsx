import arrow from "../assets/svg/line-end-arrow.svg"
import { Navigate, useNavigate } from "react-router-dom"

export default function HomePages() {
    const navigate = useNavigate();
    return (
        <div className="bg-primary-2 h-screen flex flex-col justify-center p-5">
            <div className="text-center mb-auto mt-auto">
                <h1 className="text-black jost text-8xl">Rmndr.</h1>
                <p className="text-black jost text-md">Your personal reminder app</p>
            </div>
            <button onClick={() => navigate('/Login')} className="w-full bg-primary-3 px-7.5 py-11 text-primary-1 flex items-center justify-between hover:bg-primary-4 transition-all duration-200 text-4xl font-jost rounded-cust mb-10">
                Get Started
                <img src={arrow} alt="Arrow" className="w-15 h-15" />
            </button>
        </div>
    )
}