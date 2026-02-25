declare module 'wink-distance' {
  export const bow: {
    cosine: (a: string[], b: string[]) => number
    jaccard: (a: string[], b: string[]) => number
    sorensen: (a: string[], b: string[]) => number
  }
  export const string: {
    levenshtein: (a: string, b: string) => number
    hamming: (a: string, b: string) => number
  }
}
