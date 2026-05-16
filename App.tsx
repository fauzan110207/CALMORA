import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  Heart, Brain, Wind, Moon, AlertCircle, BarChart2, User, Home, 
  ChevronLeft, ChevronRight, Plus, Calendar, Smile, Meh, Frown, 
  PenLine, Zap, Play, Volume2, Settings, LogOut, Bell, Lock, 
  ChevronDown, Timer, CheckCircle2, Pause, Languages, Mail, AlertTriangle, Info,
  Sun, Monitor, Headphones, VolumeX, Shield, HelpCircle, FileText, Camera, Check, Image,
  Clock, Volume1, Shuffle, Repeat, ShieldCheck, Phone, PhoneCall, Activity, ArrowUpRight, CheckCircle,
  MessageSquare, Sparkles, Footprints, Music, RefreshCw, X, Leaf, CloudMoon, Flame, Smartphone, Globe, Delete, Unlock, Key, Gift,
  CloudRain, Bird, ShoppingCart, Wallet
} from 'lucide-react';
import { firebaseService, OperationType } from './services/firebaseService';

// --- Types & Themes ---
type Screen = 
  | 'splash' | 'onboarding' | 'login' | 'register' | 'forgot'
  | 'home' | 'mood' | 'journal' | 'stress' | 'breathing' | 'sleep' 
  | 'emergency' | 'stats' | 'profile' | 'grounding' | 'privacyPolicy' | 'termsConditions'
  | 'editProfile' | 'settings' | 'dailyReminders' | 'notificationSettings' 
  | 'privacySecurity' | 'helpSupport' | 'aboutApp' | 'appearance'
  | 'musicPlayer' | 'languageSettings' | 'changeEmail' | 'changePassword' 
  | 'accountSecurity' | 'dataProtection' | 'appLock' | 'reportProblem' | 'feedbackForm'
  | 'contactSupport' | 'moodSuccess' | 'calmNow' | 'authChoice' | 'stressResult'
  | 'panicHelp' | 'whatToDo' | 'reflectionPrompt' | 'safeReminder' | 'appLockVerify' | 'rewards' | 'journalAiFeedback';

type Language = 'en' | 'id' | 'zh' | 'ja' | 'ko' | 'ar' | 'fr' | 'de';
type ThemeMode = 'light' | 'dark' | 'system';

const COLORS = {
  lavender: '#A7A6D1',
  sage: '#8EB486',
  cream: '#FDFBF7',
  beige: '#F5E6D3',
  dustyBlue: '#A8DADC',
  softPink: '#F3D9D9',
  white: '#FFFFFF',
  text: '#2D3436',
  muted: '#A0AEC0',
  darkBg: '#1A1A2E',
  darkCard: '#16213E',
  darkText: '#E2E2E2'
};

const TRANSLATIONS: any = {
  en: {
    appName: 'CALMORA',
    slogan: 'Your Safe Space for Mental Wellness',
    getStarted: 'Continue',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPass: 'Forgot Password?',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    hello: 'Hello',
    goodMorning: 'Good Morning',
    howFeel: 'How do you feel today?',
    breathwork: 'Breathwork',
    findRhythm: 'Find Rhythm',
    sleepWell: 'Sleep Well',
    digitalCalm: 'Digital Calm',
    affirmation: 'Daily Affirmation',
    affirmations: [
      "You are allowed to slow down and take a break.",
      "Your feelings are valid, and your emotions matter.",
      "Healing takes time, and that is perfectly okay.",
      "You have survived every hard day so far.",
      "Peace begins when you choose yourself first."
    ],
    loginEmailPlaceholder: "Enter your email",
    loginPasswordPlaceholder: "Enter your password",
    demoAccountLabel: "Use this demo account",
    recentActivity: 'Recent Activity',
    viewProgress: 'View Progress',
    save: 'Check-in',
    saveEntry: 'Save Entry',
    breathe: 'Breathe',
    slowDown: 'Slow Down',
    inhale: 'Inhale',
    exhale: 'Exhale',
    hold: 'Hold',
    next: 'Next',
    quit: 'End',
    logout: 'Log Out',
    moods: { happy: 'Happy', calm: 'Calm', tired: 'Tired', stressed: 'Stressed' },
    moodReasons: {
      happy: ['Family', 'Friends', 'Productive', 'Rest', 'Hobbies', 'Success'],
      calm: ['Meditation', 'Nature', 'Music', 'No Stress', 'Quiet', 'Reading'],
      tired: ['Work', 'School', 'Bad Sleep', 'Travel', 'Housework', 'Illness'],
      stressed: ['Deadlines', 'Conflict', 'Finance', 'Health', 'Future', 'Traffic']
    },
    nav: { home: 'Home', journal: 'Journal', stats: 'Statistics', alert: 'Safety', profile: 'Profile' },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      off: 'Off',
      redeem: 'Redeem',
      redeemNow: 'Redeem Now',
      oops: 'Oops!',
      pointsNeeded: 'Not Enough Points',
      successRedeem: 'Reward redeemed! Check your email.',
      timerTitle: 'Sleep Timer',
      timerDesc: 'Music will stop automatically',
      backToHome: 'Back to Home',
      understand: 'Got it',
      needMore: 'Need {n} more',
      points: 'Points'
    },
    logoutConfirmTitle: "Are you sure you want to log out?",
    logoutConfirmDesc: "You will need to sign back in to access your data.",
    onboarding: [
      { title: 'Welcome to CALMORA', desc: 'Your tiny sanctuary for emotional balance and mental clarity.' },
      { title: 'Track Your Feelings', desc: 'Understand your patterns through simple daily check-ins.' },
      { title: 'Immediate Support', desc: 'Access calming tools and emergency help whenever you need it.' }
    ]
  },
  id: {
    appName: 'CALMORA',
    slogan: 'Tempat Teduh Digital',
    getStarted: 'Mulai',
    signIn: 'Masuk',
    signUp: 'Daftar',
    forgotPass: 'Lupa Password?',
    welcomeBack: 'Selamat Datang',
    createAccount: 'Buat Akun',
    hello: 'Halo',
    goodMorning: 'Selamat Pagi',
    howFeel: 'Apa kabarmu hari ini?',
    breathwork: 'Pernapasan',
    findRhythm: 'Atur Napas',
    sleepWell: 'Tidur Nyenyak',
    digitalCalm: 'Relaksasi',
    affirmation: 'Afirmasi Harian',
    affirmations: [
      "Kamu boleh melambat dan istirahat sejenak.",
      "Perasaanmu valid, dan emosimu itu penting.",
      "Penyembuhan butuh waktu, dan itu tidak apa-apa.",
      "Kamu telah bertahan melewati setiap hari yang sulit.",
      "Kedamaian dimulai saat kamu memilih dirimu sendiri.",
    ],
    loginEmailPlaceholder: "Masukkan email Anda",
    loginPasswordPlaceholder: "Masukkan password Anda",
    demoAccountLabel: "Gunakan data akun demo ini",
    recentActivity: 'Aktivitas Terbaru',
    viewProgress: 'Grafik Progres',
    save: 'Check-in',
    saveEntry: 'Simpan',
    breathe: 'Bernapas',
    slowDown: 'Tenang',
    inhale: 'Tarik Napas',
    exhale: 'Buang Napas',
    hold: 'Tahan',
    next: 'Lanjut',
    quit: 'Selesai',
    logout: 'Keluar',
    moods: { happy: 'Senang', calm: 'Tenang', tired: 'Lelah', stressed: 'Stres' },
    moodReasons: {
      happy: ['Keluarga', 'Teman', 'Produktif', 'Istirahat', 'Hobi', 'Sukses'],
      calm: ['Meditasi', 'Alam', 'Musik', 'Santai', 'Sepi', 'Membaca'],
      tired: ['Kerja', 'Sekolah', 'Kurang Tidur', 'Perjalanan', 'Pekerjaan Rumah', 'Sakit'],
      stressed: ['Deadline', 'Konflik', 'Keuangan', 'Kesehatan', 'Masa Depan', 'Macet']
    },
    nav: { home: 'Beranda', journal: 'Jurnal', stats: 'Statistik', alert: 'Darurat', profile: 'Profil' },
    common: {
      cancel: 'Batal',
      confirm: 'Ya',
      off: 'Mati',
      redeem: 'Tukar',
      redeemNow: 'Tukar Sekarang',
      oops: 'Oops!',
      pointsNeeded: 'Poin Kurang',
      successRedeem: 'Hadiah berhasil ditukar! Cek email kamu.',
      timerTitle: 'Timer Tidur',
      timerDesc: 'Musik akan berhenti secara otomatis',
      backToHome: 'Kembali ke Beranda',
      understand: 'Saya Mengerti',
      needMore: 'Butuh {n} lagi',
      points: 'Poin'
    },
    logoutConfirmTitle: "Yakin ingin keluar?",
    logoutConfirmDesc: "Anda harus masuk kembali untuk mengakses data ketenangan Anda.",
    onboarding: [
      { title: 'Selamat Datang di CALMORA', desc: 'Tempat perlindungan kecilmu untuk keseimbangan emosi dan kejernihan pikiran.' },
      { title: 'Pantau Perasaanmu', desc: 'Pahami polamu melalui check-in harian yang sederhana.' },
      { title: 'Dukungan Langsung', desc: 'Akses alat penenang dan bantuan darurat kapanpun kamu butuhkan.' }
    ]
  }
};

// --- Shared Components ---

const ScreenWrapper = ({ children, id, className = "", isDark }: { children: React.ReactNode, id: string, className?: string, isDark?: boolean }) => (
  <motion.div
    key={id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className={`flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#14142B] text-white' : 'bg-[#FDFBF7] text-[#2D3436]'} ${className}`}
  >
    {children}
  </motion.div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", type = "button", isDark }: any) => {
  const variants: any = {
    primary: 'bg-[#A7A6D1] text-white shadow-md shadow-[#A7A6D1]/20 hover:bg-[#9796C1]',
    secondary: isDark 
      ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' 
      : 'bg-white text-neutral-600 border border-[#F5E6D3] shadow-sm hover:bg-neutral-50',
    emergency: 'bg-[#F3D9D9] text-pink-600 shadow-sm hover:bg-[#EEC9C9]',
    black: 'bg-neutral-800 text-white shadow-md hover:bg-neutral-900',
    text: 'text-[#A7A6D1] font-bold hover:underline'
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`w-full py-3 px-6 rounded-xl font-bold transition-all active:scale-[0.98] text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, isDark, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />}
      <input 
        className={`w-full p-3 ${Icon ? 'pl-11' : 'px-4'} rounded-xl outline-none transition-all text-sm ${
          isDark 
            ? 'bg-white/5 border border-white/10 focus:border-[#A7A6D1] text-white' 
            : 'bg-white border border-[#F5E6D3] focus:border-[#A7A6D1] focus:ring-2 focus:ring-[#A7A6D1]/5 text-[#2D3436]'
        }`} 
        {...props} 
      />
    </div>
  </div>
);

const Notification = ({ message, type = 'success' }: { message: string, type?: 'success' | 'error' | 'info' }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${type === 'success' ? 'bg-sage-50 text-emerald-700 border border-emerald-100' : type === 'error' ? 'bg-pink-50 text-pink-700 border border-pink-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}
  >
    {type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
    {message}
  </motion.div>
);

const MoodModal = ({ mood, onSave, onCancel, isDark, lang }: { mood: any, onSave: (note: string) => void, onCancel: () => void, isDark: boolean, lang: string }) => {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className={`w-full max-w-sm p-8 rounded-[50px] shadow-2xl space-y-8 relative overflow-hidden ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white border border-[#F5E6D3]'}`}
      >
        <div className="text-center space-y-4">
           <div className={`w-20 h-20 rounded-[35px] mx-auto flex items-center justify-center text-4xl shadow-xl ${isDark ? 'bg-white/5' : 'bg-neutral-50 border border-[#F5E6D3]'}`}>
             {mood.emoji}
           </div>
           <div className="space-y-1">
             <h3 className={`text-2xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>
               {lang === 'id' ? 'Kamu merasa' : 'You feel'} <span className="text-[#A7A6D1] italic">{mood.label}</span>
             </h3>
             <p className="text-neutral-400 text-xs font-medium">{lang === 'id' ? 'Apa yang membuatmu merasa seperti ini?' : 'What made you feel this way?'}</p>
           </div>
        </div>

        <textarea 
          autoFocus
          placeholder={lang === 'id' ? "Tulis alasan singkatmu..." : "Speak your heart..."}
          className={`w-full h-32 p-6 rounded-[35px] border outline-none font-serif italic text-base resize-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#A7A6D1]' : 'bg-[#FDFBF7] border-[#F5E6D3] focus:border-[#A7A6D1] text-neutral-700'}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <Button onClick={() => onSave(note)} className="py-5 rounded-[25px] bg-[#A7A6D1]" isDark={isDark}>
            {lang === 'id' ? 'Simpan Mood' : 'Save Reflection'}
          </Button>
          <button onClick={onCancel} className="py-3 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 hover:text-neutral-500 transition-colors">
            {lang === 'id' ? 'Batal' : 'Cancel'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const BottomNav = ({ current, setScreen, t, isDark }: { current?: Screen, setScreen: (s: Screen) => void, t: any, isDark?: boolean }) => {
  const navItems = [
    { id: 'home', icon: Home },
    { id: 'stats', icon: BarChart2 },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none pb-4 px-6">
       <div className={`max-w-xs mx-auto rounded-[32px] border p-1.5 flex items-center justify-between pointer-events-auto shadow-2xl backdrop-blur-2xl transition-all ${isDark ? 'bg-[#1A1A2E]/80 border-white/10 shadow-black/40' : 'bg-white/90 border-neutral-100 shadow-[#A7A6D1]/20'}`}>
          {navItems.map((item) => {
            const isActive = current === item.id || 
              (item.id === 'home' && ['stress', 'breathing', 'sleep', 'musicPlayer', 'stressResult', 'mood', 'moodSuccess', 'grounding', 'calmNow', 'panicHelp', 'whatToDo', 'safeReminder'].includes(current!)) || 
              (item.id === 'profile' && ['settings', 'editProfile', 'languageSettings', 'appearance', 'notificationSettings', 'privacySecurity', 'helpSupport', 'aboutApp', 'changeEmail', 'changePassword', 'accountSecurity', 'dataProtection', 'appLock', 'rewards'].includes(current!));
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id as Screen)}
                className={`flex-1 flex flex-col items-center py-2.5 transition-all relative group active:scale-90 ${isActive ? 'text-lavender' : isDark ? 'text-white/20' : 'text-neutral-300'}`}
              >
                <div className={`p-2.5 rounded-3xl transition-all ${isActive ? (isDark ? 'bg-white/10' : 'bg-lavender/10') : 'group-hover:bg-neutral-50/50'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-all ${isActive ? 'scale-110' : ''}`} />
                </div>
              </button>
            );
          })}
       </div>
    </div>
  );
};

const SOUNDS = [
  { id: 'waves', title: 'Ocean Waves', category: 'Stress Relief', url: 'https://youtu.be/cB_CwY9dhrA?si=AgV1SAHde4GsvyZW', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop', icon: Wind },
  { id: 'rain', title: 'Forest Rain', category: 'Anxiety Relief', url: 'https://youtu.be/MiFsC_p_Vfc?si=RAAPE0YewzG-DsOj', image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=400&auto=format&fit=crop', icon: CloudRain },
  { id: 'white_noise', title: 'White Noise', category: 'Focus Mode', url: 'https://youtu.be/Q0kbGwtEXMk?si=d3TWgTsiYfNk5Rg8', image: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=400&auto=format&fit=crop', icon: Zap },
  { id: 'piano', title: 'Slow Piano', category: 'Sleep Better', url: 'https://youtu.be/Re9LbAsCGh4?si=Yu-qj_lc2faVO1e-', image: 'https://images.unsplash.com/photo-1520529612711-2094c4897f26?q=80&w=400&auto=format&fit=crop', icon: Music },
  { id: 'deep_sleep_1', title: 'Delta Waves', category: 'Deep Sleep', url: 'https://youtu.be/dTNbjcb_Ztw?si=U8_ZHReAGK3Oh9C6', image: 'https://images.unsplash.com/photo-1511295742364-917e704bfa6c?q=80&w=400&auto=format&fit=crop', icon: Moon },
  { id: 'deep_sleep_2', title: 'Night Atmosphere', category: 'Deep Sleep', url: 'https://youtu.be/mSRNst6J1YM?si=eq735SRFev90XtU7', image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=400&auto=format&fit=crop', icon: Sparkles },
  { id: 'nature_1', title: 'Mountain Birds', category: 'Morning', url: 'https://youtu.be/5tYq1IRhy-Q?si=yozQ1MfqbZQMcLuJ', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop', icon: Bird },
  { id: 'focus_alpha', title: 'Alpha Brainwaves', category: 'Focus Mode', url: 'https://youtu.be/-uP2W_QPQpw?si=GBtArR1sPBYiJk6I', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&auto=format&fit=crop', icon: Brain },
];

const LogoutModal = ({ onConfirm, onCancel, isDark, lang }: { onConfirm: () => void, onCancel: () => void, isDark: boolean, lang: string }) => {
  const t = (TRANSLATIONS[lang] as any);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-xs p-8 rounded-[40px] shadow-2xl text-center space-y-6 ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white border border-[#F5E6D3]'}`}
      >
        <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-400 mx-auto">
          <LogOut size={32} />
        </div>
        <div className="space-y-2">
          <h3 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{t.logoutConfirmTitle}</h3>
          <p className="text-neutral-400 text-xs">{t.logoutConfirmDesc}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onConfirm} className="bg-pink-400" isDark={isDark}>{t.logout}</Button>
          <button onClick={onCancel} className="py-4 text-[10px] font-black uppercase tracking-widest text-neutral-300">{TRANSLATIONS[lang].common.cancel}</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Floating Calm Component ---
const FloatingCalmButton = ({ onClick, isDark, offset }: { onClick: () => void, isDark: boolean, offset: boolean }) => (
  <motion.div 
    animate={{ bottom: offset ? 170 : 110 }}
    className="fixed right-4 z-[70]"
  >
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all border ${isDark ? 'bg-red-500 text-white border-red-400/20' : 'bg-white text-red-500 border-red-50 shadow-red-200/40'}`}
    >
      <ShieldCheck size={20} />
    </motion.button>
  </motion.div>
);

// --- Quick Calm Popup ---
const QuickCalmPopup = ({ onClose, setScreen, lang, isDark }: { onClose: () => void, setScreen: (s: Screen) => void, lang: string, isDark: boolean }) => {
  const items = [
    { label: lang === 'id' ? 'Panik' : 'Panic', icon: Zap, screen: 'panicHelp', color: 'bg-red-500' },
    { label: lang === 'id' ? 'Saran' : 'Advice', icon: HelpCircle, screen: 'whatToDo', color: 'bg-orange-500' },
    { label: lang === 'id' ? 'Aman' : 'Safe', icon: MessageSquare, screen: 'safeReminder', color: 'bg-blue-400' },
    { label: lang === 'id' ? 'Statistik' : 'Stats', icon: BarChart2, screen: 'stats', color: 'bg-indigo-400' },
    { label: lang === 'id' ? 'Darurat' : 'Emergency', icon: PhoneCall, screen: 'emergency', color: 'bg-rose-400' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`w-full max-w-[340px] rounded-3xl p-6 space-y-6 relative shadow-2xl ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white border border-neutral-100'}`}
      >
        <button onClick={onClose} className="absolute top-4 right-5 p-1 text-neutral-300 hover:text-neutral-400 transition-colors">
          <ChevronDown size={22} />
        </button>

        <div className="text-center space-y-1">
           <div className={`inline-block px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}>Emergency</div>
           <h3 className={`text-xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Safe Portal</h3>
           <p className="text-neutral-400 text-[10px] px-2 leading-relaxed opacity-70 italic">“Tarik napas pelan. Kami di sini untukmu.”</p>
        </div>

        <div className="grid grid-cols-5 gap-2">
           {items.map((item) => (
             <button 
               key={item.label}
               onClick={() => { setScreen(item.screen as Screen); onClose(); }}
               className="flex flex-col items-center gap-2 group"
             >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow shadow-black/10 group-active:scale-95 transition-all`}>
                   <item.icon size={18} />
                </div>
                <span className="text-[7px] font-black uppercase tracking-[0.1em] text-neutral-400">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button onClick={() => { setScreen('calmNow'); onClose(); }} className="py-3 bg-red-500 rounded-xl text-xs" isDark={isDark}>Calm Now Guide</Button>
          <button onClick={onClose} className={`w-full py-2 text-[8px] font-black uppercase tracking-[0.3em] text-neutral-300`}>Close</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Mini Player Component ---
const MiniPlayerBar = ({ sound, isPlaying, onPlayPause, onNext, onPrev, onClose, onOpen, isDark, sleepTimer, setShowTimerModal }: any) => {
  if (!sound) return null;
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={`fixed bottom-[90px] left-4 right-4 z-[55] max-w-sm mx-auto p-2 rounded-[28px] border flex items-center gap-3 shadow-2xl transition-all cursor-pointer overflow-hidden ${isDark ? 'bg-[#1E1E3A]/95 border-white/10 backdrop-blur-3xl shadow-black/40' : 'bg-white/95 border-neutral-100 backdrop-blur-2xl shadow-lavender/10'}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        onOpen();
      }}
    >
       <div className="relative flex-shrink-0 ml-1">
         <motion.div 
           animate={{ rotate: isPlaying ? 360 : 0 }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isDark ? 'border-white/10' : 'border-neutral-50'}`}
         >
           <img src={sound.image} className="w-full h-full object-cover" alt="" />
         </motion.div>
       </div>

       <div className="flex-grow overflow-hidden">
          <h4 className={`text-[11px] font-bold tracking-tight truncate ${isDark ? 'text-white' : 'text-neutral-800'}`}>{sound.title}</h4>

       </div>

       <div className="flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); setShowTimerModal(true); }} className={`p-2 transition-colors ${sleepTimer ? 'text-lavender' : 'text-neutral-300'}`}><Volume2 size={14} className="mr-2" /><Timer size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="p-2 text-neutral-300 hover:text-lavender"><ChevronLeft size={16} /></button>
          <button 
           onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
           className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${isDark ? 'bg-white text-[#1E1E3A]' : 'bg-lavender text-white shadow-lg'}`}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="p-2 text-neutral-300 hover:text-lavender"><ChevronRight size={16} /></button>
          <button 
           onClick={(e) => { e.stopPropagation(); onClose(); }}
           className={`w-8 h-8 rounded-xl flex items-center justify-center text-neutral-300 hover:text-red-400 ml-1`}
          >
            <X size={14} />
          </button>
       </div>
    </motion.div>
  );
};

// --- Permission Modal ---
const PermissionModal = ({ onAllow, onDeny, isDark, lang }: { onAllow: () => void, onDeny: () => void, isDark: boolean, lang: string }) => {
  const t = TRANSLATIONS[lang].common;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-xs p-8 rounded-[40px] shadow-2xl text-center space-y-8 ${isDark ? 'bg-[#1E1E3A] border border-white/10 text-white' : 'bg-white border border-[#F5E6D3] text-neutral-800'}`}
      >
         <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-400 mx-auto shadow-inner">
            <Camera size={32} />
         </div>
         <div className="space-y-2">
           <h3 className="text-xl font-serif">{lang === 'id' ? 'Akses Galeri?' : 'Access Gallery?'}</h3>
           <p className="text-neutral-400 text-xs px-2 leading-relaxed">
             {lang === 'id' 
               ? 'CALMORA butuh izin untuk mengakses foto agar kamu bisa memperbarui foto profilmu.' 
               : 'CALMORA needs permission to access your gallery so you can update your profile photo.'}
           </p>
         </div>
         <div className="flex flex-col gap-3">
           <Button onClick={onAllow} isDark={isDark} className="bg-blue-400">{lang === 'id' ? 'Izinkan' : 'Allow'}</Button>
           <button onClick={onDeny} className="text-[10px] font-black uppercase tracking-widest text-neutral-300">{lang === 'id' ? 'Jangan Izinkan' : 'Later'}</button>
         </div>
      </motion.div>
    </div>
  );
};

// --- Photo Options Modal ---
const PhotoOptionsModal = ({ onClose, onSelect, isDark, lang }: { onClose: () => void, onSelect: (type: string) => void, isDark: boolean, lang: string }) => (
  <div className="fixed inset-0 z-[200] flex items-end justify-center p-6 bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      className={`w-full max-w-sm p-8 rounded-[40px] shadow-2xl flex flex-col gap-3 ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white border-[#F5E6D3]'}`}
    >
       <div className="text-center mb-4">
         <h3 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{lang === 'id' ? 'Ubah Foto Profil' : 'Update Profile Photo'}</h3>
       </div>
       <button onClick={() => onSelect('camera')} className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white' : 'bg-neutral-50 text-neutral-800'}`}>
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center"><Camera size={20} /></div>
           <span className="text-sm font-bold">{lang === 'id' ? 'Ambil Foto' : 'Take Photo'}</span>
         </div>
         <ChevronRight size={16} className="text-neutral-300" />
       </button>
       <button onClick={() => onSelect('gallery')} className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white' : 'bg-neutral-50 text-neutral-800'}`}>
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center"><Image size={20} /></div>
           <span className="text-sm font-bold">{lang === 'id' ? 'Pilih dari Galeri' : 'Pick from Gallery'}</span>
         </div>
         <ChevronRight size={16} className="text-neutral-300" />
       </button>
       <button onClick={() => onSelect('remove')} className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 ${isDark ? 'bg-white/5 text-red-400' : 'bg-red-50 text-red-500'}`}>
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center"><Delete size={20} /></div>
           <span className="text-sm font-bold">{lang === 'id' ? 'Hapus Foto Sekarang' : 'Remove Photo'}</span>
         </div>
       </button>
       <button onClick={onClose} className="w-full pt-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">{TRANSLATIONS[lang].common.cancel}</button>
    </motion.div>
  </div>
);

const RedeemModal = ({ reward, onConfirm, onCancel, isDark, points, lang }: any) => {
  const canAfford = points >= reward.cost;
  const t = TRANSLATIONS[lang].common;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-xs p-8 rounded-[40px] shadow-2xl text-center space-y-6 ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white'}`}
      >
        <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center mx-auto shadow-inner ${canAfford ? 'bg-lavender/20 text-lavender' : 'bg-red-50 text-red-500'}`}>
          <Gift size={32} />
        </div>
        
        <div className="space-y-2">
          {canAfford ? (
            <>
              <h3 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{t.redeem} {reward.title}?</h3>
              <p className="text-neutral-400 text-xs px-2 leading-relaxed">
                {lang === 'id' 
                  ? `Yakin ingin menukarkan ${reward.cost} poin untuk hadiah ini?` 
                  : `Are you sure you want to redeem ${reward.cost} points for this reward?`}
              </p>
            </>
          ) : (
            <>
              <h3 className={`text-xl font-serif text-red-400`}>{t.oops} {t.pointsNeeded}</h3>
              <p className="text-neutral-400 text-xs px-2 leading-relaxed">
                {lang === 'id' 
                  ? `Kamu butuh ${reward.cost - points} poin lagi untuk mendapatkan hadiah ini. Semangat latihannya!` 
                  : `You need ${reward.cost - points} more points to get this. Keep practicing!`}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {canAfford ? (
            <Button onClick={onConfirm} isDark={isDark} className="bg-lavender">{t.redeemNow}</Button>
          ) : (
            <Button onClick={onCancel} isDark={isDark} className="bg-neutral-800">{t.understand}</Button>
          )}
          {canAfford && (
            <button onClick={onCancel} className="py-2 text-[10px] font-black uppercase tracking-widest text-neutral-300 font-mono">{t.cancel}</button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const TimerModal = ({ onClose, onSet, isDark, lang }: any) => {
  const t = TRANSLATIONS[lang].common;
  const options = [10, 15, 30, 45, 60];
  const [customVal, setCustomVal] = useState('');
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-sm p-8 rounded-[45px] shadow-2xl relative overflow-hidden ${isDark ? 'bg-[#1E1E3A] border border-white/10' : 'bg-white border border-neutral-100'}`}
      >
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-lavender/20 rounded-[28px] flex items-center justify-center text-lavender mx-auto mb-4">
            <Clock size={32} />
          </div>
          <h3 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{t.timerTitle}</h3>
          <p className="text-neutral-400 text-[10px] uppercase font-black tracking-widest leading-relaxed">{t.timerDesc}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSet(opt)}
              className={`py-4 rounded-2xl text-xs font-black transition-all active:scale-90 ${isDark ? 'bg-white/5 border border-white/5 text-white hover:bg-lavender/20' : 'bg-neutral-50 border border-neutral-100 text-neutral-600 hover:bg-lavender/10'}`}
            >
              {opt}m
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-8">
           <input 
             type="number" 
             placeholder={lang === 'id' ? 'Menit kustom' : 'Custom mins'}
             className={`flex-grow p-3 rounded-xl border outline-none text-xs ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-[#F5E6D3]'}`}
             value={customVal}
             onChange={(e) => setCustomVal(e.target.value)}
           />
           <button 
             onClick={() => customVal && onSet(parseInt(customVal))}
             className="px-4 py-3 bg-lavender text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
           >
             Set
           </button>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button onClick={() => onSet(null)} variant="secondary">{t.off}</Button>
          <button onClick={onClose} className="w-full pt-1 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 font-mono transition-colors hover:text-neutral-400">{t.cancel}</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['splash']);
  const [isLoading, setIsLoading] = useState(true);
  const [fbUser, setFbUser] = useState<any | null>(null);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('calmora_lang') as Language;
    return saved || 'id';
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('calmora_onboarding_done') === 'true';
  });
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('calmora_theme') as ThemeMode) || 'light';
  });
  const [user, setUser] = useState<{ 
    name: string, 
    username: string, 
    email: string, 
    photo: string, 
    bio?: string,
    points?: number,
    streak?: number,
    stats?: {
      moodChecks: number,
      journalsCreated: number,
      breathingSessions: number,
      sleepSessions: number,
      stressChecks: number
    }
  } | null>(() => {
    const saved = localStorage.getItem('calmora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [journalAiReply, setJournalAiReply] = useState<string | null>(null);

  const getAiReply = (content: string) => {
    const lower = content.toLowerCase();
    if (lower.includes('lelah') || lower.includes('tired') || lower.includes('capek')) {
        return lang === 'id' ? "Terima kasih sudah bercerita. Kamu sudah melakukan hal yang baik dengan menuliskan perasaanmu. Coba istirahat sejenak dan beri ruang untuk dirimu sendiri." : "Thank you for sharing. You've done a good thing by writing down your feelings. Take a rest and give yourself some space.";
    }
    if (lower.includes('sedih') || lower.includes('sad') || lower.includes('nangis')) {
        return lang === 'id' ? "Aku mendengar kesedihanmu. Tidak apa-apa untuk tidak merasa baik-baik saja hari ini. Kamu tidak sendirian." : "I hear your sadness. It's okay not to feel okay today. You are not alone.";
    }
    return lang === 'id' ? "Terima kasih sudah menuangkan pikiranmu. Menulis adalah langkah hebat untuk menenangkan diri. Kamu luar biasa." : "Thank you for pouring out your thoughts. Writing is a great step to calm yourself. You are doing great.";
  };
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQuickCalm, setShowQuickCalm] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [redeemTarget, setRedeemTarget] = useState<any>(null);
  
  // Mood Tracker states
  const [selectedMood, setSelectedMood] = useState<{id: string, label: string, emoji: string, icon?: any} | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodLogs, setMoodLogs] = useState<any[]>([]);

  const topMood = useMemo(() => {
    if (moodLogs.length === 0) return 'No Data';
    const counts: any = {};
    moodLogs.forEach(log => {
      counts[log.mood.label] = (counts[log.mood.label] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [moodLogs]);

  // Progress States
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('calmora_points');
    return saved ? parseInt(saved) : 0;
  });
  const [streak, setStreak] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  
  // Activity tracking for realistic stats
  const [stats, setStats] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('calmora_stats');
    return saved ? JSON.parse(saved) : {
      moodChecks: 0,
      journalsCreated: 0,
      breathingSessions: 0,
      sleepSessions: 0,
      stressChecks: 0,
      activeMinutes: 0
    };
  });

  const [usageHistory, setUsageHistory] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('calmora_usage_history');
    return saved ? JSON.parse(saved) : {};
  });

  const [stressLevel, setStressLevel] = useState<number>(0);
  const [stressHistory, setStressHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('calmora_stress_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [dismissedCards, setDismissedCards] = useState<string[]>(() => {
    const saved = localStorage.getItem('calmora_dismissed_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const dismissCard = (id: string) => {
    setDismissedCards(prev => {
      const updated = [...prev, id];
      localStorage.setItem('calmora_dismissed_cards', JSON.stringify(updated));
      return updated;
    });
  };

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS['en'], [lang]);

  const moodOptions = useMemo(() => [
    { id: 'happy', label: t.moods.happy, emoji: '😊', bg: 'bg-[#8EB486]/10', color: 'text-[#8EB486]' },
    { id: 'calm', label: t.moods.calm, emoji: '😌', bg: 'bg-[#A8DADC]/10', color: 'text-[#A8DADC]' },
    { id: 'tired', label: t.moods.tired, emoji: '😴', bg: 'bg-[#F5E6D3]/10', color: 'text-[#F5E6D3]' },
    { id: 'anxious', label: t.moods.stressed, emoji: '😣', bg: 'bg-[#F3D9D9]/10', color: 'text-[#F3D9D9]' },
  ], [t]);

  const hasCheckedMoodToday = useMemo(() => {
    const today = new Date().toDateString();
    return moodLogs.some(log => new Date(log.date).toDateString() === today);
  }, [moodLogs]);

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const historyKeys = Object.keys(usageHistory);
    
    // Check if new user (no mood logs AND no stress history)
    if (moodLogs.length === 0 && stressHistory.length === 0 && stats.stressChecks === 0) {
        return null;
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = new Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        const dateKey = d.toDateString();
        const usage = usageHistory[dateKey] || 0;
        const moodLogsCount = moodLogs.filter(log => new Date(log.date).toDateString() === dateKey).length;
        const dayStressHistory = stressHistory.filter(s => new Date(s.date).toDateString() === dateKey);
        const avgDayStress = dayStressHistory.length > 0 ? dayStressHistory.reduce((a, b) => a + b.level, 0) / dayStressHistory.length : 0;
        
        // Value: combined score of usage, mood, and stress (normalized)
        const val = Math.min(100, (usage * 2) + (moodLogsCount * 15) + (avgDayStress * 0.5));
        return { 
          day: days[d.getDay()], 
          value: val,
          date: dateKey 
        };
    });

    // Calculate advanced metrics
    let totalValue = 0;
    let maxVal = -1;
    let heaviestDay = 'N/A';
    const moodsCount: any = {};

    result.forEach(item => {
        totalValue += item.value;
        if (item.value > maxVal) {
            maxVal = item.value;
            heaviestDay = item.day;
        }
        
        // Extract moods for dominant mood
        moodLogs.filter(log => new Date(log.date).toDateString() === item.date)
                .forEach(log => {
                    moodsCount[log.mood.id] = (moodsCount[log.mood.id] || 0) + 1;
                });
    });

    const dominantMoodId = Object.entries(moodsCount).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';
    const dominantMoodLabel = dominantMoodId !== 'N/A' ? (moodOptions.find(m => m.id === dominantMoodId)?.label || dominantMoodId) : (lang === 'id' ? 'Belum Ada' : 'N/A');

    return {
        chartData: result,
        avgEmotion: Math.round(totalValue / 7),
        dominantMood: dominantMoodLabel,
        heaviestDay: heaviestDay === 'N/A' ? (lang === 'id' ? 'N/A' : 'N/A') : (lang === 'id' ? (heaviestDay === 'Sun' ? 'Minggu' : heaviestDay === 'Mon' ? 'Senin' : heaviestDay === 'Tue' ? 'Selasa' : heaviestDay === 'Wed' ? 'Rabu' : heaviestDay === 'Thu' ? 'Kamis' : heaviestDay === 'Fri' ? 'Jumat' : 'Sabtu') : heaviestDay),
        progress: totalValue > 0 ? 12 : 0, // Mocked 12% improvement progress
        summary: totalValue > 70 ? (lang === 'id' ? "Luar biasa! Minggumu penuh dengan ketenangan." : "Amazing! Your week was filled with peace.") : 
                 totalValue > 30 ? (lang === 'id' ? "Progress yang stabil. Pertahankan ritmemu." : "Steady progress. Keep your rhythm.") :
                 (lang === 'id' ? "Teruskan perjalananmu menuju kedamaian." : "Continue your journey towards peace.")
    };
  }, [usageHistory, moodLogs, stats.stressChecks, lang]);
  
  useEffect(() => {
    localStorage.setItem('calmora_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('calmora_stats', JSON.stringify(stats));
  }, [stats]);

  const [reminders, setReminders] = useState({
    morning: true,
    mood: true,
    sleep: false,
    reflection: true,
    times: { morning: '07:00', mood: '20:00', sleep: '22:00', reflection: '21:00' }
  });
  const [notifSettings, setNotifSettings] = useState({
    affirmation: true,
    weekly: true,
    exercise: true,
    sleepRelax: false,
    moodReminders: true,
    meditationDaily: true,
    communityUpdates: false,
    stressAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    biometric: true,
    loginAlerts: true,
    rememberLogin: true
  });

  const [appLockState, setAppLockState] = useState(() => {
    const saved = localStorage.getItem('calmora_lock_state');
    return saved ? JSON.parse(saved) : { isEnabled: false, pin: '', confirmPin: '' };
  });

  const [dataSettings, setDataSettings] = useState({
    personalization: true,
    analytics: true,
    cloudSync: true
  });

  // Stress Check states
  const [stressStep, setStressStep] = useState(0);
  const [stressAnswers, setStressAnswers] = useState<number[]>([]);
  const [stressScore, setStressScore] = useState(0);

  // Music Player States
  const [currentSound, setCurrentSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  useEffect(() => {
    const affs = (TRANSLATIONS[lang] as any).affirmations || [];
    if (affs.length > 0) {
      const randomAff = affs[Math.floor(Math.random() * affs.length)];
      setCurrentAffirmation(randomAff);
    }
  }, [lang]);
  const playerRef = useRef<any>(null);

  // Forms
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [editProfileForm, setEditProfileForm] = useState({ name: '', username: '', bio: '' });

  useEffect(() => {
    if (stressLevel !== null) {
      localStorage.setItem('calmora_stress_level', stressLevel.toString());
      localStorage.setItem('calmora_last_stress_date', new Date().toLocaleDateString());
    }
  }, [stressLevel]);

  useEffect(() => {
    localStorage.setItem('calmora_lock_state', JSON.stringify(appLockState));
  }, [appLockState]);

  // Track active time and persist stats
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
        const today = new Date().toDateString();
        setUsageHistory(prev => {
            const updated = { ...prev, [today]: (prev[today] || 0) + 1 };
            localStorage.setItem('calmora_usage_history', JSON.stringify(updated));
            return updated;
        });
        setStats(prev => {
            const updated = { ...prev, activeMinutes: (prev.activeMinutes || 0) + 1 };
            localStorage.setItem('calmora_stats', JSON.stringify(updated));
            return updated;
        });
    }, 60000); // Clock tick every minute

    return () => clearInterval(interval);
  }, [user]);

  const awardPoints = (amount: number, reason?: string) => {
    // Points are harder to get now: reducing amount significantly
    const adjustedAmount = Math.max(1, Math.floor(amount * 0.3));
    setPoints(prev => prev + adjustedAmount);
    if (reason) setNotification({ message: `+${adjustedAmount} Karma: ${reason}`, type: 'success' });
  };

  const addPoints = (amount: number) => {
    awardPoints(amount);
  };

  const reduceStress = (amount: number) => {
    setStressLevel(prev => Math.max(0, prev - (amount || 0)));
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('calmora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('calmora_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('calmora_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('calmora_theme', theme);
  }, [theme]);

  // Auth Observer
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChange(async (fUser) => {
      setFbUser(fUser);
      if (fUser) {
        const userData = await firebaseService.getUserDoc(fUser.uid);
        if (userData) {
          setUser(userData as any);
        }
      } else {
        // Only clear user if there isn't a demo user already in state
        // Check localStorage to be safe
        const savedUser = localStorage.getItem('calmora_user');
        if (!savedUser) {
          setUser(null);
          if (!['splash', 'onboarding', 'login', 'register', 'authChoice', 'forgot'].includes(screen)) {
            setScreen('login');
          }
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [screen]);

  useEffect(() => {
    if (screen === 'splash' && !isLoading) {
      const timer = setTimeout(() => {
        if (appLockState.isEnabled) {
          setScreen('appLockVerify');
        } else if (user) {
          setScreen('home');
        } else if (onboardingCompleted) {
          setScreen('login');
        } else {
          setScreen('onboarding');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen, user, onboardingCompleted, appLockState.isEnabled, isLoading]);

  // Handle Sleep Timer
  useEffect(() => {
    let interval: any;
    if (sleepTimer !== null && isPlaying) {
      interval = setInterval(() => {
        setSleepTimer(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            setIsPlaying(false);
            setNotification({ message: lang === 'id' ? 'Sesi tidur berakhir. Musik dihentikan.' : 'Sleep session ended. Music stopped.', type: 'info' });
            return null;
          }
        });
      }, 60000); 
    }
    return () => clearInterval(interval);
  }, [sleepTimer, isPlaying, lang]);

  // Handle Notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Helper to handle screen navigation with history
  const navigate = (to: Screen, replace: boolean = false) => {
    if (replace) {
      setScreenHistory(prev => [...prev.slice(0, -1), to]);
    } else {
      setScreenHistory(prev => [...prev, to]);
    }
    setScreen(to);
  };

  const goBack = () => {
    if (user) setScreen('home');
    else setScreen('authChoice');
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    playerRef.current.seekTo(percentage);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const nextTrack = () => {
    const idx = SOUNDS.findIndex(s => s.id === currentSound?.id);
    if (idx === -1) return;
    const nextIdx = (idx + 1) % SOUNDS.length;
    setCurrentSound(SOUNDS[nextIdx]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const idx = SOUNDS.findIndex(s => s.id === currentSound?.id);
    if (idx === -1) return;
    const prevIdx = (idx - 1 + SOUNDS.length) % SOUNDS.length;
    setCurrentSound(SOUNDS[prevIdx]);
    setIsPlaying(true);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const { email, password } = loginForm;
    
    if (!email || !password) {
      setNotification({ message: lang === 'id' ? 'Email dan password wajib diisi' : 'Email and Password are required', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (email.trim().toLowerCase() === 'admin123@gmail.com' && password === 'admin123') {
        const demoUser = {
          name: 'Admin Demo',
          username: 'admindemo',
          email: 'admin123@gmail.com',
          photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
          bio: 'Peace seeker & Calmora explorer.',
          points: 1250,
          streak: 15,
          stats: { moodChecks: 45, journalsCreated: 28, stressChecks: 12, exercises: 56, breathingSessions: 22, sleepSessions: 18 }
        };
        setUser(demoUser);
        navigate('home', true);
        setNotification({ message: lang === 'id' ? 'Selamat datang kembali, Admin!' : 'Welcome back, Admin!', type: 'success' });
        setIsLoading(false);
        return;
      }
      
      await firebaseService.login(email, password);
      // navigation handled by auth observer
    } catch (error: any) {
      console.error("Login attempt failed:", error);
      setNotification({ message: lang === 'id' ? 'Email atau password salah' : 'Invalid email or password', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!regForm.email) return setNotification({ message: 'Email wajib diisi', type: 'error' });
    if (!regForm.password) return setNotification({ message: 'Password wajib diisi', type: 'error' });
    if (regForm.password !== regForm.confirm) return setNotification({ message: 'Konfirmasi password tidak cocok', type: 'error' });

    setIsLoading(true);
    try {
      await firebaseService.register(regForm.email, regForm.password, regForm.name);
      // Requirement: log out immediately and go back to login so user has to log in manually
      await firebaseService.logout();
      navigate('login', true);
      setNotification({ message: 'Akun berhasil dibuat, silakan login', type: 'success' });
    } catch (error: any) {
      setNotification({ message: error.message || 'Gagal mendaftar', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await firebaseService.logout();
    setUser(null);
    setPoints(0);
    setStreak(0);
    setStats({
      moodChecks: 0,
      journalsCreated: 0,
      breathingSessions: 0,
      sleepSessions: 0,
      stressChecks: 0,
      activeMinutes: 0
    });
    setUsageHistory({});
    setMoodLogs([]);
    setStressLevel(0);
    setJournals([]);
    setFavorites([]);
    localStorage.removeItem('calmora_points');
    localStorage.removeItem('calmora_stats');
    localStorage.removeItem('calmora_usage_history');
    localStorage.removeItem('calmora_stress_level');
    localStorage.removeItem('calmora_last_stress_date');
    setShowLogoutConfirm(false);
    setIsPlaying(false);
    setCurrentSound(null);
    setMiniPlayerVisible(false);
    setLoginForm({ email: '', password: '' });
    navigate('login', true);
    setNotification({ message: 'Anda telah keluar dengan aman', type: 'info' });
  };

  const renderScreenContent = () => {
    if (isLoading) {
      return (
        <div className={`flex flex-col items-center justify-center h-full gap-8 transition-colors duration-1000 ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className={`w-24 h-24 ${isDark ? 'bg-white/5' : 'bg-[#8EB486]/10'} rounded-[40px] flex items-center justify-center shadow-xl relative`}
           >
              <Heart className={`${isDark ? 'text-[#8EB486]' : 'text-[#8EB486]'} fill-current animate-pulse`} size={40} />
           </motion.div>
           <div className="space-y-4 text-center">
             <div className="w-12 h-1 bg-[#8EB486]/10 rounded-full mx-auto overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="w-full h-full bg-[#8EB486]"
               />
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-300 animate-pulse">Loading Peace</p>
           </div>
        </div>
      );
    }
    switch (screen) {
      case 'splash':
        return (
          <div className={`flex flex-col items-center justify-center h-full gap-8 transition-colors duration-1000 ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [1, 1.1, 1] }} 
              transition={{ 
                opacity: { duration: 1 },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
              }} 
              className={`w-28 h-28 ${isDark ? 'bg-white/10' : 'bg-[#8EB486]/10'} rounded-[45px] flex items-center justify-center shadow-2xl relative`}
            >
              <div className="absolute inset-0 bg-[#A7A6D1]/20 rounded-[45px] animate-ping" style={{ animationDuration: '3s' }} />
              <Heart className={`${isDark ? 'text-[#8EB486]' : 'text-[#8EB486]'} fill-current`} size={48} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center space-y-3"
            >
              <h1 className={`text-4xl font-serif font-black tracking-[0.2em] ${isDark ? 'text-white' : 'text-[#2D3436]'}`}>{t.appName}</h1>
              <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-[#8EB486]/60' : 'text-[#8EB486]'}`}>{t.slogan}</p>
            </motion.div>
            <div className="absolute bottom-20">
              <div className="w-12 h-1 bg-[#8EB486]/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full bg-[#8EB486]"
                />
              </div>
            </div>
          </div>
        );

      case 'onboarding':
        const onboardingData = t.onboarding || TRANSLATIONS['en'].onboarding;
        const onboardingImages = [
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=800&auto=format&fit=crop"
        ];
        
        return (
          <div className={`p-8 pt-10 flex flex-col h-full bg-[#FDFBF7] overflow-hidden`}>
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                  setOnboardingCompleted(true);
                  localStorage.setItem('calmora_onboarding_done', 'true');
                  setScreen('login');
                }}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 hover:text-[#A7A6D1] transition-colors"
              >
                Skip
              </button>
            </div>
            
            <div className="flex-grow flex flex-col relative mt-10">
              <div className="flex-grow overflow-hidden relative rounded-[60px] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={onboardingIndex}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={onboardingImages[onboardingIndex]} 
                      className="w-full h-full object-cover" 
                      alt="onboarding"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 space-y-6 text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${onboardingIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-serif text-neutral-800 leading-tight">
                      {onboardingData[onboardingIndex].title}
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed px-2 font-medium">
                      {onboardingData[onboardingIndex].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-3 pt-4">
                  {onboardingData.map((_, i: number) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-500 ${onboardingIndex === i ? 'w-10 bg-[#8EB486]' : 'w-2 bg-neutral-200'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="py-12 px-2 flex gap-4">
              {onboardingIndex < onboardingData.length - 1 ? (
                <button 
                  onClick={() => setOnboardingIndex(prev => prev + 1)}
                  className="w-full py-5 bg-[#8EB486] text-white rounded-[30px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8EB486]/30 active:scale-95 transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setOnboardingCompleted(true);
                    localStorage.setItem('calmora_onboarding_done', 'true');
                    setScreen('login');
                  }}
                  className="w-full py-5 bg-neutral-800 text-white rounded-[30px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/30 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        );

      case 'authChoice':
        return (
          <div className={`p-8 flex flex-col h-full items-center justify-center text-center ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-[#A7A6D1]/10 rounded-[40px] flex items-center justify-center text-[#A7A6D1] mb-12"
            >
              <Heart size={48} fill="currentColor" />
            </motion.div>
            
            <div className="space-y-4 mb-16">
              <h1 className="text-5xl font-serif italic text-neutral-800 tracking-tight">CALMORA</h1>
              <p className="text-neutral-400 text-sm font-medium px-8 leading-relaxed">
                {lang === 'id' 
                  ? 'Temukan ketenangan dan kesehatan mentalmu bersama kami.' 
                  : 'Find your peace and mental wellness with us.'}
              </p>
            </div>

            <div className="w-full space-y-4 px-4">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Sudah punya akun?</p>
                <Button onClick={() => setScreen('login')} isDark={isDark} className="py-6 rounded-[30px]">
                  {lang === 'id' ? 'Masuk ke Akun' : 'Sign In to Account'}
                </Button>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Belum punya akun?</p>
                <button 
                  onClick={() => setScreen('register')}
                  className={`w-full py-6 rounded-[30px] border-2 font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'border-white/10 text-white' : 'border-[#F5E6D3] text-neutral-500'}`}
                >
                  {lang === 'id' ? 'Daftar Akun Baru' : 'Create New Account'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'login':
        return (
          <div className={`p-8 pt-10 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <div className="mt-20 space-y-3 mb-10 text-center">
               <h2 className="text-5xl font-serif italic text-sage leading-tight">{t.welcomeBack}</h2>
               <p className="text-neutral-400 text-sm font-medium">Lanjutkan perjalanan menuju kedamaian.</p>
            </div>

            {notification && <div className="mb-6"><Notification {...notification} /></div>}

            <form className="space-y-4" onSubmit={handleLogin}>
                <Input 
                  label="Email" 
                  icon={Mail} 
                  type="email" 
                  placeholder={(t as any).loginEmailPlaceholder} 
                  value={loginForm.email}
                  onChange={(e: any) => setLoginForm({ ...loginForm, email: e.target.value })}
                  isDark={isDark}
                />
                <Input 
                  label="Password" 
                  icon={Lock} 
                  type="password" 
                  placeholder={(t as any).loginPasswordPlaceholder} 
                  value={loginForm.password}
                  onChange={(e: any) => setLoginForm({ ...loginForm, password: e.target.value })}
                  isDark={isDark}
                />
                <div className="flex justify-end pr-1">
                  <button type="button" onClick={() => setScreen('forgot')} className="text-[9px] font-black text-[#A7A6D1] uppercase tracking-widest hover:underline">{t.forgotPass}</button>
                </div>
                <Button type="submit" className="mt-2 py-4 rounded-xl" isDark={isDark} variant="primary">Login</Button>
             </form>

             <div className="mt-10 pt-6 border-t border-dashed border-neutral-100">
                <div className="text-center space-y-4">
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{(t as any).demoAccountLabel}</h3>
                  <div className={`p-4 rounded-2xl flex flex-col items-center gap-1 ${isDark ? 'bg-white/5' : 'bg-sage/5 border border-sage/20'}`}>
                    <div className="text-xs font-medium text-neutral-500">
                      Email: <span className="font-bold text-lavender select-all">admin123@gmail.com</span>
                    </div>
                    <div className="text-xs font-medium text-neutral-500">
                      Password: <span className="font-bold text-lavender select-all">admin123</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginForm({ email: 'admin123@gmail.com', password: 'admin123' });
                      setNotification({ message: 'Demo credentials loaded', type: 'info' });
                    }}
                    className="text-[9px] font-black text-sage uppercase tracking-widest hover:underline pt-2"
                  >
                    Auto-Fill Demo
                  </button>
                  <p className="text-[9px] text-neutral-400 italic">Daftar akun baru dengan email asli jika ingin mencoba Firebase secara penuh.</p>
                </div>
             </div>

             <div className="mt-auto py-6 text-center">
                <button onClick={() => setScreen('register')} className="text-xs font-black text-neutral-300 uppercase tracking-widest">
                  {lang === 'id' ? 'Belum punya akun? ' : 'New here? '}
                  <span className="text-[#8EB486]">Daftar</span>
                </button>
             </div>
          </div>
        );

      case 'register':
        return (
          <div className={`p-8 pt-10 flex flex-col h-full ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className="absolute top-10 left-8 p-3 rounded-2xl border transition-all hover:bg-[#8EB486]/10 text-neutral-400"><ChevronLeft size={20} /></button>
            <div className="mt-20 space-y-3 mb-10">
               <h2 className="text-5xl font-serif italic text-[#8EB486]">{t.createAccount}</h2>
               <p className="text-neutral-400 text-sm font-medium">Mulai langkah baru bersama CALMORA.</p>
            </div>

            {notification && <div className="mb-6"><Notification {...notification} /></div>}

            <form className="space-y-4" onSubmit={handleRegister}>
               <Input label="Full Name" placeholder="Sarah Mitchell" value={regForm.name} onChange={(e: any) => setRegForm({...regForm, name: e.target.value})} isDark={isDark} />
               <Input label="Email" type="email" placeholder="sarah@example.com" value={regForm.email} onChange={(e: any) => setRegForm({...regForm, email: e.target.value})} isDark={isDark} />
               <Input label="Password" type="password" placeholder="••••••••" value={regForm.password} onChange={(e: any) => setRegForm({...regForm, password: e.target.value})} isDark={isDark} />
               <Input label="Confirm Password" type="password" placeholder="••••••••" value={regForm.confirm} onChange={(e: any) => setRegForm({...regForm, confirm: e.target.value})} isDark={isDark} />
               <Button type="submit" className="mt-4 py-5 rounded-[25px] bg-[#8EB486]" isDark={isDark}>{t.signUp}</Button>
            </form>

            <div className="mt-auto py-8 text-center">
               <button onClick={() => setScreen('login')} className="text-xs font-black text-neutral-300 uppercase tracking-widest">
                 Sudah punya akun? <span className="text-[#8EB486]">Masuk</span>
               </button>
            </div>
          </div>
        );

      case 'forgot':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 border rounded-2xl transition-all active:scale-90 ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 shadow-sm'}`}><ChevronLeft size={20} /></button>
            <div className="mt-12 space-y-2 mb-10 text-center">
               <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Reset Password</h2>
               <p className="text-neutral-400 text-sm">Masukkan email untuk mendapatkan tautan pemulihan.</p>
            </div>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              // Simulated reset for demo
              setTimeout(() => {
                setIsLoading(false);
                setNotification({ message: 'Tautan reset berhasil dikirim ke email kamu.', type: 'success' });
                navigate('login', true);
              }, 1500);
            }}>
               <Input label="Registered Email" type="email" placeholder="email@example.com" required isDark={isDark} />
               <Button type="submit" isDark={isDark} className="py-4 rounded-xl">Kirim Link Reset</Button>
            </form>
          </div>
        );

      case 'home':
        return (
          <div className={`p-5 pb-24 overflow-y-auto h-full scrollbar-hide ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <header className="flex justify-between items-center mb-6 mt-2 relative z-10">
               <div className="flex items-center gap-3">
                  <button onClick={() => setScreen('profile')} className={`w-12 h-12 rounded-2xl border-2 overflow-hidden shadow-xl transition-all active:scale-90 ${isDark ? 'border-white/10' : 'border-[#A7A6D1]/30'}`}>
                    <img src={user?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Calmora'} alt="Profile" className="w-full h-full object-cover" />
                  </button>
                  <div>
                     <h1 className={`text-lg font-serif ${isDark ? 'text-white' : 'text-[#2D3436]'}`}>
                        {lang === 'id' ? 'Halo, ' : 'Hello, '} 
                        <span className="text-[#A7A6D1] font-bold italic">{user?.name?.split(' ')[0] || 'Teman'}</span>
                     </h1>
                     <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>
                           Poin: {points} • Streak: {streak} Hari
                        </p>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setScreen('rewards')}
                   className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-sm'}`}
                 >
                    <Flame size={14} className="text-lavender" fill="currentColor" />
                    <span className="text-xs font-bold text-lavender">{points}</span>
                 </motion.button>
               </div>
            </header>

            {!dismissedCards.includes('moodCheck') && (
              <section className={`p-6 rounded-[40px] border shadow-sm mb-6 relative overflow-hidden transition-all group hover:shadow-xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-neutral-100'}`}>
                 {hasCheckedMoodToday ? (
                   <div className="flex flex-col items-center py-4 relative z-10">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center text-sage mb-3">
                        <Check size={24} />
                      </motion.div>
                      <p className={`text-sm font-serif italic text-center ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                        {lang === 'id' ? 'Terima kasih sudah check-in hari ini 🌿' : 'Thank you for checking in today 🌿'}
                      </p>
                      <button onClick={() => dismissCard('moodCheck')} className="absolute top-0 right-0 p-3 text-neutral-300 hover:text-neutral-500 transition-colors">
                        <X size={14} />
                      </button>
                   </div>
                 ) : (
                   <>
                     <button onClick={() => dismissCard('moodCheck')} className="absolute top-5 right-5 z-20 p-2 text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all">
                       <X size={14} />
                     </button>
                     <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full -mr-16 -mt-16 bg-sage/20 group-hover:bg-lavender/20 transition-all duration-700`} />
                     <div className="relative z-10">
                       <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] text-center mb-6 ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>{t.howFeel}</h3>
                       <div className="grid grid-cols-4 gap-3">
                         {moodOptions.map((m) => (
                           <button 
                            key={m.id} 
                            onClick={() => { setSelectedMood(m as any); setScreen('mood'); }} 
                            className="flex flex-col items-center gap-2 group/btn"
                           >
                             <motion.div 
                               whileHover={{ y: -5 }}
                               whileTap={{ scale: 0.9 }}
                               className={`w-full aspect-square rounded-[22px] ${m.bg} flex items-center justify-center border border-transparent shadow-sm transition-all group-hover/btn:border-primary/20`}
                             >
                               <span className="text-2xl">{m.emoji}</span>
                             </motion.div>
                             <span className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>{m.label}</span>
                           </button>
                         ))}
                       </div>
                     </div>
                   </>
                 )}
              </section>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
                <button onClick={() => setScreen('breathing')} className={`group p-5 rounded-[35px] border flex flex-col items-start gap-4 transition-all hover:shadow-2xl active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                  <div className="w-12 h-12 bg-lavender rounded-2xl flex items-center justify-center text-white shadow-xl shadow-lavender/30 group-hover:scale-110 transition-transform"><Wind size={20} /></div>
                  <div className="text-left">
                    <h4 className={`font-serif text-base mb-0.5 ${isDark ? 'text-white' : 'text-neutral-800'}`}>{t.breathwork}</h4>
                    <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>{t.findRhythm}</p>
                  </div>
                </button>
                <button onClick={() => setScreen('sleep')} className={`group p-5 rounded-[35px] border flex flex-col items-start gap-4 transition-all hover:shadow-2xl active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                  <div className="w-12 h-12 bg-[#8EB486] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#8EB486]/30 group-hover:scale-110 transition-transform"><Moon size={20} /></div>
                  <div className="text-left">
                    <h4 className={`font-serif text-base mb-0.5 ${isDark ? 'text-white' : 'text-neutral-800'}`}>{t.sleepWell}</h4>
                    <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>{t.digitalCalm}</p>
                  </div>
                </button>
            </div>

            {!dismissedCards.includes('affirmation') && (
              <section className="px-1 mb-8 group relative">
                 <button onClick={() => dismissCard('affirmation')} className="absolute top-5 right-5 z-20 p-2 text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all">
                    <X size={14} />
                 </button>
                 <div className={`p-8 rounded-[40px] border shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-neutral-100'}`}>
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center justify-between uppercase tracking-[0.3em] text-[8px] font-black text-lavender">
                        <span className="flex items-center gap-2"><Sparkles size={10} className="animate-pulse" /> {t.affirmation}</span>
                        <Leaf size={12} className="text-sage" />
                      </div>
                      <p className={`text-xl font-serif italic leading-snug ${isDark ? 'text-white' : 'text-neutral-800'}`}>“{currentAffirmation}”</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className={`h-[1px] flex-grow ${isDark ? 'bg-white/10' : 'bg-neutral-100'}`} />
                        <div className="flex gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-sage/40" />
                           <div className="w-1.5 h-1.5 rounded-full bg-lavender/40" />
                           <div className="w-1.5 h-1.5 rounded-full bg-dusty-blue/40" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage/5 rounded-full blur-3xl translate-y-12 -translate-x-12" />
                 </div>
              </section>
            )}

              <section className="px-1 mb-8 relative group">
                 {!dismissedCards.includes('stressCard') && (
                    <div className={`p-6 rounded-[35px] border flex items-center justify-between transition-all group hover:shadow-lg ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-neutral-100 shadow-sm'}`}>
                      <button onClick={() => dismissCard('stressCard')} className="absolute top-2 right-4 p-2 text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={12} />
                      </button>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <Activity size={14} className="text-lavender" />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>Stress Level</span>
                        </div>
                        {stressHistory.length === 0 ? (
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium opacity-60">Belum ada data stress hari ini</h4>
                            <button onClick={() => setScreen('stress')} className="text-[10px] font-black text-lavender uppercase tracking-widest hover:underline">Mulai Cek Sekarang</button>
                          </div>
                        ) : (
                          <h4 className="text-xl font-serif">Level: <span className={stressLevel > 70 ? 'text-red-400' : stressLevel > 40 ? 'text-orange-400' : 'text-emerald-400'}>{stressLevel}%</span></h4>
                        )}
                      </div>
                      {stressHistory.length > 0 && (
                        <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden relative shadow-inner">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stressLevel}%` }}
                            className={`h-full transition-colors duration-500 ${stressLevel > 70 ? 'bg-red-400' : stressLevel > 40 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                           />
                        </div>
                      )}
                    </div>
                 )}
              </section>

            <section className="space-y-4">
               <div className="flex justify-between items-center px-1">
                 <h3 className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-neutral-400'}`}>{t.recentActivity}</h3>
                 <button onClick={() => setScreen('stats')} className="text-[8px] font-black text-[#A7A6D1] uppercase tracking-widest hover:underline">{t.viewProgress}</button>
               </div>
               <div className="space-y-2">
                 {[
                   { icon: PenLine, title: lang === 'id' ? 'Refleksi Jurnal' : 'Journal Reflection', color: 'text-blue-400', screenID: 'journal' },
                   { icon: Brain, title: lang === 'id' ? 'Cek Tingkat Stres' : 'Stress Level Check', color: 'text-[#8EB486]', screenID: 'stress' },
                 ].map((item, i) => (
                   <button key={i} onClick={() => setScreen(item.screenID as Screen)} className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-[#F5E6D3] hover:border-[#A7A6D1]/20 shadow-sm'}`}>
                     <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-neutral-50'}`}>
                       <item.icon size={16} className={item.color} />
                     </div>
                     <div className="flex-grow text-left">
                       <h4 className="text-xs font-bold opacity-80">{item.title}</h4>
                     </div>
                     <ChevronRight size={14} className="text-neutral-200" />
                   </button>
                 ))}
               </div>
            </section>
            
            {/* Mood Popup Logic Integration */}
            <AnimatePresence mode="wait">
               {selectedMood && (
                 <MoodModal 
                    mood={selectedMood} 
                    lang={lang}
                    isDark={isDark}
                    onCancel={() => setSelectedMood(null)}
                    onSave={async (note) => {
                       addPoints(10);
                       reduceStress(2);
                       const newLog = { mood: selectedMood, note, date: new Date().toLocaleDateString() };
                       setMoodLogs([newLog, ...moodLogs]);
                       setStats(prev => ({ ...prev, moodChecks: prev.moodChecks + 1 }));
                       setStreak(prev => prev === 0 ? 1 : prev); 
                       
                       // Firebase
                       if (user && fbUser) {
                         try {
                           await firebaseService.addMoodLog(fbUser.uid, { moodId: selectedMood.id, note });
                           await firebaseService.updateUserDoc(fbUser.uid, {
                             'stats.moodChecks': (user.stats?.moodChecks || 0) + 1,
                             points: points + 10,
                             streak: streak + 1 
                           });
                         } catch (e) {
                           console.error("Firebase Mood Log error:", e);
                         }
                       }

                       setNotification({ message: lang === 'id' ? 'Mood hari ini berhasil disimpan 🌿' : 'Mood today saved successfully 🌿', type: 'success' });
                       setSelectedMood(null);
                    }}
                 />
               )}
            </AnimatePresence>

            <BottomNav setScreen={setScreen} current="home" t={t} isDark={isDark} />
          </div>
        );

      case 'mood':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className={`absolute top-10 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 active:scale-90 shadow-sm'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-4 mb-12">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className={`w-28 h-28 ${isDark ? 'bg-white/5' : 'bg-[#A7A6D1]/10'} rounded-[50px] flex items-center justify-center mx-auto text-5xl shadow-2xl relative`}
               >
                 <div className="absolute inset-0 bg-[#A7A6D1]/5 rounded-[50px] animate-pulse" />
                 {selectedMood?.emoji || '😊'}
               </motion.div>
               <div className="space-y-1">
                  <h2 className={`text-3xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                    {lang === 'id' ? 'Kamu merasa' : 'You feel'} <span className="text-[#A7A6D1]">{selectedMood?.label}</span>
                  </h2>
                  <p className="text-neutral-400 text-sm font-medium">Apa yang membuatmu merasa seperti ini?</p>
               </div>
            </div>

            <div className="flex-grow space-y-8">
                <div className="flex flex-wrap justify-center gap-3">
                  {t.moodReasons[selectedMood?.id as keyof typeof t.moodReasons]?.map((reason: string) => (
                    <button 
                      key={reason} 
                      onClick={() => setMoodNote(prev => prev ? prev + ', ' + reason : reason)}
                      className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${moodNote.includes(reason) ? 'border-[#A7A6D1] bg-[#A7A6D1] text-white shadow-lg' : isDark ? 'bg-white/5 border-white/5 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-500 shadow-sm'}`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
               
               <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase text-neutral-300 tracking-[0.4em] ml-4">Personal Note</p>
                 <textarea 
                  placeholder={lang === 'id' ? "Catatan singkat (opsional)..." : "Quick note (optional)..."} 
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className={`w-full h-32 p-6 rounded-[35px] border outline-none font-serif text-base italic shadow-inner resize-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#A7A6D1]' : 'bg-white border-neutral-100 focus:border-[#A7A6D1] text-neutral-700'}`} 
                 />
               </div>
            </div>

            <div className="py-8">
               <Button onClick={() => {
                 addPoints(10);
                 setMoodLogs([{ mood: selectedMood, note: moodNote, date: new Date().toLocaleDateString() }, ...moodLogs]);
                 setStats(prev => ({ ...prev, moodChecks: prev.moodChecks + 1 }));
                 setStreak(prev => prev === 0 ? 1 : prev); 
                 setMoodNote('');
                 setScreen('moodSuccess');
               }} isDark={isDark} className="rounded-[30px] py-6 text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-lavender/20">
                 {t.save}
               </Button>
            </div>
          </div>
        );

      case 'moodSuccess':
        return (
          <div className={`p-8 flex flex-col h-full items-center justify-center text-center space-y-8 ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-20 h-20 bg-sage/20 rounded-[35px] flex items-center justify-center text-sage shadow-xl"
            >
               <CheckCircle size={40} />
            </motion.div>
            
            <div className="space-y-2 px-4">
               <h2 className={`text-3xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>{lang === 'id' ? 'Tersimpan!' : 'Saved!'}</h2>
               <p className="text-neutral-400 text-sm leading-relaxed">Terima kasih sudah meluangkan waktu untuk check-in perasaanmu hari ini.</p>
            </div>

            <div className="w-full space-y-3 px-2 max-w-xs">
               <button 
                 onClick={() => setScreen('journal')}
                 className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#F5E6D3] text-neutral-800 shadow-sm'}`}
               >
                 <div className="w-9 h-9 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center"><PenLine size={18} /></div>
                 <div className="text-left">
                   <h4 className="font-bold text-xs">{lang === 'id' ? 'Tulis Jurnal' : 'Write Journal'}</h4>
                 </div>
               </button>

               <button 
                 onClick={() => setScreen('stats')}
                 className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#F5E6D3] text-neutral-800 shadow-sm'}`}
               >
                 <div className="w-9 h-9 rounded-xl bg-[#A7A6D1]/10 text-[#A7A6D1] flex items-center justify-center"><Activity size={18} /></div>
                 <div className="text-left">
                   <h4 className="font-bold text-xs">{lang === 'id' ? 'Lihat Statistik' : 'View Stats'}</h4>
                 </div>
               </button>

               <div className="pt-4">
                 <Button 
                  onClick={() => {
                    setMoodNote('');
                    setSelectedMood(null);
                    setScreen('home');
                  }} 
                  className="py-4 bg-neutral-800 text-white rounded-xl"
                 >
                   {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
                 </Button>
               </div>
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className={`p-8 pt-24 h-full flex flex-col ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={() => navigate('home')} className={`z-10 absolute top-10 left-8 p-3 rounded-2xl border transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 shadow-sm'}`}>
              <ChevronLeft size={20} />
            </button>
            <div className="text-center space-y-2 mb-10">
              <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>{lang === 'id' ? 'Tuliskan Pikiranmu' : 'Release Your Mind'}</h2>
              <p className="text-neutral-400 text-sm">{lang === 'id' ? 'Biarkan semuanya mengalir keluar...' : 'Let everything flow out...'}</p>
            </div>
            <div className={`flex-grow rounded-[40px] border p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5 shadow-black/20 focus-within:border-[#A7A6D1]/30' : 'bg-white border-neutral-100 shadow-[#A7A6D1]/10 focus-within:border-[#A7A6D1]/20'}`}>
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <PenLine size={120} className={isDark ? 'text-white' : 'text-lavender'} />
              </div>
              <textarea 
                placeholder={lang === 'id' ? 'Aku merasa...' : 'I feel like...'} 
                className={`w-full h-full bg-transparent outline-none font-serif text-xl italic leading-relaxed placeholder:text-neutral-200 resize-none relative z-10 ${isDark ? 'text-white' : 'text-neutral-700'}`}
              />
            </div>
            <div className="py-10">
               <Button onClick={async () => {
                  const content = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                  if (!content) return setNotification({ message: lang === 'id' ? 'Tuliskan sesuatu dulu...' : 'Please write something first...', type: 'error' });
                  
                  setIsLoading(true);
                  try {
                    const aiReply = getAiReply(content);
                    setJournalAiReply(aiReply);
                    
                    if (user && fbUser) {
                      await firebaseService.addJournal(fbUser.uid, content);
                      await firebaseService.updateUserDoc(fbUser.uid, {
                        'stats.journalsCreated': (user.stats?.journalsCreated || 0) + 1,
                        points: points + 20
                      });
                    }
                    addPoints(20);
                    setStats(prev => ({ ...prev, journalsCreated: prev.journalsCreated + 1 }));
                    setScreen('journalAiFeedback');
                  } catch (e) {
                    setNotification({ message: lang === 'id' ? 'Gagal menyimpan jurnal' : 'Failed to save journal', type: 'error' });
                  } finally {
                    setIsLoading(false);
                  }
               }} isDark={isDark} className="rounded-full py-6 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-lavender/20">
                 {lang === 'id' ? 'Simpan Catatan' : 'Preserve Memory'}
               </Button>
            </div>
            <BottomNav setScreen={setScreen} current="home" t={t} isDark={isDark} />
          </div>
        );

      case 'journalAiFeedback':
        return (
          <div className={`p-8 pt-24 h-full flex flex-col items-center justify-center text-center relative overflow-hidden ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
             <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-lavender/5 to-transparent pointer-events-none" />
             <motion.div 
               initial={{ scale: 0.8, rotate: -10 }}
               animate={{ scale: 1, rotate: 0 }}
               className="w-24 h-24 bg-lavender/20 rounded-[40px] flex items-center justify-center text-lavender mb-10 shadow-2xl relative"
             >
                <div className="absolute inset-0 bg-lavender/20 rounded-[40px] animate-ping" style={{ animationDuration: '3s' }} />
                <Sparkles size={40} className="relative z-10" />
             </motion.div>
             <div className="space-y-8 max-w-sm relative z-10">
                <div className="space-y-2">
                  <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                      {lang === 'id' ? 'Sebuah Refleksi...' : 'A reflection...'}
                  </h2>
                  <p className="text-[10px] font-black uppercase text-lavender tracking-[0.4em]">Personal Insights</p>
                </div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`p-10 rounded-[50px] border leading-relaxed text-lg font-serif italic relative ${isDark ? 'bg-white/5 border-white/5 text-white/80' : 'bg-white border-neutral-100 text-neutral-600 shadow-2xl shadow-lavender/10'}`}
                >
                   <div className="absolute -top-4 left-10 p-2 bg-lavender rounded-xl text-white shadow-xl shadow-lavender/30">
                      <MessageSquare size={16} />
                   </div>
                   “{journalAiReply}”
                </motion.div>
                <div className="pt-6">
                  <Button onClick={() => setScreen('home')} isDark={isDark} className="rounded-[30px] py-6 px-12 shadow-xl shadow-lavender/20">
                     {lang === 'id' ? 'Terima Kasih 🌿' : 'Thank You 🌿'}
                  </Button>
                </div>
             </div>
          </div>
        );

      case 'stress':
        const stressQuestions = [
          { q: lang === 'id' ? 'Apakah kamu merasa sulit untuk beristirahat?' : 'Do you find it difficult to relax?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa sering marah karena hal sepele?' : 'Do you often feel irritated by trivial things?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa tidak bersemangat belakangan ini?' : 'Have you felt unmotivated lately?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu sulit untuk berkonsentrasi?' : 'Is it hard for you to concentrate?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa takut tanpa alasan yang jelas?' : 'Do you feel fearful for no apparent reason?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa sering merasa tegang?' : 'Do you feel tense frequently?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa sulit untuk memulai sesuatu?' : 'Do you find it hard to start tasks?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa masa depan terlihat suram?' : 'Does the future feel bleak to you?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa mudah panik dalam situasi tertentu?' : 'Do you panic easily in certain situations?', o: [0, 1, 2, 3] },
          { q: lang === 'id' ? 'Apakah kamu merasa hidup ini kurang bermakna?' : 'Does life feel less meaningful recently?', o: [0, 1, 2, 3] }
        ];
        const optionsLabels = [
          lang === 'id' ? 'Tidak Pernah' : 'Never',
          lang === 'id' ? 'Kadang-kadang' : 'Sometimes',
          lang === 'id' ? 'Sering' : 'Often',
          lang === 'id' ? 'Sangat Sering' : 'Very Often'
        ];

        const handleStressAnswer = async (val: number) => {
          const newAnswers = [...stressAnswers, val];
          if (stressStep < stressQuestions.length - 1) {
            setStressAnswers(newAnswers);
            setStressStep(stressStep + 1);
          } else {
            const total = newAnswers.reduce((a, b) => a + b, 0);
            const calculatedStress = Math.min(100, Math.round((total / (stressQuestions.length * 3)) * 100));
            setStressScore(total);
            setStressLevel(calculatedStress);
            setStressHistory(prev => {
              const updated = [...prev, { score: total, level: calculatedStress, date: new Date().toISOString() }];
              localStorage.setItem('calmora_stress_history', JSON.stringify(updated));
              return updated;
            });
            setStats(prev => ({ ...prev, stressChecks: prev.stressChecks + 1 }));
            
            // Save to Firebase
            if (user) {
              try {
                await firebaseService.addStressCheck(fbUser!.uid, total, calculatedStress);
                await firebaseService.updateUserDoc(fbUser!.uid, {
                  'stats.stressChecks': (user.stats?.stressChecks || 0) + 1,
                  points: points + 50
                });
                addPoints(50);
              } catch (e) {
                console.error("Failed to save stress check:", e);
              }
            }
            
            setScreen('stressResult');
            setStressAnswers([]);
            setStressStep(0);
          }
        };

        return (
          <div className={`p-8 pt-20 flex flex-col h-full ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}>
             <button onClick={() => { goBack(); setStressStep(0); setStressAnswers([]); }} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 font-bold shadow-sm active:scale-95'}`}><ChevronLeft size={20} /></button>
             <div className="mb-10 px-2 lg:mt-8">
                <div className="flex justify-between items-end mb-3">
                  <h2 className={`text-3xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Stress Check</h2>
                  <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Q {stressStep + 1} / {stressQuestions.length}</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden shadow-inner ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`}>
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((stressStep + 1) / stressQuestions.length) * 100}%` }}
                    className="h-full bg-[#A7A6D1]" 
                   />
                </div>
             </div>
             <div className="flex-grow flex flex-col px-2">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={stressStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <h3 className={`text-2xl font-serif leading-tight italic ${isDark ? 'text-white/80' : 'text-neutral-800'}`}>{stressQuestions[stressStep].q}</h3>
                    <div className="space-y-3">
                      {optionsLabels.map((lbl, i) => (
                        <button 
                          key={lbl} 
                          onClick={() => handleStressAnswer(i)} 
                          className={`w-full p-4 text-left rounded-2xl border font-bold text-sm transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-[#F5E6D3] text-neutral-500 hover:border-[#A7A6D1] hover:text-[#A7A6D1]'}`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        );

      case 'stressResult':
        const stressValue = stressScore;
        const maxScore = 30; // 10 questions * 3
        const percentageStr = Math.round((stressValue / maxScore) * 100);
        
        let stressLvlStatus: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
        if (percentageStr > 75) stressLvlStatus = 'Severe';
        else if (percentageStr > 50) stressLvlStatus = 'High';
        else if (percentageStr > 25) stressLvlStatus = 'Moderate';

        const levelData = {
          Low: { t: 'Level 1 — Low Stress 🌿', d: lang === 'id' ? 'Kondisi masih ringan' : 'Manageable state', color: 'text-emerald-500', bg: 'bg-emerald-400/10', actions: ['Mood Tracker', 'Daily Reflection', 'Daily Affirmation'] },
          Moderate: { t: 'Level 2 — Moderate Stress ☁️', d: lang === 'id' ? 'Mulai perlu perhatian' : 'Needs attention', color: 'text-amber-500', bg: 'bg-amber-400/10', actions: ['Brain Dump Journal', 'Breathing Exercise', 'Sleep Relax Mode'] },
          High: { t: 'Level 3 — High Stress 🌧️', d: lang === 'id' ? 'Sudah cukup berat' : 'Feeling heavy', color: 'text-orange-500', bg: 'bg-orange-400/10', actions: ['Calm Now Feature', 'Guided Reflection', 'Trusted Support'] },
          Severe: { t: 'Level 4 — Severe Stress ⚠️', d: lang === 'id' ? 'Butuh perhatian serius' : 'Critical state', color: 'text-red-500', bg: 'bg-red-400/10', actions: ['Immediate Calm Support', 'Trusted Support', 'Speak to Professional'] }
        };
        const currentLvl = levelData[stressLvlStatus];

        return (
          <div className={`p-8 pt-10 flex flex-col h-full text-center ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <header className="flex justify-between items-center mb-6">
              <button onClick={goBack} className={`p-2 rounded-xl transition-all ${isDark ? 'text-white/40' : 'text-neutral-400'}`}><ChevronLeft size={20} /></button>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Analysis Result</h3>
              <div className="w-8" />
            </header>

            <div className="relative w-32 h-32 mx-auto mb-8">
               <svg className="w-full h-full" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : '#F5E6D3'} strokeWidth="10" />
                 <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={stressValue > 12 ? '#F87171' : stressValue > 8 ? '#FB923C' : '#34D399'} 
                  strokeWidth="10" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * percentageStr) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-serif font-bold ${currentLvl.color}`}>{percentageStr}%</span>
                  <span className="text-[7px] font-black uppercase tracking-tighter opacity-40">Stress</span>
               </div>
            </div>
            
            <div className="space-y-2 mb-8">
               <h2 className={`text-2xl font-serif italic ${currentLvl.color}`}>{currentLvl.t}</h2>
               <p className="text-neutral-400 text-xs px-6 font-medium leading-relaxed">{currentLvl.d}</p>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto scrollbar-hide px-1 mb-6">
               <p className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.3em] text-center">Recommended Actions</p>
               <div className="grid grid-cols-1 gap-3">
                  {currentLvl.actions.map(action => {
                    let target: Screen = 'home';
                    let Icon = Zap;
                    if (action.includes('Breathing')) { target = 'breathing'; Icon = Wind; }
                    if (action.includes('Journal') || action.includes('Reflection')) { target = 'journal'; Icon = PenLine; }
                    if (action.includes('Sleep')) { target = 'sleep'; Icon = Moon; }
                    if (action.includes('Calm Now')) { target = 'calmNow'; Icon = ShieldCheck; }
                    if (action.includes('Support')) { target = 'emergency'; Icon = Phone; }
                    if (action.includes('Professional')) { target = 'contactSupport'; Icon = HelpCircle; }
                    if (action.includes('Mood')) { target = 'mood'; Icon = Smile; }

                    return (
                      <button 
                        key={action}
                        onClick={() => {
                          if (target === 'mood') {
                            setSelectedMood({ id: 'calm', icon: Smile, label: 'Calm', emoji: '😌' });
                            setScreen('mood');
                          } else {
                            setScreen(target);
                          }
                        }}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between active:scale-98 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-sm'}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentLvl.bg} ${currentLvl.color}`}><Icon size={16} /></div>
                            <span className="text-xs font-bold opacity-80">{action}</span>
                         </div>
                         <ArrowUpRight size={14} className="text-neutral-200" />
                      </button>
                    )
                  })}
               </div>
            </div>

            <div className="pb-24 pt-4 border-t border-dashed border-neutral-100">
               <Button onClick={() => setScreen('home')} isDark={isDark} variant="black" className="py-4 rounded-xl">Back to Dashboard</Button>
            </div>
            <BottomNav setScreen={setScreen} current="home" t={t} isDark={isDark} />
          </div>
        );

      case 'rewards':
        const rewardsList = [
          { cost: 250, title: 'Calmora Premium Themes', desc: 'Unlock exclusive zen aesthetics.', icon: Monitor, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          { cost: 500, title: 'Focus Music Vol. 1', desc: '60 mins of productivity beats.', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { cost: 750, title: 'Wellness Checklist PDF', desc: 'Expert tips for daily mindfulness.', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { cost: 1500, title: 'Indomaret / Alfamart Voucher', desc: 'Rp 10.000 Shopping voucher.', icon: ShoppingCart, color: 'text-sage', bg: 'bg-sage/10' },
          { cost: 3000, title: 'GOPAY / OVO Balance', desc: 'Rp 25.000 digital wallet balance.', icon: Wallet, color: 'text-lavender', bg: 'bg-lavender/10' },
        ];
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className={`z-10 absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <div className="flex items-center justify-center gap-2 text-lavender pt-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}><Flame size={28} fill="currentColor" /></motion.div>
                  <span className="text-3xl font-serif font-black">{points}</span>
                  <span className="text-[10px] font-black uppercase text-neutral-300 tracking-widest pt-2">pts</span>
               </div>
               <h2 className="text-xl font-serif mt-2">Calm Rewards</h2>
               <p className="text-neutral-400 text-xs px-8 leading-relaxed">Tukar poin ketenanganmu dengan hadiah nyata yang mendukung progresmu.</p>
            </div>
            
            <div className="space-y-4 pb-12">
               {rewardsList.map((reward, i) => (
                 <div key={i} className={`p-5 rounded-[40px] border flex items-center gap-4 transition-all ${isDark ? 'bg-white/5 border-white/10 shadow-white/5' : 'bg-white border-neutral-100 shadow-sm'}`}>
                    <div className={`w-14 h-14 rounded-[28px] flex items-center justify-center shadow-inner ${reward.bg} ${reward.color}`}>
                       <reward.icon size={24} />
                    </div>
                    <div className="flex-grow space-y-0.5">
                       <h4 className="font-bold text-sm">{reward.title}</h4>
                       <p className="text-[10px] text-neutral-400 font-medium opacity-60">{reward.desc}</p>
                       <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] font-black text-lavender uppercase tracking-widest">{reward.cost} Pts</span>
                          <button 
                            onClick={() => setRedeemTarget(reward)}
                            disabled={points < reward.cost}
                            className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${points >= reward.cost ? 'bg-lavender text-white shadow-xl shadow-lavender/30' : 'bg-neutral-50 text-neutral-300 border border-neutral-100'}`}
                          >
                            Redeem
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <AnimatePresence>
              {redeemTarget && (
                <RedeemModal 
                  reward={redeemTarget} 
                  isDark={isDark} 
                  points={points} 
                  lang={lang}
                  onCancel={() => setRedeemTarget(null)}
                  onConfirm={() => {
                    setPoints(prev => prev - redeemTarget.cost);
                    setRedeemTarget(null);
                    setNotification({ message: lang === 'id' ? 'Hadiah berhasil diredeem! Cek email kamu.' : 'Reward redeemed! Check your email.', type: 'success' });
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        );

      case 'appLockVerify':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center space-y-12">
             <div className="space-y-4">
                <div className="w-20 h-20 bg-lavender/10 rounded-[35px] flex items-center justify-center text-lavender mx-auto shadow-inner">
                   <Lock size={32} />
                </div>
                <h2 className="text-3xl font-serif italic">Welcome Back</h2>
                <p className="text-neutral-400 text-sm">Verify your identity to enter Calmora.</p>
             </div>
             
             <div className="space-y-8 w-full max-w-xs">
                <div className="flex justify-center gap-4">
                   {[...Array(4)].map((_, i) => (
                     <div 
                      key={i} 
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        appLockState.confirmPin.length > i 
                          ? 'bg-lavender border-lavender shadow-lg shadow-lavender/30' 
                          : isDark ? 'border-white/10' : 'border-neutral-200'
                      }`}
                     />
                   ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'X'].map((n, i) => (
                     <button 
                      key={i} 
                      disabled={n === ''}
                      onClick={() => {
                        if (n === 'X') {
                          setAppLockState((prev: any) => ({ ...prev, confirmPin: prev.confirmPin.slice(0, -1) }));
                        } else if (typeof n === 'number' && appLockState.confirmPin.length < 4) {
                          const newPin = appLockState.confirmPin + n;
                          setAppLockState((prev: any) => ({ ...prev, confirmPin: newPin }));
                          if (newPin.length === 4) {
                            if (newPin === appLockState.pin) {
                              setScreen(user ? 'home' : 'login');
                              setAppLockState((prev: any) => ({ ...prev, confirmPin: '' }));
                              setNotification({ message: 'Welcome back!', type: 'success' });
                            } else {
                              setNotification({ message: 'Invalid PIN', type: 'error' });
                              setAppLockState((prev: any) => ({ ...prev, confirmPin: '' }));
                            }
                          }
                        }
                      }}
                      className={`aspect-square rounded-[30px] flex items-center justify-center transition-all active:scale-90 ${n === '' ? 'opacity-0' : isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white border border-neutral-100 hover:bg-neutral-50 text-neutral-600'}`}
                     >
                        <span className="text-2xl font-serif">{n}</span>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'breathing':
        return <BreathingSession onBack={goBack} onFinish={() => {
          reduceStress(10);
          setStats(prev => ({ ...prev, breathingSessions: prev.breathingSessions + 1 }));
        }} isDark={isDark} />;

      case 'sleep':
        const categories = ['Sleep Better', 'Focus Mode', 'Anxiety Relief', 'Stress Relief', 'Meditation'];
        return (
          <div className={`p-8 pt-20 flex flex-col h-full ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'} transition-colors duration-500`}>
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Sleep Relax</h2>
               <p className={`${isDark ? 'text-white/30' : 'text-neutral-400'} text-sm`}>Drift into a peaceful slumber.</p>
            </div>
            
            <div className="flex-grow space-y-8 overflow-y-auto scrollbar-hide pb-32">
               <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1 pb-2">
                 {categories.map(cat => (
                   <button key={cat} className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}>
                     {cat}
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                 <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/20' : 'text-neutral-300'} ml-2`}>Recommended for you</h4>
                 {SOUNDS.map(sound => {
                    const Icon = sound.icon;
                    const isActive = currentSound?.id === sound.id;
                    return (
                      <div 
                        key={sound.id} 
                        className={`w-full p-4 rounded-[40px] border flex items-center gap-4 transition-all relative ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3] shadow-sm'}`}
                      >
                        <button 
                          onClick={() => {
                            setCurrentSound(sound);
                            setScreen('musicPlayer');
                            if (!isPlaying) setIsPlaying(true);
                          }}
                          className="flex flex-grow items-center gap-4 text-left overflow-hidden group"
                        >
                          <div className="w-16 h-16 rounded-[28px] overflow-hidden shadow-2xl relative flex-shrink-0">
                            <img src={sound.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={sound.title} />
                            {isActive && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                 <div className="flex gap-1 items-end h-4">
                                    <motion.div animate={{ height: isPlaying ? [4, 16, 4] : 4 }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: isPlaying ? [8, 4, 12] : 8 }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: isPlaying ? [5, 12, 6] : 5 }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                                 </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                               <h4 className={`font-bold text-sm tracking-tight truncate ${isActive ? 'text-lavender' : isDark ? 'text-white' : 'text-neutral-800'}`}>{sound.title}</h4>
                               {isActive && <div className="w-1.5 h-1.5 rounded-full bg-lavender animate-pulse" />}
                            </div>
                            <p className={`text-[10px] font-medium ${isDark ? 'text-white/30' : 'text-neutral-400'} uppercase tracking-widest truncate`}>{sound.category}</p>
                          </div>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isActive) setIsPlaying(!isPlaying);
                            else { 
                              setCurrentSound(sound); 
                              setIsPlaying(true); 
                            }
                          }}
                          className={`w-12 h-12 rounded-[22px] flex items-center justify-center transition-all flex-shrink-0 active:scale-90 ${isActive && isPlaying ? 'bg-lavender text-white shadow-lg shadow-lavender/40' : isDark ? 'bg-white/5 text-white/40' : 'bg-neutral-50 text-neutral-300'}`}
                        >
                           {isActive && isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} className="ml-1" />}
                        </button>
                      </div>
                    );
                  })}
               </div>
            </div>
            <BottomNav setScreen={setScreen} current="home" t={t} isDark={isDark} />
          </div>
        );

      case 'musicPlayer':
        if (!currentSound) return null;
        return (
          <div className={`p-8 pt-10 flex flex-col h-full ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'} transition-all duration-700 relative overflow-hidden`}>
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-[#A7A6D1]/40' : 'bg-[#A7A6D1]/30'}`} />
              <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-[#8EB486]/40' : 'bg-[#8EB486]/30'}`} />
            </div>

            <div className="flex justify-between items-center z-20 mb-8 px-2">
              <button 
                onClick={goBack} 
                className={`p-4 rounded-3xl border transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-neutral-100 text-neutral-400 shadow-sm'}`}
              >
                <ChevronDown size={22} />
              </button>
              <div className="text-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDark ? 'text-white/20' : 'text-neutral-400'}`}>Relax Sound</span>
              </div>
              <button 
                onClick={() => setShowTimerModal(true)}
                className={`p-4 rounded-3xl border transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-neutral-100 text-neutral-400 shadow-sm'}`}
              >
                <Timer size={22} className={sleepTimer ? 'text-[#A7A6D1]' : ''} />
              </button>
            </div>

            {notification && (
              <div className="absolute top-24 left-8 right-8 z-[100]">
                <Notification {...notification} />
              </div>
            )}
            

            <div className="flex-grow flex flex-col items-center justify-center gap-12 relative z-10 py-10">
              <div className="relative">
                <motion.div 
                   animate={{ 
                     rotate: isPlaying ? 360 : 0,
                     scale: isPlaying ? 1.05 : 1
                   }}
                   transition={{ 
                     rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                     scale: { duration: 1, ease: 'easeInOut' }
                   }}
                   className={`w-72 h-72 rounded-full overflow-hidden shadow-[0_45px_90px_-15px_rgba(0,0,0,0.4)] relative border-4 ${isDark ? 'border-white/10' : 'border-white'}`}
                >
                  <img src={currentSound.image} className="w-full h-full object-cover" alt={currentSound.title} />
                  <div className="absolute inset-0 bg-black/5" />
                </motion.div>
                
                {isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-8 pointer-events-none"
                  >
                    <div className="absolute inset-0 border border-[#A7A6D1]/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                    <div className="absolute inset-4 border border-[#8EB486]/10 rounded-full animate-ping" style={{ animationDuration: '6s' }} />
                  </motion.div>
                )}
              </div>

              <div className="text-center w-full px-8 space-y-4">
                <div className="space-y-2">
                  <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>{currentSound.title}</h2>
                </div>
              </div>

              <div className="w-full max-w-[300px] space-y-12">
                <div className="flex items-center justify-center gap-10">
                   <button onClick={prevTrack} className="text-neutral-300 hover:text-[#A7A6D1] transition-all p-2 active:scale-75"><ChevronLeft size={44} strokeWidth={1} /></button>
                   <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-24 h-24 rounded-[40px] flex items-center justify-center shadow-2xl transition-all border-2 ${isDark ? 'bg-white text-neutral-900 border-white/5' : 'bg-[#A7A6D1] text-white border-[#A7A6D1]/10 shadow-[#A7A6D1]/40'}`}>
                      {isPlaying ? <Pause fill="currentColor" size={36} /> : <Play fill="currentColor" size={36} className="ml-1" />}
                   </motion.button>
                   <button onClick={nextTrack} className="text-neutral-300 hover:text-[#A7A6D1] transition-all p-2 active:scale-75"><ChevronRight size={44} strokeWidth={1} /></button>
                </div>

                <div className="flex items-center justify-center gap-4 px-8 opacity-40 hover:opacity-100 transition-opacity">
                    <Volume2 size={18} className="text-[#A7A6D1] flex-shrink-0" />
                    <div onClick={handleVolumeChange} className={`h-1.5 flex-grow rounded-full cursor-pointer relative overflow-hidden bg-neutral-200/20`}>
                        <div className={`h-full bg-[#A7A6D1]`} style={{ width: `${volume * 100}%` }} />
                    </div>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {showTimerModal && (
                <TimerModal 
                  isDark={isDark} 
                  lang={lang}
                  onClose={() => setShowTimerModal(false)} 
                  onSet={(val: number | null) => {
                    setSleepTimer(val);
                    setShowTimerModal(false);
                    setNotification({ message: val ? `Timer set for ${val}m` : 'Timer turned off', type: 'info' });
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        );

      case 'emergency':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}>
            <button onClick={goBack} className={`absolute top-10 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 font-bold shadow-sm active:scale-90'}`}><ChevronLeft size={20} /></button>
            <header className="text-center space-y-6 mb-16">
               <div className="w-24 h-24 bg-red-400/10 rounded-[50px] flex items-center justify-center mx-auto text-red-500 shadow-2xl relative group border border-red-500/10">
                  <div className="absolute inset-0 bg-red-500/20 rounded-[50px] animate-ping" style={{ animationDuration: '3s' }} />
                  <ShieldCheck size={40} className="relative z-10" />
               </div>
               <div className="space-y-1">
                  <h2 className={`text-5xl font-serif italic text-red-500`}>Safe Space</h2>
                  <p className="text-neutral-400 text-xs font-medium px-8 leading-relaxed">Dukungan instan saat kamu merasa panik, cemas berlebihan, atau butuh bantuan segera.</p>
               </div>
            </header>

            <div className="space-y-6 flex-grow overflow-y-auto scrollbar-hide pb-20 px-1">
               <Button 
                onClick={() => setScreen('calmNow')} 
                className="py-10 rounded-[45px] bg-red-500 text-white shadow-2xl shadow-red-500/20 flex flex-col items-center justify-center gap-2 group overflow-hidden relative"
               >
                 <div className="flex items-center gap-4 text-xl italic font-serif relative z-10">
                    <Zap size={24} /> {lang === 'id' ? 'Aktifkan Calm Now' : 'Activate Calm Now'}
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 relative z-10">Sentuh untuk Penanganan Instan</p>
                 <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               </Button>
               
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 text-center mt-12 mb-4">Immediate Relief Techniques</p>

               <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'breathing', label: 'Start Breathing Now', icon: Wind, desc: 'Atur ritme napasmu sekarang', color: 'text-blue-400', bg: 'bg-blue-400/5' },
                    { id: 'grounding', label: 'Grounding 5-4-3-2-1', icon: Footprints, desc: 'Fokus pada lingkungan sekitar', color: 'text-sage', bg: 'bg-[#8EB486]/5' },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setScreen(item.id as Screen)}
                      className={`w-full p-6 rounded-[35px] border flex items-center justify-between transition-all active:scale-[0.98] group ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3] shadow-sm hover:border-[#A7A6D1]/30'}`}
                    >
                      <div className="text-left flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-white/5' : item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}><item.icon size={24} /></div>
                        <div>
                          <h4 className="font-bold text-sm opacity-80">{item.label}</h4>
                          <p className="text-[10px] text-neutral-400 italic font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-neutral-200" />
                    </button>
                  ))}
               </div>

               <div className="pt-10 mb-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 ml-4 mb-4">Quick Support Contact</p>
                  <button 
                    onClick={() => window.location.href = 'tel:+6283821861984'}
                    className={`w-full p-8 rounded-[45px] border-2 border-dashed bg-white text-neutral-800 flex items-center justify-between active:scale-95 transition-all shadow-sm group ${isDark ? 'bg-white/5 border-white/5 text-white/80' : 'border-[#F5E6D3] hover:border-[#A7A6D1]'}`}
                   >
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-400/10 rounded-3xl flex items-center justify-center text-red-500 shadow-inner group-hover:rotate-12 transition-transform"><Phone size={28} /></div>
                        <div className="text-left space-y-1">
                           <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-[#A7A6D1]">Trusted Support</h4>
                           <p className="text-base font-bold opacity-90 tracking-tight">+62 838 218 61984</p>
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200 group-hover:bg-red-500 group-hover:text-white group-hover:rotate-45 transition-all"><ArrowUpRight size={22} /></div>
                   </button>
               </div>
            </div>

            <BottomNav setScreen={setScreen} current="emergency" t={t} isDark={isDark} />
          </div>
        );

      case 'calmNow':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full bg-[#111122] text-white relative overflow-hidden`}>
             <button onClick={goBack} className="absolute top-10 left-8 p-3 rounded-2xl border border-white/10 text-white/40 active:scale-90 transition-all z-20"><ChevronLeft size={20} /></button>
             
             <div className="absolute inset-0 bg-blue-900/10 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2 opacity-60" />
             <div className="absolute inset-0 bg-red-900/10 blur-[150px] rounded-full translate-y-1/2 translate-x-1/2 opacity-60" />
             
             <header className="text-center space-y-10 relative z-10 mb-20 mt-8">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-28 h-28 bg-white/10 rounded-[50px] flex items-center justify-center text-blue-400 mx-auto shadow-2xl border border-white/10">
                   <ShieldCheck size={56} className="animate-pulse" />
                </motion.div>
                <div className="space-y-4 px-6">
                   <div className="inline-block px-5 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                      <p className="text-[10px] font-black uppercase text-blue-300 tracking-[0.4em]">Safe Haven Support</p>
                   </div>
                   <h2 className="text-6xl font-serif italic text-white tracking-tighter">Breathe. You're Safe.</h2>
                   <p className="text-white/40 text-sm font-medium leading-relaxed italic px-4">“Tenangkan pikiranmu, tarik napas perlahan. Kami di sini untuk menjagamu tetap aman dan tenang.”</p>
                </div>
             </header>

             <div className="space-y-4 relative z-10 flex-grow overflow-y-auto scrollbar-hide pb-10">
                {[
                  { label: 'Start Breathing Now', icon: Wind, screen: 'breathing', color: 'bg-blue-500/20 text-blue-400' },
                  { label: 'Grounding Technique', icon: Footprints, screen: 'grounding', color: 'bg-[#8EB486]/20 text-[#8EB486]' },
                  { label: 'Panic Relief Guide', icon: ShieldCheck, screen: 'emergency', color: 'bg-red-500/20 text-red-400' },
                  { label: 'Calm Music Instantly', icon: Music, screen: 'sleep', color: 'bg-[#A7A6D1]/20 text-[#A7A6D1]' },
                  { label: 'Quick Journal Dump', icon: PenLine, screen: 'journal', color: 'bg-amber-400/20 text-amber-400' },
                  { label: 'Positive Affirmation', icon: Sparkles, screen: 'home', color: 'bg-pink-400/20 text-pink-400' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => setScreen(item.screen as Screen)}
                    className="w-full p-6 rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-6">
                       <div className={`w-16 h-16 ${item.color} rounded-[25px] flex items-center justify-center shadow-xl border border-white/5 group-hover:scale-105 transition-transform`}><item.icon size={26} /></div>
                       <span className="font-bold text-lg text-white/80 group-hover:text-white transition-opacity tracking-tight">{item.label}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white group-hover:rotate-45 transition-all"><ArrowUpRight size={22} /></div>
                  </button>
                ))}
             </div>

             <div className="relative z-10 py-10">
                <button onClick={() => setScreen('home')} className="w-full py-6 bg-white text-neutral-900 rounded-[40px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all hover:bg-white/90">Selesai, Saya Lebih Baik 🌿</button>
             </div>
          </div>
        );

      case 'grounding':
        const steps = [
          { i: '5', t: lang === 'id' ? 'Hal yang bisa dilihat' : 'Things you can see', d: lang === 'id' ? 'Fokus pada 5 benda di sekitarmu: pohon, jam, pena, dll.' : 'Focus on 5 objects around you: a tree, a clock, a pen, etc.' },
          { i: '4', t: lang === 'id' ? 'Hal yang bisa disentuh' : 'Things you can touch', d: lang === 'id' ? 'Rasakan tekstur 4 benda: bajumu, meja, kulitmu, dll.' : 'Feel 4 textures: your shirt, the table, your skin, etc.' },
          { i: '3', t: lang === 'id' ? 'Hal yang bisa didengar' : 'Things you can hear', d: lang === 'id' ? 'Dengarkan 3 suara: burung, kipas, atau napasmu.' : 'Listen for 3 sounds: birds, a fan, or your own breath.' },
          { i: '2', t: lang === 'id' ? 'Hal yang bisa dicium' : 'Things you can smell', d: lang === 'id' ? 'Identifikasi 2 aroma: parfum, kopi, atau udara segar.' : 'Identify 2 smells: perfume, coffee, or fresh air.' },
          { i: '1', t: lang === 'id' ? 'Hal yang bisa dirasakan' : 'Thing you can taste', d: lang === 'id' ? 'Rasakan 1 rasa di mulutmu: sisa kopi atau permen.' : 'Feel 1 taste in your mouth: coffee aftertaste or mint.' },
        ];
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#14142B]' : 'bg-[#FAFAFA]'}`}>
            <button onClick={goBack} className={`absolute top-10 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 font-bold shadow-sm'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-4 mb-10 px-4">
               <h2 className="text-4xl font-serif italic text-sage">Calm Grounding Guide</h2>
               <div className="inline-block px-4 py-1.5 bg-[#A7A6D1]/10 rounded-full">
                  <p className="text-[10px] font-black uppercase text-[#A7A6D1] tracking-widest">Teknik 5-4-3-2-1</p>
               </div>
               <p className="text-neutral-400 text-xs leading-relaxed px-6 font-medium mt-2">“Metode sederhana untuk membantu menenangkan pikiran saat panik, overthinking, atau anxiety tinggi dengan fokus pada lingkungan sekitar.”</p>
            </div>
            
            <div className="space-y-6 flex-grow pb-24">
               {steps.map((step, idx) => (
                 <motion.div 
                   key={step.i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className={`p-6 rounded-[35px] border flex items-center gap-6 shadow-sm group hover:border-[#A7A6D1] transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}
                 >
                    <div className="w-14 h-14 rounded-2xl bg-sage flex items-center justify-center text-white text-xl font-serif font-black shadow-lg shadow-sage/20 group-hover:scale-110 transition-transform">{step.i}</div>
                    <div className="flex-grow">
                       <h4 className={`font-bold text-sm ${isDark ? 'text-white/80' : 'text-neutral-800'}`}>{step.t}</h4>
                       <p className="text-[10px] text-neutral-400 leading-relaxed italic">{step.d}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className={`p-10 rounded-[50px] border text-center space-y-4 mb-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3] shadow-sm'}`}>
                <p className="text-[10px] font-black uppercase text-neutral-300 tracking-widest">Fokus pada momen sekarang.</p>
                <Button onClick={() => setScreen('home')} isDark={isDark}>Selesai, Saya Lebih Baik</Button>
            </div>
          </div>
        );

      case 'panicHelp':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}>
            <button onClick={goBack} className={`absolute top-10 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 shadow-sm active:scale-90'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-4 mb-12">
               <div className="w-20 h-20 bg-red-400/10 rounded-[40px] flex items-center justify-center mx-auto text-red-500 shadow-2xl border border-red-500/10">
                  <Zap size={32} />
               </div>
               <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Panic Relief</h2>
               <p className="text-neutral-400 text-xs px-6 font-medium leading-relaxed italic">“Tarik napas panjang. Panik ini bersifat sementara dan kamu pasti bisa melewatinya.”</p>
            </div>
            
            <div className="space-y-4 flex-grow pb-24">
               {[
                 { t: 'Atur Napas (4-7-8)', d: 'Tarik napas 4 detik, tahan 7 detik, buang 8 detik perlahan.' },
                 { t: 'Katakan: "Ini Akan Berlalu"', d: 'Ingatkan dirimu bahwa perasaan ini hanya respons fisik sementara.' },
                 { t: 'Basuh Wajah dengan Air Dingin', d: 'Air dingin membantu menurunkan denyut jantung secara instan.' },
                 { t: 'Cari Ruang Terbuka', d: 'Jika merasa sesak, cari udara segar atau buka jendela terdekat.' },
               ].map((step, idx) => (
                 <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-[35px] border flex gap-5 ${isDark ? 'bg-white/5 border-white/5 text-white/80' : 'bg-white border-[#F5E6D3] text-neutral-800'}`}
                 >
                   <div className="w-10 h-10 rounded-2xl bg-red-400/10 text-red-400 flex items-center justify-center flex-shrink-0 font-bold italic">{idx + 1}</div>
                   <div>
                     <h4 className="font-bold text-sm mb-1">{step.t}</h4>
                     <p className="text-[10px] text-neutral-400 leading-relaxed font-black uppercase tracking-widest">{step.d}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            <div className={`p-8 rounded-[40px] bg-red-500/10 border border-red-500/10 text-center space-y-4 mb-4`}>
                <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em]">YOU ARE BRAVE & SAFE</p>
                <Button onClick={() => setScreen('home')} isDark={isDark} className="bg-red-500">Selesai, Saya Lebih Baik</Button>
            </div>
          </div>
        );

      case 'whatToDo':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}>
            <button onClick={goBack} className={`absolute top-10 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 shadow-sm active:scale-90'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-4 mb-12">
               <div className="w-20 h-20 bg-orange-400/10 rounded-[40px] flex items-center justify-center mx-auto text-orange-500 shadow-2xl border border-orange-500/10">
                  <HelpCircle size={32} />
               </div>
               <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Feeling Overwhelmed?</h2>
               <p className="text-neutral-400 text-xs px-6 font-medium leading-relaxed italic">“Berhenti sejenak dari apa pun yang kamu lakukan. Mari ambil kendali kembali pelan-pelan.”</p>
            </div>
            
            <div className="space-y-4 flex-grow pb-24">
               {[
                 { t: 'Matikan Notifikasi', d: 'Berikan dirimu waktu 15 menit tanpa gangguan digital.' },
                 { t: 'Minum Air Putih', d: 'Sensasi air dingin masuk ke tubuh membantu grounding secara fisik.' },
                 { t: 'Lakukan Satu Hal Saja', d: 'Pilih satu tugas terkecil: rapikan meja atau cuci muka.' },
                 { t: 'Tuliskan Kecemasanmu', d: 'Gunakan Quick Journal untuk mengeluarkan isi pikiranmu.' },
               ].map((step, idx) => (
                 <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-[35px] border flex gap-5 ${isDark ? 'bg-white/5 border-white/5 text-white/80' : 'bg-white border-[#F5E6D3] text-neutral-800'}`}
                 >
                   <div className="w-10 h-10 rounded-2xl bg-orange-400/10 text-orange-400 flex items-center justify-center flex-shrink-0 font-bold italic">{idx + 1}</div>
                   <div>
                     <h4 className="font-bold text-sm mb-1">{step.t}</h4>
                     <p className="text-[10px] text-neutral-400 leading-relaxed font-black uppercase tracking-widest">{step.d}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            <Button onClick={() => setScreen('home')} isDark={isDark} className="bg-orange-500 mb-8 py-6 rounded-[30px]">Sudah Lebih Tenang</Button>
          </div>
        );

      case 'reflectionPrompt':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full bg-[#1A1A2E] text-white text-center justify-center relative overflow-hidden`}>
             <button onClick={goBack} className="absolute top-10 left-8 p-3 rounded-2xl border border-white/10 text-white/40 active:scale-90 transition-all"><ChevronLeft size={20} /></button>
             <div className="absolute inset-0 bg-pink-500/10 blur-[150px] rounded-full opacity-60" />
             
             <header className="space-y-4 mb-20 relative z-10">
                <div className="w-20 h-20 bg-pink-400/10 rounded-[40px] flex items-center justify-center mx-auto text-pink-400 border border-pink-400/10">
                   <Heart size={32} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-pink-400/60">Emergency Reflection</h2>
             </header>

             <div className="space-y-12 relative z-10 px-4 mb-20">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-serif italic text-white leading-tight"
                >
                  “Apa satu hal terkecil yang bisa kamu lakukan sekarang agar merasa sedikit lebih aman?”
                </motion.h3>
                <p className="text-white/40 text-sm italic">Pikirkan hal itu selama 30 detik. Tidak perlu melakukan apa-apa dulu, cukup bayangkan saja.</p>
             </div>

             <div className="relative z-10 bottom-0 mt-auto">
                <button onClick={() => setScreen('home')} className="w-full py-6 bg-white/5 border border-white/10 rounded-[35px] font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">Selesai Merenung</button>
             </div>
          </div>
        );

      case 'safeReminder':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full bg-[#111122] text-white text-center justify-center relative overflow-hidden`}>
             <button onClick={goBack} className="absolute top-10 left-8 p-3 rounded-2xl border border-white/10 text-white/40 active:scale-90 transition-all"><ChevronLeft size={20} /></button>
             <div className="absolute inset-0 bg-blue-500/10 blur-[150px] rounded-full opacity-60" />
             
             <div className="space-y-8 relative z-10 px-6">
                <motion.div 
                   animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="space-y-6"
                >
                  <h2 className="text-6xl font-serif italic text-white tracking-tighter leading-tight">You are safe.</h2>
                  <div className="h-[2px] w-12 bg-blue-400 mx-auto rounded-full" />
                  <p className="text-blue-400/80 text-xl font-medium tracking-tight px-4 leading-relaxed">“Ketakutanmu memang nyata, tapi itu tidak berbahaya bagi dirimu. Tarik napas, ini akan berlalu.”</p>
                </motion.div>
             </div>

             <div className="absolute bottom-20 left-8 right-8 z-10">
                <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setScreen('home')} 
                   className="w-full py-6 bg-white text-neutral-900 rounded-[40px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl"
                >
                   Selesai 🌿
                </motion.button>
             </div>
          </div>
        );

      case 'stats':
        if (!weeklyStats) {
          return (
            <div className={`p-5 pb-24 h-full flex flex-col ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
               <header className="mb-6 text-center space-y-2 pt-6">
                 <h2 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>Emotional Progress</h2>
                 <p className="text-neutral-400 text-[10px] italic">"The journey of a thousand miles begins with a single step."</p>
               </header>

               <div className="flex-grow flex flex-col items-center justify-center space-y-6 text-center px-4">
                 <div className={`w-32 h-32 rounded-[45px] flex items-center justify-center ${isDark ? 'bg-white/5 border border-white/5 shadow-white/5' : 'bg-white border border-[#F5E6D3] shadow-[#F5E6D3]/10 shadow-lg'}`}>
                    <BarChart2 size={48} className="text-neutral-200" />
                 </div>
                 
                 <div className="space-y-2">
                   <h3 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{lang === 'id' ? 'Belum Ada Data' : 'No Data Yet'}</h3>
                   <p className="text-neutral-400 text-xs leading-relaxed px-4">
                     {lang === 'id' ? 'Belum ada data aktivitas minggu ini. Mulailah check-in untuk melihat progresmu.' : 'No activity data this week. Start checking in to see your progress.'}
                   </p>
                 </div>

                 <Button onClick={() => setScreen('home')} isDark={isDark} className="bg-lavender shadow-lavender/30 px-8 rounded-2xl">Mulai Sekarang</Button>
               </div>

               <BottomNav setScreen={setScreen} current="stats" t={t} isDark={isDark} />
            </div>
          );
        }

        return (
          <div className={`p-5 pb-24 h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
             <header className="mb-6 text-center space-y-1 mt-2">
               <h2 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>Emotional Progress</h2>
               <p className="text-neutral-400 text-[11px] italic font-medium tracking-tight px-6 leading-relaxed">"Setiap langkah kecil menuju kedamaian adalah sebuah kemenangan."</p>
             </header>

             <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: lang === 'id' ? 'Avg. Emotion' : 'Avg. Emotion', value: `${weeklyStats.avgEmotion}%`, color: isDark ? 'text-white' : 'text-lavender', bg: isDark ? 'bg-lavender/20' : 'bg-lavender/10', icon: Activity },
                  { label: lang === 'id' ? 'Dominant Mood' : 'Dominant Mood', value: weeklyStats.dominantMood, color: isDark ? 'text-white' : 'text-sage', bg: isDark ? 'bg-sage/20' : 'bg-sage/10', icon: Sparkles },
                  { label: lang === 'id' ? 'Heaviest Day' : 'Heaviest Day', value: weeklyStats.heaviestDay, color: isDark ? 'text-white' : 'text-orange-400', bg: isDark ? 'bg-orange-400/20' : 'bg-orange-400/10', icon: Clock },
                  { label: lang === 'id' ? 'Improvement' : 'Improvement', value: `+${weeklyStats.progress}%`, color: isDark ? 'text-white' : 'text-blue-400', bg: isDark ? 'bg-blue-400/20' : 'bg-blue-400/10', icon: Zap }
                ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-[40px] border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-neutral-100 shadow-sm'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${stat.bg} ${stat.color}`}><stat.icon size={16} /></div>
                    <p className="text-[7px] font-black text-neutral-300 uppercase mb-1 tracking-[0.2em]">{stat.label}</p>
                    <p className={`text-sm font-serif font-black truncate ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
             </div>
             
             <section className={`p-6 rounded-[45px] border mb-6 overflow-hidden relative ${isDark ? 'bg-white/5 border-white/10 shadow-lg shadow-black/5' : 'bg-white border-neutral-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-6 px-1">
                   <div className="space-y-1">
                      <h3 className={`font-serif text-lg ${isDark ? 'text-white/80' : 'text-neutral-700'}`}>Weekly Rhythm</h3>
                      <p className="text-[8px] font-black uppercase text-neutral-300 tracking-widest">{lang === 'id' ? 'Aktivitas & Stress Level' : 'Activity & Stress Levels'}</p>
                   </div>
                   <div className="p-2 bg-lavender/10 rounded-xl text-lavender">
                    <BarChart2 size={18} />
                   </div>
                </div>
                
                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyStats.chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A7A6D1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#A7A6D1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#A7A6D1' }} 
                        dy={10}
                        tickFormatter={(val) => val[0]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1A1A2E' : '#FFFFFF', 
                          border: 'none', 
                          borderRadius: '16px', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#A7A6D1' }}
                        cursor={{ stroke: '#A7A6D1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area 
                        type="stepAfter" 
                        dataKey="value" 
                        stroke="#A7A6D1" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={2500}
                        dot={{ r: 4, fill: '#A7A6D1', strokeWidth: 2, stroke: isDark ? '#14142B' : '#FFF' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </section>

             <div className={`mt-4 p-8 rounded-[40px] text-center border bg-gradient-to-br from-sage/5 to-transparent border-sage/10 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white'}`}>
                <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-sage mx-auto mb-4"><Sparkles size={24} /></div>
                <p className="text-sm font-serif italic text-sage leading-relaxed mb-3">“{weeklyStats.summary}”</p>
                <p className="text-[8px] font-black uppercase text-sage/40 tracking-[0.4em]">WEEKLY SUMMARY</p>
             </div>

             <BottomNav setScreen={setScreen} current="stats" t={t} isDark={isDark} />
          </div>
        );

      case 'profile':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide pb-32 ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FDFBF7]'}`}>
            <div className="flex justify-between items-center mb-10 px-2">
               <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>My Sanctuary</h2>
               <button onClick={() => navigate('settings')} className={`p-3 rounded-2xl border transition-all active:scale-90 ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 shadow-sm'}`}><Settings size={22} /></button>
            </div>

            <div className="flex flex-col items-center gap-4 mb-8">
               <div className="relative group">
                  <div 
                    onClick={() => setShowPhotoOptions(true)}
                    className={`w-24 h-24 rounded-3xl border-4 shadow-xl overflow-hidden cursor-pointer ${isDark ? 'border-white/5 shadow-white/5' : 'border-white shadow-[#A7A6D1]/10'}`}
                  >
                     <img src={user?.photo} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <button onClick={() => setShowPhotoOptions(true)} className="absolute -bottom-1 -right-1 w-9 h-9 bg-[#A7A6D1] rounded-2xl flex items-center justify-center text-white border-2 border-white shadow-lg active:scale-90 transition-transform">
                     <Camera size={14} />
                  </button>
               </div>
               <div className="text-center space-y-0.5">
                  <h2 className={`text-xl font-serif ${isDark ? 'text-white' : 'text-neutral-800'}`}>{user?.name}</h2>
                  <p className="text-neutral-400 text-[10px] font-medium tracking-tight mb-1">@{user?.username}</p>
                  <p className="text-[8px] font-black text-[#A7A6D1] uppercase tracking-[0.3em]">Mindfulness Seeker</p>
               </div>
               <button 
                onClick={() => {
                  setEditProfileForm({ name: user?.name || '', username: user?.username || '', bio: user?.bio || '' });
                  setScreen('editProfile');
                }}
                className={`px-6 py-2 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-sm'}`}
               >
                 Edit Profile
               </button>
            </div>

            <div className="space-y-8 mt-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-6 rounded-[35px] border text-center transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-sm'}`}>
                    <p className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mb-2 font-mono">Calm Points</p>
                    <div className="flex items-center justify-center gap-1.5 text-lavender cursor-pointer" onClick={() => setScreen('rewards')}>
                       <Flame size={16} fill="currentColor" />
                       <span className="text-2xl font-serif">{points}</span>
                    </div>
                 </div>
                 <div className={`p-6 rounded-[35px] border text-center transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-sm'}`}>
                    <p className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mb-2 font-mono">Streak</p>
                    <div className="flex items-center justify-center gap-1.5 text-sage">
                       <Zap size={16} fill="currentColor" />
                       <span className="text-2xl font-serif">{streak}d</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-4">
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Favorite Sounds</h3>
                    <button onClick={() => setScreen('sleep')} className="text-[9px] font-bold text-lavender">Explore All</button>
                 </div>
                 {favorites.length === 0 ? (
                    <div className={`p-8 rounded-[40px] border-2 border-dashed flex flex-col items-center gap-3 text-center ${isDark ? 'border-white/5 bg-white/5' : 'border-[#F5E6D3] bg-neutral-50/50'}`}>
                       <Heart className="text-neutral-200" size={24} />
                       <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">No favorites yet</p>
                    </div>
                 ) : (
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pt-2">
                       {favorites.map((sound, i) => (
                         <button key={i} onClick={() => { setCurrentSound(sound); setScreen('musicPlayer'); setIsPlaying(true); }} className="flex-shrink-0 w-28 space-y-2">
                           <div className="w-28 h-28 rounded-[28px] overflow-hidden shadow-lg border-2 border-white/10"><img src={sound.image} className="w-full h-full object-cover" /></div>
                           <p className="text-[10px] font-bold truncate opacity-80">{sound.title}</p>
                         </button>
                       ))}
                    </div>
                 )}
              </div>

              <div className={`p-8 rounded-[40px] border shadow-sm relative overflow-hidden ${isDark ? 'bg-sage/10 border-sage/20' : 'bg-sage/5 border-sage/10'}`}>
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                       <h4 className="text-sm font-bold text-sage">Redeem Your Points</h4>
                       <p className="text-[10px] text-neutral-400">Tukar poin dengan healthy voucher.</p>
                       <button onClick={() => setScreen('rewards')} className="mt-3 px-6 py-2 bg-sage text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-sage/20">View Rewards</button>
                    </div>
                    <Gift size={40} className="text-sage opacity-20 absolute -right-4 -bottom-4 translate-x-1 translate-y-1" />
                 </div>
              </div>
            </div>
            <BottomNav setScreen={setScreen} current="profile" t={t} isDark={isDark} />
          </div>
        );

      case 'editProfile':
        return (
          <div className="p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Edit Profile</h2>
               <p className="text-neutral-400 text-sm">Update your public identity.</p>
            </div>

            <div className="flex flex-col items-center gap-6 mb-10">
              <div 
                onClick={() => setShowPhotoOptions(true)}
                className="relative group overflow-hidden w-32 h-32 rounded-[45px] border-4 border-white shadow-xl cursor-pointer"
              >
                 <img src={user?.photo} alt="User" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                 </div>
              </div>
              <button 
                onClick={() => setShowPhotoOptions(true)}
                className="text-[9px] font-black uppercase text-[#A7A6D1] tracking-widest hover:underline"
              >
                Change Profile Photo
              </button>
            </div>

            <div className="space-y-6">
              <Input 
                label="Full Name" value={editProfileForm.name} 
                onChange={(e: any) => setEditProfileForm({ ...editProfileForm, name: e.target.value })} 
                placeholder="Sarah Mitchell"
                isDark={isDark}
              />
              <Input 
                label="Username" value={editProfileForm.username} 
                onChange={(e: any) => setEditProfileForm({ ...editProfileForm, username: e.target.value })} 
                placeholder="sarahmitchell"
                isDark={isDark}
              />
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Bio</label>
                <textarea 
                  value={editProfileForm.bio}
                  onChange={(e: any) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                  placeholder="Tell us about your calm journey..."
                  className={`w-full p-4 rounded-2xl outline-none transition-all text-sm h-24 resize-none border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#A7A6D1]' : 'bg-white border-[#F5E6D3] focus:border-[#A7A6D1] text-[#2D3436]'}`}
                />
              </div>
              
              <div className="pt-6 space-y-4">
                <Button onClick={() => {
                  setUser({ ...user!, name: editProfileForm.name, username: editProfileForm.username, bio: editProfileForm.bio });
                  setNotification({ message: 'Profile updated successfully', type: 'success' });
                  setScreen('profile');
                }} isDark={isDark}>Save Changes</Button>
                <button onClick={() => setScreen('profile')} className="w-full text-[10px] font-black uppercase text-neutral-400 tracking-widest text-center mt-2">Cancel</button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Settings</h2>
               <p className="text-neutral-400 text-sm">Customize your Calmora experience.</p>
            </div>

            <div className="space-y-4 pb-32">
              <div className={`rounded-[45px] border shadow-soft overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                {[
                  { id: 'dailyReminders', icon: Bell, label: 'Daily Reminder', desc: 'Schedule your well-being check-ins', color: 'text-lavender' },
                  { id: 'notificationSettings', icon: Mail, label: 'Notifications', desc: 'Manage alerts and reminders', color: 'text-blue-400' },
                  { id: 'appearance', icon: Monitor, label: 'Appearance', desc: 'Sanctuary theme settings', color: 'text-pink-400' },
                  { id: 'languageSettings', icon: Languages, label: 'Language', desc: 'Pilih bahasa preferensi Anda', color: 'text-indigo-400' },
                  { id: 'privacySecurity', icon: Shield, label: 'Privacy & Security', desc: 'App lock and data controls', color: 'text-emerald-400' },
                  { id: 'helpSupport', icon: HelpCircle, label: 'Help & Support', desc: 'Guides and contact us', color: 'text-amber-400' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setScreen(item.id as Screen)}
                    className="w-full px-6 py-5 flex items-center justify-between border-b border-white/5 last:border-none group hover:bg-white/10 transition-all active:bg-white/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${isDark ? 'bg-white/5' : 'bg-neutral-50'} ${item.color}`}><item.icon size={22} /></div>
                      <div className="text-left">
                        <h4 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-800'}`}>{item.label}</h4>
                        <p className="text-[10px] font-medium text-neutral-400 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`${isDark ? 'text-white/20' : 'text-neutral-200'} group-hover:translate-x-1 transition-all`} />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full mt-10 p-6 rounded-[35px] border flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-pink-50 border-pink-100 text-pink-500'}`}
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        );

      case 'dailyReminders':
        return (
          <div className="p-8 pt-20 flex flex-col h-full">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-12">
               <h2 className="text-4xl font-serif">Daily Reminder</h2>
               <p className="text-neutral-400 text-sm">Stay consistent with your well-being.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'morning', label: 'Morning Check-in', desc: 'Start your day with intention' },
                { id: 'mood', label: 'Mood Tracker Reminder', desc: 'Logging your feelings daily' },
                { id: 'sleep', label: 'Sleep Reminder', desc: 'Nightly wind down routines' },
                { id: 'reflection', label: 'Reflection Reminder', desc: 'Daily gratitude journal' },
              ].map(item => (
                <div key={item.id} className={`p-6 rounded-[35px] border flex items-center justify-between transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                  <div className="flex-grow">
                    <h4 className="font-bold text-base mb-0.5">{item.label}</h4>
                    <p className="text-[10px] font-medium text-neutral-400 italic mb-3">{item.desc}</p>
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-neutral-300" />
                       <span className={`text-[11px] font-black tracking-tighter ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>{(reminders.times as any)[item.id]} PM</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReminders({ ...reminders, [item.id]: !(reminders as any)[item.id] })}
                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${(reminders as any)[item.id] ? 'bg-sage shadow-lg shadow-sage/30' : isDark ? 'bg-white/10' : 'bg-neutral-100'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${ (reminders as any)[item.id] ? 'left-7' : 'left-1' }`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-auto py-8">
               <Button onClick={() => setScreen('settings')} isDark={isDark}>Update My Schedule</Button>
            </div>
          </div>
        );

      case 'notificationSettings':
        return (
          <div className="p-8 pt-20 flex flex-col h-full">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-12">
               <h2 className="text-4xl font-serif">Notifications</h2>
               <p className="text-neutral-400 text-sm">Choose what inspires you.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'affirmation', label: 'Daily Affirmation', icon: Heart },
                { id: 'weekly', label: 'Weekly Emotional Report', icon: BarChart2 },
                { id: 'exercise', label: 'Calm Exercise Reminder', icon: Wind },
                { id: 'sleepRelax', label: 'Sleep Relax Reminder', icon: Moon },
              ].map(item => (
                <div key={item.id} className={`p-6 rounded-[35px] border flex items-center justify-between transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white/30' : 'bg-neutral-50 text-neutral-400'}`}><item.icon size={18} /></div>
                    <span className="text-sm font-bold opacity-80">{item.label}</span>
                  </div>
                  <button 
                    onClick={() => setNotifSettings({ ...notifSettings, [item.id]: !(notifSettings as any)[item.id] })}
                    className={`w-12 h-7 rounded-full relative transition-all duration-300 ${(notifSettings as any)[item.id] ? 'bg-lavender shadow-lg shadow-lavender/30' : isDark ? 'bg-white/10' : 'bg-neutral-100'}`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${ (notifSettings as any)[item.id] ? 'left-5.5' : 'left-0.5' }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="p-8 pt-20 flex flex-col h-full">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Appearance</h2>
               <p className="text-neutral-400 text-sm">Set your preferred sanctuary aesthetic.</p>
            </div>

            <div className="space-y-10">
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'system', icon: Monitor, label: 'System Default' },
                    { id: 'light', icon: Sun, label: 'Light Mode' },
                    { id: 'dark', icon: Moon, label: 'Dark Mode' },
                  ].map(mode => (
                    <button 
                      key={mode.id}
                      onClick={() => {
                        setTheme(mode.id as ThemeMode);
                        setNotification({ message: `Appearance updated to ${mode.label}`, type: 'success' });
                      }}
                      className={`p-6 rounded-[35px] border flex items-center justify-between transition-all group ${
                        theme === mode.id ? 'border-[#A7A6D1] bg-[#A7A6D1]/5' : isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-[#F5E6D3] hover:border-[#A7A6D1]/30'
                      }`}
                    >
                       <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === mode.id ? 'bg-[#A7A6D1] text-white shadow-xl shadow-[#A7A6D1]/20' : isDark ? 'bg-white/5 text-white/30' : 'bg-neutral-50 text-neutral-400'}`}>
                            <mode.icon size={22} />
                          </div>
                          <span className={`text-base font-bold ${theme === mode.id ? 'text-[#A7A6D1]' : 'opacity-80'}`}>{mode.label}</span>
                       </div>
                       {theme === mode.id && <Check size={20} className="text-[#A7A6D1]" />}
                    </button>
                  ))}
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 ml-4">Quick Preview</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="h-32 bg-white rounded-[35px] border border-[#F5E6D3] p-4 flex flex-col justify-end gap-2 shadow-sm">
                        <div className="w-1/3 h-1 bg-neutral-100 rounded-full" />
                        <div className="w-2/3 h-2 bg-[#A7A6D1]/20 rounded-full" />
                        <div className="w-full h-1 bg-neutral-50 rounded-full" />
                     </div>
                     <div className="h-32 bg-[#14142B] rounded-[35px] border border-white/10 p-4 flex flex-col justify-end gap-2 shadow-xl shadow-black/20">
                        <div className="w-1/3 h-1 bg-white/10 rounded-full" />
                        <div className="w-2/3 h-2 bg-white/20 rounded-full" />
                        <div className="w-full h-1 bg-white/5 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'privacySecurity':
        return (
          <div className="p-8 pt-20 flex flex-col h-full lg:px-10 overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Privacy & Security</h2>
               <p className="text-neutral-400 text-sm">Managing your digital safe space.</p>
            </div>
            
            <div className="space-y-6 pb-20">
              <div className={`p-6 rounded-[35px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                <p className="text-[10px] font-black uppercase text-neutral-300 tracking-widest mb-4">Account Access</p>
                <div className="space-y-4">
                  <Input label="Current Email" value={user?.email} disabled isDark={isDark} />
                  <Button variant="secondary" onClick={() => setScreen('changeEmail')} isDark={isDark} className="py-3 text-xs font-bold uppercase tracking-widest">Change Registered Email</Button>
                  <Button variant="secondary" onClick={() => setScreen('changePassword')} isDark={isDark} className="py-3 text-xs font-bold uppercase tracking-widest">Change Password</Button>
                </div>
              </div>

              <div className={`rounded-[45px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                {[
                  { id: 'accountSecurity', label: 'Account Security', icon: Shield },
                  { id: 'dataProtection', label: 'Data Protection', icon: Lock },
                  { id: 'appLock', label: 'App Lock', icon: FileText },
                ].map((item, i) => (
                  <button key={i} onClick={() => setScreen(item.id as Screen)} className="w-full p-6 flex items-center justify-between border-b border-white/5 last:border-none group hover:bg-neutral-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white/30' : 'bg-neutral-50 text-neutral-400 shadow-sm'}`}><item.icon size={18} /></div>
                      <span className="font-bold text-sm opacity-80">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-neutral-200" />
                  </button>
                ))}
              </div>

              <div className={`p-8 rounded-[45px] border text-center space-y-4 transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-[#FDFBF7] border-[#F5E6D3] shadow-sm'}`}>
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto shadow-sm">
                  <Shield size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Safe & Encrypted</h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-widest px-4">Your journals and mood data are encrypted and accessible only by you.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'aboutApp':
        return (
          <div className="p-8 pt-20 flex flex-col h-full lg:px-10 overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-6 mt-10">
               <div className={`w-24 h-24 rounded-[35px] bg-[#A7A6D1] mx-auto flex items-center justify-center text-white shadow-2xl shadow-[#A7A6D1]/40 transition-transform duration-1000 ${isPlaying ? 'rotate-[360deg]' : ''}`}>
                 <Heart fill="currentColor" size={40} />
               </div>
               <div className="space-y-1">
                 <h2 className="text-4xl font-serif tracking-widest">CALMORA</h2>
                 <p className="text-[10px] font-black text-[#A7A6D1] uppercase tracking-[0.5em] opacity-80">v1.0.0</p>
               </div>
            </div>
            
            <div className="mt-12 space-y-10">
               <div className="space-y-4 text-center px-4">
                 <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">What is CALMORA?</h4>
                 <p className="text-sm text-neutral-400 leading-relaxed">CALMORA adalah aplikasi pendamping kesehatan mental harian yang membantu pengguna mengelola stres, memahami emosi, dan membangun kebiasaan mental yang lebih sehat.</p>
               </div>
               
               <div className={`rounded-[35px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                  {[
                    { id: 'privacyPolicy', label: 'Privacy Policy' },
                    { id: 'termsConditions', label: 'Terms & Conditions' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setScreen(item.id as Screen)}
                      className="w-full p-6 flex items-center justify-between border-b border-white/5 last:border-none group hover:bg-neutral-50/50"
                    >
                      <span className="font-bold text-sm opacity-80">{item.label}</span>
                      <ChevronRight size={16} className="text-neutral-200" />
                    </button>
                  ))}
               </div>

               <p className="text-[9px] font-black text-neutral-200 uppercase tracking-widest text-center pt-10">© CALMORA 2026. <br/>All Rights Reserved.</p>
            </div>
          </div>
        );

      case 'privacyPolicy':
      case 'termsConditions':
        return (
          <div className="p-8 pt-20 flex flex-col h-full lg:px-10 overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-3xl font-serif">{screen === 'privacyPolicy' ? 'Privacy Policy' : 'Terms & Conditions'}</h2>
            </div>
            <div className={`p-8 rounded-[40px] border leading-relaxed space-y-6 ${isDark ? 'bg-white/5 border-white/5 text-white/60' : 'bg-white border-[#F5E6D3] text-neutral-600'}`}>
              {screen === 'privacyPolicy' ? (
                <>
                  <p className="text-sm">CALMORA menjaga privasi pengguna dan seluruh data personal seperti mood tracker, journal entries, dan emotional reports bersifat pribadi dan aman.</p>
                  <p className="text-sm">Data pengguna tidak dibagikan kepada pihak lain tanpa izin. Aplikasi ini dibuat sebagai safe digital space untuk mendukung kesehatan mental pengguna.</p>
                </>
              ) : (
                <>
                  <p className="text-sm">CALMORA menyediakan layanan untuk membantu manajemen kesehatan mental secara mandiri. Kami bukan pengganti saran medis profesional.</p>
                  <p className="text-sm">Dengan menggunakan aplikasi ini, Anda setuju untuk menjaga kerahasiaan akun Anda dan bertanggung jawab atas aktivitas di dalamnya.</p>
                </>
              )}
            </div>
          </div>
        );

      case 'languageSettings':
        return (
          <div className="p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Language</h2>
               <p className="text-neutral-400 text-sm">{lang === 'id' ? 'Pilih bahasa yang nyaman untukmu.' : 'Choose the language that feels right.'}</p>
            </div>
            <div className="space-y-4 pb-10">
              <p className="text-[10px] font-black uppercase text-neutral-300 tracking-widest ml-4 mb-2">Available Languages</p>
              {[
                { id: 'en', label: 'English', sub: 'Universal Language' },
                { id: 'id', label: 'Bahasa Indonesia', sub: 'Native Interpretation' },
              ].map((language) => (
                <button 
                  key={language.id}
                  onClick={() => {
                    setLang(language.id as Language);
                    setNotification({ message: language.id === 'id' ? 'Bahasa berhasil diperbarui' : 'Language updated successfully', type: 'success' });
                    setScreen('settings');
                  }}
                  className={`w-full p-8 flex items-center justify-between rounded-[45px] border transition-all active:scale-[0.98] ${
                    lang === language.id ? 'border-[#A7A6D1] bg-[#A7A6D1]/5' : isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-[#F5E6D3] hover:border-[#A7A6D1]/20'
                  }`}
                >
                  <div className="text-left space-y-0.5">
                    <span className={`text-base font-bold flex items-center gap-3 ${lang === language.id ? 'text-[#A7A6D1]' : 'opacity-80'}`}>
                      {language.label}
                      {lang === language.id && <div className="w-1.5 h-1.5 bg-[#8EB486] rounded-full" />}
                    </span>
                    <p className="text-[10px] text-neutral-300 font-medium uppercase tracking-widest">{language.sub}</p>
                  </div>
                  {lang === language.id && <div className="w-10 h-10 bg-[#A7A6D1]/10 rounded-2xl flex items-center justify-center text-[#A7A6D1]"><Check size={20} /></div>}
                </button>
              ))}
            </div>
          </div>
        );

      case 'helpSupport':
        return (
          <div className="p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide pb-32">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10 px-4">
               <h2 className="text-4xl font-serif">Help & Support</h2>
               <p className="text-neutral-400 text-sm">Kami di sini untuk mendukung perjalanan ketenanganmu.</p>
            </div>
            
            <div className="space-y-8 flex-grow">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-neutral-300 tracking-widest ml-4">Contact Channels</p>
                  <div className="space-y-3">
                     {[
                        { label: 'Email Support', val: 'fauzanalansyori0207@gmail.com', icon: Mail, color: 'text-indigo-400', action: () => window.location.href = 'mailto:fauzanalansyori0207@gmail.com' },
                        { label: 'WhatsApp', val: '+62 838 2186 1984', icon: Phone, color: 'text-emerald-400', action: () => window.location.href = 'https://wa.me/6283821861984' },
                     ].map(channel => (
                        <button key={channel.label} onClick={channel.action} className={`w-full p-6 rounded-[35px] border flex items-center justify-between transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-[#F5E6D3] hover:border-[#A7A6D1]/20'}`}>
                           <div className="flex items-center gap-4 text-left">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-neutral-50'} ${channel.color}`}><channel.icon size={20} /></div>
                              <div className="space-y-0.5">
                                 <h4 className="text-sm font-bold opacity-80">{channel.label}</h4>
                                 <p className="text-xs text-neutral-400">{channel.val}</p>
                              </div>
                           </div>
                           <ChevronRight size={16} className="text-neutral-200" />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-neutral-300 tracking-widest ml-4">Resources</p>
                  <div className={`rounded-[45px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                    {[
                      { l: 'FAQs', id: 'helpSupport' },
                      { l: 'Terms of Service', id: 'termsConditions' },
                      { l: 'Privacy Policy', id: 'privacyPolicy' },
                      { l: 'Report a Problem', id: 'reportProblem' },
                    ].map((item, i) => (
                      <button key={i} onClick={() => setScreen(item.id as Screen)} className="w-full p-6 border-b border-white/5 last:border-none flex justify-between items-center group hover:bg-white/5 transition-colors">
                        <span className="text-sm font-bold opacity-70 group-hover:opacity-100">{item.l}</span>
                        <ArrowUpRight size={16} className="text-neutral-200" />
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'contactSupport':
        return (
          <div className="p-8 pt-20 flex flex-col h-full bg-[#FAFAFA]">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400 font-bold'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-12">
               <h2 className="text-4xl font-serif text-neutral-800 italic">Contact Us</h2>
               <p className="text-neutral-400 text-sm tracking-tight">Kami siap mendengar dan membantu Anda.</p>
            </div>
            <div className="space-y-6">
               <button onClick={() => window.location.href = 'mailto:fauzanalansyori0207@gmail.com'} className={`w-full p-8 rounded-[45px] border flex flex-col items-center gap-4 text-center group transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-soft hover:border-[#A7A6D1]'}`}>
                  <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Mail size={32} /></div>
                  <div>
                     <h4 className="font-bold text-base text-neutral-800">Via Email</h4>
                     <p className="text-[10px] text-neutral-400 font-medium">fauzanalansyori0207@gmail.com</p>
                  </div>
               </button>
               <button onClick={() => window.location.href = 'https://wa.me/6283821861984'} className={`w-full p-8 rounded-[45px] border flex flex-col items-center gap-4 text-center group transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3] shadow-soft hover:border-sage'}`}>
                  <div className="w-16 h-16 bg-sage/10 rounded-3xl flex items-center justify-center text-sage group-hover:scale-110 transition-transform"><AlertCircle size={32} /></div>
                  <div>
                     <h4 className="font-bold text-base text-neutral-800">Via WhatsApp</h4>
                     <p className="text-[10px] text-neutral-400 font-medium">+62 838 2186 1984</p>
                  </div>
               </button>
            </div>
          </div>
        );

      case 'reportProblem':
        return (
          <div className="p-8 pt-20 flex flex-col h-full bg-[#FAFAFA]">
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif text-neutral-800 italic">Report Issue</h2>
               <p className="text-neutral-400 text-sm tracking-tight">Satu laporanmu sangat berarti bagi kami.</p>
            </div>
            <div className="space-y-6 flex-grow">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest ml-4">Kategori Masalah</label>
                  <select className={`w-full p-6 rounded-[30px] outline-none appearance-none border transition-all shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#F5E6D3] text-neutral-800 focus:border-[#A7A6D1]'}`}>
                    <option>Technical Bug</option>
                    <option>Masalah Akun</option>
                    <option>Saran Fitur</option>
                    <option>Lainnya</option>
                  </select>
               </div>
               <div className="space-y-1.5 flex-grow flex flex-col">
                  <label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest ml-4">Detail Laporan</label>
                  <textarea placeholder="Ceritakan apa yang terjadi..." className={`w-full flex-grow p-8 rounded-[45px] outline-none border resize-none transition-all shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#F5E6D3] text-neutral-800 focus:border-[#A7A6D1]'}`} />
               </div>
            </div>
            <div className="py-8">
               <Button onClick={() => { setNotification({ message: 'Laporan berhasil dikirim, terima kasih! 🌿', type: 'success' }); setScreen('helpSupport'); }} isDark={isDark}>Kirim Laporan</Button>
            </div>
          </div>
        );

      case 'feedbackForm':
        return (
          <div className="p-8 pt-20 flex flex-col h-full bg-[#FAFAFA]">
            <button onClick={() => setScreen('helpSupport')} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif text-neutral-800 italic">Feedback</h2>
               <p className="text-neutral-400 text-sm tracking-tight">Bagaimana pengalamanmu hari ini?</p>
            </div>
            <div className="flex flex-col items-center gap-8 mb-10">
               <div className="flex gap-5">
                  {[Frown, Meh, Smile, Heart].map((Icon, i) => (
                    <button key={i} className="w-16 h-16 bg-white border border-[#F5E6D3] rounded-3xl flex items-center justify-center text-neutral-200 hover:text-[#A7A6D1] hover:border-[#A7A6D1] transition-all shadow-soft active:scale-90">
                      <Icon size={32} />
                    </button>
                  ))}
               </div>
               <p className="text-[10px] font-black uppercase text-neutral-300 tracking-[0.4em]">Berikan Rating</p>
            </div>
            <textarea placeholder="Tuliskan kesan atau pesan cintamu di sini..." className={`w-full h-48 p-8 rounded-[45px] outline-none border transition-all shadow-soft ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#F5E6D3] text-neutral-800 focus:border-[#A7A6D1]'}`} />
            <div className="py-8">
               <Button onClick={() => { setNotification({ message: 'Terima kasih atas masukannya! Anda luar biasa ✨', type: 'success' }); setScreen('helpSupport'); }} isDark={isDark}>Bagikan Feedback</Button>
            </div>
          </div>
        );

      case 'accountSecurity':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Account Security</h2>
               <p className={`${isDark ? 'text-white/30' : 'text-neutral-400'} text-sm`}>Protecting your digital identity.</p>
            </div>
            {notification && <div className="mb-6"><Notification {...notification} /></div>}
            <div className="space-y-6 pb-20">
               <div className={`p-6 rounded-[35px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#A7A6D1] mb-6">Security Features</h4>
                  <div className="space-y-6">
                     {[
                        { id: 'twoFactor', label: 'Two-Factor Authentication', enabled: securitySettings.twoFactor },
                        { id: 'biometric', label: 'Biometric Login', enabled: securitySettings.biometric },
                        { id: 'loginAlerts', label: 'Login Notifications', enabled: securitySettings.loginAlerts },
                     ].map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                           <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-neutral-700'}`}>{item.label}</span>
                           <button 
                            onClick={() => {
                              const newVal = !securitySettings[item.id as keyof typeof securitySettings];
                              setSecuritySettings(prev => ({ ...prev, [item.id]: newVal }));
                              setNotification({ message: `${item.label} ${newVal ? 'enabled' : 'disabled'}`, type: 'info' });
                            }}
                            className={`w-12 h-6 rounded-full relative transition-all active:scale-95 ${item.enabled ? 'bg-sage' : 'bg-neutral-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setNotification({ message: 'Request sent to your email to reset password.', type: 'info' })} className={`p-5 rounded-[28px] border text-left flex items-center justify-between transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white/40' : 'bg-lavender/10 text-lavender'}`}><Key size={18} /></div>
                        <span className="font-bold text-sm">Change Password</span>
                     </div>
                     <ChevronRight size={16} className="text-neutral-300" />
                  </button>
                  <button onClick={() => setNotification({ message: 'Enter your new email address in profile settings.', type: 'info' })} className={`p-5 rounded-[28px] border text-left flex items-center justify-between transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white/40' : 'bg-emerald-500/10 text-emerald-500'}`}><User size={18} /></div>
                        <span className="font-bold text-sm">Update Recovery Email</span>
                     </div>
                     <ChevronRight size={16} className="text-neutral-300" />
                  </button>
               </div>

               <div className={`p-6 rounded-[35px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Recent Logins</h4>
                    <span className="text-[9px] font-bold text-sage px-2 py-0.5 bg-sage/10 rounded-full">Active Now</span>
                  </div>
                  <div className="space-y-5">
                     {[
                        { device: 'iPhone 15 Pro', loc: 'Bandung, ID', date: 'Today, 10:24', icon: Smartphone, current: true },
                        { device: 'Web (Chrome)', loc: 'Jakarta, ID', date: 'Yesterday, 20:15', icon: Globe, current: false },
                     ].map((l, i) => (
                        <div key={i} className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white/40' : 'bg-neutral-50 text-neutral-400'}`}>
                                 <l.icon size={16} />
                              </div>
                              <div>
                                 <p className={`text-xs font-bold ${l.current && 'text-sage'}`}>{l.device} {l.current && '(This Device)'}</p>
                                 <p className={`text-[9px] ${isDark ? 'text-white/20' : 'text-neutral-400'}`}>{l.loc} • {l.date}</p>
                              </div>
                           </div>
                           {!l.current && <button className="text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors">Logout</button>}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'dataProtection':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full overflow-y-auto scrollbar-hide ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-4xl font-serif">Data Protection</h2>
               <p className={`${isDark ? 'text-white/30' : 'text-neutral-400'} text-sm`}>How we keep your data private.</p>
            </div>
            {notification && <div className="mb-6"><Notification {...notification} /></div>}
            <div className="space-y-6 pb-20">
               <div className={`p-6 rounded-[35px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#F5E6D3]'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#A7A6D1] mb-6">Data Settings</h4>
                  <div className="space-y-6">
                     {[
                        { id: 'personalization', label: 'Personalized Insights', enabled: dataSettings.personalization },
                        { id: 'analytics', label: 'Usage Analytics', enabled: dataSettings.analytics },
                        { id: 'cloudSync', label: 'Cloud Backup & Sync', enabled: dataSettings.cloudSync },
                     ].map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                           <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-neutral-700'}`}>{item.label}</span>
                           <button 
                            onClick={() => {
                              const newVal = !dataSettings[item.id as keyof typeof dataSettings];
                              setDataSettings(prev => ({ ...prev, [item.id]: newVal }));
                              setNotification({ message: `${item.label} ${newVal ? 'on' : 'off'}`, type: 'info' });
                            }}
                            className={`w-12 h-6 rounded-full relative transition-all active:scale-95 ${item.enabled ? 'bg-sage' : 'bg-neutral-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               <div className={`p-8 rounded-[40px] border leading-relaxed space-y-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3]'}`}>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Lock size={16} /></div>
                       <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>End-to-End Encryption</h4>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>Seluruh data jurnal dan mood Anda diacak menggunakan enkripsi AES-256 sebelum disimpan di cloud untuk keamanan maksimal.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck size={16} /></div>
                       <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>No Third-Party Sharing</h4>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>Kami tidak pernah menjual atau membagikan data kesehatan mental Anda kepada pengiklan atau pihak ketiga mana pun.</p>
                 </div>
                 <div className="pt-4 flex flex-col gap-3">
                   <Button variant="secondary" className="rounded-2xl" isDark={isDark} onClick={() => setNotification({ message: 'Request submitted. Your data report will be emailed in 24h.', type: 'info' })}>Download My Data Report</Button>
                   <button 
                    onClick={() => {
                      if(confirm('Are you sure you want to delete all your account data? This cannot be undone.')) {
                        setNotification({ message: 'Data deletion request received.', type: 'error' });
                      }
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-red-400 py-2"
                   >
                     Delete All My Personal Data
                   </button>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'appLock':
        return (
          <div className={`p-8 pt-20 flex flex-col h-full bg-gradient-to-b ${isDark ? 'from-[#1A1A2E] to-[#14142B]' : 'from-[#FDFBF7] to-[#F5F5F5]'} transition-all duration-700`}>
            <button onClick={goBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-12">
               <h2 className="text-4xl font-serif">App Lock</h2>
               <p className={`${isDark ? 'text-white/30' : 'text-neutral-400'} text-sm`}>Privacy for your sensitive data.</p>
            </div>
            <div className="w-full max-w-sm mx-auto space-y-12">
               <motion.div 
                whileHover={{ y: -5 }}
                className={`flex justify-between items-center p-6 rounded-[40px] border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#F5E6D3] shadow-sm'}`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${appLockState.isEnabled ? 'bg-sage text-white rotate-12' : isDark ? 'bg-white/5 text-white/20' : 'bg-neutral-50 text-neutral-300'}`}>
                        {appLockState.isEnabled ? <Lock size={22} /> : <Unlock size={22} />}
                     </div>
                     <div>
                        <span className="font-bold text-sm block">PIN Protection</span>
                        <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>{appLockState.isEnabled ? 'Currently Active' : 'Currently Disabled'}</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => {
                        setAppLockState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
                        setNotification({ message: appLockState.isEnabled ? 'App Lock disabled' : 'App Lock enabled', type: appLockState.isEnabled ? 'info' : 'success' });
                    }}
                    className={`w-14 h-7 rounded-full relative shadow-inner overflow-hidden transition-all active:scale-95 ${appLockState.isEnabled ? 'bg-sage' : 'bg-neutral-200'}`}
                  >
                     <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${appLockState.isEnabled ? 'left-8' : 'left-1'}`} />
                  </button>
               </motion.div>
               
               <div className="space-y-8">
                  <div className="flex justify-center gap-5">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ scale: appLockState.pin.length >= i ? 1.2 : 1 }}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          appLockState.pin.length >= i 
                            ? 'bg-[#A7A6D1] border-[#A7A6D1] shadow-lg shadow-[#A7A6D1]/30' 
                            : isDark ? 'border-white/10' : 'border-neutral-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-center max-w-[280px] mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((n, i) => {
                        if (n === '') return <div key={i} />;
                        if (n === 'delete') return (
                          <button 
                            key={i} 
                            onClick={() => setAppLockState(prev => ({ ...prev, pin: prev.pin.slice(0, -1) }))}
                            className={`aspect-square flex items-center justify-center rounded-3xl transition-all active:bg-red-500/10 text-red-400`}
                          >
                            <Delete size={20} />
                          </button>
                        );
                        return (
                          <button 
                            key={i} 
                            onClick={() => {
                              if(appLockState.pin.length < 4) {
                                setAppLockState(prev => ({ ...prev, pin: prev.pin + n.toString() }));
                              }
                            }}
                            className={`aspect-square flex flex-col items-center justify-center rounded-[30px] transition-all hover:bg-neutral-50 active:scale-90 group ${isDark ? 'hover:bg-white/5' : ''}`}
                          >
                            <span className={`text-2xl font-serif ${isDark ? 'text-white/60' : 'text-neutral-500'} group-hover:text-[#A7A6D1]`}>{n}</span>
                          </button>
                        );
                      })}
                  </div>
                  <p className="text-[10px] font-black uppercase text-neutral-300 tracking-[0.2em] text-center">
                    {appLockState.pin.length === 4 ? (
                      <button 
                        onClick={() => {
                          setNotification({ message: 'App PIN set successfully!', type: 'success' });
                          setAppLockState(prev => ({ ...prev, isEnabled: true }));
                          setScreen('privacySecurity');
                        }}
                        className="text-[#A7A6D1] underline underline-offset-4 animate-bounce"
                      >
                        Set this PIN
                      </button>
                    ) : 'Enter your 4-digit PIN'}
                  </p>
               </div>
            </div>
          </div>
        );

      case 'changeEmail':
      case 'changePassword':
        return (
          <div className="p-8 pt-20 flex flex-col h-full lg:px-10 overflow-y-auto scrollbar-hide">
            <button onClick={() => setScreen('privacySecurity')} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-3xl font-serif">{screen === 'changeEmail' ? 'Change Email' : 'Change Password'}</h2>
               <p className="text-neutral-400 text-sm italic">Amankan akun Anda dengan informasi terbaru.</p>
            </div>
            <div className="space-y-6">
              {screen === 'changeEmail' ? (
                <>
                  <Input label="New Email" type="email" placeholder="new.email@example.com" isDark={isDark} />
                  <Input label="Current Password" type="password" placeholder="••••••••" isDark={isDark} />
                  <div className="pt-4">
                    <Button onClick={() => {
                        setNotification({ message: 'Email updated successfully', type: 'success' });
                        setScreen('privacySecurity');
                    }} isDark={isDark}>Verify & Update</Button>
                  </div>
                </>
              ) : (
                <>
                  <Input label="Current Password" type="password" placeholder="••••••••" isDark={isDark} />
                  <Input label="New Password" type="password" placeholder="••••••••" isDark={isDark} />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" isDark={isDark} />
                  <div className="pt-4">
                    <Button onClick={() => {
                        setNotification({ message: 'Password updated successfully', type: 'success' });
                        setScreen('privacySecurity');
                    }} isDark={isDark}>Verify & Update Password</Button>
                  </div>
                </>
              )}
              <Button onClick={() => {
                setNotification({ message: 'Pembaruan berhasil disimpan', type: 'success' });
                setScreen('privacySecurity');
              }} isDark={isDark}>Submit Changes</Button>
            </div>
          </div>
        );
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center font-sans selection:bg-lavender/30 transition-colors duration-500 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
      <div className={`w-full h-full max-w-md shadow-2xl relative overflow-hidden md:h-[844px] md:my-10 md:rounded-[60px] md:border-[12px] transition-colors duration-500 ${isDark ? 'bg-[#14142B] border-neutral-800' : 'bg-white border-neutral-900'}`}>
        <AnimatePresence mode="wait">
          <ScreenWrapper id={screen} className="font-sans" isDark={isDark}>
            {renderScreenContent()}
          </ScreenWrapper>
        </AnimatePresence>
        
        {currentSound && (
          <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden z-[-1]">
            {(() => {
              const Player = ReactPlayer as any;
              return (
                <Player
                  ref={playerRef}
                  url={currentSound.url}
                  playing={isPlaying}
                  loop={true}
                  onEnded={nextTrack}
                  volume={volume}
                  width="1px"
                  height="1px"
                  config={{
                    youtube: {
                      playerVars: { autoplay: 1, controls: 0 }
                    }
                  }}
                />
              );
            })()}
          </div>
        )}

        {!['splash', 'onboarding', 'login', 'register', 'authChoice', 'forgot', 'musicPlayer'].includes(screen) && currentSound && (
          <MiniPlayerBar 
            sound={currentSound} 
            isPlaying={isPlaying} 
            isDark={isDark}
            sleepTimer={sleepTimer}
            setShowTimerModal={setShowTimerModal}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={nextTrack}
            onPrev={prevTrack}
            onClose={() => {
              reduceStress(8);
              setCurrentSound(null);
              setIsPlaying(false);
            }}
            onOpen={() => setScreen('musicPlayer')}
          />
        )}

        {['home', 'stats', 'profile'].includes(screen) && !showQuickCalm && (
          <FloatingCalmButton 
            isDark={isDark} 
            onClick={() => setShowQuickCalm(true)} 
            offset={!!currentSound && screen !== 'musicPlayer'}
          />
        )}
        <AnimatePresence>
          {showQuickCalm && (
            <QuickCalmPopup 
              isDark={isDark} 
              lang={lang} 
              onClose={() => setShowQuickCalm(false)} 
              setScreen={setScreen} 
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showPhotoOptions && (
            <PhotoOptionsModal 
              isDark={isDark} 
              lang={lang}
              onClose={() => setShowPhotoOptions(false)}
              onSelect={(type: string) => {
                setShowPhotoOptions(false);
                if (type === 'gallery' || type === 'camera') {
                  setShowPermission(true);
                } else if (type === 'remove') {
                  setUser({ ...user!, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop' });
                  setNotification({ message: 'Foto profil dihapus', type: 'info' });
                }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPermission && (
            <PermissionModal 
              isDark={isDark}
              lang={lang}
              onAllow={() => {
                setShowPermission(false);
                setNotification({ message: 'Izin diberikan. Membuka galeri...', type: 'success' });
                setTimeout(() => {
                  setNotification({ message: 'Foto berhasil diperbarui ✨', type: 'success' });
                  setUser({ ...user!, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' });
                }, 1500);
              }}
              onDeny={() => {
                setShowPermission(false);
                setNotification({ message: 'Izin akses ditolak', type: 'error' });
              }}
            />
          )}
        </AnimatePresence>

        {showLogoutConfirm && (
          <LogoutModal 
            isDark={isDark} 
            lang={lang}
            onConfirm={handleLogout} 
            onCancel={() => setShowLogoutConfirm(false)} 
          />
        )}
      </div>
    </div>
  );
}

// --- Sub Component: BreathingSession ---

const BreathingSession = ({ onBack, onFinish, isDark }: { onBack: () => void, onFinish?: () => void, isDark?: boolean }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(c => {
        if (c <= 1) {
          if (phase === 'inhale') { setPhase('hold'); return 7; }
          if (phase === 'hold') { setPhase('exhale'); return 8; }
          if (phase === 'exhale') { setPhase('inhale'); return 4; }
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const phaseLabel = { inhale: 'Tarik Napas', hold: 'Tahan', exhale: 'Buang Napas' };
  const phaseColor = { inhale: 'text-sage', hold: 'text-[#A7A6D1]', exhale: 'text-blue-400' };

  return (
    <div className={`p-8 pt-20 flex flex-col h-full transition-colors duration-500 ${isDark ? 'bg-[#14142B]' : 'bg-[#FDFBF7]'}`}>
      <button onClick={onBack} className={`absolute top-8 left-8 p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-[#F5E6D3] text-neutral-400'}`}><ChevronLeft size={20} /></button>
      <div className="text-center space-y-2 mb-12">
         <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-neutral-800'}`}>Slow Rhythm</h2>
         <p className={`font-black uppercase tracking-[0.3em] text-xs ${phaseColor[phase]}`}>{phaseLabel[phase]}</p>
      </div>
      <div className="flex-grow flex items-center justify-center relative">
         <motion.div 
            animate={{ scale: phase === 'inhale' ? 1.4 : phase === 'exhale' ? 1 : 1.4 }}
            transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 7, ease: 'easeInOut' }}
            className={`w-72 h-72 rounded-full flex items-center justify-center border-2 border-dashed ${phase === 'inhale' ? 'border-sage/30' : 'border-[#A7A6D1]/30'}`}
         >
            <div className={`w-48 h-48 rounded-[60px] flex flex-col items-center justify-center shadow-2xl text-white transition-all duration-1000 ${phase === 'inhale' ? 'bg-sage shadow-sage/30' : phase === 'hold' ? 'bg-[#A7A6D1] shadow-[#A7A6D1]/30' : 'bg-blue-400 shadow-blue-200'}`}>
               <span className="text-5xl font-serif font-bold italic">{counter}</span>
               <span className="text-[10px] font-black uppercase tracking-widest mt-2">{phase}</span>
            </div>
         </motion.div>
      </div>
      <div className="py-8 grid grid-cols-2 gap-4">
        <button onClick={onBack} className={`py-4 rounded-2xl font-bold ${isDark ? 'bg-white/5 text-white/40' : 'bg-neutral-100 text-neutral-400'}`}>Akhiri</button>
        <Button onClick={() => { 
          onFinish?.(); 
          onBack(); 
        }} isDark={isDark} className="bg-blue-400 shadow-blue-400/20">Selesai & Simpan</Button>
      </div>
    </div>
  );
};
