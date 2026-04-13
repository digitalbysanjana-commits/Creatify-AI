import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  ImageIcon, 
  Gamepad2, 
  UserCircle2, 
  Sparkles, 
  Download, 
  RefreshCw,
  Type as TypeIcon,
  Palette,
  Layout,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { generateSocialContent, generateImage, generateProductShoot, generateGamingThumbnail, generateAvatar } from '../lib/gemini';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/auth-context';

export default function Create() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const initialMode = searchParams.get('mode') || 'social';
  
  const [mode, setMode] = useState(initialMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Form States
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('minimal');
  const [platform, setPlatform] = useState('instagram');
  const [gameName, setGameName] = useState('');
  const [titleText, setTitleText] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [avatarStyle, setAvatarStyle] = useState('anime');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!profile) return;
    
    // Validation
    if (mode === 'social' && !topic) {
      toast.error("Please enter a topic for your social media post.");
      return;
    }
    if (mode === 'product' && !productDesc) {
      toast.error("Please describe your product.");
      return;
    }
    if (mode === 'gaming' && (!gameName || !titleText)) {
      toast.error("Please enter both game name and title text.");
      return;
    }
    if (mode === 'avatar' && !avatarStyle) {
      toast.error("Please select an avatar style.");
      return;
    }

    if (profile.dailyGenerations >= 5 && profile.plan === 'free') {
      toast.error("Daily limit reached! Upgrade to Premium for unlimited generations.");
      return;
    }

    setIsGenerating(true);
    setResult(null); // Clear previous result
    try {
      let data: any = null;
      
      if (mode === 'social') {
        const content = await generateSocialContent(topic, style, platform);
        const imageUrl = await generateImage(content.imagePrompt);
        data = { ...content, imageUrl };
      } else if (mode === 'product') {
        const imageUrl = await generateProductShoot(productDesc, style);
        data = { imageUrl };
      } else if (mode === 'gaming') {
        const imageUrl = await generateGamingThumbnail(gameName, titleText);
        data = { imageUrl };
      } else if (mode === 'avatar') {
        const imageUrl = await generateAvatar(avatarStyle, uploadedImage || undefined);
        data = { imageUrl };
      }

      setResult(data);
      
      // Save to Firestore
      await addDoc(collection(db, 'projects'), {
        userId: auth.currentUser?.uid,
        type: mode,
        title: topic || gameName || productDesc || 'New Project',
        imageUrl: data.imageUrl,
        metadata: data,
        createdAt: serverTimestamp()
      });

      // Update user credits
      await updateProfile({ dailyGenerations: (profile.dailyGenerations || 0) + 1 });
      
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("AI generation failed. Please try a different prompt or style.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `creatify-${mode}-${Date.now()}.png`;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
      {/* Controls Panel */}
      <div className="w-full lg:w-96 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Create</h1>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'social', icon: Share2 },
                  { id: 'product', icon: ImageIcon },
                  { id: 'gaming', icon: Gamepad2 },
                  { id: 'avatar', icon: UserCircle2 },
                ].map((m) => (
                  <Button
                    key={m.id}
                    variant={mode === m.id ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setMode(m.id)}
                    className="w-full h-12"
                  >
                    <m.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {mode === 'social' && (
                  <>
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input placeholder="e.g. Skincare tips" value={topic} onChange={(e) => setTopic(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {mode === 'product' && (
                  <>
                    <div className="space-y-2">
                      <Label>Product Description</Label>
                      <Input placeholder="e.g. Luxury watch" value={productDesc} onChange={(e) => setProductDesc(e.target.value)} />
                    </div>
                  </>
                )}

                {mode === 'gaming' && (
                  <>
                    <div className="space-y-2">
                      <Label>Game Name</Label>
                      <Input placeholder="e.g. Valorant" value={gameName} onChange={(e) => setGameName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title Text</Label>
                      <Input placeholder="e.g. Insane Ace!" value={titleText} onChange={(e) => setTitleText(e.target.value)} />
                    </div>
                  </>
                )}

                {mode === 'avatar' && (
                  <>
                    <div className="space-y-2">
                      <Label>Avatar Style</Label>
                      <Select value={avatarStyle} onValueChange={setAvatarStyle}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Photo (Optional)</Label>
                      <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
                        <input type="file" id="photo-upload" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          {uploadedImage ? (
                            <img src={uploadedImage} className="w-20 h-20 object-cover rounded-lg" />
                          ) : (
                            <Upload className="w-8 h-8 text-zinc-500" />
                          )}
                          <span className="text-xs text-zinc-500">Click to upload</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimalist</SelectItem>
                      <SelectItem value="bold">Bold & Vibrant</SelectItem>
                      <SelectItem value="aesthetic">Aesthetic</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-zinc-800">
          <Button 
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold"
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Content
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full space-y-6"
              >
                <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                  <img 
                    src={result.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt="Generated content"
                  />
                </div>
                
                {mode === 'social' && result.caption && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-500">Caption</Label>
                        <p className="text-sm leading-relaxed">{result.caption}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.hashtags?.map((tag: string) => (
                          <span key={tag} className="text-xs text-blue-400">#{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download HD
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 border-zinc-800 hover:bg-zinc-900" onClick={() => setResult(null)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start New
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-500">Your masterpiece awaits</h2>
                <p className="text-zinc-600 max-w-xs mx-auto">Configure your settings on the left and click generate to see the magic.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Editor Toolbar (Mockup for MVP) */}
        <div className="h-20 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-center px-8 gap-8">
          <Button variant="ghost" size="sm" className="text-zinc-500 flex flex-col h-auto py-2 gap-1">
            <TypeIcon className="w-4 h-4" />
            <span className="text-[10px]">Text</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 flex flex-col h-auto py-2 gap-1">
            <Palette className="w-4 h-4" />
            <span className="text-[10px]">Colors</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 flex flex-col h-auto py-2 gap-1">
            <Layout className="w-4 h-4" />
            <span className="text-[10px]">Layout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
