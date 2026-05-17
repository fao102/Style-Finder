import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageUploader from '../../components/imageUploader'
import * as api from '../../api'

// Mock the API module
vi.mock('../../api', () => ({
  uploadImage: vi.fn()
}))

describe('ImageUploader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render upload form', () => {
    render(<ImageUploader />)
    
    expect(screen.getByText('Upload an Outfit Image')).toBeInTheDocument()
    expect(screen.getByText('Find Alternatives')).toBeInTheDocument()
  })

  it('should update image state on file select', async () => {
    const user = userEvent.setup()
    render(<ImageUploader />)
    
    const input = screen.getByRole('button', { name: /find alternatives/i }).parentElement.querySelector('input[type="file"]')
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(input, file)
    
    // The preview should be rendered after file selection
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument()
    })
  })

  it('should show alert if no image selected and upload clicked', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<ImageUploader />)
    
    const uploadButton = screen.getByText('Find Alternatives')
    fireEvent.click(uploadButton)
    
    expect(alertSpy).toHaveBeenCalledWith('Please select an image first!')
    
    alertSpy.mockRestore()
  })

  it('should show loading state during upload', async () => {
    const user = userEvent.setup()
    api.uploadImage.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({}), 100)))
    
    render(<ImageUploader />)
    
    const input = screen.getByRole('button', { name: /find alternatives/i }).parentElement.querySelector('input[type="file"]')
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(input, file)
    
    const uploadButton = screen.getByText('Find Alternatives')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    })
  })

  it('should display results after successful upload', async () => {
    const mockResults = {
      refined_label: "Men's blue shirt",
      products: [
        { id: 1, title: 'Blue Shirt', price: '$29.99', link: 'http://example.com' }
      ]
    }
    
    api.uploadImage.mockResolvedValue(mockResults)
    const user = userEvent.setup()
    
    render(<ImageUploader />)
    
    const input = screen.getByRole('button', { name: /find alternatives/i }).parentElement.querySelector('input[type="file"]')
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(input, file)
    
    const uploadButton = screen.getByText('Find Alternatives')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(api.uploadImage).toHaveBeenCalled()
    })
  })

  it('should handle upload error gracefully', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    api.uploadImage.mockRejectedValue(new Error('Upload failed'))
    const user = userEvent.setup()
    
    render(<ImageUploader />)
    
    const input = screen.getByRole('button', { name: /find alternatives/i }).parentElement.querySelector('input[type="file"]')
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(input, file)
    
    const uploadButton = screen.getByText('Find Alternatives')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Something went wrong while analyzing your image.')
    })
    
    alertSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })
})
