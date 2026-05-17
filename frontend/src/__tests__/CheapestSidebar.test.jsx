import { describe, it, expect } from 'vitest'
import { topCheapest } from '../../components/CheapestSidebar'

describe('topCheapest utility function', () => {
  it('should return items with prices sorted by price ascending', () => {
    const items = [
      { id: 1, title: 'Expensive', extracted_value: 150 },
      { id: 2, title: 'Cheap', extracted_value: 50 },
      { id: 3, title: 'Medium', extracted_value: 100 },
    ]
    
    const result = topCheapest(items)
    
    expect(result.length).toBe(3)
    expect(result[0].extracted_value).toBe(50)
    expect(result[1].extracted_value).toBe(100)
    expect(result[2].extracted_value).toBe(150)
  })

  it('should filter out items without prices', () => {
    const items = [
      { id: 1, title: 'With price', extracted_value: 100 },
      { id: 2, title: 'No price', extracted_value: null },
      { id: 3, title: 'Another price', extracted_value: 50 },
    ]
    
    const result = topCheapest(items)
    
    expect(result.length).toBe(2)
    expect(result.every(item => item.extracted_value !== null)).toBe(true)
  })

  it('should return only top N items', () => {
    const items = [
      { id: 1, extracted_value: 100 },
      { id: 2, extracted_value: 50 },
      { id: 3, extracted_value: 75 },
      { id: 4, extracted_value: 25 },
      { id: 5, extracted_value: 150 },
      { id: 6, extracted_value: 30 },
    ]
    
    const result = topCheapest(items, 3)
    
    expect(result.length).toBe(3)
    expect(result[0].extracted_value).toBe(25)
    expect(result[1].extracted_value).toBe(30)
    expect(result[2].extracted_value).toBe(50)
  })

  it('should return empty array when no items have prices', () => {
    const items = [
      { id: 1, extracted_value: null },
      { id: 2, extracted_value: null },
    ]
    
    const result = topCheapest(items)
    
    expect(result.length).toBe(0)
  })

  it('should handle empty input array', () => {
    const result = topCheapest([])
    expect(result.length).toBe(0)
  })

  it('should not mutate original array', () => {
    const items = [
      { id: 1, extracted_value: 100 },
      { id: 2, extracted_value: 50 },
    ]
    const originalOrder = [...items]
    
    topCheapest(items)
    
    expect(items).toEqual(originalOrder)
  })
})
