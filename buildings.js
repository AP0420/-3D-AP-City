// ===== BUILDINGS.JS — Building definitions and portfolio content =====

const BUILDING_DEFS = [
  {
    id: 'house',
    label: 'HOUSE',
    sublabel: 'About Me',
    section: 'house',
    color: 0x00d4ff,
    colorHex: '#00d4ff',
    position: { x: -80, z: -80 },
    size: { w: 18, h: 28, d: 18 },
    floors: 3,
    style: 'house',
    achievement: '🏠 Home Base — You learned my story!'
  },
  {
    id: 'office',
    label: 'OFFICE',
    sublabel: 'Experience',
    section: 'office',
    color: 0xb04fff,
    colorHex: '#b04fff',
    position: { x: 80, z: -80 },
    size: { w: 20, h: 50, d: 20 },
    floors: 8,
    style: 'office',
    achievement: '🏢 Corporate Explorer — You know my work history!'
  },
  {
    id: 'garage',
    label: 'GARAGE',
    sublabel: 'Skills',
    section: 'garage',
    color: 0x00ff88,
    colorHex: '#00ff88',
    position: { x: -80, z: 80 },
    size: { w: 22, h: 18, d: 18 },
    floors: 2,
    style: 'garage',
    achievement: '🔧 Skill Check — You checked under the hood!'
  },
  {
    id: 'techpark',
    label: 'TECH PARK',
    sublabel: 'Projects',
    section: 'techpark',
    color: 0x00ffd4,
    colorHex: '#00ffd4',
    position: { x: 80, z: 80 },
    size: { w: 28, h: 36, d: 22 },
    floors: 5,
    style: 'modern',
    achievement: '💻 Tech Scout — You explored my projects!'
  },
  {
    id: 'stadium',
    label: 'STADIUM',
    sublabel: 'Events',
    section: 'stadium',
    color: 0xff3da6,
    colorHex: '#ff3da6',
    position: { x: 0, z: -110 },
    size: { w: 36, h: 22, d: 36 },
    floors: 3,
    style: 'stadium',
    achievement: '🏟️ Event Goer — You saw the big stage!'
  },
  {
    id: 'cafe',
    label: 'CAFÉ',
    sublabel: 'Contact',
    section: 'cafe',
    color: 0xff6b35,
    colorHex: '#ff6b35',
    position: { x: 0, z: 110 },
    size: { w: 16, h: 16, d: 16 },
    floors: 2,
    style: 'cafe',
    achievement: "☕ Social Butterfly — Let's connect!"
  },
  {
    id: 'dream',
    label: 'DREAM TOWER',
    sublabel: 'Future Goals',
    section: 'dream',
    color: 0xffb700,
    colorHex: '#ffb700',
    position: { x: -120, z: 0 },
    size: { w: 16, h: 70, d: 16 },
    floors: 12,
    style: 'tower',
    achievement: '🌟 Dreamer — You saw the future!'
  },
  {
    id: 'secret',
    label: 'SECRET BLDG',
    sublabel: 'Achievements',
    section: 'secret',
    color: 0xff0055,
    colorHex: '#ff0055',
    position: { x: 120, z: 0 },
    size: { w: 14, h: 22, d: 14 },
    floors: 3,
    style: 'secret',
    achievement: '🕵️ Secret Agent AP — You found it all!'
  }
];

// ===== PORTFOLIO CONTENT =====
const SECTION_CONTENT = {

  house: {
    icon: '🏠',
    title: 'THE STORY BEHIND THE DRIVER',
    subtitle: 'About Aryan Parmar',
    color: '#00d4ff',
    render: () => `
<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-bottom:20px">
  <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#b04fff);display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;border:2px solid rgba(0,212,255,0.4)">👨‍💻</div>
  <div style="flex:1;min-width:180px">
    <div style="font-family:'Orbitron',monospace;font-size:clamp(16px,3vw,22px);font-weight:900;color:#00d4ff;letter-spacing:2px">ARYAN PARMAR</div>
    <div style="font-size:11px;color:rgba(0,212,255,0.55);letter-spacing:3px;margin:4px 0">MUMBAI, INDIA</div>
    <p style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.7;margin-top:8px">Operations professional and automation builder who turns manual chaos into streamlined systems. I build bots, test apps, manage processes — and create digital experiences people remember.</p>
  </div>
</div>
<div class="modal-divider"></div>
<p style="font-size:10px;color:rgba(0,212,255,0.55);letter-spacing:2px;margin-bottom:12px;font-family:'Orbitron',monospace">EDUCATION JOURNEY</p>
<div class="section-grid">
  <div class="sec-card" style="border-color:rgba(0,212,255,0.2)"><h4>🏫 Schooling</h4><p>St. Xavier's High School<br><span style="color:rgba(255,255,255,0.38)">Foundation built here</span></p></div>
  <div class="sec-card" style="border-color:rgba(0,212,255,0.2)"><h4>🎓 Graduation</h4><p>Tolani College of Commerce<br><span style="color:rgba(255,255,255,0.38)">Commerce & Analytics</span></p></div>
  <div class="sec-card" style="border-color:rgba(0,212,255,0.2)"><h4>📱 Leadership</h4><p>Head of Social Media<br>Intra College Fest<br><span style="color:rgba(255,255,255,0.38)">Managed all digital ops</span></p></div>
</div>
<div class="modal-divider"></div>
<div class="section-grid">
  <div class="sec-card"><h4>📍 Based In</h4><p>Mumbai, India</p></div>
  <div class="sec-card"><h4>⚙️ Currently At</h4><p>Andromeda Sales & Distribution — Customer Service & Ops</p></div>
  <div class="sec-card"><h4>🚀 Superpower</h4><p>Automation + Ops + Digital Marketing</p></div>
  <div class="sec-card"><h4>🎯 Goal</h4><p>Build systems that run while I sleep</p></div>
</div>
<div class="modal-divider"></div>
<p style="font-size:13px;color:rgba(0,212,255,0.45);text-align:center;font-style:italic">"This city is my story. Every building is a chapter. Drive around and discover it all."</p>`
  },

  office: {
    icon: '🏢',
    title: "PLACES I'VE WORKED",
    subtitle: 'My City of Experience',
    color: '#b04fff',
    render: () => `
<p style="font-size:13px;color:rgba(255,255,255,0.52);margin-bottom:20px">From event grounds to corporate ops — every role has shaped the driver.</p>
<div class="exp-item" style="border-left-color:#b04fff">
  <div class="exp-role" style="color:#b04fff">Current · Andromeda Sales & Distribution</div>
  <h4>Customer Service & Operations</h4>
  <p>Handling customer service operations, tech processes, app testing, and internal automation. Building bots and streamlining workflows so the team runs smoother every single day.</p>
  <div style="margin-top:8px">${['Operations','App Testing','Process Improvement','Automation','Tech Support'].map(t=>`<span class="tag" style="color:#b04fff;border-color:rgba(176,79,255,0.25)">${t}</span>`).join('')}</div>
</div>
<div class="exp-item" style="border-left-color:#ff3da6">
  <div class="exp-role" style="color:#ff3da6">Freelance · BookMyShow Events</div>
  <h4>Event Operations Freelancer</h4>
  <p>Worked on-ground operations for large-scale events across Mumbai. Managed crowd flow, coordination, and execution at some of India's biggest live events — Lollapalooza, IPL 2024, Aaditya Gadhvi, Fintech @ Jio Centre.</p>
  <div style="margin-top:8px">${['Event Ops','Crowd Management','Field Coordination','BookMyShow'].map(t=>`<span class="tag" style="color:#ff3da6;border-color:rgba(255,61,166,0.25)">${t}</span>`).join('')}</div>
</div>
<div class="exp-item" style="border-left-color:#ffb700">
  <div class="exp-role" style="color:#ffb700">Leadership · Tolani College</div>
  <h4>Head of Social Media — Intra College Fest</h4>
  <p>Led all social media strategy, content creation, and digital promotion for the college's annual fest. Managed team, campaigns, and live engagement for 30,000+ audience reach.</p>
  <div style="margin-top:8px">${['Social Media','Team Lead','Content','30K+ Reach'].map(t=>`<span class="tag" style="color:#ffb700;border-color:rgba(255,183,0,0.25)">${t}</span>`).join('')}</div>
</div>`
  },

  garage: {
    icon: '🔧',
    title: 'MY GARAGE',
    subtitle: 'Skills That Power The Car',
    color: '#00ff88',
    render: () => `
<p style="font-size:13px;color:rgba(0,255,136,0.58);margin-bottom:20px;font-style:italic">Every great driver knows their engine. Here's what's under my hood.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
  <div>
    <p style="font-size:10px;color:rgba(0,255,136,0.5);letter-spacing:2px;margin-bottom:12px;font-family:'Orbitron',monospace">AUTOMATION & TECH</p>
    ${[{n:'Python Automation',p:90,c:'#00d4ff'},{n:'Excel Automation',p:93,c:'#00ff88'},{n:'WhatsApp Automation',p:88,c:'#25d366'},{n:'Email Automation',p:85,c:'#b04fff'},{n:'Data Handling',p:87,c:'#ffb700'},{n:'App Testing',p:82,c:'#00ffd4'}].map(s=>`<div class="skill-item"><div class="skill-name"><span>${s.n}</span><span style="color:${s.c}">${s.p}%</span></div><div class="skill-track"><div class="skill-fill" data-pct="${s.p}" style="background:${s.c};width:0%"></div></div></div>`).join('')}
  </div>
  <div>
    <p style="font-size:10px;color:rgba(0,255,136,0.5);letter-spacing:2px;margin-bottom:12px;font-family:'Orbitron',monospace">OPERATIONS & MARKETING</p>
    ${[{n:'Operations Mgmt',p:88,c:'#ff6b35'},{n:'Process Improvement',p:85,c:'#ff3da6'},{n:'Digital Marketing',p:82,c:'#b04fff'},{n:'Social Media Mgmt',p:87,c:'#ff3da6'},{n:'Content Strategy',p:80,c:'#ffb700'},{n:'Team Coordination',p:84,c:'#00d4ff'}].map(s=>`<div class="skill-item"><div class="skill-name"><span>${s.n}</span><span style="color:${s.c}">${s.p}%</span></div><div class="skill-track"><div class="skill-fill" data-pct="${s.p}" style="background:${s.c};width:0%"></div></div></div>`).join('')}
  </div>
</div>
<div class="modal-divider"></div>
<p style="font-size:10px;color:rgba(0,255,136,0.5);letter-spacing:2px;margin-bottom:10px;font-family:'Orbitron',monospace">TOOLS IN THE GARAGE</p>
<div>${['Python','Excel','WhatsApp API','SMTP Email','MS Office','Google Sheets','Power BI','Canva','Meta Ads','Google Analytics','Notion','Zapier','GitHub'].map(t=>`<span class="tag" style="color:#00ff88;border-color:rgba(0,255,136,0.2)">${t}</span>`).join('')}</div>`
  },

  techpark: {
    icon: '💻',
    title: 'PROJECTS I BUILT',
    subtitle: 'That Solve Real Problems',
    color: '#00ffd4',
    render: () => `
<p style="font-size:13px;color:rgba(0,255,212,0.62);margin-bottom:18px">Each project was born from a real problem. Here's what I shipped.</p>
<div class="section-grid">
${[
  {i:'📱',t:'Business WhatsApp Automation Tool',d:'Bulk WhatsApp messaging system with Excel integration. Reads contact lists, sends personalised messages automatically, and logs delivery status — built for real business use.',tags:['Python','WhatsApp API','Excel','Automation']},
  {i:'📊',t:'Excel Report Automation System',d:"Smart Excel file generator that pulls data, formats it, and auto-creates reports — eliminating hours of manual work every week.",tags:['Python','openpyxl','Pandas','Automation']},
  {i:'💬',t:'Custom Messaging & Reporting Tool',d:'Automated customer messaging system with built-in report tracking. Sends custom messages and saves delivery and response logs straight to Excel.',tags:['Python','Excel','Reporting','Customer Ops']},
  {i:'🤖',t:'AI Assistant That Listens, Talks & Remembers',d:'Desktop voice assistant with memory and speech interaction. Listens to commands, responds with voice, and retains context across sessions.',tags:['Python','Speech Recognition','NLP','AI Memory']},
  {i:'📧',t:'Automated Email Sender for Operations',d:'Bulk email automation for the operations team. Sends structured emails from templates to lists of recipients with one click.',tags:['Python','SMTP','Excel','Email Automation']},
  {i:'⚙️',t:'Process Automation Scripts',d:'Suite of scripts automating day-to-day operational tasks — data entry, file management, reporting, and system notifications.',tags:['Python','OS Automation','Scripting','Ops']}
].map(p=>`<div class="sec-card" style="border-color:rgba(0,255,212,0.14)"><h4 style="color:#00ffd4">${p.i} ${p.t}</h4><p>${p.d}</p><div style="margin-top:10px">${p.tags.map(t=>`<span class="tag" style="color:#00ffd4;border-color:rgba(0,255,212,0.2)">${t}</span>`).join('')}</div></div>`).join('')}
</div>`
  },

  stadium: {
    icon: '🏟️',
    title: 'STADIUM — EVENTS',
    subtitle: "Live Experiences I've Been Part Of",
    color: '#ff3da6',
    render: () => `
<p style="font-size:13px;color:rgba(255,61,166,0.62);margin-bottom:20px">From concert grounds to fintech halls — I've been on the field for some big ones.</p>
<div class="section-grid">
${[
  {i:'🎸',n:'Lollapalooza India',r:'Event Ops Freelancer · BookMyShow',d:"One of India's biggest music festivals. Managed on-ground ops, crowd coordination, and logistics — an electric atmosphere and real operational challenge.",c:'#ff3da6'},
  {i:'🎤',n:'Aaditya Gadhvi Live',r:'Event Ops Freelancer · BookMyShow',d:'Live Gujarati folk music event with a massive cultural crowd. Handled floor management, entry flow, and on-site coordination.',c:'#b04fff'},
  {i:'🏏',n:'IPL 2024',r:'Event Ops Freelancer · BookMyShow',d:"The biggest cricket league in the world. Worked the ground for match-day operations — crowd management at scale, an unforgettable experience.",c:'#00d4ff'},
  {i:'💳',n:'Fintech Event — Jio Convention Centre',r:'Event Ops Freelancer · BookMyShow',d:'Large-scale B2B fintech conference at the Jio World Convention Centre, Mumbai. Managed attendee flow and logistics coordination.',c:'#00ff88'},
  {i:'📱',n:'Head of Social Media — College Fest',r:'Leadership · Tolani College',d:'Led entire social media operation for the intra-college fest. Created content, managed campaigns, drove 30,000+ audience engagement digitally.',c:'#ffb700'}
].map(e=>`<div class="sec-card" style="border-color:rgba(255,61,166,0.14)"><div style="font-size:28px;margin-bottom:8px">${e.i}</div><h4 style="color:${e.c}">${e.n}</h4><div style="font-size:10px;letter-spacing:1px;color:${e.c}88;margin-bottom:6px;text-transform:uppercase;font-family:'Orbitron',monospace">${e.r}</div><p>${e.d}</p></div>`).join('')}
</div>`
  },

  cafe: {
    icon: '☕',
    title: "LET'S MEET AT THE CAFÉ",
    subtitle: "Let's Connect — I Don't Bite",
    color: '#ff6b35',
    render: () => `
<p style="font-size:13px;color:rgba(255,107,53,0.62);margin-bottom:20px">Pull up a virtual chair. Whether it's a collab, an opportunity, or just a chat — I'm here.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
${[{i:'📧',l:'Email',v:'aryanparmar@email.com'},{i:'💼',l:'LinkedIn',v:'linkedin.com/in/aryanparmar'},{i:'🐙',l:'GitHub',v:'github.com/aryanparmar'},{i:'📱',l:'WhatsApp',v:'+91 XXXXX XXXXX'}].map(c=>`<div class="sec-card" style="border-color:rgba(255,107,53,0.18)"><h4 style="color:#ff6b35">${c.i} ${c.l}</h4><p style="color:rgba(255,255,255,0.58)">${c.v}</p></div>`).join('')}
</div>
<div class="modal-divider"></div>
<p style="font-size:10px;color:rgba(255,107,53,0.52);letter-spacing:2px;margin-bottom:12px;font-family:'Orbitron',monospace">SEND A MESSAGE</p>
<div class="contact-form">
  <input type="text" placeholder="Your Name" id="cf-name">
  <input type="email" placeholder="Your Email" id="cf-email">
  <textarea placeholder="What's on your mind? Project? Collab? Just saying hi?" id="cf-msg"></textarea>
  <button class="contact-btn" onclick="this.textContent='✓ MESSAGE SENT — I will be in touch!';document.getElementById('cf-name').value='';document.getElementById('cf-email').value='';document.getElementById('cf-msg').value='';setTimeout(()=>this.textContent='SEND MESSAGE →',3200)">SEND MESSAGE →</button>
</div>`
  },

  secret: {
    icon: '🕵️',
    title: 'HIDDEN ACHIEVEMENTS',
    subtitle: 'You Found The Secret — Well Done.',
    color: '#ff0055',
    render: () => `
<div style="text-align:center;padding:10px 0 20px">
  <div style="font-size:58px;margin-bottom:12px;animation:float 2s ease-in-out infinite">🎰</div>
  <p style="font-size:15px;font-weight:600;color:#ff0055;margin-bottom:6px">You discovered the hidden building!</p>
  <p style="font-size:13px;color:rgba(255,255,255,0.45)">Most visitors never explore this far. These are the unlisted achievements.</p>
</div>
<div class="modal-divider"></div>
<ul class="fact-list">
  <li>Managed digital engagement for <strong>30,000+ users</strong> as Head of Social Media at the college fest 📱</li>
  <li>Built WhatsApp automation bots that send <strong>bulk personalised messages</strong> from Excel lists with one click 🤖</li>
  <li>Worked on-ground operations for <strong>Lollapalooza, IPL 2024, Aaditya Gadhvi & Fintech @ Jio</strong> — all in one year 🎸</li>
  <li>Built a <strong>voice AI assistant</strong> with memory that listens, talks, and remembers context — from scratch in Python 🎙️</li>
  <li>Implemented <strong>app testing & process improvement</strong> workflows at Andromeda, cutting manual time significantly ⚙️</li>
  <li>Created <strong>automated email systems</strong> that send to hundreds of recipients from a single script click 📧</li>
  <li>This entire 3D city — every building, road, car — was built from scratch. The driver is driven by the urge to keep creating. 🏙️</li>
</ul>
<div class="modal-divider"></div>
<p style="text-align:center;font-size:13px;color:rgba(255,0,85,0.5)">🏆 <strong style="color:#ff0055">Secret Agent AP</strong> — You have seen it all. AP City is yours.</p>`
  },

  dream: {
    icon: '🌟',
    title: 'DREAM TOWER',
    subtitle: "Future Goals & What's Loading...",
    color: '#ffb700',
    render: () => `
<p style="font-size:13px;color:rgba(255,183,0,0.6);margin-bottom:18px">Every city has a skyline dream. Here's mine — still under construction, always rising.</p>
${[
  {i:'🤖',t:'Full Automation Agency',d:'Build a one-person automation agency that helps small businesses automate repetitive work using Python bots and workflows.'},
  {i:'📊',t:'Analytics + Ops Consulting',d:'Combine operations knowledge with data analytics to offer end-to-end business intelligence and process consulting services.'},
  {i:'🌐',t:'SaaS WhatsApp CRM Tool',d:'A real product — a WhatsApp CRM tool for small business owners to manage leads, follow-ups, and messages automatically.'},
  {i:'🎓',t:'Advanced Python & AI Skills',d:'Level up into machine learning and AI-powered automation — building toward becoming a certified AI/automation engineer.'},
  {i:'🚀',t:'Lead a Tech + Ops Team',d:'Step into a managerial or founder role — leading a team that builds digital systems, products, and processes end-to-end.'},
  {i:'🌏',t:'Work Globally, Live Freely',d:'Build skills and reputation that allow remote work, location independence, and international collaborations and projects.'}
].map(d=>`<div class="dream-item"><h4>${d.i} ${d.t}</h4><p>${d.d}</p></div>`).join('')}
<div class="modal-divider"></div>
<p style="text-align:center;font-size:13px;color:rgba(255,183,0,0.45);font-style:italic">"The dream tower is still being built. Floor by floor. Day by day." — AP</p>`
  }
};
