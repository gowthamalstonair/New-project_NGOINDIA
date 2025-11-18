import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Users, FileText, Eye, Download, Upload, 
  CheckCircle, AlertTriangle, Calendar, IndianRupee,
  TrendingUp, BarChart3, Clock, Award, X, MapPin,
  Phone, Mail, Building, PieChart, Activity, Target,
  Brain, Zap, AlertCircle, Search, FileCheck, Scale,
  Gavel, BookOpen, AlertOctagon, Plus, FolderOpen
} from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string;
  used: number;
  status: 'active' | 'completed' | 'pending';
  email?: string;
  phone?: string;
  address?: string;
  receipts?: string[];
  breakdown?: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
    description: string;
  }[];
  timeline?: {
    date: string;
    amount: number;
    description: string;
  }[];
}



interface AIValidation {
  id: string;
  donationId: string;
  document: string;
  expectedCategory: string;
  detectedCategory: string;
  confidence: number;
  status: 'compliant' | 'needs-review' | 'non-compliant';
  amount: number;
  date: string;
  extractedText: string;
  vendor: string;
  aiFlags: string[];
  uploadedFile?: File;
}

interface Policy {
  id: string;
  title: string;
  category: 'HR' | 'Finance' | 'Legal' | 'Volunteer' | 'Operations' | 'Safety' | 'Others';
  version: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'expired';
  visibility: 'internal' | 'public';
  createdDate: string;
  lastReviewed: string;
  nextReview: string;
  approvedBy?: string;
  description: string;
  file?: File;
  fileContent?: string;
  acknowledgments?: string[];
}

interface LegalRequirement {
  id: string;
  title: string;
  category: 'NGO Registration' | 'Tax Laws' | 'Financial Compliance' | 'Transparency Laws' | 'Audit Requirements';
  description: string;
  applicability: 'Mandatory' | 'Conditional';
  complianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Pending';
  documents: string[];
  authority: string;
  penalties: string;
  reference: string;
  impact: 'High' | 'Medium' | 'Low';
}

interface DBPolicy {
  id: string;
  policy_name: string;
  policy_type: string;
  version?: string;
  status: string;
  upload_date?: string;
  expiry_date?: string;
  uploaded_by?: string;
  description?: string;
}

export function ComplianceModule() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Load policies from database on component mount
  useEffect(() => {
    loadPoliciesFromDB();
  }, []);

  const loadPoliciesFromDB = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_legal_policies.php');
      const data = await response.json();
      if (data.success && data.policies && data.policies.length > 0) {
        const dbPolicies = data.policies.map((dbPolicy: DBPolicy) => ({
          id: `db_${dbPolicy.id}`,
          title: dbPolicy.policy_name,
          category: dbPolicy.policy_type,
          version: dbPolicy.version || 'v1.0',
          status: dbPolicy.status === 'Active' ? 'published' : 'draft',
          visibility: 'internal',
          createdDate: dbPolicy.upload_date ? dbPolicy.upload_date.split(' ')[0] : new Date().toISOString().split('T')[0],
          lastReviewed: dbPolicy.upload_date ? dbPolicy.upload_date.split(' ')[0] : new Date().toISOString().split('T')[0],
          nextReview: dbPolicy.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          approvedBy: dbPolicy.uploaded_by,
          description: dbPolicy.description || 'Policy uploaded from database',
          acknowledgments: []
        }));
        
        // Only add database policies that don't already exist
        setPolicies(prev => {
          const existingTitles = prev.map(p => p.title);
          const newDbPolicies = dbPolicies.filter((dbPolicy: Policy) => !existingTitles.includes(dbPolicy.title));
          return [...prev, ...newDbPolicies];
        });
      }
    } catch (error) {
      console.error('Error loading policies:', error);
      // Don't modify policies state if there's an error
    }
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedValidation, setSelectedValidation] = useState<AIValidation | null>(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPolicyUpload, setShowPolicyUpload] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policyFilter, setPolicyFilter] = useState('all');
  const [policySearch, setPolicySearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{fileName: string, content: string} | null>(null);
  const [selectedReport, setSelectedReport] = useState<{name: string, content: string} | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<LegalRequirement | null>(null);
  const [lawFilter, setLawFilter] = useState('all');
  const [lawSearch, setLawSearch] = useState('');
  const [showUtilizedFunds, setShowUtilizedFunds] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formType, setFormType] = useState<'certificate' | 'report'>('report');
  const [customReports, setCustomReports] = useState(['Annual UC 2023-24', 'Project UC - Education', 'Healthcare UC Q4']);
  const [customCertificates, setCustomCertificates] = useState(['External Audit 2023', 'Internal Audit Q4', 'Compliance Audit']);
  const [documentTemplates, setDocumentTemplates] = useState<{[key: string]: string}>({});
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  
  const [validationData, setValidationData] = useState<AIValidation[]>([
    { 
      id: '1', 
      donationId: '1', 
      document: 'School_Supplies_Receipt.pdf', 
      expectedCategory: 'Education', 
      detectedCategory: 'Education', 
      confidence: 95, 
      status: 'compliant', 
      amount: 15000, 
      date: '2024-01-15',
      extractedText: 'ABC EDUCATIONAL SUPPLIES PVT LTD\n123 Education Street, Mumbai - 400001\nGST: 27ABCDE1234F1Z5\n\n--- INVOICE ---\nInvoice No: EDU/2024/001\nDate: 15th January 2024\nBill To: Bright Future NGO\n\nITEMS PURCHASED:\n• Notebooks (A4, 200 pages) - Qty: 500 pcs @ ₹25 each = ₹12,500\n• Ball Point Pens (Blue/Black) - Qty: 200 pcs @ ₹8 each = ₹1,600\n• Pencils (HB Grade) - Qty: 300 pcs @ ₹3 each = ₹900\n\nSUBTOTAL: ₹15,000\nGST (0%): ₹0 (Educational supplies exempt)\nTOTAL AMOUNT: ₹15,000\n\nPURPOSE: Educational materials for Government Primary School\nBeneficiaries: 150 students (Classes 1-5)\nProject: Rural Education Initiative\n\nPayment Method: Bank Transfer\nBank Ref: TXN123456789\nDate Paid: 15/01/2024\n\nAuthorized Signatory: Rajesh Kumar (Proprietor)',
      vendor: 'ABC Educational Supplies Pvt Ltd',
      aiFlags: ['Education keywords detected', 'School supplies confirmed', 'GST exempt status verified', 'Beneficiary count mentioned']
    },
    { 
      id: '2', 
      donationId: '1', 
      document: 'Teacher_Salary_Invoice.pdf', 
      expectedCategory: 'Education', 
      detectedCategory: 'Education', 
      confidence: 92, 
      status: 'compliant', 
      amount: 12000, 
      date: '2024-01-30',
      extractedText: 'GOVERNMENT PRIMARY SCHOOL\nVillage: Rampur, District: Pune\nSchool Code: MH-PUN-001\n\n--- SALARY PAYMENT RECEIPT ---\nMonth: January 2024\nPayment Date: 30th January 2024\n\nEMPLOYEE DETAILS:\nName: Mrs. Priya Sharma\nEmployee ID: TCH-001\nDesignation: Primary School Teacher\nQualification: B.Ed, M.A (English)\nExperience: 8 years\n\nSALARY BREAKDOWN:\nBasic Salary: ₹10,000\nTeaching Allowance: ₹1,500\nRural Area Allowance: ₹500\nGROSS SALARY: ₹12,000\n\nDEDUCTIONS:\nPF Contribution: ₹0 (Volunteer basis)\nTax Deduction: ₹0\nNET SALARY: ₹12,000\n\nFUNDING SOURCE: Bright Future NGO - Education Project\nProject Code: EDU-2024-001\nDonor: Rajesh Kumar\n\nClasses Taught: 1st, 2nd, 3rd Grade\nSubjects: English, Mathematics, Environmental Science\nStudent Strength: 45 students\n\nReceived By: Mrs. Priya Sharma\nSignature: [Signed]\nDate: 30/01/2024',
      vendor: 'Government Primary School',
      aiFlags: ['Teacher salary confirmed', 'Education staff payment', 'Rural education project', 'Student count verified']
    },
    { 
      id: '3', 
      donationId: '2', 
      document: 'Medical_Equipment_Bill.pdf', 
      expectedCategory: 'Healthcare', 
      detectedCategory: 'Healthcare', 
      confidence: 98, 
      status: 'compliant', 
      amount: 15000, 
      date: '2024-01-20',
      extractedText: 'MEDTECH SOLUTIONS INDIA LTD\n456 Healthcare Avenue, Delhi - 110001\nGST: 07MEDTC5678G2H9\nDrug License: DL-DEL-2023-001\n\n--- MEDICAL EQUIPMENT INVOICE ---\nInvoice No: MED/2024/001\nDate: 20th January 2024\nBill To: Bright Future NGO\nDelivery Address: Community Health Center, Rampur Village\n\nMEDICAL EQUIPMENT SUPPLIED:\n• Digital Blood Pressure Monitor (Omron) - Qty: 5 units @ ₹2,500 = ₹12,500\n• Digital Thermometer (Infrared) - Qty: 10 units @ ₹150 = ₹1,500\n• Stethoscope (Littmann Classic) - Qty: 3 units @ ₹333 = ₹1,000\n\nSUBTOTAL: ₹15,000\nGST (12%): Already included in price\nTOTAL AMOUNT: ₹15,000\n\nPURPOSE: Primary healthcare equipment for rural clinic\nProject: Community Health Initiative\nBeneficiaries: 500+ villagers\nCoverage Area: 5 villages in Rampur block\n\nWARRANTY:\n• BP Monitors: 2 years\n• Thermometers: 1 year\n• Stethoscopes: 5 years\n\nDelivery Date: 22/01/2024\nInstallation: Completed by certified technician\nTraining: Provided to 3 healthcare workers\n\nPayment: Bank Transfer - Ref: HTH789012345\nAuthorized By: Dr. Amit Patel (Medical Director)',
      vendor: 'MedTech Solutions India Ltd',
      aiFlags: ['Medical equipment confirmed', 'Healthcare purpose verified', 'Drug license valid', 'Beneficiary coverage mentioned', 'Training provided']
    },
    { 
      id: '4', 
      donationId: '3', 
      document: 'Construction_Materials.pdf', 
      expectedCategory: 'Infrastructure', 
      detectedCategory: 'Education', 
      confidence: 78, 
      status: 'needs-review', 
      amount: 8000, 
      date: '2024-02-01',
      extractedText: 'BUILDMART CONSTRUCTION SUPPLIES\n789 Builder Street, Bangalore - 560001\nGST: 29BUILD7890K3L4\n\n--- MATERIAL SUPPLY INVOICE ---\nInvoice No: BLD/2024/045\nDate: 1st February 2024\nBill To: Bright Future NGO\nSite Address: Government Primary School, Rampur\n\nCONSTRUCTION MATERIALS:\n• Portland Cement (53 Grade) - Qty: 20 bags @ ₹350 = ₹7,000\n• Red Clay Bricks (1st Class) - Qty: 500 pcs @ ₹2 = ₹1,000\n\nSUBTOTAL: ₹8,000\nGST (18%): Included\nTOTAL AMOUNT: ₹8,000\n\nPURPOSE: School Building Renovation\nWork Description: Classroom wall repair and strengthening\nContractor: Ramesh Construction Co.\nProject Duration: 15 days\n\nSCHOOL DETAILS:\nName: Government Primary School\nLocation: Rampur Village\nClassrooms Affected: 2 (Class 4 & 5)\nStudent Capacity: 60 students\n\nAPPROVALS:\n• School Principal: Mrs. Sunita Devi [Approved]\n• Village Panchayat: Sarpanch Ram Singh [Approved]\n• NGO Project Manager: Vikash Sharma [Approved]\n\nNote: Materials will be used for educational infrastructure\nExpected Completion: 15th February 2024\n\nDelivery: 2nd February 2024\nPayment: Cash on Delivery\nReceived By: Site Supervisor - Ramesh Kumar',
      vendor: 'BuildMart Construction Supplies',
      aiFlags: ['Mixed signals detected', 'School mentioned but construction materials', 'Educational infrastructure confirmed', 'Multiple approvals obtained', 'Requires manual review for category classification']
    },
    { 
      id: '5', 
      donationId: '1', 
      document: 'Office_Supplies.pdf', 
      expectedCategory: 'Education', 
      detectedCategory: 'Administrative', 
      confidence: 85, 
      status: 'non-compliant', 
      amount: 5000, 
      date: '2024-02-15',
      extractedText: 'OFFICE DEPOT INDIA\n321 Corporate Plaza, Mumbai - 400002\nGST: 27OFFIC3456M7N8\n\n--- OFFICE SUPPLIES INVOICE ---\nInvoice No: OFF/2024/789\nDate: 15th February 2024\nBill To: Bright Future NGO\nDelivery: NGO Head Office, Mumbai\n\nOFFICE ITEMS PURCHASED:\n• A4 Printer Paper (80 GSM) - Qty: 50 reams @ ₹250 = ₹12,500\n• Executive Office Chairs (Leather) - Qty: 3 units @ ₹8,500 = ₹25,500\n• Executive Desk (Wooden) - Qty: 1 unit @ ₹15,000 = ₹15,000\n\nSUBTOTAL: ₹53,000\nDiscount (90%): -₹48,000\nFINAL AMOUNT: ₹5,000\n\nPURPOSE: NGO Administrative Office Setup\nDepartment: Administration & Finance\nAuthorized By: Admin Manager - Suresh Gupta\n\nUSAGE:\n• Paper: For administrative documentation\n• Chairs: For office staff (3 positions)\n• Desk: For Finance Manager cabin\n\nLOCATION: NGO Head Office\nFloor: 3rd Floor, Admin Wing\nRoom Numbers: 301, 302, 303\n\nNOTE: These items are for NGO internal operations\nNot directly related to field projects\nFunding Source: General Administration Budget\n\nPayment Method: Credit Card\nCard Ending: ****4567\nTransaction ID: TXN987654321\nDate: 15/02/2024\n\nReceived By: Office Administrator\nSignature: [Signed]',
      vendor: 'Office Depot India',
      aiFlags: ['Administrative use detected', 'Not education-related', 'NGO internal operations', 'Potential misuse of education funds', 'High discount applied - verify authenticity']
    },
    {
      id: '6',
      donationId: '2',
      document: 'Medicine_Purchase_Receipt.pdf',
      expectedCategory: 'Healthcare',
      detectedCategory: 'Healthcare',
      confidence: 96,
      status: 'compliant',
      amount: 8500,
      date: '2024-02-10',
      extractedText: 'APOLLO PHARMACY\n567 Medical Street, Chennai - 600001\nGST: 33APOLL9876P5Q6\nDrug License: TN-CHE-2023-089\n\n--- MEDICINE PURCHASE RECEIPT ---\nBill No: APO/2024/1234\nDate: 10th February 2024\nCustomer: Bright Future NGO\nPrescription Ref: Community Health Program\n\nMEDICINES PURCHASED:\n• Paracetamol Tablets (500mg) - 500 tablets @ ₹2 = ₹1,000\n• ORS Packets - 200 packets @ ₹5 = ₹1,000\n• Iron & Folic Acid Tablets - 1000 tablets @ ₹1.5 = ₹1,500\n• Vitamin A Capsules - 300 capsules @ ₹3 = ₹900\n• Antiseptic Solution (500ml) - 20 bottles @ ₹45 = ₹900\n• Bandages & Gauze - Assorted @ ₹1,200\n• First Aid Supplies - Kit @ ₹2,000\n\nSUBTOTAL: ₹8,500\nGST (5%): Included in price\nTOTAL AMOUNT: ₹8,500\n\nPURPOSE: Community Health Camp Medicines\nCamp Location: Rampur & nearby villages\nExpected Beneficiaries: 300+ patients\nCamp Duration: 3 days (12-14 Feb 2024)\n\nDOCTOR CONSULTATION:\nDr. Meera Patel - MBBS, MD (Community Medicine)\nRegistration: MCI-12345\nSpecialization: Rural Healthcare\n\nSTORAGE INSTRUCTIONS:\n• Store in cool, dry place\n• Temperature: Below 25°C\n• Expiry dates checked: All valid till 2025\n\nPayment: UPI Transfer\nUPI ID: apollo.pharmacy@paytm\nTransaction: 987654321098\nDate: 10/02/2024\n\nDispensed By: Pharmacist Ravi Kumar\nLicense: PHA-TN-5678',
      vendor: 'Apollo Pharmacy',
      aiFlags: ['Healthcare purpose confirmed', 'Valid drug license', 'Doctor consultation mentioned', 'Community health camp', 'Expiry dates verified']
    },
    {
      id: '7',
      donationId: '3',
      document: 'Labor_Payment_Voucher.pdf',
      expectedCategory: 'Infrastructure',
      detectedCategory: 'Infrastructure',
      confidence: 94,
      status: 'compliant',
      amount: 18000,
      date: '2024-02-20',
      extractedText: 'RAMESH CONSTRUCTION COMPANY\nVillage: Rampur, District: Pune\nContractor License: MH-CON-2023-456\n\n--- LABOR PAYMENT VOUCHER ---\nVoucher No: RCC/2024/012\nDate: 20th February 2024\nProject: School Building Renovation\nSite: Government Primary School, Rampur\n\nLABOR DETAILS:\nWork Period: 1st Feb to 15th Feb 2024 (15 days)\nWork Type: Masonry and Plastering\n\nWORKER PAYMENTS:\n• Ramesh Kumar (Mason) - 15 days @ ₹500 = ₹7,500\n• Suresh Yadav (Helper) - 15 days @ ₹350 = ₹5,250\n• Mahesh Singh (Helper) - 15 days @ ₹350 = ₹5,250\n\nTOTAL LABOR COST: ₹18,000\n\nWORK COMPLETED:\n• Classroom wall repair - 2 rooms\n• Ceiling plastering - 150 sq ft\n• Floor leveling - 200 sq ft\n• Painting preparation work\n\nMATERIALS USED:\n• Cement: 20 bags (from previous invoice)\n• Bricks: 500 pieces (from previous invoice)\n• Sand: 2 tractor loads\n• Water: From school bore well\n\nQUALITY CHECK:\n• Structural Engineer: Approved\n• School Principal: Satisfied\n• NGO Supervisor: Quality verified\n\nBENEFICIARIES:\n• Students: 60 (improved learning environment)\n• Teachers: 4 (better working conditions)\n• Community: Enhanced school infrastructure\n\nPAYMENT METHOD:\n• Cash payment to workers\n• Attendance verified by site supervisor\n• Work completion certified\n\nContractor Signature: Ramesh Kumar\nNGO Supervisor: Vikash Sharma\nDate: 20/02/2024',
      vendor: 'Ramesh Construction Company',
      aiFlags: ['Infrastructure work confirmed', 'School renovation project', 'Labor payments verified', 'Quality checks completed', 'Beneficiary impact documented']
    },
    {
      id: '8',
      donationId: '1',
      document: 'Educational_Books_Invoice.pdf',
      expectedCategory: 'Education',
      detectedCategory: 'Education',
      confidence: 99,
      status: 'compliant',
      amount: 22000,
      date: '2024-03-01',
      extractedText: 'OXFORD UNIVERSITY PRESS INDIA\n234 Education Hub, New Delhi - 110001\nGST: 07OXFOR1234D5E6\n\n--- EDUCATIONAL BOOKS INVOICE ---\nInvoice No: OUP/2024/EDU/567\nDate: 1st March 2024\nBill To: Bright Future NGO\nShip To: Government Primary School, Rampur\n\nEDUCATIONAL BOOKS SUPPLIED:\n\nCLASS 1-2 BOOKS:\n• English Primer (Set of 2) - 50 sets @ ₹120 = ₹6,000\n• Mathematics Workbook - 50 books @ ₹80 = ₹4,000\n• Environmental Studies - 50 books @ ₹90 = ₹4,500\n\nCLASS 3-5 BOOKS:\n• English Reader & Grammar - 40 sets @ ₹150 = ₹6,000\n• Mathematics Textbook - 40 books @ ₹100 = ₹4,000\n• Science & Social Studies - 40 books @ ₹120 = ₹4,800\n\nTEACHER RESOURCES:\n• Teacher\'s Guide (All subjects) - 5 sets @ ₹300 = ₹1,500\n• Activity Books - 10 books @ ₹50 = ₹500\n\nSUBTOTAL: ₹31,300\nEducational Discount (30%): -₹9,390\nFINAL AMOUNT: ₹21,910\nRounding: +₹90\nTOTAL: ₹22,000\n\nSPECIAL FEATURES:\n• Curriculum aligned with state board\n• Illustrated with colorful pictures\n• Activity-based learning approach\n• Bilingual content (Hindi-English)\n\nBENEFICIARY DETAILS:\n• Students: 150 (Classes 1-5)\n• Teachers: 4\n• School: Government Primary School\n• Academic Year: 2024-25\n\nDELIVERY DETAILS:\n• Delivery Date: 3rd March 2024\n• Condition: New, sealed packages\n• Quality: Premium paper, durable binding\n• Warranty: Replacement for manufacturing defects\n\nPAYMENT:\nMethod: NEFT Transfer\nBank: State Bank of India\nAccount: Education Fund Account\nReference: EDU240301789\n\nAuthorized By:\nEducation Manager - Dr. Kavita Sharma\nSignature: [Signed]\nDate: 1/03/2024',
      vendor: 'Oxford University Press India',
      aiFlags: ['Education purpose confirmed', 'Curriculum-aligned books', 'Student beneficiaries specified', 'Educational discount applied', 'Teacher resources included']
    }
  ]);

  const simulateAIProcessing = async (file: File, expectedCategory: string) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI analysis based on filename
    const fileName = file.name.toLowerCase();
    let detectedCategory = '';
    const confidence = 95;
    let status: 'compliant' | 'needs-review' | 'non-compliant' = 'compliant';
    let extractedText = '';
    let vendor = '';
    let aiFlags: string[] = [];
    let amount = 0; // Default to 0 - no amount found
    let hasFinancialData = false;
    
    // Detect financial data from filename
    if (fileName.includes('invoice') || fileName.includes('receipt') || fileName.includes('bill') || fileName.includes('payment')) {
      hasFinancialData = true;
      amount = Math.floor(Math.random() * 50000) + 5000;
    }
    
    // Detect category based on expected category and filename match
    const educationKeywords = ['school', 'education', 'book', 'student', 'teacher', 'classroom', 'learning', 'academic'];
    const healthcareKeywords = ['medical', 'health', 'medicine', 'hospital', 'clinic', 'doctor', 'patient', 'treatment'];
    const infrastructureKeywords = ['construction', 'building', 'cement', 'brick', 'infrastructure', 'facility', 'renovation'];
    const adminKeywords = ['office', 'admin', 'furniture', 'computer', 'management', 'administrative'];
    
    function getRandomDifferentCategory(expected: string) {
      const categories = ['Education', 'Healthcare', 'Infrastructure', 'Administrative'];
      const otherCategories = categories.filter(cat => cat !== expected);
      return otherCategories[Math.floor(Math.random() * otherCategories.length)];
    }
    
    let matchesExpected = false;
    

    
    // Check if filename contains keywords matching expected category
    if (expectedCategory === 'Education') {
      matchesExpected = educationKeywords.some(keyword => fileName.includes(keyword));
    } else if (expectedCategory === 'Healthcare') {
      matchesExpected = healthcareKeywords.some(keyword => fileName.includes(keyword));
    } else if (expectedCategory === 'Infrastructure') {
      matchesExpected = infrastructureKeywords.some(keyword => fileName.includes(keyword));
    } else if (expectedCategory === 'Administrative') {
      matchesExpected = adminKeywords.some(keyword => fileName.includes(keyword));
    }
    
    // Set detected category based on match
    if (matchesExpected) {
      detectedCategory = expectedCategory; // Match found - same category
      status = 'compliant'; // Set as compliant when categories match
    } else {
      detectedCategory = getRandomDifferentCategory(expectedCategory); // No match - different category
      status = 'non-compliant'; // Set as non-compliant when categories don't match
    }
    
    // Generate content based on detected category
    if (detectedCategory === 'Education') {
      if (hasFinancialData) {
        extractedText = `Educational Supplies Invoice\nItems: Books, notebooks, pens, educational materials\nPurpose: Student learning and development\nBeneficiaries: Students and teachers\nTotal: ₹${amount.toLocaleString()}`;
        vendor = 'Educational Supplies Co.';
        aiFlags = ['Education keywords detected', 'School supplies confirmed', 'Financial amount extracted'];
      } else {
        extractedText = `Educational Project Report\nProject: Student Development Program\nActivities: Teaching, learning materials distribution\nBeneficiaries: 150 students\nNote: No financial information found in document`;
        vendor = 'N/A - Non-financial document';
        aiFlags = ['Education keywords detected', 'Project report identified', 'No financial data found'];
        status = 'needs-review';
      }
    } else if (detectedCategory === 'Healthcare') {
      if (hasFinancialData) {
        extractedText = `Medical Equipment Invoice\nItems: Medical equipment, medicines, health supplies\nPurpose: Healthcare services and patient care\nBeneficiaries: Patients and community\nTotal: ₹${amount.toLocaleString()}`;
        vendor = 'MedTech Solutions';
        aiFlags = ['Medical equipment confirmed', 'Healthcare purpose verified', 'Financial amount extracted'];
      } else {
        extractedText = `Healthcare Project Report\nProject: Community Health Initiative\nActivities: Health camps, patient care, medical checkups\nBeneficiaries: 500+ patients\nNote: No financial information found in document`;
        vendor = 'N/A - Non-financial document';
        aiFlags = ['Healthcare keywords detected', 'Project report identified', 'No financial data found'];
        status = 'needs-review';
      }
    } else if (detectedCategory === 'Infrastructure') {
      if (hasFinancialData) {
        extractedText = `Construction Materials Invoice\nItems: Cement, bricks, construction materials\nPurpose: Building construction and infrastructure development\nBeneficiaries: Community and facility users\nTotal: ₹${amount.toLocaleString()}`;
        vendor = 'BuildMart Supplies';
        aiFlags = ['Construction materials detected', 'Infrastructure purpose confirmed', 'Financial amount extracted'];
      } else {
        extractedText = `Infrastructure Project Report\nProject: Community Building Development\nActivities: Construction planning, site preparation\nBeneficiaries: Local community\nNote: No financial information found in document`;
        vendor = 'N/A - Non-financial document';
        aiFlags = ['Infrastructure keywords detected', 'Project report identified', 'No financial data found'];
        status = 'needs-review';
      }
    } else {
      if (hasFinancialData) {
        extractedText = `${detectedCategory} Supplies Invoice\nItems: Various ${detectedCategory.toLowerCase()} supplies\nPurpose: ${detectedCategory} operations\nBeneficiaries: ${detectedCategory} beneficiaries\nTotal: ₹${amount.toLocaleString()}`;
        vendor = `${detectedCategory} Vendor`;
        aiFlags = [`${detectedCategory} keywords detected`, 'Financial amount extracted'];
      } else {
        extractedText = `${detectedCategory} Report\nProject: ${detectedCategory} activities\nActivities: Various ${detectedCategory.toLowerCase()} tasks\nBeneficiaries: Community\nNote: No financial information found in document`;
        vendor = 'N/A - Non-financial document';
        aiFlags = [`${detectedCategory} keywords detected`, 'Report document identified', 'No financial data found'];
        status = 'needs-review';
      }
    }
    
    // Final status and flags based on category match and financial data
    if (detectedCategory === expectedCategory) {
      // Categories match - compliant or needs review based on financial data
      if (hasFinancialData) {
        status = 'compliant';
        aiFlags.push('Category alignment verified', 'Proper fund utilization confirmed');
      } else {
        status = 'needs-review';
        aiFlags.push('Category alignment verified', 'Non-financial document - manual review required');
      }
    } else {
      // Categories don't match - non-compliant
      status = 'non-compliant';
      if (hasFinancialData) {
        aiFlags = ['Category mismatch detected', `Expected: ${expectedCategory}, Found: ${detectedCategory}`, 'Fund misuse flagged', 'Financial amount extracted'];
      } else {
        aiFlags = ['Category mismatch detected', `Expected: ${expectedCategory}, Found: ${detectedCategory}`, 'Document type mismatch', 'No financial data found'];
      }
    }
    
    const newValidation: AIValidation = {
      id: Date.now().toString(),
      donationId: '1',
      document: file.name,
      expectedCategory,
      detectedCategory,
      confidence,
      status,
      amount,
      date: new Date().toISOString().split('T')[0],
      extractedText,
      vendor,
      aiFlags,
      uploadedFile: file
    };
    
    setValidationData(prev => [newValidation, ...prev]);
    setIsProcessing(false);
    setShowDocumentUpload(false);
    setUploadProgress(0);
  };

  const handleDocumentUpload = (file: File, expectedCategory: string) => {
    simulateAIProcessing(file, expectedCategory);
  };

  const handleViewValidation = (validation: AIValidation) => {
    setSelectedValidation(validation);
  };

  const [donations] = useState<Donation[]>([
    { 
      id: '1', 
      donorName: 'Rajesh Kumar', 
      amount: 50000, 
      purpose: 'Education Project', 
      date: '2024-01-15', 
      used: 35000, 
      status: 'active',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra',
      receipts: ['Receipt_001.pdf', 'Utilization_Report_Q1.pdf'],
      breakdown: [
        { category: 'School Supplies', amount: 15000, percentage: 43, color: '#f97316', description: 'Books, stationery, and learning materials' },
        { category: 'Teacher Salaries', amount: 12000, percentage: 34, color: '#fb923c', description: 'Monthly salaries for 3 teachers' },
        { category: 'Infrastructure', amount: 5000, percentage: 14, color: '#fed7aa', description: 'Classroom repairs and furniture' },
        { category: 'Transportation', amount: 3000, percentage: 9, color: '#ffedd5', description: 'Student bus service' }
      ],
      timeline: [
        { date: '2024-01-15', amount: 8000, description: 'Initial school supplies purchase' },
        { date: '2024-01-30', amount: 7000, description: 'Teacher salary - January' },
        { date: '2024-02-15', amount: 7000, description: 'Additional learning materials' },
        { date: '2024-02-28', amount: 8000, description: 'Infrastructure improvements' },
        { date: '2024-03-15', amount: 5000, description: 'Transportation costs' }
      ]
    },
    { 
      id: '2', 
      donorName: 'Priya Sharma', 
      amount: 25000, 
      purpose: 'Healthcare Initiative', 
      date: '2024-01-20', 
      used: 25000, 
      status: 'completed',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      address: 'Delhi, India',
      receipts: ['Receipt_002.pdf', 'Final_Report.pdf', 'Audit_Certificate.pdf'],
      breakdown: [
        { category: 'Medical Equipment', amount: 15000, percentage: 60, color: '#10b981', description: 'Blood pressure monitors, thermometers' },
        { category: 'Medicines', amount: 6000, percentage: 24, color: '#34d399', description: 'Essential medicines and vaccines' },
        { category: 'Staff Training', amount: 4000, percentage: 16, color: '#6ee7b7', description: 'Healthcare worker training programs' }
      ],
      timeline: [
        { date: '2024-01-20', amount: 15000, description: 'Medical equipment purchase' },
        { date: '2024-02-05', amount: 6000, description: 'Medicine procurement' },
        { date: '2024-02-20', amount: 4000, description: 'Staff training completion' }
      ]
    },
    { 
      id: '3', 
      donorName: 'Tech Corp Ltd', 
      amount: 100000, 
      purpose: 'Infrastructure Development', 
      date: '2024-02-01', 
      used: 45000, 
      status: 'active',
      email: 'donations@techcorp.com',
      phone: '+91 11 2345 6789',
      address: 'Bangalore, Karnataka',
      receipts: ['Receipt_003.pdf', 'Progress_Report_Feb.pdf'],
      breakdown: [
        { category: 'Construction', amount: 25000, percentage: 56, color: '#3b82f6', description: 'Building construction and renovation' },
        { category: 'Materials', amount: 12000, percentage: 27, color: '#60a5fa', description: 'Cement, steel, and other materials' },
        { category: 'Labor', amount: 5000, percentage: 11, color: '#93c5fd', description: 'Construction worker wages' },
        { category: 'Equipment', amount: 3000, percentage: 6, color: '#dbeafe', description: 'Tools and machinery rental' }
      ],
      timeline: [
        { date: '2024-02-01', amount: 20000, description: 'Initial construction materials' },
        { date: '2024-02-15', amount: 15000, description: 'Labor costs - Phase 1' },
        { date: '2024-03-01', amount: 10000, description: 'Additional materials and equipment' }
      ]
    }
  ]);

  // Digital Vault documents from Government Hub
  const [digitalVaultDocs] = useState([
    { name: 'Registration Certificate', type: 'PDF', size: '2.4 MB', date: '2024-12-01', shared: true },
    { name: 'Audited Financial Report 2024', type: 'PDF', size: '5.2 MB', date: '2024-11-15', shared: false },
    { name: 'Project Proposal - Healthcare', type: 'DOCX', size: '1.8 MB', date: '2024-12-10', shared: true },
    { name: 'Impact Assessment Report', type: 'PDF', size: '3.1 MB', date: '2024-12-05', shared: false },
    { name: 'Budget Utilization Report', type: 'XLSX', size: '890 KB', date: '2024-11-28', shared: true },
    { name: 'Compliance Certificate', type: 'PDF', size: '1.2 MB', date: '2024-12-12', shared: true },
    { name: '12A Registration', type: 'PDF', size: '1.5 MB', date: '2024-01-15', shared: true },
    { name: '80G Certificate', type: 'PDF', size: '1.1 MB', date: '2024-01-20', shared: true },
    { name: 'FCRA License', type: 'PDF', size: '2.0 MB', date: '2024-02-01', shared: false },
    { name: 'PAN Card', type: 'PDF', size: '500 KB', date: '2024-01-10', shared: true }
  ]);

  const [legalRequirements] = useState<LegalRequirement[]>([
    {
      id: '1',
      title: 'Societies Registration Act, 1860',
      category: 'NGO Registration',
      description: 'Legal framework for registration of societies and NGOs. Provides legal identity and recognition.',
      applicability: 'Mandatory',
      complianceStatus: 'Compliant',
      documents: ['Registration Certificate', 'Memorandum of Association', 'Rules & Regulations'],
      authority: 'Registrar of Societies',
      penalties: 'Dissolution of society, Criminal liability for office bearers',
      reference: 'Section 1-25, Societies Registration Act 1860',
      impact: 'High'
    },
    {
      id: '2',
      title: 'Income Tax Act - Section 12A Registration',
      category: 'Tax Laws',
      description: 'Tax exemption registration for charitable organizations. Essential for tax-free status.',
      applicability: 'Mandatory',
      complianceStatus: 'Compliant',
      documents: ['12A Certificate', 'Annual Returns', 'Audit Reports'],
      authority: 'Income Tax Department',
      penalties: 'Loss of tax exemption, Tax liability on income',
      reference: 'Section 12A, Income Tax Act 1961',
      impact: 'High'
    },
    {
      id: '3',
      title: 'Income Tax Act - Section 80G Certification',
      category: 'Tax Laws',
      description: 'Enables donors to claim tax deduction on donations. Increases donor confidence.',
      applicability: 'Conditional',
      complianceStatus: 'Compliant',
      documents: ['80G Certificate', 'Donation Receipts', 'Utilization Certificates'],
      authority: 'Income Tax Department',
      penalties: 'Cancellation of 80G status, Donor tax benefits lost',
      reference: 'Section 80G, Income Tax Act 1961',
      impact: 'High'
    },
    {
      id: '4',
      title: 'Foreign Contribution Regulation Act (FCRA)',
      category: 'Financial Compliance',
      description: 'Regulates acceptance and utilization of foreign contributions by NGOs.',
      applicability: 'Conditional',
      complianceStatus: 'Pending',
      documents: ['FCRA Registration', 'FC-4 Returns', 'Bank Statements'],
      authority: 'Ministry of Home Affairs',
      penalties: 'Imprisonment up to 5 years, Fine, Cancellation of registration',
      reference: 'FCRA 2010 & Rules 2011',
      impact: 'High'
    },
    {
      id: '5',
      title: 'Right to Information Act, 2005',
      category: 'Transparency Laws',
      description: 'Mandates transparency in operations and information disclosure to public.',
      applicability: 'Mandatory',
      complianceStatus: 'Partial',
      documents: ['RTI Policy', 'Information Disclosure Records', 'Annual Reports'],
      authority: 'Central/State Information Commission',
      penalties: 'Fine up to ₹25,000, Disciplinary action against officers',
      reference: 'RTI Act 2005, Section 4',
      impact: 'Medium'
    },
    {
      id: '6',
      title: 'Companies Act - Annual Filing Requirements',
      category: 'Audit Requirements',
      description: 'Mandatory annual filings including financial statements and activity reports.',
      applicability: 'Mandatory',
      complianceStatus: 'Compliant',
      documents: ['Annual Return', 'Financial Statements', 'Board Resolutions'],
      authority: 'Registrar of Companies',
      penalties: 'Fine ₹50,000-₹5,00,000, Additional fee for delay',
      reference: 'Section 92, 137 Companies Act 2013',
      impact: 'High'
    },
    {
      id: '7',
      title: 'Goods and Services Tax (GST) Compliance',
      category: 'Tax Laws',
      description: 'GST registration and compliance for taxable supplies and services.',
      applicability: 'Conditional',
      complianceStatus: 'Non-Compliant',
      documents: ['GST Registration', 'Monthly Returns', 'Input Tax Credit Records'],
      authority: 'GST Council/Tax Department',
      penalties: 'Fine up to ₹10,000, Interest on delayed payments',
      reference: 'CGST Act 2017, Section 22',
      impact: 'Medium'
    }
  ]);

  // Initialize policies with the required 5 policies
  const initialPolicies: Policy[] = [
    {
      id: '1',
      title: 'Anti-Corruption Policy',
      category: 'Legal',
      version: 'v2.1',
      status: 'published',
      visibility: 'public',
      createdDate: '2024-01-15',
      lastReviewed: '2024-01-15',
      nextReview: '2025-01-15',
      approvedBy: 'Director - Rajesh Kumar',
      description: 'Comprehensive policy outlining zero-tolerance approach to corruption and bribery.',
      acknowledgments: ['emp001', 'emp002', 'emp003']
    },
    {
      id: '2',
      title: 'Child Protection Policy',
      category: 'Safety',
      version: 'v1.3',
      status: 'published',
      visibility: 'internal',
      createdDate: '2024-02-01',
      lastReviewed: '2024-02-01',
      nextReview: '2025-02-01',
      approvedBy: 'Legal Head - Priya Sharma',
      description: 'Guidelines for ensuring child safety and protection in all NGO activities.',
      acknowledgments: ['emp001', 'emp004']
    },
    {
      id: '3',
      title: 'Financial Management Policy',
      category: 'Finance',
      version: 'v3.0',
      status: 'published',
      visibility: 'internal',
      createdDate: '2024-03-01',
      lastReviewed: '2024-01-01',
      nextReview: '2024-12-01',
      approvedBy: 'System',
      description: 'Updated financial procedures and fund management guidelines.',
      acknowledgments: []
    },
    {
      id: '4',
      title: 'Volunteer Code of Conduct',
      category: 'Volunteer',
      version: 'v1.0',
      status: 'published',
      visibility: 'internal',
      createdDate: '2024-03-15',
      lastReviewed: '2024-03-15',
      nextReview: '2024-09-15',
      approvedBy: 'System',
      description: 'Behavioral guidelines and expectations for all volunteers.',
      acknowledgments: []
    },
    {
      id: '5',
      title: 'Data Privacy Policy',
      category: 'Legal',
      version: 'v2.0',
      status: 'published',
      visibility: 'public',
      createdDate: '2024-01-10',
      lastReviewed: '2024-01-10',
      nextReview: '2025-01-10',
      approvedBy: 'Director - Rajesh Kumar',
      description: 'How we collect, use, and protect personal data of beneficiaries and donors.',
      acknowledgments: ['emp001', 'emp002', 'emp003', 'emp004', 'emp005']
    }
  ];

  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalUsed = donations.reduce((sum, d) => sum + d.used, 0);
  const utilizationRate = (totalUsed / totalDonations) * 100;

  const tabs = [
    { id: 'tracking', label: 'Fund Tracking', icon: IndianRupee },
    { id: 'ai-validation', label: 'AI Validation', icon: Brain },
    { id: 'policy-management', label: 'Policy Management', icon: FileCheck },
    { id: 'laws-regulations', label: 'Laws & Regulations', icon: Scale },
    { id: 'digital-vault', label: 'Digital Vault', icon: FolderOpen },
    { id: 'reports', label: 'Reports & Audits', icon: Shield }
  ];

  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation);
  };



  const generateReportContent = (reportName: string) => {
    const date = new Date().toLocaleDateString('en-IN');
    
    if (reportName.includes('Annual UC')) {
      return `BRIGHT FUTURE NGO
ANNUAL UTILIZATION CERTIFICATE 2023-24

Certificate No: UC/2024/001
Date: ${date}

TO: The Registrar of Companies
Subject: Utilization Certificate for Financial Year 2023-24

This is to certify that:

1. FUND UTILIZATION SUMMARY:
   Total Grants Received: ₹1,75,000
   Total Amount Utilized: ₹1,05,000
   Utilization Rate: 60%

2. PROJECT-WISE BREAKDOWN:
   • Education Project: ₹50,000 (Utilized: ₹35,000)
   • Healthcare Initiative: ₹25,000 (Utilized: ₹25,000)
   • Infrastructure Development: ₹1,00,000 (Utilized: ₹45,000)

3. COMPLIANCE STATUS:
   ✓ All funds utilized as per approved purposes
   ✓ Proper accounting records maintained
   ✓ Regular monitoring and evaluation conducted
   ✓ Beneficiary feedback collected

4. IMPACT ACHIEVED:
   • 150 students benefited from education programs
   • 500+ patients served through healthcare initiatives
   • 3 infrastructure projects completed

5. UNUTILIZED FUNDS:
   Amount: ₹70,000
   Reason: Projects in progress, funds committed
   Expected utilization: Next financial year

We hereby certify that the above information is true and correct.

Place: Mumbai
Date: ${date}

Authorized Signatory
Rajesh Kumar
Director, Bright Future NGO
Registration No: NGO/2023/001`;
    }
    
    if (reportName.includes('Project UC - Education')) {
      return `BRIGHT FUTURE NGO
PROJECT UTILIZATION CERTIFICATE - EDUCATION

Certificate No: UC/EDU/2024/001
Date: ${date}

Project Name: Rural Education Initiative
Project Duration: January 2024 - December 2024
Total Sanctioned Amount: ₹50,000
Amount Utilized: ₹35,000

UTILIZATION BREAKDOWN:

1. SCHOOL SUPPLIES (₹15,000):
   • Notebooks: ₹6,000
   • Stationery: ₹4,500
   • Educational materials: ₹4,500
   Beneficiaries: 150 students

2. TEACHER SALARIES (₹12,000):
   • Primary teacher salary: ₹12,000
   Duration: 1 month
   Classes covered: 1st to 3rd grade

3. EDUCATIONAL BOOKS (₹8,000):
   • Textbooks: ₹5,000
   • Reference books: ₹3,000
   Subjects: English, Mathematics, Science

IMPACT ASSESSMENT:
• Student enrollment increased by 25%
• Literacy rate improved in target villages
• Teacher-student ratio optimized
• Learning outcomes enhanced

MONITORING & EVALUATION:
• Monthly progress reports submitted
• Regular school visits conducted
• Parent feedback collected
• Academic performance tracked

CERTIFICATION:
We certify that the funds have been utilized strictly for educational purposes as approved.

Place: Mumbai
Date: ${date}

Project Manager: Dr. Kavita Sharma
Director: Rajesh Kumar
Bright Future NGO`;
    }
    
    if (reportName.includes('Healthcare UC Q4')) {
      return `BRIGHT FUTURE NGO
HEALTHCARE UTILIZATION CERTIFICATE - Q4 2023

Certificate No: UC/HTH/2024/001
Date: ${date}

Project: Community Health Initiative
Reporting Period: October - December 2023
Total Budget: ₹25,000
Amount Utilized: ₹25,000 (100%)

QUARTERLY UTILIZATION:

1. MEDICAL EQUIPMENT (₹15,000):
   • Blood pressure monitors: ₹7,500
   • Digital thermometers: ₹3,000
   • Stethoscopes: ₹2,500
   • First aid supplies: ₹2,000
   Installation: 3 rural clinics

2. MEDICINES & SUPPLIES (₹8,500):
   • Essential medicines: ₹5,000
   • Vaccines: ₹2,000
   • Medical consumables: ₹1,500
   Distribution: 5 villages

3. STAFF TRAINING (₹1,500):
   • Healthcare worker training: ₹1,000
   • Equipment operation training: ₹500
   Participants: 8 healthcare workers

HEALTH OUTCOMES:
• 500+ patients treated
• 200 children vaccinated
• 150 health checkups conducted
• 3 health camps organized

QUALITY ASSURANCE:
• Medical equipment certified
• Medicines from licensed suppliers
• Trained personnel deployment
• Regular health monitoring

COMPLIANCE:
✓ Drug Controller approval obtained
✓ Medical waste disposal protocols followed
✓ Patient records maintained
✓ Regular reporting to health authorities

Place: Mumbai
Date: ${date}

Medical Officer: Dr. Meera Patel
Project Coordinator: Priya Sharma
Director: Rajesh Kumar`;
    }
    
    if (reportName.includes('External Audit 2023')) {
      return `INDEPENDENT AUDITOR'S REPORT

To the Board of Directors
Bright Future NGO

AUDIT REPORT FOR FINANCIAL YEAR 2023

Report Date: ${date}
Audit Firm: M/s Sharma & Associates, Chartered Accountants
Auditor: CA Vikash Sharma (Membership No: 123456)

OPINION:
We have audited the financial statements of Bright Future NGO for the year ended 31st March 2023, which comprise the Balance Sheet, Income & Expenditure Account, Receipts & Payments Account and notes to the financial statements.

In our opinion, the financial statements give a true and fair view of the financial position and financial performance of the NGO.

FINANCIAL HIGHLIGHTS:

1. INCOME ANALYSIS:
   • Donations Received: ₹1,75,000
   • Government Grants: ₹50,000
   • Other Income: ₹10,000
   Total Income: ₹2,35,000

2. EXPENDITURE ANALYSIS:
   • Program Expenses: ₹1,05,000 (60%)
   • Administrative Expenses: ₹35,000 (20%)
   • Fundraising Costs: ₹15,000 (8.5%)
   Total Expenditure: ₹1,55,000

3. SURPLUS: ₹80,000

COMPLIANCE OBSERVATIONS:
✓ Proper books of accounts maintained
✓ All statutory compliances met
✓ Fund utilization as per donor requirements
✓ Transparent financial reporting
✓ Internal controls adequate

RECOMMENDations:
• Implement digital accounting system
• Enhance internal audit frequency
• Strengthen donor reporting mechanisms
• Improve fund utilization tracking

CERTIFICATION:
The audit was conducted in accordance with Standards on Auditing. The NGO has maintained proper accounting records and complied with applicable laws.

Place: Mumbai
Date: ${date}

CA Vikash Sharma
Partner, M/s Sharma & Associates
Chartered Accountants
Firm Registration No: 123456W`;
    }
    
    if (reportName.includes('Internal Audit Q4')) {
      return `BRIGHT FUTURE NGO
INTERNAL AUDIT REPORT - Q4 2023

Audit Period: October - December 2023
Report Date: ${date}
Internal Auditor: Suresh Gupta, Finance Manager

EXECUTIVE SUMMARY:
Quarterly internal audit conducted to assess financial controls, compliance, and operational efficiency.

AUDIT SCOPE:
• Financial transactions review
• Compliance with policies
• Fund utilization verification
• Internal controls assessment
• Documentation review

KEY FINDINGS:

1. FINANCIAL MANAGEMENT:
   ✓ All transactions properly recorded
   ✓ Bank reconciliations up to date
   ✓ Expense approvals documented
   ✓ Petty cash management adequate

2. FUND UTILIZATION:
   • Education Project: On track (70% utilized)
   • Healthcare Initiative: Completed (100% utilized)
   • Infrastructure Project: In progress (45% utilized)
   Overall utilization rate: 60%

3. COMPLIANCE STATUS:
   ✓ 12A registration valid
   ✓ 80G certificate renewed
   ✓ FCRA compliance maintained
   ✓ GST returns filed timely
   ✓ TDS compliance ensured

4. INTERNAL CONTROLS:
   ✓ Segregation of duties maintained
   ✓ Authorization limits followed
   ✓ Document retention policy implemented
   ✓ Regular management reviews conducted

AREAS FOR IMPROVEMENT:
• Enhance digital documentation
• Implement automated approval workflows
• Strengthen vendor verification process
• Improve project monitoring frequency

RECOMMENDATIONS:
1. Monthly financial reviews
2. Quarterly compliance audits
3. Enhanced donor reporting
4. Staff training on new procedures

CONCLUSION:
Overall financial management and compliance status is satisfactory. Minor improvements recommended for enhanced efficiency.

Prepared by: Suresh Gupta
Reviewed by: Rajesh Kumar
Date: ${date}`;
    }
    
    if (reportName.includes('Compliance Audit')) {
      return `BRIGHT FUTURE NGO
COMPLIANCE AUDIT REPORT 2023

Audit Date: ${date}
Conducted by: Legal & Compliance Team
Reviewed by: External Legal Consultant

COMPLIANCE FRAMEWORK:
Comprehensive review of regulatory compliance across all operational areas.

STATUTORY COMPLIANCES:

1. NGO REGISTRATIONS:
   ✓ Society Registration: Valid till 2025
   ✓ 12A Income Tax Exemption: Active
   ✓ 80G Donation Receipt: Valid
   ✓ FCRA Registration: Renewed 2023
   ✓ GST Registration: Compliant

2. LABOR LAW COMPLIANCE:
   ✓ PF Registration: Updated
   ✓ ESI Compliance: Not applicable
   ✓ Minimum Wages: Adhered
   ✓ Contract Labor Act: Compliant

3. ENVIRONMENTAL CLEARANCES:
   ✓ Pollution Control Board: Obtained
   ✓ Waste Management: Compliant
   ✓ Water Usage Permits: Valid

4. PROGRAM-SPECIFIC COMPLIANCE:
   ✓ Education Department NOC: Valid
   ✓ Health Department License: Active
   ✓ Child Protection Policies: Implemented
   ✓ Safety Protocols: Established

FINANCIAL COMPLIANCE:
✓ Annual returns filed timely
✓ Audit reports submitted
✓ Donor reporting completed
✓ Fund utilization certificates issued
✓ Tax deductions claimed appropriately

GOVERNANCE COMPLIANCE:
✓ Board meetings conducted regularly
✓ Annual General Meeting held
✓ Minutes properly maintained
✓ Conflict of interest policies implemented
✓ Transparency measures adopted

RISK ASSESSMENT:
• Low risk: Financial management
• Medium risk: Regulatory changes
• Low risk: Operational compliance
• Minimal risk: Governance issues

RECOMMENDATIONS:
1. Quarterly compliance reviews
2. Legal update training for staff
3. Enhanced documentation systems
4. Regular policy updates

CERTIFICATION:
Bright Future NGO demonstrates strong compliance culture and adherence to applicable laws and regulations.

Compliance Officer: Priya Sharma
Legal Consultant: Adv. Ramesh Kumar
Date: ${date}`;
    }
    
    return `BRIGHT FUTURE NGO
DOCUMENT: ${reportName}

Generated: ${date}

This document contains detailed information about ${reportName.toLowerCase()}.

For complete details, please contact:
Bright Future NGO
Email: info@brightfuture.org
Phone: +91 98765 43210`;
  };

  const generateCertificateContent = (certData: any) => {
    const date = new Date().toLocaleDateString('en-IN');
    return `BRIGHT FUTURE NGO
${certData.type.toUpperCase()}

Certificate No: ${certData.certificateNumber}
Date: ${date}

Certificate Name: ${certData.name}
Issued By: ${certData.issuedBy}
Valid From: ${certData.validFrom}
Valid Until: ${certData.validUntil}

Description:
${certData.description}

This certificate is issued in accordance with applicable laws and regulations.

Authorized Signatory
Bright Future NGO
Registration: NGO/2023/001`;
  };

  const generateAutoReport = (reportData: any) => {
    const date = new Date().toLocaleDateString('en-IN');
    return `BRIGHT FUTURE NGO
${reportData.type.toUpperCase()}

Report: ${reportData.name}
Period: ${reportData.period}
Project: ${reportData.project}
Generated: ${date}

AUTO-GENERATED CONTENT:

1. FINANCIAL SUMMARY:
   Total Donations: ₹1,75,000
   Total Utilized: ₹1,05,000
   Utilization Rate: 60%

2. PROJECT BREAKDOWN:
   ${reportData.project === 'All Projects' ? 
     '• Education: ₹35,000\n   • Healthcare: ₹25,000\n   • Infrastructure: ₹45,000' :
     `• ${reportData.project}: ₹50,000`
   }

3. COMPLIANCE STATUS:
   Legal Requirements: 4/7 Compliant
   AI Validation: 85% Pass Rate

This report was auto-generated from system data.

Prepared by: System
Date: ${date}`;
  };

  const CertificateForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [certData, setCertData] = useState({
      name: '',
      type: 'Tax Exemption',
      certificateNumber: '',
      issuedBy: '',
      validFrom: '',
      validUntil: '',
      description: ''
    });

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Name</label>
          <input 
            type="text"
            placeholder="e.g., 12A Tax Exemption Certificate"
            value={certData.name}
            onChange={(e) => setCertData({...certData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
          <select 
            value={certData.type}
            onChange={(e) => setCertData({...certData, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Tax Exemption">Tax Exemption (12A/80G)</option>
            <option value="Registration">NGO Registration</option>
            <option value="FCRA">FCRA Certificate</option>
            <option value="Audit">Audit Certificate</option>
            <option value="Compliance">Compliance Certificate</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Number</label>
          <input 
            type="text"
            placeholder="Certificate Number"
            value={certData.certificateNumber}
            onChange={(e) => setCertData({...certData, certificateNumber: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Issued By</label>
          <input 
            type="text"
            placeholder="Issuing Authority"
            value={certData.issuedBy}
            onChange={(e) => setCertData({...certData, issuedBy: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
            <input 
              type="date"
              value={certData.validFrom}
              onChange={(e) => setCertData({...certData, validFrom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
            <input 
              type="date"
              value={certData.validUntil}
              onChange={(e) => setCertData({...certData, validUntil: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            placeholder="Certificate description and details"
            value={certData.description}
            onChange={(e) => setCertData({...certData, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button 
            onClick={() => onSubmit(certData)}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Certificate
          </button>
        </div>
      </div>
    );
  };

  const ReportForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [reportData, setReportData] = useState({
      name: '',
      type: 'Utilization Certificate',
      period: 'Annual',
      project: 'All Projects',
      autoGenerate: true,
      customContent: ''
    });

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
          <input 
            type="text"
            placeholder="e.g., Annual UC 2024"
            value={reportData.name}
            onChange={(e) => setReportData({...reportData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select 
            value={reportData.type}
            onChange={(e) => setReportData({...reportData, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Utilization Certificate">Utilization Certificate</option>
            <option value="Audit Report">Audit Report</option>
            <option value="Impact Report">Impact Report</option>
            <option value="Financial Report">Financial Report</option>
            <option value="Donor Report">Donor Report</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Period</label>
          <select 
            value={reportData.period}
            onChange={(e) => setReportData({...reportData, period: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
            <option value="Project-based">Project-based</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <select 
            value={reportData.project}
            onChange={(e) => setReportData({...reportData, project: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="All Projects">All Projects</option>
            <option value="Education Project">Education Project</option>
            <option value="Healthcare Initiative">Healthcare Initiative</option>
            <option value="Infrastructure Development">Infrastructure Development</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={reportData.autoGenerate}
              onChange={(e) => setReportData({...reportData, autoGenerate: e.target.checked})}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Auto-generate from system data</span>
          </label>
        </div>
        
        {!reportData.autoGenerate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Content</label>
            <textarea 
              placeholder="Enter custom report content..."
              value={reportData.customContent}
              onChange={(e) => setReportData({...reportData, customContent: e.target.value})}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <button 
            onClick={() => onSubmit(reportData)}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Report
          </button>
        </div>
      </div>
    );
  };

  const generateDocumentContent = (fileName: string, donation: Donation) => {
    const date = new Date().toLocaleDateString('en-IN');
    
    if (fileName.includes('Receipt')) {
      return `BRIGHT FUTURE NGO
Donation Receipt

Receipt No: ${donation.id.padStart(6, '0')}
Date: ${donation.date}

Donor Details:
Name: ${donation.donorName}
Email: ${donation.email || 'N/A'}
Phone: ${donation.phone || 'N/A'}
Address: ${donation.address || 'N/A'}

Donation Details:
Amount: ₹${donation.amount.toLocaleString()}
Purpose: ${donation.purpose}
Payment Method: Bank Transfer

Utilization Summary:
Amount Used: ₹${donation.used.toLocaleString()}
Remaining: ₹${(donation.amount - donation.used).toLocaleString()}
Utilization Rate: ${((donation.used / donation.amount) * 100).toFixed(1)}%

Breakdown:
${donation.breakdown?.map(item => `• ${item.category}: ₹${item.amount.toLocaleString()} (${item.percentage}%)`).join('\n') || ''}

Thank you for your generous contribution!

Authorized Signatory
Bright Future NGO
Registration: NGO/2023/001`;
    }
    
    if (fileName.includes('Utilization')) {
      return `BRIGHT FUTURE NGO
Fund Utilization Report

Project: ${donation.purpose}
Donor: ${donation.donorName}
Reporting Period: ${donation.date} to ${date}

Fund Allocation:
Total Received: ₹${donation.amount.toLocaleString()}
Total Utilized: ₹${donation.used.toLocaleString()}
Balance Remaining: ₹${(donation.amount - donation.used).toLocaleString()}

Detailed Breakdown:
${donation.breakdown?.map(item => `\n${item.category}:
  Amount: ₹${item.amount.toLocaleString()}
  Percentage: ${item.percentage}%
  Description: ${item.description}`).join('\n') || ''}

Utilization Timeline:
${donation.timeline?.map(event => `${event.date}: ₹${event.amount.toLocaleString()} - ${event.description}`).join('\n') || ''}

Impact Achieved:
• Beneficiaries: ${donation.purpose.includes('Education') ? '150 Students' : donation.purpose.includes('Healthcare') ? '500 Patients' : '75 Families'}
• Coverage: ${donation.purpose.includes('Education') ? '5 Schools' : donation.purpose.includes('Healthcare') ? '3 Clinics' : '12 Villages'}

Compliance Status: ✓ Verified
Audit Status: ✓ Approved

Prepared by: Finance Team
Date: ${date}
Bright Future NGO`;
    }
    
    return `BRIGHT FUTURE NGO
Project Document

Document: ${fileName}
Project: ${donation.purpose}
Donor: ${donation.donorName}
Generated: ${date}

This document contains detailed information about the project implementation and fund utilization.

For more details, please contact:
Bright Future NGO
Email: info@brightfuture.org
Phone: +91 98765 43210`;
  };

  const handleDownload = (fileName: string, donation?: Donation) => {
    if (donation) {
      const content = generateDocumentContent(fileName, donation);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace('.pdf', '.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(`Downloading ${fileName}...`);
    }
  };

  const handleViewDocument = (fileName: string, donation: Donation) => {
    const content = generateDocumentContent(fileName, donation);
    setViewingDocument({ fileName, content });
  };

  const [vaultUploadData, setVaultUploadData] = useState({
    name: '',
    file: null as File | null
  });



  const [policyUploadData, setPolicyUploadData] = useState({
    title: '',
    category: 'HR' as Policy['category'],
    customCategory: '',
    visibility: 'internal' as Policy['visibility'],
    description: '',
    file: null as File | null
  });

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleVaultUpload = () => {
    if (!vaultUploadData.name || !vaultUploadData.file) {
      alert('Please enter document name and select a file');
      return;
    }

    alert(`Document uploaded successfully!`);
    setVaultUploadData({ name: '', file: null });
    setShowUploadModal(false);
  };

  const extractFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.type === 'application/pdf') {
          resolve(`PDF DOCUMENT: ${file.name}\n\nThis is the content extracted from your uploaded PDF file.\n\nOriginal file: ${file.name}\nFile size: ${(file.size / 1024).toFixed(2)} KB\nUpload date: ${new Date().toLocaleDateString()}\n\nNote: PDF content extraction is simulated. In a real application, you would use a PDF parsing library to extract the actual text content from the PDF file.\n\nYour uploaded policy document content would appear here after proper PDF text extraction.`);
        } else {
          resolve(content);
        }
      };
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handlePolicyUpload = async () => {
    if (!policyUploadData.title || !policyUploadData.description || !policyUploadData.file) {
      alert('Please fill all fields and select a file');
      return;
    }

    if (policyUploadData.category === 'Others' && !policyUploadData.customCategory.trim()) {
      alert('Please enter a custom category name');
      return;
    }

    const finalCategory = policyUploadData.category === 'Others' ? policyUploadData.customCategory : policyUploadData.category;
    
    try {
      // Save to database
      const policyData = {
        policy_name: policyUploadData.title,
        policy_type: finalCategory,
        description: policyUploadData.description,
        file_name: policyUploadData.file.name,
        file_path: `/uploads/policies/${policyUploadData.file.name}`,
        file_size: policyUploadData.file.size,
        uploaded_by: 'Current User',
        effective_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        version: 'v1.0',
        department: finalCategory
      };
      
      const response = await fetch('http://localhost/NGO-India/backend/add_legal_policy.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Also add to frontend state
        const fileContent = await extractFileContent(policyUploadData.file);
        
        const newPolicy: Policy = {
          id: `db_${result.id}`,
          title: policyUploadData.title,
          category: finalCategory as Policy['category'],
          version: 'v1.0',
          status: 'published',
          visibility: policyUploadData.visibility,
          createdDate: new Date().toISOString().split('T')[0],
          lastReviewed: new Date().toISOString().split('T')[0],
          nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: policyUploadData.description,
          file: policyUploadData.file,
          fileContent: fileContent,
          acknowledgments: []
        };

        setPolicies(prev => [newPolicy, ...prev]);
        setPolicyUploadData({ title: '', category: 'HR', customCategory: '', visibility: 'internal', description: '', file: null });
        setShowPolicyUpload(false);
        alert('Policy uploaded successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading policy:', error);
      alert('Failed to upload policy. Please check your connection.');
    }
  };

  const handlePolicyStatusChange = (policyId: string, newStatus: Policy['status']) => {
    setPolicies(prev => prev.map(policy => {
      if (policy.id === policyId) {
        const updatedPolicy = { ...policy, status: newStatus };
        if (newStatus === 'published') {
          updatedPolicy.approvedBy = 'Director - Rajesh Kumar';
        }
        return updatedPolicy;
      }
      return policy;
    }));
    alert(`Policy status updated to ${newStatus}`);
  };

  const handlePolicyAcknowledge = (policyId: string) => {
    const currentUser = 'emp001'; // Current logged-in user ID
    setPolicies(prev => prev.map(policy => {
      if (policy.id === policyId) {
        const acknowledgments = policy.acknowledgments || [];
        if (!acknowledgments.includes(currentUser)) {
          return { ...policy, acknowledgments: [...acknowledgments, currentUser] };
        }
      }
      return policy;
    }));
    alert('Policy acknowledged successfully!');
  };

  const generateLawContent = (law: LegalRequirement) => {
    return `${law.title.toUpperCase()}

Category: ${law.category}
Applicability: ${law.applicability}
Compliance Status: ${law.complianceStatus}
Impact Level: ${law.impact}

DESCRIPTION:
${law.description}

AUTHORITY:
${law.authority}

LEGAL REFERENCE:
${law.reference}

REQUIRED DOCUMENTS:
${law.documents.map(doc => `• ${doc}`).join('\n')}

PENALTIES FOR NON-COMPLIANCE:
${law.penalties}

Why This Law Matters:
${law.category === 'NGO Registration' ? 'Provides legal identity and recognition, enables official operations, bank accounts, and donation acceptance.' :
law.category === 'Tax Laws' ? 'Ensures tax exemptions, enables donor benefits, maintains financial compliance and transparency.' :
law.category === 'Financial Compliance' ? 'Regulates fund acceptance and utilization, ensures accountability to donors and government.' :
law.category === 'Transparency Laws' ? 'Mandates public disclosure, builds trust with stakeholders, ensures democratic accountability.' :
law.category === 'Audit Requirements' ? 'Ensures financial transparency, validates proper fund utilization, maintains stakeholder confidence.' :
'Essential for legal and compliant NGO operations.'}`;
  };

  const generatePolicyContent = (policy: Policy) => {
    // If policy has uploaded file content, show that instead of template
    if (policy.fileContent) {
      return policy.fileContent;
    }
    
    const policyContent = {
      'Anti-Corruption Policy': `ANTI-CORRUPTION POLICY

Bright Future NGO is committed to conducting all activities with the highest standards of integrity and transparency. This policy establishes our zero-tolerance approach to corruption and bribery.

1. POLICY STATEMENT
Bright Future NGO prohibits all forms of corruption, bribery, and unethical practices. All staff, volunteers, and partners must adhere to these principles.

2. DEFINITIONS
• Corruption: Abuse of entrusted power for private gain
• Bribery: Offering, giving, receiving, or soliciting something of value to influence actions
• Facilitation Payments: Small payments to secure routine services

3. PROHIBITED ACTIVITIES
• Offering or accepting bribes in any form
• Making facilitation payments
• Engaging in conflicts of interest
• Misusing organizational resources
• Accepting inappropriate gifts or hospitality

4. REPORTING MECHANISMS
• Anonymous reporting hotline: 1800-XXX-XXXX
• Email: ethics@brightfuture.org
• Direct reporting to management
• Whistleblower protection guaranteed

5. CONSEQUENCES
Violations will result in:
• Disciplinary action up to termination
• Legal proceedings where applicable
• Recovery of losses
• Reporting to relevant authorities

6. TRAINING AND AWARENESS
• Mandatory training for all staff
• Annual refresher sessions
• Regular policy updates
• Awareness campaigns

This policy is effective immediately and applies to all organizational activities.`,
      
      'Child Protection Policy': `CHILD PROTECTION POLICY

Bright Future NGO is committed to creating a safe environment for all children in our programs and activities.

1. POLICY COMMITMENT
We are committed to:
• Protecting children from harm, abuse, and exploitation
• Creating safe environments for children
• Responding appropriately to child protection concerns
• Building child protection awareness

2. DEFINITIONS
• Child: Any person under 18 years of age
• Abuse: Physical, emotional, sexual abuse or neglect
• Safeguarding: Protecting children from maltreatment

3. STANDARDS OF BEHAVIOR
All staff and volunteers must:
• Treat children with respect and dignity
• Maintain appropriate boundaries
• Report any concerns immediately
• Follow proper supervision protocols
• Avoid one-on-one interactions with children

4. RECRUITMENT AND SCREENING
• Background checks for all staff
• Reference verification
• Child protection training
• Regular performance reviews

5. REPORTING PROCEDURES
• Immediate reporting of concerns
• Documentation requirements
• Investigation protocols
• Support for affected children

6. TRAINING REQUIREMENTS
• Mandatory child protection training
• Regular updates and refreshers
• Specialized training for direct service staff

This policy ensures the safety and well-being of all children in our care.`,
      
      'Financial Management Policy': `FINANCIAL MANAGEMENT POLICY

This policy establishes guidelines for financial management, fund utilization, and fiscal responsibility at Bright Future NGO.

1. FINANCIAL GOVERNANCE
• Board oversight of financial matters
• Segregation of duties
• Authorization limits
• Regular financial reporting

2. BUDGETING AND PLANNING
• Annual budget preparation
• Quarterly budget reviews
• Variance analysis
• Forecasting and projections

3. FUND MANAGEMENT
• Donor fund restrictions
• Project-based accounting
• Fund utilization tracking
• Compliance monitoring

4. PROCUREMENT PROCEDURES
• Competitive bidding for major purchases
• Vendor evaluation and selection
• Purchase authorization limits
• Receipt and inspection procedures

5. EXPENSE MANAGEMENT
• Pre-approval requirements
• Supporting documentation
• Expense categorization
• Reimbursement procedures

6. INTERNAL CONTROLS
• Monthly bank reconciliations
• Regular internal audits
• Asset management
• Risk assessment

7. REPORTING REQUIREMENTS
• Monthly financial statements
• Donor reports
• Regulatory filings
• Annual audit reports

8. COMPLIANCE
• Adherence to accounting standards
• Regulatory compliance
• Donor agreement compliance
• Tax obligations

This policy ensures transparent and accountable financial management.`,
      
      'Volunteer Code of Conduct': `VOLUNTEER CODE OF CONDUCT

This code establishes behavioral expectations and guidelines for all volunteers at Bright Future NGO.

1. CORE VALUES
Volunteers must embody:
• Integrity and honesty
• Respect for all individuals
• Commitment to our mission
• Professional conduct
• Confidentiality

2. BEHAVIORAL EXPECTATIONS
• Treat all beneficiaries with dignity and respect
• Maintain professional boundaries
• Follow organizational policies and procedures
• Respect cultural differences
• Avoid discrimination and harassment

3. CONFIDENTIALITY
• Protect beneficiary information
• Maintain organizational confidentiality
• Proper handling of sensitive data
• Non-disclosure of internal matters

4. PROFESSIONAL CONDUCT
• Punctuality and reliability
• Appropriate dress code
• Respectful communication
• Teamwork and collaboration
• Continuous learning

5. PROHIBITED ACTIVITIES
• Abuse of position or authority
• Inappropriate relationships
• Substance abuse during service
• Misuse of organizational resources
• Engaging in illegal activities

6. REPORTING OBLIGATIONS
• Report policy violations
• Report safety concerns
• Report conflicts of interest
• Seek guidance when uncertain

7. CONSEQUENCES
Violations may result in:
• Counseling and retraining
• Suspension of volunteer privileges
• Termination of volunteer relationship
• Legal action if warranted

Volunteers are expected to uphold these standards at all times.`,
      
      'Data Privacy Policy': `DATA PRIVACY POLICY

Bright Future NGO is committed to protecting the privacy and personal data of beneficiaries, donors, staff, and partners.

1. POLICY SCOPE
This policy covers:
• Personal data collection
• Data processing and storage
• Data sharing and disclosure
• Data security measures
• Individual rights

2. DATA COLLECTION PRINCIPLES
• Lawful and fair collection
• Specific and legitimate purposes
• Minimal data collection
• Accurate and up-to-date information
• Limited retention periods

3. TYPES OF DATA COLLECTED
• Beneficiary information
• Donor details
• Staff records
• Volunteer information
• Partner organization data

4. DATA PROCESSING
• Consent-based processing
• Legitimate interest assessment
• Purpose limitation
• Data minimization
• Accuracy maintenance

5. DATA SECURITY
• Physical security measures
• Technical safeguards
• Access controls
• Encryption protocols
• Regular security audits

6. DATA SHARING
• Limited sharing with partners
• Donor reporting requirements
• Legal compliance obligations
• Consent-based sharing
• Data transfer agreements

7. INDIVIDUAL RIGHTS
• Right to access personal data
• Right to rectification
• Right to erasure
• Right to data portability
• Right to object to processing

8. DATA BREACH RESPONSE
• Immediate containment
• Impact assessment
• Notification procedures
• Remedial actions
• Prevention measures

We are committed to maintaining the highest standards of data protection.`
    };
    
    return policyContent[policy.title as keyof typeof policyContent] || 
      `${policy.title.toUpperCase()}

This policy document outlines the guidelines and procedures for ${policy.title.toLowerCase()} at Bright Future NGO.

Policy Category: ${policy.category}
Status: ${policy.status}
Version: ${policy.version}

Description:
${policy.description}

For detailed content, please contact the administration.`;
  };

  const DonationModal = () => {
    if (!selectedDonation) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto" onScroll={() => setHoveredSegment(null)}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Donation Details</h3>
            <button onClick={() => setSelectedDonation(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Header Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Project Details</h4>
                  <p className="text-2xl font-bold text-orange-900">{selectedDonation.purpose}</p>
                  <p className="text-orange-700">Donor: {selectedDonation.donorName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Total Funding</h4>
                  <p className="text-2xl font-bold text-orange-900">₹{selectedDonation.amount.toLocaleString()}</p>
                  <p className="text-orange-700">Received: {selectedDonation.date}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Utilization</h4>
                  <p className="text-2xl font-bold text-orange-900">₹{selectedDonation.used.toLocaleString()}</p>
                  <p className="text-orange-700">{((selectedDonation.used / selectedDonation.amount) * 100).toFixed(1)}% Complete</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fund Breakdown Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-orange-500" />
                  Detailed Fund Breakdown
                </h4>
                
                <div className="flex flex-col items-center">
                  {selectedDonation.breakdown && (
                    <CustomPieChart data={selectedDonation.breakdown} size={240} onSegmentClick={undefined} />
                  )}
                  
                  <div className="mt-6 w-full space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-gray-900">₹{selectedDonation.breakdown?.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Amount Utilized</p>
                    </div>
                    
                    {selectedDonation.breakdown?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.category}</p>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">₹{item.amount.toLocaleString()}</p>
                          <p className="text-sm font-medium text-gray-600">{item.percentage}% of total</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-800">Remaining Balance:</span>
                        <span className="font-bold text-xl text-orange-900">₹{(selectedDonation.amount - selectedDonation.used).toLocaleString()}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${((selectedDonation.amount - selectedDonation.used) / selectedDonation.amount) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          {(((selectedDonation.amount - selectedDonation.used) / selectedDonation.amount) * 100).toFixed(1)}% remaining for future use
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline and Details */}
              <div className="space-y-6">
                {/* Utilization Timeline */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Utilization Timeline
                  </h4>
                  
                  {selectedDonation.timeline && (
                    <div className="space-y-4">
                      <LineChart timeline={selectedDonation.timeline} />
                      
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedDonation.timeline.map((event, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">₹{event.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                              <p className="text-xs text-gray-500">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Donor Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedDonation.donorName}</p>
                        <p className="text-sm text-gray-600">Primary Contributor</p>
                      </div>
                    </div>
                    {selectedDonation.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{selectedDonation.email}</span>
                      </div>
                    )}
                    {selectedDonation.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{selectedDonation.phone}</span>
                      </div>
                    )}
                    {selectedDonation.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{selectedDonation.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Impact Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedDonation.purpose === 'Education Project' ? '150' : 
                         selectedDonation.purpose === 'Healthcare Initiative' ? '500' : '75'}
                      </p>
                      <p className="text-sm text-green-700">
                        {selectedDonation.purpose === 'Education Project' ? 'Students' : 
                         selectedDonation.purpose === 'Healthcare Initiative' ? 'Patients' : 'Families'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedDonation.purpose === 'Education Project' ? '5' : 
                         selectedDonation.purpose === 'Healthcare Initiative' ? '3' : '12'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedDonation.purpose === 'Education Project' ? 'Schools' : 
                         selectedDonation.purpose === 'Healthcare Initiative' ? 'Clinics' : 'Villages'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Supporting Documents */}
            {selectedDonation.receipts && selectedDonation.receipts.length > 0 && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Supporting Documents & Receipts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDonation.receipts.map((receipt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-orange-500" />
                        <div>
                          <p className="font-medium text-gray-900">{receipt}</p>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDocument(receipt, selectedDonation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownload(receipt, selectedDonation)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };



  const UploadModal = () => {
    const [localUploadData, setLocalUploadData] = useState(vaultUploadData);
    
    if (!showUploadModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
              <input 
                type="text"
                value={localUploadData.name}
                onChange={(e) => setLocalUploadData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter document name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {localUploadData.file ? localUploadData.file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLocalUploadData(prev => ({ ...prev, file }));
                    }
                  }}
                  id="vault-file-upload"
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('vault-file-upload')?.click()}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-white sticky bottom-0 z-10">
            <button 
              onClick={() => {
                setShowUploadModal(false);
                setVaultUploadData({ name: '', file: null });
                setLocalUploadData({ name: '', file: null });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (!localUploadData.name || !localUploadData.file) {
                  alert('Please enter document name and select a file');
                  return;
                }
                
                setVaultUploadData(localUploadData);
                const formData = new FormData();
                formData.append('document', localUploadData.file);
                formData.append('name', localUploadData.name);
                formData.append('uploaded_by', 'Admin');
                
                handleComplianceUpload(formData);
              }}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalDonations.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Funds Utilized</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalUsed.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Donors</p>
              <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {donations.slice(0, 3).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => handleViewDonation(donation)}>
                <div>
                  <p className="font-medium text-gray-900">{donation.donorName}</p>
                  <p className="text-sm text-gray-600">{donation.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">₹{donation.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{donation.date}</p>
                  <Eye className="w-4 h-4 text-gray-400 mt-1 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Vault Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Total Documents</p>
                <p className="text-sm text-gray-600">Stored in vault</p>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold text-blue-600">{digitalVaultDocs.length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Shared with Government</p>
                <p className="text-sm text-gray-600">Available to authorities</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-lg font-bold text-green-600">{digitalVaultDocs.filter(doc => doc.shared).length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Private Documents</p>
                <p className="text-sm text-gray-600">Internal use only</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-bold text-gray-600">{digitalVaultDocs.filter(doc => !doc.shared).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomPieChart = ({ data, size = 200, onSegmentClick, showTooltip = true }: { data: any[], size?: number, onSegmentClick?: (item: any) => void, showTooltip?: boolean }) => {
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;
    
    let cumulativePercentage = 0;
    
    const handleMouseMove = (e: React.MouseEvent, item: any) => {
      if (showTooltip) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setHoveredSegment(item);
      }
    };
    
    const handleClick = (item: any) => {
      setHoveredSegment(null);
      onSegmentClick && onSegmentClick(item);
    };
    
    return (
      <div className="relative" onMouseLeave={() => setHoveredSegment(null)}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
            const largeArcFlag = item.percentage > 50 ? 1 : 0;
            
            const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');
            
            cumulativePercentage += item.percentage;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className={onSegmentClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
                onClick={() => handleClick(item)}
                onMouseMove={(e) => handleMouseMove(e, item)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

      </div>
    );
  };

  const LineChart = ({ timeline }: { timeline: any[] }) => {
    const maxAmount = Math.max(...timeline.map(t => t.amount));
    const width = 300;
    const height = 150;
    const padding = 20;
    
    return (
      <div className="relative">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {timeline.map((point, index) => {
            const x = padding + (index * (width - 2 * padding)) / (timeline.length - 1);
            const y = height - padding - ((point.amount / maxAmount) * (height - 2 * padding));
            
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="4" fill="#f97316" />
                {index < timeline.length - 1 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={padding + ((index + 1) * (width - 2 * padding)) / (timeline.length - 1)}
                    y2={height - padding - ((timeline[index + 1].amount / maxAmount) * (height - 2 * padding))}
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderFundTracking = () => {
    // Calculate overall fund allocation
    const overallBreakdown = [
      { category: 'Education', amount: 35000, percentage: 35, color: '#f97316', description: 'Supporting educational initiatives and student development' },
      { category: 'Healthcare', amount: 25000, percentage: 25, color: '#10b981', description: 'Medical equipment, medicines, and healthcare services' },
      { category: 'Infrastructure', amount: 45000, percentage: 45, color: '#3b82f6', description: 'Building construction, renovation, and facility improvements' }
    ];

    const handleSegmentClick = (segment: any) => {
      // Find donations related to this category
      const relatedDonations = donations.filter(donation => {
        if (segment.category === 'Education' && donation.purpose.includes('Education')) return true;
        if (segment.category === 'Healthcare' && donation.purpose.includes('Healthcare')) return true;
        if (segment.category === 'Infrastructure' && donation.purpose.includes('Infrastructure')) return true;
        return false;
      });
      
      if (relatedDonations.length > 0) {
        handleViewDonation(relatedDonations[0]); // Show the first related donation
      } else {
        // Show category details in an alert for now
        alert(`${segment.category} Category\n\nTotal Allocation: ₹${segment.amount.toLocaleString()}\nPercentage: ${segment.percentage}%\nDescription: ${segment.description}`);
      }
    };

    return (
      <div className="space-y-8">
        {/* Overall Fund Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-orange-500" />
              Overall Fund Allocation
            </h3>
            
            <div className="flex flex-col items-center">
              <CustomPieChart data={overallBreakdown} size={280} onSegmentClick={handleSegmentClick} />
              
              <div className="mt-6 w-full space-y-3">
                {overallBreakdown.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" 
                    onClick={() => {
                      setHoveredSegment(null);
                      handleSegmentClick(item);
                    }}
                    onMouseEnter={(e) => {
                      setMousePosition({ x: e.clientX, y: e.clientY });
                      setHoveredSegment(item);
                    }}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Total Donations</span>
                  <span className="text-xl font-bold text-orange-600">₹{totalDonations.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between items-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => setShowUtilizedFunds(true)}
                >
                  <span className="text-gray-700">Funds Utilized</span>
                  <span className="text-xl font-bold text-orange-600">₹{totalUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Remaining Balance</span>
                  <span className="text-xl font-bold text-blue-600">₹{(totalDonations - totalUsed).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Utilization Rate</span>
                  <span className="text-xl font-bold text-purple-600">{utilizationRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>


          </div>
        </div>

      </div>
    );
  };

  const renderAIValidation = () => {
    const compliantCount = validationData.filter(v => v.status === 'compliant').length;
    const needsReviewCount = validationData.filter(v => v.status === 'needs-review').length;
    const nonCompliantCount = validationData.filter(v => v.status === 'non-compliant').length;
    const complianceRate = (compliantCount / validationData.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Validation</h2>
              <p className="text-gray-600">Automated compliance monitoring using artificial intelligence</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-700">
              <strong>Goal:</strong> AI automatically verifies that donated funds are used for their intended purpose, 
              ensuring compliance with donor commitments and regulatory requirements.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">{complianceRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents Processed</p>
                <p className="text-2xl font-bold text-blue-600">{validationData.length}</p>
              </div>
              <FileCheck className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Review</p>
                <p className="text-2xl font-bold text-yellow-600">{needsReviewCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-2xl font-bold text-red-600">{nonCompliantCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Document Upload & AI Processing
            </h3>
            <button 
              onClick={() => setShowDocumentUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
          
          {isProcessing && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">AI Processing Document...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700 mt-2">Extracting text, analyzing content, and validating compliance...</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Document Upload</h4>
              <p className="text-sm text-gray-600">NGO uploads receipts, invoices, and expense proofs</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h4>
              <p className="text-sm text-gray-600">Text extraction and category detection using NLP</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Validation</h4>
              <p className="text-sm text-gray-600">Compare detected vs intended fund purpose</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Alert System</h4>
              <p className="text-sm text-gray-600">Flag mismatches and notify administrators</p>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-500" />
              Recent AI Validations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Document</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Expected</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">AI Detected</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {validationData.map((validation) => (
                  <tr key={validation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{validation.document}</p>
                          <p className="text-sm text-gray-600">{validation.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {validation.expectedCategory}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        validation.detectedCategory === validation.expectedCategory 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {validation.detectedCategory}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">₹{validation.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        validation.status === 'compliant' ? 'bg-green-100 text-green-800' :
                        validation.status === 'needs-review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {validation.status === 'compliant' ? '✅ Compliant' :
                         validation.status === 'needs-review' ? '⚠️ Needs Review' :
                         '❌ Non-Compliant'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => {
                          console.log('Clicked validation:', validation);
                          setSelectedValidation(validation);
                        }}
                        className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

  const [complianceDocuments, setComplianceDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docFilter, setDocFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showComplianceUpload, setShowComplianceUpload] = useState(false);
  const [complianceUploadData, setComplianceUploadData] = useState({
    name: '',
    documentType: 'Legal Policy',
    category: 'FCRA',
    description: '',
    expiryDate: '',
    file: null as File | null
  });

  const loadComplianceDocuments = async () => {
    try {
      setLoadingDocs(true);
      const params = new URLSearchParams();
      if (docFilter) params.append('category', docFilter);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`http://localhost/NGO-India/backend/get_compliancedocuments_api.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setComplianceDocuments(data.data);
      }
    } catch (error) {
      console.error('Failed to load compliance documents:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadComplianceDocuments();
  }, [docFilter, statusFilter]);

  const handleComplianceUpload = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/add_compliancedocument_api.php', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowUploadModal(false);
        loadComplianceDocuments();
        alert('Document uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const getStatusColor = (status: string, expiryStatus: string) => {
    if (expiryStatus === 'Expired') return 'bg-red-100 text-red-800';
    if (expiryStatus === 'Expiring Soon') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Active') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string, expiryStatus: string) => {
    if (expiryStatus === 'Expired') return <AlertTriangle className="w-4 h-4" />;
    if (expiryStatus === 'Expiring Soon') return <AlertTriangle className="w-4 h-4" />;
    if (status === 'Active') return <CheckCircle className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const renderDigitalVault = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <FolderOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Digital Vault</h2>
            <p className="text-gray-600">Secure document storage and compliance management</p>
          </div>
        </div>
        <div className="bg-white/60 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-700">
            <strong>Purpose:</strong> Centralized document repository for compliance documents, 
            certificates, and reports with secure sharing capabilities for government authorities.
          </p>
        </div>
      </div>



      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Document Repository</h3>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {loadingDocs ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading documents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Existing Digital Vault Documents */}
            {digitalVaultDocs.map((doc, index) => (
              <div key={`existing-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    doc.shared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.shared ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {doc.shared ? 'Shared with Gov' : 'Private'}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Uploaded: {doc.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Document Preview:\n\nName: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nUploaded: ${doc.date}\nStatus: ${doc.shared ? 'Shared with government authorities' : 'Private document'}`)}
                    className="flex-1 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 transition-colors border border-orange-200 rounded-lg hover:bg-orange-50"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nUploaded: ${doc.date}\nShared: ${doc.shared ? 'Yes' : 'No'}`);
                      link.download = doc.name.toLowerCase().replace(/\s+/g, '-') + '.txt';
                      link.click();
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
            
            {/* New Compliance Documents */}
            {complianceDocuments.map((doc: any) => (
              <div key={`compliance-${doc.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.file_size}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 transition-colors border border-orange-200 rounded-lg hover:bg-orange-50">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Download className="w-4 h-4 inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {digitalVaultDocs.length === 0 && complianceDocuments.length === 0 && !loadingDocs && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">Upload your first compliance document to get started.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Upload Document
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPolicyManagement = () => {
    const filteredPolicies = policies.filter(policy => {
      const matchesFilter = policyFilter === 'all' || policy.category.toLowerCase() === policyFilter;
      const matchesSearch = policy.title.toLowerCase().includes(policySearch.toLowerCase()) ||
                           policy.description.toLowerCase().includes(policySearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    const totalPolicies = policies.length;
    const publishedCount = policies.filter(p => p.status === 'published').length;
    const reviewCount = policies.filter(p => p.status === 'review').length;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-orange-600">{totalPolicies}</p>
              </div>
              <FileCheck className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Policy Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Policy Documents</h3>
            <button 
              onClick={() => setShowPolicyUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Policy
            </button>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search policies..."
                value={policySearch}
                onChange={(e) => {
                  setPolicySearch(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(policySearch.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {showSuggestions && policySearch && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                  {policies
                    .filter(policy => 
                      policy.title.toLowerCase().includes(policySearch.toLowerCase()) ||
                      policy.category.toLowerCase().includes(policySearch.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((policy) => (
                      <div
                        key={policy.id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setPolicySearch(policy.title);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-medium text-gray-900">{policy.title}</div>
                        <div className="text-sm text-gray-600">{policy.category}</div>
                      </div>
                    ))
                  }
                  {policies.filter(policy => 
                    policy.title.toLowerCase().includes(policySearch.toLowerCase()) ||
                    policy.category.toLowerCase().includes(policySearch.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No policies found
                    </div>
                  )}
                </div>
              )}
            </div>
            <select
              value={policyFilter}
              onChange={(e) => setPolicyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="legal">Legal</option>
              <option value="volunteer">Volunteer</option>
              <option value="operations">Operations</option>
              <option value="safety">Safety</option>
            </select>
          </div>

          {/* Policy List */}
          <div className="space-y-3">
            {filteredPolicies.map((policy, index) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono text-sm w-8">{(index + 1).toString().padStart(2, '0')}.</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                        {policy.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Version: {policy.version}</span>
                      <span>Created: {policy.createdDate}</span>
                      {policy.approvedBy && <span>Approved by: {policy.approvedBy}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedPolicy(policy)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const content = generatePolicyContent(policy);
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${policy.title}_${policy.version}.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLawsRegulations = () => {
    const filteredLaws = legalRequirements.filter(law => {
      const matchesFilter = lawFilter === 'all' || law.category.toLowerCase().replace(/\s+/g, '-') === lawFilter;
      const matchesSearch = law.title.toLowerCase().includes(lawSearch.toLowerCase()) ||
                           law.description.toLowerCase().includes(lawSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    const compliantCount = legalRequirements.filter(l => l.complianceStatus === 'Compliant').length;
    const partialCount = legalRequirements.filter(l => l.complianceStatus === 'Partial').length;
    const nonCompliantCount = legalRequirements.filter(l => l.complianceStatus === 'Non-Compliant').length;
    const pendingCount = legalRequirements.filter(l => l.complianceStatus === 'Pending').length;
    const highRiskCount = legalRequirements.filter(l => l.impact === 'High' && l.complianceStatus !== 'Compliant').length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="w-8 h-8 text-orange-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Laws & Regulations</h2>
              <p className="text-gray-600">Legal foundation for NGO operations, transparency, and accountability</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-700">
              <strong>Purpose:</strong> Ensure legal existence, recognition, transparency, and accountability in all NGO operations.
              These laws form the foundation for ethical fund management and donor trust.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Laws</p>
                <p className="text-xl font-bold text-orange-600">{legalRequirements.length}</p>
              </div>
              <Gavel className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-xl font-bold text-green-600">{compliantCount}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partial</p>
                <p className="text-xl font-bold text-yellow-600">{partialCount}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-xl font-bold text-red-600">{nonCompliantCount}</p>
              </div>
              <AlertOctagon className="w-6 h-6 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-xl font-bold text-red-600">{highRiskCount}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Legal Requirements Repository */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Legal Requirements Repository</h3>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search laws and regulations..."
                value={lawSearch}
                onChange={(e) => setLawSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={lawFilter}
              onChange={(e) => setLawFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="ngo-registration">NGO Registration</option>
              <option value="tax-laws">Tax Laws</option>
              <option value="financial-compliance">Financial Compliance</option>
              <option value="transparency-laws">Transparency Laws</option>
              <option value="audit-requirements">Audit Requirements</option>
            </select>
          </div>

          {/* Laws List */}
          <div className="space-y-3">
            {filteredLaws.map((law, index) => (
              <div key={law.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono text-sm w-8">{(index + 1).toString().padStart(2, '0')}.</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{law.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        law.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                        law.complianceStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        law.complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {law.complianceStatus}
                      </span>
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                        {law.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        law.impact === 'High' ? 'bg-red-50 text-red-700' :
                        law.impact === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {law.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{law.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Authority: {law.authority}</span>
                      <span>Applicability: {law.applicability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedLaw(law)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Audit Reports & Certificates</h3>
            <div className="relative">
              <button 
                onClick={() => setShowReportsDropdown(!showReportsDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Audits
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showReportsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button 
                    onClick={() => {
                      setFormType('certificate');
                      setShowCreateModal(true);
                      setShowReportsDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Create Certificate</div>
                        <div className="text-sm text-gray-600">Create compliance certificates</div>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setFormType('report');
                      setShowCreateModal(true);
                      setShowReportsDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Create Report</div>
                        <div className="text-sm text-gray-600">Create utilization reports</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Utilization Certificates</h4>
              {customReports.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-900">{cert}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const content = documentTemplates[cert] || generateReportContent(cert);
                        setSelectedReport({ name: cert, content });
                      }} 
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDownload(`${cert}.pdf`)} className="p-2 text-gray-600 hover:text-gray-800">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Audit Reports</h4>
              {customCertificates.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900">{report}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const content = documentTemplates[report] || generateReportContent(report);
                        setSelectedReport({ name: report, content });
                      }} 
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDownload(`${report}.pdf`)} className="p-2 text-gray-600 hover:text-gray-800">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Legal Management</h1>
            <p className="text-lg text-gray-600 max-w-3xl">Ensuring transparency and accountability in fund utilization through comprehensive legal compliance and regulatory management</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'tracking' && renderFundTracking()}
        {activeTab === 'ai-validation' && renderAIValidation()}
        {activeTab === 'policy-management' && renderPolicyManagement()}
        {activeTab === 'laws-regulations' && renderLawsRegulations()}
        {activeTab === 'digital-vault' && renderDigitalVault()}
        {activeTab === 'reports' && renderReports()}
      </div>
      
      <DonationModal />

      <UploadModal />
      
      {/* Policy Upload Modal */}
      {showPolicyUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Policy</h3>
              <button onClick={() => setShowPolicyUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
                <input 
                  type="text" 
                  value={policyUploadData.title}
                  onChange={(e) => setPolicyUploadData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter policy title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={policyUploadData.category}
                  onChange={(e) => setPolicyUploadData(prev => ({ ...prev, category: e.target.value as Policy['category'], customCategory: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Legal">Legal</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Operations">Operations</option>
                  <option value="Safety">Safety</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              
              {policyUploadData.category === 'Others' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
                  <input 
                    type="text" 
                    value={policyUploadData.customCategory}
                    onChange={(e) => setPolicyUploadData(prev => ({ ...prev, customCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter category type"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <select 
                  value={policyUploadData.visibility}
                  onChange={(e) => setPolicyUploadData(prev => ({ ...prev, visibility: e.target.value as Policy['visibility'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="internal">Internal Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  value={policyUploadData.description}
                  onChange={(e) => setPolicyUploadData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the policy"
                />
              </div>
              

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    {policyUploadData.file ? policyUploadData.file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPolicyUploadData(prev => ({ ...prev, file }));
                      }
                    }}
                    id="policy-file-upload"
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('policy-file-upload')?.click()}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <button 
                  onClick={() => {
                    setShowPolicyUpload(false);
                    setPolicyUploadData({ title: '', category: 'HR', customCategory: '', visibility: 'internal', description: '', file: null });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePolicyUpload}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Policy Text Viewer Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPolicy.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-600">Version {selectedPolicy.version}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{selectedPolicy.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPolicy.status === 'published' ? 'bg-green-100 text-green-800' :
                    selectedPolicy.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    selectedPolicy.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedPolicy.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPolicy(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Policy Content */}
              <div className="prose max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {generatePolicyContent(selectedPolicy)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    const content = generatePolicyContent(selectedPolicy);
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedPolicy.title}_${selectedPolicy.version}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Policy Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{selectedPolicy.createdDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Approved by:</span>
                    <p className="font-medium">{selectedPolicy.approvedBy || 'System'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document for AI Validation</h3>
              <button onClick={() => setShowDocumentUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Fund Category</label>
                <select 
                  id="expectedCategory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      const expectedCategory = (document.getElementById('expectedCategory') as HTMLSelectElement)?.value || 'Education';
                      if (file) {
                        handleDocumentUpload(file, expectedCategory);
                      }
                    }}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;
                      input.click();
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      input?.click();
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Details Modal */}
      {selectedValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Validation Details</h3>
              <button onClick={() => setSelectedValidation(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Document</h4>
                    <p className="text-xl font-bold text-blue-900">{selectedValidation.document}</p>
                    <p className="text-blue-700">Vendor: {selectedValidation.vendor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">AI Confidence</h4>
                    <p className="text-xl font-bold text-blue-900">{selectedValidation.confidence}%</p>
                    <p className="text-blue-700">Processing Date: {selectedValidation.date}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Status</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedValidation.status === 'compliant' ? 'bg-green-100 text-green-800' :
                      selectedValidation.status === 'needs-review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedValidation.status === 'compliant' ? '✅ Compliant' :
                       selectedValidation.status === 'needs-review' ? '⚠️ Needs Review' :
                       '❌ Non-Compliant'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Analysis */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI Category Analysis
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Expected Category:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedValidation.expectedCategory}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">AI Detected:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedValidation.detectedCategory === selectedValidation.expectedCategory 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedValidation.detectedCategory}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Amount:</span>
                      <span className="font-bold text-gray-900">₹{selectedValidation.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* AI Flags */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    AI Analysis Flags
                  </h4>
                  
                  <div className="space-y-3">
                    {selectedValidation.aiFlags.map((flag, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          flag.includes('confirmed') || flag.includes('detected') ? 'bg-green-500' :
                          flag.includes('mismatch') || flag.includes('misuse') ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-700">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extracted Text */}
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Extracted Document Text
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{selectedValidation.extractedText}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Utilized Funds Modal */}
      {showUtilizedFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Utilized Funds Overview</h3>
              <button onClick={() => setShowUtilizedFunds(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Header Summary */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Total Utilized</h4>
                    <p className="text-2xl font-bold text-orange-900">₹{totalUsed.toLocaleString()}</p>
                    <p className="text-orange-700">Across all projects</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Utilization Rate</h4>
                    <p className="text-2xl font-bold text-orange-900">{utilizationRate.toFixed(1)}%</p>
                    <p className="text-orange-700">Of total donations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Active Projects</h4>
                    <p className="text-2xl font-bold text-orange-900">{donations.filter(d => d.status === 'active').length}</p>
                    <p className="text-orange-700">Currently running</p>
                  </div>
                </div>
              </div>

              {/* Project-wise Utilization */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Project-wise Fund Utilization
                </h4>
                
                <div className="space-y-6">
                  {donations.map((donation) => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900">{donation.purpose}</h5>
                          <p className="text-gray-600">Donor: {donation.donorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">₹{donation.used.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">of ₹{donation.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{((donation.used / donation.amount) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(donation.used / donation.amount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Breakdown */}
                      {donation.breakdown && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {donation.breakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.category}</p>
                                  <p className="text-xs text-gray-600">{item.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-600">{item.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            setShowUtilizedFunds(false);
                            handleViewDonation(donation);
                          }}
                          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-2">Education Funds</h5>
                  <p className="text-2xl font-bold text-orange-900">₹{donations.filter(d => d.purpose.includes('Education')).reduce((sum, d) => sum + d.used, 0).toLocaleString()}</p>
                  <p className="text-orange-700">Utilized for education</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Healthcare Funds</h5>
                  <p className="text-2xl font-bold text-blue-900">₹{donations.filter(d => d.purpose.includes('Healthcare')).reduce((sum, d) => sum + d.used, 0).toLocaleString()}</p>
                  <p className="text-blue-700">Utilized for healthcare</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-2">Infrastructure Funds</h5>
                  <p className="text-2xl font-bold text-purple-900">₹{donations.filter(d => d.purpose.includes('Infrastructure')).reduce((sum, d) => sum + d.used, 0).toLocaleString()}</p>
                  <p className="text-purple-700">Utilized for infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewing Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Document: {viewingDocument.fileName}</h3>
              <button onClick={() => setViewingDocument(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-6 rounded-lg border font-mono text-sm whitespace-pre-wrap">
                {viewingDocument.content}
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => {
                    const blob = new Blob([viewingDocument.content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = viewingDocument.fileName.replace('.pdf', '.txt');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  Download Document
                </button>
                <button 
                  onClick={() => setViewingDocument(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {formType === 'certificate' ? 'Create New Certificate' : 'Create New Report'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {formType === 'certificate' ? (
                <CertificateForm onSubmit={(data) => {
                  setCustomReports(prev => [...prev, data.name]);
                  setDocumentTemplates(prev => ({...prev, [data.name]: generateCertificateContent(data)}));
                  setShowCreateModal(false);
                }} />
              ) : (
                <ReportForm onSubmit={(data) => {
                  setCustomCertificates(prev => [...prev, data.name]);
                  const content = data.autoGenerate ? generateAutoReport(data) : data.customContent;
                  setDocumentTemplates(prev => ({...prev, [data.name]: content}));
                  setShowCreateModal(false);
                }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Viewing Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedReport.name}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-6 rounded-lg border font-mono text-sm whitespace-pre-wrap">
                {selectedReport.content}
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => {
                    const blob = new Blob([selectedReport.content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedReport.name.replace(/\s+/g, '_')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Legal Requirement Text Viewer Modal */}
      {selectedLaw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedLaw.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-600">{selectedLaw.category}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLaw.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                    selectedLaw.complianceStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                    selectedLaw.complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedLaw.complianceStatus}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedLaw(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Law Content */}
              <div className="prose max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {generateLawContent(selectedLaw)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    const content = generateLawContent(selectedLaw);
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedLaw.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                
                <button 
                  onClick={() => setSelectedLaw(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Law Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Authority:</span>
                    <p className="font-medium">{selectedLaw.authority}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Impact Level:</span>
                    <p className="font-medium">{selectedLaw.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredSegment && (
        <div 
          className="fixed z-50 bg-white text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm font-semibold">{hoveredSegment.category}</div>
          <div className="text-xs text-gray-600">₹{hoveredSegment.amount.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}