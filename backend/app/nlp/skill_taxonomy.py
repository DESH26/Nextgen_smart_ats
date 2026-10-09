import re
from typing import Dict, List, Set, Tuple, Optional

SKILL_TAXONOMY: Dict[str, Dict[str, List[str]]] = {
    "Programming Languages": {
        "Python": ["python", "python3", "py"],
        "Java": ["java", "core java", "j2ee"],
        "C++": ["c++", "cpp"],
        "C": ["c programming", "c language"],
        "C#": ["c#", "csharp", ".net c#"],
        "JavaScript": ["javascript", "js", "es6", "ecmascript"],
        "TypeScript": ["typescript", "ts"],
        "Go": ["golang", "go language"],
        "Rust": ["rust", "rustlang"],
        "Ruby": ["ruby", "ruby on rails"],
        "PHP": ["php", "php7", "php8"],
        "Swift": ["swift", "swiftui"],
        "Kotlin": ["kotlin", "android kotlin"],
        "R": ["r programming", "r language"],
        "Scala": ["scala"],
        "Dart": ["dart", "flutter dart"],
        "SQL": ["sql", "structured query language", "pl/sql", "t-sql"],
        "Shell Scripting": ["bash", "shell", "powershell", "zsh", "sh"]
    },
    "Web & Frontend": {
        "React": ["react", "react.js", "reactjs"],
        "Next.js": ["next.js", "nextjs", "next"],
        "Vue.js": ["vue", "vue.js", "vuejs"],
        "Angular": ["angular", "angularjs", "angular 2+"],
        "HTML5": ["html", "html5"],
        "CSS3": ["css", "css3"],
        "Tailwind CSS": ["tailwind", "tailwindcss"],
        "Bootstrap": ["bootstrap", "bootstrap 5"],
        "Sass": ["sass", "scss"],
        "Redux": ["redux", "redux toolkit", "rtk"],
        "GraphQL": ["graphql", "apollo client"],
        "Webpack": ["webpack", "vite", "rollup"],
        "jQuery": ["jquery"]
    },
    "Backend & Frameworks": {
        "FastAPI": ["fastapi", "fast-api"],
        "Django": ["django", "django rest framework", "drf"],
        "Flask": ["flask"],
        "Node.js": ["node", "node.js", "nodejs"],
        "Express.js": ["express", "express.js", "expressjs"],
        "Spring Boot": ["spring", "spring boot", "spring mvc"],
        "ASP.NET": ["asp.net", "asp.net core", ".net core", "dotnet"],
        "NestJS": ["nestjs", "nest.js"],
        "REST API": ["rest", "rest api", "restful", "restful apis", "web services", "api development"],
        "Microservices": ["microservices", "microservice architecture", "distributed systems"],
        "gRPC": ["grpc", "protobuf"]
    },
    "Databases & Storage": {
        "PostgreSQL": ["postgresql", "postgres", "psql"],
        "MySQL": ["mysql"],
        "MongoDB": ["mongodb", "mongo"],
        "Redis": ["redis"],
        "SQLite": ["sqlite", "sqlite3"],
        "Oracle": ["oracle db", "oracle database"],
        "Microsoft SQL Server": ["mssql", "sql server"],
        "Cassandra": ["cassandra", "apache cassandra"],
        "DynamoDB": ["dynamodb", "aws dynamodb"],
        "Elasticsearch": ["elasticsearch", "elastic search", "elk stack"],
        "Neo4j": ["neo4j", "graph database"]
    },
    "Cloud & DevOps": {
        "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "rds", "ecs", "cloudformation"],
        "Docker": ["docker", "containerization", "docker-compose"],
        "Kubernetes": ["kubernetes", "k8s"],
        "CI/CD": ["ci/cd", "continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"],
        "Azure": ["azure", "microsoft azure", "azure devops"],
        "Google Cloud Platform": ["gcp", "google cloud", "google cloud platform"],
        "Terraform": ["terraform", "iac", "infrastructure as code"],
        "Ansible": ["ansible"],
        "Linux": ["linux", "ubuntu", "centos", "debian", "redhat"],
        "Nginx": ["nginx", "reverse proxy", "apache http server"],
        "Git": ["git", "version control"],
        "GitHub": ["github", "gitlab", "bitbucket"]
    },
    "AI, Machine Learning & Data Science": {
        "Machine Learning": ["machine learning", "ml", "supervised learning", "unsupervised learning"],
        "Deep Learning": ["deep learning", "dl", "neural networks", "cnn", "rnn", "lstm"],
        "Natural Language Processing": ["natural language processing", "nlp", "text processing", "ner", "sentiment analysis", "spacy", "nltk", "huggingface", "transformers", "bert", "sentence-bert"],
        "PyTorch": ["pytorch", "torch"],
        "TensorFlow": ["tensorflow", "tf", "keras"],
        "scikit-learn": ["scikit-learn", "sklearn"],
        "Computer Vision": ["computer vision", "opencv", "object detection", "image processing"],
        "Large Language Models": ["llm", "llms", "large language models", "prompt engineering", "langchain", "llamaindex", "rag"],
        "Pandas": ["pandas", "dataframe"],
        "NumPy": ["numpy"],
        "Data Analysis": ["data analysis", "exploratory data analysis", "eda", "data analytics"],
        "Data Visualization": ["data visualization", "matplotlib", "seaborn", "plotly"],
        "Feature Engineering": ["feature engineering", "data preprocessing", "model evaluation"]
    },
    "Big Data & Business Intelligence": {
        "Apache Spark": ["spark", "pyspark", "apache spark"],
        "Apache Kafka": ["kafka", "apache kafka", "event streaming"],
        "Power BI": ["power bi", "powerbi", "dax"],
        "Tableau": ["tableau"],
        "Snowflake": ["snowflake"],
        "Databricks": ["databricks"],
        "Apache Hadoop": ["hadoop", "hdfs", "mapreduce"],
        "Apache Airflow": ["airflow", "etl", "data pipeline", "data warehousing"]
    },
    "Testing & Quality Assurance": {
        "Unit Testing": ["unit testing", "tdd", "test driven development"],
        "PyTest": ["pytest"],
        "JUnit": ["junit"],
        "Jest": ["jest"],
        "Selenium": ["selenium", "webdriver"],
        "Cypress": ["cypress"],
        "Postman": ["postman", "api testing"],
        "Load Testing": ["jmeter", "locust", "performance testing"]
    },
    "Methodologies & Soft Skills": {
        "Agile": ["agile", "scrum", "kanban", "sprint planning"],
        "Jira": ["jira", "confluence"],
        "System Design": ["system design", "software architecture", "design patterns", "oop", "solid principles"],
        "Problem Solving": ["problem solving", "algorithmic thinking", "data structures and algorithms", "dsa"],
        "Leadership": ["leadership", "team leadership", "mentorship", "project management"],
        "Communication": ["communication", "technical writing", "presentation skills"],
        "Collaboration": ["collaboration", "cross-functional collaboration", "teamwork"]
    }
}

# Inverted index for fast O(1) alias lookup
ALIAS_TO_SKILL: Dict[str, str] = {}
SKILL_TO_CATEGORY: Dict[str, str] = {}
ALL_CANONICAL_SKILLS: Set[str] = set()

for category, skills in SKILL_TAXONOMY.items():
    for canonical_name, aliases in skills.items():
        ALL_CANONICAL_SKILLS.add(canonical_name)
        SKILL_TO_CATEGORY[canonical_name] = category
        ALIAS_TO_SKILL[canonical_name.lower()] = canonical_name
        for alias in aliases:
            ALIAS_TO_SKILL[alias.lower()] = canonical_name

SORTED_ALIASES: List[Tuple[str, str]] = sorted(
    ALIAS_TO_SKILL.items(),
    key=lambda item: len(item[0]),
    reverse=True
)

def extract_skills_from_text(text: str) -> List[str]:
    if not text:
        return []
    
    lowered_text = " " + text.lower() + " "
    cleaned_text = re.sub(r"[^\w\s\+\#\.\/\-]", " ", lowered_text)
    
    detected_skills = set()
    
    for alias, canonical in SORTED_ALIASES:
        escaped_alias = re.escape(alias)
        pattern = r"(?:^|[\s,;/\(\)\[\]\|])" + escaped_alias + r"(?:$|[\s,;/\(\)\[\]\|\.\!])"
        if re.search(pattern, cleaned_text):
            detected_skills.add(canonical)
            
    return sorted(list(detected_skills))

def normalize_skill(skill_name: str) -> str:
    clean = skill_name.strip().lower()
    return ALIAS_TO_SKILL.get(clean, skill_name.strip().title())

def get_skill_category(skill_name: str) -> str:
    canonical = normalize_skill(skill_name)
    return SKILL_TO_CATEGORY.get(canonical, "Technical Skills")
