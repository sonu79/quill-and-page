
import { authors, Author } from './authors';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  authorId: string;
  publishedDate: string;
  readTime: number;
  imageUrl: string;
  featured?: boolean;
  content: string;
  slug: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "The Future of AI in Everyday Life",
    subtitle: "How machine learning is quietly transforming the products we use daily",
    authorId: "1",
    publishedDate: "2025-03-15",
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    featured: true,
    slug: "future-of-ai-in-everyday-life",
    content: `
      <p>Artificial intelligence has moved beyond the realm of science fiction and research labs to become an integral part of our daily lives. From the moment we wake up to when we go to sleep, AI algorithms are working behind the scenes, personalizing our experiences, making recommendations, and even making decisions for us.</p>
      
      <h2>The Invisible Revolution</h2>
      
      <p>Unlike the dramatic portrayals in movies, the real AI revolution has been subtle and pervasive. Your morning routine already involves multiple interactions with AI: the news feed you scroll through is curated by algorithms, your email inbox has automatically filtered out spam, and your smart home devices have adjusted your environment based on your patterns and preferences.</p>
      
      <p>These technologies have become so seamlessly integrated into our lives that we rarely notice their presence until they malfunction or produce unexpected results. This invisible revolution represents one of the most significant technological shifts in human history.</p>
      
      <h2>Personalization at Scale</h2>
      
      <p>Perhaps the most noticeable impact of AI in our daily lives is the level of personalization we now experience in digital services. Streaming platforms like Netflix and Spotify don't just offer content – they predict with remarkable accuracy what you're likely to enjoy next.</p>
      
      <p>This personalization extends to online shopping, news, social media, and even advertising. While this customization can enhance user experience, it also raises important questions about digital echo chambers and algorithmic bias that society is only beginning to address.</p>
    `
  },
  {
    id: "2",
    title: "Sustainable Travel: Beyond Ecotourism",
    subtitle: "New approaches to exploring the world while preserving its natural beauty",
    authorId: "3",
    publishedDate: "2025-04-02",
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    slug: "sustainable-travel-beyond-ecotourism",
    content: `
      <p>For decades, ecotourism has been the go-to concept for environmentally conscious travelers. But as global tourism numbers continue to rise, even well-intentioned ecotourism can strain fragile ecosystems and local communities. A new generation of sustainable travel practices is emerging that goes beyond traditional ecotourism approaches.</p>
      
      <h2>Regenerative Tourism</h2>
      
      <p>Rather than simply aiming to minimize harm, regenerative tourism focuses on leaving destinations better than they were found. This could involve participating in local conservation efforts, contributing to community projects, or engaging in environmental restoration activities as part of your travel experience.</p>
      
      <p>From coral reef restoration programs in Indonesia to reforestation projects in Costa Rica, travelers now have opportunities to make a positive impact while enjoying unique, meaningful experiences.</p>
      
      <h2>Community-Based Tourism</h2>
      
      <p>Another evolution in sustainable travel is the rise of community-based tourism, where local residents maintain control over tourism development, management, and profits. This approach ensures that economic benefits remain within communities while preserving cultural authenticity.</p>
      
      <p>By staying in locally-owned accommodations, hiring local guides, and participating in community-led experiences, travelers can support this model while gaining more authentic insights into the places they visit.</p>
    `
  },
  {
    id: "3",
    title: "The Renaissance of Print Books in a Digital Age",
    subtitle: "How physical books are thriving alongside e-readers and audiobooks",
    authorId: "4",
    publishedDate: "2025-03-28",
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
    slug: "renaissance-of-print-books",
    content: `
      <p>When e-readers first gained popularity in the early 2010s, many predicted the imminent demise of printed books. These predictions intensified with the rise of audiobooks and subscription services that made digital reading more accessible than ever before. Yet more than a decade later, print books aren't just surviving—they're experiencing a renaissance.</p>
      
      <h2>The Sensory Experience</h2>
      
      <p>Research has increasingly shown that physical books offer a sensory experience that digital formats can't replicate. The texture of pages, the smell of paper and ink, and even the physical progress through a book create a more immersive and memorable reading experience for many people.</p>
      
      <p>Independent bookstores have capitalized on this by creating inviting spaces that celebrate the physical aspects of books and foster community among readers—something that online retailers and e-books cannot offer.</p>
      
      <h2>Digital Fatigue</h2>
      
      <p>As more of our professional and social lives move online, many readers are turning to print books as a deliberate break from screens. The physical book represents a rare opportunity to engage deeply with content without notifications, updates, or the temptation to multitask.</p>
      
      <p>This trend has been particularly pronounced among younger generations, with studies showing that Gen Z readers often prefer physical books for leisure reading, even as they use digital formats for academic or professional purposes.</p>
    `
  },
  {
    id: "4",
    title: "The Science of Productive Breaks",
    subtitle: "Why stepping away from work might be the most efficient thing you do all day",
    authorId: "2",
    publishedDate: "2025-03-22",
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1606103955054-99913abd77c8",
    featured: true,
    slug: "science-of-productive-breaks",
    content: `
      <p>In a work culture that often celebrates long hours and constant productivity, taking breaks can feel counterintuitive or even indulgent. However, a growing body of research suggests that strategic breaks aren't just beneficial for wellbeing—they're essential for maintaining high performance and creative thinking.</p>
      
      <h2>The Attention Restoration Theory</h2>
      
      <p>Cognitive psychologists have developed the Attention Restoration Theory, which suggests that our directed attention (the kind required for focused work) is a finite resource that becomes depleted over time. Natural environments, which require less directed attention to process, can help restore this cognitive resource.</p>
      
      <p>Even brief exposure to nature—whether it's a walk in a park or simply looking at natural scenes—can significantly improve attention and performance on subsequent tasks. This explains why that short walk outside can make a difficult problem suddenly seem more approachable.</p>
      
      <h2>The Ultradian Rhythm</h2>
      
      <p>Our brains naturally operate in cycles of high and low energy, typically lasting 90-120 minutes. These ultradian rhythms suggest that working in focused sprints followed by short breaks is more aligned with our biology than maintaining constant focus for hours.</p>
      
      <p>Techniques like the Pomodoro Method, which alternates 25-minute work periods with short breaks, capitalize on these natural rhythms to maintain productivity while preventing burnout.</p>
    `
  },
  {
    id: "5",
    title: "Reimagining Urban Spaces for Community and Climate",
    subtitle: "How cities are transforming streets and buildings to meet environmental and social needs",
    authorId: "1",
    publishedDate: "2025-03-10",
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f",
    slug: "reimagining-urban-spaces",
    content: `
      <p>As climate change intensifies and urban populations grow, cities around the world are reimagining their physical infrastructure to address both environmental and social challenges. These transformations go beyond traditional urban planning to create multifunctional spaces that serve diverse community needs while building climate resilience.</p>
      
      <h2>Streets as Public Spaces</h2>
      
      <p>The pandemic accelerated a global trend toward reclaiming streets from cars and repurposing them as community spaces. Cities from Paris to Bogotá have permanently converted vehicle lanes into pedestrian zones, bike paths, outdoor dining areas, and green spaces.</p>
      
      <p>These transformations not only reduce emissions and improve air quality but also create valuable public spaces in dense urban environments where land for traditional parks is scarce.</p>
      
      <h2>Climate-Adaptive Architecture</h2>
      
      <p>Building design is evolving to respond to changing climate conditions while creating more livable urban environments. Green roofs and walls reduce urban heat island effects and manage stormwater, while also providing aesthetic benefits and potential food production spaces.</p>
      
      <p>Meanwhile, innovative approaches to shade, ventilation, and water management are being incorporated into both new construction and retrofits of existing buildings, often drawing inspiration from traditional architectural practices developed in similar climates.</p>
    `
  }
];

export const getFeaturedArticles = (): Article[] => {
  return articles.filter(article => article.featured);
};

export const getRecentArticles = (): Article[] => {
  return [...articles].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByAuthor = (authorId: string): Article[] => {
  return articles.filter(article => article.authorId === authorId);
};

export const getAuthorForArticle = (article: Article): Author | undefined => {
  return authors.find(author => author.id === article.authorId);
};
