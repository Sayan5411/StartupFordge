import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext';
import { ROLES, CATEGORIES, STACKS, LOCATION_TYPES, computeTrustScore, matchScore, notify } from '@/lib/vf';
import { Card, Btn, Chip, Field, inputCls, Avatar, TrustBadge, Empty, cx } from '@/components/Shell';
import {
  Flame, Github, ArrowRight, Plus, MapPin, Clock, Target, Sparkles, Send,
  Check, X, MessageSquare, Trash2, Calendar, FileUp, Rocket, TrendingUp,
  Heart, GraduationCap, Users, Compass, Zap
} from 'lucide-react';

const arr = (v) => (Array.isArray(v) ? v : []);
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/* ---------------- LANDING ---------------- */
export function Landing() {
  const { isAuthed } = useAuth();
  const to = isAuthed ? '/app' : '/signup';
  const phases = [
    ['Idea', Sparkles], ['Opportunity', Compass], ['Team', Users], ['Workspace', MessageSquare],
    ['MVP', Zap], ['Hackathon', Rocket], ['Startup', TrendingUp], ['Funding', Flame],
  ];
  return (
    <div className="min-h-screen vf-grid-bg">
      <header className="flex items-center justify-between px-6 lg:px-12 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center"><Flame className="w-5 h-5 text-white" /></div>
          <span className="font-display font-bold text-lg">VentureForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link>
          <Link to={to}><Btn>Get started</Btn></Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 vf-rise">
          <Sparkles className="w-3.5 h-3.5" /> Where ideas become companies
        </span>
        <h1 className="font-display font-bold text-5xl lg:text-7xl mt-6 leading-[1.05] vf-rise" style={{ animationDelay: '.05s' }}>
          Build the <span className="text-primary">team</span> before<br />you build the <span className="text-accent">company</span>.
        </h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto vf-rise" style={{ animationDelay: '.1s' }}>
          VentureForge connects founders, developers, designers, marketers, mentors and investors into one ecosystem — from raw idea to funded startup.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8 vf-rise" style={{ animationDelay: '.15s' }}>
          <Link to={to}><Btn className="px-6 py-3">Start forging <ArrowRight className="inline w-4 h-4 ml-1" /></Btn></Link>
          <Link to="/login"><Btn variant="ghost" className="px-6 py-3">I have an account</Btn></Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-wrap justify-center gap-2">
          {phases.map(([label, Icon], i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border">
                <Icon className="w-4 h-4 text-primary" /><span className="text-sm font-medium">{label}</span>
              </div>
              {i < phases.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground self-center" />}
            </React.Fragment>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-16">
          {[
            ['Opportunity Board', 'Post abstracted listings that protect your IP and attract skill-matched builders.', Compass],
            ['AI Matchmaking', 'Get recommended teammates and projects based on skills and complementary dynamics.', Sparkles],
            ['Private Workspace', 'Chat, Kanban, files, milestones and meetings — everything your team needs to ship.', MessageSquare],
            ['1-Click Startup', 'Convert a completed MVP into a pitch-ready startup profile instantly.', Rocket],
            ['Investor Hub', 'Surface traction and pitch decks to vetted early-stage investors.', TrendingUp],
            ['Learning Hub', 'Guides and mentorship for first-time founders and student builders.', GraduationCap],
          ].map(([t, d, Icon]) => (
            <Card key={t} className="hover:border-primary/40 transition">
              <Icon className="w-6 h-6 text-accent" />
              <h3 className="font-display text-lg mt-3">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{d}</p>
            </Card>
          ))}
        </div>
      </section>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        VentureForge — The collaboration platform where ideas become startups. © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

/* ---------------- AUTH ---------------- */
export function AuthPage({ mode }) {
  const { login, signup, oauth } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '', name: '', role: 'Founder', headline: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const isSignup = mode === 'signup';

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (isSignup) await signup(f); else await login(f.email, f.password);
      nav('/app');
    } catch (ex) { setErr(ex?.message || 'Something went wrong'); } finally { setBusy(false); }
  };
  const social = async (p) => { try { await oauth(p); nav('/app'); } catch (ex) { setErr(ex?.message || 'OAuth failed'); } };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 vf-grid-bg border-r border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center"><Flame className="w-5 h-5 text-white" /></div>
          <span className="font-display font-bold text-lg">VentureForge</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl leading-tight">"I have an idea,<br />but I don't have<br />the right team."</h2>
          <p className="text-muted-foreground mt-4 max-w-sm">We solve the single biggest bottleneck in innovation. Join thousands forming multidisciplinary teams.</p>
        </div>
        <span className="text-sm text-muted-foreground">Where ideas become companies.</span>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          {err && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{err}</p>}
          <div className="grid grid-cols-2 gap-2">
            <Btn type="button" variant="ghost" onClick={() => social('google')} className="justify-center">Google</Btn>
            <Btn type="button" variant="ghost" onClick={() => social('github')} className="justify-center"><Github className="inline w-4 h-4 mr-1" />GitHub</Btn>
          </div>
          <div className="text-center text-xs text-muted-foreground">or with email</div>
          {isSignup && <>
            <Field label="Full name"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></Field>
            <Field label="I am a...">
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => <Chip key={r} active={f.role === r} onClick={() => setF({ ...f, role: r })}>{r}</Chip>)}
              </div>
            </Field>
          </>}
          <Field label="Email"><input type="email" className={inputCls} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></Field>
          <Field label="Password" hint={isSignup ? 'At least 8 characters' : ''}><input type="password" className={inputCls} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required minLength={8} /></Field>
          <Btn disabled={busy} className="w-full justify-center">{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}</Btn>
          <p className="text-sm text-center text-muted-foreground">
            {isSignup ? 'Already a member? ' : 'New here? '}
            <Link to={isSignup ? '/login' : '/signup'} className="text-primary font-medium">{isSignup ? 'Log in' : 'Sign up'}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
export function Dashboard() {
  const { user } = useAuth();
  const [opps, setOpps] = useState([]);
  const [apps, setApps] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    pb.collection('opportunities').getFullList({ sort: '-created', filter: 'status="open"' }).then(setOpps).catch(() => {});
    pb.collection('applications').getFullList({ filter: `owner="${user.id}"`, expand: 'opportunity' }).then(setApps).catch(() => {});
    pb.collection('projects').getFullList({ sort: '-created' }).then((p) => setProjects(p.filter((x) => x.owner === user.id || arr(x.members).includes(user.id)))).catch(() => {});
  }, [user.id]);

  const recommended = useMemo(() =>
    [...opps].filter((o) => o.owner !== user.id).map((o) => ({ o, m: matchScore(user, o) })).sort((a, b) => b.m - a.m).slice(0, 3),
    [opps, user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Welcome, {(user.name || 'builder').split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening across your ecosystem.</p>
      </div>
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Trust Score" value={user.trustScore ?? computeTrustScore(user)} tone="accent" />
        <Stat label="Open Opportunities" value={opps.length} />
        <Stat label="My Applications" value={apps.length} />
        <Stat label="My Workspaces" value={projects.length} />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-accent" /><h2 className="font-display text-xl">AI Matchmaking — recommended for you</h2></div>
        {recommended.length === 0 ? <Empty title="No matches yet" sub="Complete your skills to unlock recommendations." action={<Link to="/app/profile"><Btn>Edit profile</Btn></Link>} /> : (
          <div className="grid md:grid-cols-3 gap-4">
            {recommended.map(({ o, m }) => (
              <Link key={o.id} to={`/app/opportunities/${o.id}`}>
                <Card className="h-full hover:border-primary/40 transition">
                  <div className="flex justify-between items-start"><span className="text-xs text-accent font-semibold">{m}% match</span><span className="text-xs text-muted-foreground">{o.category}</span></div>
                  <h3 className="font-display mt-2">{o.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{o.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3"><h2 className="font-display text-xl">Latest opportunities</h2><Link to="/app/opportunities" className="text-sm text-primary">View all</Link></div>
        <div className="space-y-2">
          {opps.slice(0, 5).map((o) => (
            <Link key={o.id} to={`/app/opportunities/${o.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 transition">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm flex-1">{o.title}</span>
              <span className="text-xs text-muted-foreground">{o.locationType}</span>
            </Link>
          ))}
          {opps.length === 0 && <Empty title="No opportunities yet" action={<Link to="/app/opportunities/new"><Btn>Post one</Btn></Link>} />}
        </div>
      </section>
    </div>
  );
}
function Stat({ label, value, tone }) {
  return <Card className={cx('py-4', tone === 'accent' && 'border-accent/40')}><p className="text-xs text-muted-foreground">{label}</p><p className={cx('font-display text-3xl mt-1', tone === 'accent' && 'text-accent')}>{value}</p></Card>;
}

/* ---------------- OPPORTUNITIES ---------------- */
export function Opportunities() {
  const { user } = useAuth();
  const [opps, setOpps] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [loc, setLoc] = useState('');
  const [stacks, setStacks] = useState([]);

  useEffect(() => { pb.collection('opportunities').getFullList({ sort: '-created', filter: 'status="open"' }).then(setOpps).catch(() => {}); }, []);

  const filtered = opps.filter((o) => {
    if (q && !(`${o.title} ${o.summary} ${o.category}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (cat && o.category !== cat) return false;
    if (loc && o.locationType !== loc) return false;
    if (stacks.length && !stacks.every((s) => arr(o.stack).includes(s))) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl">Opportunity Board</h1><p className="text-muted-foreground mt-1">Skill-matched projects looking for builders.</p></div>
        <Link to="/app/opportunities/new"><Btn><Plus className="inline w-4 h-4 mr-1" />Post</Btn></Link>
      </div>
      <Card className="space-y-3">
        <input className={inputCls} placeholder="Search opportunities…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-1.5"><Chip active={!cat} onClick={() => setCat('')}>All categories</Chip>{CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
        <div className="flex flex-wrap gap-1.5">{LOCATION_TYPES.map((l) => <Chip key={l} tone="accent" active={loc === l} onClick={() => setLoc(loc === l ? '' : l)}>{l}</Chip>)}</div>
        <div className="flex flex-wrap gap-1.5">{STACKS.map((s) => <Chip key={s} active={stacks.includes(s)} onClick={() => setStacks(toggle(stacks, s))}>{s}</Chip>)}</div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((o) => (
          <Link key={o.id} to={`/app/opportunities/${o.id}`}>
            <Card className="h-full hover:border-primary/40 transition">
              <div className="flex justify-between items-start">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{o.category || 'General'}</span>
                <span className="text-xs text-accent font-semibold">{matchScore(user, o)}% match</span>
              </div>
              <h3 className="font-display text-lg mt-3">{o.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{o.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">{arr(o.rolesNeeded).slice(0, 4).map((r) => <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-secondary">{r}</span>)}</div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{o.locationType}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{o.duration || '—'}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <Empty title="No opportunities match" sub="Try clearing some filters." />}
    </div>
  );
}

export function NewOpportunity() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ title: '', summary: '', description: '', category: CATEGORIES[0], locationType: 'Remote', location: '', duration: '3 Months', commitmentHours: 10, goal: 'Hackathon → Startup', stack: [], rolesNeeded: [] });
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const rec = await pb.collection('opportunities').create({ ...f, status: 'open', owner: user.id });
      nav(`/app/opportunities/${rec.id}`);
    } catch (ex) { alert(ex?.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <h1 className="font-display text-3xl">Post an Opportunity</h1>
      <p className="text-muted-foreground -mt-3 text-sm">Abstract your idea into a non-confidential listing to protect your IP.</p>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required placeholder="e.g. VisionGuard" /></Field>
      <Field label="One-line summary"><input className={inputCls} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} maxLength={400} /></Field>
      <Field label="Description"><textarea className={inputCls} rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category"><select className={inputCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Location type"><select className={inputCls} value={f.locationType} onChange={(e) => setF({ ...f, locationType: e.target.value })}>{LOCATION_TYPES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Duration"><input className={inputCls} value={f.duration} onChange={(e) => setF({ ...f, duration: e.target.value })} /></Field>
        <Field label="Weekly hours"><input type="number" className={inputCls} value={f.commitmentHours} onChange={(e) => setF({ ...f, commitmentHours: +e.target.value })} /></Field>
      </div>
      <Field label="Goal"><input className={inputCls} value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })} /></Field>
      <Field label="Tech stack"><div className="flex flex-wrap gap-1.5">{STACKS.map((s) => <Chip key={s} active={f.stack.includes(s)} onClick={() => setF({ ...f, stack: toggle(f.stack, s) })}>{s}</Chip>)}</div></Field>
      <Field label="Roles needed">
        <div className="flex gap-2"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. UI Designer" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (role) { setF({ ...f, rolesNeeded: [...f.rolesNeeded, role] }); setRole(''); } } }} /><Btn type="button" variant="ghost" onClick={() => { if (role) { setF({ ...f, rolesNeeded: [...f.rolesNeeded, role] }); setRole(''); } }}>Add</Btn></div>
        <div className="flex flex-wrap gap-1.5 mt-2">{f.rolesNeeded.map((r, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary flex items-center gap-1">{r}<button type="button" onClick={() => setF({ ...f, rolesNeeded: f.rolesNeeded.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button></span>)}</div>
      </Field>
      <Btn disabled={busy} className="w-full justify-center">{busy ? 'Publishing…' : 'Publish opportunity'}</Btn>
    </form>
  );
}

export function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [o, setO] = useState(null);
  const [apps, setApps] = useState([]);
  const [showApply, setShowApply] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [roleApplied, setRoleApplied] = useState('');

  const load = async () => {
    const opp = await pb.collection('opportunities').getOne(id, { expand: 'owner' }).catch(() => null);
    setO(opp);
    // Applicant data (names, motivation text) is only fetched for the
    // opportunity owner - a plain visitor/applicant has no reason to see
    // everyone else's applications, and shouldn't have that data land in
    // client state at all.
    if (opp && opp.owner === user.id) {
      pb.collection('applications').getFullList({ filter: `opportunity="${id}"`, expand: 'owner' }).then(setApps).catch(() => {});
    } else {
      pb.collection('applications').getFullList({ filter: `opportunity="${id}" && owner="${user.id}"` }).then(setApps).catch(() => {});
    }
  };
  useEffect(() => { load(); }, [id]);
  if (!o) return <Empty title="Loading…" />;
  const isOwner = o.owner === user.id;
  const mine = apps.find((a) => a.owner === user.id);

  const apply = async (e) => {
    e.preventDefault();
    const rec = await pb.collection('applications').create({ opportunity: id, roleApplied, motivation, status: 'pending', owner: user.id });
    await notify(o.owner, `New application for "${o.title}"`, `/app/opportunities/${id}`);
    setShowApply(false); setApps([...apps, { ...rec, expand: { owner: user } }]);
  };
  const decide = async (a, status) => {
    await pb.collection('applications').update(a.id, { status });
    await notify(a.owner, `Your application for "${o.title}" was ${status}`, '/app/applications');
    if (status === 'accepted') {
      let proj;
      try { proj = (await pb.collection('projects').getFullList({ filter: `opportunity="${id}"` }))[0]; } catch (_) {}
      if (!proj) proj = await pb.collection('projects').create({ name: o.title, tagline: o.summary, category: o.category, opportunity: id, members: [a.owner], status: 'active', owner: user.id });
      else await pb.collection('projects').update(proj.id, { 'members+': a.owner });
    }
    load();
  };
  const del = async () => { if (confirm('Delete this opportunity?')) { await pb.collection('opportunities').delete(id); nav('/app/opportunities'); } };

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/app/opportunities" className="text-sm text-muted-foreground">← Back to board</Link>
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{o.category}</span>
            <h1 className="font-display text-3xl mt-3">{o.title}</h1>
            <p className="text-muted-foreground mt-1">{o.summary}</p>
          </div>
          <span className="text-sm text-accent font-semibold shrink-0">{matchScore(user, o)}% match</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{o.locationType} {o.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{o.duration} · {o.commitmentHours}h/wk</span>
          <span className="flex items-center gap-1"><Target className="w-4 h-4" />{o.goal}</span>
        </div>
        {o.description && <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{o.description}</p>}
        <div className="flex flex-wrap gap-1.5 mt-4">{arr(o.stack).map((s) => <span key={s} className="text-xs px-2 py-1 rounded-full bg-secondary">{s}</span>)}</div>
        <div className="flex flex-wrap gap-1.5 mt-2">{arr(o.rolesNeeded).map((r) => <span key={r} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{r}</span>)}</div>
        <div className="mt-6 flex gap-3">
          {isOwner ? <Btn variant="danger" onClick={del}><Trash2 className="inline w-4 h-4 mr-1" />Delete</Btn> :
            mine ? <span className="text-sm px-4 py-2.5 rounded-xl bg-secondary">Application {mine.status}</span> :
              <Btn onClick={() => setShowApply(true)}><Send className="inline w-4 h-4 mr-1" />Apply now</Btn>}
        </div>
      </Card>

      {showApply && !isOwner && (
        <Card>
          <h3 className="font-display text-lg mb-3">Apply to {o.title}</h3>
          <form onSubmit={apply} className="space-y-3">
            <Field label="Role you're applying for"><select className={inputCls} value={roleApplied} onChange={(e) => setRoleApplied(e.target.value)}><option value="">Select…</option>{arr(o.rolesNeeded).map((r) => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Your motivation"><textarea className={inputCls} rows={4} value={motivation} onChange={(e) => setMotivation(e.target.value)} required /></Field>
            <div className="flex gap-2"><Btn className="flex-1 justify-center">Submit</Btn><Btn type="button" variant="ghost" onClick={() => setShowApply(false)}>Cancel</Btn></div>
          </form>
        </Card>
      )}

      {isOwner && (
        <div>
          <h2 className="font-display text-xl mb-3">Applicants ({apps.length})</h2>
          <div className="space-y-3">
            {apps.map((a) => (
              <Card key={a.id} className="flex items-center gap-3">
                <Avatar user={a.expand?.owner} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="font-medium">{a.expand?.owner?.name || 'Applicant'}</p><TrustBadge score={a.expand?.owner?.trustScore ?? 0} /></div>
                  <p className="text-xs text-muted-foreground">{a.roleApplied} · {a.expand?.owner?.role}</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{a.motivation}</p>
                </div>
                {a.status === 'pending' ? (
                  <div className="flex gap-2"><Btn variant="accent" onClick={() => decide(a, 'accepted')}><Check className="w-4 h-4" /></Btn><Btn variant="danger" onClick={() => decide(a, 'rejected')}><X className="w-4 h-4" /></Btn></div>
                ) : <span className={cx('text-xs px-2 py-1 rounded-full', a.status === 'accepted' ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive')}>{a.status}</span>}
              </Card>
            ))}
            {apps.length === 0 && <Empty title="No applications yet" />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- APPLICATIONS ---------------- */
export function Applications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  useEffect(() => { pb.collection('applications').getFullList({ filter: `owner="${user.id}"`, sort: '-created', expand: 'opportunity' }).then(setApps).catch(() => {}); }, [user.id]);
  const tone = { pending: 'bg-secondary text-muted-foreground', accepted: 'bg-accent/10 text-accent', rejected: 'bg-destructive/10 text-destructive' };
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">My Applications</h1>
      <div className="space-y-3">
        {apps.map((a) => (
          <Link key={a.id} to={`/app/opportunities/${a.opportunity}`}><Card className="flex items-center gap-3 hover:border-primary/40 transition">
            <Send className="w-4 h-4 text-primary" />
            <div className="flex-1"><p className="font-medium">{a.expand?.opportunity?.title || 'Opportunity'}</p><p className="text-xs text-muted-foreground">{a.roleApplied}</p></div>
            <span className={cx('text-xs px-2 py-1 rounded-full', tone[a.status])}>{a.status}</span>
          </Card></Link>
        ))}
        {apps.length === 0 && <Empty title="No applications yet" sub="Browse the board and apply to a project." action={<Link to="/app/opportunities"><Btn>Browse</Btn></Link>} />}
      </div>
    </div>
  );
}

/* ---------------- PROJECTS / WORKSPACE ---------------- */
export function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  useEffect(() => { pb.collection('projects').getFullList({ sort: '-created' }).then((p) => setProjects(p.filter((x) => x.owner === user.id || arr(x.members).includes(user.id)))).catch(() => {}); }, [user.id]);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">My Workspaces</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Link key={p.id} to={`/app/projects/${p.id}`}><Card className="hover:border-primary/40 transition">
            <div className="flex justify-between"><h3 className="font-display text-lg">{p.name}</h3><span className={cx('text-xs px-2 py-1 rounded-full', p.status === 'startup' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary')}>{p.status}</span></div>
            <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>
            <p className="text-xs text-muted-foreground mt-3">{arr(p.members).length + 1} members</p>
          </Card></Link>
        ))}
        {projects.length === 0 && <Empty title="No workspaces yet" sub="Accept an applicant or get accepted to start collaborating." />}
      </div>
    </div>
  );
}

const COLS = [['backlog', 'Backlog'], ['todo', 'To Do'], ['doing', 'In Progress'], ['done', 'Done']];
export function Workspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [tab, setTab] = useState('chat');
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [miles, setMiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => { pb.collection('projects').getOne(id).then(setP).catch(() => {}); }, [id]);
  useEffect(() => {
    const f = `project="${id}"`;
    pb.collection('messages').getFullList({ filter: f, sort: 'created', expand: 'owner' }).then(setMsgs).catch(() => {});
    pb.collection('tasks').getFullList({ filter: f, sort: 'order' }).then(setTasks).catch(() => {});
    pb.collection('milestones').getFullList({ filter: f, sort: 'created' }).then(setMiles).catch(() => {});
    pb.collection('workspace_files').getFullList({ filter: f, sort: '-created' }).then(setFiles).catch(() => {});
    pb.collection('meetings').getFullList({ filter: f, sort: 'at' }).then(setMeetings).catch(() => {});
    void pb.collection('messages').subscribe('*', (e) => {
      if (e.record.project !== id) return;
      pb.collection('messages').getFullList({ filter: f, sort: 'created', expand: 'owner' }).then(setMsgs).catch(() => {});
    }).catch(() => {});
    return () => { void pb.collection('messages').unsubscribe('*').catch(() => {}); };
  }, [id]);

  if (!p) return <Empty title="Loading…" />;
  const send = async (e) => { e.preventDefault(); if (!text.trim()) return; const t = text; setText(''); await pb.collection('messages').create({ project: id, text: t, owner: user.id }); };
  const addTask = async (col) => { const title = prompt('Task title'); if (!title) return; const rec = await pb.collection('tasks').create({ project: id, title, column: col, order: tasks.length, owner: user.id }); setTasks([...tasks, rec]); };
  const moveTask = async (t, col) => { await pb.collection('tasks').update(t.id, { column: col }); setTasks(tasks.map((x) => x.id === t.id ? { ...x, column: col } : x)); };
  const addMile = async () => { const title = prompt('Milestone'); if (!title) return; const rec = await pb.collection('milestones').create({ project: id, title, done: false, owner: user.id }); setMiles([...miles, rec]); };
  const toggleMile = async (m) => { await pb.collection('milestones').update(m.id, { done: !m.done }); setMiles(miles.map((x) => x.id === m.id ? { ...x, done: !x.done } : x)); };
  const upload = async (e) => { const file = e.target.files[0]; if (!file) return; const fd = new FormData(); fd.append('project', id); fd.append('label', file.name); fd.append('file', file); fd.append('owner', user.id); const rec = await pb.collection('workspace_files').create(fd); setFiles([rec, ...files]); };
  const addMeeting = async () => { const title = prompt('Meeting title'); if (!title) return; const at = prompt('When? (YYYY-MM-DD HH:MM)'); const link = prompt('Video link (optional)') || ''; const rec = await pb.collection('meetings').create({ project: id, title, at: at || null, link, owner: user.id }); setMeetings([...meetings, rec]); };
  const convert = async () => { if (!confirm('Convert this project into a startup profile?')) return; await pb.collection('projects').update(id, { status: 'startup' }); const s = await pb.collection('startups').create({ name: p.name, tagline: p.tagline, category: p.category, stage: 'pre-seed', project: id, owner: user.id }); nav(`/app/startups/${s.id}`); };
  const isOwner = p.owner === user.id;

  const TABS = [['chat', 'Chat'], ['board', 'Kanban'], ['milestones', 'Milestones'], ['files', 'Files'], ['meetings', 'Meetings']];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Link to="/app/projects" className="text-sm text-muted-foreground">← Workspaces</Link><h1 className="font-display text-3xl mt-1">{p.name}</h1></div>
        {isOwner && p.status !== 'startup' && <Btn variant="accent" onClick={convert}><Rocket className="inline w-4 h-4 mr-1" />Convert to Startup</Btn>}
        {p.status === 'startup' && <span className="text-sm px-3 py-2 rounded-xl bg-accent/10 text-accent">Startup</span>}
      </div>
      <div className="flex gap-1.5 flex-wrap">{TABS.map(([k, l]) => <Chip key={k} active={tab === k} onClick={() => setTab(k)}>{l}</Chip>)}</div>

      {tab === 'chat' && (
        <Card className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto vf-scroll space-y-3 pr-2">
            {msgs.map((m) => (
              <div key={m.id} className={cx('flex gap-2', m.owner === user.id && 'flex-row-reverse')}>
                <Avatar user={m.expand?.owner} size={30} />
                <div className={cx('max-w-[70%] rounded-2xl px-3.5 py-2 text-sm', m.owner === user.id ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>{m.text}</div>
              </div>
            ))}
            {msgs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages. Say hello 👋</p>}
          </div>
          <form onSubmit={send} className="flex gap-2 mt-3"><input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="Message…" /><Btn><Send className="w-4 h-4" /></Btn></form>
        </Card>
      )}

      {tab === 'board' && (
        <div className="grid md:grid-cols-4 gap-3">
          {COLS.map(([col, label]) => (
            <div key={col} className="bg-card/50 rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">{label}</span><button onClick={() => addTask(col)}><Plus className="w-4 h-4 text-muted-foreground" /></button></div>
              <div className="space-y-2">
                {tasks.filter((t) => t.column === col).map((t) => (
                  <div key={t.id} className="bg-secondary rounded-xl p-3 text-sm">
                    {t.title}
                    <div className="flex gap-1 mt-2">{COLS.filter(([c]) => c !== col).map(([c, l]) => <button key={c} onClick={() => moveTask(t, c)} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 text-muted-foreground hover:text-primary">{l}</button>)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'milestones' && (
        <Card>
          <div className="flex justify-between mb-3"><h3 className="font-display">Timeline</h3><Btn variant="ghost" onClick={addMile}><Plus className="w-4 h-4" /></Btn></div>
          <div className="space-y-2">
            {miles.map((m) => (
              <button key={m.id} onClick={() => toggleMile(m)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border text-left">
                <span className={cx('w-5 h-5 rounded-full border grid place-items-center', m.done ? 'bg-accent border-accent' : 'border-muted-foreground')}>{m.done && <Check className="w-3 h-3 text-accent-foreground" />}</span>
                <span className={cx('flex-1 text-sm', m.done && 'line-through text-muted-foreground')}>{m.title}</span>
              </button>
            ))}
            {miles.length === 0 && <p className="text-sm text-muted-foreground">No milestones yet.</p>}
          </div>
        </Card>
      )}

      {tab === 'files' && (
        <Card>
          <label className="flex items-center justify-center gap-2 p-6 border border-dashed border-border rounded-xl cursor-pointer text-sm text-muted-foreground hover:border-primary/40">
            <FileUp className="w-5 h-5" /> Upload a file<input type="file" className="hidden" onChange={upload} />
          </label>
          <div className="mt-3 space-y-2">
            {files.map((fl) => (
              <a key={fl.id} href={pb.files.getURL(fl, fl.file)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 text-sm"><FileUp className="w-4 h-4 text-primary" />{fl.label}</a>
            ))}
          </div>
        </Card>
      )}

      {tab === 'meetings' && (
        <Card>
          <div className="flex justify-between mb-3"><h3 className="font-display">Scheduled meetings</h3><Btn variant="ghost" onClick={addMeeting}><Plus className="w-4 h-4" /></Btn></div>
          <div className="space-y-2">
            {meetings.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl border border-border text-sm"><Calendar className="w-4 h-4 text-primary" /><div className="flex-1"><p className="font-medium">{m.title}</p><p className="text-xs text-muted-foreground">{m.at ? new Date(m.at).toLocaleString() : 'TBD'}</p></div>{m.link && <a href={m.link} target="_blank" rel="noreferrer" className="text-xs text-primary">Join</a>}</div>
            ))}
            {meetings.length === 0 && <p className="text-sm text-muted-foreground">No meetings scheduled.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------------- COMMUNITY ---------------- */
export function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [kind, setKind] = useState('update');
  useEffect(() => { pb.collection('posts').getFullList({ sort: '-created', expand: 'owner' }).then(setPosts).catch(() => {}); }, []);
  const post = async (e) => { e.preventDefault(); if (!content.trim()) return; const rec = await pb.collection('posts').create({ content, kind, likes: [], owner: user.id }); setPosts([{ ...rec, expand: { owner: user } }, ...posts]); setContent(''); };
  const like = async (p) => { const likes = arr(p.likes); const next = likes.includes(user.id) ? likes.filter((x) => x !== user.id) : [...likes, user.id]; await pb.collection('posts').update(p.id, { likes: next }); setPosts(posts.map((x) => x.id === p.id ? { ...x, likes: next } : x)); };
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl">Community Feed</h1>
      <Card>
        <form onSubmit={post} className="space-y-3">
          <textarea className={inputCls} rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share an update, announcement or event…" />
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">{['update', 'announcement', 'event'].map((k) => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{k}</Chip>)}</div>
            <Btn>Post</Btn>
          </div>
        </form>
      </Card>
      <div className="space-y-3">
        {posts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center gap-3"><Avatar user={p.expand?.owner} size={36} /><div><p className="font-medium text-sm">{p.expand?.owner?.name}</p><p className="text-xs text-muted-foreground">{p.expand?.owner?.role} · {p.kind}</p></div></div>
            <p className="text-sm mt-3 whitespace-pre-wrap">{p.content}</p>
            <button onClick={() => like(p)} className={cx('flex items-center gap-1.5 mt-3 text-sm', arr(p.likes).includes(user.id) ? 'text-accent' : 'text-muted-foreground')}><Heart className="w-4 h-4" />{arr(p.likes).length}</button>
          </Card>
        ))}
        {posts.length === 0 && <Empty title="No posts yet" sub="Be the first to share." />}
      </div>
    </div>
  );
}

/* ---------------- INVESTOR HUB / STARTUPS ---------------- */
export function Startups() {
  const [startups, setStartups] = useState([]);
  useEffect(() => { pb.collection('startups').getFullList({ sort: '-created', expand: 'owner' }).then(setStartups).catch(() => {}); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl">Investor Hub</h1><p className="text-muted-foreground mt-1">Discover high-potential startups early.</p></div>
      <div className="grid md:grid-cols-2 gap-4">
        {startups.map((s) => (
          <Link key={s.id} to={`/app/startups/${s.id}`}><Card className="hover:border-accent/40 transition h-full">
            <div className="flex justify-between"><h3 className="font-display text-lg">{s.name}</h3><span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{s.stage}</span></div>
            <p className="text-sm text-muted-foreground mt-1">{s.tagline}</p>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground"><span>{s.category}</span>{s.raising ? <span>Raising ${(s.raising / 1000).toFixed(0)}k</span> : null}</div>
          </Card></Link>
        ))}
        {startups.length === 0 && <Empty title="No startups yet" sub="Convert a workspace to create the first one." />}
      </div>
    </div>
  );
}

export function StartupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({});
  useEffect(() => { pb.collection('startups').getOne(id, { expand: 'owner' }).then((r) => { setS(r); setF(r); }).catch(() => {}); }, [id]);
  if (!s) return <Empty title="Loading…" />;
  const isOwner = s.owner === user.id;
  const save = async () => { const rec = await pb.collection('startups').update(id, { tagline: f.tagline, description: f.description, stage: f.stage, raising: +f.raising || 0, traction: f.traction, pitchDeck: f.pitchDeck }); setS(rec); setEdit(false); };
  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/app/startups" className="text-sm text-muted-foreground">← Investor Hub</Link>
      <Card>
        <div className="flex justify-between items-start"><div><h1 className="font-display text-3xl">{s.name}</h1><p className="text-muted-foreground mt-1">{s.tagline}</p></div><span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{s.stage}</span></div>
        {edit ? (
          <div className="space-y-3 mt-4">
            <Field label="Tagline"><input className={inputCls} value={f.tagline || ''} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></Field>
            <Field label="Description"><textarea className={inputCls} rows={4} value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stage"><select className={inputCls} value={f.stage} onChange={(e) => setF({ ...f, stage: e.target.value })}>{['pre-seed', 'seed', 'series-a'].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Raising ($)"><input type="number" className={inputCls} value={f.raising || ''} onChange={(e) => setF({ ...f, raising: e.target.value })} /></Field>
            </div>
            <Field label="Traction"><input className={inputCls} value={f.traction || ''} onChange={(e) => setF({ ...f, traction: e.target.value })} /></Field>
            <Field label="Pitch deck URL"><input className={inputCls} value={f.pitchDeck || ''} onChange={(e) => setF({ ...f, pitchDeck: e.target.value })} /></Field>
            <div className="flex gap-2"><Btn onClick={save}>Save</Btn><Btn variant="ghost" onClick={() => setEdit(false)}>Cancel</Btn></div>
          </div>
        ) : (
          <>
            {s.description && <p className="text-sm mt-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: s.description }} />}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Info label="Category" value={s.category} />
              <Info label="Raising" value={s.raising ? `$${(s.raising / 1000).toFixed(0)}k` : '—'} />
              <Info label="Traction" value={s.traction || '—'} />
            </div>
            <div className="mt-5 flex gap-3">
              {s.pitchDeck && <a href={s.pitchDeck} target="_blank" rel="noreferrer"><Btn variant="accent">View pitch deck</Btn></a>}
              {isOwner && <Btn variant="ghost" onClick={() => setEdit(true)}>Edit profile</Btn>}
              {!isOwner && <Btn onClick={() => notify(s.owner, `An investor is interested in ${s.name}`)}>Express interest</Btn>}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
function Info({ label, value }) { return <div className="rounded-xl bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium text-sm mt-0.5">{value}</p></div>; }

/* ---------------- MENTORS ---------------- */
export function Mentors() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ expertise: '', rate: 'Free', availability: '', bio: '' });
  const load = () => pb.collection('mentors').getFullList({ sort: '-created', expand: 'owner' }).then(setMentors).catch(() => {});
  useEffect(load, []);
  const become = async (e) => { e.preventDefault(); await pb.collection('mentors').create({ ...f, focus: [], owner: user.id }); setShowForm(false); load(); };
  const book = async (m) => { const topic = prompt('What would you like guidance on?'); if (!topic) return; await pb.collection('bookings').create({ mentor: m.id, topic, status: 'requested', owner: user.id }); await notify(m.owner, `New mentorship request: ${topic}`); alert('Request sent!'); };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="font-display text-3xl">Mentor Directory</h1><p className="text-muted-foreground mt-1">Book time with experienced builders.</p></div><Btn variant="ghost" onClick={() => setShowForm(!showForm)}>Become a mentor</Btn></div>
      {showForm && <Card><form onSubmit={become} className="space-y-3">
        <Field label="Expertise"><input className={inputCls} value={f.expertise} onChange={(e) => setF({ ...f, expertise: e.target.value })} required placeholder="e.g. Go-to-market, fundraising" /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Rate"><input className={inputCls} value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} /></Field><Field label="Availability"><input className={inputCls} value={f.availability} onChange={(e) => setF({ ...f, availability: e.target.value })} placeholder="Weekends" /></Field></div>
        <Field label="Bio"><textarea className={inputCls} rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></Field>
        <Btn>Publish profile</Btn>
      </form></Card>}
      <div className="grid md:grid-cols-2 gap-4">
        {mentors.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center gap-3"><Avatar user={m.expand?.owner} /><div><div className="flex items-center gap-2"><p className="font-medium">{m.expand?.owner?.name}</p><TrustBadge score={m.expand?.owner?.trustScore ?? 0} /></div><p className="text-xs text-muted-foreground">{m.expertise}</p></div></div>
            <p className="text-sm text-muted-foreground mt-3" dangerouslySetInnerHTML={{ __html: m.bio }} />
            <div className="flex items-center justify-between mt-3"><span className="text-xs text-muted-foreground">{m.rate} · {m.availability}</span><Btn onClick={() => book(m)}><Calendar className="inline w-4 h-4 mr-1" />Book</Btn></div>
          </Card>
        ))}
        {mentors.length === 0 && <Empty title="No mentors yet" sub="Be the first to offer guidance." />}
      </div>
    </div>
  );
}

/* ---------------- LEARN ---------------- */
export function Learn() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [active, setActive] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ title: '', category: 'Fundraising', level: 'beginner', summary: '', body: '', minutes: 5 });
  const load = () => pb.collection('lessons').getFullList({ sort: '-created' }).then(setLessons).catch(() => {});
  useEffect(load, []);
  const create = async (e) => { e.preventDefault(); await pb.collection('lessons').create({ ...f, owner: user.id }); setShowForm(false); load(); };
  if (active) return (
    <div className="max-w-2xl space-y-4">
      <button onClick={() => setActive(null)} className="text-sm text-muted-foreground">← All guides</button>
      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{active.level} · {active.minutes} min</span>
      <h1 className="font-display text-3xl">{active.title}</h1>
      <p className="text-muted-foreground">{active.summary}</p>
      <div className="text-sm leading-relaxed whitespace-pre-wrap prose-invert" dangerouslySetInnerHTML={{ __html: active.body }} />
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="font-display text-3xl">Learning Hub</h1><p className="text-muted-foreground mt-1">Guides for first-time founders.</p></div><Btn variant="ghost" onClick={() => setShowForm(!showForm)}>Write a guide</Btn></div>
      {showForm && <Card><form onSubmit={create} className="space-y-3">
        <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required /></Field>
        <div className="grid grid-cols-3 gap-3"><Field label="Category"><input className={inputCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field><Field label="Level"><select className={inputCls} value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })}>{['beginner', 'intermediate', 'advanced'].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Minutes"><input type="number" className={inputCls} value={f.minutes} onChange={(e) => setF({ ...f, minutes: +e.target.value })} /></Field></div>
        <Field label="Summary"><input className={inputCls} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
        <Field label="Body"><textarea className={inputCls} rows={5} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
        <Btn>Publish</Btn>
      </form></Card>}
      <div className="grid md:grid-cols-3 gap-4">
        {lessons.map((l) => (
          <button key={l.id} onClick={() => setActive(l)} className="text-left"><Card className="h-full hover:border-primary/40 transition">
            <GraduationCap className="w-5 h-5 text-accent" />
            <h3 className="font-display mt-2">{l.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{l.summary}</p>
            <p className="text-xs text-muted-foreground mt-3">{l.category} · {l.minutes} min · {l.level}</p>
          </Card></button>
        ))}
        {lessons.length === 0 && <Empty title="No guides yet" sub="Share your knowledge with the community." />}
      </div>
    </div>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */
export function Notifications() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    pb.collection('notifications').getFullList({ filter: `owner="${user.id}"`, sort: '-created' }).then(async (r) => {
      setNotes(r);
      await Promise.all(r.filter((n) => !n.read).map((n, i) => pb.collection('notifications').update(n.id, { read: true }, { requestKey: `read-${i}` })));
    }).catch(() => {});
  }, [user.id]);
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl">Notifications</h1>
      <div className="space-y-2">
        {notes.map((n) => (
          <Link key={n.id} to={n.link || '#'} className="block p-3 rounded-xl border border-border hover:border-primary/40 text-sm">{n.text}<span className="block text-xs text-muted-foreground mt-1">{new Date(n.created).toLocaleString()}</span></Link>
        ))}
        {notes.length === 0 && <Empty title="All caught up" sub="No notifications." />}
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */
export function Profile() {
  const { user, save } = useAuth();
  const [f, setF] = useState({ name: user.name || '', role: user.role || 'Founder', headline: user.headline || '', bio: user.bio || '', location: user.location || '', githubUrl: user.githubUrl || '', portfolioUrl: user.portfolioUrl || '', skills: arr(user.skills), available: user.available ?? true });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); try { await save(f); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setBusy(false); } };
  const preview = computeTrustScore({ ...user, ...f });
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar user={user} size={64} />
        <div className="flex-1"><h1 className="font-display text-3xl">{f.name || 'Your profile'}</h1><p className="text-muted-foreground">{f.role} · {f.headline}</p></div>
        <div className="text-center"><TrustBadge score={preview} className="text-lg" /><p className="text-xs text-muted-foreground mt-1">Trust Score</p></div>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Role"><select className={inputCls} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
          <Field label="Location"><input className={inputCls} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        </div>
        <Field label="Headline"><input className={inputCls} value={f.headline} onChange={(e) => setF({ ...f, headline: e.target.value })} placeholder="Full-stack developer & indie hacker" /></Field>
        <Field label="Bio"><textarea className={inputCls} rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></Field>
        <Field label="Verified skills" hint="Used by the AI matchmaking engine"><div className="flex flex-wrap gap-1.5">{STACKS.map((s) => <Chip key={s} active={f.skills.includes(s)} onClick={() => setF({ ...f, skills: toggle(f.skills, s) })}>{s}</Chip>)}</div></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub URL"><input className={inputCls} value={f.githubUrl} onChange={(e) => setF({ ...f, githubUrl: e.target.value })} /></Field>
          <Field label="Portfolio URL"><input className={inputCls} value={f.portfolioUrl} onChange={(e) => setF({ ...f, portfolioUrl: e.target.value })} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.available} onChange={(e) => setF({ ...f, available: e.target.checked })} /> Open to new projects</label>
        <Btn disabled={busy} className="w-full justify-center">{busy ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}</Btn>
      </form>
    </div>
  );
}