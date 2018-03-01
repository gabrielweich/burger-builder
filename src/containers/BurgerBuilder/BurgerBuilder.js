import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {

  state = {
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    /*
    axios.get('https://react-my-burger-5afad.firebaseio.com/ingredients.json')
      .then(res => {
        this.setState({ ingredients: res.data })
      })
      .catch(error => {
        this.setState({ error: true })
      })*/
  }

  updatePurchaseState(ingredients) {
    let isPurchasable = false;
    console.log(ingredients);
    for(const igKey in ingredients){
      if(ingredients[igKey] > 0) {
        isPurchasable = true;
        break;
      }
    }

    return isPurchasable;
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {

    const queryParams = [];
    for (let i in this.props.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ingredients[i]));
    }
    queryParams.push('price=' + this.props.totalPrice);
    const queryString = queryParams.join('&');

    this.props.history.push({
      pathname: 'checkout',
      search: '?' + queryString,
    });
  }

  render() {
    const disabledInfo = { ...this.props.ingredients };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

    if (this.props.ingredients) {
      burger = (
        <Auxiliary>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls
            ingredientAdded={(ingredientName) => this.props.onIngredientAdded(ingredientName)}
            ingredientRemoved={(ingredientName) => this.props.onIngredientRemoved(ingredientName)}
            disabled={disabledInfo}
            price={this.props.totalPrice}
            purchasable={this.updatePurchaseState(this.props.ingredients)}
            ordered={this.purchaseHandler}
          />
        </Auxiliary>
      );

      orderSummary = <OrderSummary
        price={this.props.totalPrice}
        ingredients={this.props.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingredientName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName}),
    onIngredientRemoved: (ingredientName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));