
import React from "react";
import Layout from "@/components/layout/Layout";
import TournamentForm from "@/components/tournaments/TournamentForm";

const CreateTournament = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Tournament</h1>
          <p className="text-gray-500">Start a new PUBG Mobile tournament</p>
        </div>
        
        <TournamentForm />
      </div>
    </Layout>
  );
};

export default CreateTournament;
