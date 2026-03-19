#  NorskHandverk E-Commerce

* ⚠️ UNDER DEVELOPMENT > This project is currently under active development. Core features are functional, but additional modules and security enhancements are being implemented.

A modern, full-stack e-commerce solution built with .NET 9 and Next.js 14, featuring a robust Stripe payment integration and a PostgreSQL database.

# Key Features
- Idempotent Checkout Flow: Prevents duplicate orders and redundant Stripe PaymentIntents by reusing existing intents for pending orders.

- Stripe Integration: Full payment lifecycle management using Stripe SDK and Webhooks.

- Dynamic Cart System: Real-time cart management with status transitions (active, checkedOut, abandoned).

- Relational Data Modeling: Structured PostgreSQL schema for Customers, Carts, Orders, and Transactions.

- Modern Frontend: Responsive UI built with Next.js, Tailwind CSS, and TypeScript.

# Tech Stack
## Backend 
- Framework: .NET 9 Web API

- Database: PostgreSQL with Entity Framework Core

- Payments: Stripe .NET SDK

- Mapping: AutoMapper

## Frontend
- Framework: Next.js 14 (App Router)

- Styling: Tailwind CSS

- State Management: React Hooks & Context API

# Getting Started 
## Prerequisites
- .NET 9 SDK

- Node.js 18+

- PostgreSQL

- Stripe CLI (for local webhook testing)

* 1 Clone the repository:
```bash 
git close https://github.com/devrimsavas/NorskHandverk
```
* 2 Configure Backend: 
Create an appsettings in the API project: (clue: see `AppSetting_Example.txt`)

* 3 Run Backend:
```bash 
dotnet ef database update 
dotnet run 
``` 
* 4 Run FrontEnd: 
```bash 
cd Frontend\norskhandelfe
npm install
npm run dev
```
* 5 Listen for Webhooks:
```bash
stripe listen --forward-to https://localhost:7140/api/order/webhook
```




