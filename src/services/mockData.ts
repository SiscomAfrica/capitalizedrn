import { Investment, Event, Session, Speaker, Transaction } from '../types';

export const mockInvestments: Investment[] = [
  {
    id: '1',
    title: 'AI-POWERED HEALTHCARE STARTUP',
    description:
      'Revolutionary AI diagnostic platform transforming early disease detection with cutting-edge machine learning technology.',
    category: 'Technology',
    riskLevel: 'HIGH',
    minInvestment: 25000,
    expectedReturn: 300.0,
    interested: 0,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    status: 'active',
  },
  {
    id: '2',
    title: 'RENEWABLE ENERGY INFRASTRUCTURE',
    description:
      'Large-scale solar farm project providing clean energy to 50,000 homes annually.',
    category: 'Energy',
    riskLevel: 'MEDIUM',
    minInvestment: 50000,
    expectedReturn: 150.0,
    interested: 23,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    status: 'active',
  },
  {
    id: '3',
    title: 'FINTECH PAYMENT PLATFORM',
    description:
      'Mobile payment solution targeting emerging markets with blockchain integration.',
    category: 'FinTech',
    riskLevel: 'HIGH',
    minInvestment: 15000,
    expectedReturn: 400.0,
    interested: 45,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    status: 'active',
  },
  {
    id: '4',
    title: 'SUSTAINABLE AGRICULTURE FUND',
    description:
      'Investment in organic farming cooperatives across East Africa.',
    category: 'Agriculture',
    riskLevel: 'LOW',
    minInvestment: 10000,
    expectedReturn: 80.0,
    interested: 67,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    status: 'active',
  },
];

export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'AI & Access: How Small Businesses Can Leverage AI for Growth and Fu...',
    speaker: 'Elizabeth Gore',
    time: '9:30 PM to 10:30 PM',
    date: 'October 30th, 2025',
    tags: ['AI', 'All Access', 'Executive', 'Premier'],
  },
  {
    id: '2',
    title: 'Blockchain in African Markets: Opportunities and Challenges',
    speaker: 'Dr. James Mwangi',
    time: '11:00 AM to 12:00 PM',
    date: 'October 30th, 2025',
    tags: ['Blockchain', 'FinTech', 'Premier'],
  },
  {
    id: '3',
    title: 'Raising Capital: From Seed to Series A',
    speaker: 'Sarah Johnson',
    time: '2:00 PM to 3:30 PM',
    date: 'October 30th, 2025',
    tags: ['Funding', 'Startup', 'All Access'],
  },
];

export const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Elizabeth Gore',
    title: 'Co-Founder & President',
    company: 'Hello Alice',
    bio: 'Elizabeth Gore is a renowned entrepreneur and business leader with over 20 years of experience in scaling businesses and supporting entrepreneurs.',
    image: '',
  },
  {
    id: '2',
    name: 'Dr. James Mwangi',
    title: 'Chief Technology Officer',
    company: 'TechAfrica Ventures',
    bio: 'Dr. Mwangi is a leading expert in blockchain technology and digital transformation in emerging markets.',
    image: '',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    title: 'Managing Partner',
    company: 'Impact Ventures',
    bio: 'Sarah has helped raise over $500M for African startups and is a leading voice in impact investing.',
    image: '',
  },
];

export const mockEvent: Event = {
  id: '1',
  title: 'AfroTech Conference 2025',
  description:
    'AfroTech Conference returns to Houston, TX, with a future-forward experience designed to fuel growth at every career stage...',
  location: 'Houston, TX',
  date: 'October 30th, 2025',
  time: '9:00 AM - 6:00 PM',
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  sessions: mockSessions,
  speakers: mockSpeakers,
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'investment',
    amount: 25000,
    currency: 'USD',
    status: 'completed',
    date: new Date('2025-10-15'),
    description: 'Investment in AI Healthcare Startup',
    investmentId: '1',
  },
  {
    id: '2',
    type: 'return',
    amount: 5000,
    currency: 'USD',
    status: 'completed',
    date: new Date('2025-10-01'),
    description: 'Quarterly returns from Renewable Energy Fund',
  },
  {
    id: '3',
    type: 'investment',
    amount: 15000,
    currency: 'USD',
    status: 'pending',
    date: new Date('2025-11-10'),
    description: 'Investment in FinTech Payment Platform',
    investmentId: '3',
  },
];

