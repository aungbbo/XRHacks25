import React, { useState } from 'react'
import { X, Palette, ArrowLeft } from 'lucide-react'
import './../App.css'

interface NoteDetailViewProps {
  subject: string
  onClose: () => void
}

const AI_SUMMARIES: Record<string, string> = {
  Physics:
    `Physics explores the fundamental laws governing matter, energy, and the universe. 

Key Concepts:
• Mechanics - Motion and forces, Newton's laws describe how objects move and interact
• Thermodynamics - Heat and energy transfer, entropy, and the laws of energy conservation
• Electromagnetism - Electric and magnetic fields, how charged particles interact
• Quantum Mechanics - Atomic and subatomic behavior, wave-particle duality

Important Principles:
Newton's laws of motion explain how forces affect motion. The first law states that objects at rest stay at rest unless acted upon. The second law relates force, mass, and acceleration (F=ma). The third law states that for every action there's an equal and opposite reaction.

Einstein's theory of relativity revolutionized our understanding of space and time. Special relativity shows that time and space are relative, not absolute. General relativity explains gravity as the curvature of spacetime.

These principles help explain everything from planetary motion to particle behavior, from the smallest atoms to the largest galaxies. Understanding physics provides the foundation for engineering, technology, and our comprehension of the natural world.`,
  Math: `Mathematics is the language of patterns and relationships. 

Core Areas:
• Algebra - Solving equations, working with variables and expressions
• Geometry - Shapes, spaces, angles, and spatial relationships
• Calculus - Rates of change (derivatives) and accumulation (integrals)
• Statistics - Data analysis, probability, and making inferences from data

Key Concepts:
Functions describe relationships between variables. A function takes an input and produces an output. Linear functions create straight lines, while quadratic functions create parabolas.

Derivatives measure how quickly something changes - the rate of change. Integrals measure accumulation - the total amount built up over time. These concepts are fundamental to understanding motion, growth, and change.

Probability helps us understand uncertainty and make predictions. It quantifies how likely events are to occur, from simple coin flips to complex statistical models.

Mathematical thinking develops logical reasoning and problem-solving skills. Math provides tools for modeling real-world phenomena, from predicting weather patterns to optimizing business operations. It's the foundation for science, engineering, economics, and countless other fields.`,
  Chemistry:
    `Chemistry studies the composition, structure, and properties of matter. 

Fundamental Topics:
• Atomic Structure - Protons, neutrons, electrons, and how atoms are organized
• Chemical Bonding - How atoms connect to form molecules (ionic, covalent, metallic bonds)
• Chemical Reactions - Breaking and forming bonds, with energy changes
• Thermodynamics - Energy changes in chemical processes

The Periodic Table:
The periodic table organizes elements by their properties. Elements in the same column (group) have similar chemical behaviors. The table reveals patterns in atomic size, reactivity, and bonding tendencies.

Chemical Reactions:
Reactions involve breaking old bonds and forming new ones. Exothermic reactions release energy (like burning), while endothermic reactions absorb energy. The law of conservation of mass states that matter cannot be created or destroyed.

Key Concepts:
• Acids and Bases - pH scale, neutralization reactions
• Oxidation-Reduction - Electron transfer, essential for batteries and metabolism
• Organic Compounds - Carbon-based molecules, the basis of life

Understanding chemistry explains materials, medicines, environmental processes, and the molecular basis of life itself. It connects the atomic world to the world we experience every day.`,
  Biology:
    `Biology examines living organisms and their processes. 

Major Areas:
• Cell Biology - Cellular structure and function, the basic unit of life
• Genetics - Heredity and DNA, how traits are passed down
• Evolution - Species development, natural selection, adaptation
• Ecology - Ecosystem interactions, relationships between organisms and environments

Key Concepts:
DNA (deoxyribonucleic acid) contains the genetic instructions for all living things. DNA replication ensures genetic information is passed accurately to new cells. The double helix structure allows for precise copying.

Protein synthesis is the process by which cells build proteins from genetic instructions. DNA is transcribed into RNA, which is then translated into proteins. Proteins perform most of the work in cells.

Natural selection drives evolution. Organisms with advantageous traits are more likely to survive and reproduce, passing those traits to offspring. Over time, this leads to adaptation and the diversity of life.

Homeostasis is the maintenance of stable internal conditions despite external changes. Organisms regulate temperature, pH, and other factors to stay alive.

Biology explains how life functions, adapts, and interacts with environments. It connects the molecular level to entire ecosystems, revealing the interconnectedness of all living things.`,
  History:
    `History studies past events and their impacts on human development. 

Key Periods:
• Ancient Civilizations - Early human societies, the rise of cities and empires
• Medieval Times - Feudalism, the Middle Ages, cultural and political developments
• Modern Era - Renaissance, Industrial Revolution, major world changes
• Contemporary Events - Recent history, current global developments

Historical Analysis:
Historians examine primary sources - original documents, artifacts, and accounts from the time period. These sources provide direct evidence of past events and perspectives.

Understanding causation helps explain why events happened. Multiple factors often contribute to historical developments - economic, social, political, and cultural forces interact in complex ways.

Recognizing patterns across time reveals recurring themes in human history. Similar challenges and responses appear in different eras and cultures.

History provides context for current issues. By understanding how we got here, we can better navigate present challenges and predict future trends. It helps us learn from past successes and failures, informing decisions in politics, society, and culture.

The study of history examines political, social, economic, and cultural changes over time, revealing the story of human civilization and our ongoing evolution.`,
}

const BACKGROUND_COLORS = [
  '#FFE5E5', // Light red
  '#E5F3FF', // Light blue
  '#E5FFE5', // Light green
  '#FFF5E5', // Light orange
  '#F0E5FF', // Light purple
  '#FFFFFF', // White
]

export const NoteDetailView: React.FC<NoteDetailViewProps> = ({
  subject,
  onClose,
}) => {
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const summary = AI_SUMMARIES[subject] || 'No summary available for this subject.'

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
      } as React.CSSProperties}
      enable-xr
    >
      <div
        className="relative"
        style={{ perspective: '2000px' }}
      >
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-8 top-8 z-10 flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors shadow-lg"
          type="button"
          style={{ transform: 'translateZ(100px)' }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>

        {/* Paper/Note */}
        <div
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 spatial-translucent flex flex-col"
          style={{
            backgroundColor: backgroundColor,
            transform: 'translateZ(150px)',
            width: '800px',
            height: '1000px',
            maxHeight: '90vh',
          }}
          enable-xr
        >
          {/* Header - Centered */}
          <div className="flex items-center justify-center mb-6 flex-shrink-0">
            <h2 className="font-bold text-gray-800 text-center" style={{ fontSize: '3.5rem' }}>{subject}</h2>
          </div>

          {/* AI Summary - Takes up all available space */}
          <div className="flex-1 flex flex-col overflow-y-auto mb-6">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0 pl-8">
              <span className="text-2xl font-semibold text-gray-700">AI Summary</span>
            </div>
            <div className="flex-1 text-left pl-8 pr-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-xl">
                {summary}
              </p>
            </div>
          </div>

          {/* Background Color Button - Fixed at bottom */}
          <div className="relative flex items-center justify-center pt-4 border-t border-gray-200 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                type="button"
              >
                <Palette className="w-6 h-6" />
                <span className="text-lg text-gray-700 font-medium">Change Background</span>
              </button>

              {showColorPicker && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-10">
                  <div className="flex gap-3 items-center justify-center">
                    {BACKGROUND_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setBackgroundColor(color)
                          setShowColorPicker(false)
                        }}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors flex-shrink-0"
                        style={{ backgroundColor: color, minWidth: '48px', minHeight: '48px' }}
                        type="button"
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exit Button inside paper */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors z-10"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

