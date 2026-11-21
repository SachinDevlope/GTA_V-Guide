/** A piece of searchable text and how much a match in it counts. */
export interface SearchField {
  text: string;
  weight: number;
}

/** Anything the search engine can rank. */
export interface Searchable {
  name: string;
  description: string | null;
  search: SearchField[];
}
