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
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const rawString = `${email}-${name}-rmndr-secret`;
      const urlSlug = crypto.createHash('md5').update(rawString).digest('hex').substring(0, 12);
      const { data, error } = await supabase
        .from('account') 
        .insert([{ 
          Name: name, 
          email: email, 
          password: hashedPassword,
          slug: urlSlug
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
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  //jika password salah
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "password yang di masukkan salah"});
  }

  const returnedSlug = user.slug ?? user.Slug ?? null;
  const returnedName = user.name ?? user.Name ?? user.email;

  return res.status(200).json({
    message: "login berhasil",
    user: {
      id: user.id,
      name: returnedName,
      email: user.email,
      slug: returnedSlug
    }
  })
  
})

//menambahkan reminder baru
app.post('/api/reminder', async (req, res) => {
  const { name, isPermanent, isFinish, datePick, colorPick, desc, slug } = req.body;

  // Validasi data wajib agar tidak langsung crash ke database
  if (!slug || !name) {
    return res.status(400).json({ error: "Slug dan Name pengingat wajib diisi!" });
  }

  const { data, error } = await supabase
    .from('reminder')
    .insert([{
      user_id: slug,
      name: name,
      isPermanent: isPermanent ?? false, // Beri default false jika kosong
      isDone: isFinish ?? false,
      datePick: datePick,
      colorPick: colorPick,
      desc: desc
    }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data[0]); // Kembalikan single object yang baru dibuat
});

//menghapus data reminder
app.delete('/api/reminder/:slug', async (req, res) => {
  const { slug } = req.params;

  const { error } = await supabase
    .from('reminder')
    .delete()
    .eq('user_id', slug);
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "reminder berhasil dihapus" })
})

//mengambil data reminder
app.get('/api/reminder/:slug', async (req, res) => {
  const { slug } = req.params; // Diubah dari req.body ke req.params

  try {
    const { data, error } = await supabase
      .from('reminder')
      .select('*')
      .eq('user_id', slug);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data); // Pastikan ada return response!
  } catch (err) {
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Toggle status selesai reminder
app.patch('/api/reminder/:id', async (req, res) => {
  const { id } = req.params;
  const { isFinish } = req.body;

  const { data, error } = await supabase
    .from('reminder')
    .update({ isDone: Boolean(isFinish) })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data?.[0]);
});

//todo: buat kode front end untuk menggunakan endpoint ini
//todo: gabungkan endpoint dengan slug pada param supaya bisa login dengan benar
//mengedit reminder yang sudah ada
app.put('/api/reminder/:slug', async (req, res) => {
  const { slug } = req.params;
  const { name, isPermanent, isFinish, datePick, colorPick, desc, user_id } = req.body;

  const { data, error } = await supabase
  .from('reminder')
  .update({ 
    user_id: slug,
    name: name,
    isPermanent: isPermanent,
    isDone: isFinish,
    datePick: datePick,
    colorPick: colorPick,
    desc: desc
  })
  .eq('user_id', slug);

  if (error) return res.status(400).json({ error: error.message});
  return res.status(200).json({ message: "reminder berhasil diupdate", data});
})


app.listen(5000, () => console.log('🚀 Server backend berjalan di port 5000'));