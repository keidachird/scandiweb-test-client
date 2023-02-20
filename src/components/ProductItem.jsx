import { useState } from 'react'

import '../sass/ProductItem.scss'

export default function ProductItem({ data, updateCheckedList }) {
  const [isChecked, setIsChecked] = useState(false)

  // Handle checkbox change
  const handleCheckbox = () => {
    // Toggle state value for product
    setIsChecked(!isChecked)
    // Add or remove sku from checkedProduct list in ProductList component
    updateCheckedList(data.sku)
  }

  return (
    <div className='product-item'>
      <input
        type='checkbox'
        className='delete-checkbox product-item__checkbox'
        checked={isChecked}
        onChange={handleCheckbox}
      />
      <div className='product-item__sku'>{data.sku}</div>
      <div className='product-item__name'>{data.name}</div>
      <div className='product-item__price'>{data.price} $</div>
      <div className='product-item__attribute'>
        <span>
          {data.type === 'dvd' && 'Size: '}
          {data.type === 'book' && 'Weight: '}
          {data.type === 'furniture' && 'Dimension: '}
        </span>
        {data.attribute}
      </div>
    </div>
  )
}
