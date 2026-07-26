// Team data migrated from the live White Fuse site, July 2026.
// Bios are the client's own copy, verbatim. Nothing here is invented.
//
// COUNTRY IS NULL FOR 16 OF 18 PEOPLE, AND THAT IS DELIBERATE.
// The client asked to swap city for country on the team card. Only David
// Hollow and Matt Thomas state a current base in their bio ("based in
// London"); everyone else's bio names countries they studied, taught or
// worked in, in the past tense. Inferring a home from that would publish a
// guess about where a real person lives. The card omits the chip when country
// is null, and the client fills the gaps — see docs/build-plan.md §7.
//
// Bios all come in under the brief's 150-word ceiling; the longest is Tim
// Unwin at 147. Five people have no LinkedIn on their page (Melville-Bain,
// Pacitto, Sequeira, Unwin, Zazai) and only Rebecca Daltry has an ORCID.
// Rozina Zazai's photo is null: the live site uses a generic stock PNG.

export const TEAM = [
  {
    slug: 'katrina-barnes',
    name: "Katrina Barnes",
    role: "Research Manager",
    country: null,
    bio: "Katrina is an interdisciplinary research manager with a background in language education. She holds a MEd in Research in Second Language Education from the University of Cambridge and a MA in Translation and Interpreting from the University of Westminster. Her work includes several mixed-methods, action research studies investigating the impact of different innovative education interventions on primary- and secondary-age students.\n\nAn experienced teacher, Katrina has taught in schools and universities in the UK, Spain, and Japan. Katrina is particularly interested in participatory research methods and increasing education access in marginalised communities.",
    bioWordCount: 91,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/52/tile_fill_IMG-20210913-WA0004.jpg",
    linkedin: "https://www.linkedin.com/in/katrinabarnesedu/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'rebecca-daltry',
    name: "Rebecca Daltry",
    role: "Research Manager",
    country: null,
    bio: "Rebecca (Becky) is a research manager, with a background in education and youth-centred development. She holds an MA in International Education and Development from the University of Sussex, where she formed a particular research interest in the intersections between development, education and faith/worldview, as well as topics related to gender, youth, conflict and citizenship.\n\nShe has experience conducting primary and desk-based qualitative research within the education and refugee space, in addition to working alongside schools and communities in Eastern Africa, developing participatory, youth-led development initiatives.",
    bioWordCount: 85,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/29/tile_fill_Becky_photo_edited.jpeg",
    linkedin: "https://www.linkedin.com/in/rebecca-daltry/",
    orcid: "https://orcid.org/0009-0004-1559-6203",
    needsReview: false
  },
  {
    slug: 'jonny-d-rozario',
    name: "Jonny D'Rozario",
    role: "Research Manager",
    country: null,
    bio: "Jonny is a researcher with a background in sustainable development, holding an MSc in Environmental Change and International Development from the University of Sheffield. Jonny has conducted both primary and desk-based research across a range of contexts, having worked for NGOs in addition to working on community focused research studies within the education sector.\n\nHis education research focuses primarily on qualitative data tools and participatory research methods. This has developed Jonny’s particular interest in deploying rigorous evidence to develop sustainable education improvements, alongside sustainable progress on relevant environmental and social issues.",
    bioWordCount: 91,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/28/tile_fill_Jonny_website_photo.jpg",
    linkedin: "https://www.linkedin.com/in/jonny-d-rozario-4240621bb/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'catherine-gladwell',
    name: "Catherine Gladwell",
    role: "Research Adviser",
    country: null,
    bio: "Catherine is the founder and Chief Executive of Refugee Education UK, the UK's leading refugee education charity. Each year REUK works with several thousand young people through direct frontline education support and advice programmes, supports several hundred schools, further education colleges and universities, and conducts research to influence policy. Alongside her work at REUK, she is a director and research advisor for Jigsaw, where she specialises in international refugee education. Catherine has led refugee education research and programmes for international agencies including UNICEF, UNHCR, Save the Children and many others. She holds degrees from Oxford University and the University of London, is an Honorary Research Fellow at the University of Winchester and an Honorary Associate Professor of Refugee Education at the University of Nottingham.",
    bioWordCount: 124,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/16/tile_fill_Catherine-website.JPG",
    linkedin: "https://www.linkedin.com/in/catherinegladwell/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'david-hollow',
    name: "David Hollow",
    role: "Team Leader",
    country: "United Kingdom",
    bio: "David leads Jigsaw, an education research organisation and social enterprise based in London. He enjoys helping organisations build and use evidence to improve education in low-income contexts. He has worked in over 25 countries with a variety of donors, governments, INGOs and community-based organisations. He oversees a wide range of research studies and provides strategic advice across the sector. David has worked in education research for 15 years and has a PhD from the University of London (2010). His doctoral work focused on evaluating the impact of technology on education in sub-Saharan Africa. David is Research Director for EdTech Hub and a board member for Refugee Education UK.",
    bioWordCount: 108,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/7/tile_fill_DSC01563_Dave.jpg",
    linkedin: "https://www.linkedin.com/in/davidhollow/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'gopal-iyer',
    name: "Gopal Iyer",
    role: "Research Manager",
    country: null,
    bio: "Gopal is an experienced research professional with extensive experience in evaluating large-scale learning assessments, teacher education, school leadership, and developing content for climate change education. He is an experienced quantitative researcher with expertise in Randomized Controlled Trials (RCTs), program evaluations, and technical assistance for governments. Before joining Jigsaw, Gopal held key roles at Newcastle University, AC Nielsen, The World Bank, XSEED, and Educational Initiatives. He has lived and worked extensively in India and Bhutan and supported projects in many other countries across the world. Gopal holds a Doctorate in Education from Newcastle University, complemented by a Master’s in Education and an MBA from the Indian Institute of Rural Management (IIRM).",
    bioWordCount: 110,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/369/tile_fill_Gopal-website.jpg",
    linkedin: "https://www.linkedin.com/in/dr-gopal-iyer-70b2908/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'neema-jayasinghe',
    name: "Neema Jayasinghe",
    role: "Researcher",
    country: null,
    bio: "Neema is a mixed-methods researcher with a Bachelor’s degree and an MPhil in Education, Policy, and International Development from the University of Cambridge. She previously worked with Cambridge University Press and Assessment and has also interned and served as a Youth Researcher at UNESCO. Neema has also collaborated with various think tanks in Sri Lanka. Her research focuses on advancing educational practices, with a particular interest in South and Southeast Asia.",
    bioWordCount: 71,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/326/tile_fill_Screenshot_2024-09-12_at_14.50.25.png",
    linkedin: "https://www.linkedin.com/in/neema-jayasinghe-0134a11a0/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'alison-joyner',
    name: "Alison Joyner",
    role: "Research Adviser",
    country: null,
    bio: "Alison is a highly experienced teacher, trainer, manager and researcher, including 12 years living and working in Africa and Asia. Deeply committed to supporting teachers in their critical role in facilitating learning and wellbeing, she has particular expertise in Education in Emergencies integrated with Child Protection. Alison is skilled in robust data collection and use from school-level upwards, ensuring the connections between monitoring, evaluation, research and learning. Her doctoral research (EdD, 2021, University College London Institute of Education) was conducted with teachers in a rural primary school in Kenya, focusing on the interaction between social and emotional skills and academic learning. Alison is fluent in English, French and Spanish.",
    bioWordCount: 109,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/269/tile_fill_Screenshot_2024-04-23_at_10.37.10.png",
    linkedin: "https://linkedin.com/in/alison-joyner-b8b45817",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'saalim-koomar',
    name: "Saalim Koomar",
    role: "Research Manager",
    country: null,
    bio: "Saalim is an experienced research manager and has led an international development start-up NGO to maturity, inclusive of 1.5 years’ experience working in rural Malawi and a Masters degree in Development Studies from SOAS, University of London. His current role focuses on research and engagement within EdTech Hub, working to increase the use of evidence to inform decision-making about EdTech. Saalim previously worked as a teacher with fluency in French following a first degree in French and Business and Management from the University of Manchester.",
    bioWordCount: 85,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/23/tile_fill_IMG_6734.jpg",
    linkedin: "https://www.linkedin.com/in/saalim-koomar-13970396/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'kara-melville-bain',
    name: "Kara Melville-Bain",
    role: "Operations Manager",
    country: null,
    bio: "Kara is a specialist Operations Manager with over 15 years’ experience across a variety of sectors. She leads Jigsaw’s operations work streams with particular responsibility for finance and personnel. She uses her extensive experience to support the team in the systematisation of processes and procedures to improve performance, productivity and efficiency. In addition to this, she provides administrative support on client projects. As part of the Senior Leadership Team, she also plays a wider role in Jigsaw’s mission, values and strategy development.",
    bioWordCount: 82,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/26/tile_fill_Kara_bio_image.jpg",
    linkedin: null,
    orcid: null,
    needsReview: false
  },
  {
    slug: 'joel-mitchell',
    name: "Joel Mitchell",
    role: "Research Adviser",
    country: null,
    bio: "Joel has extensive experience in applied education research and evaluation, particularly in the Middle East and Africa. He has a particular focus on education in humanitarian contexts, and the way in which technology can be effectively employed in education programmes. He also specialises in participatory assessment and design processes for developing innovative solutions. His technical and linguistic areas of expertise enable an interdisciplinary and embedded approach to research and enhancing development impacts. He is fluent in Arabic, French and English.",
    bioWordCount: 80,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/10/tile_fill_picture-52-1476972387.jpg",
    linkedin: "https://www.linkedin.com/in/joeldmitchell/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'julia-pacitto',
    name: "Julia Pacitto",
    role: "Research Manager",
    country: null,
    bio: "Julia is an experienced research manager and has extensive experience conducting academic, policy-focused and applied research on topics related to refugee and girls’ education. She holds a DPhil in International Development and an MSc in Forced Migration and Refugee Studies from the University of Oxford. Julia specialises in qualitative research and has led on both qualitative and large-scale mixed methods research and evaluation projects focused on girls’ education and refugees’ education.",
    bioWordCount: 71,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/24/tile_fill_Julia_-website.JPG",
    linkedin: null,
    orcid: null,
    needsReview: false
  },
  {
    slug: 'janice-sequeira',
    name: "Janice Sequeira",
    role: "Research Portfolio Manager",
    country: null,
    bio: "Janice is an experienced Business Manager in Education and Health with 17 years of experience working for the UK’s Department of Education (DfES) in various management roles, including Business Support Manager for National Exams and Tests. She has an MA in International Development focusing on Policy Development in Education, M&E and Development Practice Management.\n\nJanice works as Research Portfolio Manager for EdTech Hub, on their international development programme, responsible for project and programme management of hub-led and at-scale research, budget management, contracting and reporting for the Hub’s research team. She works as part of the Hub’s Central Services team, ensuring that Research activities are aligned with governance and policy. She works closely with the Directors of Research, Executive Director, and donor organisations.",
    bioWordCount: 122,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/134/tile_fill_Screenshot_2023-01-06_at_11.32.00.png",
    linkedin: null,
    orcid: null,
    needsReview: false
  },
  {
    slug: 'hiruy-teka',
    name: "Hiruy Teka",
    role: "Research Adviser",
    country: null,
    bio: "Hiruy specialises in helping organisations to define and operationalise their strategies to deliver improved educational outcomes in Low and Middle Income Countries (LMICs). Prior to joining Jigsaw, Hiruy worked for a wide variety of INGOs designing and delivering education programmes across Sub-Saharan Africa, South Asia, the Middle East, Latin America and the Caribbean.\n\nHiruy is on the board of Refugee Education UK, and has an MSc in Violence, Conflict and Development from SOAS, University of London (2011).",
    bioWordCount: 77,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/222/tile_fill_JDW_8952-2.jpeg",
    linkedin: "https://www.linkedin.com/in/hiruy-teka/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'matt-thomas',
    name: "Matt Thomas",
    role: "Research Adviser",
    country: "United Kingdom",
    bio: "Matt is a founder and director of Jigsaw, an education research organisation and social enterprise based in London. He is an experienced project manager, strategist and evaluator, and has implemented projects and undertaken research and evaluation in over 25 countries. He is committed to helping organisations use evidence to bring about lasting change in education, and his strategic planning expertise and experience of change management enables him to provide direction to organisations at key moments of transition and development.\n\nMatt’s recent clients include Dubai Cares, FCDO, King’s College London, Plan International and UNHCR. He has excellent interpersonal skills and leads on the delivery and project management of Jigsaw’s work.",
    bioWordCount: 109,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/12/tile_fill_picture-59-1476984796.jpg",
    linkedin: "https://www.linkedin.com/in/mattjamesthomas/",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'tim-unwin',
    name: "Tim Unwin",
    role: "Senior Adviser",
    country: null,
    bio: "Professor Tim Unwin is widely recognised as being one of the founders of ICT4D Collective (the use of Information and Communication Technologies for Development) and has worked in more than 50 countries, crossing the boundaries between academia, government service, the private sector and civil society.\n\nAn academic geographer by training, his diverse pasts include leading the UK Prime Minister’s Imfundo initiative in the early 2000s (creating partnerships to use digital tech to support educational outcomes in Africa), being Chair of the Commonwealth Scholarship Commission, and serving as Secretary General of the Commonwealth Telecommunications Organisation.\n\nTim’s work at Jigsaw focuses mainly on the use of digital technologies in education and by the most marginalised (deriving from his first explorations of both computers and rural India in the mid-1970s). He also provides strategic advice and critical friendship across Jigsaw and has been associated with the organisation since its inception.",
    bioWordCount: 147,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/133/tile_fill_Tim_Unwin.jpeg",
    linkedin: null,
    orcid: null,
    needsReview: false
  },
  {
    slug: 'iona-wotton',
    name: "Iona Wotton",
    role: "Researcher",
    country: null,
    bio: "Iona is an education researcher with a background in technical support and programme delivery. Her experience blends technical support to education programmes in Uganda and Zambia with coordination of research and advocacy initiatives at a regional and global level. Her experience is backed by a first-class Master’s degree in Education and International Development from UCL, specialising in gender-responsive programming and planning for education in emergencies. Iona is an experienced teacher in low-resource contexts, and is particularly interested in teacher professional development, pedagogy, curriculum design, and education for social and environmental justice. Across her roles, she’s worked collaboratively to advance priority areas including gender equity and refugee protection.",
    bioWordCount: 107,
    photo: "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/368/tile_fill_Iona-website__1_.jpg",
    linkedin: "https://www.linkedin.com/in/iona-wotton-186085152/?originalSubdomain=uk",
    orcid: null,
    needsReview: false
  },
  {
    slug: 'rozina-zazai',
    name: "Rozina Zazai",
    role: "Research Assistant",
    country: null,
    bio: "Rozina is a Research Assistant at Jigsaw. She holds a degree in Computer Science from IMSciences, Pakistan, supported by a DAFI scholarship. She also completed the one year online MIT ReACT program from Massachusetts Institute of Technology, USA. Born and raised in Pakistan, Rozina is an Afghan refugee and has raised the voices of refugee youth during her work with Jigsaw as a Youth Researcher. This work included spending two years conducting surveys and interviews with Afghan refugees and submitting data for analysis. Rozina has been voluntarily tutoring K-12 students in STEM and other subjects since 2015. She is fluent in English, Urdu and Pashto with a basic understanding of Dari.",
    bioWordCount: 111,
    photo: null,
    linkedin: null,
    orcid: null,
    needsReview: false
  }
];
