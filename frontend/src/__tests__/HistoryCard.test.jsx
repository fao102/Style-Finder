
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HistoryCard from '../components/HistoryCard'

describe('HistoryCard Component', () => {
  it('uses image_url when the backend provides it for the uploaded outfit image', () => {
    const item = {
      id: 1,
      style_summary: 'Blue blazer',
      created_at: '2024-01-01T00:00:00.000Z',
      image_url: '/media/uploaded.jpg',
      results: [],
    }

    render(<HistoryCard item={item} />)

    const image = screen.getByAltText('Uploaded outfit')
    expect(image).toHaveAttribute('src', 'http://localhost:8000/media/uploaded.jpg')
  })

  it('proxies remote product thumbnails through the backend', () => {
    const item = {
      id: 1,
      style_summary: 'Blue blazer',
      created_at: '2024-01-01T00:00:00.000Z',
      image: '/media/uploaded.jpg',
      results: [
        {
          title: 'Premium Blue Blazer',
          thumbnail: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcExample',
          product_link: 'https://example.com/product/blazer',
          extracted_price: 49.99,
        },
      ],
    }

    render(<HistoryCard item={item} />)

    const images = screen.getAllByAltText('Premium Blue Blazer')
    expect(images[0]).toHaveAttribute(
      'src',
      'http://localhost:8000/api/outfit_searches/proxy_image/?url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fshopping%3Fq%3Dtbn%3AANd9GcExample'
    )
  })
})
