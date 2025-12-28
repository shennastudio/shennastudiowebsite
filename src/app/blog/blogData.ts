export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  featured: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Protecting Sea Turtles: Our Partnership with Sea Turtle Inc.',
    slug: 'sea-turtle-inc-partnership',
    date: '2025-01-20',
    excerpt: 'Learn how ShennaStudio supports Sea Turtle Inc., a world-renowned sea turtle rescue and rehabilitation center in South Padre Island, Texas.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    category: 'Conservation',
    featured: true,
    content: `
      <h2>About Sea Turtle Inc.</h2>
      <p>Sea Turtle Inc. is a non-profit organization dedicated to the rescue, rehabilitation, and release of injured and endangered sea turtles. Located in South Padre Island, Texas, this incredible facility has been protecting sea turtles for over 45 years.</p>

      <h3>Our Impact Together</h3>
      <p>Through your bracelet purchases, ShennaStudio proudly donates 10% of every sale to support Sea Turtle Inc.'s vital conservation work. Your support helps fund:</p>
      <ul>
        <li>Emergency rescue operations for stranded and injured sea turtles</li>
        <li>Medical treatment and rehabilitation for sick turtles</li>
        <li>Educational programs teaching visitors about marine conservation</li>
        <li>Research initiatives to protect nesting sites along the Texas coast</li>
        <li>Release programs returning healthy turtles to the Gulf of Mexico</li>
      </ul>

      <h3>The Importance of Sea Turtles</h3>
      <p>Sea turtles are essential to healthy ocean ecosystems. They maintain seagrass beds, transport nutrients between ecosystems, and support biodiversity. However, all species of sea turtles found in Texas waters are threatened or endangered.</p>

      <h3>Kemp's Ridley Sea Turtles</h3>
      <p>The Kemp's Ridley is the smallest and most endangered sea turtle species in the world. South Padre Island is one of only two primary nesting locations for this critically endangered species. Each spring and summer, female Kemp's Ridleys return to the beaches where they were born to lay their eggs.</p>

      <h3>How You Can Help</h3>
      <p>Every ShennaStudio bracelet purchase directly supports sea turtle conservation. Additionally, you can:</p>
      <ul>
        <li>Visit Sea Turtle Inc. in South Padre Island</li>
        <li>Reduce plastic use to protect ocean habitats</li>
        <li>Support beach cleanup initiatives in the Rio Grande Valley</li>
        <li>Spread awareness about marine conservation</li>
      </ul>

      <p>Together, we're making a difference for these magnificent creatures and the oceans they call home.</p>
    `
  },
  {
    id: 2,
    title: 'Atlantic Bottlenose Dolphins of the Gulf Coast',
    slug: 'bottlenose-dolphins-gulf-coast',
    date: '2025-01-18',
    excerpt: 'Discover the playful Atlantic bottlenose dolphins that call the Gulf of Mexico home and the conservation efforts protecting their habitat.',
    image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=800&h=600&fit=crop',
    category: 'Wildlife',
    featured: true,
    content: `
      <h2>Dolphins of South Padre Island</h2>
      <p>The warm waters surrounding South Padre Island are home to resident populations of Atlantic bottlenose dolphins. These intelligent marine mammals are frequently spotted from the shore, delighting visitors and locals alike with their acrobatic displays.</p>

      <h3>Dolphin Behavior and Ecology</h3>
      <p>Bottlenose dolphins in the Gulf of Mexico typically travel in pods of 2-15 individuals, though larger groups of up to 100 have been observed. They use echolocation to navigate the murky coastal waters and hunt for fish, squid, and crustaceans.</p>

      <h3>Threats to Dolphin Populations</h3>
      <ul>
        <li><strong>Boat Strikes:</strong> Increased boat traffic in popular areas poses collision risks</li>
        <li><strong>Fishing Gear:</strong> Dolphins can become entangled in nets and lines</li>
        <li><strong>Water Pollution:</strong> Chemical runoff and oil spills harm their health</li>
        <li><strong>Habitat Loss:</strong> Coastal development reduces critical feeding areas</li>
        <li><strong>Climate Change:</strong> Warming waters affect prey distribution</li>
      </ul>

      <h3>Conservation Success Stories</h3>
      <p>Thanks to the Marine Mammal Protection Act and local conservation efforts, Gulf Coast dolphin populations remain stable. Organizations in the Rio Grande Valley conduct regular health assessments and photo-identification studies to monitor individual dolphins.</p>

      <h3>Responsible Dolphin Watching</h3>
      <p>When observing dolphins in their natural habitat:</p>
      <ul>
        <li>Maintain a distance of at least 50 yards</li>
        <li>Never feed wild dolphins</li>
        <li>Reduce boat speed in areas where dolphins are present</li>
        <li>Report injured or stranded dolphins to local authorities</li>
        <li>Keep beaches clean to protect their feeding grounds</li>
      </ul>

      <p>Your support through ShennaStudio helps fund marine mammal research and protection programs in the Gulf of Mexico.</p>
    `
  }
];
