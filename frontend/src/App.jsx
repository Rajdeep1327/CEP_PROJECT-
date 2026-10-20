import { useState, useMemo, useRef } from 'react'
import {
  Search,
  MapPin,
  Home,
  Utensils,
  Bus,
  ShieldCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Filter,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Compass,
  Check,
  RotateCcw,
  Info,
  Navigation,
  Send,
  Building,
  CheckCheck
} from 'lucide-react'
import './App.css'

// Backend endpoint for the feedback form (FastAPI running locally)
const FEEDBACK_API_URL = 'http://127.0.0.1:8000/api/feedback'

// Supported Pune Neighbourhoods
const PUNE_AREAS = [
  { id: 'All', name: 'All Areas', tagline: 'Across Greater Pune' },
  { id: 'Shivajinagar', name: 'Shivajinagar', tagline: 'COEP & Transit Hub' },
  { id: 'Swargate', name: 'Swargate', tagline: 'BRTS & Central Terminus' },
  { id: 'Deccan', name: 'Deccan', tagline: 'FC Road & BMCC Hub' },
  { id: 'Kothrud', name: 'Kothrud', tagline: 'MIT WPU & Ideal Colony' },
  { id: 'Karve Nagar', name: 'Karve Nagar', tagline: 'Cummins College Area' },
  { id: 'Viman Nagar', name: 'Viman Nagar', tagline: 'Symbiosis Campus Hub' },
  { id: 'Hinjawadi', name: 'Hinjawadi', tagline: 'Tech Parks & Student Interns' },
  { id: 'Wakad', name: 'Wakad', tagline: 'Shared Flats & Student Living' },
  { id: 'Hadapsar', name: 'Hadapsar', tagline: 'Magarpatta & Eastern Hub' }
]

// The 3 Signature Hero Service Cards
const ESSENTIAL_SERVICES = [
  {
    id: 'Stay',
    label: 'STAY',
    heading: 'Find your place',
    description: "Hostels and PGs around Pune's college hubs.",
    action: 'Explore stays →',
    icon: Home,
    image: '/assets/stay_pune.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    categoryTarget: 'Stay'
  },
  {
    id: 'Food',
    label: 'FOOD',
    heading: 'Eat well for less',
    description: 'Everyday meals that work with a student budget.',
    action: 'Explore food →',
    icon: Utensils,
    image: '/assets/food_pune.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=900&q=80',
    categoryTarget: 'Food'
  },
  {
    id: 'Transport',
    label: 'GETTING AROUND',
    heading: 'Pune, one bus ride away',
    description: 'Discover bus stops and explore public transport information.',
    action: 'Explore PMPML →',
    icon: Bus,
    image: '/assets/pmpml_bus.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80',
    categoryTarget: 'Transport'
  }
]

// Verified PMPML Corridor Transit Data (Authentic Pune routes)
const PMPML_CORRIDORS = [
  {
    id: 'swargate-shivajinagar',
    origin: 'Swargate',
    destination: 'Shivajinagar',
    routeNumber: 'Route 24 & Route 2',
    name: 'Swargate ↔ Shivajinagar Express',
    frequency: 'Every 5 - 8 mins',
    timing: '05:30 AM – 11:15 PM',
    type: 'Regular & Electric PMPML',
    keyStops: ['Swargate', 'SP College', 'Alka Talkies', 'Deccan Gymkhana', 'FC Road', 'Shivajinagar'],
    passValid: 'PMPML Student Pass Valid',
    verified: true
  },
  {
    id: 'kothrud-station',
    origin: 'Kothrud',
    destination: 'Shivajinagar',
    routeNumber: 'Route 100 & Route 103',
    name: 'Kothrud Stand ↔ Shivajinagar / Pune Station',
    frequency: 'Every 8 - 10 mins',
    timing: '06:00 AM – 10:45 PM',
    type: 'CNG & Electric Green Bus',
    keyStops: ['Kothrud Stand', 'Paud Phata', 'Nal Stop', 'Deccan', 'Modern College', 'Shivajinagar'],
    passValid: 'PMPML Student Pass Valid',
    verified: true
  },
  {
    id: 'hinjawadi-deccan',
    origin: 'Hinjawadi',
    destination: 'Deccan',
    routeNumber: 'Route 100 / 115P',
    name: 'Hinjawadi Phase 3 ↔ Deccan Gymkhana',
    frequency: 'Every 12 - 15 mins',
    timing: '06:30 AM – 10:30 PM',
    type: 'AC & Non-AC Suburban Express',
    keyStops: ['Hinjawadi Phase 3', 'Phase 1 Infosys', 'Wakad Bridge', 'University Circle', 'Deccan'],
    passValid: 'Student Concession Eligible',
    verified: true
  },
  {
    id: 'viman-nagar-swargate',
    origin: 'Viman Nagar',
    destination: 'Swargate',
    routeNumber: 'Route 158',
    name: 'Viman Nagar (Symbiosis) ↔ Swargate',
    frequency: 'Every 15 mins',
    timing: '06:15 AM – 10:00 PM',
    type: 'Regular PMPML Transit',
    keyStops: ['Datta Mandir Viman Nagar', 'Yerawada', 'Ruby Hall', 'Pune Station', 'Swargate'],
    passValid: 'PMPML Student Pass Valid',
    verified: true
  },
  {
    id: 'hadapsar-swargate',
    origin: 'Hadapsar',
    destination: 'Swargate',
    routeNumber: 'Route 165',
    name: 'Hadapsar Gadital ↔ Swargate BRTS',
    frequency: 'Every 6 - 8 mins',
    timing: '05:45 AM – 11:30 PM',
    type: 'BRTS Dedicated Corridor',
    keyStops: ['Gadital Hadapsar', 'Vaibhav Theater', 'Fatima Nagar', 'Pulgate', 'Swargate'],
    passValid: 'PMPML Student Pass Valid',
    verified: true
  }
]

// Curated Pune Student Listings
const PUNE_LISTINGS = [
  // DECCAN
  {
    id: 'p-stay-deccan-1',
    area: 'Deccan',
    category: 'Stay',
    title: 'Deccan Youth Hostel & PG',
    locality: 'FC Road, Shivaji Nagar, Deccan',
    price: '₹6,200/mo',
    priceNote: 'Includes morning tea & Maharashtrian dinner',
    description: 'Walkable distance from Fergusson College and BMCC. Well-ventilated rooms with study tables, lockers, and high-speed fiber internet.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',

    tags: ['Near FC Road', 'WiFi Included', 'Dinner Included', 'Lockers']
  },
  {
    id: 'p-food-deccan-1',
    area: 'Deccan',
    category: 'Food',
    title: 'Janata Bhojanalaya & Khanawal',
    locality: 'Opposite FC Main Gate, Deccan',
    price: '₹70 / thali',
    priceNote: '₹2,400 monthly 2-time mess pass',
    description: 'Wholesome student thali with fresh chapatis, usal/sabzi, dal tadka, steamed rice, and roasted papad. Authentic home-cooked taste.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',

    tags: ['Unlimited Rotis', 'Student Thali', 'Fast Service', 'Pure Veg']
  },
  {
    id: 'p-food-deccan-2',
    area: 'Deccan',
    category: 'Food',
    title: 'Wadeshwar & Cafe Goodluck Student Corner',
    locality: 'FC Road & Deccan Gymkhana',
    price: '₹40 - ₹85',
    priceNote: 'Budget breakfast & evening bites',
    description: 'Iconic spot for student debates. Crisp butter benne dosas, filter coffee, bun maska, and piping hot poha.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',

    tags: ['Iconic Student Spot', 'Fast Breakfast', 'Late Evening']
  },
  {
    id: 'p-trans-deccan-1',
    area: 'Deccan',
    category: 'Transport',
    title: 'Deccan Gymkhana PMPML Bus Interchange',
    locality: 'Junction connecting FC Road, Karve Road & Swargate',
    price: '₹10 - ₹25',
    priceNote: 'PMPML student pass valid',
    description: 'Key junction for cross-city PMPML buses. Direct routes toward Kothrud Depot, Swargate, and Pune Station every 5 minutes.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',
    tags: ['Transit Hub', 'Every 5 mins', 'Student Pass Valid']
  },

  // KOTHRUD
  {
    id: 'p-stay-kothrud-1',
    area: 'Kothrud',
    category: 'Stay',
    title: 'MIT Campus Haven Girls & Boys PG',
    locality: 'Paud Road, Kothrud (400m from MIT WPU)',
    price: '₹7,200/mo',
    priceNote: 'Double sharing with attached balcony',
    description: 'Strict security with CCTV, silent study hall, proximity to campus libraries, and clean water purifiers on all floors.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',

    tags: ['Near MIT WPU', 'Study Hall', 'Safe Locality', 'Balcony']
  },
  {
    id: 'p-food-kothrud-1',
    area: 'Kothrud',
    category: 'Food',
    title: 'Maratha Khanawal & Student Mess',
    locality: 'Ideal Colony, Near Vanaz Metro, Kothrud',
    price: '₹75 / meal',
    priceNote: 'Full lunch & dinner with curd',
    description: 'Affordable authentic Maharashtrian bhojan. Pitla bhakri special every Wednesday, fresh jowar rotis, and unlimited dal.',

    verified: false,
    verificationLabel: 'Community Submission — Unverified',
    lastUpdated: 'Last updated: Not confirmed',

    tags: ['Pithla Bhakri', 'Unlimited Dal', 'Student Discount']
  },
  {
    id: 'p-trans-kothrud-1',
    area: 'Kothrud',
    category: 'Transport',
    title: 'PMPML Route 100 (Kothrud Stand ↔ Pune Station)',
    locality: 'Paud Road Corridor',
    price: '₹15 - ₹25',
    priceNote: 'Pass valid on non-AC buses',
    description: 'Essential student lifeline linking Kothrud college hostels to Deccan and Pune Central Railway Station. High peak frequency.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 3 days ago',
    tags: ['Direct College Link', 'High Frequency', 'Pass Valid']
  },

  // SHIVAJINAGAR
  {
    id: 'p-stay-shivajinagar-1',
    area: 'Shivajinagar',
    category: 'Stay',
    title: 'COEP Edge Shared Student Apartment',
    locality: 'Near Sancheti Hospital & COEP, Shivajinagar',
    price: '₹5,800/mo',
    priceNote: '3-sharing room, water & electricity included',
    description: 'Student-managed shared flat. Looking for 1 responsible student flatmate. Fully set up kitchen and dedicated study tables.',
    verified: false,
    verificationLabel: 'Student Submitted',
    lastUpdated: 'Updated 3 days ago',
    tags: ['Near COEP', 'Low Deposit', 'Study Tables', 'Walk to Metro']
  },
  {
    id: 'p-food-shivajinagar-1',
    area: 'Shivajinagar',
    category: 'Food',
    title: 'Aabaachi Upahar Gruha Student Mess',
    locality: 'Near Shivajinagar Station, Shivajinagar',
    price: '₹65 / thali',
    priceNote: 'Monthly student coupon available',
    description: 'Clean dining hall offering 3 piping hot chapatis, 2 vegetables, dal, rice, and pickle. High turnaround and hygienic cooking.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['Station Area', 'Fast Service', 'Coupons Available']
  },
  {
    id: 'p-trans-shivajinagar-1',
    area: 'Shivajinagar',
    category: 'Transport',
    title: 'Shivajinagar Bus & Pune Metro Interchange',
    locality: 'Shivajinagar Central Terminal',
    price: '₹10 - ₹35',
    priceNote: 'PMPML + Pune Metro Line 1 interchange',
    description: 'Major multi-modal transit hub. Easily switch between local PMPML suburban buses and underground Pune Metro toward Civil Court/Swargate.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 1 day ago',
    tags: ['Metro + Bus Hub', 'City Lifeline', 'Underground Station']
  },

  // SWARGATE
  {
    id: 'p-stay-swargate-1',
    area: 'Swargate',
    category: 'Stay',
    title: 'Swargate Central Student Lodge & PG',
    locality: 'Near Sarasbaug & Tilak Road, Swargate',
    price: '₹5,400/mo',
    priceNote: 'Budget friendly with hot water & WiFi',
    description: 'Centrally situated lodge with student rooms. Easy walking access to SP College and Tilak Road coaching institutes.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 5 days ago',
    tags: ['Budget Friendly', 'Near SP College', 'WiFi Included']
  },
  {
    id: 'p-food-swargate-1',
    area: 'Swargate',
    category: 'Food',
    title: 'Sarasbaug Poli Bhaji Kendra',
    locality: 'Swargate Chowk, Near Sarasbaug',
    price: '₹55 - ₹75',
    priceNote: 'Pocket-friendly packed parcels & dining',
    description: 'Homely Maharashtrian tiffin counter offering wholesome chapatis, pithla, usal, and seasonal vegetables for students living without kitchens.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated yesterday',
    tags: ['Tiffin Parcels', 'Homely Food', 'Budget King']
  },
  {
    id: 'p-trans-swargate-1',
    area: 'Swargate',
    category: 'Transport',
    title: 'Swargate PMPML BRTS Terminal Hub',
    locality: 'Swargate Central Chowk',
    price: '₹10 - ₹30',
    priceNote: 'Student pass counters located here',
    description: 'The heartbeat of Pune public bus transit. Terminus for Katraj BRTS corridor, Hadapsar, and cross-city electric feeder buses.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['BRTS Terminus', 'Pass Office', 'All Directions']
  },

  // VIMAN NAGAR
  {
    id: 'p-stay-viman-1',
    area: 'Viman Nagar',
    category: 'Stay',
    title: 'Symbiosis Scholar PG & Residency',
    locality: 'Dutta Mandir Road, Viman Nagar',
    price: '₹8,500/mo',
    priceNote: 'Twin sharing with AC & housekeeping',
    description: 'Modern student living 5 minutes walk from Symbiosis Law and Design campuses. In-house laundry machines and high-speed fiber WiFi.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 3 days ago',
    tags: ['Near Symbiosis', 'AC Available', 'Housekeeping Included']
  },
  {
    id: 'p-food-viman-1',
    area: 'Viman Nagar',
    category: 'Food',
    title: 'Shree Ganesh Student Mess & Thali',
    locality: 'Near Ganpati Chowk, Viman Nagar',
    price: '₹80 / meal',
    priceNote: 'North & South Indian options',
    description: 'Clean dining hall popular among Symbiosis students. Features rotation menus, curd, unlimited rice, and hygienic salads.',
    verified: false,
    verificationLabel: 'Student Submitted',
    lastUpdated: 'Updated 4 days ago',
    tags: ['Symbiosis Hub', 'North & South', 'Hygienic']
  },
  {
    id: 'p-trans-viman-1',
    area: 'Viman Nagar',
    category: 'Transport',
    title: 'PMPML Route 158 (Viman Nagar ↔ Pune Station)',
    locality: 'Symbiosis Gate to Central Station',
    price: '₹15 - ₹25',
    priceNote: 'Buses every 15 minutes',
    description: 'Connects eastern student college pockets to Pune Central Station via Yerawada and Bund Garden.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['Airport Corridor', 'Regular Transit', 'Pass Valid']
  },

  // HINJAWADI
  {
    id: 'p-stay-hinjawadi-1',
    area: 'Hinjawadi',
    category: 'Stay',
    title: 'Hinjawadi Phase 1 Tech & Student PG',
    locality: 'Near Infosys Circle, Hinjawadi Phase 1',
    price: '₹6,500/mo',
    priceNote: 'Includes breakfast & daily cleaning',
    description: 'Ideal for university interns and diploma students doing tech projects. 24/7 power backup, biometric entry, and bus stop right outside.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['Phase 1', 'Intern Friendly', 'Power Backup']
  },
  {
    id: 'p-food-hinjawadi-1',
    area: 'Hinjawadi',
    category: 'Food',
    title: 'Annapurna Kitchen & IT Student Mess',
    locality: 'Hinjawadi Phase 1 Main Road',
    price: '₹70 / full meal',
    priceNote: '₹2,500 monthly 2-time pass',
    description: 'High volume student mess with fast serving counters. Hot rotis, dal fry, jeera rice, and 2 vegetable curries daily.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated yesterday',
    tags: ['Fast Service', 'Unlimited Rice', 'Monthly Pass']
  },
  {
    id: 'p-trans-hinjawadi-1',
    area: 'Hinjawadi',
    category: 'Transport',
    title: 'PMPML Route 115P (Pune Station ↔ Hinjawadi Phase 3)',
    locality: 'Suburban Tech Expressway Corridor',
    price: '₹25 - ₹45',
    priceNote: 'AC & Non-AC services',
    description: 'Direct suburban bus route connecting central Pune (Shivajinagar/Station) to Hinjawadi Phase 1, Phase 2, and Phase 3.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 3 days ago',
    tags: ['Suburban Route', 'AC Express', 'Direct Connectivity']
  },

  // KARVE NAGAR
  {
    id: 'p-stay-karve-1',
    area: 'Karve Nagar',
    category: 'Stay',
    title: 'Cummins Circle Girls Hostel & Residency',
    locality: 'Near Cummins College of Engineering, Karve Nagar',
    price: '₹6,800/mo',
    priceNote: 'Double sharing with morning breakfast',
    description: 'High security student accommodation for engineering students. Strict gate timings, biometric access, silent reading rooms.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 4 days ago',
    tags: ['Girls PG', 'Near Cummins', 'Safe & Monitored']
  },
  {
    id: 'p-food-karve-1',
    area: 'Karve Nagar',
    category: 'Food',
    title: 'Shree Krishna Tiffin & Executive Thali',
    locality: 'Karve Road, Karve Nagar',
    price: '₹65 / meal',
    priceNote: 'Authentic Maharashtrian poli bhaji',
    description: 'Popular with engineering students. Unlimited fresh chapatis, tasty sprouted usal, and buttermilk at budget student prices.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['Unlimited Rotis', 'Homely Taste', 'Taak/Buttermilk']
  },

  // WAKAD
  {
    id: 'p-stay-wakad-1',
    area: 'Wakad',
    category: 'Stay',
    title: 'Wakad Central Shared Flat for Students',
    locality: 'Near Datta Mandir Chowk, Wakad',
    price: '₹6,000/mo',
    priceNote: 'Shared 2BHK flat with furnished kitchen',
    description: 'Shared flat setup for students and young trainees. Refrigerator, gas stove, and washing machine included. Direct auto to Hinjawadi.',
    verified: false,
    verificationLabel: 'Student Submitted',
    lastUpdated: 'Updated 3 days ago',
    tags: ['Shared Flat', 'Furnished Kitchen', 'Direct Transit']
  },
  {
    id: 'p-food-wakad-1',
    area: 'Wakad',
    category: 'Food',
    title: 'Sai Sagar Bhojanalaya & Mess',
    locality: 'Wakad-Hinjawadi Link Road, Wakad',
    price: '₹70 / meal',
    priceNote: 'Clean sitting area with quick meals',
    description: 'Wholesome student thali featuring 4 chapatis, choice of veg curry, dal, and rice. Very economical for daily meals.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated yesterday',
    tags: ['Link Road', 'Economical', 'Clean Dining']
  },

  // HADAPSAR
  {
    id: 'p-stay-hadapsar-1',
    area: 'Hadapsar',
    category: 'Stay',
    title: 'Magarpatta Edge Student PG',
    locality: 'Hadapsar Gadital, near Magarpatta City Gate',
    price: '₹5,800/mo',
    priceNote: 'Includes morning tea & WiFi',
    description: 'Affordable student rooms with study desks and hot water. Situated close to Gadital PMPML terminus for easy commuting.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 4 days ago',
    tags: ['Near Gadital', 'Budget Friendly', 'WiFi Included']
  },
  {
    id: 'p-food-hadapsar-1',
    area: 'Hadapsar',
    category: 'Food',
    title: 'Poonam Dining Hall & Student Thali',
    locality: 'Hadapsar Chowk, Pune-Solapur Road',
    price: '₹65 / thali',
    priceNote: 'Pure veg Gujarati & Maharashtrian style',
    description: 'Affordable unlimited thali with warm rotis, sweet dal, kadhi, and crispy papad. Very fast service during student lunch rush.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 2 days ago',
    tags: ['Unlimited Thali', 'Fast Service', 'Budget King']
  },
  {
    id: 'p-trans-hadapsar-1',
    area: 'Hadapsar',
    category: 'Transport',
    title: 'Hadapsar Gadital PMPML Terminus',
    locality: 'Gadital Interchange, Hadapsar',
    price: '₹10 - ₹25',
    priceNote: 'Major eastern bus interchange',
    description: 'Direct BRTS connectivity into Swargate, Pune Station, and Shivajinagar. Dedicated bus lanes avoid highway congestion.',
    verified: true,
    verificationLabel: 'Community Verified',
    lastUpdated: 'Updated 3 days ago',
    tags: ['BRTS Corridor', 'Eastern Terminus', 'Pass Valid']
  }
]

export default function App() {
  // Navigation & Category States
  const [activeCategory, setActiveCategory] = useState('All') // 'All' | 'Stay' | 'Food' | 'Transport'
  const [selectedArea, setSelectedArea] = useState('All') // 'All' or specific Pune area
  const [searchQuery, setSearchQuery] = useState('')
  const [verifiedFilterOnly, setVerifiedFilterOnly] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  // PMPML Bus Route Finder State
  const [pmpmlFrom, setPmpmlFrom] = useState('Swargate')
  const [pmpmlTo, setPmpmlTo] = useState('Shivajinagar')
  const [pmpmlSearchResult, setPmpmlSearchResult] = useState(null)
  const [pmpmlSearched, setPmpmlSearched] = useState(false)

  // Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState('Stay')
  const [feedbackArea, setFeedbackArea] = useState('Deccan')
  const [feedbackPlaceName, setFeedbackPlaceName] = useState('')
  const [feedbackDetails, setFeedbackDetails] = useState('')
  const [feedbackStudentName, setFeedbackStudentName] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  // Section Refs for smooth scrolling
  const heroRef = useRef(null)
  const essentialsRef = useRef(null)
  const areasRef = useRef(null)
  const pmpmlRef = useRef(null)
  const listingsRef = useRef(null)
  const trustRef = useRef(null)

  // Smooth scroll helper
  const scrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Filter Pune Listings
  const filteredListings = useMemo(() => {
    return PUNE_LISTINGS.filter((item) => {
      // Area match
      if (selectedArea !== 'All' && item.area !== selectedArea) return false

      // Category match
      if (activeCategory !== 'All' && item.category !== activeCategory) return false

      // Verified filter
      if (verifiedFilterOnly && !item.verified) return false

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchLocality = item.locality.toLowerCase().includes(q)
        const matchDesc = item.description.toLowerCase().includes(q)
        const matchCategory = item.category.toLowerCase().includes(q)
        const matchArea = item.area.toLowerCase().includes(q)
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchLocality && !matchDesc && !matchCategory && !matchArea && !matchTags) {
          return false
        }
      }

      return true
    })
  }, [selectedArea, activeCategory, verifiedFilterOnly, searchQuery])

  // Handle clicking on the 3 signature service cards
  const handleServiceCardClick = (target) => {
    if (target === 'Transport') {
      scrollTo(pmpmlRef)
    } else {
      setActiveCategory(target)
      scrollTo(listingsRef)
    }
  }

  // Handle Area Selection Chip Click
  const handleAreaSelect = (areaName) => {
    setSelectedArea(areaName)
    scrollTo(listingsRef)
  }

  // Handle PMPML Search
  const handlePmpmlSearch = (e) => {
    e.preventDefault()
    setPmpmlSearched(true)
    const match = PMPML_CORRIDORS.find(
      (c) =>
        (c.origin.toLowerCase().includes(pmpmlFrom.toLowerCase()) &&
          c.destination.toLowerCase().includes(pmpmlTo.toLowerCase())) ||
        (c.origin.toLowerCase().includes(pmpmlTo.toLowerCase()) &&
          c.destination.toLowerCase().includes(pmpmlFrom.toLowerCase()))
    )
    setPmpmlSearchResult(match || null)
  }

  // Suggest correction helper
  const handleSuggestCorrectionFor = (placeTitle, category, area) => {
    setFeedbackCategory(category || 'Stay')
    setFeedbackArea(area || 'Deccan')
    setFeedbackPlaceName(placeTitle || '')
    setFeedbackDetails(`Correction suggestion for ${placeTitle}: `)
    setFeedbackError('')
    setFeedbackSubmitted(false)
    setIsFeedbackModalOpen(true)
  }


  // Submit feedback to the FastAPI backend
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (feedbackSubmitting) return // block double-clicks

    const placeName = feedbackPlaceName.trim()
    const details = feedbackDetails.trim()
    const studentName = feedbackStudentName.trim()

    if (!placeName || !details) {
      setFeedbackError('Please enter the place or route name and your correction details.')
      return
    }

    // Field names must match the backend exactly
    const payload = {
      category: feedbackCategory,
      area: feedbackArea,
      place_name: placeName,
      details: details
    }
    if (studentName) payload.student_name = studentName // optional, only sent if filled

    setFeedbackError('')
    setFeedbackSubmitting(true)

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        // 422 = the backend rejected the values (e.g. details too short)
        setFeedbackError(
          response.status === 422
            ? 'The server rejected the form. Please check that every field is filled and the details are long enough.'
            : `The server could not accept your feedback (error ${response.status}). Please try again later.`
        )
        return
      }

      // Success only after the server confirmed (200/201)
      setFeedbackSubmitted(true)
    } catch (error) {
      setFeedbackError(
        'Could not reach the server. Make sure the backend is running at http://127.0.0.1:8000 and try again.'
      )
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  const handleCloseFeedbackModal = () => {
    if (feedbackSubmitting) return // don't close while a request is running
    setIsFeedbackModalOpen(false)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackPlaceName('')
      setFeedbackDetails('')
      setFeedbackStudentName('')
      setFeedbackError('')
    }, 200)
  }

  // Safe image error handling with graceful SVG fallback
  const handleImageError = (e, fallbackUrl) => {
    if (e.target.dataset.fallbackTried === 'true') {
      e.target.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23121F30"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2320D6C2" font-family="sans-serif" font-size="20">Pune CitySurvival Essential</text></svg>'
      return
    }
    e.target.dataset.fallbackTried = 'true'
    e.target.src = fallbackUrl
  }

  return (
    <div className="citysurvival-app">
      {/* 1. POLISHED SLEEK HEADER */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Custom CitySurvival Logo Mark */}
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <div className="brand-logo-mark">
              <Compass className="brand-icon" size={19} />
            </div>
            <div className="brand-text">
              <span className="brand-title">CitySurvival</span>
              <span className="brand-tagline">Pune Student Edition</span>
            </div>
          </a>

          {/* Location Badge */}
          <div className="header-location-pill">
            <span className="pulse-indicator"></span>
            <span className="location-name">PUNE</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-menu">
            <button
              className={`nav-link ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('All')
                scrollTo(listingsRef)
              }}
            >
              Explore
            </button>
            <button
              className={`nav-link ${activeCategory === 'Stay' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('Stay')
                scrollTo(listingsRef)
              }}
            >
              Stay
            </button>
            <button
              className={`nav-link ${activeCategory === 'Food' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('Food')
                scrollTo(listingsRef)
              }}
            >
              Food
            </button>
            <button
              className="nav-link"
              onClick={() => scrollTo(pmpmlRef)}
            >
              Apli PMPML
            </button>
            <button
              className="nav-link"
              onClick={() => scrollTo(trustRef)}
            >
              Community
            </button>
          </nav>

          {/* Header Action: Choose Area */}
          <div className="nav-actions">
            <button
              className="btn-header-area"
              onClick={() => setIsAreaModalOpen(true)}
              title="Filter Pune by neighbourhood"
            >
              <MapPin size={14} className="teal-pin" />
              <span className="btn-header-area-text">{selectedArea === 'All' ? 'Choose area' : selectedArea}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-links">
              <button
                className={`mobile-link ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('All')
                  setIsMobileMenuOpen(false)
                  scrollTo(listingsRef)
                }}
              >
                <span>Explore All Pune</span>
                <ArrowRight size={16} />
              </button>
              <button
                className={`mobile-link ${activeCategory === 'Stay' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('Stay')
                  setIsMobileMenuOpen(false)
                  scrollTo(listingsRef)
                }}
              >
                <span>Hostels & PGs (Stay)</span>
                <Home size={16} />
              </button>
              <button
                className={`mobile-link ${activeCategory === 'Food' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('Food')
                  setIsMobileMenuOpen(false)
                  scrollTo(listingsRef)
                }}
              >
                <span>Everyday Food & Mess</span>
                <Utensils size={16} />
              </button>
              <button
                className="mobile-link"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollTo(pmpmlRef)
                }}
              >
                <span>Apli PMPML Bus Transit</span>
                <Bus size={16} />
              </button>
              <button
                className="mobile-link"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  scrollTo(trustRef)
                }}
              >
                <span>Community & Local Knowledge</span>
                <ShieldCheck size={16} />
              </button>
              <button
                className="mobile-link highlight-action"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsFeedbackModalOpen(true)
                }}
              >
                <span>Suggest Correction / Feedback</span>
                <MessageSquare size={16} />
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <button
                className="mobile-area-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsAreaModalOpen(true)
                }}
              >
                <MapPin size={16} />
                <span>Selected Area: <strong>{selectedArea}</strong></span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="main-content">
        {/* 2. HERO SECTION — EXACT REFERENCE DESIGN */}
        <section className="hero-section" id="home" ref={heroRef}>
          <div className="hero-grid-card">
            {/* Left Content Side */}
            <div className="hero-left-col">
              <div className="hero-eyebrow">
                <span className="eyebrow-accent"></span>
                <span>YOUR CITY, MADE EASIER</span>
              </div>

              <h1 className="hero-heading">
                New to <span className="teal-highlight">Pune?</span> Start here.
              </h1>

              <p className="hero-supporting-text">
                Find your place, eat well for less, and get around with Apli PMPML.
              </p>

              {/* Prominent Search Bar */}
              <div className="hero-search-bar">
                <div className="search-input-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-field"
                    placeholder="Search stays, food or bus routes across Pune..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        scrollTo(listingsRef)
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search input"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <button
                  className="search-action-btn"
                  onClick={() => scrollTo(listingsRef)}
                >
                  <span>Search</span>
                </button>
              </div>

              {/* Two Prominent Action Buttons */}
              <div className="hero-buttons-row">
                <button
                  className="btn-teal-primary"
                  onClick={() => {
                    scrollTo(areasRef)
                  }}
                >
                  <MapPin size={16} />
                  <span>Choose your area</span>
                </button>

                <button
                  className="btn-dark-secondary"
                  onClick={() => scrollTo(essentialsRef)}
                >
                  <Compass size={16} />
                  <span>Explore essentials</span>
                </button>
              </div>

              {/* Quick Area Shortcuts */}
              <div className="hero-quick-areas">
                <span className="quick-label">Key Pune hubs:</span>
                {['FC Road / Deccan', 'Kothrud', 'Viman Nagar', 'Shivajinagar'].map((areaLabel) => (
                  <button
                    key={areaLabel}
                    className="quick-chip"
                    onClick={() => {
                      if (areaLabel.includes('Deccan')) setSelectedArea('Deccan')
                      else if (areaLabel.includes('Kothrud')) setSelectedArea('Kothrud')
                      else if (areaLabel.includes('Viman')) setSelectedArea('Viman Nagar')
                      else setSelectedArea('Shivajinagar')
                      scrollTo(listingsRef)
                    }}
                  >
                    {areaLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: High-Quality Photograph Panel */}
            <div className="hero-right-col">
              <div className="hero-image-panel">
                <img
                  src="/assets/pune_hero.jpg"
                  alt="Pune student campus and city life"
                  className="hero-photo"
                  loading="eager"
                  onError={(e) =>
                    handleImageError(
                      e,
                      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
                    )
                  }
                />
                <div className="hero-image-gradient-overlay"></div>

                {/* Small Floating Location Label */}
                <div className="hero-floating-location-label">
                  <MapPin size={12} className="teal-pin" />
                  <span>PUNE, MAHARASHTRA</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="hero-floating-badge">
                  <div className="badge-dot"></div>
                  <div className="badge-text-group">
                    <span className="badge-title">Oxford of the East</span>
                    <span className="badge-subtitle">Over 400,000 students call Pune home</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION A: ESSENTIAL SERVICES */}
        <section className="section-essentials" id="essentials" ref={essentialsRef}>
          <div className="section-header">
            <div className="section-header-eyebrow">ESSENTIAL SERVICES</div>
            <h2 className="section-heading">Your Pune essentials</h2>
            <p className="section-description">
              Everything you need to settle in and get moving.
            </p>
          </div>

          <div className="essentials-grid">
            {ESSENTIAL_SERVICES.map((card) => {
              const Icon = card.icon
              const isCurrent = activeCategory === card.id
              return (
                <article
                  key={card.id}
                  className={`essential-card ${isCurrent ? 'is-active-service' : ''}`}
                  onClick={() => handleServiceCardClick(card.categoryTarget)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleServiceCardClick(card.categoryTarget)
                    }
                  }}
                >
                  <div className="card-image-box">
                    <img
                      src={card.image}
                      alt={card.heading}
                      className="card-image"
                      loading="lazy"
                      onError={(e) => handleImageError(e, card.fallbackImage)}
                    />
                    <div className="card-image-gradient"></div>
                    <span className="card-pill-label">{card.label}</span>
                  </div>

                  <div className="card-body">
                    <div className="card-title-row">
                      <div className="card-icon-wrap">
                        <Icon size={18} className="teal-icon" />
                      </div>
                      <h3 className="card-heading">{card.heading}</h3>
                    </div>

                    <p className="card-text">{card.description}</p>

                    <div className="card-action-row">
                      <span className="card-action-label">{card.action}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* 4. SECTION B: EXPLORE PUNE BY AREA */}
        <section className="section-areas" id="areas" ref={areasRef}>
          <div className="section-header">
            <div className="section-header-eyebrow">NEIGHBOURHOOD GUIDE</div>
            <h2 className="section-heading">Find your corner of Pune</h2>
            <p className="section-description">
              Tap any neighbourhood to filter student stays, local meals, and direct transit corridors.
            </p>
          </div>

          <div className="areas-chip-grid">
            {PUNE_AREAS.map((area) => {
              const isSelected = selectedArea === area.id
              return (
                <button
                  key={area.id}
                  className={`area-tile ${isSelected ? 'area-tile-active' : ''}`}
                  onClick={() => handleAreaSelect(area.id)}
                  aria-pressed={isSelected}
                >
                  <div className="area-tile-top">
                    <MapPin size={14} className={isSelected ? 'area-icon-active' : 'area-icon'} />
                    <span className="area-name">{area.name}</span>
                    {isSelected && <Check size={14} className="area-check" />}
                  </div>
                  <span className="area-tagline">{area.tagline}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 5. SECTION C: APLI PMPML SPOTLIGHT (SIGNATURE FEATURE) */}
        <section className="section-pmpml-spotlight" id="pmpml" ref={pmpmlRef}>
          <div className="pmpml-container-panel">
            {/* Top Two-Column Showcase */}
            <div className="pmpml-two-col">
              {/* Left Column */}
              <div className="pmpml-left-col">
                <div className="pmpml-eyebrow">
                  <span className="pmpml-indicator-dot"></span>
                  <span>PUNE PUBLIC TRANSPORT</span>
                </div>

                <h2 className="pmpml-heading">
                  Apli PMPML. Your city, connected.
                </h2>

                <p className="pmpml-description">
                  Find bus stops and explore the routes that help you navigate everyday life in Pune. From Swargate BRTS corridors to Deccan and Kothrud college lines.
                </p>

                <div className="pmpml-cta-group">
                  <button
                    className="btn-teal-primary"
                    onClick={() => {
                      const finder = document.getElementById('pmpml-finder-box')
                      if (finder) finder.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <Bus size={16} />
                    <span>Explore bus information</span>
                  </button>

                  <div className="pmpml-pass-tag">
                    <ShieldCheck size={14} className="teal-icon" />
                    <span>Student Pass (Form 16) guides available</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High Quality Photograph */}
              <div className="pmpml-right-col">
                <div className="pmpml-image-frame">
                  <img
                    src="/assets/pmpml_bus.jpg"
                    alt="Pune PMPML Electric Bus at Bus Stop"
                    className="pmpml-photo"
                    loading="lazy"
                    onError={(e) =>
                      handleImageError(
                        e,
                        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
                      )
                    }
                  />
                  <div className="pmpml-image-overlay"></div>
                  <div className="pmpml-image-label">
                    <span>PUNE • PUBLIC TRANSPORT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form: Starting-point & Destination Route Finder */}
            <div className="pmpml-route-finder-box" id="pmpml-finder-box">
              <div className="finder-header">
                <div className="finder-title-row">
                  <Navigation size={18} className="teal-icon" />
                  <h3 className="finder-title">Find PMPML Bus Corridors</h3>
                </div>
                <span className="prototype-status-pill">
                  Prototype Preview • Verified Student Corridors
                </span>
              </div>

              <form onSubmit={handlePmpmlSearch} className="finder-form">
                <div className="finder-inputs-row">
                  <div className="finder-field">
                    <label className="field-label">From Stop / Area</label>
                    <div className="input-with-icon">
                      <MapPin size={15} className="input-icon" />
                      <select
                        className="finder-select"
                        value={pmpmlFrom}
                        onChange={(e) => setPmpmlFrom(e.target.value)}
                      >
                        <option value="Swargate">Swargate (BRTS Hub)</option>
                        <option value="Shivajinagar">Shivajinagar Station / COEP</option>
                        <option value="Deccan">Deccan Gymkhana / FC Road</option>
                        <option value="Kothrud">Kothrud Stand / Depot</option>
                        <option value="Hinjawadi">Hinjawadi Phase 1 / Phase 3</option>
                        <option value="Viman Nagar">Viman Nagar (Symbiosis)</option>
                        <option value="Hadapsar">Hadapsar Gadital</option>
                        <option value="Karve Nagar">Karve Nagar</option>
                        <option value="Wakad">Wakad Bridge</option>
                      </select>
                    </div>
                  </div>

                  <div className="finder-field">
                    <label className="field-label">To Stop / Area</label>
                    <div className="input-with-icon">
                      <MapPin size={15} className="input-icon" />
                      <select
                        className="finder-select"
                        value={pmpmlTo}
                        onChange={(e) => setPmpmlTo(e.target.value)}
                      >
                        <option value="Shivajinagar">Shivajinagar Station / COEP</option>
                        <option value="Swargate">Swargate (BRTS Hub)</option>
                        <option value="Deccan">Deccan Gymkhana / FC Road</option>
                        <option value="Kothrud">Kothrud Stand / Depot</option>
                        <option value="Hinjawadi">Hinjawadi Phase 1 / Phase 3</option>
                        <option value="Viman Nagar">Viman Nagar (Symbiosis)</option>
                        <option value="Hadapsar">Hadapsar Gadital</option>
                        <option value="Karve Nagar">Karve Nagar</option>
                        <option value="Wakad">Wakad Bridge</option>
                      </select>
                    </div>
                  </div>

                  <div className="finder-action-col">
                    <button type="submit" className="btn-teal-primary finder-btn">
                      <Search size={15} />
                      <span>Find Bus Routes</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Route Search Result or Prototype Notice */}
              {pmpmlSearched && (
                <div className="finder-result-panel">
                  {pmpmlSearchResult ? (
                    <div className="route-match-card">
                      <div className="route-match-top">
                        <div className="route-badge-wrap">
                          <Bus size={18} className="teal-icon" />
                          <span className="route-number">{pmpmlSearchResult.routeNumber}</span>
                          <span className="route-type-pill">{pmpmlSearchResult.type}</span>
                        </div>
                        <span className="route-verified-badge">
                          <CheckCircle2 size={13} />
                          Verified Corridor
                        </span>
                      </div>

                      <h4 className="route-match-name">{pmpmlSearchResult.name}</h4>

                      <div className="route-details-row">
                        <div className="route-detail-item">
                          <Clock size={13} className="teal-icon" />
                          <span>Frequency: <strong>{pmpmlSearchResult.frequency}</strong></span>
                        </div>
                        <div className="route-detail-item">
                          <Clock size={13} className="teal-icon" />
                          <span>Operating Hours: <strong>{pmpmlSearchResult.timing}</strong></span>
                        </div>
                        <div className="route-detail-item">
                          <ShieldCheck size={13} className="teal-icon" />
                          <span>{pmpmlSearchResult.passValid}</span>
                        </div>
                      </div>

                      <div className="route-stops-line">
                        <span className="stops-label">Key Stops:</span>
                        <div className="stops-flow">
                          {pmpmlSearchResult.keyStops.map((stop, i) => (
                            <span key={stop} className="stop-pill">
                              {stop}
                              {i < pmpmlSearchResult.keyStops.length - 1 && ' →'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="prototype-honest-notice">
                        <Info size={14} className="info-icon" />

                        <span>
                          <strong>Prototype Notice:</strong> This student project provides sample PMPML route guidance. Live GPS tracking and real-time bus schedules are not currently available. Route details and timings have not been independently verified.
                        </span>

                      </div>
                    </div>
                  ) : (
                    <div className="route-fallback-card">
                      <div className="fallback-header">
                        <Info size={16} className="teal-icon" />
                        <strong>Corridor Guide for {pmpmlFrom} ↔ {pmpmlTo}</strong>
                      </div>
                      <p className="fallback-text">
                        Direct scheduled bus information for this specific pair is currently being mapped by campus contributors. Most students take connecting services via <strong>Shivajinagar</strong> or <strong>Swargate</strong> BRTS interchange hubs.
                      </p>
                      <div className="prototype-honest-notice">
                        <Info size={14} className="info-icon" />
                        <span>
                          <strong>Prototype Notice:</strong> Live real-time PMPML tracking is not yet integrated. We never invent fake route numbers or live ETAs.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. SECTION D: COMMUNITY TRUST */}
        <section className="section-trust" id="community" ref={trustRef}>
          <div className="trust-panel">
            <div className="section-header">
              <div className="section-header-eyebrow">STUDENT INTEGRITY STANDARD</div>
              <h2 className="section-heading">Built around local knowledge</h2>
              <p className="section-description">
                Student-sourced data, transparent verification, and zero broker commissions.
              </p>
            </div>

            <div className="trust-cards-grid">
              {/* Card 1 */}
              <div className="trust-card">
                <div className="trust-icon-box">
                  <CheckCheck size={22} className="teal-icon" />
                </div>
                <div className="trust-card-status">COMMUNITY-POWERED</div>
                <h3 className="trust-card-title">Shared by Local People</h3>
                <p className="trust-card-text">
                  Information contributed directly by Pune students and local residents. Real insights on warden rules, mess hygiene, and actual room conditions.
                </p>
              </div>

              {/* Card 2 */}
              <div className="trust-card">
                <div className="trust-icon-box">
                  <ShieldCheck size={22} className="teal-icon" />
                </div>
                <div className="trust-card-status">TRANSPARENT AUDIT</div>
                <h3 className="trust-card-title">Know the Source</h3>
                <p className="trust-card-text">
                  Transparent verification tags distinguish student-submitted tips from community-audited listings where rent prices and contacts were manually confirmed.
                </p>
              </div>

              {/* Card 3 */}
              <div className="trust-card">
                <div className="trust-icon-box">
                  <MessageSquare size={22} className="teal-icon" />
                </div>
                <div className="trust-card-status">OPEN CORRECTIONS</div>
                <h3 className="trust-card-title">Help Improve Pune</h3>
                <p className="trust-card-text">
                  Notice a closed dining mess, increased room rent, or altered bus route? Use the quick correction form to keep campus newcomers informed and protected.
                </p>
                <button
                  className="trust-action-btn"
                  onClick={() => {
                    setFeedbackPlaceName('')
                    setFeedbackDetails('')
                    setFeedbackSubmitted(false)
                    setIsFeedbackModalOpen(true)
                  }}
                >
                  <span>Submit a correction →</span>
                </button>
              </div>
            </div>

            {/* Transparency Banner */}
            <div className="trust-transparency-banner">
              <div className="banner-icon">
                <Info size={20} className="teal-icon" />
              </div>
              <div className="banner-body">
                <strong>Clarity & Verification Guarantee:</strong> Listings shown in this preview are curated student sample recommendations for Pune college hubs. In production, community student leads audit listings with receipts before granting the verified status tag.
              </div>
              <button
                className="banner-btn"
                onClick={() => {
                  setFeedbackPlaceName('')
                  setFeedbackDetails('')
                  setFeedbackSubmitted(false)
                  setIsFeedbackModalOpen(true)
                }}
              >
                Feedback
              </button>
            </div>
          </div>
        </section>

        {/* 7. SECTION E: CURATED DIRECTORY / EXPLORE LISTINGS */}
        <section className="section-listings" id="explore" ref={listingsRef}>
          <div className="listings-toolbar">
            <div className="toolbar-info">
              <span className="toolbar-count">
                Showing <strong>{filteredListings.length}</strong>{' '}
                {activeCategory === 'All' ? 'essentials' : activeCategory.toLowerCase() + ' options'}{' '}
                in <strong>{selectedArea === 'All' ? 'Pune (All Areas)' : selectedArea}</strong>
              </span>

              {searchQuery && (
                <span className="search-filter-tag">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear filter">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedArea !== 'All' && (
                <button
                  className="reset-area-tag"
                  onClick={() => setSelectedArea('All')}
                  title="Show all Pune areas"
                >
                  Area: {selectedArea} <X size={11} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="category-tabs">
              {['All', 'Stay', 'Food', 'Transport'].map((categoryName) => (
                <button
                  key={categoryName}
                  className={`category-tab-btn ${activeCategory === categoryName ? 'is-active-tab' : ''}`}
                  onClick={() => setActiveCategory(categoryName)}
                >
                  {categoryName === 'All' && <Filter size={13} />}
                  {categoryName === 'Stay' && <Home size={13} />}
                  {categoryName === 'Food' && <Utensils size={13} />}
                  {categoryName === 'Transport' && <Bus size={13} />}
                  <span>{categoryName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub Filters Row: Verified Only toggle */}
          <div className="sub-filters-bar">
            <button
              className={`verified-filter-btn ${verifiedFilterOnly ? 'is-verified-active' : ''}`}
              onClick={() => setVerifiedFilterOnly(!verifiedFilterOnly)}
            >
              <ShieldCheck size={14} />
              <span>Verified Only</span>
              {verifiedFilterOnly && <Check size={13} />}
            </button>

            <span className="sub-filter-hint">
              Transparent verification: Look for the Community Verified tag on verified student hubs.
            </span>
          </div>

          {/* Listings Cards Grid */}
          {filteredListings.length > 0 ? (
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <article key={listing.id} className="listing-card">
                  <div className="listing-card-header">
                    <div className="listing-type-badge">
                      {listing.category === 'Stay' && <Home size={12} />}
                      {listing.category === 'Food' && <Utensils size={12} />}
                      {listing.category === 'Transport' && <Bus size={12} />}
                      <span>{listing.category}</span>
                      <span className="area-divider">•</span>
                      <span className="listing-area-badge">{listing.area}</span>
                    </div>

                    <div className="listing-verification">
                      {listing.verified ? (
                        <span className="badge-verified" title="Checked by Pune Student Community">
                          <CheckCircle2 size={12} />
                          {listing.verificationLabel}
                        </span>
                      ) : (
                        <span className="badge-unverified" title="Student tip pending community audit">
                          <Info size={12} />
                          {listing.verificationLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="listing-title">{listing.title}</h3>

                  <div className="listing-location">
                    <MapPin size={13} className="teal-pin" />
                    <span>{listing.locality}</span>
                  </div>

                  <div className="listing-pricing">
                    <span className="price-tag">{listing.price}</span>
                    <span className="price-detail">{listing.priceNote}</span>
                  </div>

                  <p className="listing-desc">{listing.description}</p>

                  <div className="listing-tags">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="listing-footer">
                    <div className="timestamp-group">
                      <Clock size={12} />
                      <span>{listing.lastUpdated}</span>
                    </div>

                    <button
                      className="btn-suggest-correction"
                      onClick={() =>
                        handleSuggestCorrectionFor(listing.title, listing.category, listing.area)
                      }
                      title="Report changed rent, closed mess, or altered timing"
                    >
                      <MessageSquare size={13} />
                      <span>Suggest Correction</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-listings-state">
              <div className="empty-icon-box">
                <AlertCircle size={32} className="teal-icon" />
              </div>
              <h3 className="empty-heading">No listings found</h3>
              <p className="empty-text">
                We could not find any {activeCategory !== 'All' ? activeCategory.toLowerCase() : 'essential'}{' '}
                listings matching "<strong>{searchQuery}</strong>"{' '}
                {selectedArea !== 'All' ? `in ${selectedArea}` : 'in Pune'}.
              </p>
              <div className="empty-actions-row">
                <button
                  className="btn-teal-primary"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedArea('All')
                    setActiveCategory('All')
                    setVerifiedFilterOnly(false)
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset All Filters</span>
                </button>
                <button
                  className="btn-dark-secondary"
                  onClick={() => {
                    setFeedbackPlaceName(searchQuery)
                    setFeedbackCategory(activeCategory !== 'All' ? activeCategory : 'Stay')
                    setFeedbackDetails(`I would like to suggest adding a place matching: ${searchQuery}`)
                    setFeedbackSubmitted(false)
                    setIsFeedbackModalOpen(true)
                  }}
                >
                  <MessageSquare size={14} />
                  <span>Recommend a Place</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="brand-logo">
                <div className="brand-logo-mark">
                  <Compass className="brand-icon" size={17} />
                </div>
                <div className="brand-text">
                  <span className="brand-title">CitySurvival</span>
                  <span className="brand-tagline">Pune Edition</span>
                </div>
              </div>
              <p className="footer-desc">
                The modern student city discovery companion for Pune. Finding safe shelter, affordable thalis, and daily PMPML transit for newcomers.
              </p>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Essentials</h4>
              <button onClick={() => handleServiceCardClick('Stay')}>Hostels & PGs</button>
              <button onClick={() => handleServiceCardClick('Food')}>Student Meals & Thalis</button>
              <button onClick={() => scrollTo(pmpmlRef)}>Apli PMPML Transit</button>
              <button onClick={() => scrollTo(areasRef)}>Pune Areas Guide</button>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Key Areas</h4>
              <button onClick={() => handleAreaSelect('Deccan')}>Deccan / FC Road</button>
              <button onClick={() => handleAreaSelect('Kothrud')}>Kothrud</button>
              <button onClick={() => handleAreaSelect('Shivajinagar')}>Shivajinagar</button>
              <button onClick={() => handleAreaSelect('Viman Nagar')}>Viman Nagar</button>
              <button onClick={() => handleAreaSelect('Hinjawadi')}>Hinjawadi</button>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Community</h4>
              <button onClick={() => scrollTo(trustRef)}>Verification Policy</button>
              <button onClick={() => setIsFeedbackModalOpen(true)}>Suggest Correction</button>
              <button onClick={() => setIsFeedbackModalOpen(true)}>Report Discrepancy</button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 CitySurvival Pune. Built for students, powered by local community knowledge.</p>
            <div className="footer-status-pill">
              <span className="pulse-indicator"></span>
              <span>Active City: <strong>Pune, Maharashtra</strong></span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. AREA SELECTOR MODAL */}
      {isAreaModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAreaModalOpen(false)}>
          <div
            className="modal-panel area-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <MapPin className="teal-icon" size={20} />
                <h3 className="modal-title">Select Pune Neighbourhood</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsAreaModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-subtext">
              Filter curated hostels, student messes, and bus lines by college area.
            </p>

            <div className="area-modal-grid">
              {PUNE_AREAS.map((area) => {
                const isSelected = selectedArea === area.id
                return (
                  <button
                    key={area.id}
                    className={`modal-area-card ${isSelected ? 'is-selected-area' : ''}`}
                    onClick={() => {
                      setSelectedArea(area.id)
                      setIsAreaModalOpen(false)
                      scrollTo(listingsRef)
                    }}
                  >
                    <div className="modal-area-info">
                      <strong className="modal-area-name">{area.name}</strong>
                      <span className="modal-area-desc">{area.tagline}</span>
                    </div>
                    {isSelected && (
                      <div className="modal-area-check">
                        <Check size={15} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 10. FEEDBACK & CORRECTION MODAL */}
      {isFeedbackModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseFeedbackModal}>
          <div
            className="modal-panel feedback-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <MessageSquare className="teal-icon" size={20} />
                <h3 className="modal-title">
                  {feedbackPlaceName ? 'Suggest a Correction' : 'Help Improve Pune Guide'}
                </h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={handleCloseFeedbackModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="feedback-success-state">
                <div className="success-icon-box">
                  <CheckCircle2 size={44} className="teal-icon" />
                </div>
                <h4 className="success-heading">Thank you for helping Pune students!</h4>
                <p className="success-message">
                  Your suggestion for <strong>"{feedbackPlaceName || 'Pune CitySurvival'}"</strong> has been received.
                </p>
                <div className="success-prototype-notice">
                  <Info size={15} className="teal-icon" />
                  <span>
                    Note: Your submission was received by the prototype server. It will be reviewed before any listing changes. Nothing is published automatically.
                  </span>
                </div>
                <button
                  className="btn-teal-primary full-width"
                  onClick={handleCloseFeedbackModal}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <p className="modal-subtext">
                  Know an updated rent price, an affordable student tiffin, or a changed bus timing in Pune? Let fellow students know.
                </p>

                {feedbackError && (
                  <div className="form-error-alert">
                    <AlertCircle size={15} />
                    <span>{feedbackError}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-input"
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                    >
                      <option value="Stay">Stay (Hostel / PG / Room)</option>
                      <option value="Food">Food (Thali / Mess / Snack)</option>
                      <option value="Transport">Transport (PMPML Bus / Route)</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Area in Pune *</label>
                    <select
                      className="form-input"
                      value={feedbackArea}
                      onChange={(e) => setFeedbackArea(e.target.value)}
                    >
                      {PUNE_AREAS.filter((a) => a.id !== 'All').map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Place or Route Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Janata Bhojanalaya or PMPML Route 24"
                    value={feedbackPlaceName}
                    onChange={(e) => setFeedbackPlaceName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Details / Correction Notes *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Explain what needs updating (e.g. monthly rent updated to ₹6,500, new Sunday dinner hours, or changed bus stop)..."
                    value={feedbackDetails}
                    onChange={(e) => setFeedbackDetails(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Name or College (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rohan, 2nd Year COEP"
                    value={feedbackStudentName}
                    onChange={(e) => setFeedbackStudentName(e.target.value)}
                  />
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-dark-secondary"
                    onClick={handleCloseFeedbackModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-teal-primary" disabled={feedbackSubmitting}>
                    <span>{feedbackSubmitting ? 'Submitting...' : 'Submit to Community'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
