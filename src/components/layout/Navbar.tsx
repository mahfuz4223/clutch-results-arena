
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
            <Link to="/" className="text-xl font-bold">
              PUBG Tournament Maker
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/tournaments">
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
                My Tournaments
              </Button>
            </Link>
            <Link to="/create">
              <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                Create Tournament
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
