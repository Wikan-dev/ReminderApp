import { supabase } from "../utils/SupabaseClients"

export async function addReminder() {
    const { data, error } = await supabase.from('reminder').insert([{
        name: "name",
        isPermanent: true,
        isDone: false,
        datePick: new Date(),
        colorPick: "#ff0000",
        desc: "deskripsi reminder",
    }])

    if (error) {
        console.error("gagal menambahkan reminder:", error.message);
    } else {
        console.log("reminder berhasil ditambahkan:", data);
    }
}