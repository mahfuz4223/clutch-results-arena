
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Table, Download, Calendar, Users, Smartphone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="bg-yellow-500 p-3 rounded-full">
            <Trophy className="w-12 h-12 text-gray-900" />
          </div>
          <h1 className="text-5xl font-bold mb-4">PUBG Mobile Tournament Maker</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Create professional tournament results for your PUBG Mobile competitions.
            Track teams, manage matches, and generate beautiful standings.
          </p>
          <div className="flex space-x-4 mt-8">
            <Link to="/create">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-6 text-lg">
                Create Tournament
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button variant="outline" className="border-gray-600 hover:bg-gray-700 px-6 py-6 text-lg">
                My Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features for Tournament Organizers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Days & Matches</h3>
              <p className="text-gray-300">
                Organize your tournament with multiple days and matches. Perfect for extended competitions.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Management</h3>
              <p className="text-gray-300">
                Add teams, players, logos and track their performance throughout the tournament.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Table className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automatic Calculations</h3>
              <p className="text-gray-300">
                Let the system calculate placement points, kill points and total scores automatically.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Export Results</h3>
              <p className="text-gray-300">
                Download beautiful tournament standings as images to share with teams and audience.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Themes</h3>
              <p className="text-gray-300">
                Choose from various professional themes to customize your tournament results.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">PUBG Mobile Standard</h3>
              <p className="text-gray-300">
                Uses standard PUBG Mobile point system with customization options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Results Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Professional Results Display</h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
            Generate tournament results that look just like the official PUBG Mobile competitions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img 
                src="/public/lovable-uploads/0338d552-597d-4d3c-9116-61942b79bd83.png" 
                alt="PUBG Tournament Results" 
                className="w-full"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img 
                src="/public/lovable-uploads/c8999b6d-18d9-4816-9b2b-6b2d48fda6fd.png" 
                alt="PUBG Tournament Results" 
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-center mt-10">
            <Link to="/create">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 text-lg">
                Create Your Tournament
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/public/lovable-uploads/fe3a6ee4-42e5-4918-94f9-1c5f9793fd70.png" 
              alt="PUBG Mobile" 
              className="h-12 mb-4"
            />
            <p className="text-gray-400 text-center">
              PUBG Mobile Tournament Maker © 2025 | Not affiliated with PUBG Mobile or Krafton
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
