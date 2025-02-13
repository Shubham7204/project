import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { ContentAnalysis } from './components/ContentAnalysis';
import { DashboardTable } from './components/DashboardTable';
import { useAuth } from './hooks/useAuth';
import { useAnalysis } from './hooks/useAnalysis';

function App() {
  const { isAuthenticated, setIsAuthenticated, handleSignOut } = useAuth();
  const { report, isAnalyzing, currentContent, handleAnalysis } = useAnalysis(() => {});
  const [expandedUrl, setExpandedUrl] = React.useState<string | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {!isAuthenticated ? (
          <Auth onAuth={() => setIsAuthenticated(true)} />
        ) : (
          <Routes>
            <Route path="/" element={
              <Layout title="Content Analysis" onSignOut={handleSignOut}>
                <ContentAnalysis
                  onDrop={handleAnalysis}
                  isAnalyzing={isAnalyzing}
                  currentContent={currentContent}
                  report={report}
                  expandedUrl={expandedUrl}
                  toggleUrlExpansion={(url) => setExpandedUrl(expandedUrl === url ? null : url)}
                />
              </Layout>
            } />

            <Route path="/dashboard" element={
              <Layout title="Dashboard">
                <DashboardTable />
              </Layout>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;