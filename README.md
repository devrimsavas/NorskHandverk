# NorskHandverk E-Commerce

> ⚠️ **Under active development** — core features are functional, but additional modules and security enhancements are being implemented.

A modern, full-stack e-commerce solution built with **.NET 9** and **Next.js**, featuring a robust Stripe payment integration and a PostgreSQL database.

## 🚀 Key Features

- **Idempotent Checkout Flow** — prevents duplicate orders and redundant Stripe PaymentIntents by looking up the existing order's `PaymentIntentId` and reusing the intent instead of creating a new one for a pending order
- **Stripe Integration** — full payment lifecycle management using the Stripe .NET SDK, Stripe Webhooks (handling `payment_intent.succeeded`), and the Stripe React SDK on the frontend
- **Dynamic Cart System** — real-time cart management with status transitions (active, checkedOut, abandoned)
- **Relational Data Modeling** — structured PostgreSQL schema for Customers, Carts, Orders, and Transactions
- **Service-layer architecture** — business logic separated behind interfaces (`IOrderService`, `IPaymentService`), injected via DI, rather than living directly in controllers
- **Modern Frontend** — responsive UI built with Next.js, Tailwind CSS 4, and TypeScript
- **Swagger/OpenAPI** — interactive API documentation via Swashbuckle

## 🛠 Tech Stack

### Backend
- Framework: **.NET 9** Web API
- Database: **PostgreSQL** with Entity Framework Core (via Npgsql)
- Payments: **Stripe.net** SDK
- Mapping: AutoMapper
- API Docs: Swashbuckle (Swagger)

### Frontend
- Framework: **Next.js 16** (App Router)
- UI Library: **React 19**
- Styling: Tailwind CSS 4
- Payments: `@stripe/react-stripe-js`, `@stripe/stripe-js`
- State Management: React Hooks & Context API

## 📂 Project Structure

```
NorskHandverk/
├── NorskHandverk/              # .NET 9 Web API
│   ├── Controllers/
│   │   ├── BrandController/
│   │   ├── CartController/
│   │   ├── CategoryController/
│   │   ├── CustomerController/
│   │   ├── OrderController/     # Checkout, idempotent PaymentIntent handling, webhooks
│   │   └── ProductController/
│   ├── Models/
│   │   ├── CartModels/
│   │   ├── CustomerModels/
│   │   ├── OrderModels/
│   │   ├── ProductModels/
│   │   └── TransactionModels/
│   ├── Services/
│   │   ├── IOrderService.cs / OrderService.cs
│   │   └── IPaymentService.cs / StripeService.cs
│   ├── DTOs/
│   ├── Mappings/                # AutoMapper profiles
│   └── Migrations/
└── FrontEnd/
    └── norskhandelfe/            # Next.js 16 app
        ├── app/
        ├── components/
        ├── modules/
        └── lib/
```

## ▶️ Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- PostgreSQL
- Stripe CLI (for local webhook testing)

### 1. Clone the repository
```bash
git clone https://github.com/devrimsavas/NorskHandverk.git
```

### 2. Configure the backend
Create an `appsettings.json` in the API project (see `AppSetting_Example.txt` for the template), with your PostgreSQL connection string and Stripe API keys.

### 3. Run the backend
```bash
dotnet ef database update
dotnet run
```
Swagger UI will be available at `https://localhost:<port>/swagger`.

### 4. Run the frontend
```bash
cd FrontEnd/norskhandelfe
npm install
npm run dev
```

### 5. Listen for Stripe webhooks (local development)
```bash
stripe listen --forward-to https://localhost:7140/api/order/webhook
```

## 📝 Notes

This project is actively evolving — the checkout and payment flow (the most complex part) is functional and tested against Stripe's test mode, while additional modules (broader catalog management, security hardening) are still being built out.
