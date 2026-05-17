import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsGrid from '../../components/resultsGrid'

// Mock the ProductCard component to simplify testing
vi.mock('../../components/productCard', () => ({
  default: ({ item }) => (
    <div data-testid={`product-card-${item.id}`}>
      {item.title}
    </div>
  )
}))

vi.mock('../../components/CheapestSidebar', () => ({
  default: () => <div>Cheapest Sidebar</div>
}))

describe('ResultsGrid Component', () => {
  const mockResults = {
    refined_label: "Men's casual casual blue shirt",
    products: [
      {
        id: 1,
        title: 'Blue Shirt Option 1',
        price: '$29.99',
        product_link: 'https://example.com/1'
      },
      {
        id: 2,
        title: 'Blue Shirt Option 2',
        price: '$39.99',
        product_link: 'https://example.com/2'
      },
      {
        id: 3,
        title: 'Blue Shirt Option 3',
        price: '$49.99',
        product_link: 'https://example.com/3'
      }
    ]
  }

  it('should render refined label', () => {
    render(<ResultsGrid results={mockResults} />)
    expect(screen.getByText("Men's casual casual blue shirt")).toBeInTheDocument()
  })

  it('should render product cards for each product', () => {
    render(<ResultsGrid results={mockResults} />)
    
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument()
  })

  it('should render all product titles', () => {
    render(<ResultsGrid results={mockResults} />)
    
    expect(screen.getByText('Blue Shirt Option 1')).toBeInTheDocument()
    expect(screen.getByText('Blue Shirt Option 2')).toBeInTheDocument()
    expect(screen.getByText('Blue Shirt Option 3')).toBeInTheDocument()
  })

  it('should have correct grid layout classes', () => {
    const { container } = render(<ResultsGrid results={mockResults} />)
    const rowDiv = container.querySelector('.row.g-4')
    expect(rowDiv).toBeInTheDocument()
    
    const cols = container.querySelectorAll('.col-6.col-md-4.col-lg-3')
    expect(cols).toHaveLength(3)
  })

  it('should render with empty products array', () => {
    const emptyResults = {
      refined_label: "Test item",
      products: []
    }
    render(<ResultsGrid results={emptyResults} />)
    expect(screen.getByText('Test item')).toBeInTheDocument()
  })

  it('should render single product', () => {
    const singleProduct = {
      refined_label: "Single Product",
      products: [
        {
          id: 1,
          title: 'Single Item',
          price: '$19.99',
          product_link: 'https://example.com/1'
        }
      ]
    }
    render(<ResultsGrid results={singleProduct} />)
    
    expect(screen.getByText('Single Product')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument()
  })
})
