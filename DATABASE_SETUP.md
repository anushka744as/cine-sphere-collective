# 🎬 CineSphere Database Setup Guide

This guide will help you set up the complete database schema for CineSphere.

## 📋 Prerequisites

- Supabase project created
- Supabase project URL and anon key configured in your `.env` file

## 🚀 Quick Setup

### Step 1: Run the Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into a new query
5. Click **Run** (or press Ctrl+Enter)

This will create:
- ✅ `profiles` table (with role field)
- ✅ `movies` table
- ✅ `custom_categories` table
- ✅ `custom_genres` table
- ✅ All necessary indexes
- ✅ All RLS policies
- ✅ Automatic profile creation trigger
- ✅ Helper functions

### Step 2: Create Your First Admin User

1. **Sign up** through your application's signup page
2. After signing up, go to Supabase SQL Editor
3. Run this query to make yourself an admin:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

Replace `your-email@example.com` with your actual email.

### Step 3: Verify Setup

Run this query to verify everything is working:

```sql
-- Check your profile
SELECT * FROM public.profiles WHERE role = 'admin';

-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

## 📊 Database Schema Overview

### Tables

#### `profiles`
Stores user information and roles (consolidated table).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | User ID (references auth.users) |
| username | text | Unique username |
| full_name | text | User's full name |
| avatar_url | text | Profile picture URL |
| **role** | text | User role ('user' or 'admin') |
| bio | text | User bio |
| created_at | timestamp | Account creation time |
| updated_at | timestamp | Last update time |

#### `movies`
Stores all film submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique film ID |
| title | text | Film title |
| description | text | Film description |
| youtube_url | text | YouTube video URL |
| thumbnail_url | text | Extracted thumbnail URL |
| category | text | Film category |
| genre | text | Film genre |
| duration | text | Video duration |
| views | integer | View count (database managed) |
| status | text | 'pending', 'approved', or 'rejected' |
| uploaded_by | uuid | User ID who uploaded |
| created_at | timestamp | Upload time |
| updated_at | timestamp | Last update time |

#### `custom_categories`
User-submitted custom categories.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Category ID |
| name | text | Category name (unique) |
| created_by | uuid | User who created it |
| usage_count | integer | Times used |
| created_at | timestamp | Creation time |

#### `custom_genres`
User-submitted custom genres.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Genre ID |
| name | text | Genre name (unique) |
| created_by | uuid | User who created it |
| usage_count | integer | Times used |
| created_at | timestamp | Creation time |

## 🔒 Security (RLS Policies)

### Profiles
- ✅ Everyone can view profiles
- ✅ Users can insert their own profile
- ✅ Users can update their own profile

### Movies
- ✅ Everyone can view approved movies
- ✅ Users can view their own movies (any status)
- ✅ Admins can view all movies
- ✅ Authenticated users can submit movies
- ✅ Users can update/delete their own movies
- ✅ Admins can update/delete any movie

### Custom Categories & Genres
- ✅ Everyone can view
- ✅ Authenticated users can add new ones
- ✅ Admins can update/delete

## 🔧 Useful Functions

### Check if user is admin
```sql
SELECT public.is_admin('user-uuid-here');
```

### Increment movie views
```sql
SELECT public.increment_movie_views('movie-uuid-here');
```

## 🎯 Important Notes

### About Views Count
- Views are stored in the database
- To fetch real-time views from YouTube, you would need:
  - YouTube Data API v3 key
  - Server-side integration
  - Rate limit handling
- Current implementation uses database view counter

### About YouTube Metadata
- **Thumbnails**: Auto-extracted in frontend from YouTube URL
- **Duration**: Would require YouTube API for automatic fetching
- **Real Views**: Would require YouTube API for real-time data

### Making More Admins
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

## 🔄 Resetting Database

If you need to reset everything:

1. Delete all data:
```sql
TRUNCATE public.movies CASCADE;
TRUNCATE public.custom_categories CASCADE;
TRUNCATE public.custom_genres CASCADE;
TRUNCATE public.profiles CASCADE;
```

2. Or drop and recreate tables by running the full `schema.sql` again.

## ✅ Verification Checklist

After setup, verify:

- [ ] Can sign up new user
- [ ] Profile is created automatically on signup
- [ ] Admin user can access admin dashboard
- [ ] Users can submit films
- [ ] Thumbnails are extracted from YouTube URLs
- [ ] Custom categories/genres can be added
- [ ] RLS policies are working (users can't see pending films from others)

## 🆘 Troubleshooting

### Profile not created on signup
1. Check if trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Manually create profile:
```sql
INSERT INTO public.profiles (id, username, role)
VALUES (
  'user-uuid-from-auth-users',
  'username',
  'user'
);
```

### Can't access admin features
Check your role:
```sql
SELECT id, email, role FROM public.profiles 
JOIN auth.users ON profiles.id = users.id 
WHERE email = 'your-email@example.com';
```

### Movies not showing
Check RLS policies are enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard > Logs
2. Verify RLS policies are enabled
3. Ensure trigger is active
4. Check that your user has the correct role

---

**Happy filming! 🎥✨**

