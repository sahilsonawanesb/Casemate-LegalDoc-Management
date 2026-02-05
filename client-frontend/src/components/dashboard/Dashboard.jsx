// frontend/src/components/dashboard/Dashboard.js
import React from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import AttorneyDashboard from './AttorneyDashboard.jsx';
import AssistantDashboard from './AssistantDashboard.jsx';
import ClientDashboard from './ClientDashboard.jsx';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Please log in to access your dashboard</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'attorney':
      return <AttorneyDashboard user={user} />;
    case 'assistant':
      return <AssistantDashboard user={user} />;
    case 'client':
      return <ClientDashboard user={user} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-red-600">Invalid user role</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;