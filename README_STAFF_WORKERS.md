OWNER + WORKER PANEL SETUP

Hidden staff links:
- Owner:  /#owner-login
- Worker: /#worker-login
- Footer: Team → Owner / Worker
- Shortcuts: CTRL + ALT + O / CTRL + ALT + W

Initial credentials after you create Supabase Auth users:
Owner username: owner
Owner email: owner@arushagrandsafarihotel.com
Owner password: 1234567890

Worker username: worker
Worker email: worker@arushagrandsafarihotel.com
Worker password: 123456789

Supabase steps:
1. Open Supabase Project → SQL Editor.
2. Run the updated SUPABASE_SETUP.sql.
3. Go to Authentication → Users → Add User.
4. Create the owner and worker users with the emails and passwords above.
5. Deploy the site.

Adding more workers:
1. Owner logs into /#owner-login.
2. Open Manage Workers & Permissions.
3. Add worker name, username, Gmail/email, phone, picture URL, and permissions.
4. Save.
5. In Supabase Authentication → Users, create a user with the SAME email and a password.
6. Worker can login using username or email.

Worker permissions owner can control:
- View reservations
- Receive orders/reservations
- Create bookings
- Change room reserved/available status
- Confirm payments

Note:
For security, the website does not store worker passwords inside the frontend. Passwords are handled by Supabase Auth. Password reset works by email after Supabase URL configuration is set.
