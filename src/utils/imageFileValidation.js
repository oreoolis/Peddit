export const validateImageFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    } = options

    if (!file) {
        throw new Error('No file provided')
    }

    if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
    }

    if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
    }

    return true
}