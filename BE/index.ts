import express from 'express';
import cors from 'cors';
import { supabase } from '../src/config/supabase';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Langsung masukkan data ke tabel 'account' di Supabase tanpa lewat Prisma!
  const { data, error } = await supabase
    .from('account') 
    .insert([{ Name: name, email: email, password: password }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ message: 'Registrasi berhasil!', user: data });
});

app.listen(5000, () => console.log('🚀 Server backend berjalan di port 5000'));