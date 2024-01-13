function setCookie(name: string, value: any, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  const encoded = btoa(JSON.stringify(value))
  const cookieString = `${name}=${encoded || ''};expires=${expires.toUTCString()};path=/`
  document.cookie = cookieString
}

// Function to get the value of a cookie by name
function getCookie(name: string): any {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName === name) {
      return JSON.parse(atob(cookieValue))
    }
  }
  return null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export { setCookie, getCookie, deleteCookie }
