import { useState, useRef, MouseEvent, TouchEvent } from "react"

export default function NewReminder() {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("12:00");
    
    const [isDragging, setIsDragging] = useState(false);
    const lastY = useRef<number>(0);

    // Helper to adjust time string
    const adjustTime = (delta: number) => {
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        
        // Adjust by delta (delta is 1 or -1)
        totalMinutes += delta;

        // Handle wrap around (24 hours = 1440 minutes)
        if (totalMinutes < 0) totalMinutes = 1439;
        if (totalMinutes >= 1440) totalMinutes = 0;

        const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
        setTime(`${newHours}:${newMinutes}`);
    };

    const handleStart = (y: number) => {
        setIsDragging(true);
        lastY.current = y;
    };

    const handleMove = (y: number) => {
        if (!isDragging) return;
        
        const diff = lastY.current - y;
        // Threshold to prevent jittery changes
        if (Math.abs(diff) > 10) {
            adjustTime(diff > 0 ? 1 : -1);
            lastY.current = y;
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

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
                        <h1 className="font-bold">Time (Drag up/down to change)</h1>
                        <div 
                            className="border p-4 rounded w-full bg-white text-center cursor-ns-resize select-none font-mono text-xl"
                            onMouseDown={(e: MouseEvent) => handleStart(e.clientY)}
                            onMouseMove={(e: MouseEvent) => handleMove(e.clientY)}
                            onMouseUp={handleEnd}
                            onMouseLeave={handleEnd}
                            onTouchStart={(e: TouchEvent) => handleStart(e.touches[0].clientY)}
                            onTouchMove={(e: TouchEvent) => handleMove(e.touches[0].clientY)}
                            onTouchEnd={handleEnd}
                        >
                            {time}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
