# Pylmor

Yapay zeka destekli alıştırmalarla adım adım İngilizce öğrenmeyi hedefleyen web tabanlı dil öğrenme platformu.

- **Öğrenilen dil:** İngilizce (CEFR: A1–C2)
- **Arayüz dili:** Türkçe (`tr`); çoklu dil altyapısı hazır
- **Dağıtım:** Tek Next.js uygulaması (UI + API), [Vercel](https://vercel.com) hedefli

---

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji yığını](#teknoloji-yığını)
- [Depo yapısı](#depo-yapısı)
- [Gereksinimler](#gereksinimler)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Ortam değişkenleri](#ortam-değişkenleri)
- [NPM komutları](#npm-komutları)
- [REST API](#rest-api)
- [Mimari notlar](#mimari-notlar)
- [Üretim dağıtımı](#üretim-dağıtımı)

---

## Özellikler

| Alan                                  | Açıklama                                                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Dil bilgisi**                       | Konu anlatımları, alıştırmalar (çoktan seçmeli, boşluk doldurma, dinleme, karışık sınav), birleşik egzersizler ve seviye sınavları |
| **Kelime**                            | Kategori bazlı kelime listeleri, günlük kota, bilinen kelimeler, fiil tabloları, kelime sınavı                                     |
| **Okuma / dinleme / yazma / konuşma** | Seviye kilitleri, pratik ve sınav modları, yerel ilerleme ve taslak saklama                                                        |
| **Panel**                             | Dashboard, seri (streak), bildirimler, kaldığın yerden devam, ayarlar ve ilerleme sıfırlama                                        |
| **Kimlik doğrulama**                  | Kayıt, e-posta doğrulama, JWT access + refresh, profil ve avatar yönetimi                                                          |
| **Tema & erişilebilirlik**            | Açık / koyu / sistem teması, mobil öncelikli arayüz, shadcn/ui bileşenleri                                                         |

İçerik büyük ölçüde `web/data/` altında TypeScript modülleri olarak tutulur; veritabanı kullanıcı, kelime durumu, seri ve ilerleme için kullanılır.

---

## Teknoloji yığını

| Katman     | Seçim                                                  |
| ---------- | ------------------------------------------------------ |
| Framework  | [Next.js 16](https://nextjs.org) (App Router)          |
| Dil        | TypeScript (strict)                                    |
| Stil       | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com)     |
| Durum      | [Zustand](https://zustand.docs.pmnd.rs) (`web/store/`) |
| API        | Route Handlers → `/api/v1`                             |
| Doğrulama  | [Zod](https://zod.dev)                                 |
| Veritabanı | MySQL 8+ / MariaDB, [Prisma 7](https://www.prisma.io)  |
| i18n       | [next-intl](https://next-intl.dev)                     |
| Auth       | bcrypt, JWT, HTTP-only çerezler                        |

---

## Depo yapısı

```
eng_web/
└── web/                          # Tek uygulama (frontend + backend)
    ├── app/
    │   ├── [locale]/             # Locale tabanlı sayfalar (/tr/...)
    │   │   ├── panel/            # Öğrenme paneli (grammer, vocabulary, skills)
    │   │   ├── register, panelLogin, verify-email, ...
    │   └── api/v1/                 # REST API
    ├── components/
    │   ├── ui/                     # shadcn primitifleri
    │   ├── layout/                 # Navbar, footer, tema
    │   └── features/               # Özellik bileşenleri
    ├── data/                       # Konu, kelime, okuma, dinleme, ... içeriği
    ├── lib/                        # İstemci yardımcıları
    │   └── server/                 # Prisma, JWT, mail (yalnız sunucu)
    ├── messages/tr.json            # UI metinleri (sabit string yok)
    ├── prisma/schema.prisma        # Veri modeli
    └── store/                      # Zustand mağazaları
```

Backend ayrı bir sunucu değildir; tüm API `web/app/api/v1` altındaki Next.js Route Handler’larıdır.

---

## Gereksinimler

- **Node.js** 20 veya üzeri
- **MySQL** 8+ veya uyumlu MariaDB
- Kayıt akışı için çalışan bir **SMTP** hesabı (geliştirmede isteğe bağlı, doğrulama maili için gerekli)

---

## Hızlı başlangıç

```bash
cd web
cp .env.example .env.local
# .env.local içinde DATABASE_* ve JWT_* değerlerini doldurun
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed-levels    # opsiyonel: A1–C2 seviye kayıtları
npm run dev
```

| Adres                                 | Açıklama          |
| ------------------------------------- | ----------------- |
| `http://localhost:3000/tr`            | Varsayılan arayüz |
| `http://localhost:3000/api/v1/health` | Sağlık kontrolü   |

Veritabanı boşsa önce migration çalıştırın. Panel ve kelime API’leri için kayıtlı ve **e-postası doğrulanmış** bir kullanıcı gerekir.

---

## Ortam değişkenleri

Şablon: `web/.env.example` → kopyalayın: `web/.env.local`

| Değişken                                                | Açıklama                                                       |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                                   | İstemci API tabanı (genelde `/api/v1`)                         |
| `APP_URL`                                               | Doğrulama linkleri için kök URL (örn. `http://localhost:3000`) |
| `DATABASE_URL`                                          | Prisma bağlantı dizesi (`mysql://...`)                         |
| `DATABASE_HOST` / `PORT` / `USER` / `PASSWORD` / `NAME` | MariaDB adapter alanları                                       |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`              | En az 32 karakter; üretimde güçlü rastgele değer               |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN`      | örn. `15m` / `7d`                                              |
| `COOKIE_SECURE`                                         | HTTPS ortamında `true`                                         |
| `SMTP_*`                                                | Kayıt sonrası e-posta doğrulama                                |

Gizli dosyaları repoya eklemeyin.

---

## NPM komutları

`web/` dizininde:

| Komut                        | Açıklama                             |
| ---------------------------- | ------------------------------------ |
| `npm run dev`                | Geliştirme sunucusu                  |
| `npm run build`              | `prisma generate` + üretim derlemesi |
| `npm run start`              | Üretim sunucusu                      |
| `npm run lint`               | ESLint                               |
| `npm run prisma:migrate`     | Şema migration                       |
| `npm run prisma:studio`      | Prisma Studio                        |
| `npm run prisma:seed-levels` | CEFR seviye seed                     |

---

## REST API

Tüm uçlar `/api/v1` öneki altındadır. Yanıt gövdesi tutarlıdır:

```json
{ "success": true, "data": { ... }, "error": null }
```

Hata durumunda `success: false` ve `error` mesajı döner. Korunan uçlar geçerli access token (Bearer veya çerez akışına göre) gerektirir.

### Kimlik doğrulama

| Method                   | Path                 | Açıklama                                 |
| ------------------------ | -------------------- | ---------------------------------------- |
| `POST`                   | `/auth/register`     | Kayıt; doğrulama e-postası gönderir      |
| `POST`                   | `/auth/verify-email` | E-posta token ile hesabı etkinleştirir   |
| `POST`                   | `/auth/login`        | Giriş (yalnız doğrulanmış hesap)         |
| `POST`                   | `/auth/refresh`      | Access token yenileme                    |
| `POST`                   | `/auth/logout`       | Çıkış                                    |
| `GET` / `PATCH`          | `/auth/me`           | Oturumdaki kullanıcı / profil güncelleme |
| `POST`                   | `/auth/me/password`  | Şifre değiştirme                         |
| `GET` / `PUT` / `DELETE` | `/auth/me/avatar`    | Avatar okuma / yükleme / silme           |

### Kelime & ilerleme

| Method            | Path                        | Açıklama                       |
| ----------------- | --------------------------- | ------------------------------ |
| `GET`             | `/vocabulary/status`        | Kelime durumları               |
| `PUT`             | `/vocabulary/status`        | Kelime durumu güncelleme       |
| `GET`             | `/vocabulary/known`         | Bilinen kelimeler              |
| `GET`             | `/vocabulary/studied-today` | Bugün çalışılan kelimeler      |
| `GET`             | `/vocabulary/quiz`          | Aktif kelime sınavı            |
| `POST`            | `/vocabulary/quiz/answer`   | Sınav cevabı                   |
| `POST`            | `/vocabulary/quiz/complete` | Sınavı tamamlama               |
| `POST` / `DELETE` | `/vocabulary/study-timer`   | Çalışma zamanlayıcısı          |
| `GET` / `POST`    | `/streak`                   | Günlük seri okuma / işaretleme |
| `POST`            | `/progress/reset`           | Öğrenim ilerlemesini sıfırlama |

### Diğer

| Method | Path      | Açıklama                 |
| ------ | --------- | ------------------------ |
| `GET`  | `/health` | Uygulama sağlık kontrolü |

---

## Mimari notlar

**i18n** — Rotalar `[locale]` segmentiyle başlar. UI metinleri `messages/tr.json` içindedir; yeni metin eklerken dosyaya anahtar ekleyin, bileşende `useTranslations` kullanın.

**İçerik vs. veritabanı** — Ders konuları, okuma metinleri ve benzeri statik içerik `web/data/` altında versiyonlanır. Prisma modelleri (`User`, `UserVocabularyWord`, `Streak`, `UserProgress`, `Course`, …) kullanıcıya özel durumu ve genişleme için kurs yapısını tutar.

**İstemci ilerlemesi** — Birçok beceri (gramer sınavı, okuma, dinleme vb.) tarayıcıda `localStorage` taslakları ve yardımcı modüllerle (`lib/*ProgressStorage.ts`, `lib/topicExamDraftStorage.ts`) yönetilir; sunucu tarafında kelime ve seri senkronize edilir.

**Güvenlik** — Sunucuya özel kod yalnız `lib/server/` altında import edilmelidir. JWT sırları ve veritabanı bilgisi yalnız ortam değişkenlerinden okunur.

**UI** — Yeni buton, dialog vb. için önce `components/ui` içinde shadcn bileşenini kontrol edin; eksikse `npx shadcn@latest add <bileşen>` (`web/` içinden).

---

## Üretim dağıtımı

1. Vercel (veya benzeri) projesinde kök dizin olarak `web` seçin.
2. Ortam değişkenlerini panelden tanımlayın (`DATABASE_URL`, JWT, SMTP, `APP_URL`, `COOKIE_SECURE=true`).
3. Build komutu: `npm run build` (package.json zaten `prisma generate` içerir).
4. Migration’ları hedef veritabanında çalıştırın (`prisma migrate deploy`).

MySQL bağlantısının sunucudan erişilebilir olduğundan ve `APP_URL` değerinin kullanıcıya giden doğrulama linkleriyle eşleştiğinden emin olun.

---

## Katkı

Küçük, odaklı değişiklikler ve anlamlı commit mesajları tercih edilir. TypeScript strict, Zod ile API girdi doğrulama ve mevcut klasör convention’larına uyum beklenir.

Sorular veya hata bildirimi için depo sahibiyle iletişime geçin.
