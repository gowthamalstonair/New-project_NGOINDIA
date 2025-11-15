<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Mock CSR partners data for public display
    $partners = [
        [
            'id' => '1',
            'name' => 'Tech Innovations Ltd',
            'logo' => '/company-logos/tech-innovations.png',
            'description' => 'Tech Innovations Ltd strongly believes in creating valuable relations and partnerships as they help in knowledge interaction, improving expertise, and increasing resources to reach a wider audience. We understand that the right business partnerships enhance the ethos of our organisation and our corporate partners are consistent with their contributions to the digital education programme.',
            'partnership' => 'Since FY 2020-21',
            'experience' => '4+ years of partnership',
            'focusAreas' => ['Digital Education', 'Technology Access', 'Skill Development'],
            'impact' => [
                'funding' => '₹15 Lakhs',
                'projects' => 8,
                'beneficiaries' => '2,500+'
            ]
        ],
        [
            'id' => '2',
            'name' => 'Green Energy Corp',
            'logo' => '/company-logos/green-energy.png',
            'description' => 'Green Energy Corp is a leading renewable energy company with expertise in solar and wind power solutions. They have a diverse investment portfolio and disciplined sustainability processes. This, together with their clear and consistent environmental strategy, underpins their competitive advantage. They have operations across India and are partnered with NGO India since FY 2019-20.',
            'partnership' => 'Since FY 2019-20',
            'experience' => '5+ years of partnership',
            'focusAreas' => ['Environment', 'Clean Energy', 'Rural Development'],
            'impact' => [
                'funding' => '₹25 Lakhs',
                'projects' => 12,
                'beneficiaries' => '5,000+'
            ]
        ],
        [
            'id' => '3',
            'name' => 'Healthcare Solutions Pvt Ltd',
            'logo' => '/company-logos/healthcare-solutions.png',
            'description' => 'Healthcare Solutions brings together a deep collective of expertise across all healthcare facets with 15+ years of public health knowledge and experience. Our goal is to help communities access better healthcare services and improve health outcomes. We enhance healthcare delivery to millions of patients, hospitals, and healthcare providers. Healthcare Solutions modernizes the healthcare experience for rural communities.',
            'partnership' => 'Since FY 2021-22',
            'experience' => '3+ years of partnership',
            'focusAreas' => ['Healthcare', 'Medical Camps', 'Health Awareness'],
            'impact' => [
                'funding' => '₹30 Lakhs',
                'projects' => 15,
                'beneficiaries' => '8,000+'
            ]
        ]
    ];

    $statistics = [
        'totalPartners' => 15,
        'totalFunding' => '₹3.2 Crore',
        'totalProjects' => 48,
        'totalBeneficiaries' => '12,500+'
    ];

    echo json_encode([
        'success' => true,
        'partners' => $partners,
        'statistics' => $statistics
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load CSR partners data: ' . $e->getMessage()
    ]);
}
?>