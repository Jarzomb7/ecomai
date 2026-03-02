# 💰 EcomProfit — Kalkulator Zysku dla Sprzedawców E-commerce

**Wreszcie wiesz ile NAPRAWDĘ zarabiasz po wszystkich kosztach.**

CRM + Profit Calculator dla sprzedawców na Allegro, Amazon, OLX, Empik, WooCommerce i Shopify.

---

## 🔥 Funkcje

- **Dashboard** — przychód, koszty, zysk netto, marża, ROAS w czasie rzeczywistym
- **Kalkulator Zysku** — rozkład waterfall ze wszystkimi kosztami + próg rentowności
- **Zarządzanie Produktami** — katalog z alertami niskiego stanu
- **Koszty Firmowe** — ZUS, księgowość, magazyn, reklamy, paliwo...
- **Analiza Platform** — Allegro vs Amazon vs OLX porównanie
- **Zatowarowanie** — rekomendacje zamówień + prognoza cashflow
- **SaaS Ready** — każdy użytkownik ma swoje izolowane dane

## 🛠 Technologia

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** (dark theme, glassmorphism)
- **Prisma ORM** + **PostgreSQL** (Neon/Supabase)
- **NextAuth.js** (credentials + Google)
- **Recharts** (wykresy)
- **Zod** (walidacja)

---

## 🚀 Szybki Start (lokalnie)

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/twoj-username/ecom-profit.git
cd ecom-profit
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Skonfiguruj bazę danych

**Opcja A: Neon (zalecane — darmowy tier)**
1. Wejdź na https://neon.tech i utwórz projekt
2. Skopiuj connection string

**Opcja B: Supabase**
1. Wejdź na https://supabase.com i utwórz projekt
2. Settings → Database → Connection string (Transaction pooler)

### 4. Skonfiguruj zmienne środowiskowe

```bash
cp .env.example .env.local
```

Uzupełnij `.env.local`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="wygeneruj-losowy-sekret"
NEXTAUTH_URL="http://localhost:3000"
```

Generowanie sekretu:
```bash
openssl rand -base64 32
```

### 5. Inicjalizuj bazę danych

```bash
npx prisma generate
npx prisma db push
```

### 6. Załaduj dane testowe

```bash
npm run db:seed
```

Tworzy konto demo:
- 📧 Email: `demo@ecomprofit.pl`
- 🔑 Hasło: `demo123456`

### 7. Uruchom aplikację

```bash
npm run dev
```

Otwórz http://localhost:3000

---

## 🌐 Wdrożenie na Vercel

### Krok 1: GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Krok 2: Vercel

1. Idź na https://vercel.com
2. Kliknij **Add New → Project**
3. Importuj swoje repozytorium GitHub
4. Dodaj zmienne środowiskowe:

| Zmienna | Wartość |
|---------|---------|
| `DATABASE_URL` | Twój connection string PostgreSQL |
| `NEXTAUTH_SECRET` | Losowy ciąg 32+ znaków |
| `NEXTAUTH_URL` | `https://twoja-domena.vercel.app` |

5. Kliknij **Deploy**

### Krok 3: Inicjalizacja bazy na produkcji

Po wdrożeniu uruchom lokalnie (z produkcyjną DATABASE_URL):

```bash
DATABASE_URL="produkcyjny-url" npx prisma db push
DATABASE_URL="produkcyjny-url" npm run db:seed
```

Lub przez Vercel CLI:
```bash
npx vercel env pull .env.production.local
npx prisma db push
npm run db:seed
```

---

## 📁 Struktura Projektu

```
ecom-profit/
├── prisma/
│   ├── schema.prisma          # Modele bazy danych
│   └── seed.ts                # Dane testowe
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth + rejestracja
│   │   │   ├── dashboard/     # Statystyki dashboardu
│   │   │   ├── products/      # CRUD produktów
│   │   │   ├── sales/         # CRUD sprzedaży
│   │   │   ├── expenses/      # CRUD kosztów
│   │   │   └── platforms/     # Analityki platform
│   │   ├── auth/
│   │   │   ├── login/         # Strona logowania
│   │   │   └── register/      # Strona rejestracji
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard główny
│   │       ├── calculator/    # Kalkulator zysku
│   │       ├── products/      # Lista produktów
│   │       ├── sales/         # Historia sprzedaży
│   │       ├── costs/         # Koszty firmowe
│   │       ├── platforms/     # Analiza platform
│   │       └── stock/         # Zatowarowanie
│   ├── components/
│   │   ├── layout/
│   │   │   └── sidebar.tsx    # Nawigacja boczna
│   │   └── ui/
│   │       ├── stat-card.tsx  # Karty statystyk
│   │       └── toaster.tsx    # Powiadomienia
│   ├── lib/
│   │   ├── auth.ts            # Konfiguracja NextAuth
│   │   ├── db.ts              # Singleton Prisma
│   │   └── utils.ts           # Kalkulator + formattery
│   └── types/
│       └── index.ts           # Typy TypeScript
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🗄 Schemat Bazy Danych

```
User
  ├── id, name, email, password, companyName
  ├── plan (FREE/STARTER/PRO/ENTERPRISE)
  └── relations: accounts, sessions, products, sales, expenses, platforms

Product
  ├── id, userId, name, sku, ean
  ├── purchasePrice, sellingPrice
  ├── stock, minStock
  └── relation: platform, sales

Platform
  ├── id, userId, name, type (ALLEGRO/AMAZON/OLX/EMPIK/WOOCOMMERCE/SHOPIFY)
  ├── commissionRate
  └── relations: products, sales

Sale
  ├── id, userId, productId, platformId
  ├── quantity, unitPrice, totalRevenue
  ├── commission, adsCost, shippingCost, packagingCost
  ├── returnRate, returnCost, vatRate
  ├── netProfit, grossMargin
  └── soldAt

Expense
  ├── id, userId, name, category, type (FIXED/VARIABLE)
  ├── amount, description, date
  └── isRecurring, recurringDay
```

---

## 🧮 Formuła Kalkulatora Zysku

```
Przychód Brutto = cena × ilość
  - VAT (23%/8%/5%)
  - Koszt zakupu towarów
= Zysk Brutto
  - Prowizja platformy (%)
= Po prowizji
  - Koszty reklamy (ADS)
= Po reklamach
  - Wysyłka
  - Pakowanie
  - Szacowane zwroty
= Po wszystkich kosztach zmiennych
  - Koszty stałe (ZUS + księgowość + inne)
= Zysk przed podatkiem
  - Podatek dochodowy (12%/19%)
= 🎯 ZYSK NETTO

Próg rentowności = koszty stałe / marża jednostkowa
```

---

## 🔐 Bezpieczeństwo

- Hasła hashowane bcrypt (salt rounds: 12)
- Sesje JWT (NextAuth)
- Każde zapytanie API weryfikuje session.user.id
- Row-level security — użytkownik widzi tylko swoje dane
- Walidacja inputów przez Zod

---

## 📈 Plany Rozwoju (SaaS)

- [ ] Integracja API Allegro (automatyczny import zamówień)
- [ ] Integracja API Amazon SP-API
- [ ] Subskrypcje Stripe (FREE/PRO/ENTERPRISE)
- [ ] Eksport do Excel / PDF
- [ ] Powiadomienia email (niski stan, progi zysku)
- [ ] Aplikacja mobilna (React Native)
- [ ] Porównywarka cen dostawców
- [ ] Prognozowanie AI (trendy sprzedaży)

---

## 🐛 Troubleshooting

**Problem:** `PrismaClientInitializationError`
**Rozwiązanie:** Sprawdź DATABASE_URL w .env.local

**Problem:** `NEXTAUTH_SECRET` error  
**Rozwiązanie:** Wygeneruj: `openssl rand -base64 32`

**Problem:** Seed nie działa  
**Rozwiązanie:** Najpierw `npx prisma db push` potem `npm run db:seed`

**Problem:** Build error na Vercel  
**Rozwiązanie:** Dodaj zmienną `SKIP_ENV_VALIDATION=1` lub upewnij się że wszystkie env są ustawione

---

## 📄 Licencja

MIT — używaj swobodnie, rozwijaj, sprzedawaj.

---

**Zbudowano z ❤️ dla polskich sprzedawców e-commerce**
