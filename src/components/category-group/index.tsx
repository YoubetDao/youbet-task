import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { capitalize } from 'lodash'

interface ICategoryGroupProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export const CategoryGroup = ({ categories, selectedCategory, onCategoryChange }: ICategoryGroupProps) => {
  return (
    <ToggleGroup
      size="sm"
      type="single"
      value={selectedCategory}
      onValueChange={onCategoryChange}
      aria-label="Select Category"
    >
      {categories.map((category) => (
        <ToggleGroupItem key={category} value={category}>
          {capitalize(category)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
