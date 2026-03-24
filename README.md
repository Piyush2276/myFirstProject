# 🏢 Employee Management System — SAP CAP Backend

An enterprise-grade HR backend built with **SAP Cloud Application Programming Model (CAP)**,
deployed on **SAP Business Technology Platform (BTP)** using **HANA Cloud** as the database
and **XSUAA** for role-based authentication and authorization.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | SAP CAP (Node.js) |
| Database | SAP HANA Cloud |
| Authentication | XSUAA (OAuth2 / JWT) |
| API Protocol | OData V4 |
| Deployment | SAP BTP – Cloud Foundry |
| Tooling | SAP Business Application Studio, VS Code |

---

## 📐 Data Model

The schema is built using **CDS (Core Data Services)** with `cuid` and `managed` mixins
for auto-generated IDs and audit fields (createdAt, modifiedBy, etc.).
```
Divisions
  └── Departments (Composition)
        └── Employees (Association)
              ├── Address (Composition of one)
              ├── Manager (Self-association)
              └── ProjectEmployee (Many-to-Many link)
                        └── Projects
```

### Entities

#### `Divisions`
Top-level organizational unit.  
Has a **Composition** of many `Departments` — departments cannot exist without a division.

#### `Departments`
Belongs to a `Division`.  
Associated to many `Employees`.

#### `Employees`
Core entity of the system.  
- Self-referencing `manager` association (Employee → Employee)
- Belongs to a `Department` and a `Division`
- Has a **Composition of one** `Address` (address lifecycle tied to employee)
- Linked to `Projects` via the `ProjectEmployee` junction entity

#### `Address`
Stores city and state.  
Modeled as a **Composition of one** inside `Employees` — deleted automatically when the employee is deleted.

#### `Projects`
Linked to a `Department`, `Division`, and a managing `Employee`.  
Connected to employees via `ProjectEmployee`.

#### `ProjectEmployee` *(Many-to-Many Junction)*
Resolves the many-to-many relationship between `Employees` and `Projects`.  
Uses composite primary keys (`project_ID` + `employee_ID`).

---

## 🔐 Security — XSUAA Integration

Authentication and authorization are handled via **XSUAA** (SAP's OAuth2-based security service).

- Roles defined in `xs-security.json`
- Role collections mapped to scopes (e.g., `Employee.Read`, `Employee.Write`, `Admin`)
- All OData service endpoints protected — unauthenticated requests are rejected
- JWT token validated on every request via the XSUAA middleware

---

## 🌐 OData V4 Services

All entities are exposed as **OData V4** services via CAP's built-in service layer.

| Operation | Endpoint Example |
|---|---|
| List Employees | `GET /odata/v4/hr/Employees` |
| Get with Expand | `GET /odata/v4/hr/Employees?$expand=address,project` |
| Create Employee | `POST /odata/v4/hr/Employees` |
| Update Employee | `PATCH /odata/v4/hr/Employees(guid'...')` |
| Delete Employee | `DELETE /odata/v4/hr/Employees(guid'...')` |

> Nested compositions like `Address` are managed automatically by CAP — no separate API call needed.

---

## 📁 Project Structure
```
employee-management/
├── db/
│   └── schema.cds          # All CDS entity definitions
├── srv/
│   ├── hr-service.cds      # Service exposure & restrictions
│   └── hr-service.js       # Custom handlers (actions/functions)
├── xs-security.json         # XSUAA role scopes definition
├── mta.yaml                 # BTP multi-target deployment config
├── package.json
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- `@sap/cds-dk` installed globally → `npm install -g @sap/cds-dk`
- SAP BTP account (for HANA Cloud & XSUAA binding)

### Run Locally (with SQLite for dev)
```bash
git clone https://github.com/Piyush2276/employee-management
cd employee-management
npm install
cds deploy --to sqlite    # creates a local SQLite DB
cds run                   # starts the server at http://localhost:4004
```

> 💡 XSUAA is bypassed in local mode. Full auth is active only on BTP deployment.

---

## ☁️ BTP Deployment
```bash
# Login to Cloud Foundry
cf login -a https://api.cf.<region>.hana.ondemand.com

# Build and deploy using MTA
mbt build
cf deploy mta_archives/<your-mta>.mtar
```

Services bound on BTP:
- `hana` — HANA Cloud HDI container
- `xsuaa` — Authentication & authorization service
- `destination` (optional) — For external service integration

---

## 📝 Key CAP Concepts Demonstrated

- ✅ `cuid` and `managed` aspect mixins
- ✅ **Composition** vs **Association** — correctly used for lifecycle control
- ✅ **Self-referencing association** (Employee → Manager)
- ✅ **Many-to-Many** via explicit junction entity (`ProjectEmployee`)
- ✅ **Composition of one** for Address (auto-managed lifecycle)
- ✅ OData V4 CRUD with deep insert/update
- ✅ XSUAA role-based access control
- ✅ HANA Cloud as production DB (note: `on delete set null` is HANA-only behavior)

---

## 👤 Author

**Piyush Kumar**  
SAP BTP Backend Developer  
📧 piyush2582002@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/piyush-kumar-267367229) | [GitHub](https://github.com/Piyush2276)
