
import { useState } from 'react';
import ModuleCard from '../ModuleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Euro, Currency } from 'lucide-react';

interface CurrencyPair {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

const CurrencyModule = () => {
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([
    {
      id: '1',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.91,
      lastUpdated: '2025-04-23T10:30:00Z'
    },
    {
      id: '2',
      fromCurrency: 'EUR',
      toCurrency: 'JPY',
      rate: 161.85,
      lastUpdated: '2025-04-23T10:30:00Z'
    },
    {
      id: '3',
      fromCurrency: 'GBP',
      toCurrency: 'USD',
      rate: 1.25,
      lastUpdated: '2025-04-23T10:30:00Z'
    }
  ]);

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');

  const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'AUD', 'CNY', 'INR'];

  const handleAddCurrencyPair = () => {
    // In a real app, you would fetch the exchange rate from the API
    const rate = parseFloat((Math.random() * (1.5 - 0.5) + 0.5).toFixed(4));
    
    const newCurrencyPair: CurrencyPair = {
      id: Date.now().toString(),
      fromCurrency,
      toCurrency,
      rate,
      lastUpdated: new Date().toISOString()
    };
    
    setCurrencyPairs([...currencyPairs, newCurrencyPair]);
  };

  const handleDeleteCurrencyPair = (id: string) => {
    setCurrencyPairs(currencyPairs.filter(c => c.id !== id));
  };

  const getCurrencySymbol = (currency: string) => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'JPY': return '¥';
      case 'GBP': return '£';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'CNY': return '¥';
      case 'INR': return '₹';
      default: return currency;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <ArrowRight className="mx-1 self-center" />
          
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAddCurrencyPair} className="bg-[hsl(var(--currency-color))]">
          Add Currency Pair
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currencyPairs.map((pair) => {
          const convertedAmount = parseFloat(amount) * pair.rate;
          
          return (
            <ModuleCard 
              key={pair.id}
              title={`${pair.fromCurrency} to ${pair.toCurrency}`}
              type="currency"
              onDelete={() => handleDeleteCurrencyPair(pair.id)}
              onEdit={() => console.log(`Edit currency pair ${pair.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-medium">
                    {getCurrencySymbol(pair.fromCurrency)}1 = {getCurrencySymbol(pair.toCurrency)}{pair.rate.toFixed(4)}
                  </div>
                  <Currency className="h-6 w-6 text-[hsl(var(--currency-color))]" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-24"
                  />
                  <span className="font-medium">{pair.fromCurrency}</span>
                  <ArrowRight className="mx-2" />
                  <span className="font-bold">{convertedAmount.toFixed(2)}</span>
                  <span className="font-medium">{pair.toCurrency}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(pair.lastUpdated).toLocaleString()}
                </div>
              </div>
            </ModuleCard>
          );
        })}
      </div>
    </div>
  );
};

export default CurrencyModule;
