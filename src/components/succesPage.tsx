import checkImage from "../assets/svg/baseline-check-circle.svg"
import ButtonCustom from "./buttonCustom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from 'framer-motion'
// [FIXED] - Menggunakan self-closing tag untuk elemen image
export default function SuccesPage() {
    const navigate = useNavigate();
    const updatedUser = useAuthStore.getState().user;

    function handleClick() {
        if (updatedUser && updatedUser.slug) {
            navigate(`/MainPages/${updatedUser.slug}`)
        }
    }
    return (
        <div className="bg-primary-2 p-5 w-full h-screen flex gap-5 justify-center items-center flex-col">
            <div className="my-auto flex flex-col items-center justify-center">
                <motion.img className="w-50" src={checkImage} alt="" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1, type: "spring", bounce: 0.6 }}  />
                <h1 className="font-jost text-7xl font-bold">Login berhasil</h1>
            </div>
            <ButtonCustom text="Lanjut" className="mb-15" onClick={() => handleClick()} />
        </div>
    );
}