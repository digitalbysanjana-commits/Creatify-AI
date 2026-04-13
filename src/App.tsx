import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth-context';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  FolderOpen, 
  UserCircle, 
  Sparkles,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Pages
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';

const Templates = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-8">
    <header className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      <p className="text-zinc-400">Pre-built designs for every occasion</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {['Diwali Special', 'Product Launch', 'Gaming Banner', 'Holi Festival', 'Business Ad', 'YouTube Intro'].map((t) => (
        <div key={t} className="aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center group cursor-pointer hover:border-zinc-700 transition-all">
          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const Login = () => {
  const { signIn } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Creatify AI</h1>
          <p className="text-zinc-400">All-in-One Visual Content Generator</p>
        </div>
        <Button onClick={signIn} className="w-full h-12 text-lg bg-white text-black hover:bg-zinc-200">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const { updateProfile } = useAuth();
  const purposes = [
    { id: 'creator', label: 'Content Creator', icon: '📱' },
    { id: 'business', label: 'Business Owner', icon: '🛍️' },
    { id: 'gamer', label: 'Gamer', icon: '🎮' },
    { id: 'student', label: 'Student', icon: '🎓' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Welcome to Creatify AI</h2>
          <p className="text-zinc-400">What best describes you?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {purposes.map((p) => (
            <button
              key={p.id}
              onClick={() => updateProfile({ purpose: p.id as any })}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-white transition-all text-left group"
            >
              <span className="text-4xl mb-4 block">{p.icon}</span>
              <h3 className="text-xl font-semibold group-hover:text-white">{p.label}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: Library, label: 'Templates', path: '/templates' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight">Creatify AI</span>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between px-4">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Theme</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar>
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback>{profile?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.displayName}</p>
                <p className="text-xs text-zinc-500 truncate capitalize">{profile?.plan} Plan</p>
              </div>
              <button onClick={logout} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <Link to="/privacy" className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ShieldCheck className="w-3 h-3" />
              Privacy Policy
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 lg:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <span className="font-bold">Creatify AI</span>
          <div className="w-6" />
        </header>
        <ScrollArea className="flex-1">
          {children}
          <footer className="p-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
            <p>© 2026 Creatify AI. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-white">Privacy Policy</Link>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Terms of Service</a>
            </div>
          </footer>
        </ScrollArea>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-zinc-900 dark:text-white animate-pulse" />
    </div>
  );

  if (!user) return <Login />;
  if (!profile?.purpose) return <Onboarding />;

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="creatify-theme">
      <AuthProvider>
        <AppContent />
        <Toaster theme="dark" position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}
