export const explorations = {
  robotics: {
    id: 'robotics',
    title: 'Robot Builder',
    emoji: '🤖',
    category: 'Technology & Engineering',
    description:
      'Discover how creativity, engineering, and technology come together to build useful machines.',
    signals: [
      'technology',
      'building',
      'problem_solving',
      'creating',
    ],

    intro: {
      eyebrow: 'Robot Lab',
      title: 'Your robot mission is ready.',
      description:
        "Robots aren't just machines that look like people. Engineers build robots to solve problems — including jobs that may be difficult or dangerous for humans.",
      mission:
        'A powerful storm has flooded part of a town. Your job is to design a robot that can help.',
    },

    challenges: [
      {
        id: 'robot_job',
        question: 'What should your robot be best at?',
        answers: [
          {
            id: 'find_people',
            label: '🧭 Find people who need help',
            signals: ['helping', 'problem_solving'],
          },
          {
            id: 'deliver_supplies',
            label: '📦 Deliver food and medicine',
            signals: ['helping', 'impact'],
          },
          {
            id: 'cross_water',
            label: '🌊 Travel through flooded areas',
            signals: ['building', 'problem_solving'],
          },
          {
            id: 'send_information',
            label: '📡 Send information to rescuers',
            signals: ['technology', 'communicating'],
          },
        ],
      },

      {
        id: 'robot_ability',
        question:
          'Your robot can have one special ability. Which would you add?',
        answers: [
          {
            id: 'heat_camera',
            label:
              '🌡️ A camera that can detect people in the dark',
            signals: ['technology', 'investigating'],
          },
          {
            id: 'strong_arms',
            label:
              '💪 Strong arms that can move obstacles',
            signals: ['building', 'problem_solving'],
          },
          {
            id: 'drone',
            label:
              '🚁 A tiny drone that can scout ahead',
            signals: ['technology', 'discovery'],
          },
          {
            id: 'communication',
            label:
              '📢 A system that lets trapped people communicate',
            signals: ['helping', 'communicating'],
          },
        ],
      },

      {
        id: 'battery_problem',
        question:
          "There's a problem! Your robot's battery only lasts 30 minutes. What would you try?",
        answers: [
          {
            id: 'smaller',
            label:
              '🔋 Make the robot smaller and lighter',
            signals: ['building', 'problem_solving'],
          },
          {
            id: 'solar',
            label:
              '☀️ Add another way to generate power',
            signals: ['creating', 'problem_solving'],
          },
          {
            id: 'prioritize',
            label:
              '🎯 Make it do only the most important jobs',
            signals: ['organizing', 'problem_solving'],
          },
          {
            id: 'swap',
            label:
              '🔄 Design batteries rescuers can quickly swap',
            signals: ['building', 'creating'],
          },
        ],
      },
    ],

    reflection: {
      enjoyment: {
        question: 'How did this mission feel?',
        answers: [
          {
            id: 'loved',
            label: '😍 I loved it',
            value: 3,
          },
          {
            id: 'liked',
            label: '🙂 I liked it',
            value: 2,
          },
          {
            id: 'okay',
            label: '😐 It was okay',
            value: 1,
          },
          {
            id: 'not_for_me',
            label: '👎 Not really for me',
            value: 0,
          },
        ],
      },

      favoritePart: {
        question: 'What part did you enjoy most?',
        answers: [
          {
            id: 'designing',
            label: '🔧 Designing the robot',
            signals: ['technology', 'building'],
          },
          {
            id: 'solving',
            label: '🧩 Solving the problems',
            signals: [
              'problem_solving',
              'investigating',
            ],
          },
          {
            id: 'helping',
            label: '❤️ Helping people',
            signals: ['helping', 'impact'],
          },
          {
            id: 'ideas',
            label: '💡 Coming up with ideas',
            signals: ['creating', 'discovery'],
          },
        ],
      },
    },
  },

  medicine: {
    id: 'medicine',
    title: 'Human Body Detective',
    emoji: '🩺',
    category: 'Health & Science',
    description:
      'Explore how doctors and scientists investigate the human body and solve health mysteries.',
    signals: [
      'health',
      'science',
      'investigating',
      'helping',
    ],

    intro: {
      eyebrow: 'Medical Mystery Lab',
      title: 'A health mystery needs your help.',
      description:
        'Doctors often solve mysteries by gathering clues, asking questions, and using science to understand what the body may be telling them.',
      mission:
        'A young athlete has been feeling unusually tired during soccer practice. Your job is to investigate the clues and decide what the medical team should explore.',
    },

    challenges: [
      {
        id: 'first_clue',
        question:
          'What would you want to learn first?',
        answers: [
          {
            id: 'symptoms',
            label:
              '🗣️ Ask when the tiredness started and how it feels',
            signals: [
              'investigating',
              'communicating',
            ],
          },
          {
            id: 'food_water',
            label:
              '🥗 Find out what they have been eating and drinking',
            signals: ['health', 'investigating'],
          },
          {
            id: 'sleep',
            label:
              '😴 Ask how much sleep they have been getting',
            signals: ['health', 'investigating'],
          },
          {
            id: 'activity',
            label:
              '⚽ Learn whether their exercise routine changed',
            signals: [
              'health',
              'problem_solving',
            ],
          },
        ],
      },

      {
        id: 'next_step',
        question:
          'The medical team wants another clue. What sounds most useful?',
        answers: [
          {
            id: 'heart_rate',
            label:
              '❤️ Check how the heart responds during activity',
            signals: ['health', 'science'],
          },
          {
            id: 'blood_test',
            label:
              '🧪 Study a blood sample for clues',
            signals: ['science', 'investigating'],
          },
          {
            id: 'compare',
            label:
              '📊 Compare healthy days with tired days',
            signals: [
              'investigating',
              'problem_solving',
            ],
          },
          {
            id: 'questions',
            label:
              '💬 Ask more questions about how they have been feeling',
            signals: [
              'communicating',
              'helping',
            ],
          },
        ],
      },

      {
        id: 'new_clue',
        question:
          'You discover they have been practicing outside in very hot weather. What would you suggest exploring?',
        answers: [
          {
            id: 'hydration',
            label:
              '💧 Check whether they are drinking enough water',
            signals: ['health', 'problem_solving'],
          },
          {
            id: 'rest',
            label:
              '🛌 Look at whether they need more rest and recovery',
            signals: ['health', 'helping'],
          },
          {
            id: 'temperature',
            label:
              '🌡️ Study how heat affects the body during exercise',
            signals: ['science', 'discovery'],
          },
          {
            id: 'whole_picture',
            label:
              '🧩 Put all the clues together before deciding',
            signals: [
              'investigating',
              'problem_solving',
            ],
          },
        ],
      },
    ],

    reflection: {
      enjoyment: {
        question: 'How did this medical mystery feel?',
        answers: [
          {
            id: 'loved',
            label: '😍 I loved it',
            value: 3,
          },
          {
            id: 'liked',
            label: '🙂 I liked it',
            value: 2,
          },
          {
            id: 'okay',
            label: '😐 It was okay',
            value: 1,
          },
          {
            id: 'not_for_me',
            label: '👎 Not really for me',
            value: 0,
          },
        ],
      },

      favoritePart: {
        question: 'What part did you enjoy most?',
        answers: [
          {
            id: 'clues',
            label:
              '🔎 Looking for clues',
            signals: [
              'investigating',
              'discovery',
            ],
          },
          {
            id: 'science',
            label:
              '🧪 Thinking about how the body works',
            signals: ['health', 'science'],
          },
          {
            id: 'solving',
            label:
              '🧩 Solving the mystery',
            signals: [
              'problem_solving',
              'investigating',
            ],
          },
          {
            id: 'helping',
            label:
              '❤️ Helping someone feel better',
            signals: ['helping', 'health'],
          },
        ],
      },
    },
  },

  creative: {
    id: 'creative',
    title: 'Creative Story Lab',
    emoji: '🎬',
    category: 'Creativity & Communication',
    description:
      'Explore storytelling, design, video, art, and ways to bring new ideas to life.',
    signals: [
      'arts',
      'creating',
      'communicating',
      'collaborating',
    ],

    intro: {
      eyebrow: 'Story Studio',
      title: 'Your creative team needs an idea.',
      description:
        'Stories can entertain people, teach them something, make them laugh, or even change how they see the world. Great creative projects start with choices.',
      mission:
        'Your team is entering a short-film challenge. You have to help create a story about a surprising discovery that changes someone’s day.',
    },

    challenges: [
      {
        id: 'story_start',
        question:
          'Where should your story begin?',
        answers: [
          {
            id: 'mystery_box',
            label:
              '📦 Someone finds a mysterious box',
            signals: ['creating', 'discovery'],
          },
          {
            id: 'lost_animal',
            label:
              '🐶 Someone finds a lost animal',
            signals: ['animals', 'helping'],
          },
          {
            id: 'future_message',
            label:
              '📱 Someone receives a message from the future',
            signals: ['technology', 'creating'],
          },
          {
            id: 'hidden_place',
            label:
              '🗺️ Someone discovers a hidden place',
            signals: ['adventure', 'discovery'],
          },
        ],
      },

      {
        id: 'story_problem',
        question:
          'Every good story needs a challenge. What should happen next?',
        answers: [
          {
            id: 'time_limit',
            label:
              '⏰ The characters have only one hour to solve the problem',
            signals: [
              'problem_solving',
              'creating',
            ],
          },
          {
            id: 'disagreement',
            label:
              '🤝 Two characters disagree about what to do',
            signals: [
              'communicating',
              'collaborating',
            ],
          },
          {
            id: 'missing_clue',
            label:
              '🔎 An important clue suddenly disappears',
            signals: [
              'investigating',
              'creating',
            ],
          },
          {
            id: 'unexpected_twist',
            label:
              '✨ Something completely unexpected happens',
            signals: ['creating', 'adventure'],
          },
        ],
      },

      {
        id: 'team_choice',
        question:
          'Your team has limited time. Which job would you most want to take?',
        answers: [
          {
            id: 'writer',
            label:
              '✍️ Shape the story and dialogue',
            signals: [
              'creating',
              'communicating',
            ],
          },
          {
            id: 'director',
            label:
              '🎬 Decide how the scenes should come together',
            signals: ['leading', 'creating'],
          },
          {
            id: 'designer',
            label:
              '🎨 Create the look, setting, and visual ideas',
            signals: ['arts', 'creating'],
          },
          {
            id: 'producer',
            label:
              '📋 Help everyone stay organized and finish',
            signals: [
              'organizing',
              'collaborating',
            ],
          },
        ],
      },
    ],

    reflection: {
      enjoyment: {
        question: 'How did this creative mission feel?',
        answers: [
          {
            id: 'loved',
            label: '😍 I loved it',
            value: 3,
          },
          {
            id: 'liked',
            label: '🙂 I liked it',
            value: 2,
          },
          {
            id: 'okay',
            label: '😐 It was okay',
            value: 1,
          },
          {
            id: 'not_for_me',
            label: '👎 Not really for me',
            value: 0,
          },
        ],
      },

      favoritePart: {
        question: 'What part did you enjoy most?',
        answers: [
          {
            id: 'ideas',
            label:
              '💡 Coming up with the story idea',
            signals: ['creating', 'discovery'],
          },
          {
            id: 'characters',
            label:
              '🎭 Imagining characters and what they would do',
            signals: ['arts', 'creating'],
          },
          {
            id: 'team',
            label:
              '🤝 Choosing how the creative team should work',
            signals: [
              'collaborating',
              'communicating',
            ],
          },
          {
            id: 'bringing_alive',
            label:
              '🎬 Thinking about how to bring the story to life',
            signals: [
              'arts',
              'communicating',
            ],
          },
        ],
      },
    },
  },
}