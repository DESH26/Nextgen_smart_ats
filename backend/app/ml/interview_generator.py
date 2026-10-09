from typing import List, Dict, Any, Optional
from app.nlp.skill_taxonomy import normalize_skill

TECHNICAL_QUESTION_BANK: Dict[str, List[Dict[str, Any]]] = {
    "Python": [
        {
            "question": "How does Python manage memory internally, and what is the exact role and implication of the Global Interpreter Lock (GIL)?",
            "difficulty": "Medium",
            "domain": "Backend & Core Engineering",
            "suggested_answer_points": [
                "Python uses reference counting as its primary memory management mechanism along with a cyclic garbage collector to detect and break reference cycles.",
                "The GIL is a mutex in CPython that ensures only one native thread executes Python bytecode at a time, protecting memory integrity.",
                "For CPU-bound tasks, developers bypass GIL limitations using multiprocessing or C-extensions (NumPy/Cython); for I/O-bound tasks, asyncio and threading provide high concurrency."
            ]
        },
        {
            "question": "Explain the mechanics and practical trade-offs between Python Generators (`yield`), Iterators, and Decorators.",
            "difficulty": "Medium",
            "domain": "Backend & Core Engineering",
            "suggested_answer_points": [
                "Decorators: Higher-order functions modifying another function's behavior (used for logging, auth checks, rate limiting, and caching).",
                "Generators: Functions utilizing `yield` that maintain state between invocations, producing elements lazily to conserve RAM during massive file or stream processing.",
                "Iterators: Objects implementing the iterator protocol (`__iter__()` and `__next__()`)."
            ]
        },
        {
            "question": "How do Python dataclasses, Pydantic BaseModel, and standard dictionaries differ in performance, data validation, and serialization?",
            "difficulty": "Hard",
            "domain": "Backend & Core Engineering",
            "suggested_answer_points": [
                "Standard dicts have zero validation overhead but lack type safety and IDE autocomplete.",
                "Dataclasses provide boilerplate-free structured classes with type annotations but do not perform automatic runtime type coercion or validation.",
                "Pydantic BaseModels perform comprehensive runtime type parsing, schema generation (JSON Schema / OpenAPI), and sanitization (optimized in Rust in Pydantic v2)."
            ]
        }
    ],
    "Machine Learning": [
        {
            "question": "How do you detect and handle overfitting in complex machine learning models, and how do L1 and L2 regularization differ mathematically and practically?",
            "difficulty": "Medium",
            "domain": "Machine Learning & AI",
            "suggested_answer_points": [
                "Detection: Substantial discrepancy between training accuracy/loss and validation/test performance (low bias, high variance).",
                "L1 Regularization (Lasso): Adds penalty proportional to absolute weights (|w|), driving irrelevant feature weights to exactly 0 (performing automatic feature selection).",
                "L2 Regularization (Ridge): Adds penalty proportional to squared weights (w^2), shrinking weights toward zero without setting them strictly to zero (handling multicollinearity).",
                "Other techniques: Cross-validation, dropout in neural nets, tree pruning, early stopping, and data augmentation."
            ]
        },
        {
            "question": "Explain the trade-offs between Precision, Recall, F1-Score, and ROC-AUC when evaluating models on highly imbalanced datasets.",
            "difficulty": "Hard",
            "domain": "Machine Learning & AI",
            "suggested_answer_points": [
                "Precision = TP / (TP + FP): Critical when False Positives are expensive (e.g. spam detection, loan approvals).",
                "Recall = TP / (TP + FN): Critical when False Negatives carry dangerous consequences (e.g. medical diagnosis, fraud detection).",
                "F1-Score: Harmonic mean of precision and recall; handles skewed classes where simple accuracy is misleading.",
                "PR-AUC is generally superior to ROC-AUC for extreme class imbalance because ROC-AUC can remain overly optimistic due to a large number of True Negatives."
            ]
        },
        {
            "question": "How do ensemble learning techniques like Random Forests (Bagging) and XGBoost / LightGBM (Boosting) differ in bias-variance reduction?",
            "difficulty": "Hard",
            "domain": "Machine Learning & AI",
            "suggested_answer_points": [
                "Bagging (Random Forest): Trains independent trees in parallel on bootstrap samples; primarily reduces variance of high-variance decision trees.",
                "Boosting (Gradient Boosting / XGBoost): Trains decision trees sequentially, where each new tree models the pseudo-residuals / gradients of previous trees; primarily reduces bias and optimizes complex loss functions.",
                "LightGBM optimizes training speed through histogram-based feature binning and Leaf-wise (best-first) tree growth."
            ]
        }
    ],
    "Natural Language Processing": [
        {
            "question": "How does Sentence-BERT (SBERT) differ structurally and computationally from vanilla BERT when computing semantic similarity between pairs of documents?",
            "difficulty": "Hard",
            "domain": "NLP & Transformers",
            "suggested_answer_points": [
                "Standard BERT cross-encoders require feeding pairs of texts simultaneously (e.g. `[CLS] Text A [SEP] Text B`), causing quadratic O(n^2) computational overhead for search and ranking.",
                "Sentence-BERT utilizes Siamese and Triplet network architectures to produce fixed-sized dense vector representations (e.g., 384 or 768 dimensions) via mean/CLS pooling.",
                "Pre-computed embeddings enable finding the most similar documents among millions in milliseconds using vector indexing libraries and Cosine Similarity."
            ]
        },
        {
            "question": "Explain how the Self-Attention mechanism in Transformers works and why scaled dot-product attention divides by the square root of key dimension (sqrt(d_k)).",
            "difficulty": "Hard",
            "domain": "NLP & Transformers",
            "suggested_answer_points": [
                "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.",
                "Queries and Keys compute pairwise relevance scores across all tokens in the sequence simultaneously, eliminating recurrent sequential bottlenecks of RNNs/LSTMs.",
                "Division by sqrt(d_k) stabilizes gradients by preventing dot products from growing excessively large for large dimensions, which would otherwise push softmax into regions with extremely small gradients."
            ]
        },
        {
            "question": "What is the difference between Named Entity Recognition (NER) using rule-based/dictionary matchers vs deep learning transformer-based token classifiers (like RoBERTa or spaCy)?",
            "difficulty": "Medium",
            "domain": "NLP & Transformers",
            "suggested_answer_points": [
                "Rule-based matchers (spaCy EntityRuler / Regex) provide deterministic, fast extraction for structured identifiers (emails, phone numbers, known skill taxonomy keywords).",
                "Transformer token classifiers (BIO tagging with BERT) understand contextual semantics and ambiguous entity boundaries (e.g. distinguishing 'Apple' the company from the fruit based on surroundings).",
                "Hybrid ATS pipelines combine dictionary matching for exact skill vocabularies with contextual embeddings for fuzzy semantic matching."
            ]
        }
    ],
    "FastAPI": [
        {
            "question": "How does FastAPI achieve high throughput using Python's `asyncio` event loop and Starlette ASGI, and how should blocking CPU/database tasks be handled?",
            "difficulty": "Medium",
            "domain": "Backend & APIs",
            "suggested_answer_points": [
                "FastAPI runs on ASGI servers (Uvicorn) handling asynchronous network I/O concurrently on a single thread event loop.",
                "Endpoints defined with `def` (synchronous) are automatically executed inside an external thread pool by FastAPI to prevent blocking the main event loop.",
                "Endpoints defined with `async def` run on the event loop directly; any blocking synchronous code (like heavy ML inference or sync DB drivers) inside `async def` will freeze the server and must be offloaded with `asyncio.to_thread` or background task queues (Celery/RQ)."
            ]
        },
        {
            "question": "Explain FastAPI Dependency Injection (`Depends`) and how it facilitates database session management, authentication, and testing.",
            "difficulty": "Medium",
            "domain": "Backend & APIs",
            "suggested_answer_points": [
                "`Depends` resolves hierarchical dependency graphs per-request without global mutable state.",
                "Yield-based dependencies ensure clean teardown (e.g. `db = SessionLocal(); try: yield db; finally: db.close()`).",
                "Allows seamless dependency overriding during PyTest integration tests (`app.dependency_overrides[get_db] = override_get_db`)."
            ]
        }
    ],
    "React": [
        {
            "question": "Explain the React Component Lifecycle with Hooks: how do `useEffect`, `useCallback`, and `useMemo` prevent unnecessary re-renders?",
            "difficulty": "Medium",
            "domain": "Frontend & Full-Stack",
            "suggested_answer_points": [
                "`useEffect` handles side-effects (fetching data, subscriptions) after rendering, triggered when dependency array values change.",
                "`useMemo` caches the calculated result of expensive computations between renders.",
                "`useCallback` caches function definitions across renders to maintain referential equality when passing callbacks to memoized child components (`React.memo`)."
            ]
        },
        {
            "question": "What is the Virtual DOM, how does React's Reconciliation Algorithm (Fiber) operate, and why are unique `key` props necessary for list elements?",
            "difficulty": "Medium",
            "domain": "Frontend & Full-Stack",
            "suggested_answer_points": [
                "Virtual DOM is an in-memory representation of real DOM nodes. React calculates the minimal set of real DOM mutations via diffing.",
                "React Fiber allows pausing, aborting, and prioritizing render work into incremental chunks for responsive 60fps UIs.",
                "Unique `key` props give elements a persistent identity across renders, allowing React to match items in list insertions, deletions, and reorders without rebuilding the entire sub-tree."
            ]
        }
    ],
    "TypeScript": [
        {
            "question": "What are Generics, Utility Types (`Partial`, `Pick`, `Omit`, `Record`), and Type Narrowing in TypeScript?",
            "difficulty": "Medium",
            "domain": "Frontend & Full-Stack",
            "suggested_answer_points": [
                "Generics allow writing reusable, type-safe functions and components with parameterized types (e.g. `ApiResponse<T>`).",
                "`Partial<T>` makes all keys optional, `Pick<T, K>` selects specific keys, `Omit<T, K>` excludes keys, and `Record<K, V>` constructs typed key-value maps.",
                "Type Narrowing uses type guards (`typeof`, `instanceof`, `in`, or custom discrimination `x is MyType`) to refine broader union types into specific subtypes inside conditional blocks."
            ]
        }
    ],
    "Docker": [
        {
            "question": "How do multi-stage Docker builds improve container security, performance, and final image size?",
            "difficulty": "Medium",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "Multi-stage builds utilize separate `FROM` instructions in a single Dockerfile (e.g. `FROM node:20 AS builder` and `FROM node:20-alpine AS runner`).",
                "Compilation tools, devDependencies, and build caches stay in build stages; only necessary runtime artifacts are copied to the production image.",
                "Dramatically reduces container image size (e.g. 1GB -> 80MB) and eliminates attack vectors by excluding package managers and build compilers from production."
            ]
        },
        {
            "question": "Explain Docker container networking modes (Bridge, Host, Overlay, None) and how Docker Compose manages service discovery.",
            "difficulty": "Medium",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "Bridge: Default isolated virtual network where containers communicate via container IP or internal DNS names.",
                "Host: Attaches container directly to host network interface without port mapping overhead.",
                "Docker Compose automatically creates a shared user-defined bridge network where containers resolve each other using service names (e.g. `http://backend:8000`)."
            ]
        }
    ],
    "Kubernetes": [
        {
            "question": "What is the architectural difference between Kubernetes Pods, Deployments, ReplicaSets, and Services (ClusterIP vs NodePort vs LoadBalancer)?",
            "difficulty": "Hard",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "Pod: Smallest deployable atomic unit holding one or more co-located containers sharing localhost networking and volumes.",
                "Deployment: Declaratively manages ReplicaSets, enabling zero-downtime rolling updates, canary releases, and automatic rollbacks.",
                "ClusterIP: Default internal-only virtual IP for intra-cluster service-to-service communication.",
                "NodePort: Exposes service on a static port on each cluster node's external IP.",
                "LoadBalancer: Provisions a cloud provider external load balancer (AWS NLB/ALB, GCP LB) routing traffic to NodePorts."
            ]
        },
        {
            "question": "How do Kubernetes Liveness and Readiness probes differ, and what happens if a probe fails repeatedly?",
            "difficulty": "Medium",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "Readiness Probe: Determines if the Pod is ready to accept user traffic. If it fails, Kubernetes removes the Pod from Service endpoints (no traffic sent), but does not restart the container.",
                "Liveness Probe: Determines if the container process is alive and healthy. If it fails, kubelet kills the container and restarts it according to the restartPolicy.",
                "Crucial for preventing 502 bad gateway errors while applications are warming up caches or database connections."
            ]
        }
    ],
    "AWS": [
        {
            "question": "Compare AWS compute options: EC2 Virtual Machines, ECS / EKS Containers, and AWS Lambda Serverless for scalable web applications.",
            "difficulty": "Medium",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "EC2: Full OS control, persistent compute, suited for legacy or monolithic architectures; requires manual provisioning and OS patching.",
                "ECS / EKS: Container orchestration (Docker/Kubernetes); ideal for microservices with predictable workloads, autoscaling, and fast deployments.",
                "AWS Lambda: Event-driven serverless compute; scales automatically from 0 to thousands of concurrent executions with pay-per-millisecond pricing; susceptible to cold start latency and execution duration limits."
            ]
        },
        {
            "question": "How do you design a secure, highly available VPC architecture on AWS spanning multiple Availability Zones?",
            "difficulty": "Hard",
            "domain": "Cloud & DevOps",
            "suggested_answer_points": [
                "Deploy resources across at least 2 Availability Zones for fault tolerance.",
                "Public Subnets: Host Application Load Balancers (ALB) and NAT Gateways with Internet Gateway route tables.",
                "Private Subnets: Host application backend servers and container tasks without public IP addresses, routing outbound internet traffic via NAT Gateways.",
                "Isolated Database Subnets: Host RDS / Aurora databases with no internet access; security groups restrict inbound access strictly to backend security groups on port 5432."
            ]
        }
    ],
    "SQL": [
        {
            "question": "Explain SQL Window Functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`) and compare them with `GROUP BY` aggregations.",
            "difficulty": "Medium",
            "domain": "Database & Data Engineering",
            "suggested_answer_points": [
                "`GROUP BY` reduces multiple rows into a single summary row per group.",
                "Window functions compute values across sets of rows (`OVER (PARTITION BY ... ORDER BY ...)`) while preserving original row identities.",
                "`ROW_NUMBER()` generates unique sequential integers; `RANK()` assigns identical ranks to ties and skips subsequent numbers; `DENSE_RANK()` does not skip numbers.",
                "`LEAD()` and `LAG()` access data from subsequent or preceding rows without complex self-joins."
            ]
        },
        {
            "question": "How do B-tree Indexes work in relational databases like PostgreSQL, and what causes queries to perform Full Table Scans instead of Index Scans?",
            "difficulty": "Hard",
            "domain": "Database & Data Engineering",
            "suggested_answer_points": [
                "B-tree indexes maintain a balanced tree of sorted keys and tuple pointers (CTID), enabling O(log n) lookups, range scans, and sort operations.",
                "Full Table Scans occur when: no index exists on the filter column; functions are applied to indexed columns (`WHERE LOWER(name) = '...'` without functional index); wildcard leads search (`WHERE col LIKE '%term'`); or cost planner estimates table is small enough that sequential disk read is faster than random index lookups."
            ]
        }
    ],
    "System Design": [
        {
            "question": "How do you design a highly scalable, real-time Applicant Tracking System capable of parsing thousands of resumes per minute and indexing them for instant semantic search?",
            "difficulty": "Hard",
            "domain": "System Design & Architecture",
            "suggested_answer_points": [
                "Ingestion & Storage: Upload resume files directly to AWS S3 using presigned URLs to offload web servers.",
                "Asynchronous Processing Queue: S3 event triggers Kafka or Celery/Redis queue; worker nodes extract text using PyMuPDF and run NER pipelines concurrently.",
                "Embedding Generation & Vector Database: Workers batch document texts into Sentence-BERT models (GPU-accelerated) and store dense vectors in Milvus, Qdrant, or pgvector.",
                "Caching & Fast Querying: Store pre-ranked candidate lists in Redis with TTL; invalidate cache when candidate applies or job requirements update."
            ]
        },
        {
            "question": "Explain the CAP Theorem, PACELC Theorem, and Cache Invalidation strategies (Write-Through, Write-Back, Cache-Aside).",
            "difficulty": "Hard",
            "domain": "System Design & Architecture",
            "suggested_answer_points": [
                "CAP Theorem states that in the presence of a Network Partition (P), a distributed system must choose between Consistency (C) and Availability (A).",
                "Cache-Aside (Lazy Loading): Application queries cache first; on cache miss, reads from DB and writes to cache. Simple but initial miss latency.",
                "Write-Through: Application writes data to cache and database synchronously; ensures data consistency but adds write latency.",
                "Write-Back (Write-Behind): Application writes to cache immediately; cache asynchronously writes batches to DB (high throughput, risk of data loss on crash)."
            ]
        }
    ]
}

BEHAVIORAL_QUESTIONS: List[Dict[str, Any]] = [
    {
        "question": "Describe a scenario where you had a significant technical disagreement with a team member regarding system architecture or tool selection. How did you resolve it collaboratively?",
        "category": "behavioral",
        "domain": "Collaboration & Leadership",
        "skill_focus": "Conflict Resolution & Architectural Decision-Making",
        "difficulty": "Medium",
        "suggested_answer_points": [
            "Situation & Task: Clearly describe the architectural problem, the two conflicting perspectives, and what was at stake.",
            "Action: Avoided emotional debates by establishing an objective benchmark matrix (evaluating latency, developer velocity, maintenance overhead, and operational cost). Set up a short spike or POC.",
            "Result: Reached a data-driven consensus with team alignment, delivering the project milestone on schedule without tech debt."
        ]
    },
    {
        "question": "Tell me about a critical production incident or system outage you encountered. How did you troubleshoot, isolate the root cause, and remediate the issue under pressure?",
        "category": "behavioral",
        "domain": "Problem Solving & Incident Response",
        "skill_focus": "Debugging Under Pressure & System Reliability",
        "difficulty": "Hard",
        "suggested_answer_points": [
            "Situation: Briefly describe the outage scope, user impact, and monitoring alerts triggered.",
            "Action: Followed structured incident response protocol—acknowledged incident, checked APM metrics and centralized logs, rolled back recent faulty release to restore SLA, and isolated root cause in staging.",
            "Result: Restored 100% uptime within target MTTR, conducted a blameless post-mortem, and implemented automated regression tests and alerting thresholds."
        ]
    },
    {
        "question": "How do you manage competing deadlines and technical debt when product managers request new feature delivery under tight timeframes?",
        "category": "behavioral",
        "domain": "Project Management & Ownership",
        "skill_focus": "Prioritization, Scope Negotiation & Tech Debt",
        "difficulty": "Medium",
        "suggested_answer_points": [
            "Used impact vs urgency evaluation (Eisenhower matrix) to prioritize core user value.",
            "Proactively communicated technical trade-offs to stakeholders, breaking complex epics into iterative MVP releases.",
            "Allocated dedicated sprint buffer (e.g. 15-20%) for refactoring and test automation to maintain long-term codebase health."
        ]
    },
    {
        "question": "Give an example of how you mentored a junior engineer or brought a new team member up to speed on a complex codebase.",
        "category": "behavioral",
        "domain": "Mentorship & Team Growth",
        "skill_focus": "Knowledge Sharing & Empathy",
        "difficulty": "Medium",
        "suggested_answer_points": [
            "Created comprehensive onboarding architecture documentation and runnable Docker environments.",
            "Engaged in paired programming and constructive, empathetic pull request code reviews focusing on 'why' rather than just 'what'.",
            "Empowered the junior engineer to own an independent feature, boosting their confidence and team velocity."
        ]
    }
]

# Role-specific curated templates
JOB_ROLE_QUESTION_SETS: Dict[str, List[str]] = {
    "Machine Learning Engineer": ["Machine Learning", "Natural Language Processing", "Python", "Docker", "System Design"],
    "NLP Engineer": ["Natural Language Processing", "Machine Learning", "Python", "System Design"],
    "Full-Stack Developer": ["React", "TypeScript", "FastAPI", "Python", "SQL", "Docker"],
    "Backend Developer": ["Python", "FastAPI", "SQL", "Docker", "System Design"],
    "Cloud & DevOps Engineer": ["Docker", "Kubernetes", "AWS", "System Design", "Python"],
    "Data Analyst / Data Scientist": ["SQL", "Machine Learning", "Python"]
}

class InterviewGenerator:
    """
    Generates context-aware technical questions, behavioral questions,
    and targeted skill-gap assessment questions with model answer pointers.
    """
    def generate_questions(
        self,
        job_title: str,
        candidate_skills: List[str],
        missing_skills: List[str],
        weak_skills: List[str]
    ) -> List[Dict[str, Any]]:
        generated: List[Dict[str, Any]] = []
        seen_questions = set()
        
        # 1. Targeted Skill-Gap Questions (Priority Assessment)
        gap_skills = weak_skills + missing_skills
        for skill in gap_skills[:4]:
            norm = normalize_skill(skill)
            if norm in TECHNICAL_QUESTION_BANK:
                for q in TECHNICAL_QUESTION_BANK[norm]:
                    if q["question"] not in seen_questions:
                        seen_questions.add(q["question"])
                        generated.append({
                            "question": q["question"],
                            "category": "skill_gap",
                            "domain": q.get("domain", "Skill Gap Assessment"),
                            "skill_focus": norm,
                            "difficulty": q["difficulty"],
                            "suggested_answer_points": q["suggested_answer_points"],
                            "is_custom": False
                        })
                        break
            else:
                q_text = f"Given your foundational background, how would you approach learning and implementing {norm} in a scalable production setting?"
                if q_text not in seen_questions:
                    seen_questions.add(q_text)
                    generated.append({
                        "question": q_text,
                        "category": "skill_gap",
                        "domain": "Skill Gap Assessment",
                        "skill_focus": norm,
                        "difficulty": "Medium",
                        "suggested_answer_points": [
                            f"Demonstrates grasp of core {norm} architectural principles and lifecycle.",
                            "Explains how past experience with similar tools accelerates adoption.",
                            "Identifies key security, performance benchmarking, and testing considerations."
                        ],
                        "is_custom": False
                    })
                
        # 2. Technical Questions matching Candidate Strengths
        for skill in candidate_skills[:4]:
            norm = normalize_skill(skill)
            if norm in TECHNICAL_QUESTION_BANK:
                for q in TECHNICAL_QUESTION_BANK[norm]:
                    if q["question"] not in seen_questions:
                        seen_questions.add(q["question"])
                        generated.append({
                            "question": q["question"],
                            "category": "technical",
                            "domain": q.get("domain", "Technical Core"),
                            "skill_focus": norm,
                            "difficulty": q["difficulty"],
                            "suggested_answer_points": q["suggested_answer_points"],
                            "is_custom": False
                        })
                        break
                        
        # 3. Add Job Title / Role-Specific Relevant Questions
        for role_key, skill_keys in JOB_ROLE_QUESTION_SETS.items():
            if any(term in job_title.lower() for term in role_key.lower().split()):
                for sk in skill_keys:
                    norm = normalize_skill(sk)
                    if norm in TECHNICAL_QUESTION_BANK:
                        for q in TECHNICAL_QUESTION_BANK[norm]:
                            if q["question"] not in seen_questions and len(generated) < 10:
                                seen_questions.add(q["question"])
                                generated.append({
                                    "question": q["question"],
                                    "category": "technical",
                                    "domain": q.get("domain", "Role Specific"),
                                    "skill_focus": norm,
                                    "difficulty": q["difficulty"],
                                    "suggested_answer_points": q["suggested_answer_points"],
                                    "is_custom": False
                                })
                break

        # 4. Add Core Behavioral Questions
        for bq in BEHAVIORAL_QUESTIONS[:2]:
            if bq["question"] not in seen_questions:
                seen_questions.add(bq["question"])
                generated.append({
                    "question": bq["question"],
                    "category": bq["category"],
                    "domain": bq.get("domain", "Behavioral Competency"),
                    "skill_focus": bq["skill_focus"],
                    "difficulty": bq["difficulty"],
                    "suggested_answer_points": bq["suggested_answer_points"],
                    "is_custom": False
                })
            
        return generated

    def get_full_catalog(self) -> List[Dict[str, Any]]:
        """Returns the complete question bank across all domains."""
        catalog = []
        q_id = 1
        for skill, q_list in TECHNICAL_QUESTION_BANK.items():
            for q in q_list:
                catalog.append({
                    "id": q_id,
                    "question": q["question"],
                    "category": "Technical",
                    "domain": q.get("domain", "Technical"),
                    "skill_focus": skill,
                    "difficulty": q["difficulty"],
                    "suggested_answer_points": q["suggested_answer_points"]
                })
                q_id += 1
                
        for bq in BEHAVIORAL_QUESTIONS:
            catalog.append({
                "id": q_id,
                "question": bq["question"],
                "category": "Behavioral",
                "domain": bq.get("domain", "Behavioral (STAR Method)"),
                "skill_focus": bq["skill_focus"],
                "difficulty": bq["difficulty"],
                "suggested_answer_points": bq["suggested_answer_points"]
            })
            q_id += 1
            
        return catalog

interview_generator = InterviewGenerator()
