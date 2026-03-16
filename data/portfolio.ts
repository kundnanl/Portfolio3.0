export const personal = {
  name: "Laksh",
  fullName: "Laksh",
  role: "Data Engineer",
  company: "RBC",
  school: "Sheridan College",
  location: "Toronto, Canada",
  email: "laksh@email.com",
  github: "https://github.com/laksh",
  linkedin: "https://linkedin.com/in/laksh",
  instagram: "https://instagram.com/laksh",
  bio: "Data Engineer at RBC. I architect the invisible highways that power billion-dollar decisions — pipelines, lakes, and real-time streams.",
  about1:
    "I blend engineering, architecture, and precision to build data infrastructure at scale. With experience at RBC and a foundation from Sheridan College, I've designed systems that process millions of records daily, power regulatory reporting, and reduce query times by 60%. Today, I bring that expertise to every pipeline, platform, and product I touch.",
  about2:
    "I believe data engineering is an art form. The best pipelines are invisible — they just work. I'm open to collaborations, full-time opportunities, and conversations about all things data. Let's build something that lasts.",
};

export const projects = [
  {
    id: "pipeline-atlas",
    title: "Pipeline Atlas",
    description:
      "Enterprise-grade data orchestration platform with real-time monitoring, automated lineage tracking, and intelligent failure recovery across 50+ data sources.",
    tech: ["Apache Airflow", "Python", "Snowflake", "React", "GraphQL"],
    themeColor: "#012672",
    year: "2024",
    type: "Data Platform",
    images: ["/images/project1-a.jpg", "/images/project1-b.jpg"],
  },
  {
    id: "stream-forge",
    title: "StreamForge",
    description:
      "High-throughput streaming pipeline processing 2M events/sec with sub-100ms latency. Built on Kafka + Flink with custom connectors for financial instruments.",
    tech: ["Apache Kafka", "Apache Flink", "Python", "Kubernetes", "Grafana"],
    themeColor: "#003d52",
    year: "2024",
    type: "Real-time Streaming",
    images: ["/images/project2-a.jpg", "/images/project2-b.jpg"],
  },
  {
    id: "vault-dq",
    title: "Vault DQ",
    description:
      "Automated data quality engine running 1000+ validation rules per pipeline cycle, surfacing anomalies with ML-powered root cause analysis before downstream impact.",
    tech: ["Great Expectations", "Python", "dbt", "PostgreSQL", "FastAPI"],
    themeColor: "#4a0a2a",
    year: "2023",
    type: "Data Quality",
    images: ["/images/project3-a.jpg", "/images/project3-b.jpg"],
  },
  {
    id: "lakehouse-rx",
    title: "LakehouseRx",
    description:
      "Cloud-native data lakehouse on AWS with Delta Lake, enabling petabyte-scale analytics with ACID transactions, time travel, and unified batch + streaming.",
    tech: ["Delta Lake", "PySpark", "AWS S3", "AWS Glue", "Terraform"],
    themeColor: "#3a1a00",
    year: "2023",
    type: "Data Architecture",
    images: ["/images/project4-a.jpg", "/images/project4-b.jpg"],
  },
];

export const skills = {
  "Core Capabilities": [
    { label: "Data Engineering", color: "#FDA872" },
    { label: "Pipeline Design", color: "#8B9FF8" },
    { label: "Cloud Architecture", color: "#50A18A" },
    { label: "Stream Processing", color: "#FC9ECD" },
    { label: "Data Modeling", color: "#B9B9B9" },
    { label: "ETL / ELT", color: "#FDA872" },
    { label: "Data Governance", color: "#8B9FF8" },
    { label: "Performance Tuning", color: "#50A18A" },
    { label: "SQL Optimization", color: "#FC9ECD" },
    { label: "Data Lake", color: "#FDA872" },
    { label: "Orchestration", color: "#B9B9B9" },
    { label: "🔥", color: "#FDA872" },
    { label: "🚀", color: "#8B9FF8" },
  ],
  "Tech Stacks": [
    { label: "Python", color: "#8B9FF8" },
    { label: "Apache Spark", color: "#FDA872" },
    { label: "Apache Kafka", color: "#50A18A" },
    { label: "Apache Airflow", color: "#FC9ECD" },
    { label: "dbt", color: "#B9B9B9" },
    { label: "Snowflake", color: "#8B9FF8" },
    { label: "AWS", color: "#FDA872" },
    { label: "Terraform", color: "#50A18A" },
    { label: "PostgreSQL", color: "#FC9ECD" },
    { label: "Docker", color: "#B9B9B9" },
    { label: "Kubernetes", color: "#FDA872" },
    { label: "SQL", color: "#8B9FF8" },
    { label: "⚡", color: "#FDA872" },
  ],
  Services: [
    { label: "Pipeline Architecture", color: "#50A18A" },
    { label: "ETL Consulting", color: "#FDA872" },
    { label: "Cloud Migration", color: "#8B9FF8" },
    { label: "Data Warehouse", color: "#FC9ECD" },
    { label: "Real-time Systems", color: "#B9B9B9" },
    { label: "Data Auditing", color: "#FDA872" },
    { label: "Performance Review", color: "#50A18A" },
    { label: "Mentorship", color: "#8B9FF8" },
    { label: "Freelance Projects", color: "#FC9ECD" },
    { label: "System Design", color: "#B9B9B9" },
    { label: "💡", color: "#FDA872" },
  ],
};

export const hobbies = [
  {
    title: "Music Head",
    description: "From lo-fi beats to classic rock. Music is constant background code.",
    image: "/images/hobby-music.jpg",
  },
  {
    title: "Traveller",
    description: "Finding new perspectives one city at a time.",
    image: "/images/hobby-travel.jpg",
  },
  {
    title: "Gym Rat",
    description: "Discipline outside the terminal builds discipline inside it.",
    image: "/images/hobby-gym.jpg",
  },
  {
    title: "Tech Native",
    description: "Always tinkering. Always learning. Always building.",
    image: "/images/hobby-tech.jpg",
  },
  {
    title: "Sports",
    description: "Cricket, basketball, anything with a score and stakes.",
    image: "/images/hobby-sports.jpg",
  },
];

export const experience = [
  {
    company: "RBC",
    role: "Data Engineer",
    period: "2023 – Present",
    location: "Toronto, ON",
  },
  {
    company: "Sheridan College",
    role: "Honours · Applied Computing",
    period: "2020 – 2023",
    location: "Oakville, ON",
  },
];
