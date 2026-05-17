import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCard from '../../components/productCard'

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Premium Blue Blazer',
    price: '$79.99',
    thumbnail: 'https://example.com/blazer.jpg',
    product_link: 'https://example.com/product/blazer'
  }

  it('should render product title', () => {
    render(<ProductCard item={mockProduct} />)
    expect(screen.getByText('Premium Blue Blazer')).toBeInTheDocument()
  })

  it('should render product price', () => {
    render(<ProductCard item={mockProduct} />)
    expect(screen.getByText('$79.99')).toBeInTheDocument()
  })

  it('should render product image with correct alt text', () => {
    render(<ProductCard item={mockProduct} />)
    const image = screen.getByAltText('Premium Blue Blazer')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/blazer.jpg')
  })

  it('should render "View Product" link with correct href', () => {
    render(<ProductCard item={mockProduct} />)
    const link = screen.getByText('View Product')
    expect(link).toHaveAttribute('href', 'https://example.com/product/blazer')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should display default price when price is missing', () => {
    const productNoPr ice = {
      ...mockProduct,
      price: null
    }
    render(<ProductCard item={productNoPr ice} />)
    expect(screen.getByText('No price available')).toBeInTheDocument()
  })

  it('should handle long titles with text truncation', () => {
    const longTitleProduct = {
      ...mockProduct,
      title: 'A very long product title that might exceed normal dimensions and should be truncated'
    }
    render(<ProductCard item={longTitleProduct} />)
    const titleElement = screen.getByText(/A very long product title/i)
    expect(titleElement).toHaveClass('text-truncate')
  })

  it('should have proper card styling classes', () => {
    const { container } = render(<ProductCard item={mockProduct} />)
    const cardDiv = container.querySelector('.card')
    expect(cardDiv).toHaveClass('h-100', 'w-100', 'border-0', 'shadow-sm')
  })
})
