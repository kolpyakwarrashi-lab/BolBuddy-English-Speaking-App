import { Scenario, SentencePuzzle, PictureScene, QuickSpeakTopic, WordOfTheDayItem } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'shopping',
    title: 'Grocery Shopping',
    icon: '🛒',
    description: 'Buy fresh fruits, snacks and ask the shopkeeper for prices!',
    category: 'Daily Life',
    firstMessage: 'Hello! Welcome to Little Star Mart! 🍎 How can I help you today?',
    starterPrompt: 'Hello! I would like to buy some fresh fruits please.',
    recommendedGrade: '2nd - 5th',
    targetGrades: ['2nd', '3rd', '4th', '5th']
  },
  {
    id: 'restaurant',
    title: 'Friendly Restaurant',
    icon: '🍕',
    description: 'Order your favourite pizza, juice and practice table manners!',
    category: 'Social',
    firstMessage: 'Welcome to BolBuddy Diner! 🍕 Here is your menu. What would you like to eat today?',
    starterPrompt: 'Could I please see the kids menu?',
    recommendedGrade: '2nd - 6th',
    targetGrades: ['2nd', '3rd', '4th', '5th', '6th']
  },
  {
    id: 'school',
    title: 'School Classroom',
    icon: '🏫',
    description: 'Talk with your teacher and classmates about homework and hobbies!',
    category: 'Academic',
    firstMessage: 'Good morning! 🎒 Did you finish your English reading project?',
    starterPrompt: 'Yes teacher, I read an exciting book about space!',
    recommendedGrade: '3rd - 7th',
    targetGrades: ['3rd', '4th', '5th', '6th', '7th']
  },
  {
    id: 'birthday',
    title: 'Birthday Party',
    icon: '🎂',
    description: 'Wish your friend, give gifts and play party games!',
    category: 'Fun & Celebration',
    firstMessage: 'Yay, you came to my birthday party! 🎉 Thank you so much! Would you like some chocolate cake?',
    starterPrompt: 'Happy Birthday to you! Here is a gift for you.',
    recommendedGrade: '2nd - 5th',
    targetGrades: ['2nd', '3rd', '4th', '5th']
  },
  {
    id: 'hospital',
    title: 'Doctor Visit',
    icon: '🏥',
    description: 'Explain how you feel and understand healthy habits.',
    category: 'Health',
    firstMessage: 'Hello there! 🩺 I am Dr. Buddy. How are you feeling today? Do you have a cold or tummy ache?',
    starterPrompt: 'Doctor, I have had a little cough since yesterday.',
    recommendedGrade: '4th - 8th',
    targetGrades: ['4th', '5th', '6th', '7th', '8th']
  },
  {
    id: 'airport',
    title: 'Airport Travel',
    icon: '✈️',
    description: 'Check in your luggage and find your airplane boarding gate!',
    category: 'Travel',
    firstMessage: 'Good day traveler! 🎫 May I please see your boarding pass and passport for the flight to London?',
    starterPrompt: 'Here is my ticket and boarding pass.',
    recommendedGrade: '5th - 8th',
    targetGrades: ['5th', '6th', '7th', '8th']
  },
  {
    id: 'cafe',
    title: 'Cozy Café',
    icon: '☕',
    description: 'Order hot cocoa, muffins and chat with the barista!',
    category: 'Social',
    firstMessage: 'Welcome to the Rainbow Café! ☕ Would you prefer a hot cocoa or a berry smoothie today?',
    starterPrompt: 'I would love a warm hot cocoa with marshmallows please.',
    recommendedGrade: '4th - 8th',
    targetGrades: ['4th', '5th', '6th', '7th', '8th']
  },
  {
    id: 'meeting',
    title: 'Meeting a New Friend',
    icon: '🤝',
    description: 'Introduce yourself, ask about hobbies and make a friendship.',
    category: 'Friendship',
    firstMessage: 'Hi! 👋 My name is Aryan. I just moved to this neighborhood. What is your name?',
    starterPrompt: 'Hi Aryan! Welcome! My name is...',
    recommendedGrade: '2nd - 6th',
    targetGrades: ['2nd', '3rd', '4th', '5th', '6th']
  },
  {
    id: 'phone',
    title: 'Friendly Phone Call',
    icon: '📞',
    description: 'Ring your friend to plan a weekend cricket or art playdate.',
    category: 'Communication',
    firstMessage: 'Ring ring! 📱 Hello? Who is speaking? Are you free this evening for some games?',
    starterPrompt: 'Hi! Yes, would you like to play cricket at 5 PM?',
    recommendedGrade: '3rd - 7th',
    targetGrades: ['3rd', '4th', '5th', '6th', '7th']
  },
  {
    id: 'interview',
    title: 'School Club Interview',
    icon: '💼',
    description: 'Practice speaking with confidence for school prefect, debate, or science club!',
    category: 'Confidence',
    firstMessage: 'Welcome to the School Green Club interview! 🌿 Tell us why you would like to join our club this term.',
    starterPrompt: 'I love planting trees and keeping our campus clean and green.',
    recommendedGrade: '6th - 8th',
    targetGrades: ['6th', '7th', '8th']
  }
];

export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  {
    id: 's1',
    sentence: 'I ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 0,
    explanation: 'Correct! 🌟 With "I", we use the base verb "go": "I go to school every day."',
    targetClass: ['2nd', '3rd', '4th']
  },
  {
    id: 's2',
    sentence: 'She ___ a beautiful red dress yesterday.',
    options: ['wears', 'wore', 'wearing', 'wear'],
    correctIndex: 1,
    explanation: 'Super! 🌟 "Yesterday" indicates the past tense, so we use "wore".',
    targetClass: ['3rd', '4th', '5th']
  },
  {
    id: 's3',
    sentence: 'The birds are ___ happily in the morning sky.',
    options: ['sing', 'sings', 'singing', 'sang'],
    correctIndex: 2,
    explanation: 'Awesome! 🌟 "Are" is followed by the -ing form for an ongoing action: "singing".',
    targetClass: ['2nd', '3rd', '4th', '5th']
  },
  {
    id: 's4',
    sentence: 'Neither of the boys ___ present in class today.',
    options: ['were', 'was', 'are', 'have'],
    correctIndex: 1,
    explanation: 'Brilliant grammar! 🌟 "Neither" takes a singular verb: "Neither of the boys was present."',
    targetClass: ['6th', '7th', '8th']
  },
  {
    id: 's5',
    sentence: 'If it rains tomorrow, we ___ stay indoors.',
    options: ['will', 'would', 'have', 'were'],
    correctIndex: 0,
    explanation: 'Great job! 🌟 For future conditional: "If it rains tomorrow, we will stay indoors."',
    targetClass: ['5th', '6th', '7th', '8th']
  },
  {
    id: 's6',
    sentence: 'They ___ playing football when the bell rang.',
    options: ['was', 'were', 'is', 'are'],
    correctIndex: 1,
    explanation: 'Spot on! 🌟 For plural subjects like "They" in the past tense, we use "were".',
    targetClass: ['4th', '5th', '6th']
  }
];

export const PICTURE_SCENES: PictureScene[] = [
  {
    id: 'park',
    title: 'Sunny Park Adventure',
    emoji: '🏞️',
    description: 'A vibrant green park with children on swings, flying kites, dogs chasing balls, and butterflies fluttering around blooming flowers.',
    sampleThingsToNotice: ['Children on swings', 'A colorful kite in the sky', 'A playful puppy', 'Tall green trees'],
    recommendedVocabulary: ['swings', 'kite', 'playful', 'blooming', 'sunny']
  },
  {
    id: 'space',
    title: 'Cosmic Space Station',
    emoji: '🚀',
    description: 'A friendly astronaut floating near a silver spaceship, looking at Earth, twinkling stars, and an alien friend waving hello.',
    sampleThingsToNotice: ['Floating astronaut', 'Blue planet Earth', 'Shooting stars', 'Friendly little robot'],
    recommendedVocabulary: ['astronaut', 'gravity', 'orbit', 'spaceship', 'twinkling']
  },
  {
    id: 'classroom',
    title: 'Science Fair Day',
    emoji: '🔬',
    description: 'Smiling students exhibiting a bubbling miniature volcano, robot cars, magnifying glasses, and colourful charts on solar planets.',
    sampleThingsToNotice: ['Bubbling volcano model', 'Robotic car on the table', 'Student presenting', 'Charts on walls'],
    recommendedVocabulary: ['experiment', 'presentation', 'volcano', 'curious', 'model']
  },
  {
    id: 'zoo',
    title: 'Safari Jungle Trail',
    emoji: '🦁',
    description: 'A baby elephant spraying water, a tall giraffe reaching for acacia leaves, playful monkeys swinging on vines, and a sleeping lion.',
    sampleThingsToNotice: ['Giraffe eating leaves', 'Baby elephant playing with water', 'Monkeys on trees'],
    recommendedVocabulary: ['tall', 'trunk', 'swinging', 'jungle', 'curious']
  }
];

export const QUICK_SPEAK_TOPICS: QuickSpeakTopic[] = [
  {
    id: 'food',
    title: 'My Favourite Food',
    icon: '🍕',
    prompt: 'Tell BolBuddy what food you love the most, how it tastes, and who makes it best!',
    durationSeconds: 30,
    starterHints: ['My favourite food is...', 'It tastes sweet / spicy / crunchy...', 'My mother / grandmother prepares it...']
  },
  {
    id: 'school',
    title: 'My School & Best Friend',
    icon: '🏫',
    prompt: 'Talk about your school, your favourite subject, and the fun games you play with friends during recess.',
    durationSeconds: 30,
    starterHints: ['The name of my school is...', 'My favourite subject is...', 'During break, my friends and I...']
  },
  {
    id: 'animal',
    title: 'My Favourite Animal',
    icon: '🐶',
    prompt: 'Describe your pet or favourite wild animal, why you admire it, and what it eats.',
    durationSeconds: 30,
    starterHints: ['I love dogs / lions because...', 'They are loyal / brave / fast...', 'They love to eat...']
  },
  {
    id: 'superpower',
    title: 'If I Had a Superpower',
    icon: '⚡',
    prompt: 'If you could fly, be invisible, or travel through time, what would you do to help the world?',
    durationSeconds: 30,
    starterHints: ['If I had a superpower, I would choose...', 'I would fly to...', 'It would help people by...']
  },
  {
    id: 'space',
    title: 'Journey into Space',
    icon: '🚀',
    prompt: 'Imagine traveling to the Moon or Mars in a rocket. What would you take and what would you see?',
    durationSeconds: 30,
    starterHints: ['I would build a rocket and...', 'Floating in zero gravity feels...', 'Looking at Earth from space is...']
  },
  {
    id: 'technology',
    title: 'My Dream Robot Helper',
    icon: '🤖',
    prompt: 'Design a robot friend! What tasks would it help you with, and what games would you play together?',
    durationSeconds: 30,
    starterHints: ['My robot helper would be called...', 'It can clean my desk and...', 'We would invent...']
  }
];

export const WORDS_OF_THE_DAY: WordOfTheDayItem[] = [
  {
    word: 'Curious',
    phonetic: '/ˈkjʊə.ri.əs/',
    partOfSpeech: 'adjective',
    meaning: 'Eager to know, learn or explore something new.',
    meaningHindi: 'जिज्ञासु / कुछ नया जानने का इच्छुक',
    meaningMarathi: 'उत्सुक / नवीन गोष्ट जाणून घेण्याची इच्छा असलेला',
    example: 'Aarav is very curious about how stars shine in the night sky.',
    funTip: 'Curious minds make the greatest scientists and inventors! 🌟'
  },
  {
    word: 'Generous',
    phonetic: '/ˈdʒen.ər.əs/',
    partOfSpeech: 'adjective',
    meaning: 'Showing kindness and willing to share things with others.',
    meaningHindi: 'उदार / दिलदार / दूसरों के साथ बांटने वाला',
    meaningMarathi: 'उदार / इतरांना मदत करणारा',
    example: 'Ananya was generous and shared her crayons with her classmate.',
    funTip: 'Sharing your toys or knowledge makes everyone smile! 🎁'
  },
  {
    word: 'Courage',
    phonetic: '/ˈkʌr.ɪdʒ/',
    partOfSpeech: 'noun',
    meaning: 'The bravery to face fear or try something challenging.',
    meaningHindi: 'साहस / हिम्मत',
    meaningMarathi: 'धैर्य / हिंमत',
    example: 'It took courage for Rohan to speak in front of the whole school.',
    funTip: 'Courage is not having no fear, it is speaking up even when your voice shakes! 🦁'
  },
  {
    word: 'Persevere',
    phonetic: '/ˌpɜː.sɪˈvɪər/',
    partOfSpeech: 'verb',
    meaning: 'To keep trying and never give up, even when things are tough.',
    meaningHindi: 'दृढ़ रहना / लगातार प्रयास करते रहना',
    meaningMarathi: 'चिकाटी ठेवणे / हार न मानणे',
    example: 'She persevered in solving the math puzzle until she found the answer.',
    funTip: 'Every time you practice English speaking, you are persevering! 🚀'
  }
];

export const PRONUNCIATION_LIST = [
  { word: 'Beautiful', phonetic: 'BYOO-tih-ful', tip: 'Like saying: Byoo + tih + ful', example: 'What a beautiful morning!' },
  { word: 'Adventure', phonetic: 'ad-VEN-chur', tip: 'Like saying: Ad + ven + chur', example: 'We are on an English adventure.' },
  { word: 'Comfortable', phonetic: 'KUMF-tuh-bul', tip: 'Notice: The "or" is soft', example: 'This chair is very comfortable.' },
  { word: 'Enthusiastic', phonetic: 'en-thoo-zee-AS-tik', tip: 'Full of positive energy and excitement!', example: 'She is enthusiastic about speaking English.' },
  { word: 'Wonderful', phonetic: 'WUN-der-ful', tip: 'Full of wonder and delight', example: 'You did a wonderful job today!' }
];

export const PRONUNCIATION_WORDS = PRONUNCIATION_LIST;
export const WORD_OF_THE_DAY_LIST = WORDS_OF_THE_DAY;

export const MEMORY_ITEMS_POOL = [
  { id: 'm1', name: 'Apple', emoji: '🍎', category: 'Fruits' },
  { id: 'm2', name: 'Dog', emoji: '🐶', category: 'Animals' },
  { id: 'm3', name: 'Car', emoji: '🚗', category: 'Vehicles' },
  { id: 'm4', name: 'Book', emoji: '📚', category: 'School' },
  { id: 'm5', name: 'Ball', emoji: '⚽', category: 'Sports' },
  { id: 'm6', name: 'Mango', emoji: '🥭', category: 'Fruits' },
  { id: 'm7', name: 'Cat', emoji: '🐱', category: 'Animals' },
  { id: 'm8', name: 'Rocket', emoji: '🚀', category: 'Vehicles' },
  { id: 'm9', name: 'Pencil', emoji: '✏️', category: 'School' },
  { id: 'm10', name: 'Guitar', emoji: '🎸', category: 'Music' }
];

export const WORD_MATCH_SETS = {
  junior: [
    { word: 'Apple', emoji: '🍎', hint: 'A sweet red fruit' },
    { word: 'Elephant', emoji: '🐘', hint: 'A large animal with a long trunk' },
    { word: 'Sun', emoji: '☀️', hint: 'Shines bright in the daytime sky' },
    { word: 'Bicycle', emoji: '🚲', hint: 'Two wheels with pedals' }
  ],
  middle: [
    { word: 'Astronaut', emoji: '👨‍🚀', hint: 'A person who travels into space' },
    { word: 'Volcano', emoji: '🌋', hint: 'A mountain that erupts with hot lava' },
    { word: 'Microscope', emoji: '🔬', hint: 'Instrument used to see tiny objects' },
    { word: 'Compass', emoji: '🧭', hint: 'A device showing North, South, East, West' }
  ],
  senior: [
    { word: 'Architecture', emoji: '🏛️', hint: 'The art and science of designing buildings' },
    { word: 'Ecosystem', emoji: '🌿', hint: 'A biological community of interacting organisms' },
    { word: 'Constellation', emoji: '✨', hint: 'A pattern or group of stars in the night sky' },
    { word: 'Diplomacy', emoji: '🤝', hint: 'The practice of peaceful negotiations between groups' }
  ]
};
