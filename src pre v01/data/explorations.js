export const explorations = {
  robotics: {
    id: 'robotics',
    title: 'Robot Builder',
    emoji: '🤖',

    intro: {
      eyebrow: 'Robot Lab',
      title: 'Your first mission is ready.',
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
        question: 'Your robot can have one special ability. Which would you add?',
        answers: [
          {
            id: 'heat_camera',
            label: '🌡️ A camera that can detect people in the dark',
            signals: ['technology', 'investigating'],
          },
          {
            id: 'strong_arms',
            label: '💪 Strong arms that can move obstacles',
            signals: ['building', 'problem_solving'],
          },
          {
            id: 'drone',
            label: '🚁 A tiny drone that can scout ahead',
            signals: ['technology', 'discovery'],
          },
          {
            id: 'communication',
            label: '📢 A system that lets trapped people communicate',
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
            label: '🔋 Make the robot smaller and lighter',
            signals: ['building', 'problem_solving'],
          },
          {
            id: 'solar',
            label: '☀️ Add another way to generate power',
            signals: ['creating', 'problem_solving'],
          },
          {
            id: 'prioritize',
            label: '🎯 Make it do only the most important jobs',
            signals: ['organizing', 'problem_solving'],
          },
          {
            id: 'swap',
            label: '🔄 Design batteries rescuers can quickly swap',
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
            signals: ['problem_solving', 'investigating'],
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
}