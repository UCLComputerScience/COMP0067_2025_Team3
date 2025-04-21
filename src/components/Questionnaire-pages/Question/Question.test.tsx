import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import Question from './Question'

describe('Question component', () => {
  it('renders a basic radio question and selects a value', () => {
    const mockChange = jest.fn()

    render(
      <Question
        id={1} // not 19 or 25, just standard logic
        question='How bad is your pain?'
        selectedValue='50'
        onValueChange={mockChange}
      />
    )

    // Should show the question
    expect(screen.getByText(/how bad is your pain/i)).toBeInTheDocument()

    // Should show the correct option checked
    expect(screen.getByDisplayValue('50')).toBeChecked()

    // Change selection
    fireEvent.click(screen.getByDisplayValue('25'))
    expect(mockChange).toHaveBeenCalled()
  })
})
