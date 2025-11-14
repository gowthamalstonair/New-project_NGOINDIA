import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, Package, CheckCircle, Clock, Award, Filter } from 'lucide-react';

interface GrantPagesProps {
  type: 'details' | 'matches';
}

export function GrantPages({ type }: GrantPagesProps) {
  const { id } = useParams<{ id: string }>();

  const mockData = {
    'rural-education': {
      title: 'Rural Education Program',
      category: 'Education',
      amount: 300000,
      status: 'submitted',
      date: '2024-01-15'
    },
    'health-initiative': {
      title: 'Community Health Initiative',
      category: 'Healthcare',
      amount: 450000,
      status: 'under_review',
      date: '2024-01-20'
    }
  };

  const data = mockData[id as keyof typeof mockData] || mockData['rural-education'];

  if (type === 'details') {
    return (
      <div className="p-8">
        <button onClick={() => {
          localStorage.setItem('activeModule', 'grant-applications');
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }} className="mb-6 text-orange-600 hover:text-orange-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
        <p className="text-gray-600 mb-6">{data.category} Grant</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Matching Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills Matched:</span>
                    <span className="font-medium text-green-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resources Matched:</span>
                    <span className="font-medium text-blue-600">4</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitations Sent</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Priya Sharma</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">sent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tech Solutions</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">accepted</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Matches</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">PS</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Priya Sharma</div>
                      <div className="text-sm text-green-600">Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">TS</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Tech Solutions</div>
                      <div className="text-sm text-green-600">Active</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{data.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{data.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{data.date}</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={() => {
        localStorage.setItem('activeModule', 'grant-applications');
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }} className="mb-6 text-orange-600 hover:text-orange-800 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Matching Suggestions</h2>
          <div className="flex gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Matches</option>
              <option value="90">90%+ Match</option>
              <option value="75">75%+ Match</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Volunteer Matches
            </h3>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
                <input type="checkbox" className="absolute top-2 left-2" />
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">⭐ Best Match</div>
                <div className="flex justify-between items-start mb-3 ml-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Priya Sharma</h4>
                    <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">92% match</div>
                    <div className="text-xs text-gray-500">★ 4.8</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Teaching</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Curriculum Development</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">Check Availability</button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Reject</button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
                <input type="checkbox" className="absolute top-2 left-2" />
                <div className="flex justify-between items-start mb-3 ml-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Delhi, NCR</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">85% match</div>
                    <div className="text-xs text-gray-500">★ 4.6</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Project Management</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Training</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">Check Availability</button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Reject</button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Resource Matches
            </h3>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
                <input type="checkbox" className="absolute top-2 left-2" />
                <div className="flex justify-between items-start mb-3 ml-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Tech Solutions Pvt Ltd</h4>
                    <p className="text-sm text-gray-600">Bangalore, Karnataka</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">88% match</div>
                    <div className="text-xs text-gray-500">★ 4.7</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Laptops</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Software Licenses</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">Send Invitation</button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Reject</button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
                <input type="checkbox" className="absolute top-2 left-2" />
                <div className="flex justify-between items-start mb-3 ml-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Education Foundation</h4>
                    <p className="text-sm text-gray-600">Chennai, Tamil Nadu</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-600">76% match</div>
                    <div className="text-xs text-gray-500">★ 4.5</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Books</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Stationery</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">Send Invitation</button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Reject</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
