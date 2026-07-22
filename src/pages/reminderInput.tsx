import { useState } from "react"

export default function NewReminder() {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");

    return (
        <div className="bg-primary-1 h-screen p-5">
            <div className="">
                <form className="flex flex-col gap-4">
                    <div>
                        <h1 className="font-bold">Reminder Name</h1>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Enter reminder name"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold">Date</h1>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold">Time</h1>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
