export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString)
      return ""
    }

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${day}-${month}-${year} ${hours}:${minutes}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}
