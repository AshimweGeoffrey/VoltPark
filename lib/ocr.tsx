interface OCRSpaceResponse {
  ParsedResults?: { ParsedText?: string }[]
  OCRExitCode?: number
  IsErroredOnProcessing?: boolean
  ErrorMessage?: string | string[] | null
  ErrorDetails?: string | null
}

export const ocr_text = async (imageInput: string): Promise<string> => {
  const apiKey = process.env.OCR_SPACE_KEY
  if (!apiKey) throw new Error('OCR_SPACE_KEY not set')

  const formData = new FormData()
  formData.append('apikey', apiKey)
  formData.append('isOverlayRequired', 'false')
  formData.append('OCREngine', '2') // Engine 2 is better for number plates

  if (imageInput.startsWith('http')) {
    formData.append('url', imageInput)
  } else if (imageInput.startsWith('data:')) {
    formData.append('base64Image', imageInput)
  } else {
    // Assume it's a raw base64 string if not a URL
    formData.append('base64Image', `data:image/jpeg;base64,${imageInput}`)
  }

  const res = await fetch(
    process.env.OCR_SPACE_LINK || 'https://api.ocr.space/parse/image',
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!res.ok)
    throw new Error(`OCR request failed: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as OCRSpaceResponse

  if (data.IsErroredOnProcessing) {
    const errorMsg = Array.isArray(data.ErrorMessage)
      ? data.ErrorMessage.join(', ')
      : data.ErrorMessage
    throw new Error(
      `OCR Error: ${errorMsg || data.ErrorDetails || 'Unknown error'}`
    )
  }

  const text = data?.ParsedResults?.[0]?.ParsedText
  if (!text) throw new Error('No parsed text returned from OCR')

  // Clean up the text (remove newlines, extra spaces)
  return text.replace(/[\r\n]+/g, ' ').trim()
}
