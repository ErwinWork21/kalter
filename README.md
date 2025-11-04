# Kalkulator Dokter

A web application for doctors to calculate Indonesian income tax (PPh21) based on monthly income from multiple hospitals. The application helps doctors track their income, calculate tax obligations, and manage their tax records throughout the year.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Monthly Income Input**: Track income from multiple hospitals and sources per month
- **Tax Calculation**: Automatic PPh21 calculation based on Indonesian tax regulations
- **Dashboard**: Visual overview with charts showing monthly income and tax estimates
- **History**: View and manage saved calculation records
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Navigation
- **Supabase** - Authentication and database
- **TanStack Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kalkulator-dokter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Connect to Supabase

#### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Choose a name for your project (e.g., "kalkulator-dokter")
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Select the region closest to your users
5. Click "Create new project" and wait for it to be set up (this may take a few minutes)

#### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in the sidebar)
2. Click on **API** in the settings menu
3. You'll find two important values:
   - **Project URL**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: Your public anonymous key (starts with `eyJ...`)

#### Step 3: Create the Database Table

1. In your Supabase project, go to **SQL Editor** in the sidebar
2. Click "New query"
3. Run the following SQL to create the `calculations` table:

```sql
CREATE TABLE IF NOT EXISTS calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view their own calculations"
  ON calculations FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own calculations"
  ON calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own calculations"
  ON calculations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own data
CREATE POLICY "Users can delete their own calculations"
  ON calculations FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" to execute the query

#### Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of your project:

```bash
touch .env
```

2. Add your Supabase credentials to the `.env` file:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from Step 2.

**Important**: Never commit the `.env` file to version control. It's already in `.gitignore` by default.

#### Step 5: Enable Email Authentication (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates if needed (under **Authentication** → **Email Templates**)

### 4. Run the Application Locally

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Step 1: Prepare Your Project

1. Ensure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Make sure your `.env` file is **not** committed (it should be in `.gitignore`)

### Step 2: Create a Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account for easy integration)

### Step 3: Import Your Project

1. Click **"Add New..."** → **"Project"** in your Vercel dashboard
2. Import your Git repository:
   - If using GitHub, click **"Import Git Repository"**
   - Select your repository from the list
   - Click **"Import"**

### Step 4: Configure Build Settings

Vercel should auto-detect React projects, but verify these settings:

- **Framework Preset**: Create React App
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 5: Add Environment Variables

1. In the project configuration page, scroll down to **"Environment Variables"**
2. Click **"Add"** and add each variable:
   - **Name**: `REACT_APP_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Production, Preview, and Development (select all)
3. Click **"Add"** again for the second variable:
   - **Name**: `REACT_APP_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - **Environment**: Production, Preview, and Development (select all)

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like `https://your-project.vercel.app`
4. Your application is now live!

### Step 7: Update Supabase URL Settings (Optional)

If you want to restrict your Supabase API to only your Vercel domain:

1. Go to your Supabase project → **Settings** → **API**
2. Under **"URL Configuration"**, add your Vercel domain to the allowed URLs
3. This helps secure your API

## Post-Deployment

### Custom Domain (Optional)

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

### Monitoring

- Check **Analytics** in Vercel dashboard for traffic insights
- Monitor **Logs** for any runtime errors
- Set up **Alerts** for build failures

## Troubleshooting

### Build Fails on Vercel

- Ensure all environment variables are set correctly
- Check that `REACT_APP_` prefix is used for all React environment variables
- Verify your Supabase URL and key are correct

### Authentication Not Working

- Verify Supabase credentials in environment variables
- Check Supabase dashboard → Authentication → Providers are enabled
- Ensure RLS (Row Level Security) policies are correctly set

### Database Errors

- Verify the `calculations` table was created successfully
- Check RLS policies allow users to access their own data
- Review Supabase logs for detailed error messages

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Support

For issues or questions, please open an issue in the repository.
