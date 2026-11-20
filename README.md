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

Push ke `main`, Vercel otomatis deploy ulang.

## Jalanin lokal

```bash
python3 -m http.server 8000
```

Buka http://localhost:8000. Jangan buka `index.html` langsung dari file, karena browser nge-blok `fetch` ke `skills.json`.
