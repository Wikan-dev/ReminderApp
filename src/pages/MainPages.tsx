import MainReminder from "../view/mainReminder";
import plus from "../assets/svg/baseline-plus.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import notes from "../assets/svg/notes-linear.svg";

export default function MainPages() {
    const [newReminderOn, setNewReminderOn] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="bg-primary-2 w-full h-screen p-5 relative overflow-hidden">
            <h1 className="font-jost text-2xl text-center">Rmndr.</h1>
            <MainReminder />

            <div className="fixed right-5 bottom-35 z-50 flex flex-col items-end">
                <AnimatePresence>
                    {newReminderOn && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={() => navigate(`/NewReminder/${id}`)}
                            className="bg-primary-3 mb-3 p-3 px-5 rounded-2xl flex flex-row items-center gap-3 shadow-lg cursor-pointer hover:opacity-90">
                            <img src={notes} alt="notes" className="w-6 h-6" />
                            <h1 className="text-white text-2xl font-jost whitespace-nowrap">
                                add reminder
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    whileTap={{
                        scale: 0.8,
                        transition: { type: "spring", stiffness: 500, damping: 2 }
                    }}
                    onClick={() => setNewReminderOn(!newReminderOn)}
                    className="bg-primary-3 p-3.625 rounded-full w-fit shadow-lg cursor-pointer"
                >
                    <img src={plus} className="w-18.75 p-3" alt="add new reminder" />
                </motion.div>
            </div>
        </div>
    );
}
