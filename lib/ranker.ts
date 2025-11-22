/**
 * خوارزمية الترتيب بالذكاء الاصطناعي - AI Ranking Algorithm
 * تستخدم عدة عوامل لترتيب نتائج البحث
 */

import { IndexedDocument } from './indexer'

export interface RankingFactors {
  titleRelevance: number
  contentRelevance: number
  keywordMatch: number
  pageRank: number
  freshness: number
  userEngagement: number
}

export class AIRanker {
  /**
   * حساب التشابه بين النصوص (Cosine Similarity)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = this.tokenize(text1)
    const words2 = this.tokenize(text2)

    const set1 = new Set(words1)
    const set2 = new Set(words2)

    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return union.size > 0 ? intersection.size / union.size : 0
  }

  /**
   * تقسيم النص إلى كلمات
   */
  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
  }

  /**
   * حساب عامل الحداثة (أحدث المستندات تحصل على نقاط أعلى)
   */
  private calculateFreshness(date: Date): number {
    const now = new Date()
    const ageInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

    // تقل النقاط تدريجياً مع مرور الوقت
    return Math.max(0, 1 - (ageInDays / 365))
  }

  /**
   * حساب مطابقة الكلمات المفتاحية
   */
  private calculateKeywordMatch(keywords: string[], query: string): number {
    const queryWords = this.tokenize(query)
    let matchCount = 0

    keywords.forEach(keyword => {
      if (queryWords.some(word => keyword.toLowerCase().includes(word))) {
        matchCount++
      }
    })

    return keywords.length > 0 ? matchCount / keywords.length : 0
  }

  /**
   * حساب عوامل الترتيب لمستند
   */
  calculateRankingFactors(doc: IndexedDocument, query: string): RankingFactors {
    return {
      titleRelevance: this.calculateSimilarity(doc.title, query),
      contentRelevance: this.calculateSimilarity(doc.content, query),
      keywordMatch: this.calculateKeywordMatch(doc.keywords, query),
      pageRank: Math.random(), // في الإنتاج، يتم حسابه من البنية الرابطية
      freshness: this.calculateFreshness(doc.updatedAt),
      userEngagement: Math.random() // في الإنتاج، من بيانات المستخدمين
    }
  }

  /**
   * حساب النقاط النهائية
   */
  calculateScore(factors: RankingFactors): number {
    // أوزان مختلفة للعوامل المختلفة
    const weights = {
      titleRelevance: 5.0,
      contentRelevance: 3.0,
      keywordMatch: 2.0,
      pageRank: 1.5,
      freshness: 1.0,
      userEngagement: 0.5
    }

    return (
      factors.titleRelevance * weights.titleRelevance +
      factors.contentRelevance * weights.contentRelevance +
      factors.keywordMatch * weights.keywordMatch +
      factors.pageRank * weights.pageRank +
      factors.freshness * weights.freshness +
      factors.userEngagement * weights.userEngagement
    )
  }

  /**
   * ترتيب قائمة من المستندات
   */
  rankDocuments(documents: IndexedDocument[], query: string): Array<{
    document: IndexedDocument
    score: number
    factors: RankingFactors
  }> {
    return documents.map(doc => {
      const factors = this.calculateRankingFactors(doc, query)
      const score = this.calculateScore(factors)

      return { document: doc, score, factors }
    }).sort((a, b) => b.score - a.score)
  }
}
