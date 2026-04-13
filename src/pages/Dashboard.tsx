import { useAuth } from '../lib/auth-context';
import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Image as ImageIcon, 
  Gamepad2, 
  UserCircle2, 
  Share2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const modes = [
    {
      id: 'social',
      title: 'Social Media',
      description: 'Posts, captions & hashtags',
      icon: Share2,
      color: 'bg-blue-500/10 text-blue-500',
      path: '/create?mode=social'
    },
    {
      id: 'product',
      title: 'Product Shoot',
      description: 'Studio-style product images',
      icon: ImageIcon,
      color: 'bg-purple-500/10 text-purple-500',
      path: '/create?mode=product'
    },
    {
      id: 'gaming',
      title: 'Gaming Thumbnail',
      description: 'Epic YouTube thumbnails',
      icon: Gamepad2,
      color: 'bg-red-500/10 text-red-500',
      path: '/create?mode=gaming'
    },
    {
      id: 'avatar',
      title: 'AI Avatar',
      description: 'Anime, gaming & pro styles',
      icon: UserCircle2,
      color: 'bg-emerald-500/10 text-emerald-500',
      path: '/create?mode=avatar'
    }
  ];

  const suggestions = [
    { title: 'Diwali Special Ads', category: 'Festival', trend: 'High' },
    { title: 'Minimalist Skincare', category: 'Business', trend: 'Rising' },
    { title: 'Cyberpunk Gaming', category: 'Gaming', trend: 'Viral' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <header className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          Namaste, {profile?.displayName?.split(' ')[0]}! ✨
        </motion.h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">What are we creating today?</p>
      </header>

      {/* Quick Stats / Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Trending Topic
            </CardDescription>
            <CardTitle className="text-xl text-zinc-900 dark:text-white">Summer Skincare Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Suggested for your Business profile</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Calendar className="w-4 h-4 text-blue-500" />
              Best Time to Post
            </CardDescription>
            <CardTitle className="text-xl text-zinc-900 dark:text-white">Today, 7:30 PM</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Based on Instagram engagement</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Zap className="w-4 h-4 text-yellow-500" />
              Daily Credits
            </CardDescription>
            <CardTitle className="text-xl text-zinc-900 dark:text-white">{5 - (profile?.dailyGenerations || 0)} / 5 Left</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-xs text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400">
              Upgrade to Premium for Unlimited
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Creation Modes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Creation Modes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode, idx) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer group h-full shadow-sm hover:shadow-md"
                onClick={() => navigate(mode.path)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode.color}`}>
                    <mode.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{mode.title}</CardTitle>
                  <CardDescription className="text-zinc-500 dark:text-zinc-400">{mode.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Smart Suggestions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Smart Suggestions</h2>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <div key={s.title} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{s.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.category}</p>
              </div>
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {s.trend}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
