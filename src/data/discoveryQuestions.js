// ============================================================
// Career & Growth
// MVP v0.3 — Discovery Questions
// ============================================================
//
// Age/persona-specific Discovering You questionnaire.
//
// Personas:
// - explorer: younger children
// - discoverer: middle childhood
// - pathfinder: older children / teens
//
// This file is intentionally data-only.
// Scoring and evidence translation remain outside this file.
// ============================================================

export const discoveryQuestions = {
  explorer: [
    {
      id: 'free_time',
      shortLabel: 'Free-time choice',
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
      shortLabel: 'Explore somewhere',
      question:
        'Which place would you most like to explore?',
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
      shortLabel: 'Solve a problem',
      question:
        'Your favorite toy stops working. What would you like to do?',
      answers: [
        {
          id: 'inspect',
          label:
            '🔍 Look closely to see what happened',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'fix',
          label: '🔧 Try to fix it',
          signals: [
            'building',
            'problem_solving',
          ],
        },
        {
          id: 'new',
          label:
            '💡 Think of a better version',
          signals: [
            'creating',
            'problem_solving',
          ],
        },
        {
          id: 'together',
          label:
            '🤝 Ask someone to help fix it',
          signals: [
            'collaborating',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'super_skill',
      shortLabel: 'Super skill',
      question:
        'If you could be amazing at one thing, what would you pick?',
      answers: [
        {
          id: 'discover',
          label:
            '🔬 Discovering how things work',
          signals: ['science', 'discovery'],
        },
        {
          id: 'make',
          label: '🛠️ Making cool things',
          signals: ['building', 'creating'],
        },
        {
          id: 'people',
          label:
            '💬 Helping and talking with people',
          signals: ['people', 'helping'],
        },
        {
          id: 'perform',
          label:
            '🎭 Performing or creating stories',
          signals: [
            'arts',
            'communicating',
          ],
        },
      ],
    },
    {
      id: 'team',
      shortLabel: 'Team role',
      question:
        'Your friends are making something together. What sounds fun to you?',
      answers: [
        {
          id: 'idea',
          label:
            '💡 Think of the big idea',
          signals: ['creating', 'leading'],
        },
        {
          id: 'make',
          label: '🛠️ Help make it',
          signals: [
            'building',
            'collaborating',
          ],
        },
        {
          id: 'organize',
          label:
            '📋 Help everyone know what to do',
          signals: [
            'organizing',
            'leading',
          ],
        },
        {
          id: 'show',
          label:
            '🎤 Show everyone what you made',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'create',
      shortLabel: 'Make something',
      question:
        'Which would you most like to make?',
      answers: [
        {
          id: 'robot',
          label: '🤖 A helpful robot',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'game',
          label: '🎮 Your own game',
          signals: [
            'technology',
            'creating',
          ],
        },
        {
          id: 'story',
          label: '📖 A story or video',
          signals: [
            'arts',
            'communicating',
          ],
        },
        {
          id: 'community',
          label:
            '🌱 Something that helps people nearby',
          signals: [
            'helping',
            'impact',
          ],
        },
      ],
    },
    {
      id: 'help',
      shortLabel: 'Help with something',
      question:
        'What would you most like to help with?',
      answers: [
        {
          id: 'health',
          label:
            '❤️ Helping someone feel better',
          signals: [
            'health',
            'helping',
          ],
        },
        {
          id: 'animals',
          label: '🐾 Helping animals',
          signals: [
            'animals',
            'helping',
          ],
        },
        {
          id: 'planet',
          label:
            '🌎 Helping the planet',
          signals: [
            'nature',
            'impact',
          ],
        },
        {
          id: 'discover',
          label:
            '🔭 Discovering something new',
          signals: [
            'science',
            'discovery',
          ],
        },
      ],
    },
    {
      id: 'adventure',
      shortLabel: 'Choose an adventure',
      question:
        'Which adventure sounds the most exciting?',
      answers: [
        {
          id: 'doctor',
          label:
            '🩺 Solve a health mystery',
          signals: [
            'health',
            'investigating',
          ],
        },
        {
          id: 'engineer',
          label:
            '🚀 Build something for space',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'wildlife',
          label:
            '🐯 Study animals in the wild',
          signals: [
            'animals',
            'nature',
            'discovery',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Help make a movie or game',
          signals: [
            'arts',
            'creating',
          ],
        },
      ],
    },
  ],

  discoverer: [
    {
      id: 'free_time',
      shortLabel: 'Free Saturday',
      question:
        'You have a whole Saturday with nothing planned. What sounds the most fun?',
      answers: [
        {
          id: 'experiment',
          label:
            '🧪 Try a cool experiment',
          signals: [
            'science',
            'investigating',
          ],
        },
        {
          id: 'game',
          label:
            '🎮 Build something in a game',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'animals',
          label:
            '🐕 Spend time with animals',
          signals: [
            'animals',
            'helping',
          ],
        },
        {
          id: 'creative',
          label:
            '🎨 Draw, make music, or create something',
          signals: [
            'arts',
            'creating',
          ],
        },
      ],
    },
    {
      id: 'class_project',
      shortLabel: 'Class project',
      question:
        'Your class can choose one big project. Which would you pick?',
      answers: [
        {
          id: 'mars',
          label:
            '🚀 Design something for a Mars mission',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'brain',
          label:
            '🧠 Discover something about the human brain',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'environment',
          label:
            '🌎 Find a way to protect the environment',
          signals: [
            'nature',
            'impact',
          ],
        },
        {
          id: 'movie',
          label:
            '🎬 Create a movie that tells an amazing story',
          signals: [
            'arts',
            'communicating',
            'creating',
          ],
        },
      ],
    },
    {
      id: 'broken',
      shortLabel: 'Something breaks',
      question:
        'Something you really like suddenly stops working. What would you want to do?',
      answers: [
        {
          id: 'inspect',
          label:
            "🔧 Take a closer look and figure out what's wrong",
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'research',
          label:
            '📱 Research how it works and look for solutions',
          signals: [
            'investigating',
            'discovery',
          ],
        },
        {
          id: 'redesign',
          label:
            '💡 Imagine a better version and redesign it',
          signals: [
            'creating',
            'problem_solving',
          ],
        },
        {
          id: 'team',
          label:
            '🤝 Find someone and solve it together',
          signals: [
            'collaborating',
            'problem_solving',
          ],
        },
      ],
    },
    {
      id: 'instant_skill',
      shortLabel: 'Instant skill',
      question:
        'Imagine you could instantly become amazing at one thing. Which would you choose?',
      answers: [
        {
          id: 'science',
          label:
            '🔬 Understanding how the world works',
          signals: [
            'science',
            'discovery',
          ],
        },
        {
          id: 'tech',
          label:
            '💻 Building things with technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'creative',
          label:
            '🎨 Creating things people have never seen before',
          signals: [
            'arts',
            'creating',
          ],
        },
        {
          id: 'people',
          label:
            '💬 Understanding and connecting with people',
          signals: [
            'people',
            'communicating',
          ],
        },
      ],
    },
    {
      id: 'team_role',
      shortLabel: 'Team role',
      question:
        'Your friends decide to build something really cool together. Which role sounds most like you?',
      answers: [
        {
          id: 'idea',
          label:
            '💡 Come up with the big idea',
          signals: [
            'creating',
            'leading',
          ],
        },
        {
          id: 'build',
          label:
            '🛠️ Figure out how to build it',
          signals: [
            'building',
            'problem_solving',
          ],
        },
        {
          id: 'organize',
          label:
            '📋 Keep everyone organized and moving',
          signals: [
            'organizing',
            'leading',
          ],
        },
        {
          id: 'present',
          label:
            '🎤 Show everyone what you created',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'make',
      shortLabel: 'Make something',
      question:
        'If you could make one of these today, which would you choose?',
      answers: [
        {
          id: 'robot',
          label:
            '🤖 A robot that can do something useful',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'game',
          label:
            '🎮 Your own game',
          signals: [
            'technology',
            'creating',
          ],
        },
        {
          id: 'story',
          label:
            '📖 A story, comic, or video',
          signals: [
            'arts',
            'communicating',
          ],
        },
        {
          id: 'community',
          label:
            '🌱 Something that makes your neighborhood better',
          signals: [
            'impact',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'problem',
      shortLabel: 'Make a difference',
      question:
        'Which problem would you be most excited to help solve?',
      answers: [
        {
          id: 'health',
          label:
            '🩺 Helping people stay healthy',
          signals: [
            'health',
            'helping',
          ],
        },
        {
          id: 'animals',
          label:
            '🐾 Protecting animals and wildlife',
          signals: [
            'animals',
            'nature',
            'helping',
          ],
        },
        {
          id: 'planet',
          label:
            '🌎 Making the planet healthier',
          signals: [
            'nature',
            'impact',
          ],
        },
        {
          id: 'unknown',
          label:
            '🚀 Discovering something nobody knows yet',
          signals: [
            'science',
            'discovery',
          ],
        },
      ],
    },
    {
      id: 'day_with',
      shortLabel: 'See someone work',
      question:
        "You get to spend an entire day seeing someone's work. Which adventure would you choose?",
      answers: [
        {
          id: 'doctor',
          label:
            '🩺 Help a doctor solve a medical mystery',
          signals: [
            'health',
            'investigating',
            'helping',
          ],
        },
        {
          id: 'engineer',
          label:
            '🚀 Join an engineer designing something for space',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'wildlife',
          label:
            '🐅 Follow a wildlife scientist studying animals',
          signals: [
            'animals',
            'nature',
            'discovery',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Join a creative team making a movie or game',
          signals: [
            'arts',
            'creating',
            'collaborating',
          ],
        },
      ],
    },
  ],

  pathfinder: [
    {
      id: 'free_time',
      shortLabel: 'Free weekend',
      question:
        'You suddenly have a free weekend. Which sounds most worthwhile?',
      answers: [
        {
          id: 'learn',
          label:
            '🔬 Dive into a topic I am curious about',
          signals: [
            'science',
            'investigating',
            'discovery',
          ],
        },
        {
          id: 'build',
          label:
            '💻 Build or experiment with technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'create',
          label:
            '🎨 Create something original',
          signals: [
            'arts',
            'creating',
          ],
        },
        {
          id: 'people',
          label:
            '🤝 Spend time helping or working with people',
          signals: [
            'people',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'project',
      shortLabel: 'Lead a project',
      question:
        'You can lead one semester-long project. Which would you choose?',
      answers: [
        {
          id: 'engineering',
          label:
            '🚀 Design a solution to a difficult technical problem',
          signals: [
            'technology',
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'health',
          label:
            '🧬 Investigate a health or biology question',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'business',
          label:
            '💡 Launch a small business or new idea',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'impact',
          label:
            '🌎 Solve a problem affecting my community',
          signals: [
            'impact',
            'people',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'new_technology',
      shortLabel: 'New technology',
      question:
        "You're given a technology you've never used before. What sounds most interesting?",
      answers: [
        {
          id: 'inside',
          label:
            '🔍 Understand how it works internally',
          signals: [
            'investigating',
            'technology',
          ],
        },
        {
          id: 'solve',
          label:
            '🛠️ Use it to solve a real problem',
          signals: [
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'compare',
          label:
            '📊 Compare it with other approaches',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'invent',
          label:
            '💡 Build something completely new with it',
          signals: [
            'creating',
            'technology',
          ],
        },
      ],
    },
    {
      id: 'master',
      shortLabel: 'Master a skill',
      question:
        'Which ability would you most like to master?',
      answers: [
        {
          id: 'analysis',
          label:
            '🧠 Analyzing difficult problems',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'building',
          label:
            '💻 Designing and building useful things',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'communication',
          label:
            '🎤 Communicating ideas that influence people',
          signals: [
            'communicating',
            'people',
          ],
        },
        {
          id: 'leadership',
          label:
            '🧭 Leading people toward a goal',
          signals: [
            'leading',
            'organizing',
          ],
        },
      ],
    },
    {
      id: 'team_role',
      shortLabel: 'Team role',
      question:
        'In a challenging team project, which role would you naturally gravitate toward?',
      answers: [
        {
          id: 'vision',
          label:
            '💡 Shape the idea and direction',
          signals: [
            'creating',
            'leading',
          ],
        },
        {
          id: 'solve',
          label:
            '🛠️ Solve the hardest technical problems',
          signals: [
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'coordinate',
          label:
            '📋 Coordinate people and execution',
          signals: [
            'organizing',
            'leading',
          ],
        },
        {
          id: 'communicate',
          label:
            '🎤 Present and explain the work',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'create',
      shortLabel: 'Proud result',
      question:
        'Which result would make you most proud?',
      answers: [
        {
          id: 'product',
          label:
            '🤖 Building a useful product',
          signals: [
            'technology',
            'building',
            'achievement',
          ],
        },
        {
          id: 'business',
          label:
            '📈 Turning an idea into a successful venture',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Creating something people connect with',
          signals: [
            'arts',
            'communicating',
            'creating',
          ],
        },
        {
          id: 'change',
          label:
            '🌱 Creating meaningful positive change',
          signals: [
            'impact',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'impact',
      shortLabel: 'Big challenge',
      question:
        'Which challenge would you most want to contribute to?',
      answers: [
        {
          id: 'health',
          label:
            '🩺 Improving human health',
          signals: [
            'health',
            'science',
            'helping',
          ],
        },
        {
          id: 'environment',
          label:
            '🌎 Protecting the environment',
          signals: [
            'nature',
            'impact',
          ],
        },
        {
          id: 'innovation',
          label:
            '🚀 Advancing science or technology',
          signals: [
            'technology',
            'science',
            'discovery',
          ],
        },
        {
          id: 'society',
          label:
            '🤝 Improving how people live and work',
          signals: [
            'people',
            'impact',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'shadow',
      shortLabel: 'Shadow a team',
      question:
        'If you could shadow one team for a day, which would you choose?',
      answers: [
        {
          id: 'medical',
          label:
            '🧬 A medical or research team',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'tech',
          label:
            '💻 A team building new technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'startup',
          label:
            '📈 A startup launching a new business',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 A creative team producing something original',
          signals: [
            'arts',
            'creating',
            'collaborating',
          ],
        },
      ],
    },
  ],
}