export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString)
      return ""
    }

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    // Return the formatted date
    return `${day}-${month}-${year}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

