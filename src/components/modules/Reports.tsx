import React, { useState } from 'react';
import { 
  FileText, Download, TrendingUp, 
  IndianRupee, Users, Target, BarChart3,
  Eye, Share2, Mail, Printer, RefreshCw
} from 'lucide-react';
import { Bar, BarChart, Tooltip, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart, Legend } from 'recharts';
import { useDashboard } from '../../contexts/DashboardContext';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatNumber } from '../../utils/formatNumber';

export function Reports() {
  useScrollReset();
  const { donations, projects, expenses } = useDashboard();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'overview',
      title: 'Overview Report',
      description: 'Comprehensive summary of all activities',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Donations, expenses, and budget analysis',
      icon: IndianRupee,
      color: 'text-green-600'
    },
    {
      id: 'projects',
      title: 'Project Report',
      description: 'Project progress and impact metrics',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      id: 'donors',
      title: 'Donor Report',
      description: 'Donor engagement and contribution analysis',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'impact',
      title: 'Impact Report',
      description: 'Beneficiary outcomes and success stories',
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ];

  const recentReports = [
    {
      id: '1',
      title: 'Q4 2024 Financial Summary',
      type: 'Financial',
      generatedDate: '2025-01-15',
      size: '2.4 MB',
      status: 'Ready'
    },
    {
      id: '2',
      title: 'December Impact Assessment',
      type: 'Impact',
      generatedDate: '2025-01-10',
      size: '1.8 MB',
      status: 'Ready'
    },
    {
      id: '3',
      title: 'Project Progress - Education Initiative',
      type: 'Project',
      generatedDate: '2025-01-08',
      size: '3.2 MB',
      status: 'Ready'
    },
    {
      id: '4',
      title: 'Donor Engagement Analysis',
      type: 'Donor',
      generatedDate: '2025-01-05',
      size: '1.5 MB',
      status: 'Processing'
    }
  ];

  // Chart data for different reports
  const monthlyDonations = [
    { month: 'Jan', amount: 1200000 },
    { month: 'Feb', amount: 1500000 },
    { month: 'Mar', amount: 1800000 },
    { month: 'Apr', amount: 2000000 },
    { month: 'May', amount: 2200000 },
    { month: 'Jun', amount: 2500000 },
  ];

  const expenseDistribution = [
    { name: 'Program Materials', value: 45, amount: 1800000 },
    { name: 'Equipment', value: 25, amount: 1000000 },
    { name: 'Travel', value: 15, amount: 600000 },
    { name: 'Administrative', value: 10, amount: 400000 },
    { name: 'Other', value: 5, amount: 200000 }
  ];

  const donorCategories = [
    { name: 'Individual', value: 40, count: 1250 },
    { name: 'Corporate', value: 35, count: 85 },
    { name: 'Foundations', value: 25, count: 45 }
  ];

  // Enhanced project data with proper budget/spent values
  const projectProgress = [
    { project: 'Education Initiative', budget: 50, spent: 35, progress: 70 },
    { project: 'Healthcare Program', budget: 32, spent: 22.4, progress: 70 },
    { project: 'Clean Water Project', budget: 28, spent: 25.2, progress: 90 },
    { project: 'Women Empowerment', budget: 15, spent: 9, progress: 60 }
  ];

  // Monthly project progress data for timeline chart
  const monthlyProjectProgress = [
    { month: 'Jan', completed: 2, ongoing: 4, planned: 2 },
    { month: 'Feb', completed: 3, ongoing: 5, planned: 1 },
    { month: 'Mar', completed: 4, ongoing: 4, planned: 3 },
    { month: 'Apr', completed: 5, ongoing: 6, planned: 2 },
    { month: 'May', completed: 6, ongoing: 5, planned: 4 },
    { month: 'Jun', completed: 7, ongoing: 6, planned: 3 }
  ];

  // Project category distribution
  const projectCategories = [
    { name: 'Education', value: 35, projects: 4 },
    { name: 'Healthcare', value: 30, projects: 3 },
    { name: 'Environment', value: 20, projects: 2 },
    { name: 'Women Empowerment', value: 15, projects: 2 }
  ];

  const impactMetrics = [
    { month: 'Jan', beneficiaries: 8000, programs: 12 },
    { month: 'Feb', beneficiaries: 9500, programs: 14 },
    { month: 'Mar', beneficiaries: 11200, programs: 16 },
    { month: 'Apr', beneficiaries: 13800, programs: 18 },
    { month: 'May', beneficiaries: 15600, programs: 20 },
    { month: 'Jun', beneficiaries: 18200, programs: 22 }
  ];

  const categoryColors = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    alert('Report generated successfully!');
  };

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report: ${reportId}`);
    alert(`Opening report viewer for report ${reportId}`);
  };

  const handleDownloadReport = (reportId: string, title: string) => {
    console.log(`Downloading report: ${reportId}`);
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSA4IFRmCjEwMCA3MDAgVGQKKFJlcG9ydCBDb250ZW50KSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzIyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE0CiUlRU9G';
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Downloaded: ${title}`);
  };

  const handleShareReport = () => {
    const reportTitle = reportTypes.find(r => r.id === selectedReport)?.title || 'Report';
    if (navigator.share) {
      navigator.share({
        title: reportTitle,
        text: `Check out this ${reportTitle} from NGO INDIA`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Report link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  const handleEmailReport = () => {
    const reportTitle = reportTypes.find(r => r.id === selectedReport)?.title || 'Report';
    const subject = encodeURIComponent(`${reportTitle} - NGO INDIA`);
    const body = encodeURIComponent(`Please find the ${reportTitle} attached. Generated on ${new Date().toLocaleDateString()}.\n\nBest regards,\nNGO INDIA Team`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportReport = () => {
    const reportTitle = reportTypes.find(r => r.id === selectedReport)?.title || 'Report';
    const reportData = {
      title: reportTitle,
      period: selectedPeriod,
      generatedDate: new Date().toISOString(),
      data: {
        donations: donations,
        projects: projects,
        expenses: expenses
      }
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert(`Exported: ${reportTitle}`);
  };

  const renderOverviewReport = () => {
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const activeProjects = projects.filter(p => p.status === 'active').length;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">₹{formatNumber(totalDonations)}</h3>
                <p className="text-gray-600">Total Donations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-50">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">₹{formatNumber(totalExpenses)}</h3>
                <p className="text-gray-600">Total Expenses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{formatNumber(activeProjects)}</h3>
                <p className="text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{formatNumber(50000)}+</h3>
                <p className="text-gray-600">Lives Impacted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyDonations}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip formatter={(value) => [`₹${(Number(value)/100000).toFixed(1)}L`, 'Donations']} />
                <Bar dataKey="amount" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={expenseDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {expenseDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {expenseDistribution.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[i] }}></span>
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Budget</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Spent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{project.name}</td>
                    <td className="py-3 px-4 text-gray-700">₹{(project.budget / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-4 text-gray-700">₹{(project.spent / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Donations</span>
              <span className="font-semibold">₹{formatNumber(donations.reduce((sum, d) => sum + d.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recurring Donations</span>
              <span className="font-semibold">₹{formatNumber(donations.filter(d => d.type === 'recurring').reduce((sum, d) => sum + d.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">One-time Donations</span>
              <span className="font-semibold">₹{formatNumber(donations.filter(d => d.type === 'one-time').reduce((sum, d) => sum + d.amount, 0))}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Program Materials</span>
              <span className="font-semibold">₹{formatNumber(expenses.filter(e => e.category === 'Program Materials').reduce((sum, e) => sum + e.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equipment</span>
              <span className="font-semibold">₹{formatNumber(expenses.filter(e => e.category === 'Equipment').reduce((sum, e) => sum + e.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Travel</span>
              <span className="font-semibold">₹{formatNumber(expenses.filter(e => e.category === 'Travel').reduce((sum, e) => sum + e.amount, 0))}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Net Balance</span>
              <span className="font-semibold text-green-600">₹{formatNumber(donations.reduce((sum, d) => sum + d.amount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Burn Rate</span>
              <span className="font-semibold">₹{formatNumber(expenses.reduce((sum, e) => sum + e.amount, 0) / 30)}/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency Ratio</span>
              <span className="font-semibold">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyDonations}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
              <Tooltip formatter={(value) => [`₹${(Number(value)/100000).toFixed(1)}L`, 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#dcfce7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={expenseDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {expenseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderProjectReport = () => (
    <div className="space-y-6">
      {/* Project Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">{formatNumber(projects.length)}</h3>
            <p className="text-gray-600">Total Projects</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600">{formatNumber(projects.filter(p => p.status === 'active').length)}</h3>
            <p className="text-gray-600">Active Projects</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">{formatNumber(projects.filter(p => p.status === 'completed').length)}</h3>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-orange-600">{formatNumber(Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length))}%</h3>
            <p className="text-gray-600">Avg Progress</p>
          </div>
        </div>
      </div>

      {/* Project Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Budget vs Spending */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Budget vs Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgress} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" tickFormatter={(value) => `₹${value}L`} />
              <YAxis type="category" dataKey="project" width={100} />
              <Tooltip formatter={(value) => [`₹${value}L`, '']} />
              <Legend />
              <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
              <Bar dataKey="spent" fill="#f97316" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={projectCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {projectCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.projects} projects)`, name]} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {projectCategories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[i] }}></span>
                <span className="text-sm text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Project Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Project Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyProjectProgress}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="ongoing" stackId="a" fill="#f97316" name="Ongoing" />
            <Bar dataKey="planned" stackId="a" fill="#6b7280" name="Planned" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Details Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Project Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Budget</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Spent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{project.name}</td>
                  <td className="py-3 px-4 text-gray-700">₹{formatNumber(project.budget)}</td>
                  <td className="py-3 px-4 text-gray-700">₹{formatNumber(project.spent)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{project.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDonorReport = () => (
    <div className="space-y-6">
      {/* Donor Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">{formatNumber(1380)}</h3>
            <p className="text-gray-600">Total Donors</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600">{formatNumber(284)}</h3>
            <p className="text-gray-600">New This Month</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">92%</h3>
            <p className="text-gray-600">Retention Rate</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-purple-600">₹{formatNumber(18200)}</h3>
            <p className="text-gray-600">Avg Donation</p>
          </div>
        </div>
      </div>

      {/* Donor Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={donorCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {donorCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.count} donors)`, name]} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {donorCategories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[i] }}></span>
                <span className="text-sm text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyDonations}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
              <Tooltip formatter={(value) => [`₹${(Number(value)/100000).toFixed(1)}L`, 'Donations']} />
              <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderImpactReport = () => (
    <div className="space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">{formatNumber(18200)}</h3>
            <p className="text-gray-600">Lives Impacted</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600">{formatNumber(22)}</h3>
            <p className="text-gray-600">Active Programs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">85%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-red-600">₹{formatNumber(275)}</h3>
            <p className="text-gray-600">Cost per Beneficiary</p>
          </div>
        </div>
      </div>

      {/* Impact Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Beneficiaries Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={impactMetrics}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Beneficiaries']} />
              <Area type="monotone" dataKey="beneficiaries" stroke="#ef4444" fill="#fef2f2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Expansion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={impactMetrics}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Programs']} />
              <Bar dataKey="programs" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Education Initiative Success</h4>
            <p className="text-sm text-green-700">Over 2,500 children gained access to quality education through our school infrastructure program.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Healthcare Milestone</h4>
            <p className="text-sm text-blue-700">Mobile health clinics reached 15,000 rural beneficiaries with essential medical care.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and analyze organizational performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Report Types Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h2>
            <nav className="space-y-2">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                      selectedReport === report.id
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${report.color}`} />
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{report.type} • {report.size}</span>
                    <span>{report.generatedDate}</span>
                  </div>
                  {report.status === 'Ready' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => handleViewReport(report.id)}
                        className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(report.id, report.title)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Report Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {reportTypes.find(r => r.id === selectedReport)?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {reportTypes.find(r => r.id === selectedReport)?.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShareReport}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share Report"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleEmailReport}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Email Report"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handlePrintReport}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Print Report"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleExportReport}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {selectedReport === 'overview' && renderOverviewReport()}
              {selectedReport === 'financial' && renderFinancialReport()}
              {selectedReport === 'projects' && renderProjectReport()}
              {selectedReport === 'donors' && renderDonorReport()}
              {selectedReport === 'impact' && renderImpactReport()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
