import React, { useEffect } from "react";
import { useUnit } from "effector-react";
import { loadJsonFx } from "./store";
import { BladesTable } from "./components/BladesTable";
import { FilterPanel } from "./components/FilterPanel";
import { LoadingSpinner } from "./components/LoadingSpinner";

export const App: React.FC = () => {
  const [loading] = useUnit([loadJsonFx.pending]);

  useEffect(() => {
    loadJsonFx();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blade-primary to-blade-secondary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🏓 Table Tennis Database</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        {loading ? (
          <div className="flex items-center align-center justify-center flex-grow">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <FilterPanel />
            <div className="overflow-x-auto">
              <BladesTable />
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Table Tennis Database Viewer</p>
        </div>
      </footer>
    </div>
  );
};
