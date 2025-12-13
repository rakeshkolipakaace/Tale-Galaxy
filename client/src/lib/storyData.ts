import animalsImg from '@assets/generated_images/animals_genre_cover_art.png';
import friendsImg from '@assets/generated_images/friends_genre_cover_art.png';
import adventureImg from '@assets/generated_images/adventure_genre_cover_art.png';

import page1Img from '@assets/generated_images/story_page_1_rabbit.png';
import page2Img from '@assets/generated_images/story_page_2_wolf.png';
import page3Img from '@assets/generated_images/story_page_3_celebration.png';

export type Genre = {
  id: string;
  title: string;
  image: string;
  description: string;
  color: string;
};

export type StoryPage = {
  text: string;
  image: string;
};

export type Story = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  ageGroup: string;
  pages: StoryPage[];
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export const genres: Genre[] = [
  { 
    id: 'animals', 
    title: 'Animals', 
    image: animalsImg, 
    description: 'Tales from the forest friends',
    color: 'from-blue-100 to-blue-50' 
  },
  { 
    id: 'friends', 
    title: 'Friends', 
    image: friendsImg, 
    description: 'Stories about kindness and play',
    color: 'from-sky-100 to-sky-50' 
  },
  { 
    id: 'adventure', 
    title: 'Adventure', 
    image: adventureImg, 
    description: 'Exciting journeys and quests',
    color: 'from-cyan-100 to-cyan-50' 
  },
];

export const ageGroups = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

const simpleStoryTemplates = {
  animals: [
    {
      title: "The Brave Rabbit",
      description: "A little rabbit learns about courage",
      pages: [
        {
          text: "Once upon a time, there lived a little rabbit named Barnaby. Barnaby was small, but he had a very big heart. He loved to explore the tall grass and smell the flowers.",
          image: page1Img
        },
        {
          text: "One day, Barnaby saw a big wolf! The wolf looked scary. But Barnaby was brave. He thumped his foot loudly. Thump! Thump!",
          image: page2Img
        },
        {
          text: "The wolf was surprised by the loud noise. It turned and ran away. Barnaby's friends came out to celebrate. What a brave rabbit!",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What was the rabbit's name?",
          options: ["Billy", "Barnaby", "Bobby", "Benny"],
          correctAnswer: 1
        },
        {
          question: "What did Barnaby do when he saw the wolf?",
          options: ["He ran away", "He hid", "He thumped his foot", "He cried"],
          correctAnswer: 2
        },
        {
          question: "How did the story end?",
          options: ["The wolf caught Barnaby", "Barnaby ran home", "Friends celebrated his bravery", "Barnaby got lost"],
          correctAnswer: 2
        }
      ]
    },
    {
      title: "The Curious Fox",
      description: "A young fox explores the meadow",
      pages: [
        {
          text: "Felix the fox loved to explore. Every day he would visit new places in the meadow. Today he found a beautiful stream.",
          image: page1Img
        },
        {
          text: "By the stream, Felix met a wise old turtle. The turtle taught him about the fish that swim and the frogs that jump.",
          image: page2Img
        },
        {
          text: "Felix learned so much that day. He ran home to tell his family all about his new friend and the wonderful stream.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What is the fox's name?",
          options: ["Felix", "Max", "Sam", "Oscar"],
          correctAnswer: 0
        },
        {
          question: "Who did Felix meet?",
          options: ["A rabbit", "A turtle", "A bird", "A deer"],
          correctAnswer: 1
        },
        {
          question: "What did Felix find?",
          options: ["A cave", "A tree", "A stream", "A hill"],
          correctAnswer: 2
        }
      ]
    }
  ],
  friends: [
    {
      title: "Sharing is Caring",
      description: "Two friends learn to share their toys",
      pages: [
        {
          text: "Lucy and Tom were best friends. They loved to play together. One day, they both wanted to play with the same red ball.",
          image: page1Img
        },
        {
          text: "At first, they were upset. But then Lucy had an idea. 'Let's take turns!' she said. Tom smiled and agreed.",
          image: page2Img
        },
        {
          text: "They took turns playing with the ball. They had so much fun together. Sharing made their friendship even stronger!",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "Who are the two friends?",
          options: ["Lucy and Tom", "Sam and Tim", "Max and Emma", "Ben and Sarah"],
          correctAnswer: 0
        },
        {
          question: "What did they want to play with?",
          options: ["A doll", "A red ball", "A book", "A puzzle"],
          correctAnswer: 1
        },
        {
          question: "How did they solve the problem?",
          options: ["They fought", "They took turns", "They found another ball", "They went home"],
          correctAnswer: 1
        }
      ]
    }
  ],
  adventure: [
    {
      title: "The Magic Garden",
      description: "A child discovers a secret garden",
      pages: [
        {
          text: "Emma found a hidden door in her backyard. Behind it was a magical garden full of colorful flowers and singing birds.",
          image: page1Img
        },
        {
          text: "In the garden, she met a friendly butterfly who showed her the way to a beautiful waterfall that sparkled in the sunlight.",
          image: page2Img
        },
        {
          text: "Emma visited the magic garden every day. It became her special place where anything was possible.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What did Emma find?",
          options: ["A magic garden", "A treasure", "A puppy", "A castle"],
          correctAnswer: 0
        },
        {
          question: "Who helped Emma in the garden?",
          options: ["A bird", "A butterfly", "A rabbit", "A fairy"],
          correctAnswer: 1
        },
        {
          question: "How often did Emma visit?",
          options: ["Once", "Never again", "Every day", "Every week"],
          correctAnswer: 2
        }
      ]
    }
  ]
};

const mediumStoryTemplates = {
  animals: [
    {
      title: "The Clever Rabbit",
      description: "A rabbit outsmarts a hungry wolf",
      pages: [
        {
          text: "In a dense forest, there lived an intelligent rabbit named Barnaby. Though small in size, Barnaby possessed tremendous courage and quick thinking abilities.",
          image: page1Img
        },
        {
          text: "One afternoon, while gathering berries, Barnaby encountered a menacing wolf. Instead of panicking, he remembered his grandmother's wisdom about facing fears with cleverness.",
          image: page2Img
        },
        {
          text: "Using his powerful hind legs, Barnaby created thunderous thumping sounds. The unexpected noise startled the wolf, who retreated. Barnaby's friends celebrated his remarkable bravery.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What quality helped Barnaby the most?",
          options: ["His size", "His quick thinking", "His speed", "His strength"],
          correctAnswer: 1
        },
        {
          question: "Where was Barnaby when he met the wolf?",
          options: ["At home", "Gathering berries", "Swimming", "Sleeping"],
          correctAnswer: 1
        },
        {
          question: "What did Barnaby remember?",
          options: ["A song", "His grandmother's wisdom", "A game", "A friend"],
          correctAnswer: 1
        }
      ]
    }
  ],
  friends: [
    {
      title: "The Power of Cooperation",
      description: "Friends work together to solve a problem",
      pages: [
        {
          text: "Lucy and Tom discovered they both wanted to use the same bright red ball during recess. Initially, this created tension between the usually inseparable friends.",
          image: page1Img
        },
        {
          text: "Lucy proposed an innovative solution: they could alternate turns and even invent games that required cooperation rather than competition.",
          image: page2Img
        },
        {
          text: "Their collaborative approach not only resolved the conflict but also strengthened their friendship. They learned that working together creates more opportunities for enjoyment.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What caused the initial problem?",
          options: ["Bad weather", "Both wanted the same ball", "They were tired", "School was boring"],
          correctAnswer: 1
        },
        {
          question: "Who suggested the solution?",
          options: ["Tom", "Lucy", "A teacher", "Another friend"],
          correctAnswer: 1
        },
        {
          question: "What did they learn?",
          options: ["To avoid each other", "Cooperation creates opportunities", "Balls are fun", "Recess is short"],
          correctAnswer: 1
        }
      ]
    }
  ],
  adventure: [
    {
      title: "The Enchanted Garden",
      description: "Discovering a magical world",
      pages: [
        {
          text: "Emma stumbled upon a concealed doorway in her backyard. Beyond it lay an extraordinary garden filled with luminescent flowers and melodious birds.",
          image: page1Img
        },
        {
          text: "A magnificent butterfly with iridescent wings became her guide, leading her through winding paths to a magnificent waterfall that shimmered with rainbow colors.",
          image: page2Img
        },
        {
          text: "The enchanted garden became Emma's sanctuary, a place where imagination flourished and adventures awaited each visit.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "How did Emma find the garden?",
          options: ["Someone told her", "She stumbled upon a hidden door", "She dreamed it", "She followed a map"],
          correctAnswer: 1
        },
        {
          question: "What guided Emma through the garden?",
          options: ["A map", "A butterfly", "Signs", "Her instinct"],
          correctAnswer: 1
        },
        {
          question: "What made the garden special?",
          options: ["It was big", "It had vegetables", "Imagination flourished there", "It had a fence"],
          correctAnswer: 2
        }
      ]
    }
  ]
};

const complexStoryTemplates = {
  animals: [
    {
      title: "The Courageous Rabbit",
      description: "Bravery comes from within, not from size",
      pages: [
        {
          text: "In the verdant expanse of an ancient forest, resided an exceptionally astute rabbit named Barnaby. Despite his diminutive stature, Barnaby possessed extraordinary valor and remarkable analytical capabilities.",
          image: page1Img
        },
        {
          text: "During an autumn afternoon excursion, Barnaby encountered a formidable wolf. Rather than succumbing to trepidation, he recalled his grandmother's philosophical teachings regarding courage and strategic thinking.",
          image: page2Img
        },
        {
          text: "Employing his muscular hind limbs, Barnaby generated resonant percussive vibrations. The unanticipated cacophony disconcerted the predator, prompting its hasty departure. Barnaby's companions commemorated his exceptional fortitude.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What does 'diminutive stature' mean?",
          options: ["Large size", "Small size", "Medium height", "Tall frame"],
          correctAnswer: 1
        },
        {
          question: "What philosophical concept did Barnaby demonstrate?",
          options: ["Size determines courage", "Courage comes from within", "Fear is natural", "Animals can't think"],
          correctAnswer: 1
        },
        {
          question: "What literary device is used in 'resonant percussive vibrations'?",
          options: ["Simple description", "Metaphor", "Complex descriptive language", "Rhyme"],
          correctAnswer: 2
        }
      ]
    }
  ],
  friends: [
    {
      title: "Collaborative Problem-Solving",
      description: "The art of negotiation and compromise",
      pages: [
        {
          text: "Lucy and Tom, whose friendship exemplified mutual respect, confronted an unprecedented dilemma when they simultaneously desired access to an identical recreational object during their intermission period.",
          image: page1Img
        },
        {
          text: "Lucy demonstrated diplomatic acumen by proposing an equitable arrangement involving temporal rotation and collaborative recreational activities that emphasized teamwork over individualistic competition.",
          image: page2Img
        },
        {
          text: "Their implementation of cooperative strategies not only ameliorated the immediate conflict but also fortified their interpersonal bond, illustrating that synergistic approaches yield superior outcomes.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What does 'diplomatic acumen' mean?",
          options: ["Being loud", "Skill in handling difficult situations", "Being quiet", "Avoiding problems"],
          correctAnswer: 1
        },
        {
          question: "What principle did Lucy and Tom demonstrate?",
          options: ["Competition is good", "Cooperation yields better results", "Sharing is impossible", "Conflicts can't be solved"],
          correctAnswer: 1
        },
        {
          question: "What does 'synergistic approaches' refer to?",
          options: ["Working alone", "Working together for better outcomes", "Giving up", "Fighting"],
          correctAnswer: 1
        }
      ]
    }
  ],
  adventure: [
    {
      title: "The Mystical Sanctuary",
      description: "Exploring realms beyond imagination",
      pages: [
        {
          text: "Emma inadvertently discovered an inconspicuous portal within her residential perimeter. Beyond this threshold existed an ethereal botanical sanctuary adorned with phosphorescent flora and avian creatures producing harmonious melodies.",
          image: page1Img
        },
        {
          text: "An extraordinary lepidopteran specimen, exhibiting prismatic wing coloration, assumed the role of navigator, conducting her through labyrinthine passages toward a magnificent cascade that refracted solar radiation into chromatic spectrums.",
          image: page2Img
        },
        {
          text: "This transcendent garden evolved into Emma's refuge, an environment where creativity proliferated and extraordinary experiences materialized with each successive visitation.",
          image: page3Img
        }
      ],
      quiz: [
        {
          question: "What is a 'lepidopteran specimen'?",
          options: ["A bird", "A butterfly", "A flower", "A fish"],
          correctAnswer: 1
        },
        {
          question: "What does 'phosphorescent flora' mean?",
          options: ["Dead plants", "Glowing plants", "Green plants", "Dry plants"],
          correctAnswer: 1
        },
        {
          question: "What literary technique is 'chromatic spectrums'?",
          options: ["Simple words", "Scientific/technical vocabulary", "Slang", "Baby talk"],
          correctAnswer: 1
        }
      ]
    }
  ]
};

// Generate 10 stories for each genre and age group
const generateStories = (genreId: 'animals' | 'friends' | 'adventure'): Story[] => {
  const stories: Story[] = [];
  
  ageGroups.forEach((ageGroup, ageIndex) => {
    let templates: Array<{
      title: string;
      description: string;
      pages: Array<{ text: string; image: string }>;
      quiz: QuizQuestion[];
    }>;
    
    if (ageGroup.value === '3-5') {
      templates = simpleStoryTemplates[genreId] || simpleStoryTemplates.animals;
    } else if (ageGroup.value === '6-8') {
      templates = mediumStoryTemplates[genreId] || mediumStoryTemplates.animals;
    } else {
      templates = complexStoryTemplates[genreId] || complexStoryTemplates.animals;
    }
    
    templates.forEach((template: any, index: number) => {
      const storyNumber = (ageIndex * templates.length) + index + 1;
      stories.push({
        id: `${genreId}-${ageGroup.value}-${index + 1}`,
        title: template.title,
        author: "StoryTime Collection",
        coverImage: template.pages[0].image,
        description: template.description,
        ageGroup: ageGroup.value,
        pages: template.pages,
        quiz: template.quiz
      });
    });
  });
  
  // Fill up to 10 stories if needed
  while (stories.length < 10) {
    const baseIndex = stories.length % 2;
    const template = simpleStoryTemplates[genreId]?.[baseIndex] || simpleStoryTemplates.animals[0];
    stories.push({
      id: `${genreId}-extra-${stories.length + 1}`,
      title: `${template.title} ${stories.length + 1}`,
      author: "StoryTime Collection",
      coverImage: template.pages[0].image,
      description: template.description,
      ageGroup: '3-5',
      pages: template.pages,
      quiz: template.quiz
    });
  }
  
  return stories.slice(0, 10);
};

export const stories: Record<string, Story[]> = {
  'animals': generateStories('animals'),
  'friends': generateStories('friends'),
  'adventure': generateStories('adventure'),
};
