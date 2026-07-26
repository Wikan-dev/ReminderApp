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
//todo: benerin bug delete
//todo: buat page lain khusus untuk ngedit biar ga bentrok
//todo: konfirmasi pop up sebelum delete
//todo: buatin undo pop up dengan loading setelah delete reminder
export default function MainCard({ handleFinish, title, desc, datePick, status, Permanent, id, colorPick }: ExtendedMainCardProps) {
    const [edit, setCardEditMenu] = useState<boolean>(false)
    const navigate = useNavigate()
    const { id: slug } = useParams<{ id: string }>()
    const deleteReminder = useReminderStore((state) => state.deleteReminder)
    const setEdit = useReminderStore((state) => state.setEdit)

    const handleEditClick = (e: React.MouseEvent) => {
        console.log(edit)
        setEdit(true)
        e.stopPropagation()
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

    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (id !== undefined && id !== null) {
            await deleteReminder(id)
        }

    }

    return (
        <div onClick={() => handleFinish?.()} className="bg-primary-1 mt-5 py-4 pl-10 pr-6 flex flex-col justify-between w-full rounded-2xl min-h-96 h-auto cursor-pointer">
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
                                className="absolute right-0 top-15 bg-primary-1 border-3 text-center border-primary-2 rounded-xl cursor-pointer">
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
        </div>
    )
}
