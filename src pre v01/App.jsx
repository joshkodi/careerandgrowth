import { useState } from 'react'
import './App.css'
import { explorations } from './data/explorations'

const discoveryQuestions = {
  explorer: [
    {
      id: 'free_time',
      question:
        'You have lots of free time today. What sounds the most fun?',
      answers: [
        {
          id: 'experiment',
          label: '🧪 Try a fun experiment',
          signals: ['science', 'investigating'],
        },
        {
          id: 'build',
          label: '🧱 Build something awesome',
          signals: ['building', 'creating'],
        },
        {
          id: 'animals',
          label: '🐶 Spend time with animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'art',
          label: '🎨 Draw, make music, or create',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'curious_place',
      question: 'Which place would you most like to explore?',
      answers: [
        {
          id: 'space',
          label: '🚀 Outer space',
          signals: ['space', 'discovery'],
        },
        {
          id: 'ocean',
          label: '🐠 Under the ocean',
          signals: ['nature', 'animals'],
        },
        {
          id: 'lab',
          label: '🔬 A science lab',
          signals: ['science', 'investigating'],
        },
        {
          id: 'studio',
          label: '🎬 A movie or art studio',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'broken',
      question:
        'Your favorite toy stops working. What would you like to do?',
      answers: [
        {
          id: 'inspect',
          label: '🔍 Look closely to see what happened',
          signals: ['investigating', 'problem_solving'],
        },
        {
          id: 'fix',
          label: '🔧 Try to fix it',
          signals: ['building', 'problem_solving'],
        },
        {
          id: 'new',
          label: '💡 Think of a better version',
          signals: ['creating', 'problem_solving'],
        },
        {
          id: 'together',
          label: '🤝 Ask someone to help fix it',
          signals: ['collaborating', 'helping'],
        },
      ],
    },
    {
      id: 'super_skill',
      question:
        'If you could be amazing at one thing, what would you pick?',
      answers: [
        {
          id: 'discover',
          label: '🔬 Discovering how things work',
          signals: ['science', 'discovery'],
        },
        {
          id: 'make',
          label: '🛠️ Making cool things',
          signals: ['building', 'creating'],
        },
        {
          id: 'people',
          label: '💬 Helping and talking with people',
          signals: ['people', 'helping'],
        },
        {
          id: 'perform',
          label: '🎭 Performing or creating stories',
          signals: ['arts', 'communicating'],
        },
      ],
    },
    {
      id: 'team',
      question:
        'Your friends are making something together. What sounds fun to you?',
      answers: [
        {
          id: 'idea',
          label: '💡 Think of the big idea',
          signals: ['creating', 'leading'],
        },
        {
          id: 'make',
          label: '🛠️ Help make it',
          signals: ['building', 'collaborating'],
        },
        {
          id: 'organize',
          label: '📋 Help everyone know what to do',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'show',
          label: '🎤 Show everyone what you made',
          signals: ['communicating', 'people'],
        },
      ],
    },
    {
      id: 'create',
      question: 'Which would you most like to make?',
      answers: [
        {
          id: 'robot',
          label: '🤖 A helpful robot',
          signals: ['technology', 'building'],
        },
        {
          id: 'game',
          label: '🎮 Your own game',
          signals: ['technology', 'creating'],
        },
        {
          id: 'story',
          label: '📖 A story or video',
          signals: ['arts', 'communicating'],
        },
        {
          id: 'community',
          label: '🌱 Something that helps people nearby',
          signals: ['helping', 'impact'],
        },
      ],
    },
    {
      id: 'help',
      question: 'What would you most like to help with?',
      answers: [
        {
          id: 'health',
          label: '❤️ Helping someone feel better',
          signals: ['health', 'helping'],
        },
        {
          id: 'animals',
          label: '🐾 Helping animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'planet',
          label: '🌎 Helping the planet',
          signals: ['nature', 'impact'],
        },
        {
          id: 'discover',
          label: '🔭 Discovering something new',
          signals: ['science', 'discovery'],
        },
      ],
    },
    {
      id: 'adventure',
      question: 'Which adventure sounds the most exciting?',
      answers: [
        {
          id: 'doctor',
          label: '🩺 Solve a health mystery',
          signals: ['health', 'investigating'],
        },
        {
          id: 'engineer',
          label: '🚀 Build something for space',
          signals: ['space', 'technology', 'building'],
        },
        {
          id: 'wildlife',
          label: '🐯 Study animals in the wild',
          signals: ['animals', 'nature', 'discovery'],
        },
        {
          id: 'creative',
          label: '🎬 Help make a movie or game',
          signals: ['arts', 'creating'],
        },
      ],
    },
  ],

  discoverer: [
    {
      id: 'free_time',
      question:
        'You have a whole Saturday with nothing planned. What sounds the most fun?',
      answers: [
        {
          id: 'experiment',
          label: '🧪 Try a cool experiment',
          signals: ['science', 'investigating'],
        },
        {
          id: 'game',
          label: '🎮 Build something in a game',
          signals: ['technology', 'building'],
        },
        {
          id: 'animals',
          label: '🐕 Spend time with animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'creative',
          label: '🎨 Draw, make music, or create something',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'class_project',
      question:
        'Your class can choose one big project. Which would you pick?',
      answers: [
        {
          id: 'mars',
          label: '🚀 Design something for a Mars mission',
          signals: ['space', 'technology', 'building'],
        },
        {
          id: 'brain',
          label: '🧠 Discover something about the human brain',
          signals: ['health', 'science', 'investigating'],
        },
        {
          id: 'environment',
          label: '🌎 Find a way to protect the environment',
          signals: ['nature', 'impact'],
        },
        {
          id: 'movie',
          label: '🎬 Create a movie that tells an amazing story',
          signals: ['arts', 'communicating', 'creating'],
        },
      ],
    },
    {
      id: 'broken',
      question:
        'Something you really like suddenly stops working. What would you want to do?',
      answers: [
        {
          id: 'inspect',
          label: "🔧 Take a closer look and figure out what's wrong",
          signals: ['investigating', 'problem_solving'],
        },
        {
          id: 'research',
          label: '📱 Research how it works and look for solutions',
          signals: ['investigating', 'discovery'],
        },
        {
          id: 'redesign',
          label: '💡 Imagine a better version and redesign it',
          signals: ['creating', 'problem_solving'],
        },
        {
          id: 'team',
          label: '🤝 Find someone and solve it together',
          signals: ['collaborating', 'problem_solving'],
        },
      ],
    },
    {
      id: 'instant_skill',
      question:
        'Imagine you could instantly become amazing at one thing. Which would you choose?',
      answers: [
        {
          id: 'science',
          label: '🔬 Understanding how the world works',
          signals: ['science', 'discovery'],
        },
        {
          id: 'tech',
          label: '💻 Building things with technology',
          signals: ['technology', 'building'],
        },
        {
          id: 'creative',
          label: '🎨 Creating things people have never seen before',
          signals: ['arts', 'creating'],
        },
        {
          id: 'people',
          label: '💬 Understanding and connecting with people',
          signals: ['people', 'communicating'],
        },
      ],
    },
    {
      id: 'team_role',
      question:
        'Your friends decide to build something really cool together. Which role sounds most like you?',
      answers: [
        {
          id: 'idea',
          label: '💡 Come up with the big idea',
          signals: ['creating', 'leading'],
        },
        {
          id: 'build',
          label: '🛠️ Figure out how to build it',
          signals: ['building', 'problem_solving'],
        },
        {
          id: 'organize',
          label: '📋 Keep everyone organized and moving',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'present',
          label: '🎤 Show everyone what you created',
          signals: ['communicating', 'people'],
        },
      ],
    },
    {
      id: 'make',
      question:
        'If you could make one of these today, which would you choose?',
      answers: [
        {
          id: 'robot',
          label: '🤖 A robot that can do something useful',
          signals: ['technology', 'building'],
        },
        {
          id: 'game',
          label: '🎮 Your own game',
          signals: ['technology', 'creating'],
        },
        {
          id: 'story',
          label: '📖 A story, comic, or video',
          signals: ['arts', 'communicating'],
        },
        {
          id: 'community',
          label: '🌱 Something that makes your neighborhood better',
          signals: ['impact', 'helping'],
        },
      ],
    },
    {
      id: 'problem',
      question:
        'Which problem would you be most excited to help solve?',
      answers: [
        {
          id: 'health',
          label: '🩺 Helping people stay healthy',
          signals: ['health', 'helping'],
        },
        {
          id: 'animals',
          label: '🐾 Protecting animals and wildlife',
          signals: ['animals', 'nature', 'helping'],
        },
        {
          id: 'planet',
          label: '🌎 Making the planet healthier',
          signals: ['nature', 'impact'],
        },
        {
          id: 'unknown',
          label: '🚀 Discovering something nobody knows yet',
          signals: ['science', 'discovery'],
        },
      ],
    },
    {
      id: 'day_with',
      question:
        "You get to spend an entire day seeing someone's work. Which adventure would you choose?",
      answers: [
        {
          id: 'doctor',
          label: '🩺 Help a doctor solve a medical mystery',
          signals: ['health', 'investigating', 'helping'],
        },
        {
          id: 'engineer',
          label: '🚀 Join an engineer designing something for space',
          signals: ['space', 'technology', 'building'],
        },
        {
          id: 'wildlife',
          label: '🐅 Follow a wildlife scientist studying animals',
          signals: ['animals', 'nature', 'discovery'],
        },
        {
          id: 'creative',
          label: '🎬 Join a creative team making a movie or game',
          signals: ['arts', 'creating', 'collaborating'],
        },
      ],
    },
  ],

  pathfinder: [
    {
      id: 'free_time',
      question:
        'You suddenly have a free weekend. Which sounds most worthwhile?',
      answers: [
        {
          id: 'learn',
          label: '🔬 Dive into a topic I am curious about',
          signals: ['science', 'investigating', 'discovery'],
        },
        {
          id: 'build',
          label: '💻 Build or experiment with technology',
          signals: ['technology', 'building'],
        },
        {
          id: 'create',
          label: '🎨 Create something original',
          signals: ['arts', 'creating'],
        },
        {
          id: 'people',
          label: '🤝 Spend time helping or working with people',
          signals: ['people', 'helping'],
        },
      ],
    },
    {
      id: 'project',
      question:
        'You can lead one semester-long project. Which would you choose?',
      answers: [
        {
          id: 'engineering',
          label: '🚀 Design a solution to a difficult technical problem',
          signals: ['technology', 'problem_solving', 'building'],
        },
        {
          id: 'health',
          label: '🧬 Investigate a health or biology question',
          signals: ['health', 'science', 'investigating'],
        },
        {
          id: 'business',
          label: '💡 Launch a small business or new idea',
          signals: ['business', 'leading', 'achievement'],
        },
        {
          id: 'impact',
          label: '🌎 Solve a problem affecting my community',
          signals: ['impact', 'people', 'helping'],
        },
      ],
    },
    {
      id: 'new_technology',
      question:
        "You're given a technology you've never used before. What sounds most interesting?",
      answers: [
        {
          id: 'inside',
          label: '🔍 Understand how it works internally',
          signals: ['investigating', 'technology'],
        },
        {
          id: 'solve',
          label: '🛠️ Use it to solve a real problem',
          signals: ['problem_solving', 'building'],
        },
        {
          id: 'compare',
          label: '📊 Compare it with other approaches',
          signals: ['investigating', 'problem_solving'],
        },
        {
          id: 'invent',
          label: '💡 Build something completely new with it',
          signals: ['creating', 'technology'],
        },
      ],
    },
    {
      id: 'master',
      question: 'Which ability would you most like to master?',
      answers: [
        {
          id: 'analysis',
          label: '🧠 Analyzing difficult problems',
          signals: ['investigating', 'problem_solving'],
        },
        {
          id: 'building',
          label: '💻 Designing and building useful things',
          signals: ['technology', 'building'],
        },
        {
          id: 'communication',
          label: '🎤 Communicating ideas that influence people',
          signals: ['communicating', 'people'],
        },
        {
          id: 'leadership',
          label: '🧭 Leading people toward a goal',
          signals: ['leading', 'organizing'],
        },
      ],
    },
    {
      id: 'team_role',
      question:
        'In a challenging team project, which role would you naturally gravitate toward?',
      answers: [
        {
          id: 'vision',
          label: '💡 Shape the idea and direction',
          signals: ['creating', 'leading'],
        },
        {
          id: 'solve',
          label: '🛠️ Solve the hardest technical problems',
          signals: ['problem_solving', 'building'],
        },
        {
          id: 'coordinate',
          label: '📋 Coordinate people and execution',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'communicate',
          label: '🎤 Present and explain the work',
          signals: ['communicating', 'people'],
        },
      ],
    },
    {
      id: 'create',
      question: 'Which result would make you most proud?',
      answers: [
        {
          id: 'product',
          label: '🤖 Building a useful product',
          signals: ['technology', 'building', 'achievement'],
        },
        {
          id: 'business',
          label: '📈 Turning an idea into a successful venture',
          signals: ['business', 'leading', 'achievement'],
        },
        {
          id: 'creative',
          label: '🎬 Creating something people connect with',
          signals: ['arts', 'communicating', 'creating'],
        },
        {
          id: 'change',
          label: '🌱 Creating meaningful positive change',
          signals: ['impact', 'helping'],
        },
      ],
    },
    {
      id: 'impact',
      question:
        'Which challenge would you most want to contribute to?',
      answers: [
        {
          id: 'health',
          label: '🩺 Improving human health',
          signals: ['health', 'science', 'helping'],
        },
        {
          id: 'environment',
          label: '🌎 Protecting the environment',
          signals: ['nature', 'impact'],
        },
        {
          id: 'innovation',
          label: '🚀 Advancing science or technology',
          signals: ['technology', 'science', 'discovery'],
        },
        {
          id: 'society',
          label: '🤝 Improving how people live and work',
          signals: ['people', 'impact', 'helping'],
        },
      ],
    },
    {
      id: 'shadow',
      question:
        'If you could shadow one team for a day, which would you choose?',
      answers: [
        {
          id: 'medical',
          label: '🧬 A medical or research team',
          signals: ['health', 'science', 'investigating'],
        },
        {
          id: 'tech',
          label: '💻 A team building new technology',
          signals: ['technology', 'building'],
        },
        {
          id: 'startup',
          label: '📈 A startup launching a new business',
          signals: ['business', 'leading', 'achievement'],
        },
        {
          id: 'creative',
          label: '🎬 A creative team producing something original',
          signals: ['arts', 'creating', 'collaborating'],
        },
      ],
    },
  ],
}

function getPersona(age) {
  const numericAge = Number(age)

  if (numericAge <= 8) {
    return {
      id: 'explorer',
      internalName: 'Explorer',
    }
  }

  if (numericAge <= 12) {
    return {
      id: 'discoverer',
      internalName: 'Discoverer',
    }
  }

  return {
    id: 'pathfinder',
    internalName: 'Pathfinder',
  }
}

const interestSignals = [
  'science',
  'technology',
  'health',
  'animals',
  'nature',
  'arts',
  'sports',
  'business',
  'people',
  'space',
]

const tendencySignals = [
  'investigating',
  'problem_solving',
  'building',
  'creating',
  'communicating',
  'organizing',
  'leading',
  'collaborating',
]

const motivatorSignals = [
  'helping',
  'discovery',
  'achievement',
  'impact',
  'adventure',
]

function calculateSignalScores(responses) {
  const scores = {}

  responses.forEach((response) => {
    if (!response.signals) {
      return
    }

    response.signals.forEach((signal) => {
      scores[signal] = (scores[signal] || 0) + 1
    })
  })

  return scores
}

function getTopSignals(scores, allowedSignals, limit = 3) {
  return allowedSignals
    .map((signal) => ({
      signal,
      score: scores[signal] || 0,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

const signalLabels = {
  science: 'Science',
  technology: 'Technology',
  health: 'Health & Medicine',
  animals: 'Animals',
  nature: 'Nature',
  arts: 'Creativity & Arts',
  sports: 'Sports & Movement',
  business: 'Business & Ideas',
  people: 'People',
  space: 'Space',

  investigating: 'Curious Investigator',
  problem_solving: 'Problem Solver',
  building: 'Builder',
  creating: 'Creative Thinker',
  communicating: 'Communicator',
  organizing: 'Organizer',
  leading: 'Emerging Leader',
  collaborating: 'Team Player',

  helping: 'Helping Others',
  discovery: 'Discovery',
  achievement: 'Achievement',
  impact: 'Making an Impact',
  adventure: 'Adventure',
}

const signalEmojis = {
  science: '🧪',
  technology: '💻',
  health: '🩺',
  animals: '🐾',
  nature: '🌿',
  arts: '🎨',
  sports: '⚽',
  business: '💡',
  people: '🤝',
  space: '🚀',

  investigating: '🔎',
  problem_solving: '🧩',
  building: '🛠️',
  creating: '✨',
  communicating: '💬',
  organizing: '📋',
  leading: '🧭',
  collaborating: '🤝',

  helping: '❤️',
  discovery: '🔭',
  achievement: '🏆',
  impact: '🌎',
  adventure: '🗺️',
}

const explorationCatalog = [
  {
    id: 'space',
    title: 'Space Explorer',
    emoji: '🚀',
    description:
      'Explore how scientists and engineers solve problems beyond Earth.',
    signals: ['space', 'science', 'technology', 'discovery'],
  },
  {
    id: 'robotics',
    title: 'Robot Builder',
    emoji: '🤖',
    description:
      'Discover how creativity, engineering, and technology come together to build useful machines.',
    signals: ['technology', 'building', 'problem_solving', 'creating'],
  },
  {
    id: 'medicine',
    title: 'Human Body Detective',
    emoji: '🩺',
    description:
      'Explore how doctors and scientists investigate the human body and solve health mysteries.',
    signals: ['health', 'science', 'investigating', 'helping'],
  },
  {
    id: 'wildlife',
    title: 'Wildlife Explorer',
    emoji: '🐅',
    description:
      'Learn how people study, care for, and protect animals and their habitats.',
    signals: ['animals', 'nature', 'discovery', 'helping'],
  },
  {
    id: 'creative',
    title: 'Creative Story Lab',
    emoji: '🎬',
    description:
      'Explore storytelling, design, video, art, and ways to bring new ideas to life.',
    signals: ['arts', 'creating', 'communicating'],
  },
  {
    id: 'entrepreneur',
    title: 'Idea Builder',
    emoji: '💡',
    description:
      'Explore how people turn ideas into products, projects, and businesses.',
    signals: ['business', 'leading', 'creating', 'achievement'],
  },
  {
    id: 'community',
    title: 'Community Changemaker',
    emoji: '🌎',
    description:
      'Explore ways to solve problems that help people and communities.',
    signals: ['people', 'helping', 'impact', 'leading'],
  },
]

function getRecommendations(scores, limit = 3) {
  return explorationCatalog
    .map((exploration) => {
      const score = exploration.signals.reduce(
        (total, signal) => total + (scores[signal] || 0),
        0
      )

      return {
        ...exploration,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function App() {
  const [screen, setScreen] = useState('landing')

  const [childProfile, setChildProfile] = useState({
    name: '',
    age: '11',
    grade: '6th Grade',
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [discoveryResponses, setDiscoveryResponses] = useState([])

  // Exploration state
  const [activeExploration, setActiveExploration] = useState(null)
  const [explorationStep, setExplorationStep] = useState('intro')
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [experienceResponses, setExperienceResponses] = useState([])
  const [enjoymentResponse, setEnjoymentResponse] = useState(null)

  const persona = getPersona(childProfile.age)
  const questions = discoveryQuestions[persona.id]
  const currentQuestion = questions[currentQuestionIndex]

  const currentExploration = activeExploration
    ? explorations[activeExploration]
    : null

  const signalScores = calculateSignalScores(discoveryResponses)

  const topInterests = getTopSignals(
    signalScores,
    interestSignals,
    3
  )

  const topTendencies = getTopSignals(
    signalScores,
    tendencySignals,
    3
  )

  const topMotivators = getTopSignals(
    signalScores,
    motivatorSignals,
    2
  )

  const recommendations = getRecommendations(signalScores, 3)

  const handleProfileChange = (event) => {
    const { name, value } = event.target

    setChildProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }))
  }

  const handleParentSetupSubmit = (event) => {
    event.preventDefault()

    if (!childProfile.name.trim()) {
      return
    }

    setScreen('handoff')
  }

  const startDiscovery = () => {
    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])
    setScreen('discovery')
  }

  const handleAnswer = (answer) => {
    const response = {
      questionId: currentQuestion.id,
      answerId: answer.id,
      answerLabel: answer.label,
      signals: answer.signals,
    }

    const updatedResponses = [
      ...discoveryResponses.filter(
        (item) => item.questionId !== currentQuestion.id
      ),
      response,
    ]

    setDiscoveryResponses(updatedResponses)

    if (currentQuestionIndex === questions.length - 1) {
      setScreen('discoveryComplete')
      return
    }

    setCurrentQuestionIndex((current) => current + 1)
  }

  const handleDiscoveryBack = () => {
    if (currentQuestionIndex === 0) {
      setScreen('handoff')
      return
    }

    setCurrentQuestionIndex((current) => current - 1)
  }

  const startExploration = (explorationId) => {
    if (!explorations[explorationId]) {
      return
    }

    setActiveExploration(explorationId)
    setExplorationStep('intro')
    setChallengeIndex(0)
    setExperienceResponses([])
    setEnjoymentResponse(null)
    setScreen('exploration')
  }

  const beginMission = () => {
    setExplorationStep('challenge')
  }

  const handleChallengeAnswer = (answer) => {
    const challenge =
      currentExploration.challenges[challengeIndex]

    setExperienceResponses((responses) => [
      ...responses,
      {
        type: 'challenge',
        explorationId: currentExploration.id,
        questionId: challenge.id,
        answerId: answer.id,
        signals: answer.signals,
      },
    ])

    if (
      challengeIndex ===
      currentExploration.challenges.length - 1
    ) {
      setExplorationStep('enjoyment')
      return
    }

    setChallengeIndex((current) => current + 1)
  }

  const handleEnjoyment = (answer) => {
    setEnjoymentResponse(answer)

    setExperienceResponses((responses) => [
      ...responses,
      {
        type: 'enjoyment',
        explorationId: currentExploration.id,
        answerId: answer.id,
        enjoyment: answer.value,
      },
    ])

    setExplorationStep('favorite')
  }

  const handleFavoritePart = (answer) => {
    setExperienceResponses((responses) => [
      ...responses,
      {
        type: 'reflection',
        explorationId: currentExploration.id,
        answerId: answer.id,
        signals: answer.signals,
      },
    ])

    setExplorationStep('complete')
  }

  return (
    <main className="page">
      {screen === 'landing' && (
        <section className="hero">
          <p className="eyebrow">Career & Growth</p>

          <h1>
            Helping kids discover who they are,
            what they love, and who they can become.
          </h1>

          <p className="subtext">
            A personal operating system for growing up — designed to
            help families explore interests, build skills, set goals,
            and grow with confidence.
          </p>

          <button
            className="cta"
            onClick={() => setScreen('parentSetup')}
          >
            Get Started
          </button>

          <p className="tagline">
            A Personal Operating System for Growing Up
          </p>
        </section>
      )}

      {screen === 'parentSetup' && (
        <section className="setup">
          <button
            className="backButton"
            onClick={() => setScreen('landing')}
          >
            ← Back
          </button>

          <div className="setupHeader">
            <p className="eyebrow">For Parents</p>

            <h2>Let's create your child's space 🌱</h2>

            <p className="subtext">
              We'll use this to create an experience that's right for
              their age.
            </p>
          </div>

          <form
            className="profileForm"
            onSubmit={handleParentSetupSubmit}
          >
            <label>
              Child's first name or nickname

              <input
                type="text"
                name="name"
                value={childProfile.name}
                onChange={handleProfileChange}
                placeholder="Alex"
                autoFocus
              />
            </label>

            <label>
              Age

              <select
                name="age"
                value={childProfile.age}
                onChange={handleProfileChange}
              >
                {Array.from({ length: 13 }, (_, index) => {
                  const age = index + 5

                  return (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              Grade

              <select
                name="grade"
                value={childProfile.grade}
                onChange={handleProfileChange}
              >
                <option>Kindergarten</option>
                <option>1st Grade</option>
                <option>2nd Grade</option>
                <option>3rd Grade</option>
                <option>4th Grade</option>
                <option>5th Grade</option>
                <option>6th Grade</option>
                <option>7th Grade</option>
                <option>8th Grade</option>
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
            </label>

            <button
              className="cta formCta"
              type="submit"
            >
              Continue
            </button>
          </form>
        </section>
      )}

      {screen === 'handoff' && (
        <section className="handoff">
          <div className="handoffCard">
            <div className="handoffEmoji">👋</div>

            <p className="eyebrow">Your Turn</p>

            <h2>Hi {childProfile.name.trim()}!</h2>

            <p className="handoffIntro">
              Now it's your turn.
            </p>

            <p className="handoffText">
              This isn't a test. There are no right or wrong answers.
              Just choose the things that sound most like you.
            </p>

            <div className="profileSummary">
              <span>{childProfile.age} years old</span>
              <span>•</span>
              <span>{childProfile.grade}</span>
            </div>

            <button
              className="cta"
              onClick={startDiscovery}
            >
              Let's Explore
            </button>
          </div>
        </section>
      )}

      {screen === 'discovery' && (
        <section className="discovery">
          <div className="discoveryTop">
            <button
              className="backButton"
              onClick={handleDiscoveryBack}
            >
              ← Back
            </button>

            <span className="questionCounter">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="progressTrack">
            <div
              className="progressBar"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="questionCard">
            <p className="eyebrow">
              Discovering You
            </p>

            <h2 className="questionTitle">
              {currentQuestion.question}
            </h2>

            <div className="answerGrid">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  className="answerCard"
                  onClick={() => handleAnswer(answer)}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === 'discoveryComplete' && (
        <section className="handoff">
          <div className="handoffCard">
            <div className="handoffEmoji">✨</div>

            <p className="eyebrow">
              Discovery Complete
            </p>

            <h2>
              Nice choices, {childProfile.name.trim()}!
            </h2>

            <p className="handoffText">
              We're starting to notice some interesting things about
              what you enjoy and how you like to explore.
            </p>

            <p className="handoffText">
              Your Growth Profile is beginning to take shape.
            </p>

            <button
              className="cta"
              onClick={() => setScreen('growthProfile')}
            >
              See My Profile
            </button>
          </div>
        </section>
      )}

      {screen === 'growthProfile' && (
        <section className="growthProfile">
          <div className="profileHero">
            <p className="eyebrow">
              Your Growth Profile
            </p>

            <h2>
              Here's what we're beginning to discover about you,{' '}
              {childProfile.name.trim()}.
            </h2>

            <p className="profileIntro">
              This is only the beginning. Your profile will change
              and grow as you explore new things.
            </p>
          </div>

          <div className="profileSection">
            <p className="profileSectionLabel">
              Things you're curious about
            </p>

            <div className="signalCards">
              {topInterests.map(({ signal }) => (
                <div
                  className="signalCard"
                  key={signal}
                >
                  <span className="signalEmoji">
                    {signalEmojis[signal]}
                  </span>

                  <span>
                    {signalLabels[signal]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="profileSection">
            <p className="profileSectionLabel">
              Strengths we're beginning to notice
            </p>

            <div className="signalCards">
              {topTendencies.map(({ signal }) => (
                <div
                  className="signalCard"
                  key={signal}
                >
                  <span className="signalEmoji">
                    {signalEmojis[signal]}
                  </span>

                  <span>
                    {signalLabels[signal]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="profileSection">
            <p className="profileSectionLabel">
              Things that seem to motivate you
            </p>

            <div className="signalCards">
              {topMotivators.map(({ signal }) => (
                <div
                  className="signalCard"
                  key={signal}
                >
                  <span className="signalEmoji">
                    {signalEmojis[signal]}
                  </span>

                  <span>
                    {signalLabels[signal]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendationSection">
            <p className="eyebrow">Explore Next</p>

            <h2 className="recommendationHeading">
              What should we explore next?
            </h2>

            <p className="recommendationIntro">
              Based on what we've learned so far, these adventures
              might be fun for you.
            </p>

            <div className="recommendationGrid">
              {recommendations.map((recommendation) => (
                <div
                  className="recommendationCard"
                  key={recommendation.id}
                >
                  <div className="recommendationEmoji">
                    {recommendation.emoji}
                  </div>

                  <h3>{recommendation.title}</h3>

                  <p>{recommendation.description}</p>

                  {recommendation.id === 'robotics' ? (
                    <button
                      className="exploreButton"
                      onClick={() =>
                        startExploration(
                          recommendation.id
                        )
                      }
                    >
                      Start Adventure
                    </button>
                  ) : (
                    <button
                      className="exploreButton exploreButtonDisabled"
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === 'exploration' &&
        currentExploration && (
          <section className="exploration">
            {explorationStep === 'intro' && (
              <div className="explorationCard">
                <div className="explorationHeroEmoji">
                  {currentExploration.emoji}
                </div>

                <p className="eyebrow">
                  {currentExploration.intro.eyebrow}
                </p>

                <h2>
                  {currentExploration.intro.title}
                </h2>

                <p className="explorationText">
                  {
                    currentExploration.intro
                      .description
                  }
                </p>

                <div className="missionBox">
                  <span className="missionLabel">
                    Your Mission
                  </span>

                  <p>
                    {
                      currentExploration.intro
                        .mission
                    }
                  </p>
                </div>

                <button
                  className="cta"
                  onClick={beginMission}
                >
                  Start Mission
                </button>
              </div>
            )}

            {explorationStep === 'challenge' && (
              <div className="explorationCard">
                <p className="eyebrow">
                  Mission Challenge
                </p>

                <div className="challengeProgress">
                  Challenge {challengeIndex + 1} of{' '}
                  {
                    currentExploration.challenges
                      .length
                  }
                </div>

                <h2 className="questionTitle">
                  {
                    currentExploration.challenges[
                      challengeIndex
                    ].question
                  }
                </h2>

                <div className="answerGrid">
                  {currentExploration.challenges[
                    challengeIndex
                  ].answers.map((answer) => (
                    <button
                      key={answer.id}
                      className="answerCard"
                      onClick={() =>
                        handleChallengeAnswer(answer)
                      }
                    >
                      {answer.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {explorationStep === 'enjoyment' && (
              <div className="explorationCard">
                <div className="explorationHeroEmoji">
                  🎉
                </div>

                <p className="eyebrow">
                  Mission Complete
                </p>

                <h2>
                  {
                    currentExploration.reflection
                      .enjoyment.question
                  }
                </h2>

                <div className="reflectionGrid">
                  {currentExploration.reflection.enjoyment.answers.map(
                    (answer) => (
                      <button
                        key={answer.id}
                        className="reflectionButton"
                        onClick={() =>
                          handleEnjoyment(answer)
                        }
                      >
                        {answer.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {explorationStep === 'favorite' && (
              <div className="explorationCard">
                <p className="eyebrow">
                  One More Thing
                </p>

                <h2>
                  {
                    currentExploration.reflection
                      .favoritePart.question
                  }
                </h2>

                <div className="answerGrid">
                  {currentExploration.reflection.favoritePart.answers.map(
                    (answer) => (
                      <button
                        key={answer.id}
                        className="answerCard"
                        onClick={() =>
                          handleFavoritePart(answer)
                        }
                      >
                        {answer.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {explorationStep === 'complete' && (
              <div className="explorationCard">
                <div className="explorationHeroEmoji">
                  🌱
                </div>

                <p className="eyebrow">
                  Profile Growing
                </p>

                <h2>
                  Great exploring,{' '}
                  {childProfile.name.trim()}!
                </h2>

                <p className="explorationText">
                  Every adventure helps us learn a little
                  more about what you enjoy, how you solve
                  problems, and what you might want to
                  explore next.
                </p>

                {enjoymentResponse && (
                  <p className="explorationText">
                    You said this adventure was:{' '}
                    <strong>
                      {enjoymentResponse.label}
                    </strong>
                  </p>
                )}

                <button
                  className="cta"
                  onClick={() =>
                    setScreen('growthProfile')
                  }
                >
                  Back to My Profile
                </button>
              </div>
            )}
          </section>
        )}
    </main>
  )
}

export default App