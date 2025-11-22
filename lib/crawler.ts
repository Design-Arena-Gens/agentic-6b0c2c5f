/**
 * زاحف الويب الذكي - Web Crawler
 * يجمع البيانات من الويب ويفهرسها
 */

export interface CrawlResult {
  url: string
  title: string
  content: string
  keywords: string[]
  timestamp: Date
}

export class SmartCrawler {
  private visitedUrls: Set<string> = new Set()
  private maxPages: number

  constructor(maxPages: number = 100) {
    this.maxPages = maxPages
  }

  /**
   * استخراج الكلمات المفتاحية من النص
   */
  private extractKeywords(text: string): string[] {
    // إزالة الكلمات الشائعة (stop words)
    const stopWords = ['في', 'من', 'إلى', 'على', 'هذا', 'التي', 'الذي', 'و', 'أو', 'هو', 'هي']

    const words = text.toLowerCase()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !stopWords.includes(word))

    // حساب تكرار الكلمات
    const wordCount: { [key: string]: number } = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // ترتيب حسب التكرار
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0])
  }

  /**
   * زحف صفحة واحدة
   */
  async crawlPage(url: string): Promise<CrawlResult | null> {
    if (this.visitedUrls.has(url)) {
      return null
    }

    try {
      this.visitedUrls.add(url)

      // في بيئة الإنتاج، هنا نستخدم fetch لجلب الصفحة
      // const response = await fetch(url)
      // const html = await response.text()

      // محاكاة نتيجة الزحف
      return {
        url,
        title: `صفحة من ${url}`,
        content: 'محتوى الصفحة...',
        keywords: ['كلمة1', 'كلمة2', 'كلمة3'],
        timestamp: new Date()
      }

    } catch (error) {
      console.error(`Error crawling ${url}:`, error)
      return null
    }
  }

  /**
   * بدء الزحف من قائمة URLs
   */
  async startCrawling(seedUrls: string[]): Promise<CrawlResult[]> {
    const results: CrawlResult[] = []

    for (const url of seedUrls) {
      if (results.length >= this.maxPages) break

      const result = await this.crawlPage(url)
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  /**
   * إعادة تعيين الزاحف
   */
  reset(): void {
    this.visitedUrls.clear()
  }
}
