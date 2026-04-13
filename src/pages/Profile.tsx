import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Settings, Shield, LogOut, CreditCard } from 'lucide-react';

export default function Profile() {
  const { profile, logout } = useAuth();

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-zinc-900 rounded-3xl border border-zinc-800">
        <Avatar className="w-24 h-24 border-4 border-zinc-800">
          <AvatarImage src={profile?.photoURL} />
          <AvatarFallback className="text-2xl">{profile?.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <h1 className="text-3xl font-bold">{profile?.displayName}</h1>
            {profile?.plan === 'premium' && (
              <Badge className="bg-yellow-500 text-black hover:bg-yellow-400">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-zinc-400">{profile?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 capitalize">
              {profile?.purpose}
            </Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
              {profile?.role === 'admin' ? 'Administrator' : 'Creator'}
            </Badge>
          </div>
        </div>
        <Button variant="outline" className="border-zinc-800" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Subscription Plan
            </CardTitle>
            <CardDescription>Manage your billing and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium capitalize">{profile?.plan} Plan</span>
                <span className="text-xs text-zinc-500">Active</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all" 
                  style={{ width: `${((profile?.dailyGenerations || 0) / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {profile?.dailyGenerations || 0} / 5 daily generations used
              </p>
            </div>
            {profile?.plan === 'free' && (
              <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-400" />
              Account Settings
            </CardTitle>
            <CardDescription>Personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
              Edit Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
              Notification Preferences
            </Button>
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
              Privacy Settings
            </Button>
            {profile?.role === 'admin' && (
              <Button variant="ghost" className="w-full justify-start text-emerald-500 hover:text-emerald-400 hover:bg-zinc-800">
                <Shield className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
