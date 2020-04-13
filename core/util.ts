export function times<T extends (i: number) => any>(n: number, callback: T): ReturnType<T>[] {
  return Array(n)
    .fill(0)
    .map((_, i) => callback(i))
}

export function getRandomString() {
  return Math.random().toString(36).substring(5)
}
