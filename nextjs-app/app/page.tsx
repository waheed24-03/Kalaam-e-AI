'use client'

import React, { useState } from 'react'
import Image from 'next/image' // Import the Next.js Image component

type AssistanceType = 'rhyme' | 'nextline' | 'style'
type Language = 'english' | 'hinglish'

// A simple quill icon component
const QuillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

export default function PoetryCompanionPage() {
  const [userInput, setUserInput] = useState('')
  const [assistanceType, setAssistanceType] = useState<AssistanceType>('rhyme')
  const [language, setLanguage] = useState<Language>('english')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/poetry-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, assistanceType, language }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch from API')
      }

      const data = await res.json()
      setResult(data.result)
    } catch (error) {
      console.error(error)
      setResult('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPlaceholder = () => {
    if (language === 'hinglish') {
      return 'Ek misra yahan likhein...' // "Write a line here..."
    }
    return 'Pen your line of poetry here...'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      {/* Added 'relative' to this main container */}
      <main className="relative w-full max-w-3xl bg-[#2a2a2a]/50 backdrop-blur-sm border border-stone-700 rounded-lg shadow-2xl p-8 md:p-12">
        
        {/* --- LOGO MOVED AND MADE MORE TRANSPARENT --- */}
        <div className="absolute top-6 left-8 opacity-50">
          <Image 
            src="/logo.png" 
            alt="Kalaam-e-AI Logo" 
            width={120} 
            height={120} 
            priority
          />
        </div>
        
        <header className="text-center mb-10 border-b border-stone-700 pb-6">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#d4af37]">
            Kalaam-e-AI
          </h1>
          <p className="text-stone-400 mt-2 text-lg">Your Artificial Muse</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Language Selection */}
          <div className="flex justify-center gap-6">
            <button type="button" onClick={() => setLanguage('english')} className={`font-serif text-lg pb-1 border-b-2 transition-colors ${language === 'english' ? 'text-[#d4af37] border-[#d4af37]' : 'text-stone-400 border-transparent hover:border-stone-500'}`}>
              English
            </button>
            <button type="button" onClick={() => setLanguage('hinglish')} className={`font-serif text-lg pb-1 border-b-2 transition-colors ${language === 'hinglish' ? 'text-[#d4af37] border-[#d4af37]' : 'text-stone-400 border-transparent hover:border-stone-500'}`}>
              Hinglish
            </button>
          </div>

          {/* Text Input */}
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-32 p-4 bg-stone-900/50 border border-stone-700 rounded-md text-lg text-stone-200 focus:ring-2 focus:ring-[#d4af37] focus:outline-none transition resize-none"
            required
          />

          {/* Assistance Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <button type="button" onClick={() => setAssistanceType('rhyme')} className={`p-3 rounded-md border transition-colors ${assistanceType === 'rhyme' ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'border-stone-700 hover:bg-stone-800'}`}>
              Find Rhymes
            </button>
            <button type="button" onClick={() => setAssistanceType('nextline')} className={`p-3 rounded-md border transition-colors ${assistanceType === 'nextline' ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'border-stone-700 hover:bg-stone-800'}`}>
              Suggest Next Line
            </button>
            <button type="button" onClick={() => setAssistanceType('style')} className={`p-3 rounded-md border transition-colors ${assistanceType === 'style' ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'border-stone-700 hover:bg-stone-800'}`}>
              Explore Styles
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 text-xl font-serif font-semibold bg-[#d4af37] text-stone-900 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <QuillIcon />
            {loading ? 'Composing...' : 'Compose'}
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <div className="mt-10 pt-6 border-t border-stone-700">
            <h2 className="text-2xl font-serif mb-4 text-[#d4af37]">AI ki Takhleeq <span className="text-stone-500 text-xl">(AI's Creation)</span></h2>
            <div className="bg-stone-900/50 p-6 rounded-md border border-stone-700">
              <pre className="text-stone-200 whitespace-pre-wrap font-sans text-base leading-relaxed">{result}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
