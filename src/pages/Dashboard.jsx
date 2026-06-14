import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, CreditCard, XCircle, 
  MessageSquare, Heart, LockOpen, DollarSign,
  CheckCircle, User, FileText, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const formatCurrency = (num) => {
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(1) + 'k';
  return '$' + num.toString();
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/live-dashboard`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)' }}>Loading Live Dashboard...</div>;
  }

  const { stats, charts, recentActivity } = data;

  const getIconForActivity = (iconType) => {
    switch (iconType) {
      case 'check': return <CheckCircle size={16} color="#10B981" />;
      case 'user': return <User size={16} color="#3B82F6" />;
      case 'post': return <FileText size={16} color="#3B82F6" />;
      case 'alert': return <AlertCircle size={16} color="#EF4444" />;
      default: return <CheckCircle size={16} color="#10B981" />;
    }
  };

  const getBgForActivity = (iconType) => {
    switch (iconType) {
      case 'check': return '#D1FAE5';
      case 'user': return '#DBEAFE';
      case 'post': return '#DBEAFE';
      case 'alert': return '#FEE2E2';
      default: return '#D1FAE5';
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B'];

  return (
    <div className="live-dashboard">
      <div className="dashboard-header">
        <h1>ChemNexus Live System Dashboard</h1>
        <p>Live system overview</p>
      </div>

      <div className="dashboard-layout">
        {/* Left Column: Stats & Charts */}
        <div className="main-content">
          
          {/* 4x2 Stats Grid */}
          {/* 3x3 Stats Grid */}
          <div className="stats-grid-light" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#DBEAFE', color: '#3B82F6'}}>
                <Users size={18} />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">
                {formatNumber(stats.totalUsers)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#E0E7FF', color: '#6366F1'}}>
                <FileText size={18} />
              </div>
              <div className="stat-title">Total Directory</div>
              <div className="stat-value">
                {formatNumber(stats.totalDirectory)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#D1FAE5', color: '#10B981'}}>
                <MessageSquare size={18} />
              </div>
              <div className="stat-title">Total Posts</div>
              <div className="stat-value">
                {formatNumber(stats.totalPosts)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#FEF3C7', color: '#F59E0B'}}>
                <Clock size={18} />
              </div>
              <div className="stat-title">Pending Approvals</div>
              <div className="stat-value">
                {formatNumber(stats.pendingApprovals)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#FCE7F3', color: '#EC4899'}}>
                <LockOpen size={18} />
              </div>
              <div className="stat-title">Contact Unlocked</div>
              <div className="stat-value">
                {formatNumber(stats.contactUnlocks)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#DBEAFE', color: '#3B82F6'}}>
                <User size={18} />
              </div>
              <div className="stat-title">Free Users (Trial)</div>
              <div className="stat-value">
                {formatNumber(stats.freeUsers)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#D1FAE5', color: '#10B981'}}>
                <CreditCard size={18} />
              </div>
              <div className="stat-title">Paid Users</div>
              <div className="stat-value">
                {formatNumber(stats.paidUsers)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#FEE2E2', color: '#EF4444'}}>
                <XCircle size={18} />
              </div>
              <div className="stat-title">Expired Free Users</div>
              <div className="stat-value">
                {formatNumber(stats.expiredFreeUsers)}
              </div>
            </div>

            <div className="stat-card-light">
              <div className="icon-wrapper" style={{background: '#FEE2E2', color: '#EF4444'}}>
                <AlertCircle size={18} />
              </div>
              <div className="stat-title">Expired Paid Users</div>
              <div className="stat-value">
                {formatNumber(stats.expiredPaidUsers)}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Revenue Line Chart */}
            <div className="chart-card">
              <h3>Revenue vs Time (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.revenueChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Interests vs Posts Bar Chart */}
            <div className="chart-card">
              <h3>Interests vs Posts Ratio</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.interestsVsPostsChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="posts" fill="#60A5FA" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="interests" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Type Donut Chart */}
            <div className="chart-card">
              <h3>User Type Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.userTypeDistribution}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.userTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend manually crafted below */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                {charts.userTypeDistribution.map((entry, index) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#6B7280' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity Sidebar */}
        <div className="sidebar-panel">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <p style={{color: '#6B7280', fontSize: '13px'}}>No recent activity.</p>
            ) : (
              recentActivity.map((log) => (
                <div key={log._id} className="activity-item">
                  <div className="activity-icon" style={{ background: getBgForActivity(log.icon) }}>
                    {getIconForActivity(log.icon)}
                  </div>
                  <div className="activity-content">
                    <h4>{log.description.split(':')[0]}:</h4>
                    {log.description.includes(':') && (
                      <h4 style={{color: '#374151', fontWeight: 500}}>
                        {log.description.substring(log.description.indexOf(':') + 1).trim()}
                      </h4>
                    )}
                    <p>{timeAgo(log.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
