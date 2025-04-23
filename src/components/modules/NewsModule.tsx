
import { useState } from 'react';
import ModuleCard from '../ModuleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  snippet: string;
  url: string;
  category: string;
  saved: boolean;
}

const NewsModule = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'New Travel Restrictions Lifted for Popular Tourist Destinations',
      source: 'Travel Weekly',
      publishedAt: '2025-04-22T14:30:00Z',
      snippet: 'Several countries have announced the removal of travel restrictions, opening doors for tourists after years of limited access.',
      url: '#',
      category: 'Travel Alerts',
      saved: true
    },
    {
      id: '2',
      title: 'The Hidden Beaches of Southeast Asia You Need to Visit',
      source: 'Wanderlust Magazine',
      publishedAt: '2025-04-21T09:15:00Z',
      snippet: 'Discover untouched paradises away from the typical tourist spots in Thailand, Indonesia, and the Philippines.',
      url: '#',
      category: 'Destinations',
      saved: true
    },
    {
      id: '3',
      title: 'Airlines Announce New Routes for Summer 2025',
      source: 'Aviation Today',
      publishedAt: '2025-04-20T16:45:00Z',
      snippet: 'Major airlines are expanding their networks with exciting new destinations for the upcoming summer season.',
      url: '#',
      category: 'Flight News',
      saved: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // In a real app, you would fetch news data from the API
      const newArticle: NewsArticle = {
        id: Date.now().toString(),
        title: `${searchTerm} - Latest Updates and Information`,
        source: 'Travel News Network',
        publishedAt: new Date().toISOString(),
        snippet: `The latest information about ${searchTerm} that travelers need to know before planning their next trip.`,
        url: '#',
        category: 'Search Results',
        saved: false
      };
      
      setNewsArticles([newArticle, ...newsArticles]);
      setSearchTerm('');
    }
  };

  const handleSaveArticle = (id: string) => {
    setNewsArticles(newsArticles.map(article => 
      article.id === id ? { ...article, saved: true } : article
    ));
  };

  const handleDeleteArticle = (id: string) => {
    setNewsArticles(newsArticles.filter(article => article.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Search for travel news..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="bg-[hsl(var(--news-color))]">
          Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {newsArticles.map((article) => (
          <ModuleCard 
            key={article.id}
            title={article.title}
            type="news"
            onDelete={() => handleDeleteArticle(article.id)}
            onEdit={() => console.log(`Edit article ${article.id}`)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">{article.source}</div>
                <Badge 
                  variant="outline" 
                  className="bg-[hsl(var(--news-color)/10%)] text-[hsl(var(--news-color))]"
                >
                  {article.category}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700">{article.snippet}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>Published: {new Date(article.publishedAt).toLocaleDateString()}</div>
                {!article.saved && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSaveArticle(article.id)}
                    className="text-[hsl(var(--news-color))] border-[hsl(var(--news-color))] hover:bg-[hsl(var(--news-color)/10%)]"
                  >
                    Save Article
                  </Button>
                )}
              </div>
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default NewsModule;
