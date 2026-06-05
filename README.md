<!-- ========================== INTRODUCTION ========================== -->

<h1 align="center">💸 ExpenseSync</h1>

<p align="center">
  <strong>A production-ready full-stack expense management platform for shared group spending</strong>
</p>

<p align="center">
  ExpenseSync simplifies shared group expenses, tracks individual balances, and computes minimal settlements automatically.  
  Unlike typical tutorial clones, it features a **robust backend, normalized relational DB schema, caching, and monitoring** for real-world scalability.
</p>

<hr/>

<!-- ========================== SCREENSHOTS ========================== -->

<h2>📸 Screenshots</h2>

<p align="center">
  <img src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-13%20224811.png" alt="Dashboard View" width="45%" />
  <img src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-13%20224901.png" alt="Group Overview" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-13%20224933.png" alt="Expense List" width="45%" />
  <img src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-13%20225055.png" alt="Settlement View" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-13%20225116.png" alt="Expense Details" width="60%" />
</p>

---

<!-- ========================== TECH STACK ========================== -->

<h2>🛠️ Tech Stack</h2>

<table>
  <thead>
    <tr>
      <th align="left">Layer</th>
      <th align="left">Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Sonner</td>
    </tr>
    <tr>
      <td><strong>State Management</strong></td>
      <td>TanStack Query, Context API</td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>Node.js, Express, TypeScript</td>
    </tr>
    <tr>
      <td><strong>ORM</strong></td>
      <td>Prisma</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>PostgreSQL (Normalized schema)</td>
    </tr>
    <tr>
      <td><strong>Cache</strong></td>
      <td>Redis (Caching & Rate-limiting)</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td>Supabase (OAuth / Email, no passwords stored locally)</td>
    </tr>
    <tr>
      <td><strong>Email Service</strong></td>
      <td>Resend (Transactional emails)</td>
    </tr>
    <tr>
      <td><strong>Monitoring</strong></td>
      <td>UptimeRobot (API uptime)</td>
    </tr>
    <tr>
      <td><strong>Deployment</strong></td>
      <td>Vercel (Frontend), Render (Backend)</td>
    </tr>
  </tbody>
</table>

---

<!-- ========================== CORE FEATURES ========================== -->

<h2>✨ Core Features</h2>

<table>
  <thead>
    <tr>
      <th align="left">Feature</th>
      <th align="left">Description</th>
      <th align="center">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>User Authentication</strong></td>
      <td>Secure login via Supabase OAuth & email; fully protected API routes; no passwords stored locally</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Group Management</strong></td>
      <td>Create/manage groups, enforce access control, track membership history</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Expense Tracking</strong></td>
      <td>Add expenses with precise per-user splits, floating-point accuracy, and categories</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Settlement Engine</strong></td>
      <td>Automatic minimal settlement computation; supports partial settlements & history tracking</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Security & Validation</strong></td>
      <td>Input validation, sanitization, rate-limiting; prevents abuse & ensures data consistency</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><strong>Production Deployment</strong></td>
      <td>Frontend & backend deployed with environment-based configs; caching & monitoring enabled</td>
      <td align="center">✅</td>
    </tr>
  </tbody>
</table>

---

<!-- ========================== SYSTEM ARCHITECTURE ========================== -->

<h2>🏗️ System Architecture</h2>

<p align="center">
  <img 
    src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202026-01-09%20054225.png" 
    alt="ExpenseSync System Architecture Diagram"
    width="85%"
  />
</p>

<ul>
  <li>
    <strong>Frontend (Client):</strong> React + TypeScript application responsible for UI rendering, routing, and server-state management using TanStack Query. The client authenticates users via Supabase Auth and sends authenticated API requests to the backend.
  </li>

  <li>
    <strong>Backend (Server):</strong> Express + TypeScript server that processes incoming requests through a layered architecture consisting of middleware, controllers, and services.
  </li>

  <li>
    <strong>Middleware Layer:</strong> Performs request validation, input sanitization, HTTP parameter pollution prevention, and authentication checks before forwarding requests to controllers.
  </li>

  <li>
    <strong>Controller Layer:</strong> Acts as the routing layer, delegating requests to domain-specific services such as Group, Expense, Settlement, Profile, and Dashboard.
  </li>

  <li>
    <strong>Service Layer:</strong> Contains core business logic including expense calculations, balance aggregation, settlement generation, and group management. Services interact with Redis for caching and PostgreSQL for persistent storage.
  </li>

  <li>
    <strong>Cache & Rate Limiting:</strong> Redis is used for caching frequently accessed data and enforcing rate limits. On cache HIT, data is returned directly; on cache MISS, data is fetched from PostgreSQL and cached. Cache invalidation is handled on write operations.
  </li>

  <li>
    <strong>Database:</strong> PostgreSQL accessed via Prisma ORM, using a normalized relational schema for users, groups, members, expenses, expense splits, and settlements.
  </li>

  <li>
    <strong>Authentication Service:</strong> Supabase acts as an external identity provider, handling user authentication and token issuance, while the backend verifies tokens and enforces authorization rules.
  </li>

  <li>
    <strong>Email Service:</strong> Resend is used for sending transactional emails such as group invitation links. Email sending is triggered from the service layer as an external, asynchronous operation.
  </li>

  <li>
    <strong>Monitoring:</strong> UptimeRobot is used to monitor backend API availability and uptime in production.
  </li>
</ul>


---

<!-- ========================== DATABASE DESIGN ========================== -->

<h2>🗄️ Database Design</h2>

<p align="center">
  <img 
    src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-16%20004008.png" 
    alt="ExpenseSync Database ER Diagram"
    width="90%"
  />
</p>

<ul>
  <li><strong>Users:</strong> Central entity storing user info.</li>
  <li><strong>Groups:</strong> Represents shared expense groups.</li>
  <li><strong>MembersOnGroups:</strong> Many-to-many relationship preserving membership history.</li>
  <li><strong>Expenses:</strong> Core expense records including payer, amount, category, and time.</li>
  <li><strong>ExpenseSplit:</strong> Stores per-member expense splits.</li>
  <li><strong>Settlements:</strong> Tracks transactions that settle debts between members.</li>
</ul>

<p>This normalized structure ensures **accuracy, consistency, and scalable settlement computation**.</p>

---

<!-- ========================== SETTLEMENT LOGIC ========================== -->

<h2>🧮 Settlement Logic</h2>

<p>
ExpenseSync converts all group expenses into clear balances and computes **minimal transactions** to settle debts.
</p>

<h4>Example Workflow</h4>

<p>
Group: <strong>Amit, Rahul, Neha, Priya</strong>.  
Expenses: Amit ₹4000 (hotel), Rahul ₹2000 (food), Neha & Priya ₹0.
</p>

<h4>Step 1: Compute Total Shares</h4>
<p>Total spent: ₹6000 → Each member’s share = ₹1500</p>

<h4>Step 2: Net Balances</h4>
<ul>
  <li>Amit: +₹2500 (creditor)</li>
  <li>Rahul: +₹500 (creditor)</li>
  <li>Neha: −₹1500 (debtor)</li>
  <li>Priya: −₹1500 (debtor)</li>
</ul>

<h4>Step 3: Generate Minimal Settlements</h4>
<ul>
  <li>Neha pays Amit ₹1500</li>
  <li>Priya pays Amit ₹1000</li>
  <li>Priya pays Rahul ₹500</li>
</ul>

<p>✅ All balances zeroed. Supports **arbitrary splits, floating-point precision, and partial settlements**.</p>

<p align="center">
  <img
    src="https://github.com/100NikhilBro/ExpenseSync/blob/main/Screenshot%202025-12-14%20001630.png"
    alt="Settlement Logic Example"
    width="90%"
  />
</p>

---

<!-- ========================== DEPLOYMENT & MONITORING ========================== -->

<h2>🚀 Deployment & Monitoring</h2>

<ul>
  <li><strong>Frontend:</strong> Vercel — React + TypeScript application with environment-based configs</li>
  <li><strong>Backend:</strong> Render — Express API with production settings & environment variables</li>
  <li><strong>Monitoring:</strong> UptimeRobot (API availability), Redis caching for fast responses</li>
</ul>

---

<!-- ========================== WHY IT'S ADVANCED ========================== -->

<h2>💡 Why ExpenseSync is Advanced</h2>

<ul>
  <li>Normalized relational database ensures data consistency and prevents duplication</li>
  <li>Greedy settlement algorithm minimizes number of transactions</li>
  <li>Supports partial settlements and maintains historical data</li>
  <li>Redis caching & rate-limiting enhance performance and security</li>
  <li>Supabase handles authentication; backend never stores passwords</li>
  <li>Production-ready deployment & monitoring included out-of-the-box</li>
</ul>

---

<p align="center">Made with ❤️ by <strong>Nikhil Gupta</strong></p>
