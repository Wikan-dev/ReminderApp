import { useState } from "react"

export default function NewReminder() {
    const [hour, setHour] = useState<string>("");
    const [minute, setMinute] = useState<string>("");
    //todo: selesain halaman nambahin reminder baru
    //todo ambil fungsi dari function addnewReminder 
    return (
        <div className="bg-primary-1 h-screen">
            <div className="">
                <form action="">
                    <div>
                        <h1>Reminder Name</h1>
                        <input type="text" />
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        <h1>Reminder Name</h1>
                        <input type="text" />
                    </div>
                    <div>
                        <h1>Reminder Name</h1>
                        <input type="text" />
                    </div>
                    
                </form>
            </div>
        </div>
    )
} 