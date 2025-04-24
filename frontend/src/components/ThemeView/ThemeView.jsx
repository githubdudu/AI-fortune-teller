import styles from './ThemeView.module.css';
import ThemeCard from '../ThemeCard';

// TODO: this dummy themes should be replaced with AppContext's theme
const themes = [
  {
    id: 1,
    name: 'general',
    image: 'icons/general.png',
    description: 'Ask about your overall life direction or what’s coming next.',
  },
  {
    id: 2,
    name: 'love',
    image: 'icons/love.png',
    description:
      'Understand your love life, romantic interests, and emotional connections.',
  },
  {
    id: 3,
    name: 'finance',
    image: 'icons/finance.png',
    description: 'Gain insight into your financial future and money matters.',
  },
  {
    id: 4,
    name: 'career',
    image: 'icons/career.png',
    description: 'Uncover guidance on job prospects, promotions, or studies.',
  },
  {
    id: 5,
    name: 'relationships',
    image: 'icons/relationships.png',
    description: 'Understand connections with friends, family, or coworkers.',
  },
  {
    id: 6,
    name: 'health',
    image: 'icons/health.png',
    description: 'Reflect on your physical and emotional well-being.',
  },
  {
    id: 7,
    name: 'decisions',
    image: 'icons/decisions.png',
    description:
      'Seek clarity when facing difficult choices or uncertain paths.',
  },
  {
    id: 8,
    name: 'travel',
    image: 'icons/travel.png',
    description:
      'Explore outcomes related to moving, traveling, or new environments.',
  },
];

function ThemeView() {
  return (
    <div className={styles.container}>
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </div>
  );
}

export default ThemeView;
