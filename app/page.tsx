'use client'

import { useState } from 'react'
import { Search, Brain, Zap, Globe, TrendingUp } from 'lucide-react'

interface SearchResult {
  title: string
  url: string
  snippet: string
  score: number
  aiScore: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [stats, setStats] = useState({ totalResults: 0, searchTime: 0 })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearchPerformed(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      const searchTime = ((Date.now() - startTime) / 1000).toFixed(2)

      setResults(data.results || [])
      setStats({
        totalResults: data.results?.length || 0,
        searchTime: parseFloat(searchTime)
      })
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="search-header">
        <h1>🔍 محرك البحث الذكي</h1>
        <p>بحث متطور مدعوم بالذكاء الاصطناعي</p>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="ابحث عن أي شيء..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading ? 'جاري البحث...' : 'بحث'}
            </button>
          </div>
        </form>
      </div>

      {!searchPerformed && (
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>ذكاء اصطناعي متقدم</h3>
            <p>يفهم سياق استفساراتك ويقدم نتائج أكثر دقة</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>بحث سريع</h3>
            <p>نتائج فورية من ملايين الصفحات في ثوانٍ</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>تغطية شاملة</h3>
            <p>زحف ذكي للويب لجمع أفضل المحتويات</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>ترتيب ذكي</h3>
            <p>خوارزميات متطورة لترتيب النتائج حسب الأهمية</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>جاري البحث بالذكاء الاصطناعي...</p>
        </div>
      )}

      {searchPerformed && !loading && (
        <>
          {results.length > 0 && (
            <div className="stats">
              وجدنا {stats.totalResults} نتيجة في {stats.searchTime} ثانية
            </div>
          )}

          <div className="results-container">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="result-card">
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-title">
                    {result.title}
                  </a>
                  <div className="result-url">{result.url}</div>
                  <p className="result-snippet">{result.snippet}</p>
                  <div>
                    <span className="result-score">
                      نقاط الذكاء الاصطناعي: {result.aiScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h2>😔 لم نجد نتائج</h2>
                <p>جرب استخدام كلمات مختلفة أو أقل تحديداً</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
