export function formatDateTime(inputDateTime: string) {
  const messageDate = new Date(inputDateTime)
  const now = new Date()

  // If the message is from today
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // If the message is from the last few days
  const timeDifference = now.getTime() - messageDate.getTime()
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  if (daysDifference < 7) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = weekdays[messageDate.getDay()]
    return `${dayName}, ${messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  }

  // If the message is older than a week
  return `${messageDate.toLocaleString('default', {
    month: 'long'
  })} ${messageDate.getDate()}, ${messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}
