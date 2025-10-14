# 🎬 CineSphere - Free Documentary Showcase Platform

A modern, free platform for documentary creators to showcase their YouTube documentaries to a global audience.

## 🌟 Features

- **Free Forever**: No subscriptions, no fees, no hidden costs
- **YouTube Integration**: Easy sharing of your YouTube documentary links
- **Global Community**: Connect with documentary creators and viewers worldwide
- **Curated Collections**: Handpicked documentaries organized by themes
- **Category Filtering**: Browse by Nature, History, Science, Culture, and more
- **Beautiful UI**: Cinematic design with 3D animations and effects
- **Responsive Design**: Works perfectly on all devices
- **Admin Approval**: Quality control through content moderation

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Animations**: Framer Motion for smooth 3D effects
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **Deployment**: Ready for any hosting platform

## 📦 Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd cine-sphere-collective

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🗄️ Database Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor
4. Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## 👤 Creating an Admin User

After signing up:

1. Go to Supabase Dashboard → Authentication → Users
2. Copy your user UUID
3. Run in SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('YOUR_UUID_HERE', 'admin');
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Key Features

### For Creators
- Submit YouTube documentary links
- Track view counts
- Get featured in curated collections
- No fees or subscriptions

### For Viewers
- Discover documentaries from around the world
- Browse by category
- Watch curated collections
- Free access to all content

### For Admins
- Approve/reject submissions
- Manage content quality
- Create curated collections
- User role management

## 🏗️ Project Structure

```
cine-sphere-collective/
├── public/
│   ├── videos/           # Hero section video
│   └── images/           # Static images
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn UI components
│   │   ├── Hero.tsx     # Hero section with video
│   │   ├── Navbar.tsx   # Navigation
│   │   └── VideoCard.tsx # Documentary card
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Home page
│   │   ├── Browse.tsx   # Browse documentaries
│   │   ├── Curated.tsx  # Curated collections
│   │   ├── Movies.tsx   # All documentaries
│   │   ├── About.tsx    # About page
│   │   └── Dashboard.tsx # Admin/User dashboard
│   ├── integrations/
│   │   └── supabase/    # Supabase client & types
│   └── hooks/           # Custom React hooks
├── supabase/
│   └── schema.sql       # Complete database schema
└── index.html           # Entry HTML file
```

## 🌐 Deployment

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Your Own Server
```bash
npm run build
# Serve the dist/ folder with any static file server
```

## 🔐 Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Support

For support, please open an issue in the repository.

---

**Built with ❤️ for documentary creators worldwide**
