interface OCRSpaceResponse {
    ParsedResults?: { ParsedText?: string }[]
    OCRExitCode?: number
    IsErroredOnProcessing?: boolean
    ErrorMessage?: string | string[] | null
    ErrorDetails?: string | null
}

export const ocr_text = async (url: string): Promise<string> => {
    const apiKey = process.env.OCR_SPACE_KEY
    if (!apiKey) throw new Error('OCR_SPACE_KEY not set')

    const params = new URLSearchParams()
    params.append('url', url)
    params.append('isOverlayRequired', 'false')
    params.append('apikey', apiKey)

    const res = await fetch('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    })

    if (!res.ok) throw new Error(`OCR request failed: ${res.status} ${res.statusText}`)
    const data = (await res.json()) as OCRSpaceResponse
    const text = data?.ParsedResults?.[0]?.ParsedText
    if (!text) throw new Error('No parsed text returned from OCR')
    return text
}
