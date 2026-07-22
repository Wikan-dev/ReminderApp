import { useState, useRef, useEffect } from "react"

export default function NewReminder() {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [hours, setHours] = useState<number>(12);
    const [minutes, setMinutes] = useState<number>(0);
    
    const [isDragging, setIsDragging] = useState<string | null>(null); // 'hours' | 'minutes' | null
    const lastY = useRef<number>(0);

    const handleStart = (y: number, type: 'hours' | 'minutes') => {
        setIsDragging(type);
        lastY.current = y;
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const diff = lastY.current - clientY;
            
            // Threshold to prevent jittery changes
            if (Math.abs(diff) > 10) {
                if (isDragging === 'hours') {
                    setHours(prev => {
                        let newHours = prev + (diff > 0 ? 1 : -1);
                        if (newHours < 0) return 23;
                        if (newHours > 23) return 0;
                        return newHours;
                    });
                } else {
                    setMinutes(prev => {
                        let newMinutes = prev + (diff > 0 ? 1 : -1);
                        if (newMinutes < 0) return 59;
                        if (newMinutes > 59) return 0;
                        return newMinutes;
                    });
                }
                lastY.current = clientY;
            }
        };

        const handleEnd = () => {
            setIsDragging(null);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMove as any);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove as any, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove as any);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove as any);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

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
                        <h1 className="font-bold mb-2">Time (Drag up/down to change)</h1>
                        <div className="flex gap-4 items-center justify-center">
                            {/* Hours Picker */}
                            <div 
                                className="flex-1 border p-6 rounded-lg bg-white text-center cursor-ns-resize select-none font-mono text-3xl shadow-sm active:bg-gray-50"
                                onMouseDown={(e) => handleStart(e.clientY, 'hours')}
                                onTouchStart={(e) => handleStart(e.touches[0].clientY, 'hours')}
                            >
                                {hours.toString().padStart(2, '0')}
                                <span className="block text-xs text-gray-400 uppercase">Hours</span>
                            </div>

                            <span className="text-2xl font-bold">:</span>

                            {/* Minutes Picker */}
                            <div 
                                className="flex-1 border p-6 rounded-lg bg-white text-center cursor-ns-resize select-none font-mono text-3xl shadow-sm active:bg-gray-50"
                                onMouseDown={(e) => handleStart(e.clientY, 'minutes')}
                                onTouchStart={(e) => handleStart(e.touches[0].clientY, 'minutes')}
                            >
                                {minutes.toString().padStart(2, '0')}
                                <span className="block text-xs text-gray-400 uppercase">Minutes</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
