import React, { useState } from 'react';
import { downloadMOUPDF } from './src/utils/createMOUPDF';

interface MOUData {
  ngoName: string;
  partnerName: string;
  projectDescription: string;
  goals: string;
  duration: string;
  startDate: string;
  endDate: string;
  ngoSignatory: string;
  ngoDesignation: string;
  partnerSignatory: string;
  partnerDesignation: string;
}

const MOUTemplate: React.FC = () => {
  const [mouType, setMouType] = useState<string>('general');
  const [formData, setFormData] = useState<MOUData>({
    ngoName: '',
    partnerName: '',
    projectDescription: '',
    goals: '',
    duration: '',
    startDate: '',
    endDate: '',
    ngoSignatory: '',
    ngoDesignation: '',
    partnerSignatory: '',
    partnerDesignation: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateMOU = () => {
    const templates = {
      general: `
MEMORANDUM OF UNDERSTANDING (MOU)
Between ${formData.ngoName} and ${formData.partnerName}

1. Purpose
This MOU establishes cooperation between ${formData.ngoName} and ${formData.partnerName} to collaborate on ${formData.projectDescription} aimed at ${formData.goals}.

2. Objectives
• To jointly plan and implement activities related to ${formData.projectDescription}
• To share resources, expertise, and networks for achieving desired outcomes
• To ensure transparency and accountability in all collaborative activities

3. Roles and Responsibilities
${formData.ngoName}: Lead community engagement and field implementation, submit periodic reports, ensure compliance
${formData.partnerName}: Provide funding/support, offer technical expertise, participate in monitoring

4. Duration: ${formData.duration} (${formData.startDate} to ${formData.endDate})

5. Financial Arrangements
Each party bears own expenses unless specified in project agreement.

6. Confidentiality
Both parties maintain confidentiality of proprietary information.

7. Monitoring: Regular quarterly review meetings

8. Amendments: Through mutual written consent

9. Termination: 30 days written notice

10. Signatures
${formData.ngoName}: ${formData.ngoSignatory}, ${formData.ngoDesignation}
${formData.partnerName}: ${formData.partnerSignatory}, ${formData.partnerDesignation}
      `,
      corporate: `
CSR PARTNERSHIP MOU
Between ${formData.partnerName} (Company) and ${formData.ngoName}

Purpose: CSR initiative implementation for ${formData.projectDescription}

Key Terms:
• CSR fund allocation as per Companies Act Section 135
• Joint branding and reporting rights
• Impact measurement and outcome reporting
• Logo usage guidelines and press release terms
• Quarterly progress reviews

Duration: ${formData.duration}
Signatures: ${formData.ngoSignatory} (NGO), ${formData.partnerSignatory} (Corporate)
      `,
      educational: `
INTERNSHIP & TRAINING MOU
Between ${formData.partnerName} (Institution) and ${formData.ngoName}

Objective: Student internship and skill development programs

Terms:
• Internship duration and attendance requirements
• Mentor assignment from both organizations
• Student responsibilities and evaluation criteria
• Certification upon completion
• Liability disclaimer for field activities

Duration: ${formData.duration}
Signatures: ${formData.ngoSignatory} (NGO), ${formData.partnerSignatory} (Institution)
      `,
      government: `
GOVERNMENT COLLABORATION MOU
Between ${formData.partnerName} (Agency) and ${formData.ngoName}

Objective: Policy implementation and community outreach under ${formData.projectDescription}

Compliance:
• Legal and administrative requirements
• Data sharing and reporting protocols
• Government logo usage (with approval)
• Audit and termination clauses

Duration: ${formData.duration}
Signatures: ${formData.ngoSignatory} (NGO), ${formData.partnerSignatory} (Government)
      `,
      ngo: `
NGO-TO-NGO COLLABORATION MOU
Between ${formData.ngoName} and ${formData.partnerName}

Purpose: Joint execution of ${formData.projectDescription}

Resource Sharing:
• Manpower, facilities, and data sharing
• Lead partner: ${formData.ngoName}
• Co-partner: ${formData.partnerName}
• Coordination mechanisms and funding arrangements

Duration: ${formData.duration}
Signatures: ${formData.ngoSignatory}, ${formData.partnerSignatory}
      `,
      donor: `
DONOR PARTNERSHIP MOU
Between ${formData.partnerName} (Donor) and ${formData.ngoName}

Funding Terms:
• Project scope: ${formData.projectDescription}
• Milestone-based disbursement schedule
• Reporting obligations and audit rights
• Performance monitoring requirements
• Termination on non-performance clause

Duration: ${formData.duration}
Signatures: ${formData.ngoSignatory} (NGO), ${formData.partnerSignatory} (Donor)
      `,
      short: `
SHORT-FORM MOU
Between: ${formData.ngoName} and ${formData.partnerName}
Objective: ${formData.projectDescription}
Duration: ${formData.startDate} – ${formData.endDate}

Commitments:
${formData.ngoName}: Lead implementation and reporting
${formData.partnerName}: Provide support and resources

Review: Quarterly
Signatures: ${formData.ngoSignatory} (NGO), ${formData.partnerSignatory} (Partner)
      `
    };

    return templates[mouType as keyof typeof templates];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">NGO MOU Generator</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">MOU Type:</label>
        <select 
          value={mouType} 
          onChange={(e) => setMouType(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="general">General Partnership</option>
          <option value="corporate">Corporate CSR</option>
          <option value="educational">Educational Institution</option>
          <option value="government">Government Agency</option>
          <option value="ngo">NGO-to-NGO</option>
          <option value="donor">Donor Organization</option>
          <option value="short">Short-Form</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="ngoName"
          placeholder="NGO Name"
          value={formData.ngoName}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="partnerName"
          placeholder="Partner Organization Name"
          value={formData.partnerName}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <textarea
          name="projectDescription"
          placeholder="Project Description"
          value={formData.projectDescription}
          onChange={handleInputChange}
          className="p-2 border rounded-md col-span-1 md:col-span-2"
          rows={2}
        />
        <input
          name="goals"
          placeholder="Goals/Objectives"
          value={formData.goals}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 2 years)"
          value={formData.duration}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="ngoSignatory"
          placeholder="NGO Signatory Name"
          value={formData.ngoSignatory}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="ngoDesignation"
          placeholder="NGO Signatory Designation"
          value={formData.ngoDesignation}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="partnerSignatory"
          placeholder="Partner Signatory Name"
          value={formData.partnerSignatory}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          name="partnerDesignation"
          placeholder="Partner Signatory Designation"
          value={formData.partnerDesignation}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Generated MOU:</h2>
        <pre className="whitespace-pre-wrap text-sm bg-white p-4 border rounded-md overflow-auto max-h-96">
          {generateMOU()}
        </pre>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigator.clipboard.writeText(generateMOU())}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-4"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => {
            const mouData = {
              party1Name: formData.ngoName,
              party1Abbreviation: formData.ngoName,
              party1Description: `NGO focused on ${formData.projectDescription}`,
              party2Name: formData.partnerName,
              party2Abbreviation: formData.partnerName,
              party2Description: `Partner organization for ${formData.projectDescription}`,
              purpose: formData.projectDescription,
              objective: formData.goals,
              effectiveDate: formData.startDate,
              endDate: formData.endDate,
              party1Signatory: formData.ngoSignatory,
              party1Designation: formData.ngoDesignation,
              party2Signatory: formData.partnerSignatory,
              party2Designation: formData.partnerDesignation
            };
            downloadMOUPDF(mouData, `MOU_${formData.ngoName}_${formData.partnerName}.pdf`);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Download PDF MOU
        </button>
      </div>
    </div>
  );
};

export default MOUTemplate;