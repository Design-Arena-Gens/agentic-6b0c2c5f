import { NextRequest, NextResponse } from 'next/server'

// قاعدة بيانات محاكاة للصفحات المفهرسة
const indexedPages = [
  {
    url: 'https://ar.wikipedia.org/wiki/ذكاء_اصطناعي',
    title: 'ذكاء اصطناعي - ويكيبيديا',
    content: 'الذكاء الاصطناعي هو فرع من علم الحاسوب يهتم بإنشاء أنظمة ذكية يمكنها محاكاة الذكاء البشري. يشمل التعلم الآلي، معالجة اللغات الطبيعية، والرؤية الحاسوبية.',
    keywords: ['ذكاء اصطناعي', 'AI', 'تعلم آلي', 'حاسوب', 'تكنولوجيا']
  },
  {
    url: 'https://www.example.com/machine-learning',
    title: 'دليل شامل للتعلم الآلي',
    content: 'التعلم الآلي هو تطبيق من تطبيقات الذكاء الاصطناعي يمكّن الأنظمة من التعلم والتحسين تلقائياً من التجربة دون برمجة صريحة. يستخدم في التنبؤ والتصنيف.',
    keywords: ['تعلم آلي', 'machine learning', 'ذكاء اصطناعي', 'بيانات', 'خوارزميات']
  },
  {
    url: 'https://www.example.com/programming',
    title: 'تعلم البرمجة من الصفر',
    content: 'البرمجة هي عملية كتابة تعليمات للحاسوب لتنفيذ مهام محددة. لغات البرمجة الشائعة تشمل Python، JavaScript، Java، وC++. تعلم البرمجة يفتح آفاقاً واسعة.',
    keywords: ['برمجة', 'programming', 'python', 'javascript', 'كود', 'تطوير']
  },
  {
    url: 'https://www.example.com/web-development',
    title: 'تطوير تطبيقات الويب الحديثة',
    content: 'تطوير الويب يشمل إنشاء مواقع وتطبيقات الويب باستخدام HTML، CSS، JavaScript. الأطر الحديثة مثل React، Vue، Angular تسهل بناء واجهات مستخدم تفاعلية.',
    keywords: ['تطوير ويب', 'web development', 'HTML', 'CSS', 'JavaScript', 'React']
  },
  {
    url: 'https://www.example.com/data-science',
    title: 'علم البيانات والتحليلات',
    content: 'علم البيانات يجمع بين الإحصاء، البرمجة، والمعرفة في مجال معين لاستخراج رؤى من البيانات. يستخدم Python، R، SQL وأدوات تصور البيانات.',
    keywords: ['علم بيانات', 'data science', 'تحليلات', 'python', 'إحصاء']
  },
  {
    url: 'https://www.example.com/blockchain',
    title: 'تقنية البلوكشين والعملات الرقمية',
    content: 'البلوكشين تقنية دفتر أستاذ موزع وآمن. تستخدم في العملات الرقمية مثل Bitcoin وEthereum. توفر الشفافية والأمان واللامركزية.',
    keywords: ['بلوكشين', 'blockchain', 'عملات رقمية', 'bitcoin', 'تشفير']
  },
  {
    url: 'https://www.example.com/cybersecurity',
    title: 'الأمن السيبراني وحماية البيانات',
    content: 'الأمن السيبراني يحمي الأنظمة والشبكات والبيانات من الهجمات الرقمية. يشمل التشفير، جدران الحماية، واكتشاف التسلل.',
    keywords: ['أمن سيبراني', 'cybersecurity', 'حماية', 'تشفير', 'أمان']
  },
  {
    url: 'https://www.example.com/cloud-computing',
    title: 'الحوسبة السحابية وخدماتها',
    content: 'الحوسبة السحابية توفر موارد الحوسبة عبر الإنترنت. الخدمات الرئيسية: AWS، Azure، Google Cloud. تشمل التخزين، الخوادم، وقواعد البيانات.',
    keywords: ['حوسبة سحابية', 'cloud computing', 'AWS', 'Azure', 'خوادم']
  },
  {
    url: 'https://www.example.com/mobile-apps',
    title: 'تطوير تطبيقات الهاتف المحمول',
    content: 'تطوير التطبيقات للأجهزة المحمولة باستخدام iOS (Swift) أو Android (Kotlin). أطر مثل React Native وFlutter تسمح بالتطوير متعدد المنصات.',
    keywords: ['تطبيقات محمول', 'mobile apps', 'iOS', 'Android', 'React Native']
  },
  {
    url: 'https://www.example.com/iot',
    title: 'إنترنت الأشياء والأجهزة الذكية',
    content: 'إنترنت الأشياء يربط الأجهزة المادية بالإنترنت. يستخدم في المنازل الذكية، المدن الذكية، والصناعة. يجمع البيانات ويتيح التحكم عن بعد.',
    keywords: ['إنترنت الأشياء', 'IoT', 'أجهزة ذكية', 'استشعار', 'اتصال']
  },
  {
    url: 'https://www.example.com/quantum-computing',
    title: 'الحوسبة الكمية - مستقبل التكنولوجيا',
    content: 'الحوسبة الكمية تستخدم مبادئ الميكانيكا الكمية لمعالجة المعلومات. الكيوبتات يمكنها أن تكون في حالات متعددة في آن واحد، مما يوفر قوة حوسبة هائلة.',
    keywords: ['حوسبة كمية', 'quantum computing', 'كيوبت', 'فيزياء', 'مستقبل']
  },
  {
    url: 'https://www.example.com/robotics',
    title: 'علم الروبوتات والأتمتة',
    content: 'الروبوتات آلات قابلة للبرمجة تنفذ مهام معقدة. تستخدم في التصنيع، الطب، الاستكشاف الفضائي. تجمع بين الهندسة الميكانيكية والبرمجة.',
    keywords: ['روبوتات', 'robotics', 'أتمتة', 'آلات', 'هندسة']
  },
  {
    url: 'https://www.example.com/ar',
    title: 'الواقع المعزز والواقع الافتراضي',
    content: 'الواقع المعزز يدمج المحتوى الرقمي مع العالم الحقيقي. الواقع الافتراضي يخلق بيئة رقمية كاملة. يستخدمان في الألعاب، التعليم، والتدريب.',
    keywords: ['واقع معزز', 'AR', 'VR', 'واقع افتراضي', 'تفاعل']
  },
  {
    url: 'https://www.example.com/big-data',
    title: 'البيانات الضخمة وتحليلها',
    content: 'البيانات الضخمة تشير إلى مجموعات بيانات ضخمة ومعقدة. تتطلب أدوات وتقنيات خاصة للتخزين والمعالجة والتحليل. Hadoop وSpark من الأدوات الشائعة.',
    keywords: ['بيانات ضخمة', 'big data', 'hadoop', 'تحليل', 'معالجة']
  },
  {
    url: 'https://www.example.com/nlp',
    title: 'معالجة اللغات الطبيعية',
    content: 'معالجة اللغات الطبيعية فرع من الذكاء الاصطناعي يمكّن الحواسيب من فهم وتحليل وإنتاج اللغة البشرية. تستخدم في الترجمة، المساعدات الصوتية، وتحليل المشاعر.',
    keywords: ['معالجة لغات', 'NLP', 'لغة طبيعية', 'ترجمة', 'نصوص']
  }
]

// حساب التشابه بين النصوص باستخدام خوارزمية بسيطة
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)

  let matchCount = 0
  words1.forEach(word => {
    if (words2.includes(word) && word.length > 2) {
      matchCount++
    }
  })

  return matchCount / Math.max(words1.length, words2.length)
}

// خوارزمية الترتيب بالذكاء الاصطناعي
function aiRanking(page: any, query: string): number {
  let score = 0

  // تطابق العنوان (وزن أعلى)
  const titleSimilarity = calculateSimilarity(page.title, query)
  score += titleSimilarity * 5

  // تطابق المحتوى
  const contentSimilarity = calculateSimilarity(page.content, query)
  score += contentSimilarity * 3

  // تطابق الكلمات المفتاحية
  const keywordMatches = page.keywords.filter((keyword: string) =>
    query.toLowerCase().includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(query.toLowerCase())
  ).length
  score += keywordMatches * 2

  // عامل الشعبية (محاكاة)
  score += Math.random() * 0.5

  return score
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.trim() === '') {
      return NextResponse.json({ results: [] })
    }

    // محاكاة زمن المعالجة بالذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 500))

    // البحث والترتيب
    const searchResults = indexedPages
      .map(page => {
        const aiScore = aiRanking(page, query)
        return {
          title: page.title,
          url: page.url,
          snippet: page.content.substring(0, 200) + '...',
          score: Math.round(aiScore * 100) / 100,
          aiScore: aiScore
        }
      })
      .filter(result => result.aiScore > 0.1) // تصفية النتائج الضعيفة
      .sort((a, b) => b.aiScore - a.aiScore) // ترتيب حسب النقاط
      .slice(0, 10) // أفضل 10 نتائج

    return NextResponse.json({
      results: searchResults,
      totalResults: searchResults.length,
      query: query
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في البحث' },
      { status: 500 }
    )
  }
}
