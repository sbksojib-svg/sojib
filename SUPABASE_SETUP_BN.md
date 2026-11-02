# Supabase Super Admin setup (বাংলা)

## গুরুত্বপূর্ণ অবস্থা
এই প্যাচে Super Admin-এর পাসওয়ার্ড যাচাই Supabase Auth-এ নেওয়া হয়েছে এবং `super_admins` allow-list দিয়ে আলাদা অনুমতি যাচাই হয়। তবে বর্তমান Student/Video/Payment API-গুলোর ডেটা এখনও `server/store.ts`-এর in-memory store-এ চলে। SQL migration-এ ভবিষ্যৎ ডেটা মাইগ্রেশনের টেবিল তৈরি করা হয়েছে, কিন্তু পুরোনো ডেটা স্বয়ংক্রিয়ভাবে Supabase-এ কপি বা CRUD API-গুলো Supabase-এ স্থানান্তর করা হয়নি। Vercel serverless-এ বর্তমান in-memory ডেটা স্থায়ী নয়—লাইভ চালানোর আগে পূর্ণ data migration আবশ্যক।

## ধাপ ১ — Supabase প্রজেক্ট
1. https://supabase.com/dashboard এ একটি Project তৈরি করুন।
2. Project Settings → API থেকে Project URL, anon/publishable key এবং service_role/secret key নিন। service role key কখনো frontend, GitHub বা ZIP-এর `.env`-এ commit করবেন না।
3. SQL Editor-এ `supabase/migrations/202611020001_secure_super_admin.sql`-এর সম্পূর্ণ SQL চালান।

## ধাপ ২ — প্রথম Super Admin
1. Authentication → Users → Add user থেকে নিজের ইমেইল দিয়ে user তৈরি করুন এবং শক্তিশালী password দিন। Email confirm করুন।
2. SQL Editor-এ নিচের query চালান; ইমেইলটি নিজের ইমেইল দিয়ে বদলান:

```sql
insert into public.super_admins (user_id, email)
select id, lower(email)
from auth.users
where lower(email) = lower('your-admin-email@example.com');
```

3. `ADMIN_EMAIL`-এ একই ইমেইল দিতে হবে। সাধারণ signup দিয়ে Super Admin role পাওয়া যাবে না।

## ধাপ ৩ — Vercel Environment Variables
Project → Settings → Environment Variables-এ যোগ করুন:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (শুধু server-side secret)
- `ADMIN_EMAIL`
- `SESSION_SECRET` (কমপক্ষে ৩২ অক্ষরের cryptographically random secret)
- `NODE_ENV=production`

`ADMIN_PASSWORD` আর ব্যবহার করা হয় না। পুরোনো Vercel environment variable থাকলে মুছে দিন। এরপর Redeploy করুন।

## ধাপ ৪ — সতর্কতা
- এই build-এ Admin login Supabase Auth ব্যবহার করে, কিন্তু অন্যান্য student/video/payment data endpoint এখনও in-memory। তাই এটি সম্পূর্ণ Supabase database migration নয়। পুরোনো সাইটের live data সংরক্ষণ ও স্থায়িত্বের জন্য পরবর্তী ধাপে সব CRUD route Supabase-এ migrate করতে হবে।
- Supabase SQL migration-এর টেবিলগুলোতে public write policy ইচ্ছাকৃতভাবে নেই। App-এর data access Supabase-এ স্থানান্তর ও পরীক্ষা না করা পর্যন্ত public access খুলবেন না।
- Admin login কাজ না করলে Supabase Auth user, `super_admins` row এবং Vercel environment variable মিলিয়ে দেখুন।
