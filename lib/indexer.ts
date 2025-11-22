/**
 * محرك الفهرسة - Indexing Engine
 * يقوم بفهرسة المحتوى لتسريع البحث
 */

export interface IndexedDocument {
  id: string
  url: string
  title: string
  content: string
  keywords: string[]
  vector?: number[] // للبحث الدلالي
  createdAt: Date
  updatedAt: Date
}

export class SearchIndex {
  private documents: Map<string, IndexedDocument> = new Map()
  private invertedIndex: Map<string, Set<string>> = new Map()

  /**
   * إضافة مستند للفهرس
   */
  addDocument(doc: IndexedDocument): void {
    this.documents.set(doc.id, doc)

    // بناء الفهرس المعكوس (inverted index)
    const words = this.tokenize(doc.title + ' ' + doc.content)
    words.forEach(word => {
      if (!this.invertedIndex.has(word)) {
        this.invertedIndex.set(word, new Set())
      }
      this.invertedIndex.get(word)?.add(doc.id)
    })
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
   * البحث في الفهرس
   */
  search(query: string): IndexedDocument[] {
    const queryWords = this.tokenize(query)
    const documentScores = new Map<string, number>()

    queryWords.forEach(word => {
      const docIds = this.invertedIndex.get(word)
      if (docIds) {
        docIds.forEach(docId => {
          const currentScore = documentScores.get(docId) || 0
          documentScores.set(docId, currentScore + 1)
        })
      }
    })

    // ترتيب النتائج حسب النقاط
    return Array.from(documentScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([docId]) => this.documents.get(docId)!)
      .filter(doc => doc !== undefined)
  }

  /**
   * حذف مستند من الفهرس
   */
  removeDocument(id: string): boolean {
    return this.documents.delete(id)
  }

  /**
   * الحصول على عدد المستندات
   */
  getDocumentCount(): number {
    return this.documents.size
  }

  /**
   * مسح الفهرس بالكامل
   */
  clear(): void {
    this.documents.clear()
    this.invertedIndex.clear()
  }
}
