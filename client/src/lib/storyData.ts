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
  color: string;
};

export type StoryPage = {
  text: string;
  image: string;
};

export const genres: Genre[] = [
  { id: 'animals', title: 'Animals', image: animalsImg, color: 'bg-orange-100' },
  { id: 'friends', title: 'Friends', image: friendsImg, color: 'bg-blue-100' },
  { id: 'adventure', title: 'Adventure', image: adventureImg, color: 'bg-emerald-100' },
];

export const stories = {
  'animals': {
    title: "The Brave Rabbit",
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
  }
};
