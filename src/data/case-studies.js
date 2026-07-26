// Case studies migrated from the live White Fuse site, July 2026.
//
// IMPORTANT: the four-section bodies below are DERIVED — restructured by us
// from the client's original prose into the format their July brief specifies.
// They are drafts for the client to approve, not client-approved copy.
// The Voices of Refugee Youth entry is the exception: that text is the
// client's own, supplied verbatim in the brief.

const IMAGE_BASE =
  'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file';

export const CASE_STUDIES = [
  {
    slug: 'aga-khan-foundation-ict-in-education',
    title: 'Aga Khan Foundation: Transforming Student Learning and TPD through ICT',
    countries: ['Kenya', 'Uganda'],
    partners: ['Aga Khan Foundation'],
    service: 'Large-scale, mixed-method studies',
    topics: ['Foundational Learning', 'Teacher professional development', 'Technology and education'],
    method: 'Quasi-experimental baseline study',
    summary:
      "A quasi-experimental baseline study of Grade 1 literacy and numeracy across 76 primary schools in Kenya and Uganda, set up to measure the impact of the Aga Khan Foundation's ICT in education programme.",
    sections: {
      criticalQuestion:
        "The Aga Khan Foundation's ICT programme set out to install laptops and tablets pre-loaded with tailored digital content in 63 primary schools across Kenya and Uganda, and to train roughly 500 teachers to integrate them into the classroom. Before any of that took effect, there was no measure of where Grade 1 literacy and numeracy stood, nor of how much ICT teachers and pupils already had access to. The baseline study was commissioned to establish both.",
      collaboration:
        "Jigsaw conducted the study for the Aga Khan Foundation, which runs the 'Transforming Student Learning and Teacher Professional Development through ICT' programme in Kenya and Uganda. Fieldwork ran through a team of local enumerators recruited and trained by Jigsaw.",
      buildingEvidence:
        "The study used a quasi-experimental design covering 38 intervention schools and 38 control schools, applying standardised Early Grade Reading and Maths Assessments (EGRA and EGMA). Enumerators administered the assessments in private, one-to-one interviews using RTI's digital Tangerine tool, establishing learning outcomes for 933 students in Kwale County, Kenya and 982 students in Arua County, Uganda. Student, teacher and head-teacher surveys plus school inventory logs captured the surrounding learning environment. In-depth focus group discussions, interviews and lesson observations added head teacher and teacher perspectives on using ICT to enhance teaching and learning.",
      pathwaysToUptake:
        'The baseline documented differences in learning outcomes and ICT exposure between the two regions, and Jigsaw gave the Aga Khan Foundation recommendations on how to implement the programme. An endline study was planned to follow, measuring the impact of the programme on student learning outcomes and on ICT access and capacity.'
    },
    image: `${IMAGE_BASE}/33/tile_fill_AKF_photo.png`,
    links: [],
    sourceUrl: 'https://www.jigsaweducation.org/stories/12-aga-khan-foundation',
    isDerived: true
  },

  {
    slug: 'british-council-environmental-impact-of-tpd',
    title: 'British Council: Measuring the environmental impact of TPD',
    countries: ['Rwanda'],
    partners: ['British Council'],
    service: 'Technical assistance and evidence synthesis',
    topics: [
      'Climate-resilient learning environments',
      'Teacher professional development',
      'Technology and education'
    ],
    method: 'Exploratory carbon footprint assessment',
    summary:
      'An exploratory study for the British Council that built a framework for assessing the carbon footprint of blended teacher professional development, piloted on the STELIR programme in Rwanda.',
    sections: {
      criticalQuestion:
        'The education sector is under growing pressure to deliver programmes more sustainably, yet almost no evidence exists on the environmental impact of delivering them. That gap leaves decision makers unable to judge where action would reduce impact, particularly for technology-heavy programming whose environmental implications run both ways. This study set out to test an exploratory approach to measuring that impact and to start building the evidence base.',
      collaboration:
        'The British Council commissioned the work and delivered it in partnership with Jigsaw. The Secondary Teachers English Language Improvement Rwanda (STELIR) programme, a large-scale blended teacher professional development project being implemented in Rwanda, served as the pilot case study.',
      buildingEvidence:
        'Jigsaw established a process framework for assessing the carbon footprint of a large-scale blended teacher professional development programme, built around a comparison of face-to-face and online delivery models. STELIR was used to pilot that framework in practice. Underpinning the assessment, the team developed an activity mapping matrix and a calculation spreadsheet setting out the detail behind each figure.',
      pathwaysToUptake:
        'The team produced three core products: a case study report on STELIR, a framework document, and a recommendations document, intended to be read as a complementary set. All three are published alongside the activity mapping matrix and the calculation spreadsheet, so other programmes can apply the same method to their own delivery.'
    },
    image: `${IMAGE_BASE}/317/tile_fill_group_work_interaction_with_trainer__1_.JPG`,
    links: [
      {
        label: 'Carbon footprint assessment of STELIR: a case study report',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/314/Carbon_footprint_assessment_of_STELIR__a_case_study_report_-_May_2024.pdf'
      },
      {
        label: 'Framework for assessing the carbon footprint of TPD programmes',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/315/Framework_for_assessing_the_carbon_footprint_of_teacher_professional_development_programmes_-_May_2024.pdf'
      },
      {
        label: 'Recommendations for assessing the carbon footprint of TPD programmes',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/316/Recommendations_for_assessing_the_carbon_footprint_of_teacher_professional_development_programmes_-_May_2024.pdf'
      },
      {
        label: 'STELIR programme',
        url: 'https://www.britishcouncil.rw/programmes/education/secondary-teachers-english-language-improvement-rwanda-stelir'
      }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/british-council',
    isDerived: true
  },

  {
    slug: 'cambridge-education-edtech-strategy-review',
    title: 'Cambridge Education: Education technology strategy review',
    countries: [],
    partners: ['Cambridge Education'],
    service: 'Strategy and advisory',
    topics: ['Education policy, systems and governance', 'Technology and education'],
    method: 'Phased strategic review',
    summary:
      'A strategic review of how Cambridge Education uses education technology across its programmes, supporting the development of an organisational edtech strategy.',
    sections: {
      criticalQuestion:
        'Cambridge Education manages education system strengthening programmes across Africa and Asia, and almost every one of them engages with education technology in some form. The organisation had no shared direction on using edtech effectively across that portfolio. Jigsaw was commissioned to review current practice and support the development of an organisational strategy.',
      collaboration:
        'Cambridge Education commissioned the review, and Jigsaw developed it in dialogue with their team throughout.',
      buildingEvidence:
        "The review used a phased research process: a review of background documentation, interviews with team members from various projects that engage with edtech, and the pre-existing expertise of the research team. The interviews grounded the review in the needs, challenges and opportunities as project staff themselves described them. Analysis drew on good practice from the Principles for Digital Development, along with wider lessons from the literature and sector evidence.",
      pathwaysToUptake:
        'The main written report, submitted in early 2020, set out a broad overview of how technology is used in education alongside detailed recommendations, edtech resources, and specific guidance on using technology in an evidence-based manner. A webinar followed to mobilise the findings and get key people across Cambridge Education discussing edtech in relation to both their project work and the organisation more broadly.'
    },
    image: null,
    links: [{ label: 'Cambridge Education', url: 'http://www.camb-ed.com' }],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/56-education-technology-strategy-review',
    isDerived: true
  },

  {
    slug: 'dfid-mapping-education-technology',
    title: 'DFID: Mapping education technology',
    countries: [],
    partners: ['DFID'],
    service: 'Technical assistance and evidence synthesis',
    topics: ['Technology and education'],
    method: 'Evidence mapping',
    summary:
      'An evidence map and paired guidance document collating 401 resources on education technology in low-income environments, commissioned by DFID.',
    sections: {
      criticalQuestion:
        'Rigorous evidence on the impact education technology has on learning outcomes in low-income environments is scarce. DFID asked the Jigsaw team in 2017 to collate the evidence that did exist, identify the gaps in it, and give guidance for future research priorities.',
      collaboration:
        'DFID commissioned the study in 2017. The work went on to contribute to the development of EdTech Hub, where Jigsaw is a core partner organisation.',
      buildingEvidence:
        'The team collated 401 resources into an evidence map, paired with a guidance document. Analysis of the map showed that most publications rest on observational studies (278), with only 23 experimental studies and 22 multi-country studies. Curriculum and pedagogy (263) and teacher training (139) were the most frequent intervention and input areas, while teacher ICT literacy and use (262) and student ICT literacy and use (223) were the most frequent outputs. The map catalogues the evidence without independently assessing the quality of the studies it contains, and should be used with that caveat in mind.',
      pathwaysToUptake:
        'The evidence map and guidance document were published as a pair and are also available from DFID on the gov.uk website. They are intended as resources for anyone in the sector engaging with edtech evidence, and as tools to help shape policy and practical decisions in education.'
    },
    image: null,
    links: [
      {
        label: 'Education technology evidence map',
        url: 'https://drive.google.com/file/d/0B1DQ3UnObA5YbzdZaWlKakhScWM/view?usp=sharing'
      },
      {
        label: 'Education technology guidance document',
        url: 'https://drive.google.com/file/d/1_yXE0VZ7BeqVV8aTgDnJkcaWs5UehiUP/view?usp=sharing'
      },
      {
        label: 'Both resources on gov.uk',
        url: 'https://www.gov.uk/dfid-research-outputs/education-technology-evidence-map'
      },
      { label: 'EdTech Hub', url: 'http://edtechhub.org' }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/3-dfid-mapping-education-technology',
    isDerived: true
  },

  {
    slug: 'voices-of-refugee-youth',
    title: 'Dubai Cares and UNHCR: Voices of Refugee Youth',
    countries: ['Pakistan', 'Rwanda'],
    partners: ['Dubai Cares', 'Refugee Education UK', 'UNHCR'],
    service: 'Large-scale, mixed-method studies',
    topics: ['Education in crisis and conflict'],
    method: 'Longitudinal panel study',
    summary:
      'A longitudinal panel study of 1,126 refugee students in Pakistan and Rwanda, designed and delivered with 31 refugee youth co-researchers.',
    sections: {
      criticalQuestion:
        'Evidence about post-primary education for refugees is not only scarce, but refugees themselves rarely have an active role in research. This study therefore aimed to build rigorous evidence about refugees’ onward transitions out of secondary and higher education at the same time as enabling refugee participation throughout the research, supporting pathways to their future employment.',
      collaboration:
        'The study was conducted in partnership with Refugee Education UK and UNHCR. It was part of the Evidence for Education in Emergencies (E-Cubed) Research Envelope, funded by Dubai Cares.',
      buildingEvidence:
        'The research comprised a panel study, tracking the post-primary transitions of 1,126 refugee youth into employment or future studies. The longitudinal survey was complemented by key informant interviews and focus group discussions to add detail to the study findings. Critically, the study adopted a youth-centred, participatory design, where 31 refugee youth were recruited as co-researchers and participated in an accredited training programme.',
      pathwaysToUptake:
        'The results indicated the significant positive impact which post-primary education can have for refugee students, yet a range of systemic factors were identified which frequently constrain refugees’ pathways to future education opportunities and employment. Higher education, in particular, was seen to enhance refugee agency. A range of research outputs have been published, including a flagship report, policy brief, youth advocacy reports and a participation toolkit.'
    },
    image: `${IMAGE_BASE}/44/tile_fill_Dubai_Cares_-_ecubed_-_2019_-_participatory_activity.JPG`,
    links: [
      { label: 'Research publications', url: 'https://gere-research.org/study-1/' },
      { label: 'GERE initiative', url: 'https://gere-research.org/' }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/20-dubai-cares-and-unhcr-voices-of-refugee-youth',
    isDerived: false
  },

  {
    slug: 'edtech-hub',
    title: 'EdTech Hub: Evidence for Education Technology',
    countries: [],
    partners: [
      'FCDO',
      'World Bank',
      'Gates Foundation',
      'Results for Development',
      'Brink',
      'University of Cambridge',
      'ODE',
      'ODI'
    ],
    service: 'Embedded learning partnerships',
    topics: ['Education policy, systems and governance', 'Technology and education'],
    method: 'Consortium research partnership',
    summary:
      'A global research initiative producing rigorous evidence and advice on technology in education for low-income contexts, with Jigsaw as one of the core consortium organisations.',
    sections: {
      criticalQuestion:
        'Technology has the potential to help address the global learning crisis, but that potential has not yet been realised. Policymakers and other decision makers face an overwhelming choice of technology solutions, are often unclear on what works and what does not, and end up making decisions on limited evidence. EdTech Hub exists to address that problem.',
      collaboration:
        'EdTech Hub is a global initiative funded by FCDO, the World Bank and the Gates Foundation, and Jigsaw is one of the core consortium organisations. Jigsaw works in close partnership with Results for Development, Brink, the University of Cambridge, ODE and ODI.',
      buildingEvidence: '[tbc]',
      pathwaysToUptake:
        'The Hub helps decision makers inside and outside government make clear, evidence-based policy decisions aimed at maximum impact on learning outcomes. Its research outputs are published on the EdTech Hub website.'
    },
    image: null,
    links: [{ label: 'EdTech Hub', url: 'http://edtechhub.org/' }],
    sourceUrl: 'https://www.jigsaweducation.org/stories/57-edtech-hub',
    isDerived: true
  },

  {
    slug: 'girls-education-challenge',
    title: "Girls' Education Challenge: Assessing Quality Education for Girls",
    countries: ['Kenya', 'Sierra Leone', 'Uganda'],
    partners: [
      'Avanti Communications',
      'DFID',
      'Opportunity International',
      'PEAS',
      'Plan International'
    ],
    service: 'Large-scale, mixed-method studies',
    topics: ['Foundational Learning', 'Skills and pathways to employment'],
    method: 'Longitudinal mixed-methods evaluation',
    summary:
      "External evaluation of four Girls' Education Challenge projects in Kenya, Uganda and Sierra Leone, using longitudinal mixed-methods studies of girls' learning, transition and sustainability.",
    sections: {
      criticalQuestion:
        "The Girls' Education Challenge was launched by the UK Department for International Development in 2012 as a 12-year commitment to reach the most marginalised girls in the world, and its second phase, GEC-T, covers 41 projects across 17 countries with a focus on transitions to secondary education and beyond. GEC-T set out to build a large evidence base on the challenges behind the educational marginalisation of girls. Jigsaw's studies were commissioned to gather rigorous evidence on project impact on numeracy, literacy, transition and sustainability.",
      collaboration:
        "Jigsaw acted as external evaluator for four organisations implementing GEC-funded projects: Avanti Communications, PEAS, Opportunity International and Plan International. Data collection ran collaboratively with teams of enumerators, such as RDM in Uganda, across schools in Kenya, Uganda and Sierra Leone.",
      buildingEvidence:
        "Each study was adapted to the project design of its organisation but shared a mixed-methods, quasi-experimental approach with control and intervention groups, collecting data from cohorts of girls and households at three points. Standardised reading and numeracy assessments (EGRA/EGMA or SeGRA/SeGMA) covered between 900 and 1,400 respondents per study, alongside quantitative surveys of between 2,100 and 2,400. Qualitative work added roughly 30 focus group discussions, between 7 and 50 lesson observations, and between 10 and 30 key informant interviews per study. Control schools supplied comparison data against the intervention schools. When Covid-19 closed schools, collection for PEAS and Avanti Communications moved to remote key informant interviews with project staff, partners, school management and teachers, plus a digital teacher survey and project data analysis for Avanti Communications in Kenya.",
      pathwaysToUptake:
        "The final study was completed in 2021. A selection of the evaluation reports is published on the Girls' Education Challenge website, covering Plan International UK's midline in Sierra Leone and endlines for the iMlango project in Kenya, PEAS in Uganda and Opportunity International in Uganda."
    },
    image: `${IMAGE_BASE}/42/tile_fill_GEC_case_study_photo.jpg`,
    links: [
      {
        label: "Midline evaluation for Plan International UK's GEC-T project in Sierra Leone",
        url: 'https://girlseducationchallenge.org/media/a1bhqb0h/gate-gec-sierra-leone-ml-website2.pdf'
      },
      {
        label: 'Endline evaluation of the GEC-T iMlango project in Kenya',
        url: 'https://girlseducationchallenge.org/media/3o0bf4kk/imlango-gect-endline-evaluation.pdf'
      },
      {
        label: 'Endline evaluation for PEAS GEARRing Up for Success After School in Uganda',
        url: 'https://girlseducationchallenge.org/media/udxnpqje/gearr-gect-endline-evaluation.pdf'
      },
      {
        label: "Endline evaluation for Opportunity International's GEC-T project in Uganda",
        url: 'https://girlseducationchallenge.org/media/vz4ma3t2/gef-gect-endline-evaluation.pdf'
      },
      { label: "Girls' Education Challenge", url: 'http://girlseducationchallenge.org/' }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/22-girls-education-challenge',
    isDerived: true
  },

  {
    slug: 'giz-employability-through-higher-education-for-refugees',
    title: 'GIZ: Employability through higher education for refugees',
    countries: [],
    partners: ['GIZ', 'Kepler', 'Kiron', 'JOSY'],
    service: 'Technical assistance and evidence synthesis',
    topics: [
      'Education in crisis and conflict',
      'Skills and pathways to employment',
      'Technology and education'
    ],
    method: 'Programme review and stakeholder interviews',
    summary:
      "A study for GIZ on how technology-supported higher education programmes for refugees can be designed to maximise their impact on graduates' future employability.",
    sections: {
      criticalQuestion:
        'Technology-supported higher education programmes for refugees have multiplied, but how their design shapes graduates’ employment prospects is poorly understood. GIZ asked Jigsaw to examine how such programmes can be designed to maximise impact on future employability. The study responds to a lack of understanding of the long-term impact of higher education on refugee employability and the absence of a systematic evidence base.',
      collaboration:
        'GIZ commissioned the study. A workshop at Mobile Learning Week 2017 in Paris was held in partnership with GIZ, Kepler, Kiron and JOSY.',
      buildingEvidence:
        'The study combined a review of relevant programmes, interviews with key stakeholders, and the facilitation of the Mobile Learning Week workshop. Analysis was organised around three lenses on employability within refugee higher education: overcoming barriers to labour market integration, collaboration with employers, and curriculum design for employability. The first examined legal barriers and the right to work across different contexts, and how programmes build skill-sets, entrepreneurship and remote working as routes around them. The second looked at mentorship and internships with potential employers, and at whether such collaborations are sustainable or scalable. The third explored pedagogical approaches and course design, including demand-driven design and the embedding of soft skills and personal formation.',
      pathwaysToUptake:
        'The report is published and available to download, closing with five cross-cutting issues: designing around the multiple possible employment futures refugees face, setting clear expectations with students, the difficulty of collaborating with private sector employers at scale, TVET as an under-explored area, and the gap in long-term evidence. It calls for a systematic evidence base on the long-term impact of higher education on refugee employability to inform good practice.'
    },
    image: null,
    links: [
      {
        label: 'Refugee higher education and employability (report)',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/5/Refugee_higher_education_and_employability.pdf'
      },
      { label: 'Mobile Learning Week', url: 'https://en.unesco.org/mlw' }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/2-giz-employability-through-higher-education-for-refugees',
    isDerived: true
  },

  {
    slug: 'gpe-unhcr-historical-mapping-refugee-education',
    title: 'GPE and UNHCR: Historical mapping study for refugee education',
    countries: ['Bangladesh', 'Rwanda', 'Turkey'],
    partners: ['Global Partnership for Education', 'UNHCR', 'Refugee Education UK'],
    service: 'Technical assistance and evidence synthesis',
    topics: [
      'Education financing and cost-effectiveness',
      'Education in crisis and conflict',
      'Education policy, systems and governance'
    ],
    method: 'Historical case history mapping',
    summary:
      'Country case histories of education provision for refugees in Bangladesh, Rwanda and Turkey, plus a cross-cutting comparative analysis, for GPE and UNHCR.',
    sections: {
      criticalQuestion:
        'Governments and their humanitarian and development education partners approach refugee education from different starting points, and where those approaches converge is not well documented. The study set out to identify which factors in the early stages of a refugee response determine whether refugees are integrated into national education systems or educated in separate ones. It also aimed to identify factors for further study that could point to the programme and policy actions behind more effective and sustainable refugee education responses from the emergency stage forward.',
      collaboration:
        'The Global Partnership for Education and UNHCR commissioned the work. Jigsaw undertook it in collaboration with partner organisation Refugee Education UK.',
      buildingEvidence:
        'The study used in-depth interviews to construct historical timelines and understand the key decision-making processes behind the events in each country. Three case histories were built, covering Bangladesh from 2017 to 2019, Rwanda from 2012 to 2019 and Turkey from 2011 to 2019. Within the research objectives, each case history focused on government policy and leadership, the contribution and engagement of partners, and humanitarian and development financing. A cross-cutting analysis then compared the three country contexts.',
      pathwaysToUptake:
        'The findings highlighted multiple lessons learned along with practice the wider refugee education sector can adopt, contributing to a greater understanding of where governments and their partners can converge to meet the educational needs of displaced populations and host communities. All four outputs, the three country case histories and the cross-cutting analysis, are published on the Global Partnership for Education website.'
    },
    image: null,
    links: [
      {
        label: 'Bangladesh: A case history of education provision for refugees, 2017 to 2019',
        url: 'http://www.globalpartnership.org/content/bangladesh-case-history-education-provision-refugees-2017-2019'
      },
      {
        label: 'Rwanda: A case history of education provision for refugees, 2012 to 2019',
        url: 'http://www.globalpartnership.org/content/rwanda-case-history-education-provision-refugees-2012-2019'
      },
      {
        label: 'Turkey: A case history of education provision for refugees, 2011 to 2019',
        url: 'http://www.globalpartnership.org/content/turkey-case-history-education-provision-refugees-2011-2019'
      },
      {
        label: 'Historical mapping: a cross-cutting and comparative analysis',
        url: 'http://www.globalpartnership.org/content/historical-mapping-education-provision-refugees-cross-cutting-and-comparative-analysis'
      }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/58-gpe-and-unhcr-historical-mapping-study-for-refugee-education',
    isDerived: true
  },

  {
    slug: 'iknowledge-strategy-and-evidence-building',
    title: 'iKnowledge: Strategy and evidence-building',
    countries: ['Tanzania'],
    partners: ['Avanti Communications', 'UK Space Agency'],
    service: 'Strategy and advisory',
    topics: ['Education policy, systems and governance', 'Technology and education'],
    method: 'Strategy workshops and advisory support',
    summary:
      'Strategic advice on implementation, research and evaluation for iKnowledge, a connectivity and edtech project running across 25 regions of Tanzania.',
    sections: {
      criticalQuestion:
        'The iKnowledge project delivers connectivity, capacity building, educational content, ICT equipment and government support to primary and secondary schools across 25 regions of Tanzania, creating a platform on which education innovations can be built and tested. That makes it a valuable opportunity for the sector to learn what works in technology-enhanced education innovation. Jigsaw was brought in to shape how the project generates and uses that learning.',
      collaboration:
        "The lead partner on iKnowledge is Avanti Communications. Phase 1 started in 2015 through the UK Space Agency's International Partnership Space Programme, and the project moved into Phase 2 within the UK Space Agency's International Partnership Programme.",
      buildingEvidence:
        'Jigsaw worked with iKnowledge throughout the project, providing strategic advice on implementation, research and evaluation. The work ran through a series of strategy workshops facilitated with the project team. Jigsaw also engaged with external partners and developed impact case studies documenting what the project achieved.',
      pathwaysToUptake:
        "The impact case studies developed through this work are published on the iKnowledge website. Jigsaw's strategic insight fed into how the project was implemented, researched and evaluated across both phases."
    },
    image: null,
    links: [
      { label: 'iKnowledge project', url: 'http://www.iknowledge.co.tz/' },
      { label: 'Impact case studies', url: 'http://www.iknowledge.co.tz/insights/' }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/14-iknowledge-strategy-and-evidence-building',
    isDerived: true
  },

  {
    slug: 'josy-programme-evaluations',
    title: 'JOSY: Programme Evaluations',
    countries: ['Jordan'],
    partners: ['GIZ', 'Kiron'],
    service: 'Design-based and implementation research',
    topics: [
      'Education in crisis and conflict',
      'Skills and pathways to employment',
      'Technology and education'
    ],
    method: 'Systematic process and strategic review',
    summary:
      "An evaluation of the digital summer school and mentoring pilots Kiron implemented within GIZ's JOSY programme, producing design and implementation guidance for future digital pilots.",
    sections: {
      criticalQuestion:
        "JOSY is a scholarship programme giving Syrian refugees and socially disadvantaged Jordanian students access to a master's programme at a Jordanian university. Two digital pilots ran within it, a summer school and a mentoring programme, both designed to improve students' job prospects and future outlook. Jigsaw was asked to review how those pilots worked in practice and what development co-operation programmes could take from them.",
      collaboration:
        "The pilots sat within the GIZ project 'New Perspectives through Academic Education and Training for young Syrians and Jordanians' (JOSY). Kiron Open Higher Education gGmbH was the implementing partner for both digital pilot programmes.",
      buildingEvidence:
        'Jigsaw conducted a systematic review of the two pilots at both the overall process and strategic level. The summer school pilot delivered training in academic courses and life skills, while the mentoring pilot matched students with mentors in their field and brought them together on an online platform. The review examined how each pilot was researched, designed, implemented and evaluated, drawing on the experience of both implementing partners.',
      pathwaysToUptake:
        'The evaluation produced three deliverables translating pilot learning into practical recommendations for development co-operation programme managers and decision-makers: a digital summer school design and implementation guidance manual, a digital mentoring guidance manual, and strategic guidance on partnerships between government development organisations and social start-ups. The manuals include comprehensive checklists and further resources, while the partnership guidance covers the specific needs of planning digital projects with social start-ups and the considerations that apply in fragile contexts.'
    },
    image: null,
    links: [
      {
        label: 'Digital summer school design and implementation guidance manual',
        url: 'http://hubble-live-assets.s3.amazonaws.com/jigsawconsult/redactor2_assets/files/9/giz2018-0326en-digital-summerschool-manual.pdf'
      },
      {
        label: 'Digital mentoring programme design and implementation guidance manual',
        url: 'http://hubble-live-assets.s3.amazonaws.com/jigsawconsult/redactor2_assets/files/8/giz2018-0324en-digital-mentoring-manual.pdf'
      },
      {
        label: 'Partnerships between government development organisations and social start-ups',
        url: 'http://hubble-live-assets.s3.amazonaws.com/jigsawconsult/redactor2_assets/files/10/giz2018-0325en-partnership-strategic-guidance.pdf'
      }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/16-josy-programme-evaluations',
    isDerived: true
  },

  {
    slug: 'opportunity-international-empowerment-for-girls-education',
    title: "Opportunity International: Empowerment for Girls' Education",
    countries: ['Uganda'],
    partners: ['Opportunity International', 'FCDO'],
    service: 'Large-scale, mixed-method studies',
    topics: ['Foundational Learning'],
    method: 'Remote qualitative endline evaluation',
    summary:
      "A Girls' Education Challenge endline evaluation in Uganda that Jigsaw redesigned for remote data collection after Covid-19 closed schools days into fieldwork.",
    sections: {
      criticalQuestion:
        "Empowerment for Girls' Education ran in Uganda between 2017 and 2020 as part of the FCDO's Girls' Education Challenge, and its endline was planned around extensive face-to-face data collection in schools and communities. Several days into fieldwork, schools closed and travel restrictions came into force in response to the Covid-19 pandemic, and data collection was swiftly halted. The question became what could still be established about the project, and by what means.",
      collaboration:
        "Opportunity International ran the project in Uganda with partners, funded through the FCDO's Girls' Education Challenge. Jigsaw had already conducted the project's midline evaluation in 2019, carried out in line with the standard methodological guidelines for GEC evaluations.",
      buildingEvidence:
        'Jigsaw rapidly redeveloped the methodology to enable remote data collection and adapted the research focus to match. The study shifted from a quasi-experimental, mixed methods approach built on large-scale surveys and learning assessments to a primarily qualitative one. The main data source became remotely conducted interviews with project staff, alongside a small number of remote interviews with project participants. Supplementary sources included quantitative project data, national exam data, and the partially complete quantitative datasets gathered during the first few days of face-to-face collection.',
      pathwaysToUptake:
        'The objectives shifted from quantitative measurement of project impact to project implementation and lessons learned, assessing the Theory of Change and identifying impact as far as the adapted approach allowed. The pivot produced a valuable piece of work despite significant disruption to the evaluation process, and demonstrates how adaptive working practices can rescue a study mid-fieldwork.'
    },
    image: `${IMAGE_BASE}/48/tile_fill_OIUK_-_endline_GECT_-_2020_-_Uganda_enumerators_practicing_2.jpg.jpg`,
    links: [
      { label: "Girls' Education Challenge", url: 'http://girlseducationchallenge.org/' }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/59-opportunity-international',
    isDerived: true
  },

  {
    slug: 'padileia-digital-refugee-higher-education-evaluation',
    title: 'PADILEIA: Evaluation of digital refugee higher education programme',
    countries: ['Jordan', 'Lebanon'],
    partners: ['PADILEIA'],
    service: 'Design-based and implementation research',
    topics: ['Education in crisis and conflict', 'Technology and education'],
    method: 'Rapid mixed-method remote evaluation',
    summary:
      'A rapid evaluation of how PADILEIA adapted its blended higher education programmes for Syrian refugees in Jordan and Lebanon to fully online delivery during Covid-19.',
    sections: {
      criticalQuestion:
        'PADILEIA produces and delivers blended higher education programmes to Syrian refugees in Jordan and Lebanon, and to local Jordanian and Lebanese students. In the early months of 2020, national lockdowns and university closures forced it to adapt those courses to fully remote, online delivery. PADILEIA commissioned a rapid evaluation to capture learning from that period, both to inform its future programming and to share knowledge with the wider sector.',
      collaboration:
        'PADILEIA, the Partnership for Digital Learning and Increased Access, is a project consortium and commissioned the evaluation directly from Jigsaw.',
      buildingEvidence:
        'The rapid evaluation followed a mixed method design, drawing on available project data, a digital student survey, and remote in-depth interviews and focus group discussions with students, delivery team members and project management staff. Travel restrictions and health and safety concerns ruled out in-person research, so collection was entirely remote, with interviews and focus groups conducted by voice or video call. The evaluation explored student access to education during remote learning, the challenges and benefits students experienced with online study, student satisfaction, the effectiveness of the technical, learning and psycho-social support provided, and the experiences of facilitators and instructors.',
      pathwaysToUptake:
        'Findings showed PADILEIA managed the transition to remote online delivery successfully in difficult circumstances, with most student learning experiences on facilitated courses remaining positive despite significant challenges to studying during the period. The evaluation identified recommendations for improving future remote delivery, given that lockdowns and social distancing measures were likely to continue. A summary of findings is published as a Community Report on the PADILEIA website, in English and Arabic.'
    },
    image: null,
    links: [
      { label: 'PADILEIA', url: 'http://padileia.org/' },
      {
        label: 'Community Report: rapid adaptation in Covid times',
        url: 'http://padileia.org/2021/08/04/rapid-adaptation-in-covid-times/'
      }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/60-evaluation-of-digital-refugee-higher-education-programme',
    isDerived: true
  },

  {
    slug: 'private-foundation-higher-education-for-refugees',
    title: 'Private foundation: Higher education for refugees',
    countries: [],
    partners: ['Refugee Support Network'],
    service: 'Large-scale, mixed-method studies',
    topics: ['Education in crisis and conflict', 'Technology and education'],
    method: 'Landscape review and primary field research',
    summary:
      'A year-long study of how higher education can be provided effectively to refugees in low-resource environments, pairing a landscape review of 43 programmes with extensive fieldwork.',
    sections: {
      criticalQuestion:
        'The provision of higher education to refugees is a vital and rapidly developing area of work within the humanitarian sector, and understanding of how to deliver it well in low-resource environments was thin. Jigsaw ran a year-long study to build that understanding. The research sought to prioritise the voices of refugee students throughout.',
      collaboration:
        'The research was conducted in partnership with Refugee Support Network. It was generously funded by an anonymous private foundation.',
      buildingEvidence:
        'The study produced two linked outputs, a landscape review and a primary research study, best read in combination. The landscape review is a desk-based overview of the sector, mapping 43 programmes across five main categories of provision, and provides the foundation for the primary research. The research study gives an in-depth perspective on camp-based and urban programmes, based on eight field visits to 15 refugee higher education programmes. Fieldwork included in-person interviews with 303 refugee students, outcome stars with 119 students, and interviews with 138 programme staff and sector experts conducted both in person and at a distance.',
      pathwaysToUptake:
        "Analysis is structured around five thematic areas: accessibility and participation, academia and organisational structure, technology, pedagogy, and impact and future. Each theme carries key learning points, alongside overall lessons for the sector and 'good practice principles' to guide effective programme implementation. Both reports are published and available to download."
    },
    image: null,
    links: [
      {
        label: 'Jigsaw landscape review',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/2/Jigsaw_landscape_review.pdf'
      },
      {
        label: 'Jigsaw research study',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/3/Jigsaw_research_study.pdf'
      },
      { label: 'Refugee Support Network', url: 'http://www.refugeesupportnetwork.org/' }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/15-higher-education-for-refugees',
    isDerived: true
  },

  {
    slug: 'save-the-children-future-of-learning-and-technology',
    title: 'Save the Children: The future of learning and technology',
    countries: [
      'Colombia',
      'Grenada',
      'Jordan',
      'Pakistan',
      'Solomon Islands',
      'Somalia',
      'United Kingdom'
    ],
    partners: ['Save the Children'],
    service: 'Technical assistance and evidence synthesis',
    topics: ['Foundational Learning', 'Technology and education'],
    method: 'Future-focused evidence review',
    summary:
      'A future-focused report for Save the Children on how ICT might be used to deliver basic education in deprived contexts, looking ahead to 2020 and 2025.',
    sections: {
      criticalQuestion:
        'Predictions about technology in basic education tend to run ahead of the evidence, particularly for deprived contexts. This study set out to ground forward-looking scenarios in research evidence, asking what ICT use in basic education in deprived contexts might look like in 2020 and 2025. It also asked what those trajectories would mean for the advocacy and programmes of Save the Children.',
      collaboration:
        'The study was developed in partnership between Jigsaw, Tim Unwin and Mark Weber. It was produced for Save the Children, with consultations with their staff feeding into the work.',
      buildingEvidence:
        "The report draws on research evidence from the literature, the authors' own experience of ICT use in education initiatives, interviews with practitioners and academics, a workshop, and consultations with Save the Children staff. It identifies current trends in basic education and ICTs and assesses how likely each is to continue. Scenarios for possible ICT use in delivering basic education to deprived children are supported by six case studies from Colombia, Grenada and the Solomon Islands, Jordan, Pakistan, Somalia, and the UK. The report also engages with the risks associated with increased use of ICTs in basic education.",
      pathwaysToUptake:
        "The report set out six probable developments for ICT in learning, among them further divergence in classroom ICT use between and within countries, an evolving teacher role, a growing role for ICTs in assessment and individualised learning, and greater involvement from parents and communities. For low-income and marginalised areas it added five further observations, including more device sharing, continued use of digital multi-purpose hubs, and offline caching of online content. It is published on the Save the Children resource centre and was featured by co-author Tim Unwin on his blog."
    },
    image: null,
    links: [
      {
        label: 'The future of learning and technology in deprived contexts (report)',
        url: 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file/6/The_future_of_learning_and_technology_in_deprived_contexts.pdf'
      },
      {
        label: 'Save the Children resource centre',
        url: 'https://resourcecentre.savethechildren.net/library/future-learning-and-technology-deprived-contexts'
      },
      {
        label: "Tim Unwin's blog",
        url: 'https://unwin.wordpress.com/2018/01/24/the-future-of-learning-and-technology-in-deprived-contexts-a-report-for-save-the-children-international/'
      }
    ],
    sourceUrl:
      'https://www.jigsaweducation.org/stories/10-save-the-children-the-future-of-learning-and-technology',
    isDerived: true
  },

  {
    slug: 'unhcr-cash-for-education-review',
    title: 'UNHCR: Cash for education review',
    countries: ['Egypt'],
    partners: ['UNHCR'],
    service: 'Technical assistance and evidence synthesis',
    topics: ['Education financing and cost-effectiveness', 'Education in crisis and conflict'],
    method: 'Qualitative learning review',
    summary:
      'A learning review of how UNHCR implemented its cash for education key considerations in Egypt, drawing out lessons that transfer to other contexts.',
    sections: {
      criticalQuestion:
        'UNHCR has a global strategy to promote the effective use of cash within refugee education programmes. Its global review of cash for education programmes in refugee settings identified a need for more learning and documentation of good practice, particularly in light of basic needs and multi-purpose cash approaches. Jigsaw reviewed how the strategy had been implemented in Egypt in order to draw out lessons from the national approach that could be valuable elsewhere.',
      collaboration:
        'UNHCR commissioned the review. Jigsaw worked with the UNHCR Egypt team, alongside global team members from the cash and education teams.',
      buildingEvidence:
        'The review opened with a document review and contextual interviews with four UNHCR global team members from the cash and education teams. Two of the Jigsaw team then made a research visit to Cairo with the UNHCR Egypt team. During the visit they conducted in-depth interviews with 15 staff from UNHCR, implementing partners and other NGOs and INGOs, each asked for their insights on the UNHCR key considerations on cash for education. A half-day meeting with 35 members of the Obour Syrian Refugee Community captured the perspectives and experiences of people receiving the educational grants.',
      pathwaysToUptake:
        'The findings were presented in an internal learning report and published by UNHCR as a public resource on field experience with cash for education in Egypt. The review contributes to understanding the ways cash can be used effectively to enhance refugee education.'
    },
    image: null,
    links: [
      {
        label: 'Cash for education: a global review of UNHCR programs in refugee settings',
        url: 'http://www.unhcr.org/5a280f297'
      },
      {
        label: 'UNHCR key considerations on cash for education',
        url: 'http://www.unhcr.org/protection/operations/5bfd360d4/cash-education-direction-key-considerations.html'
      },
      {
        label: 'Cash for education in Egypt: field experience',
        url: 'http://www.unhcr.org/uk/protection/operations/5e3a9cfb4/cash-education-egypt-field-experience.html'
      }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/21-cash-for-education-review',
    isDerived: true
  },

  {
    slug: 'unido-digital-data-gap-research-study',
    title: 'UNIDO: Digital data gap research study',
    countries: [
      'Algeria',
      'Egypt',
      'Jordan',
      'Lebanon',
      'Morocco',
      'Palestine',
      'Tunisia'
    ],
    partners: ['UNIDO'],
    service: 'Large-scale, mixed-method studies',
    topics: ['Skills and pathways to employment', 'Technology and education'],
    method: 'Large-scale digital survey',
    summary:
      "A seven-country study of women entrepreneurs' access to and use of digital technology across the Middle East and North Africa, commissioned by UNIDO.",
    sections: {
      criticalQuestion:
        "National data on women's access to and use of ICT in the Middle East and North Africa contains significant gaps. UNIDO commissioned the study to collect and analyse data that would characterise the digital gender gap within the population of female entrepreneurs. In line with UNIDO's focus on industrial development, the study concentrated on entrepreneurs working in the manufacturing sector and associated services.",
      collaboration:
        "The United Nations Industrial Development Organisation commissioned the study as part of its 'Promoting Women's Empowerment for Inclusive and Sustainable Industrial Development in the Middle East and North Africa region - Phase 2' programme. The survey and sampling strategy were co-designed with the UNIDO team through an iterative process, to keep the study aligned with UNIDO priorities.",
      buildingEvidence:
        "The methodological approach was a large-scale, primarily quantitative digital survey administered by in-country enumerator teams across Algeria, Egypt, Jordan, Lebanon, Morocco, Palestine and Tunisia. Before launching the survey in the seven countries, the team conducted a research visit to Tunisia to observe the activities of women's business associations, run key informant interviews and collect case studies of female entrepreneurs. That visit also fed back into collaboratively refining the draft survey.",
      pathwaysToUptake:
        'The analysis found high levels of access to ICT devices, particularly personal ownership of smartphones, with customer relations the most common business use, followed by marketing and communications and market research, though uses varied significantly by country. Device cost and poor internet and network coverage emerged as the main barriers, while entrepreneurs rated ICT as highly important to their business and named increased sales and profits as the biggest benefit. The report fills an informational gap in national data and contributes toward establishing baselines and identifying training needs for the formulation of UNIDO country action plans.'
    },
    image: null,
    links: [
      {
        label: 'United Nations Industrial Development Organisation',
        url: 'http://www.unido.org/'
      }
    ],
    sourceUrl: 'https://www.jigsaweducation.org/stories/23-digital-data-gap-research-study',
    isDerived: true
  }
];

export default CASE_STUDIES;
