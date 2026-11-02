'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, Check, ChevronRight, CircleHelp, Copy, FileText, Folder, Mail, X } from 'lucide-react'

type Project = { title: string; description: string; stack: string; href: string; status: 'DONE' | 'ONGOING' }

const categories: { label: string; short: string; projects: Project[] }[] = [
  {
    label: 'Backend & DevOps', short: '01', projects: [
      { title: 'CuraEnjin', description: 'A FastAPI pipeline that learns from an uploaded CSV and generates synthetic tabular data, scored for statistical fidelity.', stack: 'FastAPI / SDV / SDMetrics', href: 'https://github.com/MonoLana/CuraEnjin', status: 'DONE' },
      { title: 'Compose Parser', description: 'A Python tool that parses Docker Compose files into consistent, structured JSON for analysis and tooling.', stack: 'Python / Docker Compose', href: 'https://github.com/MonoLana/compose-parser', status: 'DONE' },
      { title: 'Personal Headless CMS', description: 'A typed content platform with a clean API surface built for flexible publishing workflows.', stack: 'FastAPI / Pydantic v2', href: '#', status: 'ONGOING' },
      { title: 'Motorsport CMS Architecture', description: 'A component lifing and BOM API that keeps complex engineering data structured and searchable.', stack: 'API Design / BOM Systems', href: '#', status: 'ONGOING' },
    ],
  },
  {
    label: 'Data Analysis', short: '02', projects: [
      { title: 'Animation Studio Production Dashboard', description: 'A visual reporting space for tracking production health, delivery milestones, and team metrics.', stack: 'Metrics / Dashboards', href: 'https://github.com/MonoLana/AnimationProduction', status: 'DONE' },
      { title: 'HMPV Article Title Analysis', description: 'A sentiment analysis of HMPV article titles over the years, with trend plots of how the tone has shifted.', stack: 'NLTK / TextBlob / Matplotlib', href: 'https://github.com/MonoLana/hmpvArticle', status: 'DONE' },
      { title: 'Wotakoi Review Analysis', description: 'A Streamlit app that visualizes user reviews of the Wotakoi series scraped from MyAnimeList.', stack: 'Streamlit / Plotly / Python', href: 'https://github.com/MonoLana/WotakoiAnalysisLitApp', status: 'DONE' },
    ],
  },
  {
    label: 'Data Science', short: '03', projects: [
      { title: 'GLCM Extraction for Rice Images', description: 'Texture feature extraction for image-based rice classification experiments and comparison.', stack: 'skimage / OpenCV', href: 'https://github.com/MonoLana/GLCM-skImage-openCV', status: 'DONE' },
    ],
  },
  {
    label: 'Web Development', short: '04', projects: [
      { title: 'Artery Coffee E-Commerce', description: 'A college e-commerce web app built with Next.js, where I led the front-end team.', stack: 'Next.js / E-commerce', href: 'https://github.com/MonoLana/artery-site', status: 'DONE' },
      { title: 'Shopifye Landing Page', description: 'A focused marketing page that turns a product idea into a clear, confident first impression.', stack: 'Next.js / Landing Page', href: 'https://github.com/MonoLana/landing-page', status: 'DONE' },
    ],
  },
]

const totalProjects = categories.reduce((sum, item) => sum + item.projects.length, 0)

function MenuBar() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()))
    update()
    const timer = window.setInterval(update, 30000)
    return () => window.clearInterval(timer)
  }, [])
  return <header className="menu-bar"><nav aria-label="Main menu"><button>File</button><button>Edit</button><button>View</button><button>Help</button></nav><div className="menu-status"><span className="status-dot" aria-hidden="true" /> Available for select projects <span className="menu-divider" /> {time || '--:--'}</div></header>
}

function DesktopIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return <button className="desktop-icon" onClick={onClick} aria-label={`Open ${label}`}><span className="icon-art">{icon}</span><span>{label}</span></button>
}

function ProjectCard({ project }: { project: Project }) {
  return <article className="project-card"><div className="project-card-top"><span className="file-mark" aria-hidden="true" /><span className={`project-status ${project.status === 'DONE' ? 'status-done' : 'status-ongoing'}`}>[{project.status}]</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-card-bottom"><span className="stack-label">{project.stack}</span>{project.status !== 'DONE' ? <span className="wip-label" aria-label="Project in development">[IN DEVELOPMENT]</span> : project.href ? <a href={project.href} target="_blank" rel="noopener noreferrer" className="open-link">Open Link <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" /></a> : <span className="wip-label">[LINK COMING SOON]</span>}</div></article>
}

function WindowFrame({ id, title, zIndex, isActive, onFocus, onClose, onMinimize, children }: { id: string; title: string; zIndex: number; isActive: boolean; onFocus: () => void; onClose: () => void; onMinimize: () => void; children: React.ReactNode }) {
  return <section className="portfolio-window floating-window" data-window-id={id} style={{ zIndex, pointerEvents: 'auto' }} onMouseDown={onFocus} onFocus={onFocus} tabIndex={-1} aria-label={`${title} window`}>
    <div className="window-titlebar"><button className="window-control minimize-box" aria-label={`Minimize ${title} window`} onClick={onMinimize}>−</button><button className="close-box" aria-label={`Close ${title} window`} onClick={onClose}><X size={12} /></button><span className="window-title">{title}</span><span className="window-meta">{isActive ? 'ACTIVE' : 'IDLE'}</span></div>
    {children}
  </section>
}

type FrameProps = Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title'>

function PortfolioWindow({ windowProps }: { windowProps: FrameProps }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const category = categories[active]

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = categories.length - 1
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1) :
      event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) :
      event.key === 'Home' ? 0 :
      event.key === 'End' ? last : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return <WindowFrame {...windowProps} title="Projects.dir"><div className="window-body projects-scroll"><div className="window-intro"><div><p className="eyebrow">DIRECTORY / 2026</p><h1>Selected work<span className="blue-caret">_</span></h1><p className="intro-copy">A small archive of systems, stories, and interfaces built where thoughtful design meets useful technology.</p></div><div className="window-stamp">狂<br /><small>PORTFOLIO</small></div></div>
    <div className="folder-tabs" role="tablist" aria-label="Project categories">
      {categories.map((item, index) => (
        <button
          key={item.label}
          ref={(el) => { tabRefs.current[index] = el }}
          id={`projects-tab-${index}`}
          role="tab"
          type="button"
          aria-selected={active === index}
          aria-controls="projects-panel"
          tabIndex={active === index ? 0 : -1}
          className={active === index ? 'active' : ''}
          onClick={() => setActive(index)}
          onKeyDown={(event) => onTabKeyDown(event, index)}
        >
          <span>{item.short}</span>{item.label}<ChevronRight size={14} aria-hidden="true" />
        </button>
      ))}
    </div>
    <div className="projects-heading"><span>{category.label}</span><span className="mono-count">{String(category.projects.length).padStart(2, '0')} / {totalProjects} projects</span></div>
    <div className="project-grid-scroll" key={category.label} id="projects-panel" role="tabpanel" aria-labelledby={`projects-tab-${active}`}>
      <div className="project-grid">{category.projects.map((project) => <ProjectCard project={project} key={project.title} />)}</div>
    </div>
  </div><div className="window-footer"><span><span className="footer-square" /> index loaded</span><span className="mono-count">scroll to explore</span></div></WindowFrame>
}

const RESUME = {
  name: 'Naufal Maulana',
  title: 'Backend, Data & DevOps Engineer',
  summary: 'Informatics graduate of Sultan Ageng Tirtayasa University (GPA 3.83 / 4.00, 2026) working in backend and web development. Experience includes a freelance front-end role on a medical SaaS product, project management training, and a synthetic tabular data pipeline built with SDV and FastAPI.',
  experience: [
    {
      role: 'Software Engineer (Freelance)',
      org: 'Medicta · Australia',
      dates: 'Jan 2026 – Feb 2026',
      bullets: [
        'Delivered front-end features and tickets for a medical SaaS product.',
        'Developed and documented features in a React library (TypeScript).',
        'Synced the UI with a NestJS-based backend.',
      ],
    },
    {
      role: 'Junior Project Management',
      org: 'PT Vinix Seven Aurum · Indonesia',
      dates: 'Aug 2025 – Nov 2025',
      bullets: [
        'Managed project planning across scope definition, scheduling, stakeholder analysis, and risk management over 10 structured modules.',
        'Wrote project documents including requirement docs, meeting minutes, progress reports, and risk matrices.',
        'Used Trello, Google Sheets, and Docs for task tracking and workflow management.',
        'Applied Agile, Scrum, and Waterfall to choose a development approach per project scenario.',
        'Completed a capstone simulation: a technical and financial proposal for a digital conservation website in Papua, covering cost breakdown, QA planning, communication management, and stakeholder mapping.',
      ],
    },
    {
      role: 'Lecturer Assistant',
      org: 'Sultan Ageng Tirtayasa University · Banten, Indonesia',
      dates: 'Aug 2024 – Jan 2025',
      bullets: [
        'Assessed and managed classes for 2 degree programmes in the Faculty of Engineering.',
        'Gave initial student assessments based on activity during lectures.',
        'Provided learning media and assignments during the lecture period.',
      ],
    },
    {
      role: 'Intern Virtual Copywriter',
      org: 'Schoters · Jakarta, Indonesia',
      dates: 'Aug 2023 – Sep 2023',
      bullets: [
        'Completed weekly copywriting projects.',
        'Completed the final PBI Copywriter project with 100% completion.',
        'Wrote copy for specific social media platforms with a 40% overall efficiency score.',
      ],
    },
  ],
  projects: [
    { name: 'CuraEnjin', year: '2026', text: 'Synthetic tabular data pipeline built with an SDV model and FastAPI, documented with Swagger, with a simple HTML demo UI for testing the pipeline module.' },
    { name: 'GraphQL Docker Research', year: '2025', text: 'Contributed a Python parser module to a Docker research project on GraphQL implementation.' },
    { name: 'Artery Site E-Commerce', year: '2024', text: 'Front-End team leader on a college e-commerce project.' },
  ],
  education: {
    degree: 'Bachelor of Informatics',
    gpa: 'GPA 3.83 / 4.00',
    university: 'Universitas Sultan Ageng Tirtayasa · Banten, Indonesia',
    year: 'Aug 2022 – Jul 2026',
    bullets: [
      'Admin in a game development organization.',
      'Member of Google Developer Student Club.',
      'Front-End team leader for a college e-commerce application project.',
      'Committee member for a Database Security webinar.',
    ],
    secondary: 'SMAN 96 Jakarta · High School Diploma in Science · Jul 2019 – Jul 2022',
  },
  certifications: [
    'SCRUMstudy · Scrum Fundamentals Certified (SFC) (2026)',
    'IBM SkillsBuild · Project Management Fundamentals (2026)',
    'EY · Technology Risk Virtual Job Simulation on Forage (2026)',
    'Linux Foundation · LFS162: Intro to DevOps & SRE (2026)',
    'AWS Training · Knowledge: Cloud Essentials (2024)',
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'Go', 'C++', 'TypeScript', 'JavaScript', 'SQL'] },
    { label: 'Backend', items: ['FastAPI', 'Gin', 'Express'] },
    { label: 'Frontend', items: ['React', 'Vue', 'Astro'] },
    { label: 'ORM', items: ['SQLAlchemy', 'GORM', 'Prisma'] },
    { label: 'DevOps', items: ['Git', 'Docker', 'GitHub'] },
    { label: 'API Docs', items: ['Swagger', 'Postman'] },
    { label: 'Project Mgmt', items: ['Jira', 'Trello', 'Obsidian', 'Slack'] },
    { label: 'Office', items: ['Word/Docs', 'Excel/Sheets', 'Teams'] },
  ],
} as const

function ResumeWindow({ windowProps }: { windowProps: FrameProps }) {
  const titleId = 'resume-window-title'
  const closeRef = useRef(windowProps.onClose)
  closeRef.current = windowProps.onClose

  // ESC hanya menutup resume saat window ini yang sedang aktif (paling depan).
  useEffect(() => {
    if (!windowProps.isActive) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [windowProps.isActive])

  return <section
    className="portfolio-window floating-window resume-window"
    style={{ zIndex: windowProps.zIndex, pointerEvents: 'auto' }}
    role="dialog"
    aria-labelledby={titleId}
    aria-modal="false"
    onMouseDown={windowProps.onFocus}
  >
    <div className="resume-titlebar window-titlebar"><button className="window-control minimize-box" aria-label="Minimize resume window" onClick={windowProps.onMinimize}>−</button><button className="close-box" aria-label="Close resume window" onClick={windowProps.onClose}><X size={12} /></button><span id={titleId} className="window-title">CV_2026.doc</span><span className="window-meta">{windowProps.isActive ? 'ACTIVE' : 'IDLE'}</span></div>
    <div className="resume-toolbar"><span className="resume-meta">CV_2026.doc</span><a href="/resume/Naufal-Maulana-CV.pdf" download target="_blank" rel="noopener noreferrer" className="resume-download">[DOWNLOAD_PDF ↗]</a></div>
    <div className="resume-scroll" tabIndex={0} aria-label="Resume contents"><div className="resume-content"><header><h1>{RESUME.name}</h1><p className="resume-title">{RESUME.title}</p><div className="resume-divider" /></header><section><h2>## PROFILE SUMMARY</h2><div className="resume-rule" /><p>{RESUME.summary}</p></section><section><h2>## EXPERIENCE</h2><div className="resume-rule" />{RESUME.experience.map((item) => <article className="resume-entry" key={`${item.org}-${item.role}`}><h3>{item.role}</h3><p>{item.org} · {item.dates}</p><ul>{item.bullets.map((bullet, index) => <li key={`${item.role}-${index}`}>{bullet}</li>)}</ul></article>)}</section><section><h2>## PROJECTS</h2><div className="resume-rule" />{RESUME.projects.map((project) => <article className="resume-entry" key={project.name}><h3>{project.name} ({project.year})</h3><p>{project.text}</p></article>)}</section><section><h2>## EDUCATION</h2><div className="resume-rule" /><article className="resume-entry"><p><strong>{RESUME.education.degree}</strong><br />{RESUME.education.gpa}<br />{RESUME.education.university} · {RESUME.education.year}</p><ul>{RESUME.education.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><p>{RESUME.education.secondary}</p></article></section><section><h2>## CERTIFICATIONS</h2><div className="resume-rule" /><div className="resume-badges">{RESUME.certifications.map((certification) => <span key={certification}>{certification}</span>)}</div></section><section><h2>## TECH STACK</h2><div className="resume-rule" />{RESUME.skills.map((group) => <div className="resume-entry" key={group.label}><h3>{group.label}</h3><div className="resume-skills">{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</section><p className="resume-eof">-- EOF --</p></div></div>
  </section>
}

const CONTACT = {
  email: 'naufalx26@gmail.com',
  linkedin: 'https://www.linkedin.com/in/naufalmlana',
  github: 'https://github.com/MonoLana',
} as const

function ContactContent() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this email address:', CONTACT.email)
    }
  }
  return <>
    <h2>Let&apos;s make something useful.</h2>
    <p>{CONTACT.email}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
      <a
        className="open-link"
        href="#copy-email"
        role="button"
        onClick={(event) => { event.preventDefault(); copyEmail() }}
        onKeyDown={(event) => { if (event.key === ' ') { event.preventDefault(); copyEmail() } }}
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy email'} {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      </a>
      <a className="open-link" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
      {CONTACT.github && <a className="open-link" href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} /></a>}
    </div>
  </>
}

function InfoWindow({ title, windowProps, children }: { title: string; windowProps: FrameProps; children: React.ReactNode }) {
  return <WindowFrame {...windowProps} title={title}><div className="info-window-body">{children}</div></WindowFrame>
}

export default function Page() {
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({ profile: true, projects: false, contact: false, resume: false })
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({})
  const [zOrder, setZOrder] = useState<Record<string, number>>({ profile: 2 })
  const [nextZ, setNextZ] = useState(3)

  const bringToFront = (id: string) => {
    if (zOrder[id] === nextZ - 1) return // sudah paling depan
    setZOrder((current) => ({ ...current, [id]: nextZ }))
    setNextZ((value) => value + 1)
  }
  const openWindow = (id: string) => {
    setOpenWindows((current) => ({ ...current, [id]: true }))
    setMinimizedWindows((current) => ({ ...current, [id]: false }))
    bringToFront(id)
  }
  const closeWindow = (id: string) => setOpenWindows((current) => ({ ...current, [id]: false }))
  const minimizeWindow = (id: string) => setMinimizedWindows((current) => ({ ...current, [id]: true }))

  const topWindow = Object.keys(openWindows)
    .filter((id) => openWindows[id] && !minimizedWindows[id])
    .sort((a, b) => (zOrder[b] || 1) - (zOrder[a] || 1))[0]

  const toggleFromTaskbar = (id: string) => {
    if (minimizedWindows[id]) {
      setMinimizedWindows((current) => ({ ...current, [id]: false }))
      bringToFront(id)
    } else if (topWindow === id) {
      minimizeWindow(id)
    } else {
      bringToFront(id)
    }
  }

  const frameProps = (id: string): FrameProps => ({
    id,
    zIndex: zOrder[id] || 1,
    isActive: topWindow === id,
    onFocus: () => bringToFront(id),
    onClose: () => closeWindow(id),
    onMinimize: () => minimizeWindow(id),
  })

  return <main className="desktop"><MenuBar /><div className="mobile-shortcuts"><DesktopIcon icon={<span className="home-mark" aria-hidden="true">狂</span>} label="profile" onClick={() => openWindow('profile')} /><DesktopIcon icon={<Folder size={30} />} label="works" onClick={() => openWindow('projects')} /><DesktopIcon icon={<FileText size={28} />} label="resume" onClick={() => openWindow('resume')} /></div><aside className="desktop-dock left-dock"><DesktopIcon icon={<span className="home-mark" aria-hidden="true">狂</span>} label="profile" onClick={() => openWindow('profile')} /><DesktopIcon icon={<Folder size={30} />} label="works" onClick={() => openWindow('projects')} /></aside><aside className="desktop-dock right-dock"><DesktopIcon icon={<Mail size={29} />} label="contact" onClick={() => openWindow('contact')} /><DesktopIcon icon={<FileText size={28} />} label="resume" onClick={() => openWindow('resume')} /></aside><div className="hero-label"><p className="hero-kicker">HELLO, I&apos;M NAUFAL</p><p className="hero-title">SIMPLY<br /><span>LOVELY.</span></p></div><div className="window-layer">{openWindows.projects && !minimizedWindows.projects && <PortfolioWindow windowProps={frameProps('projects')} />}{openWindows.profile && !minimizedWindows.profile && <InfoWindow title="Profile.txt" windowProps={frameProps('profile')}><h2 className="profile-name">Hi, I&apos;m Naufal.</h2><p className="profile-tagline">Backend and DevOps by trade,<br />project manager by habit.</p><p className="profile-text">I build systems that run reliably, then keep the project moving until they ship.</p><p className="profile-text">I&apos;m the one who writes the endpoint, sets up the deploy, and asks “wait, is this still in scope?”</p></InfoWindow>}{openWindows.contact && !minimizedWindows.contact && <InfoWindow title="Contact.mail" windowProps={frameProps('contact')}><ContactContent /></InfoWindow>}{openWindows.resume && !minimizedWindows.resume && <ResumeWindow windowProps={frameProps('resume')} />}</div>
    <div className="taskbar" role="toolbar" aria-label="Open windows">
      {Object.entries(openWindows).filter(([, isOpen]) => isOpen).map(([id]) => {
        const isMinimized = !!minimizedWindows[id]
        const isActive = topWindow === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            className={isActive ? 'active' : isMinimized ? 'minimized' : ''}
            onClick={() => toggleFromTaskbar(id)}
          >
            {id}.window
          </button>
        )
      })}
    </div>
    <footer className="social-strip"><span>FIND ME ON</span><a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-letter">in</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-letter">gh</a>}<a href={`mailto:${CONTACT.email}`} aria-label="Email"><Mail size={17} /></a><span className="social-note"><BriefcaseBusiness size={14} /> open to collaboration</span></footer><div className="help-badge"><CircleHelp size={14} /> <span>press ? for help</span></div></main>
}