import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import '../sass/ProductCreate.scss'

const API_URL = 'http://localhost:80/'

export default function ProductCreate() {
  const [productData, setProductData] = useState({
    sku: '',
    name: '',
    price: '',
    type: '',
  })
  const [productAttribute, setProductAttribute] = useState({ attribute: {} })
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()

  // Reset attribute value whenever type is changed
  useEffect(() => {
    switch (productData.type) {
      case 'dvd':
        setProductAttribute({ attribute: { size: '' } })
        break
      case 'book':
        setProductAttribute({ attribute: { weight: '' } })
        break
      case 'furniture':
        setProductAttribute({
          attribute: { height: '', width: '', length: '' },
        })
        break
      default:
        setProductAttribute({ attribute: {} })
    }
  }, [productData.type])

  // Handle input change for sku, name, price, type fields
  const handleInputChange = e => {
    const name = e.target.name
    const value = e.target.value

    setProductData({ ...productData, [name]: value })
  }

  // Handle input change for attribute fields
  const handleAttributeInputChange = e => {
    const name = e.target.name
    const value = e.target.value

    setProductAttribute({
      attribute: { ...productAttribute.attribute, [name]: value },
    })
  }

  // Handle submit button for saving new product
  const handleSubmit = async e => {
    e.preventDefault()

    // Input data validation
    const error = validateInputData() ?? ''
    setValidationError(error)
    if (error) {
      return
    }

    // Send post request to create new product
    const request = { ...productData, ...productAttribute.attribute }
    try {
      await axios.post(API_URL + 'add-product', JSON.stringify(request))
    } catch (error) {
      switch (error.response.status) {
        case 409:
          setValidationError('Product with this sku already exists')
          break
        case 422:
          setValidationError('Invalid input data')
          break
        default:
          setValidationError('Server error')
      }
      return
    }

    navigate('/')
  }

  // Input data validation
  // Returns error message
  const validateInputData = () => {
    // Check for empty sku, name, price, type fields
    const emptyProductData = Object.values(productData).filter(
      value => value === ''
    )

    if (emptyProductData.length) {
      return 'Please, submit required data'
    }

    // Check for empty attribute fields
    const emptyProductAttribute = Object.values(
      productAttribute.attribute
    ).filter(value => value === '')

    if (emptyProductAttribute.length) {
      return 'Please, submit required data'
    }

    // Check for invalid input values
    const invlaidAttributes = Object.values(productAttribute.attribute).filter(
      value => value <= 0
    )

    if (productData.price <= 0 || invlaidAttributes.length) {
      return 'Please, provide the data of indicated type'
    }
  }

  return (
    <div className='product-create container'>
      {/* Header */}
      <header className='header product-list__header'>
        {/* Title */}
        <h2 className='header__title'>Product Add</h2>

        {/* Save button */}
        <button type='submit' form='product_form' className='btn btn--add'>
          Save
        </button>

        {/* Cancel button */}
        <Link to='/' className='btn btn--cancel'>
          Cancel
        </Link>
      </header>

      {/* Form */}
      <form
        action=''
        id='product_form'
        className='product-form'
        onSubmit={e => handleSubmit(e)}
      >
        {/* Show validation error */}
        {validationError && (
          <div className='product-form__error'>{validationError}</div>
        )}

        {/* Sku input */}
        <div className='product-form__item'>
          <label htmlFor='sku' className='product-form__label'>
            SKU
          </label>
          <input
            type='text'
            name='sku'
            id='sku'
            className='product-form__input'
            value={productData.sku}
            onChange={e => handleInputChange(e)}
          />
        </div>

        {/* Name input */}
        <div className='product-form__item'>
          <label htmlFor='name' className='product-form__label'>
            Name
          </label>
          <input
            type='text'
            name='name'
            id='name'
            className='product-form__input'
            value={productData.name}
            onChange={e => handleInputChange(e)}
          />
        </div>

        {/* Price input */}
        <div className='product-form__item'>
          <label htmlFor='price' className='product-form__label'>
            Price ($)
          </label>
          <input
            type='number'
            name='price'
            id='price'
            className='product-form__input'
            value={productData.price}
            onChange={e => handleInputChange(e)}
          />
        </div>

        {/* Type switcher field */}
        <div className='product-form__item'>
          <label htmlFor='productType' className='product-form__label'>
            Type Switcher
          </label>
          <select
            name='type'
            id='productType'
            className='product-form__select'
            value={productData.type}
            onChange={e => handleInputChange(e)}
          >
            <option defaultValue='' disabled></option>
            <option value='dvd'>DVD</option>
            <option value='book'>Book</option>
            <option value='furniture'>Furniture</option>
          </select>
        </div>

        <p className='product-form__text'>
          {productData.type === 'dvd' && 'Please, provide size'}
          {productData.type === 'book' && 'Please, provide weight'}
          {productData.type === 'furniture' && 'Please, provide dimensions'}
        </p>

        {/* Input for dvd size type */}
        {productData.type === 'dvd' && (
          <div className='product-form__item'>
            <label htmlFor='size' className='product-form__label'>
              Size (MB)
            </label>
            <input
              type='number'
              name='size'
              id='size'
              className='product-form__input'
              value={productAttribute.attribute.size || ''}
              onChange={e => handleAttributeInputChange(e)}
            />
          </div>
        )}

        {/* Input for book weight */}
        {productData.type === 'book' && (
          <div className='product-form__item'>
            <label htmlFor='weight' className='product-form__label'>
              Weight (KG)
            </label>
            <input
              type='number'
              name='weight'
              id='weight'
              className='product-form__input'
              value={productAttribute.attribute.weight || ''}
              onChange={e => handleAttributeInputChange(e)}
            />
          </div>
        )}

        {/* Inputs for furniture dimensions */}
        {productData.type === 'furniture' && (
          <>
            <div className='product-form__item'>
              <label htmlFor='height' className='product-form__label'>
                Height (CM)
              </label>
              <input
                type='number'
                name='height'
                id='height'
                className='product-form__input'
                value={productAttribute.attribute.height || ''}
                onChange={e => handleAttributeInputChange(e)}
              />
            </div>

            <div className='product-form__item'>
              <label htmlFor='width' className='product-form__label'>
                Width (CM)
              </label>
              <input
                type='number'
                name='width'
                id='width'
                className='product-form__input'
                value={productAttribute.attribute.width || ''}
                onChange={e => handleAttributeInputChange(e)}
              />
            </div>

            <div className='product-form__item'>
              <label htmlFor='length' className='product-form__label'>
                Length (CM)
              </label>
              <input
                type='number'
                name='length'
                id='length'
                className='product-form__input'
                value={productAttribute.attribute.length || ''}
                onChange={e => handleAttributeInputChange(e)}
              />
            </div>
          </>
        )}
      </form>
    </div>
  )
}
