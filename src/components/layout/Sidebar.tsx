
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Download, 
  Settings,
  Trophy
} from "lucide-react";
import { useTournament } from "@/context/TournamentContext";

const Sidebar = () => {
  const { currentTournament } = useTournament();

  const links = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Tournaments", path: "/tournaments", icon: <Trophy size={20} /> }
  ];

  const tournamentLinks = currentTournament ? [
    { name: "Dashboard", path: `/tournament/${currentTournament.id}`, icon: <BarChart3 size={20} /> },
    { name: "Teams", path: `/tournament/${currentTournament.id}/teams`, icon: <Users size={20} /> },
    { name: "Matches", path: `/tournament/${currentTournament.id}/matches`, icon: <Calendar size={20} /> },
    { name: "Results", path: `/tournament/${currentTournament.id}/results`, icon: <BarChart3 size={20} /> },
    { name: "Export", path: `/tournament/${currentTournament.id}/export`, icon: <Download size={20} /> },
    { name: "Settings", path: `/tournament/${currentTournament.id}/settings`, icon: <Settings size={20} /> }
  ] : [];

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white hidden md:block">
      <div className="p-5">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Navigation</h2>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-700 text-yellow-400"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {currentTournament && (
          <>
            <div className="my-6 border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-2">{currentTournament.name}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {currentTournament.description || "Tournament management"}
              </p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                {tournamentLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-gray-700 text-yellow-400"
                            : "text-gray-300 hover:bg-gray-700"
                        }`
                      }
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
