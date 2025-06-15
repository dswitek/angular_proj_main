export interface Category {
  id?: number;
  name: string;
}

export interface Actor {
  id?: number;
  name: string;
  surname: string;
}

export interface Book {
  id?: number;
  title: string;
  author: string;
  description: string;
  category: Category;
  actors: Actor[];
}
