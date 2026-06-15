import { useEffect, useState } from 'react';
import { supabase } from '../utils/SupabaseClients'; // Sesuaikan dengan jalur file kamu
import { addReminder } from '../function/addReminder';

interface Reminder {
  id: number;
  user_id: string;
  title: string;
}

export default function TestRLS() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function testFetch() {
      setLoading(true);

      // 1. Ambil data session user yang sedang login saat ini
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? 'No Email');
        console.log("Kamu saat ini login sebagai UUID:", user.id);
      } else {
        console.log("Kamu belum login / Berstatus Anonim");
      }

      // 2. Tarik data dari tabel reminder
      // Ganti 'reminders' sesuai nama tabel asli kamu di Supabase
      const { data, error } = await supabase.from('reminder').select('*');

      if (error) {
        console.error("Gagal mengambil data:", error.message);
      } else {
        setReminders(data || []);
        console.log("Data yang berhasil ditarik oleh Frontend:", data);
      }
      setLoading(false);
    }

    testFetch();
  }, []);

  if (loading) return <p>Sedang memuat data dan mengecek RLS...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🧪 Hasil Pengujian RLS Frontend</h2>
      <p>Status Login: <strong>{userEmail ? `Login sebagai (${userEmail})` : 'Belum Login'}</strong></p>
      
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f3f3' }}>
            <th>ID (Primary Key)</th>
            <th>User ID / UUID Manual</th>
            <th>Judul Reminder</th>
          </tr>
        </thead>
        <tbody>
          {reminders.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                Tidak ada data yang keluar (RLS memblokir akses atau tabel kosong)
              </td>
            </tr>
          ) : (
            reminders.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ color: item.user_id !== item.user_id ? 'red' : 'green' }}>
                  {item.user_id}
                </td>
                <td>{item.title}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={addReminder}>add reminder</button>
    </div>
  );
}