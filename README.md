# Member Management System (Mini) - YV Intern Assessment

MERN application for managing membership applications, staff review, and chairman-controlled permissions.

## Tech Stack

- **Frontend:** React (vite), React Router, Axios
- **Backend:** Node.js, Express
- **Databse:** MongoDB (Mongoose)
- **Auth:** JWT bcrypt

## Project structure

/client- React frontend
/server-Express backend
.gitignore
README.md

## Setup Instructions

### 1.Backend 

```bash
 cd server
 npm install
 cp .env.example .env
 ```

`.env` your own values:
MONGO_URI=<connection string>
PORT=5000
JWT_SECRET=<your_secret_key>

Seed script (create the chairman account):

``bash
npm run seed
```
start the server:

```bash
npm run dev
```
### 2. Frontend

```bash
cd client
npm install
```
create` clinet/.env`:

VITE_API_URL="http://localhost:5000/api"

start the client:

```bash
npm run dev
```
### Chairman login (created by seed script)

chairman account is not created through normal registration - only via `npm run seed` , as required.

Email: chairman@yv.com
password: chairman123

## How it works

There are 4 roles : `MEMBER`, `OFFICER`,`CHAIRMAN` and Visitor(anyone logged in).

- Chairman always has full access - no permission
  keys are checked for
  the Chairman, the backend simply allows every action once it confirms
  role === "CHAIRMAN".

- Officer access depends on the permissions
  assigned to their role by
  the Chairman. Each Officer role holds a list of permission keys, e.g.
  application.view, application.approve, application.reject,
  member.view, role.manage, audit.view.

- Every protected backend route runs a 
  permission-check middleware
  before the actual controller logic. It looks at the logged-in user's
  role:
  1. If Chairman → allow immediately.
  2. If Officer → fetch their assigned role and check whether it includes
     the required permission key.
     - Present → request proceeds.
     - Missing → request is rejected with HTTP
       403 Forbidden.

- On the frontend, buttons for actions the 
  Officer isn't permitted to do
  are hidden based on their permissions array received at
  login. This is only a UX convenience — it does not provide security
  by itself. The actual protection is the backend 403 check, so even a
  direct API call (bypassing the UI) is blocked if the permission is
  missing.

## Database collections

Users - all accounts here to save
memberApplications - submit the applications
memberships - member created once they approved
membershipTypes - standard/corporate/premium
officerRoles - permissions keys
auditLogs - who did what when

## Compelted Features
- Register/Login/JWT auth,bcrypt password hashing
- member: submit application,view own application,view membership  number once approved
- officer/chairman: view applications (status filter + pagination)
- member list (search by name/email, role filter, pagination)
- chairman: create officer roles,assign permissions,assign roles to user
- audit logging for approve/reject/role changes/role assignment
- backend permission middleware(403 on missing permission) + frontend button hiding
- central error handler middleware

## known Issues
- Not fully finished. until all working

## Demo Video






