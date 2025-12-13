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
  pages: StoryPage[];
};

export const genres: Genre[] = [
  { 
    id: 'animals', 
    title: 'Animals', 
    image: animalsImg, 
    description: 'Tales from the forest friends',
    color: 'from-orange-100 to-amber-50' 
  },
  { 
    id: 'friends', 
    title: 'Friends', 
    image: friendsImg, 
    description: 'Stories about kindness and play',
    color: 'from-blue-100 to-cyan-50' 
  },
  { 
    id: 'adventure', 
    title: 'Adventure', 
    image: adventureImg, 
    description: 'Exciting journeys and quests',
    color: 'from-emerald-100 to-teal-50' 
  },
];

const rabbitStory: Story = {
  id: 'brave-rabbit',
  title: "The Brave Rabbit",
  author: "Beatrix Potter",
  coverImage: page1Img,
  description: "A little rabbit learns that being small doesn't mean you can't be brave.",
  pages: [
    {
      text: "Once upon a time, in a sunny forest, there lived a little rabbit named Barnaby. Barnaby was small, but he had a very big heart. He loved to explore the tall grass and smell the wildflowers.",
      image: page1Img
    },
    {
      text: "One day, while hopping near the edge of the woods, he saw a shadow. It was a wolf! The wolf looked scary, but Barnaby stood his ground. He remembered his mother said, 'Bravery is not being unafraid, it is being scared and doing it anyway.'",
      image: page2Img
    },
    {
      text: "Barnaby thumped his foot loudly! Thump! Thump! The wolf was surprised by such a loud noise from such a small bunny. It turned and ran away. Barnaby laughed and his friends came out to celebrate his bravery.",
      image: page3Img
    }
  ]
};

// Generate 10 mock stories for each genre
const generateStories = (genreId: string): Story[] => {
  return Array.from({ length: 10 }).map((_, i) => ({
    ...rabbitStory,
    id: `${genreId}-story-${i + 1}`,
    title: i === 0 && genreId === 'animals' ? "The Brave Rabbit" : `${genreId.charAt(0).toUpperCase() + genreId.slice(1)} Story ${i + 1}`,
    description: `An exciting ${genreId} story about adventure and fun number ${i + 1}.`,
    coverImage: i % 3 === 0 ? page1Img : i % 3 === 1 ? page2Img : page3Img
  }));
};

export const stories: Record<string, Story[]> = {
  'animals': generateStories('animals'),
  'friends': generateStories('friends'),
  'adventure': generateStories('adventure'),
};
