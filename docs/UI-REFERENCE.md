<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Sky Glass UI — Design System</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  :root {
    --sky-50:  #f0f9ff;
    --sky-100: #e0f2fe;
    --sky-200: #bae6fd;
    --sky-300: #7dd3fc;
    --sky-400: #38bdf8;
    --sky-500: #0ea5e9;
    --sky-600: #0284c7;
    --glass-bg: rgba(224, 242, 254, 0.45);
    --glass-border: rgba(186, 230, 253, 0.6);
    --glass-shadow: 0 8px 32px rgba(14, 165, 233, 0.12);
    --glass-hover: rgba(186, 230, 253, 0.55);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 30%, #bae6fd 60%, #e0f2fe 100%);
    min-height: 100vh;
    color: #0c4a6e;
    overflow-x: hidden;
  }

  /* Ambient orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
    pointer-events: none;
    animation: drift 12s ease-in-out infinite alternate;
    z-index: 0;
  }
  .orb-1 { width: 520px; height: 520px; background: #38bdf8; top: -120px; left: -100px; animation-delay: 0s; }
  .orb-2 { width: 400px; height: 400px; background: #7dd3fc; bottom: -80px; right: -80px; animation-delay: 4s; }
  .orb-3 { width: 280px; height: 280px; background: #bae6fd; top: 40%; left: 55%; animation-delay: 2s; }

  @keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, 20px) scale(1.05); }
  }

  /* Glass card */
  .glass {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.6);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-radius: 20px;
    transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease;
    position: relative;
    z-index: 1;
  }
  .glass:hover {
    background: var(--glass-hover);
    box-shadow: 0 12px 40px rgba(14,165,233,0.18), inset 0 1px 0 rgba(255,255,255,0.7);
    transform: translateY(-2px);
  }
  .glass-sm {
    background: rgba(240, 249, 255, 0.5);
    border: 1px solid rgba(186, 230, 253, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 14px;
    position: relative; z-index: 1;
  }
  .glass-strong {
    background: rgba(186, 230, 253, 0.55);
    border: 1px solid rgba(125, 211, 252, 0.6);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(14,165,233,0.16), inset 0 1px 0 rgba(255,255,255,0.7);
    position: relative; z-index: 1;
  }

  /* Typography */
  h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }

  /* Buttons */
  .btn-primary {
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
    box-shadow: 0 6px 22px rgba(14,165,233,0.5);
    transform: translateY(-1px);
  }
  .btn-ghost {
    background: rgba(224,242,254,0.5);
    color: #0284c7;
    border: 1px solid rgba(125,211,252,0.55);
    padding: 10px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
  }
  .btn-ghost:hover {
    background: rgba(186,230,253,0.65);
    border-color: rgba(56,189,248,0.7);
    transform: translateY(-1px);
  }
  .btn-outline {
    background: transparent;
    color: #0ea5e9;
    border: 1.5px solid rgba(14,165,233,0.5);
    padding: 10px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-outline:hover {
    background: rgba(14,165,233,0.08);
    border-color: #0ea5e9;
  }

  /* Input */
  .glass-input {
    background: rgba(240,249,255,0.6);
    border: 1px solid rgba(125,211,252,0.5);
    border-radius: 12px;
    padding: 10px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0c4a6e;
    outline: none;
    backdrop-filter: blur(8px);
    transition: border 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .glass-input::placeholder { color: #7dd3fc; }
  .glass-input:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.18);
  }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(8px);
  }
  .badge-sky    { background: rgba(125,211,252,0.25); color: #0284c7; border: 1px solid rgba(125,211,252,0.5); }
  .badge-mint   { background: rgba(167,243,208,0.3);  color: #065f46; border: 1px solid rgba(110,231,183,0.5); }
  .badge-amber  { background: rgba(253,230,138,0.35); color: #92400e; border: 1px solid rgba(251,191,36,0.45); }
  .badge-rose   { background: rgba(254,205,211,0.35); color: #9f1239; border: 1px solid rgba(251,113,133,0.4); }

  /* Progress */
  .progress-track {
    background: rgba(186,230,253,0.4);
    border-radius: 99px;
    overflow: hidden;
    height: 8px;
  }
  .progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #38bdf8, #0ea5e9);
    box-shadow: 0 0 10px rgba(14,165,233,0.5);
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
    animation: shimmer 2.5s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.75; }
  }

  /* Avatar */
  .avatar-ring {
    padding: 2px;
    background: linear-gradient(135deg, #7dd3fc, #0ea5e9);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(14,165,233,0.3);
  }

  /* Toggle */
  .toggle-track {
    width: 44px; height: 24px;
    background: rgba(186,230,253,0.5);
    border: 1px solid rgba(125,211,252,0.5);
    border-radius: 99px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-track.on { background: linear-gradient(135deg,#38bdf8,#0ea5e9); }
  .toggle-thumb {
    width: 18px; height: 18px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px; left: 3px;
    transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
  .toggle-track.on .toggle-thumb { left: 23px; }

  /* Stat card shimmer */
  .stat-shine::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(130deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Table row hover */
  .glass-row { transition: background 0.2s; }
  .glass-row:hover { background: rgba(186,230,253,0.25); }

  /* Notification ping */
  @keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
  .ping { animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(125,211,252,0.4); border-radius: 99px; }

  /* Section labels */
  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #38bdf8;
    margin-bottom: 12px;
  }

  /* Divider */
  .glass-divider {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent);
    margin: 8px 0;
  }

  /* Tooltip */
  .tooltip-wrap { position: relative; display: inline-block; }
  .tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%; transform: translateX(-50%);
    background: rgba(12,74,110,0.85);
    backdrop-filter: blur(12px);
    color: #e0f2fe;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 8px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    border: 1px solid rgba(125,211,252,0.3);
  }
  .tooltip-wrap:hover .tooltip { opacity: 1; }

  /* Fade-in stagger */
  .fade-in { opacity: 0; animation: fadeUp 0.6s ease forwards; }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(16px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .d1{animation-delay:0.05s} .d2{animation-delay:0.12s} .d3{animation-delay:0.19s}
  .d4{animation-delay:0.26s} .d5{animation-delay:0.33s} .d6{animation-delay:0.40s}
</style>
</head>
<body>

<!-- Ambient background orbs -->
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<!-- PAGE WRAPPER -->
<div style="max-width:1100px;margin:0 auto;padding:40px 24px;position:relative;z-index:1;">

  <!-- ── HEADER ── -->
  <header class="glass fade-in d1 flex items-center justify-between px-8 py-5 mb-10">
    <div class="flex items-center gap-3">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#38bdf8,#0ea5e9);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(14,165,233,0.4)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <span class="font-display font-bold" style="font-size:18px;color:#0c4a6e;">SkyGlass UI</span>
    </div>
    <nav class="flex items-center gap-2">
      <button class="btn-ghost" style="padding:7px 16px;font-size:13px;">Docs</button>
      <button class="btn-ghost" style="padding:7px 16px;font-size:13px;">Components</button>
      <button class="btn-primary" style="padding:7px 18px;font-size:13px;">Get Started</button>
      <div class="relative ml-2">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#bae6fd,#7dd3fc);display:flex;align-items:center;justify-content:center;cursor:pointer;border:1.5px solid rgba(125,211,252,0.6)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span class="ping" style="position:absolute;top:0;right:0;width:9px;height:9px;background:#0ea5e9;border-radius:50%;border:1.5px solid #e0f2fe;"></span>
      </div>
    </nav>
  </header>

  <!-- ── HERO TITLE ── -->
  <div class="fade-in d1 mb-10 text-center">
    <p class="section-label">Design System</p>
    <h1 style="font-size:clamp(28px,4vw,44px);font-weight:700;color:#0c4a6e;line-height:1.15;margin-bottom:10px;">
      Sky Blue · Glass · Clean
    </h1>
    <p style="color:#0369a1;font-size:16px;max-width:480px;margin:0 auto;line-height:1.65;">
      A Tailwind-compatible UI kit with glassmorphism aesthetics, sky palettes, and polished micro-interactions — copy any block into your project.
    </p>
  </div>

  <!-- ── STAT CARDS ── -->
  <div class="section-label fade-in d2">Stat Cards</div>
  <div class="fade-in d2" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:36px;">
    <!-- stat 1 -->
    <div class="glass stat-shine p-6">
      <div class="flex items-center justify-between mb-3">
        <span style="font-size:12px;color:#0369a1;font-weight:500;">Total Users</span>
        <div style="width:32px;height:32px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(125,211,252,0.4)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>
      <div class="font-display font-bold" style="font-size:28px;color:#0c4a6e;">24,891</div>
      <div style="font-size:12px;color:#22c55e;margin-top:4px;display:flex;align-items:center;gap:4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        +12.4% this month
      </div>
    </div>
    <!-- stat 2 -->
    <div class="glass stat-shine p-6">
      <div class="flex items-center justify-between mb-3">
        <span style="font-size:12px;color:#0369a1;font-weight:500;">Revenue</span>
        <div style="width:32px;height:32px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(125,211,252,0.4)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>
      <div class="font-display font-bold" style="font-size:28px;color:#0c4a6e;">$84,230</div>
      <div style="font-size:12px;color:#22c55e;margin-top:4px;display:flex;align-items:center;gap:4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        +8.1% this month
      </div>
    </div>
    <!-- stat 3 -->
    <div class="glass stat-shine p-6">
      <div class="flex items-center justify-between mb-3">
        <span style="font-size:12px;color:#0369a1;font-weight:500;">Uptime</span>
        <div style="width:32px;height:32px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(125,211,252,0.4)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
      </div>
      <div class="font-display font-bold" style="font-size:28px;color:#0c4a6e;">99.97%</div>
      <div style="font-size:12px;color:#0369a1;margin-top:4px;display:flex;align-items:center;gap:4px;">
        <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;"></span>
        All systems operational
      </div>
    </div>
    <!-- stat 4 -->
    <div class="glass stat-shine p-6">
      <div class="flex items-center justify-between mb-3">
        <span style="font-size:12px;color:#0369a1;font-weight:500;">Open Tickets</span>
        <div style="width:32px;height:32px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(125,211,252,0.4)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
      </div>
      <div class="font-display font-bold" style="font-size:28px;color:#0c4a6e;">14</div>
      <div style="font-size:12px;color:#f59e0b;margin-top:4px;display:flex;align-items:center;gap:4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        +3 since yesterday
      </div>
    </div>
  </div>

  <!-- ── FORM + PROFILE CARD ── -->
  <div class="fade-in d3" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:36px;align-items:start;">

    <!-- Form Card -->
    <div class="glass p-7">
      <p class="section-label">Form Components</p>
      <div style="margin-bottom:18px;">
        <label style="font-size:12px;font-weight:600;color:#0369a1;display:block;margin-bottom:6px;letter-spacing:0.04em;">Email address</label>
        <input class="glass-input" type="email" placeholder="you@example.com" />
      </div>
      <div style="margin-bottom:18px;">
        <label style="font-size:12px;font-weight:600;color:#0369a1;display:block;margin-bottom:6px;letter-spacing:0.04em;">Password</label>
        <div style="position:relative;">
          <input class="glass-input" type="password" placeholder="••••••••" />
          <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#7dd3fc;cursor:pointer;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
      </div>
      <div style="margin-bottom:22px;" class="flex items-center justify-between">
        <label style="font-size:13px;color:#0369a1;display:flex;align-items:center;gap:8px;cursor:pointer;">
          <div id="cb1" onclick="this.classList.toggle('checked')" style="width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(125,211,252,0.6);background:rgba(224,242,254,0.5);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;" class="">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          Remember me
        </label>
        <a href="#" style="font-size:13px;color:#0ea5e9;text-decoration:none;">Forgot password?</a>
      </div>
      <div class="flex gap-3">
        <button class="btn-primary" style="flex:1;">Sign In</button>
        <button class="btn-ghost" style="flex:1;">Create Account</button>
      </div>
    </div>

    <!-- Profile + Settings -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <!-- Profile card -->
      <div class="glass-strong p-6 flex items-center gap-5">
        <div class="avatar-ring">
          <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#bae6fd,#7dd3fc);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#0c4a6e;">AL</div>
        </div>
        <div style="flex:1;">
          <div class="font-display font-bold" style="color:#0c4a6e;font-size:16px;">Alex Lim</div>
          <div style="font-size:13px;color:#0369a1;margin-top:2px;">Product Designer</div>
          <div class="flex gap-2 mt-3">
            <span class="badge badge-sky">Pro Plan</span>
            <span class="badge badge-mint">Verified</span>
          </div>
        </div>
        <button class="btn-outline" style="padding:7px 14px;font-size:13px;">Edit</button>
      </div>

      <!-- Settings toggles -->
      <div class="glass p-6">
        <p class="section-label">Preferences</p>
        <div style="display:flex;flex-direction:column;gap:0;">
          <!-- Toggle row -->
          <div class="glass-row flex items-center justify-between" style="padding:12px 8px;border-radius:10px;">
            <div>
              <div style="font-size:13px;font-weight:500;color:#0c4a6e;">Email Notifications</div>
              <div style="font-size:11px;color:#7dd3fc;margin-top:1px;">Receive updates via email</div>
            </div>
            <div class="toggle-track on" onclick="this.classList.toggle('on')"><div class="toggle-thumb"></div></div>
          </div>
          <hr class="glass-divider"/>
          <div class="glass-row flex items-center justify-between" style="padding:12px 8px;border-radius:10px;">
            <div>
              <div style="font-size:13px;font-weight:500;color:#0c4a6e;">Two-Factor Auth</div>
              <div style="font-size:11px;color:#7dd3fc;margin-top:1px;">Secure your account</div>
            </div>
            <div class="toggle-track" onclick="this.classList.toggle('on')"><div class="toggle-thumb"></div></div>
          </div>
          <hr class="glass-divider"/>
          <div class="glass-row flex items-center justify-between" style="padding:12px 8px;border-radius:10px;">
            <div>
              <div style="font-size:13px;font-weight:500;color:#0c4a6e;">Dark Mode</div>
              <div style="font-size:11px;color:#7dd3fc;margin-top:1px;">Switch to dark theme</div>
            </div>
            <div class="toggle-track on" onclick="this.classList.toggle('on')"><div class="toggle-thumb"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── PROGRESS + BADGES + TOOLTIPS ── -->
  <div class="fade-in d4" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:36px;">
    <!-- Progress card -->
    <div class="glass p-7">
      <p class="section-label">Progress Bars</p>
      <div style="margin-bottom:16px;">
        <div class="flex justify-between" style="margin-bottom:7px;"><span style="font-size:13px;color:#0369a1;font-weight:500;">Storage</span><span style="font-size:13px;font-weight:600;color:#0c4a6e;">72%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:72%;"></div></div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="flex justify-between" style="margin-bottom:7px;"><span style="font-size:13px;color:#0369a1;font-weight:500;">Bandwidth</span><span style="font-size:13px;font-weight:600;color:#0c4a6e;">45%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:45%;background:linear-gradient(90deg,#7dd3fc,#38bdf8);"></div></div>
      </div>
      <div>
        <div class="flex justify-between" style="margin-bottom:7px;"><span style="font-size:13px;color:#0369a1;font-weight:500;">API Calls</span><span style="font-size:13px;font-weight:600;color:#0c4a6e;">88%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:88%;background:linear-gradient(90deg,#0ea5e9,#0284c7);"></div></div>
      </div>
    </div>

    <!-- Badges + Tooltips -->
    <div class="glass p-7">
      <p class="section-label">Badges & Tooltips</p>
      <div class="flex flex-wrap gap-2 mb-5">
        <span class="badge badge-sky">🔵 Active</span>
        <span class="badge badge-mint">✅ Verified</span>
        <span class="badge badge-amber">⚠️ Warning</span>
        <span class="badge badge-rose">🔴 Error</span>
        <span class="badge badge-sky">New</span>
        <span class="badge badge-mint">Beta</span>
        <span class="badge badge-amber">Pending</span>
      </div>
      <hr class="glass-divider mb-4"/>
      <p style="font-size:12px;color:#7dd3fc;margin-bottom:12px;font-weight:500;">Hover for tooltips ↓</p>
      <div class="flex gap-3">
        <div class="tooltip-wrap">
          <button class="btn-primary" style="padding:8px 16px;font-size:13px;">Deploy</button>
          <div class="tooltip">Push to production</div>
        </div>
        <div class="tooltip-wrap">
          <button class="btn-ghost" style="padding:8px 16px;font-size:13px;">Preview</button>
          <div class="tooltip">Open staging link</div>
        </div>
        <div class="tooltip-wrap">
          <button class="btn-outline" style="padding:8px 16px;font-size:13px;">Rollback</button>
          <div class="tooltip">Revert last deploy</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── DATA TABLE ── -->
  <div class="glass fade-in d5 p-0 mb-36" style="overflow:hidden;">
    <div class="flex items-center justify-between px-7 pt-6 pb-4">
      <div>
        <p class="section-label" style="margin-bottom:4px;">Data Table</p>
        <h3 class="font-display font-bold" style="font-size:16px;color:#0c4a6e;">Recent Transactions</h3>
      </div>
      <div class="flex gap-2 items-center">
        <input class="glass-input" style="width:190px;" placeholder="Search..." />
        <button class="btn-ghost" style="padding:8px 14px;font-size:13px;white-space:nowrap;">Export CSV</button>
      </div>
    </div>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:rgba(186,230,253,0.2);border-bottom:1px solid rgba(125,211,252,0.3);">
            <th style="padding:10px 28px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0369a1;">User</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0369a1;">Plan</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0369a1;">Amount</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0369a1;">Status</th>
            <th style="padding:10px 28px 10px 16px;text-align:right;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0369a1;">Date</th>
          </tr>
        </thead>
        <tbody>
          <!-- Row template repeated -->
          <tr class="glass-row" style="border-bottom:1px solid rgba(186,230,253,0.3);">
            <td style="padding:14px 28px;">
              <div class="flex items-center gap-3">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#bae6fd,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#0c4a6e;flex-shrink:0;">JD</div>
                <div><div style="font-size:13px;font-weight:600;color:#0c4a6e;">Jordan Davis</div><div style="font-size:11px;color:#7dd3fc;">jordan@dev.io</div></div>
              </div>
            </td>
            <td style="padding:14px 16px;"><span class="badge badge-sky">Pro</span></td>
            <td style="padding:14px 16px;font-size:13px;font-weight:600;color:#0c4a6e;">$49.00</td>
            <td style="padding:14px 16px;"><span class="badge badge-mint">Paid</span></td>
            <td style="padding:14px 28px 14px 16px;text-align:right;font-size:12px;color:#0369a1;">Mar 4, 2026</td>
          </tr>
          <tr class="glass-row" style="border-bottom:1px solid rgba(186,230,253,0.3);">
            <td style="padding:14px 28px;">
              <div class="flex items-center gap-3">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#fde68a,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#92400e;flex-shrink:0;">SC</div>
                <div><div style="font-size:13px;font-weight:600;color:#0c4a6e;">Sara Chen</div><div style="font-size:11px;color:#7dd3fc;">sara@cloud.ai</div></div>
              </div>
            </td>
            <td style="padding:14px 16px;"><span class="badge badge-amber">Team</span></td>
            <td style="padding:14px 16px;font-size:13px;font-weight:600;color:#0c4a6e;">$149.00</td>
            <td style="padding:14px 16px;"><span class="badge badge-amber">Pending</span></td>
            <td style="padding:14px 28px 14px 16px;text-align:right;font-size:12px;color:#0369a1;">Mar 3, 2026</td>
          </tr>
          <tr class="glass-row" style="border-bottom:1px solid rgba(186,230,253,0.3);">
            <td style="padding:14px 28px;">
              <div class="flex items-center gap-3">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#fecaca,#f87171);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#7f1d1d;flex-shrink:0;">MK</div>
                <div><div style="font-size:13px;font-weight:600;color:#0c4a6e;">Marco Kim</div><div style="font-size:11px;color:#7dd3fc;">marco@design.co</div></div>
              </div>
            </td>
            <td style="padding:14px 16px;"><span class="badge badge-sky">Starter</span></td>
            <td style="padding:14px 16px;font-size:13px;font-weight:600;color:#0c4a6e;">$19.00</td>
            <td style="padding:14px 16px;"><span class="badge badge-rose">Failed</span></td>
            <td style="padding:14px 28px 14px 16px;text-align:right;font-size:12px;color:#0369a1;">Mar 2, 2026</td>
          </tr>
          <tr class="glass-row">
            <td style="padding:14px 28px;">
              <div class="flex items-center gap-3">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#d9f99d,#84cc16);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#365314;flex-shrink:0;">NP</div>
                <div><div style="font-size:13px;font-weight:600;color:#0c4a6e;">Nina Patel</div><div style="font-size:11px;color:#7dd3fc;">nina@studio.io</div></div>
              </div>
            </td>
            <td style="padding:14px 16px;"><span class="badge badge-mint">Enterprise</span></td>
            <td style="padding:14px 16px;font-size:13px;font-weight:600;color:#0c4a6e;">$499.00</td>
            <td style="padding:14px 16px;"><span class="badge badge-mint">Paid</span></td>
            <td style="padding:14px 28px 14px 16px;text-align:right;font-size:12px;color:#0369a1;">Mar 1, 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between px-7 py-4" style="border-top:1px solid rgba(186,230,253,0.3);">
      <span style="font-size:12px;color:#7dd3fc;">Showing 4 of 128 results</span>
      <div class="flex gap-2">
        <button class="btn-ghost" style="padding:6px 14px;font-size:12px;">← Prev</button>
        <button class="btn-primary" style="padding:6px 14px;font-size:12px;">Next →</button>
      </div>
    </div>
  </div>

  <!-- ── CSS VARIABLES REFERENCE ── -->
  <div class="glass-sm fade-in d6 p-7 mb-10">
    <p class="section-label">CSS Variable Reference — copy into your project's globals.css</p>
    <pre style="font-family:'Courier New',monospace;font-size:12px;color:#0369a1;line-height:1.8;overflow-x:auto;white-space:pre-wrap;">:root {
  --glass-bg:     rgba(224, 242, 254, 0.45);
  --glass-border: rgba(186, 230, 253, 0.60);
  --glass-hover:  rgba(186, 230, 253, 0.55);
  --glass-shadow: 0 8px 32px rgba(14, 165, 233, 0.12);
  --glass-blur:   blur(20px) saturate(1.4);

  /* Sky palette tokens */
  --sky-50:  #f0f9ff;
  --sky-100: #e0f2fe;
  --sky-200: #bae6fd;
  --sky-300: #7dd3fc;
  --sky-400: #38bdf8;
  --sky-500: #0ea5e9;
  --sky-600: #0284c7;
  --sky-text: #0c4a6e;
}</pre>
  </div>

  <p style="text-align:center;font-size:12px;color:#7dd3fc;margin-bottom:16px;">SkyGlass UI · All components are copy-paste ready · Built with Tailwind CSS + vanilla CSS</p>

</div>

</body>
</html>