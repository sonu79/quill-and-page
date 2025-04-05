
export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    bio: "Writer and journalist specializing in technology and its impact on society. Previously wrote for The New York Times and Wired.",
    avatarUrl: "https://i.pravatar.cc/150?u=sarah.johnson"
  },
  {
    id: "2",
    name: "Daniel Chen",
    bio: "Bestselling author of 'Digital Horizons' and tech analyst with a focus on emerging technologies.",
    avatarUrl: "https://i.pravatar.cc/150?u=daniel.chen"
  },
  {
    id: "3",
    name: "Mia Rodriguez",
    bio: "Award-winning travel writer and photographer documenting cultures around the world.",
    avatarUrl: "https://i.pravatar.cc/150?u=mia.rodriguez"
  },
  {
    id: "4",
    name: "Alex Thompson",
    bio: "Former executive turned writer, covering business strategy and leadership.",
    avatarUrl: "https://i.pravatar.cc/150?u=alex.thompson"
  }
];

export const findAuthorById = (id: string): Author | undefined => {
  return authors.find(author => author.id === id);
};
