import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/lib/vf';
import pb from '@/lib/pocketbaseClient';
import {
  LayoutDashboard, Compass, Send, FolderKanban, Users, Rocket,
  TrendingUp, GraduationCap, Bell, LogOut, Menu, X, Flame
} from 'lucide-react';

export const cx = (...a) => a.filter(Boolean).join(' ');

export function Avatar({ user, size = 40 }) {
  const url = user?.avatar ? pb.files.getURL(user, user.avatar) : null;
  return (
    <div className="rounded-full bg-primary/20 grid place-items-center font-display font-semibold text-primary overflow-hidden shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : initials(user?.name)}
    </div>
  );
}

export function Chip({ children, active, onClick, tone = 'default' }) {
  return (
    <button onClick={onClick} type="button"
      className={cx('px-3 py-1 rounded-full text-xs font-medium border transition',
        active ? 'bg-primary text-primary-foreground border-primary'
          : tone === 'accent' ? 'bg-accent/10 text-accent border-accent/30'
          : 'bg-secondary/60 text-muted-foreground border-border hover:border-primary/50')}>
      {children}
    </button>
  );
}

export function Card({ className, children, ...p }) {
  return <div className={cx('rounded-2xl border border-border bg-card p-5', className)} {...p}>{children}</div>;
}

export function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground/90">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputCls = 'w-full rounded-xl bg-secondary/50 border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary transition';

export function Btn({ variant = 'primary', className, ...p }) {
  const v = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110',
    ghost: 'bg-secondary/60 text-foreground hover:bg-secondary border border-border',
    accent: 'bg-accent text-accent-foreground hover:brightness-110',
    danger: 'bg-destructive/90 text-white hover:bg-destructive',
  }[variant];
  return <button className={cx('px-4 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50', v, className)} {...p} />;
}

export function TrustBadge({ score = 0, className }) {
  const tone = score >= 75 ? 'text-accent' : score >= 50 ? 'text-primary' : 'text-muted-foreground';
  return (
    <span className={cx('inline-flex items-center gap-1 text-xs font-semibold', tone, className)}>
      <Flame className="w-3.5 h-3.5" /> {score}
    </span>
  );
}

export function Empty({ title, sub, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-border rounded-2xl">
      <p className="font-display text-lg">{title}</p>
      {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/opportunities', label: 'Opportunities', icon: Compass },
  { to: '/app/applications', label: 'Applications', icon: Send },
  { to: '/app/projects', label: 'Workspaces', icon: FolderKanban },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/startups', label: 'Investor Hub', icon: TrendingUp },
  { to: '/app/mentors', label: 'Mentors', icon: Rocket },
  { to: '/app/learn', label: 'Learn', icon: GraduationCap },
];

export function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = () => pb.collection('notifications').getFullList({ filter: `owner="${user.id}" && read=false` })
      .then((r) => setUnread(r.length)).catch(() => {});
    load();
    void pb.collection('notifications').subscribe('*', load).catch(() => {});
    return () => { void pb.collection('notifications').unsubscribe('*').catch(() => {}); };
  }, [user]);

  const doLogout = () => { logout(); nav('/'); };

  const SideLinks = (
    <nav className="space-y-1">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
          className={({ isActive }) => cx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
            isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50')}>
          <n.icon className="w-[18px] h-[18px]" /> {n.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border p-4 sticky top-0 h-screen">
        <Brand />
        <div className="mt-6 flex-1">{SideLinks}</div>
        <UserCard user={user} onLogout={doLogout} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-4 flex flex-col">
            <div className="flex items-center justify-between"><Brand /><button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button></div>
            <div className="mt-6 flex-1">{SideLinks}</div>
            <UserCard user={user} onLogout={doLogout} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
          <NavLink to="/app/notifications" className="relative p-2 rounded-xl hover:bg-secondary/60">
            <Bell className="w-5 h-5" />
            {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center">{unread}</span>}
          </NavLink>
          <NavLink to="/app/profile"><Avatar user={user} size={34} /></NavLink>
        </header>
        <main className="p-4 lg:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <NavLink to="/app" className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
        <Flame className="w-5 h-5 text-white" />
      </div>
      <span className="font-display font-bold text-lg tracking-tight">VentureForge</span>
    </NavLink>
  );
}

function UserCard({ user, onLogout }) {
  return (
    <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
      <Avatar user={user} size={38} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{user?.name || 'Builder'}</p>
        <p className="text-xs text-muted-foreground truncate">{user?.role || 'Member'}</p>
      </div>
      <button onClick={onLogout} className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground"><LogOut className="w-4 h-4" /></button>
    </div>
  );
}
