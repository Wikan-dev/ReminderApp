import type { MainCardProps } from "../../helper/Types"
import { motion, AnimatePresence } from "framer-motion"
import pen from "../../assets/svg/pen-linear.svg"
import { useState } from "react"

//todo: selesaikan mainCard style dan fungsi
export default function MainCard({ handleFinish, title, desc, datePick, status, Permanent }: MainCardProps) {
    const [edit, setEdit] = useState<boolean>(false)
    return (
        <div onClick={() => handleFinish?.()} className="bg-primary-1 py-4 pl-10 pr-6 flex flex-col justify-between w-full rounded-2xl h-66.5 cursor-pointer">
            <div className="flex flex-row justify-between w-full">
                <div className="text-black-custom font-jost flex flex-col">
                    <h1 className="text-5xl truncate max-w-120  h-15">{title}</h1>
                    <p className="text-3xl max-w-120">{desc}</p>
                </div>
                <p>{status}</p>
            </div>
            <div className="flex flex-row justify-between relative">
                <div className="mt-auto">
                    {Permanent ? (
                        <p>Due Today</p>
                    ) : (
                        <p>{datePick}</p>
                    )}
                </div>
                <img 
                    onClick={(e) => {
                        e.stopPropagation();
                        setEdit(!edit);
                    }} 
                    src={pen} 
                    className="w-10 text-black-custom cursor-pointer ml-auto" 
                    alt="edit" 
                />
                <AnimatePresence>
                    {edit && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute max-w-20 right-0 top-15 bg-primary-1 border-3 text-center border-primary-2 rounded-xl ">
                            <h1 className="px-4 py-2 text-2xl">edit</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
