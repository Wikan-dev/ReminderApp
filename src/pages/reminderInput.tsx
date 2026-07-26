import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { COLLOR_PALLETE } from "../components/contents/color";
import { useReminderStore } from "../store/reminderStore";

export default function NewReminder() {
    const { id: slug } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const editData = location.state?.editData;

    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [hours, setHours] = useState<number>(12);
    const [minutes, setMinutes] = useState<number>(0);
    const [dragOffset, setDragOffset] = useState<number>(0);
    const [colorPick, setColorPick] = useState<string>(COLLOR_PALLETE[0]?.hex || "#ffffff");

    const addReminder = useReminderStore((state) => state.addReminder);
    const updateReminder = useReminderStore((state) => state.updateReminder);
    const isLoading = useReminderStore((state) => state.isLoading);
    const setEdit = useReminderStore((state) => state.setEdit);

    useEffect(() => {
        if (editData) {
            setEdit(true);
            setName(editData.title || editData.name || "");
            if (editData.colorPick) {
                setColorPick(editData.colorPick);
            }
            if (editData.datePick) {
                const dateObj = new Date(editData.datePick);
                if (!isNaN(dateObj.getTime())) {
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const dd = String(dateObj.getDate()).padStart(2, '0');
                    setDate(`${yyyy}-${mm}-${dd}`);
                    setHours(dateObj.getHours() || 12);
                    setMinutes(dateObj.getMinutes() || 0);
                } else if (typeof editData.datePick === "string" && editData.datePick.includes("T")) {
                    const [d, t] = editData.datePick.split("T");
                    setDate(d);
                    if (t) {
                        const [h, m] = t.split(":");
                        setHours(parseInt(h, 10) || 12);
                        setMinutes(parseInt(m, 10) || 0);
                    }
                }
            }
        } else {
            setEdit(false);
        }

        return () => {
            setEdit(false);
        };
    }, [editData, setEdit]);

    const [isDragging, setIsDragging] = useState<string | null>(null); // 'hours' | 'minutes' | null
    const lastY = useRef<number>(0);
    
    const handleStart = (y: number, type: 'hours' | 'minutes') => {
        setIsDragging(type);
        lastY.current = y;
        setDragOffset(0);
    };

    
    useEffect(() => {
        const step =  30;
        
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const diff = lastY.current - clientY;

            setDragOffset(diff);
            
            // Threshold to prevent jittery changes
            if (Math.abs(diff) > step) {
                if (isDragging === 'hours') {
                    setHours(prev => {
                        let newHours = prev + (diff > 0 ? 1 : -1);
                        // Wrap logic: 1-23, skipping 0
                        if (newHours > 23) return 1;
                        if (newHours < 1) return 23;
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
                setDragOffset(0);
            }
        };

        const handleEnd = () => {
            setIsDragging(null);
            setDragOffset(0);
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

    const handleKonfirmasi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug || !name || !date) {
            alert("Harap isi nama dan tanggal reminder");
            return;
        }

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const datePickFormatted = `${date}T${formattedHours}:${formattedMinutes}:00`;

        try {
            if (editData && (editData.id !== undefined && editData.id !== null)) {
                await updateReminder(editData.id, {
                    name,
                    datePick: datePickFormatted,
                    colorPick,
                });
            } else {
                await addReminder({
                    slug,
                    name,
                    datePick: datePickFormatted,
                    colorPick,
                    isPermanent: false,
                    isFinish: false,
                });
            }

            navigate(`/MainPages/${slug}`);
        } catch (error) {
            console.error("Gagal menyimpan reminder:", error);
        }
    };

    // Helper to get previous and next values
    const getPrevNext = (current: number, max: number, min: number = 0) => {
        let prev = current - 1;
        let next = current + 1;

        if (prev < min) prev = max;
        if (next > max) next = min;

        // Special handling for hours to skip 0
        if (max === 23 && min === 1) {
            if (prev < 1) prev = 23;
            if (next > 23) next = 1;
        }

        return { prev, next };
    };

    const hourDisplay = getPrevNext(hours, 23, 1);
    const minuteDisplay = getPrevNext(minutes, 59, 0);

    return (
        <div className="bg-primary-1 h-screen p-5">
            <div className="">
                <form className="flex flex-col gap-4" onSubmit={handleKonfirmasi}>
                    {/* date and time picker */}
                    <div>
                        <h1 className="font-bold">Reminder Name</h1>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Enter reminder name"
                            required
                        />
                    </div>
                    <div>
                        <h1 className="font-bold">Date</h1>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <h1 className="font-bold mb-2">Time (Drag up/down to change)</h1>
                        <div className="flex gap-4 items-center justify-center">
                            {/* Hours Picker */}
                            <div 
                                className="flex-1 border p-6 rounded-lg bg-white text-center cursor-ns-resize select-none font-mono text-3xl shadow-sm active:bg-gray-50 overflow-hidden relative"
                                onMouseDown={(e) => handleStart(e.clientY, 'hours')}
                                onTouchStart={(e) => handleStart(e.touches[0].clientY, 'hours')}
                            >
                            <span className="block text-xs text-gray-400 uppercase mb-2">Hours</span>
                            <div style={{
                                        transform: `translateY(${isDragging === 'hours' ? -dragOffset : 0}px)`,
                                        transition: isDragging === 'hours' ? 'none' : 'transform 150ms ease-out',
                                    }}>
                                <div className="text-gray-300 text-xl">{hourDisplay.prev.toString().padStart(2, '0')}</div>
                                <div className="font-bold text-4xl">{hours.toString().padStart(2, '0')}</div>
                                <div className="text-gray-300 text-xl">{hourDisplay.next.toString().padStart(2, '0')}</div>
                            </div>
                            </div>

                            <span className="text-2xl font-bold">:</span>

                            {/* Minutes Picker */}
                            <div 
                                className="flex-1 border p-6 rounded-lg bg-white text-center cursor-ns-resize select-none font-mono text-3xl shadow-sm active:bg-gray-50 overflow-hidden relative"
                                onMouseDown={(e) => handleStart(e.clientY, 'minutes')}
                                onTouchStart={(e) => handleStart(e.touches[0].clientY, 'minutes')}
                            >
                                <span className="block text-xs text-gray-400 uppercase mb-2">Minutes</span>
                            <div style={{
                                    transform: `translateY(${isDragging === 'minutes' ? -dragOffset : 0}px)`,
                                    transition: isDragging === 'minutes' ? 'none' : 'transform 150ms ease-out',
                                }}>
                                <div className="text-gray-300 text-xl ">{minuteDisplay.prev.toString().padStart(2, '0')}</div>
                                <div className="font-bold text-4xl">{minutes.toString().padStart(2, '0')}</div>
                                <div className="text-gray-300 text-xl ">{minuteDisplay.next.toString().padStart(2, '0')}</div>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* color picker */}
                    <div className="flex flex-row gap-5">
                        {COLLOR_PALLETE.map((item, i) => (
                            <div 
                                key={i}
                                onClick={() => setColorPick(item.hex)}
                                className={`h-10 w-10 rounded-full cursor-pointer border-2 hover:opacity-75 ${
                                    colorPick === item.hex ? "border-black scale-110" : "border-white"
                                }`} 
                                style={{ backgroundColor: item.hex }}
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-green-400 text-black cursor-pointer mt-4 p-2 rounded disabled:opacity-50"
                    >
                        {isLoading ? "Menyimpan..." : "konfirmasi"}
                    </button>
                </form>
            </div>
        </div>
    )
}
