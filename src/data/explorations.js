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


    // ========================================================
    // MVP v0.6 — GUIDED ADVENTURE MODEL
    // ========================================================
    //
    // This is intentionally additive.
    //
    // Existing intro/challenges/reflection fields remain in
    // place so the current v0.5/v0.6 AdventureFlow continues
    // to work until Phase 2B introduces the Guided Adventure UI.
    //
    // guidedAdventure is the new reusable experience contract:
    //
    // mission
    //   ↓
    // get ready
    //   ↓
    // learn
    //   ↓
    // try / build
    //   ↓
    // challenge
    //   ↓
    // kid experience + reflection
    //
    // Resources are curated experience inputs, not evidence by
    // themselves. Later phases can create System Evidence from
    // actual step completion or interaction.
    //

    guidedAdventure: {
      version: '0.6.0',

      status: 'pilot',

      audience: {
        minAge: 9,
        maxAge: 13,
        recommendedGrades: [
          '4th Grade',
          '5th Grade',
          '6th Grade',
          '7th Grade',
          '8th Grade',
        ],
      },

      estimatedMinutes: {
        minimum: 35,
        typical: 60,
        extended: 90,
      },

      mission: {
        id: 'flood_rescue_robot',

        title:
          'Design a robot that can help after a flood',

        story:
          'A powerful storm has flooded part of a town. Roads are blocked, some areas are unsafe for people, and rescuers need help reaching places quickly.',

        challenge:
          'Design a rescue robot that can do one important job safely and reliably.',

        successQuestion:
          'How will your robot help, and what will it need to do its job?',

        heroEmoji: '🤖',

        theme: 'rescue_lab',
      },

      outcomes: [
        {
          id: 'robot_purpose',
          label:
            'Understand that robots are designed to solve specific problems.',
        },
        {
          id: 'engineering_tradeoffs',
          label:
            'Notice that engineering involves choices and tradeoffs.',
        },
        {
          id: 'prototype_thinking',
          label:
            'Create and improve a robot idea through testing or iteration.',
        },
        {
          id: 'self_discovery',
          label:
            'Notice which parts of designing, building, or problem-solving feel most engaging.',
        },
      ],

      materials: {
        required: [
          'Paper',
          'Pencil or pen',
        ],

        optional: [
          'Cardboard or recycled materials',
          'LEGO or other building pieces',
          'Scissors and tape with adult supervision',
          'Computer or tablet for virtual robotics activities',
        ],

        note:
          'The Adventure can be completed as a design challenge without buying a robotics kit.',
      },

      stages: [
        {
          id: 'get_ready',
          type: 'orientation',
          order: 1,

          title:
            'Meet the Mission',

          kidLabel:
            'Your rescue mission',

          emoji: '🚨',

          estimatedMinutes: 5,

          instruction:
            'Pick the most important job your rescue robot should do. Think about who it is helping and what makes the flooded area difficult.',

          completionMode:
            'kid_confirm',

          required: true,
        },

        {
          id: 'learn',
          type: 'resource',
          order: 2,

          title:
            'Learn How Robots Solve Problems',

          kidLabel:
            'Unlock robot powers',

          emoji: '🧠',

          estimatedMinutes: 10,

          instruction:
            'Explore one short robotics resource. Look for ideas about sensing, movement, control, or how engineers improve a design.',

          resourceIds: [
            'robotics_project_ideas',
            'vexcode_vr',
          ],

          minimumResources:
            1,

          completionMode:
            'kid_confirm',

          required: true,
        },

        {
          id: 'try',
          type: 'activity',
          order: 3,

          title:
            'Try a Robot Idea',

          kidLabel:
            'Test something',

          emoji: '🧪',

          estimatedMinutes: 10,

          instruction:
            'Try controlling a virtual robot or sketch how your rescue robot should sense, move, and respond.',

          activityOptions: [
            {
              id: 'virtual_robot',
              label:
                'Try a virtual robot',

              resourceId:
                'vexcode_vr',
            },
            {
              id: 'paper_prototype',
              label:
                'Sketch a rescue robot',

              prompt:
                'Draw your robot. Label how it moves, what it senses, what it carries, and how rescuers communicate with it.',
            },
          ],

          minimumActivities:
            1,

          completionMode:
            'kid_confirm',

          required: true,
        },

        {
          id: 'build',
          type: 'activity',
          order: 4,

          title:
            'Build or Improve Your Design',

          kidLabel:
            'Build your solution',

          emoji: '🛠️',

          estimatedMinutes: 15,

          instruction:
            'Turn your idea into a simple prototype, model, or improved drawing. Then change at least one part after thinking about what could go wrong.',

          prompts: [
            'How will it move through water, mud, or debris?',
            'How will it know where to go?',
            'What happens if its battery gets low?',
            'How will it communicate with rescuers?',
          ],

          completionMode:
            'kid_confirm',

          required: true,
        },

        {
          id: 'challenge',
          type: 'challenge',
          order: 5,

          title:
            'Engineering Challenge',

          kidLabel:
            'Mission challenge',

          emoji: '⚡',

          estimatedMinutes: 10,

          instruction:
            'Your robot has only 30 minutes of battery power. Decide what you would change so it can still complete its most important rescue job.',

          legacyChallengeIds: [
            'robot_job',
            'robot_ability',
            'battery_problem',
          ],

          completionMode:
            'response',

          required: true,
        },

        {
          id: 'reflect',
          type: 'reflection',
          order: 6,

          title:
            'What Did You Notice?',

          kidLabel:
            'Mission debrief',

          emoji: '✨',

          estimatedMinutes: 5,

          instruction:
            'Tell us what felt interesting, frustrating, surprising, or fun. This is about your experience — there are no right answers.',

          reflectionIds: [
            'enjoyment',
            'favorite_part',
          ],

          completionMode:
            'response',

          required: true,
        },
      ],

      resources: [
        {
          id: 'vexcode_vr',

          title:
            'VEXcode VR',

          provider:
            'VEX Robotics',

          type:
            'interactive',

          emoji: '🎮',

          url:
            'https://vr.vex.com/',

          kidDescription:
            'Program a virtual robot in your browser and see what your instructions make it do.',

          whyItFits:
            'Lets the child actually control and test a robot without needing a physical robotics kit.',

          ageMin: 9,

          ageMax: 13,

          estimatedMinutes: 10,

          difficulty:
            'beginner',

          external: true,

          requiresAccount: false,

          optional: false,
        },

        {
          id: 'robotics_project_ideas',

          title:
            'Robotics Projects, Lessons, and Activities',

          provider:
            'Science Buddies',

          type:
            'learn_and_build',

          emoji: '🔎',

          url:
            'https://www.sciencebuddies.org/blog/robotics-lessons',

          kidDescription:
            'See different ways students design, build, test, and improve robots.',

          whyItFits:
            'Introduces real engineering iteration and gives the child ideas before creating a rescue robot.',

          ageMin: 9,

          ageMax: 13,

          estimatedMinutes: 8,

          difficulty:
            'beginner',

          external: true,

          requiresAccount: false,

          optional: false,
        },

        {
          id: 'tinkercad_circuits',

          title:
            'Tinkercad Circuits',

          provider:
            'Autodesk',

          type:
            'interactive',

          emoji: '🔌',

          url:
            'https://www.tinkercad.com/learn/circuits',

          kidDescription:
            'Explore electronics and circuits that can become part of how a robot senses or responds.',

          whyItFits:
            'Good optional extension for a child who becomes curious about the electronics behind robots.',

          ageMin: 10,

          ageMax: 13,

          estimatedMinutes: 15,

          difficulty:
            'stretch',

          external: true,

          requiresAccount:
            'may_be_required_for_creation',

          optional: true,
        },

        {
          id: 'nasa_robotic_arm',

          title:
            'Robotic Arm Challenge',

          provider:
            'NASA Jet Propulsion Laboratory',

          type:
            'hands_on',

          emoji: '🦾',

          url:
            'https://www.jpl.nasa.gov/edu/resources/lesson-plan/robotic-arm-challenge/',

          kidDescription:
            'Explore a hands-on engineering challenge about designing a robotic arm to move objects.',

          whyItFits:
            'Shows how real robot design connects to a specific physical job and the engineering design process.',

          ageMin: 10,

          ageMax: 14,

          estimatedMinutes: 30,

          difficulty:
            'stretch',

          external: true,

          requiresAccount: false,

          optional: true,

          adultSupport:
            'recommended',
        },
      ],

      kidExperience: {
        prompts: [
          {
            id: 'most_fun',
            type: 'single_choice',

            question:
              'Which part was the most fun for you?',

            options: [
              {
                id: 'learning',
                label:
                  '🧠 Learning how robots work',
              },
              {
                id: 'trying',
                label:
                  '🎮 Testing or controlling a robot',
              },
              {
                id: 'designing',
                label:
                  '✏️ Designing my own robot',
              },
              {
                id: 'solving',
                label:
                  '🧩 Solving the rescue problems',
              },
            ],
          },

          {
            id: 'challenge_response',
            type: 'single_choice',

            question:
              'When your idea did not work perfectly, what felt most like you?',

            options: [
              {
                id: 'try_again',
                label:
                  '🔄 I wanted to change something and try again',
              },
              {
                id: 'figure_out',
                label:
                  '🔎 I wanted to figure out what went wrong',
              },
              {
                id: 'ask_help',
                label:
                  '🤝 I wanted someone to help me think it through',
              },
              {
                id: 'move_on',
                label:
                  '➡️ I was ready to do something different',
              },
            ],
          },

          {
            id: 'do_again',
            type: 'single_choice',

            question:
              'Would you want to do another robot or engineering mission?',

            options: [
              {
                id: 'yes',
                label:
                  '🤩 Definitely',
              },
              {
                id: 'maybe',
                label:
                  '🙂 Maybe',
              },
              {
                id: 'different_kind',
                label:
                  '🧭 Maybe a different kind of challenge',
              },
              {
                id: 'no',
                label:
                  '👎 Probably not',
              },
            ],
          },
        ],
      },

      evidencePlan: {
        kidExperienceSources: [
          'challenge_responses',
          'reflection_responses',
          'kid_experience_prompts',
        ],

        systemEvidenceSources: [
          'stage_completion',
          'resource_completion',
          'activity_completion',
          'adventure_completion',
        ],

        parentObservationSources: [
          'post_adventure_parent_observation',
        ],

        note:
          'Phase 2A defines the evidence opportunities only. Phase 2C will map these interactions to canonical signals and evidence events.',
      },
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