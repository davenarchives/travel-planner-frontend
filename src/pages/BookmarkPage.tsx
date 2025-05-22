
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Flag, Banknote, Newspaper, Plane } from 'lucide-react';

const BookmarkPage = () => {
  const categories = [
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'countries', name: 'Countries', icon: Flag },
    { id: 'currency', name: 'Currency', icon: Banknote },
    { id: 'news', name: 'News', icon: Newspaper },
    { id: 'flights', name: 'Flights', icon: Plane }
  ];

  // This would be loaded from localStorage in a real implementation
  const bookmarks = {
    weather: [
      { id: 'w1', title: 'Tokyo Weather', data: { temp: '28°C', condition: 'Sunny' } }
    ],
    countries: [
      { id: 'c1', title: 'Japan', data: { capital: 'Tokyo', population: '126 million' } }
    ],
    currency: [
      { id: 'cur1', title: 'USD/EUR', data: { rate: '0.85', lastUpdated: 'May 22, 2025' } }
    ],
    news: [
      { id: 'n1', title: 'New Travel Regulations', data: { source: 'Travel Weekly', date: 'May 21, 2025' } }
    ],
    flights: [
      { id: 'f1', title: 'NY to London', data: { date: 'Jun 15, 2025', price: '$649' } }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-amber-500">
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">All your saved items in one place.</p>
          
          <Tabs defaultValue="weather">
            <TabsList className="grid grid-cols-5">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {bookmarks[category.id].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarks[category.id].map(bookmark => (
                      <Card key={bookmark.id}>
                        <CardHeader>
                          <CardTitle>{bookmark.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-muted p-4 rounded-md overflow-auto">
                            {JSON.stringify(bookmark.data, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <category.icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookmarked {category.name}</h3>
                    <p className="text-muted-foreground">
                      You haven't saved any {category.name.toLowerCase()} yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookmarkPage;
