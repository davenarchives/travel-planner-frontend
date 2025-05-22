
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (!success) {
        toast.error("Invalid credentials. Try demo/password");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 to-purple-800/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl flex">
        {/* Login form section */}
        <div className="w-full md:w-2/5 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Travel Planner</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Use demo credentials:</p>
            <p>Username: <strong>demo</strong> / Password: <strong>password</strong></p>
          </div>
        </div>

        {/* Feature overview section */}
        <div className="hidden md:block md:w-3/5 bg-gradient-to-br from-primary to-purple-700 p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Your Ultimate Travel Companion</h2>
          <p className="text-lg mb-8 opacity-90">Plan your journey with our comprehensive set of tools designed for modern travelers.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Cloud className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Weather Tracking</h3>
                <p className="opacity-80">Stay updated with accurate weather forecasts for all your destinations.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Flag className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Country Information</h3>
                <p className="opacity-80">Access detailed information about countries including culture, visas, and travel advisories.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Banknote className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Currency Conversion</h3>
                <p className="opacity-80">Convert between currencies with real-time exchange rates.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Newspaper className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Travel News</h3>
                <p className="opacity-80">Read the latest travel news and updates from around the world.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
