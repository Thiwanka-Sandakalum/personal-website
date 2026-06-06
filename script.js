document.addEventListener('DOMContentLoaded', () => {

    // --- Register Service Worker for PWA ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful:', registration.scope);
                })
                .catch(err => {
                    console.error('ServiceWorker registration failed:', err);
                });
        });
    }

    // --- Set Dynamic Copyright Year ---
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // --- Theme Toggle (Dark/Light Mode) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.setAttribute('data-feather', 'moon');
        } else {
            themeIcon.setAttribute('data-feather', 'sun');
        }
        // Re-initialize feather icons
        if (window.feather) {
            feather.replace();
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Announce theme change for screen readers
        const announcement = `Theme changed to ${newTheme} mode`;
        announceToScreenReader(announcement);
    });

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const links = document.querySelectorAll('.nav-links li');
    const body = document.body;

    function toggleMobileMenu() {
        const isActive = navLinks.classList.contains('active');

        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        navBackdrop.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Update ARIA attribute
        hamburger.setAttribute('aria-expanded', !isActive);
        hamburger.setAttribute('aria-label', isActive ? 'Open navigation menu' : 'Close navigation menu');

        // Animate links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        navBackdrop.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');

        links.forEach(link => {
            link.style.animation = '';
        });
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking backdrop
    navBackdrop.addEventListener('click', closeMobileMenu);

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- Scroll Reveal Animation ---
    const observerOptions = {
        threshold: 0.05, // Trigger when 5% of the element is visible
        rootMargin: "0px 0px -20px 0px" // Reduced margin for better triggering
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-up, .hidden-left, .hidden-right');

    // Immediately show hero elements (they're at the top of page)
    const heroElements = document.querySelectorAll('.hero .hidden-left, .hero .hidden-right');
    heroElements.forEach(el => {
        // Add show class immediately for hero section
        requestAnimationFrame(() => {
            el.classList.add('show');
        });
    });

    // Use setTimeout to ensure DOM is fully rendered before checking other elements
    setTimeout(() => {
        hiddenElements.forEach((el) => {
            // Skip hero elements (already handled above)
            if (!el.closest('.hero')) {
                observer.observe(el);
                // Immediately show elements already in viewport
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Add show class after a tiny delay for animation to trigger
                    setTimeout(() => el.classList.add('show'), 100);
                }
            }
        });
    }, 50);

    // Animate proficiency cards on scroll
    const profCards = document.querySelectorAll('.proficiency-card');
    profCards.forEach((card, idx) => {
        observer.observe(card);
    });

    // --- Parallax Effect for Hero Image (Throttled) ---
    const heroImg = document.querySelector('.img-wrapper');
    let lastParallaxTime = 0;
    const parallaxThrottle = 16; // ~60fps

    function handleParallax(e) {
        const now = Date.now();
        if (now - lastParallaxTime < parallaxThrottle) return;
        lastParallaxTime = now;

        if (window.innerWidth > 768 && heroImg) {
            const x = (window.innerWidth - e.clientX * 2) / 100;
            const y = (window.innerHeight - e.clientY * 2) / 100;
            heroImg.style.transform = `translateX(${x}px) translateY(${y}px)`;
        }
    }

    document.addEventListener('mousemove', handleParallax);

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Active Section Indicator ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    let scrollTimeout;

    function updateActiveNavLink() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');

            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Debounced scroll handler
    function handleScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            updateActiveNavLink();
            updateBackToTopButton();
        });
    }

    // Update on scroll (throttled)
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Update on load
    updateActiveNavLink();

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');

    function updateBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Projects Showcase ---
    function setupProjectsShowcase() {
        const projectsGrid = document.getElementById('projects-grid');
        const searchInput = document.getElementById('projects-search');
        const filterButtons = document.querySelectorAll('#projects .filter-btn');
        const modalOverlay = document.getElementById('projects-overlay');
        const modalArch = document.getElementById('projects-modal-arch');
        const modalBody = document.getElementById('projects-modal-body');
        const closeButton = document.getElementById('projects-close');

        if (!projectsGrid || !searchInput || !modalOverlay || !modalArch || !modalBody || !closeButton) {
            return;
        }

        const projects = [
            {
                id: 'logistics',
                hero: true,
                heroLabel: 'Hero project 1',
                heroCls: 'hb-gold',
                title: 'AI logistics orchestrator',
                tagline: 'Courier operators were jumping between five different tools just to move a single package — quoting in one system, booking in another, handling complaints somewhere else. I built an AI agent that runs the entire shipment lifecycle in one conversation, hands off to a human only when a decision genuinely needs one, and never lets the AI skip that check.',
                domain: 'logistics',
                domainLabel: 'Logistics',
                domainCls: 'dt-logistics',
                roles: ['ai-ml', 'backend', 'fullstack'],
                tech: ['Python', 'LangGraph', 'LangChain', 'Gemini', 'LangSmith', 'FastAPI', 'PostgreSQL', 'Next.js', 'Docker', 'GCP'],
                bullets: [
                    'Designed a <strong>LangGraph supervisor-pattern agent</strong> orchestrating 6 domain tools (quote → book → track → verify → complaint) through a single model+middleware node with policy-based routing',
                    'Extended <strong>HumanInTheLoopMiddleware</strong> by overriding after_model() to intercept tool calls at the agent boundary — makes HITL bypass structurally impossible regardless of client behaviour',
                    'Implemented a <strong>quote-to-book consistency lock</strong> using cross-field Pydantic V2 validators enforcing $0.01 price tolerance — blocking hallucinated or stale quote fields before any transactional call',
                    'Applied a <strong>3-layer guardrail middleware stack</strong> (retry × 2, call limit × 5, context summarization) bounding LLM failure loops at a defined ceiling without manual intervention',
                    'Instrumented end-to-end agent runs with <strong>LangSmith tracing</strong> — measuring p50 latency (~4.2s), cost-per-run (~$0.003), and HITL trigger rate (~60%) across 15+ seeded scenarios as a regression baseline',
                    'Designed <strong>5 domain tool packages as thin adapters</strong> over the .NET backend — enabling agent-layer unit testing with mock responses independent of backend availability',
                    'Architected <strong>5 isolated Python domain modules</strong> (quote, shipment, tracking, customer, complaint) each owning its own schema, tool definition, and storage call',
                    'Built a <strong>thread-safe local data layer</strong> with threading.Lock on every operation and singleton-cached instances via functools.cache for consistent object lifecycle across concurrent requests',
                    'Wired <strong>PostgreSQL-backed LangGraph checkpointer</strong> for durable thread state persistence across HITL pauses — enabling safe long-running workflows with pause/resume and zero context loss',
                    'Containerized the full stack with <strong>Docker Compose</strong> (LangGraph API + PostgreSQL checkpointer + Next.js UI) with a 3-command local dev path',
                    'Architected service boundary between <strong>Python agent layer and .NET SaaS backend</strong> enabling independent deployment and versioning of each side on GCP',
                    'Applied <strong>phone-number verification with input normalisation</strong> as a deliberate security control preventing PII access via malformed inputs',
                ],
                metrics: [
                    { val: '4.2s', lbl: 'p50 latency' },
                    { val: '$0.003', lbl: 'cost/run' },
                    { val: '~60%', lbl: 'HITL rate' },
                    { val: '15+', lbl: 'CI scenarios' },
                    { val: '6', lbl: 'domain tools' },
                    { val: '80%', lbl: 'ops automated' }
                ],
                archNodes: [
                    { label: 'Operator query', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Supervisor node', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'HITL gate', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Tool modules', cls: 'background:#E1F5EE;color:#085041' },
                    { label: '.NET backend', cls: 'background:#F1EFE8;color:#444441' }
                ],
                problem: 'Courier operators ran quoting, booking, tracking, customer verification, and complaint filing across disconnected systems - requiring manual context switching for every shipment. UI-only approval checks could be bypassed by any direct API call, exposing sensitive transactional tools to unguarded execution.',
                decisions: [
                    { title: 'LangGraph supervisor over bare chains', why: 'Needed stateful mid-workflow branching to persist quote context across 3-step book-verify-confirm cycle. Chains cannot resume from an interrupt checkpoint.' },
                    { title: 'HITL enforcement at agent layer, not UI', why: 'Overrode after_model() in HumanInTheLoopMiddleware to intercept tool calls before execution - makes bypass structurally impossible regardless of what the client sends.' },
                    { title: '$0.01 price-tolerance consistency lock', why: 'Discovered LLM hallucinations in quote comparison caused booking price drift in 3/50 test runs. Cross-field Pydantic V2 validators block corrupted tool args before any create call.' },
                    { title: 'PostgreSQL checkpointer over in-memory state', why: 'HITL pauses broke conversation context - operators had to restart. Durable persistence enables pause/resume with zero context replay from client across 3-5 tool call spans.' },
                    { title: 'Python reasoning + Go execution boundary', why: 'LLM latency (~4s) must not block transactional throughput in the .NET backend. Separate service boundaries isolate concerns and allow independent deployment.' }
                ],
                eval: [
                    { key: 'Tool', val: 'LangSmith - end-to-end trace collection' },
                    { key: 'p50 latency', val: '~4.2s per run across seeded scenarios' },
                    { key: 'Cost baseline', val: '~$0.003/run from token + model usage' },
                    { key: 'HITL trigger rate', val: '~60% on booking and customer lookup paths' },
                    { key: 'CI coverage', val: '15+ seeded scenarios across all 5 domain modules' },
                    { key: 'Regression signal', val: 'LangSmith traces used as baseline - any deviation flags' }
                ],
                links: ['GitHub', 'Loom demo', 'Case study'],
                gh: 'https://github.com/Thiwanka-Sandakalum/AI-logistics-orchestrator',
                media: {
                    preview: 'assets/projects/AI logistics orchestrator/screenshots/image.png',
                    arch: 'assets/projects/AI logistics orchestrator/diagrams/arct_diagram.png',
                    diagrams: [
                        { label: 'Agent Orchestration Architecture', src: 'assets/projects/AI logistics orchestrator/diagrams/arct_diagram.png' }
                    ],
                    screenshots: [
                        { label: 'Operator UI', src: 'assets/projects/AI logistics orchestrator/screenshots/image.png' }
                    ],
                    demo: 'assets/projects/AI logistics orchestrator/demo.gif'
                }
            },
            {
                id: 'vidsage',
                hero: true,
                heroLabel: 'Hero project 2',
                heroCls: 'hb-blue',
                title: 'VidSage - hybrid RAG platform',
                tagline: 'Watching a 2-hour video to find one answer is a waste of time. Paste any YouTube URL and get accurate, sourced answers from the video — built so the system actually understands what was said, not just what sounds similar, and blocks releases automatically if answer quality drops.',
                domain: 'ai',
                domainLabel: 'AI / LLM',
                domainCls: 'dt-ai',
                roles: ['ai-ml', 'backend', 'fullstack'],
                tech: ['Python', 'FastAPI', 'Gemini', 'LangChain', 'MongoDB Atlas', 'Redis', 'RAGAS', 'JWT', 'Docker', 'pgvector'],
                bullets: [
                    'Engineered a <strong>3-stage hybrid retrieval pipeline</strong> — BM25 sparse retrieval + dense semantic embeddings + cross-encoder reranking over MongoDB Atlas — improving faithfulness from 0.71 to 0.84',
                    'Implemented <strong>RAGAS evaluation suite</strong> (Faithfulness 0.84, Answer Relevancy 0.79, Context Precision, Recall@k) with release-gating logic that blocks PR merge on >5% faithfulness regression in CI',
                    'Designed a <strong>multi-tenant RAG system</strong> with per-user data isolation — processed videos, summaries, and retrieval results scoped to authenticated user at both API and query layer',
                    'Built <strong>token-budget-aware context packing</strong> and structured observability across retrieval traces, prompt version tracking, and cache-hit monitoring',
                    'Implemented <strong>Redis TTL caching</strong> reducing repeated LLM calls — cache-hit monitoring tracked in structured observability alongside latency and token cost telemetry',
                    'Designed <strong>retry/backoff and fallback patterns</strong> around provider failures across ingestion workers and generation endpoints',
                    'Containerized with <strong>Docker multi-stage builds</strong> and non-root runtime user — production-style dependency layering for minimal image size',
                    'Shipped <strong>9 production APIs</strong> (video ingestion, semantic search, RAG Q&A, summarisation, suggested questions, Google Docs export) with JWT auth and per-user data isolation',
                    'Applied <strong>Clean Architecture layering</strong> (API → Service → Repository → Storage) decoupling LLM orchestration from persistence — unit-testable via dependency injection',
                    'Implemented <strong>async ingestion workers</strong> with retry/backoff, structured exception handling, and rate limiting across all LLM and storage calls',
                    'Built a <strong>React + TypeScript frontend</strong> with Clerk authentication, Redux state management, and interactive video analysis views for summaries, chat, and research history',
                    'Integrated <strong>Google OAuth 2.0 and Google Docs export</strong> via a separate Node.js integration service — enabling users to save AI summaries into external productivity workflows',
                ],
                metrics: [
                    { val: '0.84', lbl: 'faithfulness' },
                    { val: '0.79', lbl: 'answer relevancy' },
                    { val: '3-stage', lbl: 'retrieval' },
                    { val: 'CI gate', lbl: 'on every PR' },
                    { val: '9', lbl: 'production APIs' },
                    { val: 'BM25+', lbl: 'hybrid search' }
                ],
                archNodes: [
                    { label: 'YouTube URL', cls: 'background:#F1EFE8;color:#444441' },
                    { label: 'Transcript + chunking', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'BM25 + vector index', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'Reranker', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Gemini generation', cls: 'background:#E1F5EE;color:#085041' },
                    { label: 'RAGAS eval loop', cls: 'background:#FCEBEB;color:#791F1F' }
                ],
                problem: 'Naive vector similarity search misses exact keyword matches - YouTube captions contain speaker names, codes, and terms that semantic embeddings underweight. Standard RAG pipelines have no quality gate, so retrieval regressions after refactors silently degrade user experience.',
                decisions: [
                    { title: 'BM25 + semantic hybrid over pure vector', why: 'YouTube auto-captions contain exact technical terms and speaker names that semantic embeddings miss. Hybrid search improved Recall@5 - sparse retrieval catches exact matches dense cannot.' },
                    { title: 'Cross-encoder reranking as third stage', why: 'Bi-encoder similarity scores are not calibrated for ranking. Cross-encoder reranker reads full query-chunk pair, pushing faithfulness from 0.71 to 0.84 on evaluation set.' },
                    { title: 'RAGAS gate in GitHub Actions CI', why: 'A refactor silently dropped faithfulness by 11% in one test run. Automated gate blocks PR merge when RAGAS faithfulness falls >5% from baseline - discovered post-merge without it.' },
                    { title: 'Redis TTL caching before LLM call', why: 'Identical queries (same video, same question) regenerated unnecessarily. Cache-hit path eliminates LLM call entirely, reducing p95 latency and token cost on repeated queries.' },
                    { title: 'Multi-tenant per-user data isolation', why: 'Processed videos, summaries, and retrieval results must not bleed across users. JWT-scoped access control enforced at both API and MongoDB query layer.' }
                ],
                eval: [
                    { key: 'Framework', val: 'RAGAS - evaluation on 100 Q&A pairs' },
                    { key: 'Faithfulness', val: '0.84 (target: >0.80)' },
                    { key: 'Answer Relevancy', val: '0.79 (target: >0.75)' },
                    { key: 'Context Precision', val: 'tracked per release' },
                    { key: 'Recall@k', val: 'tracked per retrieval stage change' },
                    { key: 'CI gate', val: 'GitHub Actions - blocks merge on >5% faithfulness drop' }
                ],
                links: ['GitHub', 'Loom demo'],
                gh: 'https://github.com/Thiwanka-Sandakalum/VidSage',
                media: {
                    preview: 'assets/projects/Vidsage/screenshots/home_dashboard.png',
                    arch: 'assets/projects/Vidsage/diagrams/arc_diagram.png',
                    diagrams: [
                        { label: 'System Architecture', src: 'assets/projects/Vidsage/diagrams/image.png' },
                        { label: 'RAG Pipeline', src: 'assets/projects/Vidsage/diagrams/rag_diagram.png' }
                    ],
                    screenshots: [
                        { label: 'Home Dashboard', src: 'assets/projects/Vidsage/screenshots/home_dashboard.png' },
                        { label: 'Research Library', src: 'assets/projects/Vidsage/screenshots/research_library.png' },
                        { label: 'Video Detail + RAG', src: 'assets/projects/Vidsage/screenshots/video_detail.png' },
                        { label: 'Integrations', src: 'assets/projects/Vidsage/screenshots/integrations_tools.png' }
                    ],
                    demo: 'assets/projects/Vidsage/Vidsage.gif'
                }
            },

            {
                id: 'rootalpha',
                hero: true,
                heroLabel: 'Hero project 3',
                title: 'RootAlpha Financial Root‑Cause Analysis Platform',
                tagline: 'Production‑grade, multi‑agent AI framework that ingests financial quarterly reports, maps causal entity relationships, and generates structurally grounded, numerically verified risk assessments.',
                domain: 'fintech',
                domainLabel: 'FinTech / AI',
                domainCls: 'dt-fintech',
                roles: ['ai-ml', 'backend', 'fullstack'],
                tech: ['Python', 'LangGraph', 'LangChain', 'Gemini', 'FastAPI', 'PostgreSQL', 'Docker', 'GCP'],
                bullets: [
                    'Implemented a GraphRAG pipeline that parses quarterly report PDFs, extracts financial entities, and builds a causal graph linking revenue, expenses, and market factors',
                    'Designed a multi‑agent supervisor pattern with specialized agents for data ingestion, graph construction, risk scoring, and report generation',
                    'Integrated a numeric verification layer using Python pandas and NumPy to cross‑validate risk scores against historical financial KPIs',
                    'Applied a 3‑layer guardrail middleware stack (retry × 2, call limit × 5, context summarization) to bound LLM failure loops',
                    'Instrumented end‑to‑end runs with LangSmith tracing, capturing latency (~5s), cost per run (~$0.005), and accuracy metrics',
                ],
                metrics: [
                    { val: '5s', lbl: 'p50 latency' },
                    { val: '$0.005', lbl: 'cost/run' },
                    { val: '~85%', lbl: 'risk model accuracy' },
                    { val: '10+', lbl: 'financial domains covered' },
                ],
                archNodes: [
                    { label: 'Report Ingestion', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Graph Builder', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'Risk Scorer', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Verification Layer', cls: 'background:#E1F5EE;color:#085041' },
                    { label: 'Frontend UI', cls: 'background:#F1EFE8;color:#444441' },
                ],
                problem: 'Financial analysts manually comb through quarterly reports to build causal models, a time‑consuming, error‑prone process lacking reproducibility and numeric validation.',
                decisions: [
                    { title: 'GraphRAG over plain RAG', why: 'Causal relationships require graph structures to capture dependencies between financial entities, which plain vector search cannot represent.' },
                    { title: 'Numeric verification layer', why: 'Ensures risk scores are grounded in actual financial metrics, avoiding hallucinated assessments.' },
                    { title: 'Multi‑agent supervisor', why: 'Separates concerns (ingestion, graph building, scoring) enabling independent scaling and easier debugging.' },
                ],
                eval: [
                    { key: 'Latency', val: '~5s end‑to‑end' },
                    { key: 'Cost', val: '~$0.005 per run' },
                    { key: 'Risk accuracy', val: '~85% on validation set' },
                ],
                links: ['GitHub', 'Demo'],
                gh: 'https://github.com/Thiwanka-Sandakalum/RootAlpha',
                media: {
                    preview: 'assets/projects/RootAlpha/screen (2).png',
                    arch: 'assets/projects/RootAlpha/diagrams/RAG_diagram.png',
                    diagrams: [
                        { label: 'RAG Diagram', src: 'assets/projects/RootAlpha/diagrams/RAG_diagram.png' },
                        { label: 'Arc Diagram', src: 'assets/projects/RootAlpha/diagrams/arct_diagram.png' },
                        { label: 'Ingestion Diagram', src: 'assets/projects/RootAlpha/diagrams/ingestion_diagram.png' }
                    ],
                    screenshots: [
                        { label: 'Screenshot 1', src: 'assets/projects/RootAlpha/screen.png' },
                        { label: 'Screenshot 2', src: 'assets/projects/RootAlpha/screen (2).png' }
                    ],
                    demo: null
                }
            },
            {
                id: 'storytelling',
                hero: false,
                heroCls: 'hb-purple',
                title: 'Storytelling AI - multimodal narration',
                tagline: 'Writing a 6,000-word story takes hours — and then you still have to read it yourself. This platform generates a complete, narrated story in under 3 minutes: you define a seed, the AI plans it, writes it in parallel, then reads it back to you in real-time audio while you can interrupt and redirect mid-story.',
                domain: 'media',
                domainLabel: 'Media / AI',
                domainCls: 'dt-media',
                roles: ['ai-ml', 'fullstack', 'cloud'],
                tech: ['Python', 'LangGraph', 'Google ADK', 'Gemini Live', 'FastAPI', 'MLflow', 'Celery', 'React', 'PostgreSQL', 'Docker', 'GCP'],
                bullets: [
                    'Designed a <strong>multi-node LangGraph pipeline</strong> (Planner → parallel Chapter Generators → Assembler) with Send API fan-out, reducing 6k-word story generation from 8.5 to under 3 minutes (~65%)',
                    'Built a <strong>HITL outline approval gate</strong> between planning and generation — cost-conscious design preventing token-intensive generation from running on wrong narrative directions',
                    'Integrated <strong>Gemini Multimodal Live (BiDi WebSocket)</strong> for real-time audio narration with mid-story interactive Q&A — session context preserved across user interruptions',
                    'Implemented <strong>Google ADK for structured agentic tool use</strong> and Pydantic-typed schema binding across all LLM nodes with automatic retry and parse-error recovery',
                    'Instrumented both services with <strong>MLflow</strong> for run quality and latency tracking — logging per-stage metrics, token usage, and generation throughput across runs',
                    'Built an <strong>in-process async task scheduler</strong> with concurrency semaphores to safely execute LangGraph pipelines inside the FastAPI event loop without blocking request handling',
                    'Designed <strong>tenacity-based retry wrappers</strong> with exponential backoff around all LLM calls, isolating transient API failures from pipeline failures',
                    'Architected <strong>per-stage DB status transitions</strong> (queued → planning → generating → assembling → completed) enabling full auditability and failure recovery for long-running jobs',
                    'Designed a <strong>dual-microservice architecture</strong>: generation service (FastAPI + LangGraph + PostgreSQL) and narration service (FastAPI + Google ADK) as independent deployable units targeting Google Cloud Run',
                    'Built a <strong>React 19 + Redux Toolkit + Clerk auth</strong> production interface with protected routes, story library manager, and narrator studio with mic-based interruption for interactive Q&A',
                    'Engineered a <strong>client-side PCM16 audio pipeline</strong> using Web Audio API with jitter buffer and scheduled playback clock — handles variable-latency Gemini Live streaming with zero audio gaps',
                    'Implemented <strong>SSE real-time status streaming</strong> exposing 5 pipeline stage transitions to the frontend — no polling overhead, push-based progress visibility',
                ],
                metrics: [
                    { val: '<3 min', lbl: '6k-word story' },
                    { val: '65%', lbl: 'time reduction' },
                    { val: 'BiDi', lbl: 'live audio' },
                    { val: 'MLflow', lbl: 'run tracking' },
                    { val: '2', lbl: 'microservices' },
                    { val: '5', lbl: 'pipeline stages' }
                ],
                archNodes: [
                    { label: 'User prompt', cls: 'background:#F1EFE8;color:#444441' },
                    { label: 'Planner agent', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'HITL outline gate', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Parallel generators', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Assembler', cls: 'background:#E1F5EE;color:#085041' },
                    { label: 'Gemini Live narration', cls: 'background:#FAECE7;color:#712B13' }
                ],
                problem: 'Sequential story generation creates a bottleneck - chapters are independent but processed one at a time, wasting wall-clock time. Real-time audio narration requires maintaining session context across user interruptions; a stateless TTS queue breaks the conversational thread mid-story.',
                decisions: [
                    { title: 'Two independent microservices, not one monolith', why: 'Generation failures must not corrupt narration state. Separated generation service (FastAPI + LangGraph + PostgreSQL) and narration service (FastAPI + Google ADK) with independent deployment and failure domains.' },
                    { title: 'LangGraph Send API fan-out for chapters', why: 'Each chapter is contextually independent given the outline. Parallel fan-out (Planner -> N Chapter Generators -> Assembler) reduced median generation time from 8.5 to under 3 minutes (~65%).' },
                    { title: 'Gemini Live API BiDi WebSocket over TTS queue', why: 'Mid-story Q&A requires the model to hold audio session context. A stateless TTS queue cannot maintain the conversational thread - BiDi WebSocket keeps session state alive across interruptions.' },
                    { title: 'HITL outline approval gate before generation', why: 'Chapter generation is token-intensive and irreversible. Pausing for outline review before committing to full generation gives users cost-conscious control and prevents wasted LLM spend on wrong narrative directions.' },
                    { title: 'Client-side jitter buffer for PCM16 audio', why: 'Variable latency from Gemini Live causes audio gaps without buffering. Web Audio API jitter buffer with scheduled playback clock smooths variable-latency streaming to gapless audio.' }
                ],
                eval: [
                    { key: 'Run tracking', val: 'MLflow - latency, token usage, quality per run' },
                    { key: 'Throughput benchmark', val: '~6,000-word story in under 3 minutes' },
                    { key: 'Parallelisation gain', val: '~65% wall-clock reduction vs sequential' },
                    { key: 'Audio quality', val: 'Zero gap playback via jitter buffer design' },
                    { key: 'Stage observability', val: '5 SSE stage transitions surfaced to frontend per run' }
                ],
                links: ['GitHub', 'Loom demo'],
                gh: 'https://github.com/Thiwanka-Sandakalum/storytelling_ai',
                media: {
                    preview: 'assets/projects/Storytelling AI/screenshots/Screenshot.png',
                    arch: 'assets/projects/Storytelling AI/diagrams/arc-diagram.png',
                    diagrams: [
                        { label: 'LangGraph Pipeline Graph', src: 'assets/projects/Storytelling AI/diagrams/graph.png' },
                        { label: 'System Architecture', src: 'assets/projects/Storytelling AI/diagrams/arc-diagram.png' }
                    ],
                    screenshots: [
                        { label: 'Story Forge UI', src: 'assets/projects/Storytelling AI/screenshots/Screenshot.png' }
                    ],
                    demo: 'assets/projects/Storytelling AI/demo.gif'
                }
            },
            {
                id: 'mediassist',
                hero: false,
                title: 'MediAssist - pharmacy AI agent',
                tagline: 'Manual prescription checking takes 10–15 minutes per patient and is error-prone under high volume. This platform processes a prescription in 2.6 seconds — checking drug interactions, allergy conflicts, and dosing — then escalates to a pharmacist only for the cases that actually require human judgment.',
                domain: 'health',
                domainLabel: 'Healthcare AI',
                domainCls: 'dt-health',
                roles: ['ai-ml', 'backend'],
                tech: ['Python', 'LangGraph', 'Gemini', 'FastAPI', 'pgvector', 'LangSmith', 'RAGAS', 'DeepEval', 'Prometheus', 'React', 'Docker'],
                bullets: [
                    'Built a <strong>9-agent LangGraph state-machine</strong> for prescription intake → clinical validation → dispensing → counseling → audit, with risk-threshold HITL routing to pharmacist review',
                    'Implemented <strong>pgvector RAG for drug monograph retrieval</strong> — drug interaction and allergy data retrieved at query time via cosine similarity over indexed monograph chunks',
                    'Added <strong>DeepEval + RAGAS dual evaluation in CI</strong> — domain-specific assertion checks (DeepEval) combined with generation quality scores (RAGAS) for safety-critical output validation',
                    'Achieved <strong>99.2% drug interaction accuracy and 99.8% allergy detection</strong> on validation set; 2.6s processing vs 10–15 min manual baseline',
                    'Deployed full observability with <strong>LangSmith traces + Prometheus metrics + Grafana dashboards</strong> across all 9 agent stages',
                    'Implemented <strong>PostgreSQL checkpointing</strong> for state replay and recovery — failed prescriptions can be resumed from last completed stage without reprocessing',
                    'Designed a <strong>React + TypeScript SSE dashboard</strong> with real-time stage updates across 9 clinical processing steps',
                    'Built <strong>HIPAA-compliant audit trail</strong> with structured log capture at every agent stage transition — full traceability for prescription lifecycle',
                ],
                metrics: [
                    { val: '2.6s', lbl: 'vs 10-15 min manual' },
                    { val: '99.2%', lbl: 'interaction accuracy' },
                    { val: '99.8%', lbl: 'allergy detection' },
                    { val: '60 Rx/hr', lbl: 'throughput' },
                    { val: '$2.40', lbl: 'per 1000 Rx' },
                    { val: '9', lbl: 'agents' }
                ],
                archNodes: [
                    { label: 'Prescription intake', cls: 'background:#EAF3DE;color:#27500A' },
                    { label: 'Clinical validation agents', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'pgvector drug RAG', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'HITL pharmacist gate', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Audit + dispensing', cls: 'background:#E1F5EE;color:#085041' }
                ],
                problem: 'Pharmacy prescription processing requires multi-step clinical validation (drug interactions, allergies, dosing) that is slow when manual (10-15 min) and error-prone. High-risk cases still require human pharmacist sign-off, so the agent must know when to stop and escalate.',
                decisions: [
                    { title: '9-agent specialisation over single monolithic agent', why: 'Each clinical check (interaction, allergy, dosage, formulary, counselling, audit) is an independent domain. Isolated agents reduce blast radius of LLM errors and enable targeted evaluation per stage.' },
                    { title: 'pgvector for drug monograph RAG', why: 'Drug interaction data is structured and dense. pgvector with cosine similarity retrieval over monograph chunks outperforms prompt-stuffing entire drug databases into context.' },
                    { title: 'Risk-threshold HITL routing', why: 'Not all prescriptions need pharmacist review - only high-risk cases (controlled substances, interaction flags). Threshold routing keeps throughput high while maintaining safety compliance.' },
                    { title: 'DeepEval + RAGAS dual evaluation in CI', why: 'Clinical accuracy requires both generation quality (RAGAS faithfulness) and domain-specific assertion checks (DeepEval). Single eval framework was insufficient for safety-critical outputs.' }
                ],
                eval: [
                    { key: 'Drug interaction accuracy', val: '99.2% on validation set' },
                    { key: 'Allergy detection', val: '99.8%' },
                    { key: 'Processing speed', val: '2.6s vs 10-15 min manual baseline' },
                    { key: 'Evaluation tools', val: 'DeepEval + RAGAS - both run in CI/CD' },
                    { key: 'Observability', val: 'LangSmith traces + Prometheus metrics + Grafana dashboards' }
                ],
                links: ['GitHub'],
                gh: 'https://github.com/Thiwanka-Sandakalum/MediAssist',
                media: {
                    preview: 'assets/projects/MediAssist/diagrams/agent_diagram.png',
                    arch: 'assets/projects/MediAssist/diagrams/agent_diagram.png',
                    diagrams: [
                        { label: '9-Agent Clinical Workflow', src: 'assets/projects/MediAssist/diagrams/agent_diagram.png' }
                    ],
                    screenshots: [],
                    demo: null
                }
            },
            {
                id: 'loomis',
                hero: false,
                title: 'Loomis SaaS platform',
                tagline: 'Courier businesses lose time and customer trust when tracking, pricing, and support live in different tools with no shared context. Loomis puts the entire operation — shipments, rates, integrations, and an AI customer agent — into one platform, built so any team can deploy it without breaking what already works.',
                domain: 'saas',
                domainLabel: 'Enterprise SaaS',
                domainCls: 'dt-saas',
                roles: ['fullstack', 'cloud', 'backend'],
                tech: ['C#', '.NET 10', 'Angular 21', 'TypeScript', 'Azure SQL', 'Auth0', 'Azure Container Apps', 'Terraform', 'GitHub Actions', 'OpenAPI', 'Docker'],
                bullets: [
                    'Deployed cloud-native on <strong>Azure Container Apps + Azure Static Web Apps</strong> with Azure Container Registry — fully containerized, auto-scaling, stateless compute architecture',
                    'Provisioned infrastructure with <strong>Terraform (HCL)</strong> — reproducible Azure environment from code, no manual resource creation',
                    'Built <strong>CI/CD pipeline with GitHub Actions</strong> automating build → test → container publish → deploy on every PR merge',
                    'Implemented <strong>multi-tenant data isolation</strong> enforced at both middleware and data access layer — cross-tenant data bleed prevented even in error paths',
                    'Designed <strong>OpenAPI-contract-first API</strong> across all domain services (shipments, rates, onboarding, inquiries, sessions, integrations) — typed client generation, zero breaking-change incidents',
                    'Implemented <strong>Auth0 JWT + role-aware RBAC</strong> — tenant admin, operator, and viewer roles with granular endpoint-level authorisation',
                    'Built <strong>reliability guardrails</strong> including correlation IDs, structured exception handling, and plan-based rate limiting across all integration-heavy endpoints',
                    'Wrote <strong>xUnit + Moq + FluentAssertions unit tests and Microsoft.AspNetCore.Mvc.Testing integration tests</strong> across controllers, middleware, and services',
                    'Built a full <strong>Angular 21 admin dashboard</strong> — shipments, rates, integrations, onboarding, and settings domains with component-level feature isolation',
                    'Implemented <strong>AI agent sandbox UI</strong> for customer agent testing — operator-facing interface integrated with the isolated AI service',
                    'Applied <strong>service boundary isolation</strong>: AI service and transactional API are independently deployed — frontend routes to each without coupling',
                ],
                metrics: [
                    { val: 'Multi-tenant', lbl: 'data isolation' },
                    { val: '.NET 10', lbl: 'backend' },
                    { val: 'Azure', lbl: 'cloud-native' },
                    { val: 'CI/CD', lbl: 'GitHub Actions' },
                    { val: 'xUnit', lbl: 'test coverage' },
                    { val: 'OpenAPI', lbl: 'contract-first' }
                ],
                archNodes: [
                    { label: 'Angular 21 frontend', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Azure API Management', cls: 'background:#FAEEDA;color:#633806' },
                    { label: '.NET Core API', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'AI service (isolated)', cls: 'background:#E1F5EE;color:#085041' },
                    { label: 'Azure SQL + Auth0', cls: 'background:#F1EFE8;color:#444441' }
                ],
                problem: 'Courier teams operate across disconnected tools for tracking, pricing, support, and reporting - creating context switching and weak traceability. AI capability must be deployed independently without risking the stability of core transactional APIs.',
                decisions: [
                    { title: 'AI service boundary isolation from transactional core', why: 'AI deployments have higher failure rates and more frequent updates than stable domain APIs. Isolated service enables independent versioning, rollback, and failure containment without touching the .NET core.' },
                    { title: 'Tenant context enforced at middleware AND data access layer', why: 'Enforcing only at the API layer leaves data access vulnerable to misconfigured queries. Double enforcement at both layers prevents cross-tenant bleed even in error paths.' },
                    { title: 'Auth0 OIDC with role-aware JWT claims', why: 'Multi-tenant B2B SaaS needs granular role control (tenant admin vs operator vs viewer). Auth0 provides this without building a custom identity system, reducing security surface area.' },
                    { title: 'Correlation IDs and structured exception handling from day one', why: 'Integration-heavy systems with external carriers and payment APIs fail in complex ways. Correlation IDs enable tracing failures across service boundaries without log archaeology.' }
                ],
                eval: [
                    { key: 'Unit tests', val: 'xUnit + Moq + FluentAssertions' },
                    { key: 'Integration tests', val: 'Microsoft.AspNetCore.Mvc.Testing' },
                    { key: 'CI pipeline', val: 'Build -> test -> deploy on every PR via GitHub Actions' },
                    { key: 'API validation', val: 'OpenAPI contract - typed client generation, no breaking changes' }
                ],
                links: ['GitHub'],
                gh: 'https://github.com/Thiwanka-Sandakalum/loomis-saas',
                media: {
                    preview: 'assets/projects/Loomis SaaS platform/screenshots/dashboard.png',
                    arch: 'assets/projects/Loomis SaaS platform/diagrams/loomis-architecture.png',
                    diagrams: [],
                    screenshots: [
                        { label: 'Dashboard', src: 'assets/projects/Loomis SaaS platform/screenshots/dashboard.png' },
                        { label: 'AI Agent Sandbox', src: 'assets/projects/Loomis SaaS platform/screenshots/ai-agent-sandbox.png' },
                        { label: 'Integrations', src: 'assets/projects/Loomis SaaS platform/screenshots/integrations.png' }
                    ],
                    demo: null
                }
            },
            {
                id: 'finverse',
                hero: false,
                title: 'FinVerse - financial marketplace AI',
                tagline: 'Comparing loans, fixed deposits, and credit cards across different banks means visiting five websites and manually reading the fine print. FinVerse brings every financial product onto one platform, with an AI assistant that retrieves live product data and tells you what is actually worth considering for your situation.',
                domain: 'fintech',
                domainLabel: 'Fintech',
                domainCls: 'dt-fintech',
                roles: ['fullstack', 'cloud', 'ai-ml'],
                tech: ['React', 'FastAPI', 'Python', 'TypeScript', 'Azure API Management', 'Azure VNet', 'Auth0', 'LangChain', 'MongoDB', 'PostgreSQL', 'Docker'],
                bullets: [
                    'Architected a <strong>single public entry via Azure API Management</strong> with all backend services isolated inside an Azure VNet — unreachable from internet directly',
                    'Implemented <strong>private network isolation</strong> with VNet-integrated microservices (User, Product, AI Agent domains) behind APIM routing',
                    'Applied <strong>Auth0 OIDC with 3-role JWT claims</strong> (User / Institution / Admin) enforced at the API gateway layer',
                    'Designed a <strong>RAG-based financial assistant</strong> — retrieving current product data (loans, FDs, credit cards) at query time via vector search to prevent stale recommendations',
                    'Built <strong>AI-first product comparison</strong> with LangChain-based retrieval over financial product database, returning personalised insights scoped to user profile',
                    'Built a <strong>React frontend</strong> with Auth0 OIDC integration, role-aware route protection, and financial product comparison views',
                    'Designed <strong>AI-first product discovery UX</strong> — interest rate intelligence, comparison lists, research workspace, and AI chat integrated into a single interface',
                ],
                metrics: [
                    { val: 'RAG', lbl: 'financial assistant' },
                    { val: 'Azure VNet', lbl: 'private backend' },
                    { val: 'RBAC', lbl: '3-role access' },
                    { val: 'Microservices', lbl: 'domain-split' },
                    { val: 'OIDC/JWT', lbl: 'auth model' },
                    { val: 'AI-first', lbl: 'design pattern' }
                ],
                archNodes: [
                    { label: 'React frontend', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Azure API Mgmt', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'User / Product / AI services', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'VNet (private)', cls: 'background:#F1EFE8;color:#444441' },
                    { label: 'MongoDB + PostgreSQL', cls: 'background:#E1F5EE;color:#085041' }
                ],
                problem: 'Financial product comparison across institutions (banks, FD providers, credit cards) is fragmented - users compare products across multiple websites without personalised AI guidance. Backend services must be private with a single public entry point to prevent direct API exposure.',
                decisions: [
                    { title: 'Single public entry via Azure API Management', why: 'Exposing individual microservices publicly increases attack surface. APIM as the single gateway centralises auth, rate limiting, and routing - private services remain unreachable from internet.' },
                    { title: 'RAG over prompt-stuffing for product recommendations', why: 'Financial product database changes frequently. RAG retrieves current product data at query time - prompt-stuffing with stale context produces outdated recommendations.' },
                    { title: '3-role RBAC (User / Institution / Admin)', why: 'Institutions need to manage their own product listings; users need read-only access; admins need full control. Flat single-role models cannot enforce this without custom logic on every endpoint.' }
                ],
                eval: [
                    { key: 'RAG quality', val: 'Vector search retrieval - top-k product matching' },
                    { key: 'Security model', val: 'Auth0 OIDC + JWT + RBAC at API gateway layer' },
                    { key: 'Network isolation', val: 'Backend services reachable only within Azure VNet' }
                ],
                links: ['GitHub'],
                gh: 'https://github.com/Thiwanka-Sandakalum/FinVerse',
                media: {
                    preview: 'assets/projects/FinVerse/screenshots/Screenshot.png',
                    arch: 'assets/projects/FinVerse/diagrams/diagram.png',
                    diagrams: [
                        { label: 'Azure Cloud Architecture', src: 'assets/projects/FinVerse/diagrams/diagram.png' }
                    ],
                    screenshots: [
                        { label: 'FinVerse Platform', src: 'assets/projects/FinVerse/screenshots/Screenshot.png' }
                    ],
                    demo: null
                }
            },
            {
                id: 'torrent',
                hero: false,
                title: 'Torrent Hunt - polyglot streaming platform',
                tagline: 'Standard download managers hammer the server with status requests, freeze the UI under load, and leave your Google credentials sitting in plain text. This platform downloads, streams, and saves directly to Drive — with instant real-time progress, zero polling, and tokens encrypted at rest.',
                domain: 'infra',
                domainLabel: 'Infra / Systems',
                domainCls: 'dt-infra',
                roles: ['backend', 'infra'],
                tech: ['TypeScript', 'Go', 'Node.js', 'Redis Streams', 'Redis Pub/Sub', 'MongoDB', 'Auth0', 'Kubernetes', 'SSE', 'AES-256-GCM', 'Google Drive API'],
                bullets: [
                    'Replaced HTTP polling with <strong>Redis Streams consumer groups</strong> for async download task queuing — at-least-once delivery with PEL redelivery on worker crash',
                    'Implemented <strong>SSE over Redis Pub/Sub</strong> pushing real-time download progress to browser — eliminates 100 req/s polling overhead from 100 concurrent users',
                    'Chose <strong>Go over Node.js for byte-range streaming</strong> — goroutines handle concurrent I/O blocking natively without event loop contention',
                    'Secured OAuth2 refresh tokens with <strong>AES-256-GCM encryption at rest</strong> in MongoDB — prevents silent exfiltration of permanent Google credentials',
                    'Wrote a <strong>Kubernetes-native deployment</strong> with namespace isolation, StatefulSets, PVCs for storage, and Secrets for credentials',
                    'Implemented <strong>object storage decoupling</strong> — completed downloads stored independently enabling each service to scale without shared filesystem dependency',
                    'Applied <strong>Auth0-secured API gateway</strong> as single entry point with JWT validation before any service call',
                    'Built a <strong>browser-based video streaming player</strong> consuming byte-range responses from Go stream service with progressive playback',
                    'Implemented <strong>Google Drive OAuth integration</strong> enabling post-download save to personal Drive — full OAuth2 refresh token lifecycle managed securely',
                ],
                metrics: [
                    { val: 'Go', lbl: 'byte-range I/O' },
                    { val: 'Redis Streams', lbl: 'at-least-once queue' },
                    { val: 'AES-256', lbl: 'token encryption' },
                    { val: 'K8s StatefulSets', lbl: 'storage layer' },
                    { val: 'SSE', lbl: 'real-time progress' },
                    { val: '0 polls', lbl: 'vs polling baseline' }
                ],
                archNodes: [
                    { label: 'Auth0 gateway', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'Node.js API', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Redis Streams queue', cls: 'background:#FCEBEB;color:#791F1F' },
                    { label: 'Go worker', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'SSE -> browser', cls: 'background:#E1F5EE;color:#085041' }
                ],
                problem: 'HTTP polling for multi-GB download progress at 1s intervals from 100 concurrent users generates 100 req/s of pure overhead. Node.js event loop cannot handle concurrent byte-range I/O for video streaming without blocking all other requests.',
                decisions: [
                    { title: 'Redis Streams over HTTP polling for progress', why: 'Polling at 1s x 100 users = 100 req/s of waste. Workers publish to Redis Pub/Sub; API streams to browser via SSE. Zero polling overhead, push-based delivery.' },
                    { title: 'Go for stream service and download workers', why: 'Node.js single event loop blocks on I/O-heavy byte-range streaming. Go goroutines handle concurrent connections natively with no event loop contention.' },
                    { title: 'Redis Streams consumer groups for at-least-once delivery', why: 'If a worker crashes mid-download, Redis keeps the message in pending-entry list. Consumer group redelivery ensures no job is lost silently on worker failure.' },
                    { title: 'AES-256-GCM for OAuth2 token storage', why: 'Google refresh tokens are permanent credentials. Encryption at rest prevents silent exfiltration if MongoDB storage is compromised.' }
                ],
                eval: [
                    { key: 'Throughput', val: 'Concurrent multi-GB downloads without blocking API layer' },
                    { key: 'Reliability', val: 'Redis PEL-backed at-least-once delivery on worker crash' },
                    { key: 'Security', val: 'AES-256-GCM encrypted refresh tokens in MongoDB' },
                    { key: 'Infra', val: 'K8s StatefulSets + PVCs + namespace isolation' }
                ],
                links: ['GitHub'],
                gh: 'https://github.com/Thiwanka-Sandakalum/torrent-downloader',
                media: {
                    preview: 'assets/projects/Torrent Hunt/diagrams/arc_diagram.png',
                    arch: 'assets/projects/Torrent Hunt/diagrams/arc_diagram.png',
                    diagrams: [
                        { label: 'System Architecture', src: 'assets/projects/Torrent Hunt/diagrams/arc_diagram.png' }
                    ],
                    screenshots: [],
                    demo: null
                }
            },
            {
                id: 'edupath',
                hero: false,
                title: 'EduPath-LK - student guide platform',
                tagline: 'Sri Lankan students have no single trusted source for universities, scholarships, and courses — the information is scattered across dozens of government and institution sites with no way to search or compare. EduPath centralises everything into one verified directory, with an AI chat assistant to guide students through their options.',
                domain: 'saas',
                domainLabel: 'EdTech SaaS',
                domainCls: 'dt-saas',
                roles: ['fullstack', 'cloud', 'backend'],
                tech: ['TypeScript', 'Node.js', 'Python FastAPI', 'MySQL', 'MongoDB', 'Auth0', 'Azure', 'Docker', 'React'],
                bullets: [
                    'Built <strong>dual frontend applications</strong> (student-facing client + admin panel) with Auth0-secured routes and role-aware UI components',
                    'Implemented <strong>polyglot persistence</strong> — MySQL for structured relational data (institutions, scholarships) and MongoDB for unstructured content (program descriptions, documents)',
                    'Deployed multi-service architecture on <strong>Azure with Docker</strong> — separate containers for client, admin, Node.js services, and Python FastAPI services',
                    'Applied <strong>centralised Auth0 authentication</strong> as a single identity source across all frontend and backend services',
                    'Designed <strong>REST API layer in Node.js and FastAPI</strong> with OpenAPI-style contracts and polyglot persistence routing',
                    'Implemented <strong>multi-database strategy</strong>: MySQL for schema-constrained relational records, MongoDB for flexible content objects — each chosen for fit, not uniformity',
                ],
                metrics: [
                    { val: 'Polyglot', lbl: 'Node.js + FastAPI' },
                    { val: '2 DBs', lbl: 'MySQL + MongoDB' },
                    { val: 'Auth0', lbl: 'centralised auth' },
                    { val: 'Azure', lbl: 'cloud deploy' },
                    { val: 'Multi-frontend', lbl: 'client + admin' }
                ],
                archNodes: [
                    { label: 'Client frontend', cls: 'background:#E6F1FB;color:#0C447C' },
                    { label: 'Admin frontend', cls: 'background:#EEEDFE;color:#3C3489' },
                    { label: 'Node.js services', cls: 'background:#FAEEDA;color:#633806' },
                    { label: 'FastAPI services', cls: 'background:#E1F5EE;color:#085041' },
                    { label: 'MySQL + MongoDB', cls: 'background:#F1EFE8;color:#444441' }
                ],
                problem: 'Sri Lankan students have no centralised source for verified information on educational institutions, scholarships, and study programs - data is scattered across government portals and institution websites with no search or comparison capability.',
                decisions: [
                    { title: 'Polyglot persistence (MySQL + MongoDB)', why: 'Structured relational data (institutions, scholarships) maps cleanly to MySQL. Unstructured content (program descriptions, documents) benefits from MongoDB flexible schema - one database for both adds schema constraints where not needed.' },
                    { title: 'Separate client and admin frontends', why: 'Admin workflows (content management, verification) are fundamentally different from student browsing flows. Shared frontend creates routing complexity and risk of privileged UI components leaking to students.' }
                ],
                eval: [
                    { key: 'Architecture', val: 'Microservices with independent service deployment' },
                    { key: 'Auth', val: 'Centralised Auth0 - single identity source across services' },
                    { key: 'Deployment', val: 'Azure cloud with Docker containerisation' }
                ],
                links: ['GitHub'],
                gh: 'https://github.com/Thiwanka-Sandakalum/EduPath-LK',
                media: {
                    preview: 'assets/projects/EduPath-LK/screenshots/image.png',
                    arch: 'assets/projects/EduPath-LK/diagrams/diagram.png',
                    diagrams: [
                        { label: 'System Architecture', src: 'assets/projects/EduPath-LK/diagrams/diagram.png' }
                    ],
                    screenshots: [
                        { label: 'EduPath Platform', src: 'assets/projects/EduPath-LK/screenshots/image.png' }
                    ],
                    demo: null
                }
            }
        ];

        let activeFilter = 'all';
        let activeSearch = '';

        function renderArch(nodes, small = false) {
            const nodeStyle = small
                ? 'font-size:9px;padding:3px 6px;'
                : 'font-size:10px;padding:5px 9px;';

            return nodes.map((node, index) => `
                <div class="arch-node" style="${node.cls};${nodeStyle}border-radius:5px;">${node.label}</div>
                ${index < nodes.length - 1 ? '<span class="arch-arr">></span>' : ''}
            `).join('');
        }

        function renderCard(project) {
            const metrics = project.metrics.slice(0, 4).map(metric => `
                <div class="metric-pill">
                    <div class="metric-val">${metric.val}</div>
                    <div class="metric-lbl">${metric.lbl}</div>
                </div>
            `).join('');

            const techTags = project.tech.slice(0, 6).map(tech => `<span class="tech-tag">${tech}</span>`).join('');
            const hasPreview = project.media && project.media.preview;

            // Role pills
            const roleLabels = { 'ai-ml': 'AI / ML', fullstack: 'Full Stack', backend: 'Backend', cloud: 'Cloud', infra: 'Infra' };
            const rolePills = (project.roles || []).map(r => `<span class="card-role-pill">${roleLabels[r] || r}</span>`).join('');

            // Media indicator
            const m = project.media || {};
            const mediaCount = (m.screenshots ? m.screenshots.length : 0) + (m.diagrams ? m.diagrams.length : 0);
            const hasDemo = !!m.demo;
            const mediaIndicator = (mediaCount > 0 || hasDemo) ? `
                <div class="card-media-indicator">
                    ${mediaCount > 0 ? `<span class="cmi-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${mediaCount}</span>` : ''}
                    ${hasDemo ? `<span class="cmi-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Demo</span>` : ''}
                </div>
            ` : '';

            const bulletPreview = (project.bullets && project.bullets.length > 0) ? `
                <ul class="card-bullets">
                    ${project.bullets.slice(0, 2).map(b => `<li class="card-bullet">${b}</li>`).join('')}
                    ${project.bullets.length > 2 ? `<li class="card-bullet card-bullet--more">+${project.bullets.length - 2} more</li>` : ''}
                </ul>
            ` : '';

            const githubBtn = project.gh ? `<a class="card-gh-btn" href="${project.gh}" target="_blank" rel="noopener" aria-label="GitHub repository" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg></a>` : '';

            const visualBlock = hasPreview ? `
                <div class="arch-visual arch-visual--img">
                    ${project.hero ? `<div class="hero-badge ${project.heroCls}">${project.heroLabel}</div>` : ''}
                    ${mediaIndicator}
                    <img class="card-preview-img" src="${project.media.preview}" alt="${project.title} preview" loading="lazy">
                </div>
            ` : `
                <div class="arch-visual arch-visual--empty">
                    ${project.hero ? `<div class="hero-badge ${project.heroCls}">${project.heroLabel}</div>` : ''}
                    ${mediaIndicator}
                    <span class="arch-visual-label">${project.domainLabel}</span>
                </div>
            `;

            return `
                <article class="proj-card ${project.hero ? 'hero-card' : ''}" data-project-id="${project.id}">
                    ${visualBlock}
                    <div class="card-body">
                        <div class="card-header-row">
                            <h3 class="card-title">${project.title}</h3>
                            ${githubBtn}
                        </div>
                        <div class="card-meta-row">
                            <span class="domain-tag ${project.domainCls}">${project.domainLabel}</span>
                            <div class="card-roles">${rolePills}</div>
                        </div>
                        <p class="card-tagline">${project.tagline}</p>
                        ${bulletPreview}
                        <div class="metrics-row">${metrics}</div>
                        <div class="tech-row">${techTags}${project.tech.length > 6 ? `<span class="tech-tag tech-tag--more">+${project.tech.length - 6}</span>` : ''}</div>
                        <div class="expand-hint">View details ›</div>
                    </div>
                </article>
            `;
        }

        function renderGrid() {
            const query = activeSearch.toLowerCase();
            const filtered = projects.filter(project => {
                const matchFilter = activeFilter === 'all'
                    || (activeFilter === 'hero' && project.hero)
                    || (project.roles && project.roles.includes(activeFilter));

                const matchSearch = !query
                    || project.title.toLowerCase().includes(query)
                    || project.tagline.toLowerCase().includes(query)
                    || project.tech.join(' ').toLowerCase().includes(query)
                    || (project.roles && project.roles.join(' ').toLowerCase().includes(query));

                return matchFilter && matchSearch;
            });

            if (!filtered.length) {
                projectsGrid.innerHTML = '<div class="empty-state">No projects match this filter.</div>';
                return;
            }

            projectsGrid.innerHTML = filtered.map(renderCard).join('');
        }

        // Lightbox state
        let lightboxImages = [];
        let lightboxIndex = 0;

        function openLightbox(images, startIndex) {
            lightboxImages = images;
            lightboxIndex = startIndex;
            const lb = document.getElementById('media-lightbox');
            const img = document.getElementById('media-lightbox-img');
            const caption = document.getElementById('media-lightbox-caption');
            if (!lb || !img) return;
            img.src = lightboxImages[lightboxIndex].src;
            img.alt = lightboxImages[lightboxIndex].label || '';
            if (caption) caption.textContent = lightboxImages[lightboxIndex].label || '';
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
            updateLightboxArrows();
        }

        function closeLightbox() {
            const lb = document.getElementById('media-lightbox');
            if (lb) lb.classList.remove('open');
            document.body.style.overflow = '';
        }

        function updateLightboxArrows() {
            const prev = document.getElementById('lb-prev');
            const next = document.getElementById('lb-next');
            if (prev) prev.style.display = lightboxImages.length > 1 ? '' : 'none';
            if (next) next.style.display = lightboxImages.length > 1 ? '' : 'none';
        }

        function openModal(projectId) {
            const project = projects.find(item => item.id === projectId);
            if (!project) return;

            const m = project.media || {};
            const hasArch = !!m.arch;
            const hasDiagrams = m.diagrams && m.diagrams.length > 0;
            const hasScreenshots = m.screenshots && m.screenshots.length > 0;
            const hasDemo = !!m.demo;

            // Build tab definitions — only tabs with media content
            const tabs = [];
            if (hasArch) tabs.push({ id: 'architecture', label: 'Architecture' });
            if (hasDiagrams) tabs.push({ id: 'diagrams', label: 'Diagrams' });
            if (hasScreenshots) tabs.push({ id: 'screenshots', label: `Screenshots (${m.screenshots.length})` });
            if (hasDemo) tabs.push({ id: 'demo', label: 'Demo' });

            const tabBar = tabs.map((tab, i) =>
                `<button class="media-tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.id}" type="button">${tab.label}</button>`
            ).join('');

            const archPanel = hasArch ? `
                <div class="media-tab-panel ${tabs[0].id === 'architecture' ? 'active' : ''}" data-panel="architecture">
                    <img class="media-img-arch lb-trigger" src="${m.arch}" alt="${project.title} architecture diagram" loading="lazy" data-lb-src="${m.arch}" data-lb-label="Architecture diagram">
                </div>` : '';

            const diagramsPanel = hasDiagrams ? `
                <div class="media-tab-panel ${tabs[0].id === 'diagrams' ? 'active' : ''}" data-panel="diagrams">
                    ${m.diagrams.map(d => `<div class="media-diagram-item">
                        <p class="media-diagram-label">${d.label}</p>
                        <img class="media-img-arch lb-trigger" src="${d.src}" alt="${d.label}" loading="lazy" data-lb-src="${d.src}" data-lb-label="${d.label}">
                    </div>`).join('')}
                </div>` : '';

            const screenshotsPanel = hasScreenshots ? `
                <div class="media-tab-panel ${tabs[0].id === 'screenshots' ? 'active' : ''}" data-panel="screenshots">
                    <div class="screenshot-gallery">
                        ${m.screenshots.map((s, i) => `
                            <div class="screenshot-item lb-trigger" data-lb-src="${s.src}" data-lb-label="${s.label}" data-lb-index="${i}">
                                <img class="screenshot-thumb" src="${s.src}" alt="${s.label}" loading="lazy">
                                <span class="screenshot-label">${s.label}</span>
                            </div>`).join('')}
                    </div>
                </div>` : '';

            const demoPanel = hasDemo ? `
                <div class="media-tab-panel ${tabs[0].id === 'demo' ? 'active' : ''}" data-panel="demo">
                    <div class="media-demo-wrap">
                        <img class="media-demo" src="${m.demo}" alt="${project.title} demo" loading="lazy">
                    </div>
                </div>` : '';

            if (tabs.length > 0) {
                modalArch.innerHTML = `
                    <div class="modal-media-tabs">
                        <div class="media-tab-bar">${tabBar}</div>
                        <div class="media-tab-content">
                            ${archPanel}${diagramsPanel}${screenshotsPanel}${demoPanel}
                        </div>
                    </div>`;
            } else {
                modalArch.innerHTML = '';
            }

            // Tab switching
            modalArch.querySelectorAll('.media-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    modalArch.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
                    modalArch.querySelectorAll('.media-tab-panel').forEach(p => p.classList.remove('active'));
                    btn.classList.add('active');
                    const panel = modalArch.querySelector(`[data-panel="${btn.dataset.tab}"]`);
                    if (panel) panel.classList.add('active');
                });
            });

            // Lightbox triggers in arch panel / diagrams
            const archLbImages = [];
            if (hasArch) archLbImages.push({ src: m.arch, label: 'Architecture diagram' });
            if (hasDiagrams) m.diagrams.forEach(d => archLbImages.push({ src: d.src, label: d.label }));

            modalArch.querySelectorAll('.media-img-arch.lb-trigger').forEach(img => {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    const idx = archLbImages.findIndex(x => x.src === img.dataset.lbSrc);
                    openLightbox(archLbImages, idx >= 0 ? idx : 0);
                });
            });

            // Lightbox triggers in screenshots panel
            if (hasScreenshots) {
                modalArch.querySelectorAll('.screenshot-item.lb-trigger').forEach(item => {
                    item.addEventListener('click', () => {
                        const idx = parseInt(item.dataset.lbIndex, 10) || 0;
                        openLightbox(m.screenshots, idx);
                    });
                });
            }

            // Modal body
            const metrics = project.metrics.map(metric => `
                <div class="m-metric">
                    <div class="m-metric-val">${metric.val}</div>
                    <div class="m-metric-lbl">${metric.lbl}</div>
                </div>
            `).join('');

            const techTags = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

            const bulletsSection = (project.bullets && project.bullets.length > 0) ? `
                <div class="m-section" style="margin-top:1rem">
                    <div class="m-label">What I built</div>
                    <ul class="modal-bullets">
                        ${project.bullets.map(b => `<li class="modal-bullet">${b}</li>`).join('')}
                    </ul>
                </div>
            ` : '';

            const decisions = project.decisions.map(decision => `
                <div class="decision">
                    <strong>${decision.title}</strong><br>
                    ${decision.why}
                </div>
            `).join('');

            const evalItems = project.eval.map(item => `
                <div class="eval-row">
                    <div class="eval-key">${item.key}</div>
                    <div class="eval-val">${item.val}</div>
                </div>
            `).join('');

            const linkButtons = project.links.map((label, index) => {
                const isGithub = label === 'GitHub' && project.gh;
                if (isGithub) {
                    return `<a class="m-btn ${index === 0 ? 'primary' : ''}" href="${project.gh}" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> ${label}</a>`;
                }
                return `<button class="m-btn ${index === 0 ? 'primary' : ''}" type="button" disabled aria-disabled="true" title="Coming soon">${label}</button>`;
            }).join('');

            // Role pills for modal
            const modalRolePills = (project.roles || []).map(r => {
                const roleLabels = { 'ai-ml': 'AI / ML', fullstack: 'Full Stack', backend: 'Backend', cloud: 'Cloud', infra: 'Infra' };
                return `<span class="card-role-pill">${roleLabels[r] || r}</span>`;
            }).join('');

            modalBody.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
                    <h3 class="modal-title" id="projects-modal-title">${project.title}</h3>
                    <span class="domain-tag ${project.domainCls}">${project.domainLabel}</span>
                </div>
                ${modalRolePills ? `<div class="modal-roles" style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.7rem">${modalRolePills}</div>` : ''}
                <p class="modal-tagline">${project.tagline}</p>
                <div class="m-section">
                    <div class="m-label">Key metrics</div>
                    <div class="m-metrics">${metrics}</div>
                </div>
                <div class="m-section">
                    <div class="m-label">Tech stack</div>
                    <div class="tech-row" style="margin-bottom:0">${techTags}</div>
                </div>
                ${bulletsSection}
                <div class="m-section" style="margin-top:1rem">
                    <div class="m-label">Problem solved</div>
                    <div style="font-size:0.88rem;color:var(--color-text-secondary);line-height:1.7">${project.problem}</div>
                </div>
                <div class="m-section" style="margin-top:1rem">
                    <div class="m-label">Engineering decisions</div>
                    ${decisions}
                </div>
                <div class="m-section" style="margin-top:1rem">
                    <div class="m-label">Evaluation approach</div>
                    <div class="eval-table">${evalItems}</div>
                </div>
                <div class="modal-links">${linkButtons}</div>
            `;

            modalOverlay.classList.add('open');
            modalOverlay.setAttribute('aria-hidden', 'false');
        }

        function closeModal() {
            modalOverlay.classList.remove('open');
            modalOverlay.setAttribute('aria-hidden', 'true');
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                activeFilter = button.dataset.filter || 'all';
                filterButtons.forEach(item => item.classList.remove('active'));
                button.classList.add('active');
                renderGrid();
            });
        });

        searchInput.addEventListener('input', (event) => {
            activeSearch = event.target.value || '';
            renderGrid();
        });

        projectsGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.proj-card');
            if (!card) {
                return;
            }
            const projectId = card.dataset.projectId;
            openModal(projectId);
        });

        modalBody.addEventListener('click', (event) => {
            const linkButton = event.target.closest('button[data-link]');
            if (!linkButton) {
                return;
            }
            const link = linkButton.dataset.link;
            if (link) {
                window.open(link, '_blank', 'noopener');
            }
        });

        closeButton.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const lb = document.getElementById('media-lightbox');
                if (lb && lb.classList.contains('open')) {
                    closeLightbox();
                    return;
                }
                if (modalOverlay.classList.contains('open')) {
                    closeModal();
                }
            }
            if (event.key === 'ArrowRight') {
                const lb = document.getElementById('media-lightbox');
                if (lb && lb.classList.contains('open') && lightboxImages.length > 1) {
                    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
                    document.getElementById('media-lightbox-img').src = lightboxImages[lightboxIndex].src;
                    const cap = document.getElementById('media-lightbox-caption');
                    if (cap) cap.textContent = lightboxImages[lightboxIndex].label || '';
                }
            }
            if (event.key === 'ArrowLeft') {
                const lb = document.getElementById('media-lightbox');
                if (lb && lb.classList.contains('open') && lightboxImages.length > 1) {
                    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                    document.getElementById('media-lightbox-img').src = lightboxImages[lightboxIndex].src;
                    const cap = document.getElementById('media-lightbox-caption');
                    if (cap) cap.textContent = lightboxImages[lightboxIndex].label || '';
                }
            }
        });

        // Lightbox global controls
        const lbEl = document.getElementById('media-lightbox');
        const lbClose = document.getElementById('media-lightbox-close');
        const lbPrev = document.getElementById('lb-prev');
        const lbNext = document.getElementById('lb-next');

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbEl) {
            lbEl.addEventListener('click', (e) => {
                if (e.target === lbEl) closeLightbox();
            });
        }
        if (lbPrev) {
            lbPrev.addEventListener('click', () => {
                if (lightboxImages.length > 1) {
                    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                    document.getElementById('media-lightbox-img').src = lightboxImages[lightboxIndex].src;
                    const cap = document.getElementById('media-lightbox-caption');
                    if (cap) cap.textContent = lightboxImages[lightboxIndex].label || '';
                }
            });
        }
        if (lbNext) {
            lbNext.addEventListener('click', () => {
                if (lightboxImages.length > 1) {
                    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
                    document.getElementById('media-lightbox-img').src = lightboxImages[lightboxIndex].src;
                    const cap = document.getElementById('media-lightbox-caption');
                    if (cap) cap.textContent = lightboxImages[lightboxIndex].label || '';
                }
            });
        }

        renderGrid();
    }

    setupProjectsShowcase();

    // --- Initialize Feather Icons ---
    // Wait for feather library to load, then initialize
    function initFeatherIcons() {
        if (window.feather) {
            feather.replace();
            console.log('Feather icons initialized');
        } else {
            // Retry after a short delay if not loaded yet
            setTimeout(initFeatherIcons, 50);
        }
    }

    initFeatherIcons();
});