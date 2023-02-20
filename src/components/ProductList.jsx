import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ProductItem from './ProductItem'
import '../sass/ProductList.scss'

// const API_URL = 'http://localhost:80/'
const API_URL = 'https://scandiweb-test-api.herokuapp.com/'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [checkedProducts, setCheckedProducts] = useState([])

  useEffect(() => {
    getProducts()
  }, [])

  // Get list of products from api
  const getProducts = async () => {
    const response = await axios.get(API_URL)
    setProducts(response.data)
  }

  // Delete products based on list of sku values
  const massDeleteProduct = async () => {
    await axios.delete(API_URL, { data: { skuList: checkedProducts } })
    getProducts()
    setCheckedProducts([])
  }

  // Update checkedProducts list
  const updateCheckedList = sku => {
    // If sku is in checked list than remove it
    if (checkedProducts.includes(sku)) {
      setCheckedProducts(checkedProducts.filter(value => value !== sku))
      return
    }

    // Add sku in checked list
    setCheckedProducts([...checkedProducts, sku])
  }

  return (
    <div className='product-list container'>
      {/* Header */}
      <header className='header product-list__header'>
        {/* Title */}
        <h2 className='header__title'>Product List</h2>

        {/* Add button */}
        <Link to='add-product' className='btn btn--add'>
          ADD
        </Link>

        {/* Mass delete button */}
        <button className='btn btn--delete' onClick={massDeleteProduct}>
          MASS DELETE
        </button>
      </header>

      {/* Product list */}
      <div className='product-list__content'>
        {products.map(product => (
          <ProductItem
            key={product.sku}
            data={product}
            updateCheckedList={updateCheckedList}
          />
        ))}
      </div>
    </div>
  )
}
