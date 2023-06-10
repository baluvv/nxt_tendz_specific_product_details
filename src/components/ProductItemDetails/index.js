import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {apiStatus: 'INPROGRESS', quantity: 1, productsData: ''}

  onGoBackToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onIncreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity >= 2) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="products-not-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view"
        />
        <h1 className="product-not-found-heading">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping"
          onClick={this.onGoBackToProducts}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderProductDetails = () => {
    const {productsData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productsData

    return (
      <>
        <Header />
        <div className="product-details-container">
          <div className="current-product-container">
            <img src={imageUrl} alt="product" className="product" />
            <div className="about-product-container">
              <h1 className="title">{title}</h1>
              <p className="price">{`Rs ${price}/-`}</p>
              <div className="ratings-reviews-container">
                <div className="ratings-container">
                  <p className="rating-number">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <div className="avail-container">
                  <p className="reviews">{totalReviews} </p>
                  <p className="reviews"> Reviews</p>
                </div>
              </div>
              <p className="description">{description}</p>
              <div className="avail-container">
                <h1 className="side-heading">Available: </h1>
                <p className="available-brand">{availability}</p>
              </div>
              <div className="avail-container">
                <h1 className="side-heading">Brand: </h1>
                <p className="available-brand">{brand}</p>
              </div>
              <hr className="line" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="button"
                  data-testid="minus"
                  onClick={this.onDecreaseQuantity}
                >
                  <BsDashSquare className="icon" />
                </button>
                <p className="quantity-number">{quantity}</p>
                <button
                  type="button"
                  className="button"
                  data-testid="plus"
                  onClick={this.onIncreaseQuantity}
                >
                  <BsPlusSquare className="icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProducts.map(eachProduct => (
              <li className="similar-item" key={eachProduct.id}>
                <img
                  src={eachProduct.imageUrl}
                  alt={`similar product ${eachProduct.title}`}
                  className="similar-product"
                />
                <h1 className="similar-heading">{eachProduct.title}</h1>
                <p className="similar-brand">by {eachProduct.brand}</p>
                <div className="price-ratings-container">
                  <h1 className="similar-price">{`Rs ${eachProduct.price}/-`}</h1>
                  <div className="similar-ratings-container">
                    <p className="similar-rating-number">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="similar-star"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  componentDidMount = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(similarProduct => ({
          id: similarProduct.id,
          imageUrl: similarProduct.image_url,
          title: similarProduct.title,
          style: similarProduct.style,
          price: similarProduct.price,
          description: similarProduct.description,
          brand: similarProduct.brand,
          totalReviews: similarProduct.total_reviews,
        })),
      }
      this.setState({
        productsData: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.success:
        return this.renderProductDetails()
      default:
        return null
    }
  }
}

export default ProductItemDetails
