import '@testing-library/jest-dom'
import React, { useState } from 'react'

import { render, screen, waitFor, fireEvent } from '@testing-library/react'

import QuestionPage from '../../src/components/Questionnaire-pages/QuestionnairePage'

const mockQuestions = [
  {
    id: 6,
    domain: 'Pain',
    question: 'Joint Pain',
    note: 'We want to know specifically about the pain in your joints. Please try to not rate pain outside the joints (such as muscle pain, radiating nerve pain).'
  },
  {
    id: 7,
    domain: 'Pain',
    question: 'Widespread pain in other areas of your body, such as legs, back, arms, spine',
    note: null
  },
  {
    id: 8,
    domain: 'Pain',
    question: 'Headaches or migraines',
    note: null
  },
  {
    id: 9,
    domain: 'Pain',
    question: 'Pain provoked by sensations that would not be painful to most people',
    note: 'e.g. the pressure of clothes, someone touching you, touching the bedclothes, small movements, ...'
  }
]

jest.mock('../src/actions/questionnaire/userAction', () => ({
  fetchQuestionsByDomain: jest.fn(() => Promise.resolve(mockQuestions))
}))

describe('QuestionPage integration', () => {
  test('Renders with mock questions', async () => {
    const handleNext = jest.fn()
    const handlePrev = jest.fn()
    const onUpdate = jest.fn()

    render(
      <QuestionPage domain='Pain' answers={{}} onUpdate={onUpdate} handleNext={handleNext} handlePrev={handlePrev} />
    )

    // Wait for questions to appear
    await waitFor(() => {
      expect(screen.getByText(/Pain/i)).toBeInTheDocument()
    })

    const questionDiv = document.getElementById('6')
    const questionDiv2 = document.getElementById('7')

    expect(questionDiv).toBeInTheDocument()
    expect(questionDiv2).toBeInTheDocument()
  })

  test('All questions rendered, values selected, proceed to the next page', async () => {
    const handleNext = jest.fn()
    const handlePrev = jest.fn()

    function TestWrapper() {
      const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

      return (
        <QuestionPage
          domain='Pain'
          answers={answers}
          onUpdate={setAnswers}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )
    }

    const { container } = render(<TestWrapper />)

    await waitFor(() => {
      expect(screen.getByText('Pain')).toBeInTheDocument()
    })

    const questionIds = [6, 7, 8, 9]

    for (const id of questionIds) {
      const qDiv = container.querySelector<HTMLElement>(`[id="${id}"]`)!

      const radio25 = qDiv.querySelector<HTMLInputElement>('input[type="radio"][value="25"]')!

      fireEvent.click(radio25)
    }

    const nextBtn = screen.getByRole('button', { name: /Next/i })

    fireEvent.click(nextBtn)

    await waitFor(() => {
      expect(handleNext).toHaveBeenCalledTimes(1)
    })
  })

  test('All questions rendered, not all values selected, validaton gives errors, and not proceed to the next page', async () => {
    const handleNext = jest.fn()
    const handlePrev = jest.fn()

    function TestWrapper() {
      const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

      return (
        <QuestionPage
          domain='Pain'
          answers={answers}
          onUpdate={setAnswers}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )
    }

    const { container } = render(<TestWrapper />)

    await waitFor(() => {
      expect(screen.getByText('Pain')).toBeInTheDocument()
    })

    const questionIds = [6, 7, 8]

    for (const id of questionIds) {
      const qDiv = container.querySelector<HTMLElement>(`[id="${id}"]`)!

      const radio25 = qDiv.querySelector<HTMLInputElement>('input[type="radio"][value="25"]')!

      fireEvent.click(radio25)
    }

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(handleNext).not.toHaveBeenCalled()
    })
  })
})
