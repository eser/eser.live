import unidecode from "unidecode";

export function asciify(str: string): string {
  return unidecode(str.toLowerCase());
}
