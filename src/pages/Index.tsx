
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <Trophy className="h-10 w-10 text-primary mr-3" />
              <h1 className="text-3xl font-bold">PUBG Tournament Manager</h1>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
              The Ultimate PUBG Mobile Tournament Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create, manage, and track PUBG Mobile tournament standings with ease. Perfect for tournament organizers of all sizes.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link to="/tournaments">
                  <Button size="lg" className="flex items-center">
                    My Tournaments
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="flex items-center">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              {user && (
                <Link to="/create">
                  <Button size="lg" variant="outline">
                    Create New Tournament
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <img
              src="/placeholder.svg"
              alt="PUBG Tournament illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Manage Tournaments</h3>
            <p className="text-gray-600">
              Create and manage multiple tournaments with customizable formats and point systems.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Track Teams</h3>
            <p className="text-gray-600">
              Keep track of teams, their performances, and match statistics throughout your tournament.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Live Leaderboards</h3>
            <p className="text-gray-600">
              Real-time standings and leaderboards that update automatically as you enter match results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
