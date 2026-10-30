# Pylmor

Dil öğrenme platformu iskeleti. İlk hedef dil İngilizce; arayüz dili Türkçe (`tr`).

## Yapı

```
eng_web/
└── web/   # Next.js (UI + Route Handlers API + Prisma)
```

Backend ayrı Express sunucusu değil; API `web/app/api/v1` altındaki Next.js Route Handlers.

## Gereksinimler

- Node.js 20+
- MySQL 8+

## Hızlı başlangıç

```bash
cd web
cp .env.example .env.local
# .env.local içindeki DATABASE_* ve JWT_* değerlerini doldur
npm install
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed-levels.ts   # opsiyonel: A1–C2 seviyeleri
npm run dev
```

Uygulama: `http://localhost:3000` → varsayılan locale `/tr`  
API: `http://localhost:3000/api/v1`

## Ortam değişkenleri (`web/.env.local`)

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API taban yolu (`/api/v1`) |
| `APP_URL` | Doğrulama linki için uygulama kök URL’si |
| `DATABASE_URL` | Prisma bağlantı dizesi (`mysql://...`) |
| `DATABASE_HOST` / `PORT` / `USER` / `PASSWORD` / `NAME` | Prisma MariaDB adapter |
| `JWT_ACCESS_SECRET` | Access token imzası (min. 32 karakter) |
| `JWT_REFRESH_SECRET` | Refresh token imzası (min. 32 karakter) |
| `JWT_ACCESS_EXPIRES_IN` | örn. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | örn. `7d` |
| `COOKIE_SECURE` | Prod HTTPS için `true` |
| `SMTP_HOST` / `PORT` / `SECURE` / `USER` / `PASS` / `FROM` | Doğrulama e-postası (SMTP) |

## Auth uçları

Hepsi `/api/v1` altında:

| Method | Path | Açıklama |
| --- | --- | --- |
| `POST` | `/auth/register` | Kayıt (doğrulama e-postası gönderir) |
| `POST` | `/auth/verify-email` | E-posta token ile hesabı etkinleştirir |
| `POST` | `/auth/login` | Giriş (yalnızca doğrulanmış hesap) |
| `POST` | `/auth/refresh` | Token yenileme |
| `POST` | `/auth/logout` | Çıkış |
| `GET` | `/auth/me` | Oturumdaki kullanıcı (Bearer) |

Yanıt şekli: `{ success, data, error }`

## Notlar

- Ders ve egzersiz UI’ı henüz yok; Prisma şemasında `Lesson`, `Exercise`, `Word`, `UserProgress`, `Streak` modelleri hazır.
- Kurslar bir `Language` kaydına bağlıdır; seviye `Level` (A1–C2) üzerinden bağlanır.
