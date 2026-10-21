import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Shared Navigation & Modals
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AreaModal from './components/AreaModal'
import FeedbackModal from './components/FeedbackModal'

// Multi-Page Routes
import HomePage from './pages/HomePage'
import StayPage from './pages/StayPage'
import FoodPage from './pages/FoodPage'
import TransportPage from './pages/TransportPage'
import FeedbackPage from './pages/FeedbackPage'

export default function App() {
  // Global Pune Area Filter
  const [selectedArea, setSelectedArea] = useState('All')

  // Modals State
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackModalData, setFeedbackModalData] = useState({
    placeName: '',
    category: 'Stay',
    area: 'Deccan',
    details: ''
  })

  // Handlers
  const handleSelectArea = (areaName) => {
    setSelectedArea(areaName)
  }

  const handleOpenAreaModal = () => {
    setIsAreaModalOpen(true)
  }

  const handleCloseAreaModal = () => {
    setIsAreaModalOpen(false)
  }

  const handleOpenFeedbackModal = (placeTitle = '', category = 'Stay', area = 'Deccan') => {
    setFeedbackModalData({
      placeName: placeTitle,
      category: category,
      area: area === 'All' ? 'Deccan' : area,
      details: placeTitle ? `Correction suggestion for ${placeTitle}: ` : ''
    })
    setIsFeedbackModalOpen(true)
  }

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false)
  }

  return (
    <Router>
      <div className="citysurvival-app">
        {/* Ensures scroll reset on navigation */}
        <ScrollToTop />

        {/* Global Navigation Header */}
        <Navbar
          selectedArea={selectedArea}
          onOpenAreaModal={handleOpenAreaModal}
        />

        {/* Dynamic Multi-Page Content */}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  selectedArea={selectedArea}
                  onSelectArea={handleSelectArea}
                  onOpenAreaModal={handleOpenAreaModal}
                />
              }
            />

            <Route
              path="/stay"
              element={
                <StayPage
                  selectedArea={selectedArea}
                  onSelectArea={handleSelectArea}
                  onSuggestCorrection={handleOpenFeedbackModal}
                />
              }
            />

            <Route
              path="/food"
              element={
                <FoodPage
                  selectedArea={selectedArea}
                  onSelectArea={handleSelectArea}
                  onSuggestCorrection={handleOpenFeedbackModal}
                />
              }
            />

            <Route
              path="/transport"
              element={
                <TransportPage
                  selectedArea={selectedArea}
                  onSelectArea={handleSelectArea}
                  onSuggestCorrection={handleOpenFeedbackModal}
                />
              }
            />

            <Route
              path="/feedback"
              element={<FeedbackPage />}
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer onSelectArea={handleSelectArea} />

        {/* Neighbourhood Filter Modal */}
        <AreaModal
          isOpen={isAreaModalOpen}
          onClose={handleCloseAreaModal}
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
        />

        {/* Fast Contextual Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={handleCloseFeedbackModal}
          initialData={feedbackModalData}
        />
      </div>
    </Router>
  )
}
