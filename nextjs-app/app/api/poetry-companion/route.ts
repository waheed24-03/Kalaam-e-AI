import { NextRequest, NextResponse } from 'next/server'

// This function constructs the AI prompt based on user's request
function getPrompt(
  userInput: string,
  assistanceType: string,
  language: string
) {
  const langInstruction =
    language === 'hinglish'
      ? 'The response should be in Hinglish/Urdish (written in the Roman script).'
      : 'The response should be in English.'

  switch (assistanceType) {
    case 'rhyme':
      return `You are a rhyming dictionary. Find 10 creative rhyming words for the last word of this line: "${userInput}". ${langInstruction} List the words clearly.`
    case 'nextline':
      return `You are a poetry assistant. Continue this poetic line with a fitting and creative next line: "${userInput}". ${langInstruction} Provide only the next line.`
    case 'style':
      return `You are a literary expert. Analyze this line: "${userInput}". Suggest three different poetic styles or forms (like Haiku, Ghazal, Free Verse) that could be used to develop this idea. Briefly explain each style. ${langInstruction}`
    default:
      return `You are a helpful assistant. ${userInput}. ${langInstruction}`
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userInput, assistanceType, language } = await req.json()

    if (!userInput || !assistanceType || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = getPrompt(userInput, assistanceType, language)

    // Using gemma:2b as recommended, but you can change to 'llama3.2:1b'
    const model = 'gemma:2b' 

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma:2b',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.response.trim()

    return NextResponse.json({ result })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI model.' },
      { status: 500 }
    )
  }
}