export const TOPICS = (() => {
    const prefixes = [
        "The", "A Guide to", "Understanding", "Deep Dive into", "The Basics of",
        "Advanced", "Modern", "Ancient", "The Future of", "The History of",
        "Principles of", "Fundamentals of", "The Concept of", "The Art of",
        "The Science of", "The Mathematics of", "The Philosophy of", "The Psychology of",
        "The Sociology of", "The Politics of", "The Economics of", "Exploring",
        "Mastering", "Introduction to", "The Ethics of", "The Impact of"
    ];

    const subjects = [
        "Quantum Physics", "Machine Learning", "Ancient Rome", "Renaissance Art",
        "Game Theory", "Calculus", "Linear Algebra", "Neuroscience", "Genetics",
        "Astrophysics", "World War II", "Creative Writing", "Macroeconomics",
        "Cognitive Psychology", "Blockchain", "Cybersecurity", "Climate Change",
        "Sustainable Energy", "Rocket Science", "Music Theory", "Digital Marketing",
        "Public Speaking", "Data Science", "Cloud Computing", "Web Development",
        "Mobile App Dev", "UI/UX Design", "Graphic Design", "Video Editing",
        "Photography", "Filmmaking", "Screenwriting", "Journalism", "Political Science",
        "International Relations", "Sociology", "Anthropology", "Archaeology",
        "Paleontology", "Geology", "Meteorology", "Oceanography", "Astronomy",
        "Botany", "Zoology", "Microbiology", "Immunology", "Pathology",
        "Pharmacology", "Anatomy", "Physiology", "Kinesiology", "Nutrition",
        "Cooking", "Baking", "Gardening", "Interior Design", "Fashion Design",
        "Architecture", "Engineering", "Robotics", "3D Printing", "Virtual Reality",
        "Augmented Reality", "Artificial Intelligence", "Deep Learning", "Neural Networks",
        "Natural Language Processing", "Computer Vision", "Big Data", "Internet of Things",
        "Smart Cities", "Autonomous Vehicles", "Drones", "Space Exploration",
        "Mars Colonization", "Time Travel", "Parallel Universes", "String Theory",
        "Dark Matter", "Dark Energy", "Black Holes", "Exoplanets", "The Big Bang",
        "Evolution", "Human Origins", "Consciousness", "Dreams", "Emotions",
        "Memory", "Learning", "Motivation", "Leadership", "Management",
        "Entrepreneurship", "Investing", "Personal Finance", "Real Estate",
        "Stock Market", "Cryptocurrency", "NFTs", "Metaverse", "Web3", "DAOs",
        "DeFi", "Smart Contracts", "Cryptography", "Network Security", "Ethical Hacking",
        "Penetration Testing", "Social Engineering", "Phishing", "Malware",
        "Ransomware", "Operating Systems", "Linux", "Windows", "MacOS", "Android",
        "iOS", "Programming Languages", "Python", "JavaScript", "Java", "C++",
        "C#", "Go", "Rust", "Swift", "Kotlin", "TypeScript", "React", "Angular",
        "Vue", "Next.js", "Node.js", "Django", "Flask", "Spring Boot", "Laravel",
        "Ruby on Rails", "WordPress", "Shopify", "E-commerce", "SEO", "SEM",
        "Social Media Marketing", "Content Marketing", "Email Marketing",
        "Affiliate Marketing", "Influencer Marketing", "Branding", "Storytelling",
        "Copywriting", "Technical Writing", "Grant Writing", "Resume Writing",
        "Interview Skills", "Negotiation", "Conflict Resolution", "Emotional Intelligence",
        "Critical Thinking", "Problem Solving", "Creativity", "Innovation",
        "Productivity", "Time Management", "Goal Setting", "Mindfulness", "Meditation",
        "Yoga", "Fitness", "Strength Training", "Cardio", "Marathon Training",
        "Triathlon", "Sports Psychology", "Esports", "Game Design", "Level Design",
        "Character Design", "World Building", "Storyboarding", "Animation", "VFX",
        "Sound Design", "Music Production", "Mixing", "Mastering", "DJing",
        "Singing", "Songwriting", "Guitar", "Piano", "Drums", "Violin", "Cello",
        "Painting", "Drawing", "Sculpting", "Ceramics", "Pottery", "Knitting",
        "Crocheting", "Sewing", "Embroidery", "Quilting", "Woodworking",
        "Metalworking", "Blacksmithing", "Glassblowing", "Origami", "Calligraphy",
        "Typography", "Color Theory", "Thermodynamics", "Fluid Dynamics",
        "Electromagnetism", "Optics", "Acoustics", "Statsitics", "Probability",
        "Number Theory", "Graph Theory", "Topology", "Set Theory", "Logic",
        "Epistemology", "Metaphysics", "Ethics", "Aesthetics", "Existentialism",
        "Stoicism", "Nihilism", "Utilitarianism", "Feminism", "Postmodernism",
        "Marxism", "Capitalism", "Socialism", "Communism", "Democracy", "Monarchy",
        "Dictatorship", "Anarchism", "Law", "Human Rights", "Criminal Justice",
        "Criminology", "Forensic Science", "Medicine", "Surgery", "Nursing",
        "Dentistry", "Veterinary Medicine", "Pharmacy", "Public Health", "Epidemiology"
    ];

    const suffixes = [
        "", "for Beginners", "for Experts", "in 2025", "Explained", "101",
        "Masterclass", "Theory", "Practice", "Case Studies", "Examples",
        "Applications", "and Society", "in the Modern World", "Overview",
        "Tutorial", "Guide", "Crash Course", "Deep Dive", "Analysis",
        "Fundamentals", "Principles", "Essentials", "Strategies", "Techniques",
        "Secrets", "Mysteries", "Concepts", "Perspectives", "Debates", "Trends"
    ];

    const allTopics: string[] = [];

    // Prioritize clean topics (just the subject)
    subjects.forEach(subject => allTopics.push(subject));

    // Generate combinations
    subjects.forEach(subject => {
        prefixes.forEach(prefix => {
            // "The Physics of Quantum Physics" handles weird redundancy check if needed, but let's just push
            if (prefix.endsWith(" of") && subject.startsWith("The ")) {
                // Avoid "The History of The Big Bang" -> "The History of the Big Bang"
                allTopics.push(`${prefix} ${subject.toLowerCase()}`);
            } else {
                allTopics.push(`${prefix} ${subject}`);
            }
        });

        suffixes.forEach(suffix => {
            if (suffix) allTopics.push(`${subject} ${suffix}`);
        });
    });

    // Add some random triple combinations
    for (let i = 0; i < 1000; i++) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const s = subjects[Math.floor(Math.random() * subjects.length)];
        const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
        if (suf) allTopics.push(`${p} ${s} ${suf}`);
    }

    return allTopics;
})();

export function getRandomTopics(count: number): string[] {
    const shuffled = [...TOPICS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
