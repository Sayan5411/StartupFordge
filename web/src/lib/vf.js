import pb from '@/lib/pocketbaseClient';

export const ROLES = ["Founder", "Developer", "Designer", "Marketing", "Investor", "Mentor", "Student"];
export const CATEGORIES = ["AI / ML", "Computer Vision", "Web3", "FinTech", "HealthTech", "SaaS", "Consumer", "DevTools", "Climate", "EdTech"];
export const STACKS = ["Python", "React", "Node.js", "Flutter", "TensorFlow", "Rust", "Go", "Solidity", "Figma", "UI/UX", "Swift", "PostgreSQL"];
export const LOCATION_TYPES = ["Remote", "Hybrid", "On-site"];

export function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() || "").join("") || "VF";
}

// Algorithmic Trust Score from profile completeness + skills + links
export function computeTrustScore(u = {}) {
  let s = 20;
  if (u.name) s += 8;
  if (u.headline) s += 8;
  if (u.bio) s += 10;
  if (u.location) s += 6;
  if (Array.isArray(u.skills) && u.skills.length) s += Math.min(18, u.skills.length * 4);
  if (u.githubUrl) s += 12;
  if (u.portfolioUrl) s += 10;
  if (u.verified) s += 8;
  return Math.min(100, s);
}

export function matchScore(user, opp) {
  const uSkills = new Set((user?.skills || []).map((x) => x.toLowerCase()));
  const need = [...(opp?.stack || []), ...(opp?.rolesNeeded || [])].map((x) => String(x).toLowerCase());
  if (!need.length) return 40;
  const hits = need.filter((n) => [...uSkills].some((s) => n.includes(s) || s.includes(n))).length;
  return Math.min(99, 45 + Math.round((hits / need.length) * 54));
}

export async function notify(userId, text, link = "") {
  try {
    await pb.collection("notifications").create({ owner: userId, text, link, read: false });
  } catch (_) {}
}

export function fileUrl(rec, name) {
  return pb.files.getURL(rec, name);
}
