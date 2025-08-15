import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Non-functional login - always redirects to dashboard regardless of credentials
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="flex min-h-[500px]">
            {/* Left Panel - Blue Welcome Section */}
            <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 p-12 flex items-center justify-center text-white">
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold leading-relaxed">
                  Welcome<br />
                  to your<br />
                  inventory<br />
                  system
                </h1>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 bg-white p-12 flex items-center justify-center">
              <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="sr-only">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-12"
                        data-testid="input-username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12"
                        data-testid="input-password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-500">
                  Enter any credentials to access the system
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}