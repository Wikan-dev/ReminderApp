import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import MainCard from "../components/ui/mainCard";
import { useReminderStore } from "../store/reminderStore";
//todo: selesaikan fungsi dan style mainReminder
export default function MainReminder() {
    const { reminders, fetchReminder, toggleFinishReminder } = useReminderStore();
    const inputSlug = useAuthStore((state) => state.user?.slug);

    useEffect(() => {
        if (inputSlug) {
            fetchReminder(inputSlug);
        }
    }, [inputSlug, fetchReminder]);

    return (
        <div className="flex flex-col gap-5">
            {reminders.length ? (
                <div>
                    {reminders.map((item) => (
                        <MainCard
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            desc={item.desc || ''}
                            datePick={item.datePick}
                            status={(item.isFinish ?? item.isDone ?? false) ? 'done' : 'pending'}
                            Permanent={item.isPermanent}
                            handleFinish={() => toggleFinishReminder(item)}
                        />
                    ))}
                </div>
            ) : (
                <p>No reminders found.</p>
            )}
        </div>
    );
}