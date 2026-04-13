import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { FolderOpen, Calendar, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.png`;
    link.click();
    toast.success("Download started!");
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading your projects...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-zinc-400">Manage and edit your AI creations</p>
        </div>
        <Button variant="outline" className="border-zinc-800">
          <FolderOpen className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
          <FolderOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-zinc-400">No projects yet</h3>
          <p className="text-zinc-500">Start creating to see your projects here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => handleDownload(project.imageUrl, project.title)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-zinc-700 text-zinc-400">
                      {project.type}
                    </Badge>
                    <div className="flex items-center text-[10px] text-zinc-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                    </div>
                  </div>
                  <CardTitle className="text-sm truncate">{project.title}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
