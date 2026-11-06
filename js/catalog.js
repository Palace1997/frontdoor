/* FrontDoor, design catalog
   Single source of truth for the gallery, the homepage finder and featured designs.
   Taxonomy: the behavioral health umbrella (Mental Health + Substance Use), 12 practice areas.
   Each design is tagged with ONE practice type. Entries with soon:true are planned designs
   that are not built yet; they render as "coming soon" cards with no preview. */
(function () {
  var GROUPS = [
    { id: 'mh', name: 'Mental Health' },
    { id: 'su', name: 'Substance Use' }
  ];

  var AREAS = [
    { id: 'psychiatry', group: 'mh', name: 'Psychiatry', blurb: 'Evaluation, diagnosis and medication management.' },
    { id: 'psychology', group: 'mh', name: 'Psychology / Neuropsychology', blurb: 'Assessment, testing and evidence-based therapy.' },
    { id: 'counseling', group: 'mh', name: 'Psychotherapy & Counseling', blurb: 'Talk therapy for individuals, couples and groups.' },
    { id: 'social-work', group: 'mh', name: 'Clinical Social Work', blurb: 'Therapy plus the practical support around it.' },
    { id: 'mft', group: 'mh', name: 'Marriage & Family Therapy', blurb: 'Couples, families and the relationships between them.' },
    { id: 'psych-nursing', group: 'mh', name: 'Psychiatric Nursing', blurb: 'Psychiatric nurse practitioners and nursing-led care.' },
    { id: 'psych-rehab', group: 'mh', name: 'Psychiatric Rehabilitation', blurb: 'Skills, routines and community for daily life.' },
    { id: 'aba', group: 'mh', name: 'Applied Behavior Analysis (ABA)', blurb: 'Skill building for autistic children and their families.' },
    { id: 'expressive', group: 'mh', name: 'Expressive & Occupational Therapies', blurb: 'Art, music and occupational approaches to wellbeing.' },
    { id: 'addiction-med', group: 'su', name: 'Addiction Medicine', blurb: 'Medical care for substance use, including medication.' },
    { id: 'sud', group: 'su', name: 'SUD Counseling', blurb: 'Counseling for substance use and recovery.' },
    { id: 'peer', group: 'su', name: 'Peer Recovery Support', blurb: 'Recovery coaching from people with lived experience.' }
  ];

  var TYPES = [
    { id: 'solo', name: 'Solo practice' },
    { id: 'group', name: 'Group practice' },
    { id: 'clinic', name: 'Clinic / multi-location' },
    { id: 'program', name: 'Program / organization' }
  ];

  // feel = how the design looks and feels; best = who it suits
  var DESIGNS = [
    // Psychiatry
    { id: 'voss', name: 'Voss', practice: 'Voss Psychiatry', area: 'psychiatry', type: 'solo', file: 'templates/sectors/psychiatrist.html', accent: '#4B4E8C', feel: 'Calm indigo, measured and reassuring', best: 'A psychiatrist offering evaluations and medication management' },
    { id: 'cedarcrest', name: 'Cedarcrest', practice: 'Cedarcrest Behavioral Hospital', area: 'psychiatry', type: 'program', file: 'templates/sectors/inpatient.html', accent: '#23406B', feel: 'Deep navy, steady and serious', best: 'Inpatient and hospital-based psychiatric care' },
    { id: 'evenkeel', name: 'Even Keel', practice: 'Even Keel Clinic', area: 'psychiatry', type: 'clinic', file: 'templates/sectors/mood-anxiety.html', accent: '#3D7EA6', feel: 'Light, airy blue with lots of space', best: 'Clinics focused on depression, bipolar and anxiety' },
    // Psychology / Neuropsychology
    { id: 'northshore', name: 'Northshore', practice: 'Northshore Psychology', area: 'psychology', type: 'group', file: 'templates/sectors/psychologist.html', accent: '#3E6EA0', feel: 'Clear blue, orderly and precise', best: 'Psychologists offering assessment and therapy' },
    { id: 'spectrum', name: 'Spectrum Bridge', practice: 'Spectrum Bridge', area: 'psychology', type: 'clinic', file: 'templates/sectors/adhd-autism.html', accent: '#7A5AA6', feel: 'Warm violet on cream, kind and calm', best: 'ADHD and autism assessment and support' },
    // Psychotherapy & Counseling
    { id: 'willow', name: 'Willow', practice: 'Willow Counseling', area: 'counseling', type: 'solo', file: 'templates/sectors/therapist.html', accent: '#5C8A5E', feel: 'Soft sage on warm white, gentle', best: 'A counselor seeing individuals, in person or online' },
    { id: 'riverbend', name: 'Riverbend', practice: 'Riverbend Practice', area: 'counseling', type: 'group', file: 'templates/sectors/outpatient.html', accent: '#2E8B8B', feel: 'Welcoming teal, clear and friendly', best: 'Outpatient practices with several clinicians' },
    { id: 'anchorage', name: 'Anchorage', practice: 'Anchorage Trauma Center', area: 'counseling', type: 'clinic', file: 'templates/sectors/trauma.html', accent: '#2C6E76', feel: 'Quiet deep teal, low stimulation', best: 'Trauma and PTSD focused care' },
    { id: 'harborlight', name: 'Harborlight', practice: 'Harborlight Center', area: 'counseling', type: 'program', file: 'templates/sectors/eating-disorder.html', accent: '#5A8FA0', feel: 'Gentle sea blue on sand, hopeful', best: 'Eating disorder treatment programs' },
    { id: 'anywhere', name: 'Anywhere', practice: 'Anywhere Therapy', area: 'counseling', type: 'group', file: 'templates/sectors/teletherapy.html', accent: '#5B5BD6', feel: 'Bright periwinkle, modern', best: 'Online-first therapy practices' },
    // Clinical Social Work
    { id: 'commonground', name: 'Common Ground', practice: 'Common Ground CMHC', area: 'social-work', type: 'program', file: 'templates/sectors/community-mhc.html', accent: '#4E8A5A', feel: 'Grounded green, accessible and content-rich', best: 'Community mental health centers' },
    { id: 'valor', name: 'Valor', practice: 'Valor Veteran Care', area: 'social-work', type: 'program', file: 'templates/sectors/veterans.html', accent: '#35506B', feel: 'Steel blue, steady and respectful', best: 'Services for veterans and military families' },
    { id: 'lifeline', name: 'Lifeline', practice: 'Lifeline Crisis Response', area: 'social-work', type: 'program', file: 'templates/sectors/crisis.html', accent: '#2166A6', feel: 'Clear blue, direct and calm', best: 'Crisis lines and mobile crisis teams' },
    // Marriage & Family Therapy
    { id: 'brightkids', name: 'Bright Kids', practice: 'Bright Kids', area: 'mft', type: 'group', file: 'templates/sectors/child-adolescent.html', accent: '#DD6E4E', feel: 'Warm coral, friendly and upbeat', best: 'Child, teen and family therapy' },
    { id: 'tandem', name: 'Tandem', practice: 'Tandem Couples & Family Therapy', area: 'mft', type: 'group', file: 'templates/practices/mft-tandem.html', accent: '#6E4560', feel: 'Elegant plum, airy and balanced', best: 'Couples and family therapists working as a team', isNew: true },
    // Psychiatric Nursing
    { id: 'clarity', name: 'Clarity', practice: 'Clarity Psychiatric NPs', area: 'psych-nursing', type: 'group', file: 'templates/sectors/psych-np.html', accent: '#1F8A99', feel: 'Fresh teal, open and accessible', best: 'Groups of psychiatric nurse practitioners' },
    { id: 'juniper', name: 'Juniper', practice: 'Juniper Psychiatric Care', area: 'psych-nursing', type: 'solo', file: 'templates/practices/psychnp-juniper.html', accent: '#2F6E7A', feel: 'Clinical but soft, crisp and kind', best: 'A PMHNP running their own practice', isNew: true },
    // Psychiatric Rehabilitation
    { id: 'meridian', name: 'Meridian', practice: 'Meridian Day Program', area: 'psych-rehab', type: 'program', file: 'templates/sectors/iop-php.html', accent: '#2F8F7A', feel: 'Calm green-teal, structured', best: 'Intensive outpatient and day programs' },
    // ABA
    { id: 'northstar', name: 'Northstar', practice: 'Northstar ABA Centers', area: 'aba', type: 'clinic', file: 'templates/practices/aba-northstar.html', accent: '#2A6F97', feel: 'Bright, organized and family-friendly', best: 'ABA providers with several centers and in-home care', isNew: true },
    // Expressive & Occupational
    { id: 'canvas', name: 'Canvas & Chord', practice: 'Canvas & Chord Creative Therapies', area: 'expressive', type: 'solo', file: 'templates/practices/expressive-canvas-chord.html', accent: '#B5532C', feel: 'Creative and gentle, like a sunlit studio', best: 'Art and music therapists', isNew: true },
    // Addiction Medicine
    { id: 'lakehouse', name: 'Lakehouse', practice: 'Lakehouse Recovery', area: 'addiction-med', type: 'program', file: 'templates/sectors/residential.html', accent: '#3B6B4F', feel: 'Forest green, restful and private', best: 'Residential treatment' },
    // SUD Counseling
    { id: 'newpath', name: 'New Path', practice: 'New Path Counseling', area: 'sud', type: 'solo', file: 'templates/sectors/sud-counselor.html', accent: '#B5763A', feel: 'Warm amber on cream, encouraging', best: 'Substance use counselors in private practice' },
    // Peer Recovery Support
    { id: 'openroad', name: 'Open Road', practice: 'Open Road Recovery Community Center', area: 'peer', type: 'program', file: 'templates/practices/peer-open-road.html', accent: '#C4522A', feel: 'Warm and hopeful, community-first', best: 'Peer recovery community centers', isNew: true },
    { id: 'beacon', name: 'Beacon', practice: 'Beacon Neuropsychology', area: 'psychology', type: 'solo', file: 'templates/practices/psychology-beacon.html', accent: '#3A4E8C', feel: 'Precise and clinical, report-led', best: 'Neuropsychologists offering testing and reports', isNew: true },
    { id: 'common-table', name: 'Common Table', practice: 'Common Table Clubhouse', area: 'psych-rehab', type: 'program', file: 'templates/practices/clubhouse-common-table.html', accent: '#2E8B7A', feel: 'Warm and communal, belonging first', best: 'Clubhouses and psychosocial rehab programs', isNew: true },
    { id: 'hearth', name: 'Hearth', practice: 'Hearth ABA', area: 'aba', type: 'group', file: 'templates/practices/aba-hearth.html', accent: '#2F7FB0', feel: 'Warm and friendly, in-home', best: 'BCBA-led teams providing in-home ABA', isNew: true },
    { id: 'groundwork', name: 'Groundwork', practice: 'Groundwork Occupational Therapy', area: 'expressive', type: 'group', file: 'templates/practices/ot-groundwork.html', accent: '#B5633C', feel: 'Earthy and practical, hands-on', best: 'Occupational therapy for mental health', isNew: true },
    { id: 'rivergate', name: 'Rivergate', practice: 'Rivergate Recovery Medicine', area: 'addiction-med', type: 'clinic', file: 'templates/practices/mat-rivergate.html', accent: '#2C7A8C', feel: 'Calm and credible, medical', best: 'Outpatient clinics offering medication for addiction treatment', isNew: true },
    { id: 'fieldstone', name: 'Fieldstone', practice: 'Fieldstone Counseling', area: 'sud', type: 'group', file: 'templates/practices/sud-fieldstone.html', accent: '#A4611F', feel: 'Warm and encouraging', best: 'Group practices of licensed SUD counselors', isNew: true },
    { id: 'throughline', name: 'Throughline', practice: 'Throughline Recovery Coaching', area: 'peer', type: 'solo', file: 'templates/practices/coaching-throughline.html', accent: '#C8572A', feel: 'Bold and personal, lived experience', best: 'Independent recovery coaches', isNew: true },
  ];

  /* Simple public-facing browse categories (the vertical filter).
     Every design maps to exactly one, best-fit:
       counseling area            -> Psychotherapy & Counseling
       solo type                  -> Solo Practice
       group type                 -> Group Practice
       clinic + program types     -> Program & Organization  */
  var CATEGORIES = [
    { id: 'solo', name: 'Solo Practice' },
    { id: 'group', name: 'Group Practice' },
    { id: 'psychotherapy', name: 'Psychotherapy & Counseling' },
    { id: 'program', name: 'Program & Organization' }
  ];
  function categoryOf(d) {
    if (d.area === 'counseling') return 'psychotherapy';
    if (d.type === 'solo') return 'solo';
    if (d.type === 'group') return 'group';
    return 'program';
  }

  /* Cache-buster for every template loaded into an iframe (carousel cards,
     gallery cards, the preview modal). It used to be hardcoded in four places
     across designs.js and reels.js, so edits to a template or to
     css/template.css kept being served stale. Bump this one line instead. */
  window.SW_TPL_V = '20261106a';

  window.SW_CATALOG = { groups: GROUPS, areas: AREAS, types: TYPES, designs: DESIGNS, categories: CATEGORIES, categoryOf: categoryOf };
})();
