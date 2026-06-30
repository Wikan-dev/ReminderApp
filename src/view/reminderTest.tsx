import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Import Auth Store kamu (sesuaikan path folder jika berbeda)
import { useAuthStore } from '../store/authStore'; 

interface Reminder {
id: number;          
user_id: string; 
name: string;        
datePick: string;    
isPermanent: boolean;
isDone: boolean;
colorPick?: string;
desc?: string;
}

const BASE_URL = 'http://localhost:5000/api/reminder';

export const ReminderTest: React.FC = () => {
// 2. Ambil data slug otomatis dari Zustand authStore kamu
// const user = useAuthStore((state) => state.user);
const inputSlug = useAuthStore((state) => state.user?.slug); // Ambil properti slug dari data user login

const [reminders, setReminders] = useState<Reminder[]>([]);
const [inputName, setInputName] = useState('');
const [inputDatePick, setInputDatePick] = useState('');
const [editingId, setEditingId] = useState<number | null>(null);

// 3. Otomatis mengambil data jika user sudah login (slug tersedia)
useEffect(() => {
if (inputSlug) {
    handleGetAll();
}
}, [inputSlug]);

// ==========================================
// [READ] - GET ALL DATA BERDASARKAN SLUG AUTOMATIS
// ==========================================
const handleGetAll = async () => {
if (!inputSlug) return; // Diam jika belum ada user login
try {
    const response = await axios.get<Reminder[]>(`${BASE_URL}/${inputSlug}`);
    setReminders(response.data);
    console.log('✅ GET ALL SUCCESS:', response.data);
} catch (error) {
    console.error('❌ GET ALL ERROR:', error);
}
};

// ==========================================
// [CREATE] - POST DATA BARU
// ==========================================
const handleCreate = async (e: React.FormEvent) => {
    console.log("Payload yang dikirim:", {
    slug: inputSlug,
    name: inputName,
    datePick: inputDatePick
    });

if (e) e.preventDefault();
if (!inputSlug) return alert('Kamu harus login terlebih dahulu!');
if (!inputName || !inputDatePick) return alert('Isi nama kegiatan dan waktu!');

try {
    const response = await axios.post(BASE_URL, {
    slug: inputSlug, // Slug dikirim otomatis dari state login
    name: inputName,
    // Pastikan format tanggal valid untuk backend (YYYY-MM-DD)
    datePick: inputDatePick,
    isPermanent: false,
    isFinish: false,
    colorPick: '#000000',
    desc: 'Testing dari UI ReminderTest'
    });
    
    console.log('✅ CREATE SUCCESS:', response.data);
    handleGetAll(); 
    setInputName('');
    setInputDatePick('');
} catch (error: any) {
    console.error('❌ CREATE ERROR:', error.response?.data || error.message || error);
}
};

// ==========================================
// [UPDATE] - PUT EDIT DATA
// ==========================================
const handleUpdate = async (e: React.FormEvent) => {
if (e) e.preventDefault();
if (!inputSlug) return alert('Sesi login tidak ditemukan!');
if (!inputName || !inputDatePick) return alert('Isi field untuk edit!');

try {
    const response = await axios.put(`${BASE_URL}/${inputSlug}`, {
    name: inputName,
    datePick: inputDatePick,
    isPermanent: false,
    isFinish: false,
    colorPick: '#000000',
    desc: 'Updated via ReminderTest'
    });

    console.log('✅ UPDATE SUCCESS:', response.data);
    setEditingId(null);
    setInputName('');
    setInputDatePick('');
    handleGetAll(); 
} catch (error: any) {
    console.error('❌ UPDATE ERROR:', error.response?.data || error.message || error);
}
};

// ==========================================
// [DELETE] - DELETE REMINDER
// ==========================================
const handleDelete = async () => {
if (!inputSlug) return alert('Sesi login tidak ditemukan!');
if (!window.confirm('Yakin ingin menghapus SEMUA reminder kamu?')) return;

try {
    const response = await axios.delete(`${BASE_URL}/${inputSlug}`);
    console.log('✅ DELETE SUCCESS:', response.data);
    setReminders([]); 
} catch (error) {
    console.error('❌ DELETE ERROR:', error);
}
};

const startEdit = (reminder: Reminder) => {
setEditingId(reminder.id);
setInputName(reminder.name);
setInputDatePick(reminder.datePick);
};

return (
<div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
    <h2>Test Endpoint Reminder</h2>
    <hr />

    {/* INFORMASI STATUS USER */}
    <div style={{ marginBottom: '20px', padding: '10px', background: inputSlug ? '#e6f4ea' : '#fce8e6', borderRadius: '5px', color: inputSlug ? '#137333' : '#c5221f' }}>
    {inputSlug ? (
        <span>🟢 Terhubung Otomatis dengan Slug: <strong>{inputSlug}</strong></span>
    ) : (
        <span>🔴 Kamu belum login. Silakan login terlebih dahulu melalui halaman Login.</span>
    )}
    </div>

    {/* FORM UNTUK CREATE & UPDATE */}
    <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ marginBottom: '20px' }}>
    <h3>{editingId ? '✏️ Mode Edit Data (PUT)' : '➕ Tambah Data Baru (POST)'}</h3>
    <div style={{ marginBottom: '10px' }}>
        <input
        type="text"
        placeholder="Nama Kegiatan (e.g., Minum Obat)"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        style={{ width: '95%', padding: '8px' }}
        disabled={!inputSlug}
        />
    </div>
    <div style={{ marginBottom: '10px' }}>
        <input
        type="date"
        placeholder="Tanggal (YYYY-MM-DD)"
        value={inputDatePick}
        onChange={(e) => setInputDatePick(e.target.value)}
        style={{ width: '95%', padding: '8px' }}
        disabled={!inputSlug}
        />
    </div>
    
    <button type="submit" disabled={!inputSlug} style={{ marginRight: '10px', padding: '8px 12px', background: !inputSlug ? 'gray' : editingId ? 'orange' : 'green', color: 'white', border: 'none', cursor: inputSlug ? 'pointer' : 'not-allowed', borderRadius: '4px' }}>
        {editingId ? 'Simpan Perubahan (PUT)' : 'Kirim Data (POST)'}
    </button>

    {editingId && (
        <button type="button" onClick={() => { setEditingId(null); setInputName(''); setInputDatePick(''); }} style={{ padding: '8px 12px', borderRadius: '4px' }}>
        Batal
        </button>
    )}
    </form>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
    <button onClick={handleGetAll} disabled={!inputSlug} style={{ padding: '8px 12px', background: !inputSlug ? 'gray' : '#007bff', color: 'white', border: 'none', cursor: inputSlug ? 'pointer' : 'not-allowed', borderRadius: '4px' }}>
        🔄 Ambil Data (GET)
    </button>

    <button onClick={handleDelete} disabled={!inputSlug} style={{ padding: '8px 12px', background: !inputSlug ? 'gray' : '#dc3545', color: 'white', border: 'none', cursor: inputSlug ? 'pointer' : 'not-allowed', borderRadius: '4px' }}>
        🗑️ Hapus Semua (DELETE)
    </button>
    </div>

    {/* DAFTAR DATA */}
    <h3>Daftar Reminder Saat Ini:</h3>
    {reminders.length === 0 ? (
    <p style={{ color: 'gray', fontStyle: 'italic' }}>Tidak ada data atau kamu belum login.</p>
    ) : (
    <ul style={{ paddingLeft: '20px' }}>
        {reminders.map((item) => (
        <li key={item.id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>{item.name}</strong> — <span style={{ color: '#555' }}>{item.datePick}</span>
            <br />
            <button onClick={() => startEdit(item)} style={{ marginRight: '5px', fontSize: '12px', padding: '3px 8px', cursor: 'pointer' }}>Edit</button>
        </li>
        ))}
    </ul>
    )}
</div>
);
};