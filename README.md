# 💸 ExpenseSync

A full-stack expense management platform for tracking shared expenses, balances, and settlements across groups.

---

## 🚀 Features

* Secure authentication with Supabase
* Group creation and member management
* Shared expense tracking
* Automatic balance calculation
* Minimal settlement generation
* Partial settlement support
* Redis caching & rate limiting
* Production-ready deployment
* Responsive modern UI

---

## 🛠 Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Frontend         | React, TypeScript, Tailwind CSS |
| State Management | TanStack Query, Context API     |
| Backend          | Node.js, Express, TypeScript    |
| Database         | PostgreSQL                      |
| ORM              | Prisma                          |
| Cache            | Redis                           |
| Authentication   | Supabase                        |
| Email            | Resend                          |
| Deployment       | Vercel, Render                  |

---

## 🏗 Architecture

ExpenseSync follows a layered architecture:

* React frontend for UI and state management
* Express API for business logic
* Prisma ORM for database access
* PostgreSQL for persistence
* Redis for caching and rate limiting
* Supabase for authentication

---

## 🗄 Database Design

Core entities:

* Users
* Groups
* MembersOnGroups
* Expenses
* ExpenseSplits
* Settlements

The normalized schema ensures consistency, scalability, and accurate settlement calculations.

---

## 🧮 Settlement Logic

ExpenseSync calculates net balances and generates minimal transactions required to settle debts between group members.

Example:

* Total Expense: ₹6000
* Members: 4
* Share Per Member: ₹1500

Generated settlements:

* Neha → Amit ₹1500
* Priya → Amit ₹1000
* Priya → Rahul ₹500

---

## 🚀 Deployment

| Service  | Platform |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Render   |
| Cache    | Redis    |
| Email    | Resend   |

---

## 💡 Highlights

* Normalized relational database
* Minimal settlement algorithm
* Redis caching layer
* Secure authentication
* Partial settlement tracking
* Production-ready architecture

---

## 👨‍💻 Author

**Pankaj Bishnoi**

Full Stack Developer

⭐ If you found this project useful, consider giving it a star.
