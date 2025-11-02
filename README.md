# Diniy Konfessiyalar uchun Xavfsiz Axborot Almashish Platformasi

## Loyiha haqida

Bu platforma turli diniy konfessiyalarning yangilik va postlarini kuzatish, fikr bildirish va o'zaro muloqot qilish imkonini beruvchi xavfsiz veb dastur.

## Texnologiyalar

### Backend
- Django 5.2.7
- Django REST Framework 3.16.1
- JWT Authentication (djangorestframework-simplejwt)
- SQLite Database
- Python 3.11+

### Frontend
- React 18
- Vite
- Tailwind CSS 3
- React Router DOM 6
- Axios

## O'rnatish va ishga tushirish

### 1. Backend

```bash
cd backend

# Virtual environment yaratish
python -m venv venv
source venv/bin/activate  # Linux/Mac
# yoki
venv\Scripts\activate  # Windows

# Paketlarni o'rnatish
pip install -r requirements.txt

# Migratsiyalar
python manage.py migrate

# Superuser yaratish
python manage.py createsuperuser

# Serverni ishga tushirish
python manage.py runserver
```

Backend http://localhost:8000 da ishga tushadi.

### 2. Frontend

```bash
cd frontend

# Node paketlarini o'rnatish
npm install

# Development serverni ishga tushirish
npm run dev
```

Frontend http://localhost:5173 da ochiladi.

## Foydalanuvchi rollari

- **SuperAdmin** - Butun tizimni boshqaradi, konfessiyalarga admin tayinlaydi
- **Konfessiya Admini** - O'z konfessiyasiga post joylaydi, kommentlarni nazorat qiladi
- **Oddiy Foydalanuvchi** - Konfessiyalarga obuna bo'ladi, postlarni ko'radi, like va komment qoldiradi

## Asosiy funksiyalar

### Autentifikatsiya
- Ro'yxatdan o'tish
- Login/Logout
- JWT token bilan himoyalangan API
- Parolni o'zgartirish

### Konfessiyalar
- 16 ta diniy konfessiya
- Har birida o'z admini
- Obuna bo'lish/bekor qilish
- Konfessiya postlarini ko'rish

### Postlar
- Post yaratish (faqat adminlar)
- Like qo'yish
- Komment yozish
- Muhim postlarni pin qilish
- Rasm va video yuklash

### Feed
- Obuna bo'lgan konfessiyalar postlari
- Vaqt bo'yicha saralangan

## API Endpoints

### Autentifikatsiya
- `POST /api/auth/users/register/` - Ro'yxatdan o'tish
- `POST /api/auth/users/login/` - Login
- `GET /api/auth/users/me/` - Joriy foydalanuvchi

### Konfessiyalar
- `GET /api/confessions/` - Barcha konfessiyalar
- `GET /api/confessions/{id}/` - Bitta konfessiya
- `POST /api/confessions/{id}/subscribe/` - Obuna bo'lish
- `GET /api/confessions/my_subscriptions/` - Mening obunalarim

### Postlar
- `GET /api/posts/` - Barcha postlar
- `GET /api/posts/feed/` - Mening feedim
- `POST /api/posts/{id}/like/` - Like qo'yish
- `POST /api/comments/` - Komment yozish

## Xavfsizlik

- HTTPS (production uchun)
- JWT authentication
- CORS himoyasi
- Parollar bcrypt bilan hashlangan
- Fayl yuklashda xavfli fayllar filtrlanadi
- CSRF himoyasi

## Admin Panel

Admin panelga kirish: http://localhost:8000/admin/

Superuser yaratib, admin panel orqali:
- Konfessiyalar boshqarish
- Adminlarni tayinlash
- Postlar va kommentlarni nazorat qilish
- Statistikani ko'rish

## Loyiha strukturasi

```
BMI/
├── backend/                # Django backend
│   ├── accounts/           # User modellari
│   ├── confessions/        # Konfessiya modellari
│   ├── posts/              # Post, Comment, Like modellari
│   ├── religious_platform/ # Asosiy settings
│   └── requirements.txt
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React komponentlar
    │   ├── pages/          # Sahifalar
    │   ├── services/       # API xizmatlari
    │   ├── context/        # AuthContext
    │   └── App.jsx         # Asosiy App
    └── package.json
```

## Muallif

Diplom ishi - 2025
