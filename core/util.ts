export function times<T extends (i: number) => any>(n: number, callback: T): ReturnType<T>[] {
  return Array(n)
    .fill(0)
    .map((_, i) => callback(i))
}
