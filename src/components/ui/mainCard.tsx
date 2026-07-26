import type { MainCardProps } from "../../helper/Types"
import { motion, AnimatePresence } from "framer-motion"
import pen from "../../assets/svg/pen-linear.svg"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useReminderStore } from "../../store/reminderStore"

interface ExtendedMainCardProps extends MainCardProps {
    id?: number | string;
    colorPick?: string;
}

export default function MainCard({ handleFinish, title, desc, datePick, status, Permanent, id, colorPick }: ExtendedMainCardProps) {
    const [edit, setCardEditMenu] = useState<boolean>(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
    const navigate = useNavigate()
    const { id: slug } = useParams<{ id: string }>()
    const deleteReminder = useReminderStore((state) => state.deleteReminder)
    const setEdit = useReminderStore((state) => state.setEdit)

    const handleEditClick = (e: React.MouseEvent) => {
        setEdit(true)
        e.stopPropagation()
        setCardEditMenu(false)
        navigate(`/NewReminder/${slug}`, {
            state: {
                editData: {
                    id,
                    title,
                    desc,
                    datePick,
                    colorPick,
                    Permanent
                }
            }
        })
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCardEditMenu(false)
        setShowConfirmDelete(true)
    }

    const confirmDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (id !== undefined && id !== null) {
            try {
                await deleteReminder(id)
            } catch (err) {
                console.error("Gagal menghapus reminder:", err)
            } finally {
                setShowConfirmDelete(false)
            }
        }
    }

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowConfirmDelete(false)
    }

    return (
        <div onClick={() => handleFinish?.()} className="bg-primary-1 mt-5 py-4 pl-10 pr-6 flex flex-col justify-between w-full rounded-2xl min-h-96 h-auto cursor-pointer relative">
            <div className="flex flex-row justify-between w-full">
                <div className="text-black-custom font-jost flex flex-col">
                    <h1 className="text-5xl truncate max-w-120 h-15">{title}</h1>
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
                        setCardEditMenu(!edit);
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
                            className="absolute right-0 top-15 bg-primary-1 border-3 text-center border-primary-2 rounded-xl cursor-pointer z-20 overflow-hidden shadow-lg"
                        >
                            <div onClick={handleEditClick}>
                                <h1 className="px-4 py-2 text-2xl hover:bg-gray-200">edit</h1>
                            </div>
                            <div onClick={handleDeleteClick}>
                                <h1 className="px-4 py-2 text-2xl text-red-500 font-bold hover:bg-gray-200">delete</h1>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Popup */}
            <AnimatePresence>
                {showConfirmDelete && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center flex flex-col gap-4"
                        >
                            <h2 className="text-2xl font-bold font-jost text-gray-800">Hapus Reminder?</h2>
                            <p className="text-gray-600 font-jost">Apakah kamu yakin ingin menghapus "{title}"?</p>
                            <div className="flex justify-center gap-4 mt-2">
                                <button 
                                    onClick={cancelDelete}
                                    className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-jost text-xl hover:bg-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-5 py-2 rounded-xl bg-red-500 text-white font-jost text-xl hover:bg-red-600 transition"
                                >
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
