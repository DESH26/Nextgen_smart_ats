from typing import List, Dict, Any, Optional
from app.nlp.skill_taxonomy import normalize_skill

# Structured Catalog of Verified High-Quality Learning Resources
RESOURCE_DATABASE: Dict[str, List[Dict[str, Any]]] = {
    "Python": [
        {
            "title": "Python for Everybody Specialization",
            "provider": "Coursera / University of Michigan",
            "url": "https://www.coursera.org/specializations/python",
            "resource_type": "Course",
            "difficulty": "Beginner",
            "description": "Learn to Program and Analyze Data with Python. Covers foundational syntax, data structures, and web data scraping.",
            "estimated_hours": 30
        },
        {
            "title": "Official Python Documentation & Advanced Tutorial",
            "provider": "Python Software Foundation",
            "url": "https://docs.python.org/3/tutorial/",
            "resource_type": "Documentation",
            "difficulty": "Intermediate",
            "description": "Comprehensive reference guide to Python 3 standard library, data models, async/await, and generators.",
            "estimated_hours": 15
        },
        {
            "title": "Fluent Python: Clear, Concise, and Effective Programming",
            "provider": "O'Reilly / Real Python",
            "url": "https://realpython.com/",
            "resource_type": "Tutorial",
            "difficulty": "Advanced",
            "description": "Master idiomatic Python features, metaprogramming, dunder methods, context managers, and concurrency.",
            "estimated_hours": 25
        }
    ],
    "Machine Learning": [
        {
            "title": "Machine Learning Specialization by Andrew Ng",
            "provider": "Coursera / DeepLearning.AI",
            "url": "https://www.coursera.org/specializations/machine-learning-introduction",
            "resource_type": "Course",
            "difficulty": "Intermediate",
            "description": "Master fundamental ML concepts, supervised learning, neural networks, decision trees, and recommender systems.",
            "estimated_hours": 40
        },
        {
            "title": "Scikit-Learn Machine Learning in Python",
            "provider": "Scikit-Learn Official Docs",
            "url": "https://scikit-learn.org/stable/tutorial/index.html",
            "resource_type": "Documentation",
            "difficulty": "Intermediate",
            "description": "Practical guides to classification, regression, clustering, model selection, hyperparameter tuning, and PCA.",
            "estimated_hours": 20
        },
        {
            "title": "Practical Deep Learning for Coders",
            "provider": "Fast.ai",
            "url": "https://course.fast.ai/",
            "resource_type": "Interactive Course",
            "difficulty": "Advanced",
            "description": "Top-down practical deep learning covering PyTorch, computer vision, tabular data, and transformer fine-tuning.",
            "estimated_hours": 35
        }
    ],
    "Natural Language Processing": [
        {
            "title": "Natural Language Processing with Transformers",
            "provider": "Hugging Face Course",
            "url": "https://huggingface.co/learn/nlp-course",
            "resource_type": "Interactive Course",
            "difficulty": "Intermediate",
            "description": "Hands-on guide to BERT, Sentence-BERT, tokenizers, sequence classification, and fine-tuning Hugging Face models.",
            "estimated_hours": 25
        },
        {
            "title": "Advanced NLP with spaCy",
            "provider": "Explosion / spaCy",
            "url": "https://course.spacy.io/",
            "resource_type": "Interactive Course",
            "difficulty": "Intermediate",
            "description": "Learn modern NLP pipelines, entity rulers, custom NER models, word vectors, and linguistic rule matching.",
            "estimated_hours": 12
        },
        {
            "title": "Stanford CS224N: Natural Language Processing with Deep Learning",
            "provider": "Stanford Online / YouTube",
            "url": "https://web.stanford.edu/class/cs224n/",
            "resource_type": "Course",
            "difficulty": "Advanced",
            "description": "Comprehensive lectures on word2vec, self-attention, transformers, pretrained language models, and semantic representations.",
            "estimated_hours": 45
        }
    ],
    "Docker": [
        {
            "title": "Docker for Beginners & DevOps Engineers",
            "provider": "freeCodeCamp",
            "url": "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/",
            "resource_type": "Tutorial",
            "difficulty": "Beginner",
            "description": "Containerization fundamentals, writing multi-stage Dockerfiles, managing images, and multi-container docker-compose setups.",
            "estimated_hours": 10
        },
        {
            "title": "Official Docker Documentation & Get Started Guide",
            "provider": "Docker Docs",
            "url": "https://docs.docker.com/get-started/",
            "resource_type": "Documentation",
            "difficulty": "Beginner",
            "description": "Step-by-step guides for building, running, optimizing, and deploying containerized microservices.",
            "estimated_hours": 8
        }
    ],
    "Kubernetes": [
        {
            "title": "Kubernetes Basics & Interactive Tutorials",
            "provider": "Kubernetes.io",
            "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            "resource_type": "Interactive Course",
            "difficulty": "Intermediate",
            "description": "Cluster orchestration, Pods, Deployments, Services, ConfigMaps, rolling updates, and production scaling.",
            "estimated_hours": 18
        },
        {
            "title": "Certified Kubernetes Administrator (CKA) Preparation",
            "provider": "Linux Foundation / CNCF",
            "url": "https://www.cncf.io/certification/cka/",
            "resource_type": "Course",
            "difficulty": "Advanced",
            "description": "In-depth container orchestration architecture, networking, ingress controllers, storage, and cluster troubleshooting.",
            "estimated_hours": 35
        }
    ],
    "AWS": [
        {
            "title": "AWS Cloud Practitioner Essentials",
            "provider": "AWS Skill Builder",
            "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials",
            "resource_type": "Course",
            "difficulty": "Beginner",
            "description": "Official AWS foundational course on EC2, S3, RDS, IAM, VPC, Lambda, and cloud architecture security.",
            "estimated_hours": 15
        },
        {
            "title": "AWS Solutions Architect Associate Study Guide",
            "provider": "AWS Architecture Center",
            "url": "https://aws.amazon.com/architecture/",
            "resource_type": "Documentation",
            "difficulty": "Intermediate",
            "description": "Designing highly available, fault-tolerant, scalable, and cost-effective distributed systems on AWS.",
            "estimated_hours": 30
        }
    ],
    "SQL": [
        {
            "title": "SQL for Data Science & Relational Modeling",
            "provider": "Coursera / UC Davis",
            "url": "https://www.coursera.org/learn/sql-for-data-science",
            "resource_type": "Course",
            "difficulty": "Beginner",
            "description": "SQL query syntax, multi-table JOINs, aggregations, window functions, and relational database schema modeling.",
            "estimated_hours": 20
        },
        {
            "title": "Use The Index, Luke! - Guide to Database Indexing",
            "provider": "Database Indexing Guide",
            "url": "https://use-the-index-luke.com/",
            "resource_type": "Tutorial",
            "difficulty": "Advanced",
            "description": "Master B-tree indexes, execution plans, query optimization, and transaction isolation levels in PostgreSQL/MySQL.",
            "estimated_hours": 12
        }
    ],
    "React": [
        {
            "title": "React Official Documentation - Learn React",
            "provider": "React Core Team",
            "url": "https://react.dev/learn",
            "resource_type": "Documentation",
            "difficulty": "Beginner",
            "description": "Modern React with Hooks (useState, useEffect, useMemo, useCallback), State management, Component lifecycle, and Suspense.",
            "estimated_hours": 20
        },
        {
            "title": "Full Stack Open: Deep Dive into Modern Web Development",
            "provider": "University of Helsinki",
            "url": "https://fullstackopen.com/en/",
            "resource_type": "Interactive Course",
            "difficulty": "Intermediate",
            "description": "Comprehensive full-stack course covering React, Redux, Node.js, Express, REST APIs, GraphQL, and TypeScript.",
            "estimated_hours": 50
        }
    ],
    "FastAPI": [
        {
            "title": "FastAPI Comprehensive Tutorial & User Guide",
            "provider": "FastAPI Official",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "resource_type": "Documentation",
            "difficulty": "Beginner",
            "description": "Modern, high-performance asynchronous web APIs in Python with Pydantic validation, OAuth2, and OpenAPI docs.",
            "estimated_hours": 14
        },
        {
            "title": "Developing Asynchronous APIs with FastAPI and Docker",
            "provider": "TestDriven.io",
            "url": "https://testdriven.io/courses/fastapi-celery/",
            "resource_type": "Tutorial",
            "difficulty": "Intermediate",
            "description": "Building scalable microservices with FastAPI, Celery, Redis task queues, PostgreSQL, and PyTest.",
            "estimated_hours": 18
        }
    ],
    "TypeScript": [
        {
            "title": "The TypeScript Handbook",
            "provider": "Microsoft / TypeScript Team",
            "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
            "resource_type": "Documentation",
            "difficulty": "Beginner",
            "description": "Essential static typing for JavaScript, generics, interfaces, union types, type narrowing, and utility types.",
            "estimated_hours": 15
        },
        {
            "title": "Total TypeScript Essentials",
            "provider": "Matt Pocock / Total TypeScript",
            "url": "https://www.totaltypescript.com/tutorials",
            "resource_type": "Interactive Course",
            "difficulty": "Intermediate",
            "description": "Advanced generic patterns, conditional types, mapped types, and type-safe API client design.",
            "estimated_hours": 16
        }
    ],
    "Node.js": [
        {
            "title": "Node.js Complete Guide & Learn Hub",
            "provider": "Node.js Org",
            "url": "https://nodejs.org/en/learn",
            "resource_type": "Documentation",
            "difficulty": "Beginner",
            "description": "Event-driven asynchronous I/O, Event Loop internals, Streams, Express routing, middleware, and backend API design.",
            "estimated_hours": 16
        }
    ],
    "System Design": [
        {
            "title": "System Design Primer",
            "provider": "Donne Martin / GitHub",
            "url": "https://github.com/donnemartin/system-design-primer",
            "resource_type": "Documentation",
            "difficulty": "Advanced",
            "description": "Learn how to design scalable large-scale systems: CAP theorem, caching, load balancing, sharding, and message queues.",
            "estimated_hours": 30
        },
        {
            "title": "ByteByteGo System Design Fundamentals",
            "provider": "Alex Xu / ByteByteGo",
            "url": "https://bytebytego.com/",
            "resource_type": "Tutorial",
            "difficulty": "Intermediate",
            "description": "Visual breakdown of real-world scalable architectures: rate limiters, distributed key-value stores, and notification systems.",
            "estimated_hours": 20
        }
    ]
}

def get_recommendations_for_skills(skills: List[str]) -> List[Dict[str, Any]]:
    """Returns curated learning resources for given weak or missing skills."""
    if not skills:
        # Return all catalog resources
        recommendations = []
        for norm, items in RESOURCE_DATABASE.items():
            for item in items:
                recommendations.append({
                    "skill_name": norm,
                    "title": item["title"],
                    "provider": item["provider"],
                    "url": item["url"],
                    "resource_type": item.get("resource_type", "Course"),
                    "difficulty": item.get("difficulty", "Beginner"),
                    "description": item.get("description", f"Master {norm} fundamentals and practical applications."),
                    "estimated_hours": item.get("estimated_hours", 15)
                })
        return recommendations

    recommendations = []
    seen_titles = set()
    
    for skill in skills:
        if not skill:
            continue
        norm = normalize_skill(skill)
        if norm in RESOURCE_DATABASE:
            for item in RESOURCE_DATABASE[norm]:
                if item["title"] not in seen_titles:
                    seen_titles.add(item["title"])
                    rec = {
                        "skill_name": norm,
                        "title": item["title"],
                        "provider": item["provider"],
                        "url": item["url"],
                        "resource_type": item.get("resource_type", "Course"),
                        "difficulty": item.get("difficulty", "Beginner"),
                        "description": item.get("description", f"Master {norm} fundamentals and practical applications."),
                        "estimated_hours": item.get("estimated_hours", 15)
                    }
                    recommendations.append(rec)
        else:
            # Dynamic high-quality educational fallback
            title = f"Mastering {norm}: Complete Guide & Tutorial"
            if title not in seen_titles:
                seen_titles.add(title)
                recommendations.append({
                    "skill_name": norm,
                    "title": title,
                    "provider": "freeCodeCamp & Official Docs",
                    "url": f"https://www.google.com/search?q={norm.replace(' ', '+')}+official+tutorial+freecodecamp",
                    "resource_type": "Tutorial",
                    "difficulty": "Beginner to Intermediate",
                    "description": f"Curated roadmap and documentation to build proficiency in {norm}.",
                    "estimated_hours": 15
                })
            
    return recommendations
