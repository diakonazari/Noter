Noter is a note-taking web application created as a midterm project for the UBC × CircuitStream Software Development Bootcamp. It provides authenticated, private spaces for users to create, read, update, and delete personal notes.

Overview

Purpose: Personal note management with individual user accounts and private data storage.

Status: Runs locally (localhost) and is not deployed.

Technologies: EJS, JavaScript, Bootstrap, MongoDB, and CSS.

Core Features
User Accounts & Access

Sign Up: Create an account using a unique email address.

Email Uniqueness: If an email already exists in the database, sign-up is blocked and the user is sent to a dedicated duplicate user page.

Log In: Existing users authenticate and access their notes.

Authentication & Authorization (Stateless)

Passport (no sessions): Authentication is implemented with Passport without server-side sessions.

Token in Cookie: On successful login, an authentication token is issued and stored in a browser cookie. This token is required to authorize note actions.

Sign Out: Logging out clears the authentication cookie, removing access to protected actions until the user logs in again.

Notes (CRUD)

Create: Add new notes after authentication.

Read: View notes associated with your account.

Update: Edit existing notes.

Delete: Remove notes you no longer need.

Data Isolation

Per-User Space in MongoDB: Each user’s notes are stored in a private area linked to their account identity, so users can only access their own notes.

Interface

Templating & UI: EJS renders server-side views; Bootstrap and CSS provide a clean layout.

Entry Page: The first page offers two clear paths—Sign Up or Log In.

Typical User Flow

Open the App (localhost).
Land on the entry page offering Sign Up or Log In.

Sign Up (new users).
Provide a unique email. If the email already exists, you’ll be redirected to the duplicate user page.

Log In (returning users).
After a successful login, a cookie containing an auth token is set in your browser.

Manage Notes.
While authenticated, create new notes, read existing ones, edit content, and delete when needed.

Sign Out.
End access by clearing the auth cookie; note actions are no longer authorized until you log in again.

Security & Privacy

Authentication: Passport (stateless) issues a token that is stored in a cookie after login.

Authorization: Protected note actions require a valid token from the cookie.

Data Privacy: Notes are segregated per user in MongoDB to prevent cross-user access.

Known Limitations

Local Only: The application is not deployed; it runs on localhost.

Single Identifier: Email is the unique identifier for accounts; attempts to reuse an existing email are blocked.

Token Dependence: Actions require a valid token in the cookie; clearing cookies or signing out removes access.

Project Context

Bootcamp: UBC × CircuitStream Software Development Bootcamp

Instruction: Delivered by CircuitStream instructors

Project Type: Midterm project
