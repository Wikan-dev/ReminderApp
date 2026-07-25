import MainReminder from "../view/mainReminder";
import plus from "../assets/svg/baseline-plus.svg"
import { motion } from "framer-motion";
import { useState } from "react";
import notes from "../assets/svg/notes-linear.svg"

export default function MainPages() {
    const [newReminderOn, setNewReminderOn] = useState<boolean>(false)
    console.log(newReminderOn)

    return (
        <div className="bg-primary-2 w-full h-screen p-5 relative">
            <h1 className="font-jost text-2xl text-center">Rmndr.</h1>
            <MainReminder />
            
            <div >
                <motion.div whileTap={{
                    scale: 0.8,
                    transition: {type: "spring", stiffness: 500, damping: 2}
                }}
                onClick={() => setNewReminderOn(!newReminderOn)}
                className="bg-primary-3 p-3.625 rounded-full w-fit absolute right-5 bottom-35">
                    <img src={plus} className="w-18.75 p-3" alt="add new reminder" />
                </motion.div>

                {newReminderOn ?? (
                    <div className="bg-primary-3 absolute top-0 flex flex-row gap-33"> 
                        <img src={notes} alt="notes" />
                        <h1 className="text-white text-2xl font-jost">add reminder</h1>
                    </div>
                )}
            </div>
        </div>
    )
}