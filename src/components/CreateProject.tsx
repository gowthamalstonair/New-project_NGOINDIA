import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function CreateProject({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [recommendations, setRecommendations] = useState<{ category: string; value: number }[]>([]);

  // Budget allocation rules
  const budgetRules: Record<string, { category: string; percent: number }[]> = {
    education: [
      { category: 'Books & Materials', percent: 30 },
      { category: 'Teacher Support', percent: 25 },
      { category: 'Transport', percent: 15 },
      { category: 'Food & Essentials', percent: 15 },
      { category: 'Miscellaneous', percent: 15 },
    ],
    healthcare: [
      { category: 'Medicines', percent: 35 },
      { category: 'Hospital Support', percent: 30 },
      { category: 'Transport', percent: 10 },
      { category: 'Food & Essentials', percent: 10 },
      { category: 'Miscellaneous', percent: 15 },
    ],
    infrastructure: [
      { category: 'Construction Materials', percent: 40 },
      { category: 'Labor', percent: 25 },
      { category: 'Electricity / Current Bill', percent: 15 },
      { category: 'Transport', percent: 10 },
      { category: 'Miscellaneous', percent: 10 },
    ],
    environment: [
      { category: 'Tree Plantation', percent: 35 },
      { category: 'Awareness Campaigns', percent: 25 },
      { category: 'Transport', percent: 15 },
      { category: 'Waste Management', percent: 15 },
      { category: 'Miscellaneous', percent: 10 },
    ],
  };

  // Calculate recommendations whenever amount or purpose changes
  useEffect(() => {
    if (amount && amount > 0 && purpose && budgetRules[purpose]) {
      const rules = budgetRules[purpose];
      const allocations = rules.map((rule) => ({
        category: rule.category,
        value: (amount * rule.percent) / 100,
      }));
      setRecommendations(allocations);
    } else {
      setRecommendations([]);
    }
  }, [amount, purpose]);

  // Total of all recommended allocations
  const total = recommendations.reduce((sum, r) => sum + r.value, 0);

  // Colors for pie chart and table
  const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#6366f1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 transition-all duration-300 hover:shadow-gray-300/70">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
          Create New Project
        </h1>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          <input
            type="text"
            placeholder="Enter Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
          />

          <textarea
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
            rows={4}
          />

          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
          >
            <option value="">Select Purpose</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="environment">Environment</option>
          </select>

          <input
            type="number"
            placeholder="Enter Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
          />
        </div>

        {/* Budget Recommendation */}
        {recommendations.length > 0 && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Table View */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                Budget Planning Overview ({purpose.charAt(0).toUpperCase() + purpose.slice(1)})
              </h2>
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Category</th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b text-right">Allocation (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium border-b">{rec.category}</td>
                        <td className="px-6 py-4 border-b text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-gray-700">₹{rec.value.toFixed(2)}</span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                              <div
                                className="h-2 bg-orange-500 rounded-full"
                                style={{ width: `${(rec.value / total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-200 font-bold">
                      <td className="px-6 py-4">Total</td>
                      <td className="px-6 py-4 text-right">₹{total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Polished Donut Chart */}
            <div className="flex justify-center items-center">
              <PieChart width={320} height={320}>
                <Pie
                  data={recommendations}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}   // donut hole
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="category"

                >
                  {recommendations.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `₹${val.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-12">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!name || !description || !purpose || !amount) {
                alert('Please fill all fields');
                return;
              }
              
              try {
                const response = await fetch('http://localhost/NGO-India/backend/add_project_api.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name,
                    description,
                    purpose,
                    amount,
                    budget_allocation: JSON.stringify(recommendations)
                  })
                });
                
                const result = await response.json();
                if (result.success) {
                  alert('Project created successfully!');
                  onBack();
                } else {
                  alert('Error creating project: ' + result.message);
                }
              } catch (error) {
                console.error('Error:', error);
                alert('Error creating project');
              }
            }}
            className="px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
