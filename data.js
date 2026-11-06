// 기본 항목. 시험 코드·응시료·개편 일정은 자주 바뀌므로 넣지 않았습니다. 반드시 공식 링크에서 확인하세요.
// kind: cert(자격증) | course(교육) · level: 1 입문 · 2 중급 · 3 고급 · free: 무료 여부(교육만, 수료증은 유료일 수 있음)
window.ROADMAP_DATA = [
  { id: 'aws-ai-practitioner', kind: 'cert', name: 'AWS Certified AI Practitioner', provider: 'AWS', level: 1, lang: '영어·한국어 등', topics: ['생성형 AI', '클라우드', 'AI 기초'], url: 'https://aws.amazon.com/certification/certified-ai-practitioner/' },
  { id: 'aws-ml-engineer-associate', kind: 'cert', name: 'AWS Certified Machine Learning Engineer – Associate', provider: 'AWS', level: 2, lang: '영어 등', topics: ['MLOps', '클라우드', '모델 배포'], url: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/' },
  { id: 'azure-ai-fundamentals', kind: 'cert', name: 'Microsoft Certified: Azure AI Fundamentals', provider: 'Microsoft', level: 1, lang: '영어·한국어 등', topics: ['AI 기초', '클라우드'], url: 'https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/' },
  { id: 'azure-ai-engineer', kind: 'cert', name: 'Microsoft Certified: Azure AI Engineer Associate', provider: 'Microsoft', level: 2, lang: '영어·한국어 등', topics: ['AI 서비스 개발', '클라우드'], url: 'https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/' },
  { id: 'gcp-genai-leader', kind: 'cert', name: 'Google Cloud Generative AI Leader', provider: 'Google Cloud', level: 1, lang: '영어 등', topics: ['생성형 AI', '비즈니스 활용'], url: 'https://cloud.google.com/learn/certification/generative-ai-leader' },
  { id: 'gcp-ml-engineer', kind: 'cert', name: 'Google Cloud Professional Machine Learning Engineer', provider: 'Google Cloud', level: 3, lang: '영어 등', topics: ['MLOps', '모델 설계', '클라우드'], url: 'https://cloud.google.com/learn/certification/machine-learning-engineer' },
  { id: 'nvidia-cert', kind: 'cert', name: 'NVIDIA 자격 인증 (생성형 AI·가속 컴퓨팅 등)', provider: 'NVIDIA', level: 2, lang: '영어', topics: ['생성형 AI', 'GPU'], url: 'https://www.nvidia.com/en-us/learn/certification/' },
  { id: 'aice', kind: 'cert', name: 'AICE (AI Certificate for Everyone)', provider: 'KT · 한국경제신문', level: 1, lang: '한국어', topics: ['AI 기초', '데이터 분석', '파이썬'], url: 'https://aice.study/' },
  { id: 'adsp', kind: 'cert', name: '데이터분석 준전문가 (ADsP)', provider: '한국데이터산업진흥원', level: 1, lang: '한국어', topics: ['데이터 분석', '통계'], url: 'https://www.dataq.or.kr/' },
  { id: 'bigdata-engineer', kind: 'cert', name: '빅데이터분석기사', provider: '한국데이터산업진흥원', level: 2, lang: '한국어', topics: ['데이터 분석', '머신러닝', '국가기술자격'], url: 'https://www.dataq.or.kr/' },
  { id: 'elements-of-ai', kind: 'course', free: true, name: 'Elements of AI', provider: '헬싱키대학교 · MinnaLearn', level: 1, lang: '영어 등 여러 언어', topics: ['AI 기초', '비전공자'], url: 'https://www.elementsofai.com/' },
  { id: 'google-ml-crash', kind: 'course', free: true, name: 'Machine Learning Crash Course', provider: 'Google', level: 1, lang: '영어', topics: ['머신러닝 기초', '실습'], url: 'https://developers.google.com/machine-learning/crash-course' },
  { id: 'kaggle-learn', kind: 'course', free: true, name: 'Kaggle Learn', provider: 'Kaggle', level: 1, lang: '영어', topics: ['파이썬', '머신러닝', '실습'], url: 'https://www.kaggle.com/learn' },
  { id: 'hf-learn', kind: 'course', free: true, name: 'Hugging Face Learn (LLM·Agents 등)', provider: 'Hugging Face', level: 2, lang: '영어 등', topics: ['LLM', '에이전트', '오픈소스 모델'], url: 'https://huggingface.co/learn' },
  { id: 'fastai', kind: 'course', free: true, name: 'Practical Deep Learning for Coders', provider: 'fast.ai', level: 2, lang: '영어', topics: ['딥러닝', '실습'], url: 'https://course.fast.ai/' },
  { id: 'dlai-short', kind: 'course', free: true, name: 'DeepLearning.AI Short Courses', provider: 'DeepLearning.AI', level: 2, lang: '영어', topics: ['생성형 AI', 'LLM 활용'], url: 'https://www.deeplearning.ai/short-courses/' },
  { id: 'ms-learn-ai', kind: 'course', free: true, name: 'Microsoft Learn AI 학습 경로', provider: 'Microsoft', level: 1, lang: '영어·한국어 등', topics: ['AI 기초', '자격증 대비'], url: 'https://learn.microsoft.com/training/' },
  { id: 'aws-skill-builder', kind: 'course', free: true, name: 'AWS Skill Builder (무료 강좌)', provider: 'AWS', level: 1, lang: '영어·한국어 등', topics: ['클라우드', '자격증 대비'], url: 'https://skillbuilder.aws/' },
  { id: 'kmooc', kind: 'course', free: true, name: 'K-MOOC AI·데이터 강좌', provider: '국가평생교육진흥원', level: 1, lang: '한국어', topics: ['AI 기초', '대학 강좌'], url: 'https://www.kmooc.kr/' },
];
