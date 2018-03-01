import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.push('/checkout/contact-data');
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <CheckoutSummary
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
          ingredients={this.props.ingredients} />
        <Route
          path={this.props.match.url + '/contact-data'}
          component={ContactData} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
  }
}

export default connect(mapStateToProps)(Checkout);