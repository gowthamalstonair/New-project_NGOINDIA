import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Filter, Edit, Trash2, Calendar, 
  TrendingUp, BarChart3, PieChart, Target, Search
} from 'lucide-react';

interface BeneficiaryImpactRecord {
  id: string;
  beneficiaryName: string;
  projectName: string;
  indicatorName: string;
  baselineValue: number;
  currentValue: number;
  measurementDate: string;
  remarks: string;
  createdAt: string;
}

interface Beneficiary {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

export function BeneficiaryImpactTracking() {
  const [records, setRecords] = useState<BeneficiaryImpactRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BeneficiaryImpactRecord | null>(null);
  const [filterProject, setFilterProject] = useState('');
  const [filterBeneficiary, setFilterBeneficiary] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for dropdowns
  const beneficiaries: Beneficiary[] = [
    { id: '1', name: 'Arjun Mehta' },
    { id: '2', name: 'Kavya Reddy' },
    { id: '3', name: 'Vikram Joshi' },
    { id: '4', name: 'Meera Gupta' },
    { id: '5', name: 'Rohit Verma' }
  ];

  const projects: Project[] = [
    { id: '1', name: 'Education for All' },
    { id: '2', name: 'Clean Water Initiative' },
    { id: '3', name: 'Healthcare Access Program' },
    { id: '4', name: 'Women Empowerment' },
    { id: '5', name: 'Skill Development Program' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    projectName: '',
    indicatorName: '',
    baselineValue: '',
    currentValue: '',
    measurementDate: '',
    remarks: ''
  });

  // Load records from database
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_impact_records_api.php');
      const result = await response.json();
      if (result.success) {
        const formattedRecords = result.records.map((record: any) => ({
          id: record.id.toString(),
          beneficiaryName: record.beneficiary_name,
          projectName: record.project_name,
          indicatorName: record.indicator_name,
          baselineValue: parseFloat(record.baseline_value),
          currentValue: parseFloat(record.current_value),
          measurementDate: record.measurement_date,
          remarks: record.remarks || '',
          createdAt: record.created_at
        }));
        setRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      // Fallback to sample data
      const sampleRecords: BeneficiaryImpactRecord[] = [
        {
          id: '1',
          beneficiaryName: 'Arjun Mehta',
          projectName: 'Education for All',
          indicatorName: 'Literacy Level',
          baselineValue: 30,
          currentValue: 85,
          measurementDate: '2024-01-15',
          remarks: 'Significant improvement in reading and writing skills',
          createdAt: '2024-01-01'
        }
      ];
      setRecords(sampleRecords);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost/NGO-India/backend/add_impact_record_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beneficiaryName: formData.beneficiaryName,
          projectName: formData.projectName,
          indicatorName: formData.indicatorName,
          baselineValue: parseFloat(formData.baselineValue),
          currentValue: parseFloat(formData.currentValue),
          measurementDate: formData.measurementDate,
          remarks: formData.remarks
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Impact record added successfully!');
        fetchRecords(); // Refresh the records
        resetForm();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving record:', error);
      // Fallback to local storage
      const newRecord: BeneficiaryImpactRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        beneficiaryName: formData.beneficiaryName,
        projectName: formData.projectName,
        indicatorName: formData.indicatorName,
        baselineValue: parseFloat(formData.baselineValue),
        currentValue: parseFloat(formData.currentValue),
        measurementDate: formData.measurementDate,
        remarks: formData.remarks,
        createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString()
      };

      if (editingRecord) {
        setRecords(records.map(r => r.id === editingRecord.id ? newRecord : r));
      } else {
        setRecords([...records, newRecord]);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      beneficiaryName: '',
      projectName: '',
      indicatorName: '',
      baselineValue: '',
      currentValue: '',
      measurementDate: '',
      remarks: ''
    });
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: BeneficiaryImpactRecord) => {
    setEditingRecord(record);
    setFormData({
      beneficiaryName: record.beneficiaryName,
      projectName: record.projectName,
      indicatorName: record.indicatorName,
      baselineValue: record.baselineValue.toString(),
      currentValue: record.currentValue.toString(),
      measurementDate: record.measurementDate,
      remarks: record.remarks
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesProject = !filterProject || record.projectName === filterProject;
    const matchesBeneficiary = !filterBeneficiary || record.beneficiaryName === filterBeneficiary;
    const matchesSearch = !searchTerm || 
      record.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.indicatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesProject && matchesBeneficiary && matchesSearch;
  });

  // Calculate summary statistics
  const totalRecords = records.length;
  const avgImprovement = records.length > 0 
    ? Math.round(records.reduce((sum, r) => {
        const change = r.baselineValue === 0 ? 0 : ((r.currentValue - r.baselineValue) / r.baselineValue * 100);
        return sum + change;
      }, 0) / records.length)
    : 0;
  const positiveImpacts = records.filter(r => r.currentValue > r.baselineValue).length;
  const successRate = totalRecords > 0 ? Math.round((positiveImpacts / totalRecords) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beneficiary Impact Tracking</h1>
            <p className="text-gray-600">Monitor and evaluate beneficiary progress and outcomes</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Impact Record
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalRecords}</h3>
              <p className="text-gray-600">Total Records</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avgImprovement}%</h3>
              <p className="text-gray-600">Avg Improvement</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{positiveImpacts}</h3>
              <p className="text-gray-600">Positive Impacts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{successRate}%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingRecord ? 'Edit Impact Record' : 'Add New Impact Record'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Name *
                  </label>
                  <select
                    value={formData.beneficiaryName}
                    onChange={(e) => setFormData({...formData, beneficiaryName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Beneficiary</option>
                    {beneficiaries.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <select
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indicator Name *
                </label>
                <input
                  type="text"
                  value={formData.indicatorName}
                  onChange={(e) => setFormData({...formData, indicatorName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Literacy Level, Income, Health Score"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baseline Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.baselineValue}
                    onChange={(e) => setFormData({...formData, baselineValue: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Measurement Date *
                  </label>
                  <input
                    type="date"
                    value={formData.measurementDate}
                    onChange={(e) => setFormData({...formData, measurementDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Additional notes or observations..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  {editingRecord ? 'Update Record' : 'Save Record'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          
          <select
            value={filterBeneficiary}
            onChange={(e) => setFilterBeneficiary(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Beneficiaries</option>
            {beneficiaries.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setFilterProject('');
              setFilterBeneficiary('');
              setSearchTerm('');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Impact Records ({filteredRecords.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Beneficiary</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Project</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Indicator</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Baseline</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Current</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Change</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const change = record.currentValue - record.baselineValue;
                const changePercent = Math.round((change / record.baselineValue) * 100);
                const isPositive = change > 0;
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {record.beneficiaryName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.projectName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.indicatorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.baselineValue}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.currentValue}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPositive 
                          ? 'bg-green-100 text-green-800' 
                          : change === 0 
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isPositive ? '+' : ''}{changePercent}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.measurementDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">
                {records.length === 0 
                  ? 'Start by adding your first impact record.' 
                  : 'Try adjusting your filters or search terms.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Summary Charts */}
      {records.length > 0 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Impact Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Impact Distribution
            </h3>
            <div className="space-y-4">
              {projects.map(project => {
                const projectRecords = records.filter(r => r.projectName === project.name);
                const avgImprovement = projectRecords.length > 0 
                  ? Math.round(projectRecords.reduce((sum, r) => sum + ((r.currentValue - r.baselineValue) / r.baselineValue * 100), 0) / projectRecords.length)
                  : 0;
                
                return (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{projectRecords.length} records</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${avgImprovement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {avgImprovement > 0 ? '+' : ''}{avgImprovement}%
                      </p>
                      <p className="text-xs text-gray-500">avg change</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Baseline vs Current Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Baseline vs Current Values
            </h3>
            <div className="space-y-4">
              {records.slice(0, 5).map(record => {
                const maxValue = Math.max(record.baselineValue, record.currentValue);
                const baselineWidth = (record.baselineValue / maxValue) * 100;
                const currentWidth = (record.currentValue / maxValue) * 100;
                
                return (
                  <div key={record.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">{record.beneficiaryName}</p>
                      <p className="text-xs text-gray-500">{record.indicatorName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Baseline:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-400 h-2 rounded-full" 
                            style={{ width: `${baselineWidth}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-12">{record.baselineValue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Current:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${currentWidth}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-12">{record.currentValue}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}