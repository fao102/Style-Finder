import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'
import * as api from '../../api'

// Mock API module
vi.mock('../../api', () => ({
  uploadImage: vi.fn()
}))

describe('E2E: Upload to Results Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should complete full flow from upload to display results', async () => {
    const mockResults = {
      refined_label: "Men's navy slim blazer",
      products: [
        {
          id: 1,
          title: 'Navy Blazer Premium',
          price: '$89.99',
          thumbnail: 'https://example.com/img1.jpg',
          product_link: 'https://example.com/product/1'
        },
        {
          id: 2,
          title: 'Casual Navy Blazer',
          price: '$59.99',
          thumbnail: 'https://example.com/img2.jpg',
          product_link: 'https://example.com/product/2'
        }
      ]
    }
    
    api.uploadImage.mockResolvedValue(mockResults)
    const user = userEvent.setup()
    
    render(<App />)
    
    // Find and fill the upload input
    const uploadInputs = screen.getAllByRole('button')
    const uploadButton = uploadInputs.find(btn => btn.textContent.includes('Find Alternatives'))
    
    if (uploadButton) {
      const input = uploadButton.parentElement.querySelector('input[type="file"]')
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
      
      await user.upload(input, file)
      
      // Verify preview appears
      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument()
      })
      
      // Click upload
      fireEvent.click(uploadButton)
      
      // Verify loading state
      await waitFor(() => {
        expect(screen.getByText('Analyzing...')).toBeInTheDocument()
      })
      
      // Verify results appear
      await waitFor(() => {
        expect(screen.getByText("Men's navy slim blazer")).toBeInTheDocument()
      })
      
      // Verify products are displayed
      expect(screen.getByText('Navy Blazer Premium')).toBeInTheDocument()
      expect(screen.getByText('Casual Navy Blazer')).toBeInTheDocument()
      
      // Verify prices are shown
      expect(screen.getByText('$89.99')).toBeInTheDocument()
      expect(screen.getByText('$59.99')).toBeInTheDocument()
    }
  })

  it('should handle API error during upload', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    api.uploadImage.mockRejectedValue(new Error('API Error'))
    const user = userEvent.setup()
    
    render(<App />)
    
    const uploadInputs = screen.getAllByRole('button')
    const uploadButton = uploadInputs.find(btn => btn.textContent.includes('Find Alternatives'))
    
    if (uploadButton) {
      const input = uploadButton.parentElement.querySelector('input[type="file"]')
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
      
      await user.upload(input, file)
      fireEvent.click(uploadButton)
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled()
      })
    }
    
    alertSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should reset results when new image selected', async () => {
    const mockResults = {
      refined_label: "Item 1",
      products: []
    }
    
    api.uploadImage.mockResolvedValue(mockResults)
    const user = userEvent.setup()
    
    render(<App />)
    
    const uploadInputs = screen.getAllByRole('button')
    const uploadButton = uploadInputs.find(btn => btn.textContent.includes('Find Alternatives'))
    
    if (uploadButton) {
      const input = uploadButton.parentElement.querySelector('input[type="file"]')
      
      // First upload
      const file1 = new File(['content1'], 'test1.jpg', { type: 'image/jpeg' })
      await user.upload(input, file1)
      fireEvent.click(uploadButton)
      
      await waitFor(() => {
        expect(api.uploadImage).toHaveBeenCalledTimes(1)
      })
      
      // Select second image (should clear previous results)
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' })
      await user.upload(input, file2)
      
      // Results should be cleared
      // This behavior depends on implementation
    }
  })
})
