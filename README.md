# Skill Shelf

Daftar skill Claude pilihan per kategori. Situs statis tanpa build: HTML, CSS, dan satu file JS.

## Nambah atau ngubah skill

Semua isi ada di [`skills.json`](skills.json). Tambah satu baris di `skills`:

```json
{"name":"nama-skill","category":"Core AI","tag":"Skill gw","desc":"Satu kalimat apa fungsinya.","url":"https://github.com/user/repo"}
```

- `category` harus sama persis dengan salah satu nama di `categories`. Mau kategori baru, tambah dulu namanya di `categories`.
- `tag`: `Skill gw`, `Resmi`, atau `Komunitas`.
- `url` boleh kosong (`""`): kartunya tampil tanpa link, dengan tulisan "Skill pribadi".
- Footer (nama, deskripsi, tombol kontak) ada di `profile` di file yang sama. Tambah LinkedIn: tambah `{"label":"LinkedIn","url":"..."}` ke `profile.links`.

Live di https://skill-shelf-mu.vercel.app. Project Vercel-nya belum tersambung ke repo ini, jadi push belum otomatis deploy. Sambungin di Vercel: Settings > Git > Connect Repository (Vercel GitHub app perlu akses ke repo `skill-shelf`). Setelah tersambung, tiap push ke `main` deploy ulang sendiri.

## Jalanin lokal

```bash
python3 -m http.server 8000
```

Buka http://localhost:8000. Jangan buka `index.html` langsung dari file, karena browser nge-blok `fetch` ke `skills.json`.
