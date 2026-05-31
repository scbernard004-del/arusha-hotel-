# Supabase owner and worker setup

## 1. Create Supabase project
Create a new Supabase project, then open **SQL Editor**.

## 2. Run the database SQL
Copy everything from `SUPABASE_SETUP.sql` and run it.

## 3. Create the two staff logins
Open **Authentication > Users > Add user** and create:

Owner:
```text
Email: owner@arushagrandsafarihotel.com
Password: 1234567890
```

Worker:
```text
Email: worker@arushagrandsafarihotel.com
Password: 123456789
```

The website login form uses these usernames:

```text
Owner username: owner
Owner password: 1234567890

Worker username: worker
Worker password: 123456789
```

## 4. Add staff profiles
After creating each user, copy their Supabase Auth User ID.
Then go back to SQL Editor and run the two `insert into public.staff_profiles...` lines at the bottom of `SUPABASE_SETUP.sql`, replacing the placeholder IDs.

## 5. Add environment variables locally
Create a file named `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
VITE_OWNER_EMAIL=owner@arushagrandsafarihotel.com
VITE_WORKER_EMAIL=worker@arushagrandsafarihotel.com
```

Find the Supabase URL and anon key in **Project Settings > API**.

## 6. Hidden login panel links
Customers will not see these links in the website menu.
Use them only for the hotel team:

```text
/#owner-login
/#worker-login
```

Owner panel:
- Edit rooms
- Edit prices
- Edit images
- Edit offers
- Edit availability
- Confirm paid bookings

Worker panel:
- Create bookings
- Receive customer orders/bookings
- View booking list

## 7. Password reset
Email reset is included through Supabase. On the login screen, enter the staff Gmail/email and click **Send Reset Link**.

Phone reset needs an SMS provider or WhatsApp Business API. The button explains this until you connect an SMS/WhatsApp provider.

## 8. Run locally
```bash
npm install --no-audit --no-fund
npm run dev
```

## 9. Add the same variables in Vercel
In Vercel project: **Settings > Environment Variables**

Add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OWNER_EMAIL`
- `VITE_WORKER_EMAIL`

Then redeploy.

## Important security note
The starting passwords are simple because you requested initial credentials. After the first successful login, change them in Supabase Authentication.


## Owner can edit website content

The owner panel now manages:
- Hotel name, tagline, address, phone, WhatsApp, email, footer text, and map/location text
- Room name, description, price, size, bed type, availability, offers, and image URL
- Add new rooms or remove old rooms
- Gallery pictures: add image URL, rename picture, or remove picture

After uploading this version, run the updated `SUPABASE_SETUP.sql` again in Supabase SQL Editor so the new `hotel_settings` and `gallery_images` tables are created.

Owner panel link: `/#owner-login`
Worker panel link: `/#worker-login`
