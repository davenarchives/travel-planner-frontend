
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookmarkPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder news data
  const newsArticles = [
    {
      id: 1,
      title: 'New Travel Regulations for European Union',
      source: 'Travel Weekly',
      category: 'Regulations',
      snippet: 'The European Union has announced new travel regulations that will affect tourists from non-EU countries. Starting next month, travelers will need to...',
      publishedDate: 'May 21, 2025'
    },
    {
      id: 2,
      title: 'Top 10 Sustainable Travel Destinations for 2025',
      source: 'Eco Tourism',
      category: 'Destinations',
      snippet: 'As sustainable travel continues to grow in popularity, these ten destinations stand out for their commitment to environmental conservation and...',
      publishedDate: 'May 19, 2025'
    },
    {
      id: 3,
      title: 'Airlines Introduce New Baggage Policies',
      source: 'Flight News',
      category: 'Aviation',
      snippet: 'Several major airlines have announced changes to their baggage policies. Passengers should be aware of these new rules before booking their next flight...',
      publishedDate: 'May 17, 2025'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-pink-500">
        <CardHeader>
          <CardTitle>Travel News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search for travel news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {newsArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <CardHeader className="bg-pink-500 text-white">
              <CardTitle className="flex justify-between">
                <span>{article.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">
                  {article.category}
                </Badge>
                <span className="text-sm text-muted-foreground">{article.source}</span>
              </div>
              <p className="mb-6">{article.snippet}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{article.publishedDate}</span>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
