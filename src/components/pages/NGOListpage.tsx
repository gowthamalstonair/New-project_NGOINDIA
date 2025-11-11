import React from "react";
import { useDashboard } from '../../contexts/DashboardContext';

// Mock NGOs for display when no registered NGOs exist
const mockNgos = [
  { 
    id: "1", 
    name: "Empower Women Initiative", 
    city: "Bangalore", 
    date: "2025-09-25", 
    focusArea: "Education, Women Empowerment",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DwzAfyiO74EpS2Xz32tB2iQORYIbGtUr-w&s" 
  },
  { 
    id: "2", 
    name: "Green Future Trust",  
    city: "Hyderabad", 
    date: "2025-09-20", 
    focusArea: "Environment, Healthcare",
    logo: "https://media.istockphoto.com/id/1351542181/photo/seedling-are-growing-from-the-rich-soil-concept-of-business-growth-profit-development-and.jpg?s=612x612&w=0&k=20&c=FR7d3FZyhwxxayN6HEZLSmjXHVS8WWo8nLJtH8fEiF4=" 
  },
  { 
    id: "3", 
    name: "Health Care NGO", 
    city: "Chennai", 
    date: "2025-08-15", 
    focusArea: "Healthcare, Child Welfare",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRi1SxsFonnzf1zi1MZQFoCGHCBkB-Ze3Saw&s" 
  },
  { 
    id: "4", 
    name: "EduCare Society", 
    city: "Delhi", 
    date: "2025-07-10", 
    focusArea: "Education, Skill Development",
    logo: "https://www.visiongroup.in/images/gallery/img-8.jpg" 
  },
];

export function NGOListPage() {
  const { ngoRegistrations } = useDashboard();
  
  // Combine registered NGOs with mock data for display
  const allNgos = [...ngoRegistrations, ...mockNgos];
  
  const goToDetails = (id: string) => {
    window.location.href = `/ngos/${id}`;
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">
        Registered NGOs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {allNgos.map((ngo) => {
          const focusAreas = ngo.focusArea ? ngo.focusArea.split(', ') : [];
          return (
            <div
              key={ngo.id}
              className="relative group bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[400px]"
              onClick={() => goToDetails(ngo.id)}
            >
              {/* NGO Logo */}
              <div className="mb-6">
                <img 
                  src={ngo.logo || "https://via.placeholder.com/200x200?text=NGO"} 
                  alt={ngo.name} 
                  className="w-full h-48 rounded-lg mb-4 object-cover"
                />
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-600 transition text-center">
                  {ngo.name}
                </h2>
              </div>

              {/* City and Registered Date */}
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span>📍</span> {ngo.city}
              </p>
              <p className="text-gray-600 mb-3 flex items-center gap-2">
                <span>🗓</span> Registered: {ngo.date}
              </p>

              {/* Focus Areas */}
              <div className="flex flex-wrap gap-2 mb-6">
                {focusAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-sm font-medium shadow-sm"
                  >
                    {area.trim()}
                  </span>
                ))}
              </div>

              {/* View Details Button */}
              <button
                className="absolute bottom-6 right-6 px-6 py-3 bg-orange-500 text-white rounded-lg opacity-0 group-hover:opacity-100 shadow-lg hover:bg-orange-600 transition font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails(ngo.id);
                }}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            localStorage.setItem('activeModule', 'RegisterNGO');
            window.location.href = "/";
          }}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 mx-auto"
        >
          ← Back to Register NGO
        </button>
      </div>
    </div>
  );
}