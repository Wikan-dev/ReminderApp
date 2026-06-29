import express from 'express';
import cors from 'cors';
import { supabase } from '../src/config/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
      // Langsung masukkan data ke tabel 'account' di Supabase tanpa lewat Prisma!
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const { data, error } = await supabase
        .from('account') 
        .insert([{ 
          Name: name, 
          email: email, 
          password: hashedPassword 
        }])
        .select();
    
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json({ message: 'Registrasi berhasil!', user: data });
    } catch (err) {
      return res.status(500).json({ error: 'rterjadi kesalahan pada server' })
    }
  });
  
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
  .from('account') //mengambil data dari account
  .select('*') //mengambil seluruh tabel
  .eq('email', email) //mencocokkan kolom email dengan email yang di input
  .single(); //mengambil 1 objek saja bukan array
  
  //jika error atau user tidak ditemukan
  if (error || !user) {
    return res.status(400).json({ error: "email tidak ditemukan"});
  } 
  const rawString = `${user.email}-${user.name}-rmndr-secret`;
  const urlSlug = crypto.createHash('md5').update(rawString).digest('hex').substring(0, 12);
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  //jika password salah
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "password yang di masukkan salah"});
  }

  return res.status(200).json({
    message: "login berhasil",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      slug: urlSlug
    }
  })
  
})

app.post('/api/reminder', async (req, res) => {
    const { name, isPermanent, isFinish, datePick, colorPick, desc, user_id } = req.body;

    const { data, error } = await supabase.from('reminder').insert([{
      user_id: user_id,
      name: name,
      isPermanent: isPermanent,
      isDone: isFinish,
      datePick: datePick,
      colorPick: colorPick,
      desc: desc
    }]).select();

    if (error) return res.status(400).json({ error: error.message});
    return res.status(200).json(data);
})

app.delete('/api/reminder/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('reminder')
    .delete()
    .eq('id', id);
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "reminder berhasil dihapus" })
})

app.put('/api/reminder/:id', async (req, res) => {
  const { id } = req.params;
  const { name, isPermanent, isFinish, datePick, colorPick, desc, user_id } = req.body;

  const { data, error } = await supabase
  .from('reminder')
  .update({ 
    user_id: user_id,
    name: name,
    isPermanent: isPermanent,
    isDone: isFinish,
    datePick: datePick,
    colorPick: colorPick,
    desc: desc
  })
  .eq('id', id);

  if (error) return res.status(400).json({ error: error.message});
  return res.status(200).json({ message: "reminder berhasil diupdate", data});
})



app.listen(5000, () => console.log('🚀 Server backend berjalan di port 5000'));