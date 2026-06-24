import express from 'express';
import cors from 'cors';
import { supabase } from '../src/config/supabase';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint Register
//todo perbaiki endpoint register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Langsung masukkan data ke tabel 'account' di Supabase tanpa lewat Prisma!
  const { data, error } = await supabase
    .from('account') 
    .insert([{ 
      Name: name, 
      email: email, 
      password: password 
    }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ message: 'Registrasi berhasil!', user: data });
});
//TODOS: perbaiki endpoint login
//TODO: test kedua endpoint pada thunder client
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
  //jika password salah
  if (user.password !== password) {
    return res.status(400).json({ error: "password yang di masukkan salah"});
  }

  return res.status(200).json({
    message: "login berhasil",
    user: user
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