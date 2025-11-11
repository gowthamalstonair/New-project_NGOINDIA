import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, Plus, Calendar, Target,
  TrendingUp, CheckCircle, Clock, BarChart3, BookOpen
} from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { CreateProject } from '../CreateProject';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatNumber } from '../../utils/formatNumber';

export function ProjectMonitoring() {
  useScrollReset();
  const { projects, tasks, updateTask } = useDashboard();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_projects_api.php');
      const result = await response.json();
      if (result.success) {
        setDbProjects(result.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine context projects with database projects
  const allProjects = [...projects, ...dbProjects];

  // Quick Actions handlers
  const handleGenerateReport = () => {
    const reportData = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
      avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length),
      generatedAt: new Date().toLocaleString()
    };
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Project Monitoring Report</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
          .header h1 { color: #f97316; margin: 0; font-size: 28px; }
          .header p { color: #666; margin: 5px 0; }
          .section { margin: 30px 0; }
          .section h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          .stats-grid { display: flex; justify-content: space-between; margin: 20px 0; }
          .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; flex: 1; margin: 0 10px; }
          .stat-value { font-size: 20px; font-weight: bold; color: #f97316; }
          .stat-label { color: #666; font-size: 12px; }
          .project-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
          .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .project-name { font-size: 16px; font-weight: bold; color: #374151; }
          .status { padding: 3px 8px; border-radius: 15px; font-size: 10px; font-weight: bold; background: #dcfce7; color: #166534; }
          .progress-bar { background: #e5e7eb; height: 6px; border-radius: 3px; margin: 8px 0; }
          .progress-fill { height: 100%; border-radius: 3px; background: #10b981; }
          .project-details { display: flex; justify-content: space-between; margin-top: 10px; }
          .detail-item { text-align: center; flex: 1; }
          .detail-value { font-weight: bold; color: #374151; font-size: 14px; }
          .detail-label { font-size: 10px; color: #666; }
          .tasks-section { margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
          .task-item { display: flex; align-items: center; padding: 5px 0; font-size: 12px; }
          .task-status { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
          .task-status.completed { background: #10b981; }
          .task-status.pending { background: #e5e7eb; }
          .task-title { flex: 1; }
          .task-priority { padding: 2px 6px; border-radius: 8px; font-size: 8px; background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PROJECT MONITORING REPORT</h1>
          <p>NGO INDIA - Creating Lasting Change</p>
          <p>Generated: ${reportData.generatedAt}</p>
        </div>
        
        <div class="section">
          <h2>Executive Summary</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${reportData.totalProjects}</div>
              <div class="stat-label">Total Projects</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reportData.activeProjects}</div>
              <div class="stat-label">Active Projects</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reportData.avgProgress}%</div>
              <div class="stat-label">Average Progress</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Budget Overview</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">₹${formatNumber(reportData.totalBudget)}</div>
              <div class="stat-label">Total Budget</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹${formatNumber(reportData.totalSpent)}</div>
              <div class="stat-label">Total Spent</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹${formatNumber(reportData.totalBudget - reportData.totalSpent)}</div>
              <div class="stat-label">Remaining</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Project Details</h2>
          ${projects.map(project => {
            const projectTasks = tasks.filter(t => t.project === project.name);
            const progressClass = project.progress >= 80 ? 'high' : project.progress >= 50 ? 'medium' : 'low';
            return `
              <div class="project-card">
                <div class="project-header">
                  <div class="project-name">${project.name}</div>
                  <span class="status ${project.status}">${project.status.toUpperCase()}</span>
                </div>
                <p style="color: #666; margin-bottom: 15px;">${project.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                  <span style="font-size: 14px; color: #666;">${project.startDate} - ${project.endDate}</span>
                  <span style="font-size: 18px; font-weight: bold;">${project.progress}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill ${progressClass}" style="width: ${project.progress}%;"></div>
                </div>
                <div class="project-details">
                  <div class="detail-item">
                    <div class="detail-value">₹${formatNumber(project.spent)}</div>
                    <div class="detail-label">Spent</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-value">₹${formatNumber(project.budget - project.spent)}</div>
                    <div class="detail-label">Remaining</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-value">${Math.round((project.spent / project.budget) * 100)}%</div>
                    <div class="detail-label">Budget Used</div>
                  </div>
                </div>
                ${projectTasks.length > 0 ? `
                  <div class="tasks-section">
                    <h4 style="margin: 0 0 10px 0; color: #374151;">Project Tasks (${projectTasks.length})</h4>
                    ${projectTasks.map(task => `
                      <div class="task-item">
                        <div class="task-status ${task.status}"></div>
                        <div class="task-title" style="${task.status === 'completed' ? 'text-decoration: line-through; color: #9ca3af;' : ''}">${task.title}</div>
                        <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #f97316; text-align: center; color: #666; font-size: 12px;">
          <p>© 2025 NGO INDIA. All rights reserved.</p>
          <p>This report contains confidential information. Please handle with care.</p>
        </div>
      </body>
      </html>
    `;
    
    // Create a hidden iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);
    
    // Write content to iframe
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(htmlContent);
    iframe.contentDocument?.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
    
    alert('PDF generation started. Please choose "Save as PDF" in the print dialog.');
  };

  const handleScheduleReview = () => {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 7); // Schedule for next week
    
    const reviewData = {
      date: reviewDate.toLocaleDateString(),
      projects: projects.filter(p => p.status === 'active').map(p => p.name),
      scheduledAt: new Date().toLocaleString()
    };
    
    alert(`Review scheduled for ${reviewData.date}\n\nProjects to review:\n${reviewData.projects.map(name => `• ${name}`).join('\n')}\n\nScheduled at: ${reviewData.scheduledAt}`);
  };

  const handleUpdateTimeline = () => {
    const activeProjects = projects.filter(p => p.status === 'active');
    if (activeProjects.length === 0) {
      alert('No active projects to update.');
      return;
    }
    
    const updates = activeProjects.map(p => {
      const daysRemaining = Math.ceil((new Date(p.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return `${p.name}: ${daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}`;
    });
    
    alert(`Timeline Update:\n\n${updates.join('\n')}\n\nLast updated: ${new Date().toLocaleString()}`);
  };

  const handleExportData = () => {
    const exportData = {
      projects: projects.map(p => ({
        name: p.name,
        status: p.status,
        progress: p.progress,
        budget: p.budget,
        spent: p.spent,
        startDate: p.startDate,
        endDate: p.endDate,
        description: p.description
      })),
      tasks: tasks.map(t => ({
        title: t.title,
        project: t.project,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        description: t.description
      })),
      exportedAt: new Date().toISOString()
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Project data exported successfully!');
  };

  // Knowledge Hub handler
  const handleKnowledgeHub = () => {
    window.history.pushState({ module: 'projects' }, '', window.location.href);
    localStorage.setItem('activeModule', 'knowledge');
    window.location.reload();
  };

  // Back button handler for history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.module) {
        localStorage.setItem('activeModule', event.state.module);
        window.location.reload();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dashboard stats
  const stats = [
    {
      label: 'Active Projects',
      value: formatNumber(allProjects.filter((p: any) => p.status === 'active').length),
      icon: FolderOpen,
      color: 'text-blue-600'
    },
    {
      label: 'Total Budget',
      value: `₹${formatNumber(allProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0))}`,
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Avg. Progress',
      value: `${allProjects.length > 0 ? Math.round(allProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / allProjects.length) : 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  // Helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const projectTasks = selectedProject ? tasks.filter((t: any) => t.project === selectedProject) : [];

  // If user clicked "New Project", show create form
  if (showCreate) {
    return <CreateProject onBack={() => setShowCreate(false)} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Monitoring</h1>
            <p className="text-gray-600">Track project progress and manage resources</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCreate(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
            <button 
              onClick={handleKnowledgeHub}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Knowledge Hub
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {allProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedProject === project.name ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProject(selectedProject === project.name ? null : project.name)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {project.startDate} - {project.endDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            ₹{(project.budget / 100000).toFixed(1)}L budget
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{project.progress}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${getProgressColor(project.progress)} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-900">₹{(project.spent / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-600">Spent</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-900">₹{((project.budget - project.spent) / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-900">{Math.round((project.spent / project.budget) * 100)}%</div>
                        <div className="text-sm text-gray-600">Budget Used</div>
                      </div>
                    </div>

                    {/* Project Tasks */}
                    {selectedProject === project.name && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Tasks</h4>
                        <div className="space-y-3">
                          {projectTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTask(task.id, { 
                                    status: task.status === 'completed' ? 'pending' : 'completed' 
                                  });
                                }}
                                className={`p-1 rounded-full ${
                                  task.status === 'completed' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <div className="flex-1">
                                <h5 className={`font-medium ${
                                  task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </h5>
                                <p className="text-sm text-gray-600">{task.description}</p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Project Health</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">On Track</p>
                  <p className="text-sm text-gray-600">2 projects ahead of schedule</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Needs Attention</p>
                  <p className="text-sm text-gray-600">1 project behind schedule</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Resource Allocation</p>
                  <p className="text-sm text-gray-600">Balanced across all projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Impact Metrics</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">12,450</div>
                <div className="text-sm text-blue-700">Beneficiaries Reached</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">45</div>
                <div className="text-sm text-green-700">Villages Covered</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">92%</div>
                <div className="text-sm text-purple-700">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={handleGenerateReport}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Generate Report
              </button>
              <button 
                onClick={handleScheduleReview}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Schedule Review
              </button>
              <button 
                onClick={handleUpdateTimeline}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Update Timeline
              </button>
              <button 
                onClick={handleExportData}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
