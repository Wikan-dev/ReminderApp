import { useState } from 'react';
import axios from 'axios';

export default function MainPage() {
  // 1. Siapkan state untuk menampung ketikan user di form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // 2. Fungsi penembak API Backend saat tombol daftar diklik
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman reload otomatis

    try {
      // Mengirimkan data objek ke server backend port 5000
      const response = await axios.post('http://localhost:5000/api/register', {
        name: name,
        email: email,
        password: password
      });

      // Jika backend merespon sukses
      if (response.status === 201) {
        setMessage('Selamat! Akun kamu berhasil terdaftar di database.');
        // Kamu bisa mengosongkan form kembali di sini jika mau
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      // Jika terjadi error (misal email duplikat atau server mati)
      const errorMsg = error.response?.data?.error || 'Terjadi kesalahan koneksi.';
      setMessage(`Gagal mendaftar: ${errorMsg}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Buat Akun Reminder</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nama:</label><br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <br />
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <br />
        <div>
          <label>Password:</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <br />
        <button type="submit">Daftar Sekarang</button>
      </form>

      {/* Menampilkan pesan sukses / error dari database */}
      {message && <p style={{ marginTop: '15px', color: 'blue' }}>{message}</p>}
    </div>
  );
}