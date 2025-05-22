
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Banknote } from 'lucide-react';

const CurrencyPage = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  // Placeholder exchange rates
  const rates = {
    'USD-EUR': 0.85,
    'USD-GBP': 0.75,
    'USD-JPY': 110.15,
    'EUR-USD': 1.18,
    'EUR-GBP': 0.88,
    'EUR-JPY': 129.55,
    'GBP-USD': 1.33,
    'GBP-EUR': 1.14,
    'GBP-JPY': 147.25,
    'JPY-USD': 0.0091,
    'JPY-EUR': 0.0077,
    'JPY-GBP': 0.0068,
  };

  const calculateConversion = () => {
    const rate = rates[`${fromCurrency}-${toCurrency}`] || 1;
    return (parseFloat(amount) * rate).toFixed(2);
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-yellow-500">
        <CardHeader>
          <CardTitle>Currency Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="ghost" size="icon" className="mb-1">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mb-1">Convert</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-yellow-500 text-white">
            <CardTitle className="flex justify-between">
              <span>{fromCurrency} to {toCurrency}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">
                {calculateConversion()} {toCurrency}
              </div>
              <div className="text-4xl text-yellow-500">
                <Banknote className="h-10 w-10" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span>1 {fromCurrency}</span>
                <span>=</span>
                <span>{rates[`${fromCurrency}-${toCurrency}`] || 1} {toCurrency}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Last updated: May 22, 2025, 10:30 AM
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyPage;
