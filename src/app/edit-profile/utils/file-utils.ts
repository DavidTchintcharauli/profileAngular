export function isValidImage(file: File, maxSizeBytes: number): boolean {
   return file.type.startsWith('image/') && file.size <= maxSizeBytes
}

export function getImagePreview(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject('Error reading file')
        reader.readAsDataURL(file)
    })
}