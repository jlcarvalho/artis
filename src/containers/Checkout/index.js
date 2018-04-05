import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { themr } from 'react-css-themr'
import { connect } from 'react-redux'
import { State, Action, withStatechart } from 'react-automata'
import ReactGA from 'react-ga'
import {
  isEmpty,
  isNil,
  reject,
  path,
  pathOr,
  filter,
  applySpec,
} from 'ramda'

import { changeScreenSize } from '../../actions'
import { request, strategies } from '../../utils/parsers/request'
import getErrorMessage from '../../utils/data/errorMessages'
import { hasAllTransactionData, hasRequiredPageData } from '../../utils/validations'

import {
  ProgressBar,
  Header,
  Footer,
  Cart,
  LoadingInfo,
  ErrorInfo,
  SuccessInfo,
} from '../../components'
import { Grid, Row, Col } from '../../components/Grid'

import CustomerPage from '../../pages/Customer'
import AddressesPage from '../../pages/Addresses'
import PaymentPage from '../../pages/Payment'
import SwitchPayment from '../../pages/Payment/SwitchPayment'
import CreditCardAndBoletoPage from '../../pages/Payment/CreditCardAndBoleto'
import MultipleCreditCardsPage from '../../pages/Payment/MultipleCreditCards'

import statechart from './statechart'

const strategyName = 'pagarme'

const stepsTitles = [
  {
    page: 'customer',
    title: 'Identificação',
    visible: true,
  },
  {
    page: 'addresses',
    title: 'Endereços',
    visible: true,
  },
  {
    page: 'payment',
    title: 'Forma de Pagamento',
    visible: true,
  },
  {
    page: 'singleCreditCard',
    visible: false,
  },
  {
    page: 'singleBoleto',
    visible: false,
  },
  {
    page: 'creditCardAndBoleto',
    visible: false,
  },
  {
    page: 'transaction',
    visible: false,
  },
  {
    page: 'confirmation',
    title: 'Confirmação',
    visible: true,
  },
]

const applyThemr = themr('UICheckout')

class Checkout extends Component {
  state = {
    closingEffect: false,
    collapsedCart: true,
  }

  componentDidMount () {
    this.props.changeScreenSize(window.innerWidth)
    window.addEventListener('resize', this.handleNewScreenSize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleNewScreenSize)
  }

  onTransactionReturn = (response, onSuccess, onError) => {
    const {
      status,
      boleto_barcode: boletoUrl,
      boleto_url: boletoBarcode,
    } = response

    if (status === 'authorized') {
      let successState = { }

      if (boletoBarcode || boletoUrl) {
        successState = {
          boletoUrl,
          boletoBarcode,
        }
      }

      if (onSuccess) {
        onSuccess(response)
      }

      return this.setState({
        ...successState,
      }, this.props.transition('TRANSACTION_SUCCESS'))
    }

    if (onError) {
      onError(response)
    }

    return this.setState({
      ...getErrorMessage(response),
    }, this.props.transition('TRANSACTION_FAILURE'))
  }

  handleNewScreenSize = () => {
    this.props.changeScreenSize(window.innerWidth)
  }

  navigateToPage () {
    const { machineState } = this.props
    const { value, history } = machineState

    if (!hasRequiredPageData(value, this.props)) {
      return
    }

    if (pathOr('', ['value'], history) === 'payment') {
      this.navigatePreviousPage()
      return
    }

    this.navigateNextPage()
  }

  navigatePreviousPage = () => {
    this.props.transition('PREV')
  }

  navigateNextPage = () => {
    this.props.transition('NEXT')
  }

  handleBackButton = () => {
    this.navigatePreviousPage()
  }

  handleFormSubmit = (values, errors) => {
    if (isEmpty(values) || !isEmpty(reject(isNil, errors))) {
      return
    }

    this.navigateNextPage()
  }

  handleToggleCart = () => {
    this.setState(({ collapsedCart }) => ({ collapsedCart: !collapsedCart }))
  }

  handlePageTransition = page => () => this.props.transition(page)

  close () {
    const { targetElement } = this.props

    ReactGA.event({
      category: 'Header',
      action: 'Click - Close Button',
    })

    this.setState({ closingEffect: true })

    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(
        targetElement
      )
    }, 500)
  }

  enterLoading = () => {
    const transactionModel = applySpec({
      amount: path(['apiData', 'transaction', 'amount']),
      publickey: path(['apiData', 'key']),
      postback: path(['apiData', 'configs', 'postback']),
      onSuccess: path(['apiData', 'configs', 'onSuccess']),
      onError: path(['apiData', 'configs', 'onError']),
      items: path(['apiData', 'formData', 'items']),
      customer: path(['customer']),
      shipping: path(['shipping']),
      billing: path(['billing']),
      payment: path(['payment']),
    })

    const transactionData = transactionModel(this.props)

    if (hasAllTransactionData(transactionData)) {
      request(transactionData, strategies[strategyName])
        .then(response =>
          this.onTransactionReturn(
            response,
            transactionData.onSuccess,
            transactionData.onError,
          ))
        .catch(() => this.props.transition('TRANSACTION_FAILURE'))
    } else {
      this.props.transition('TRANSACTION_FAILURE')
    }
  }

  renderPages () {
    const { transaction } = this.props.apiData

    const { base } = this.props

    return (
      <React.Fragment>
        <State value="customer">
          <CustomerPage
            base={base}
            handleSubmit={this.handleFormSubmit}
          />
        </State>
        <State value="addresses">
          <AddressesPage
            base={base}
            handleSubmit={this.handleFormSubmit}
          />
        </State>
        <State value="payment">
          <PaymentPage
            base={base}
            title="Dados de Pagamento"
            transaction={transaction}
            handleSubmit={this.handleFormSubmit}
            handlePageTransition={this.handlePageTransition}
          />
        </State>
        <State value="transaction">
          <LoadingInfo />
        </State>
        <Action show="onTransactionError">
          <ErrorInfo
            base={base}
            title={this.state.errorTitle}
            subtitle={this.state.errorSubtitle}
          />
        </Action>
        <Action show="onTransactionSuccess">
          <SuccessInfo
            base={base}
            boletoBarcode={this.state.boletoBarcode}
            boletoUrl={this.state.boletoUrl}
          />
        </Action>
        <State value="singleCreditCard">
          <SwitchPayment
            transaction={transaction}
            paymentType={'creditcard'}
            handleSubmit={this.handleFormSubmit}
            defaultMethod={'creditcard'}
          />
        </State>
        <State value="singleBoleto">
          <SwitchPayment
            transaction={transaction}
            paymentType={'boleto'}
            handleSubmit={this.handleFormSubmit}
            defaultMethod={'boleto'}
          />
        </State>
        <State value="creditCardAndBoleto">
          <CreditCardAndBoletoPage
            transaction={transaction}
            handleSubmit={this.handleFormSubmit}
          />
        </State>
        <State value="multipleCreditCards">
          <MultipleCreditCardsPage
            transaction={transaction}
            handleSubmit={this.handleFormSubmit}
          />
        </State>
      </React.Fragment>
    )
  }

  renderCart () {
    const { formData, transaction, configs } = this.props.apiData

    const { items } = formData
    const { enableCart, freightValue } = configs
    const { amount } = transaction
    const { theme, base, shipping, customer } = this.props

    return enableCart && (
      <Col
        tv={3}
        desk={3}
        tablet={3}
        palm={0}
        className={theme.cartWrapper}
      >
        <Cart
          base={base}
          items={items}
          amount={amount}
          shipping={shipping}
          customer={customer}
          freight={freightValue}
          onToggleCart={this.handleToggleCart}
          collapsed={this.props.isBigScreen ? false : this.state.collapsedCart}
          showCloseButton={this.props.isBigScreen}
        />
      </Col>
    )
  }

  render () {
    const {
      theme,
      machineState,
      isBigScreen,
      base,
    } = this.props

    const params = pathOr({}, ['apiData', 'params'], this.props)
    const configs = pathOr({}, ['apiData', 'configs'], this.props)

    const pages = filter(value =>
      !hasRequiredPageData(value.page, this.props), stepsTitles
    )

    const firstPage = pages[0].page

    const isCartButtonVisible = configs.enableCart ?
      !isBigScreen :
      false

    const checkoutColSize = configs.enableCart ? 9 : 12

    const shouldDisablePrevButton =
      machineState.value === firstPage ||
      machineState.value === 'transaction' ||
      machineState.value === 'confirmation'

    return (
      <div
        className={classNames(
          theme.checkout,
          theme[base],
          {
            [theme.closingEffect]: this.state.closingEffect,
          },
        )}
      >
        <div className={theme.wrapper}>
          <Grid className={theme.page}>
            <Row stretch={isBigScreen}>
              {this.renderCart()}
              <Col
                tv={checkoutColSize}
                desk={checkoutColSize}
                tablet={checkoutColSize}
                palm={12}
              >
                <Header
                  base={base}
                  logoAlt={configs.companyName}
                  logoSrc={configs.image}
                  onPrev={this.handleBackButton}
                  onClose={this.close.bind(this)}
                  prevButtonDisabled={shouldDisablePrevButton}
                />
                <div
                  className={theme.content}
                >
                  <ProgressBar
                    base={base}
                    steps={pages}
                    activePage={machineState.value}
                  />
                  {this.renderPages()}
                </div>
                <Footer
                  base={base}
                  total={params.amount}
                  onToggleCart={this.handleToggleCart}
                  companyName={configs.companyName}
                  cartButtonVisible={isCartButtonVisible}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}

Checkout.propTypes = {
  theme: PropTypes.shape({
    content: PropTypes.string,
    wrapper: PropTypes.string,
    closingEffect: PropTypes.string,
    checkout: PropTypes.string,
    cartWrapper: PropTypes.string,
    checkoutWrapper: PropTypes.string,
  }),
  apiData: PropTypes.shape({
    key: PropTypes.string.isRequired,
    configs: PropTypes.shape({
      companyName: PropTypes.string,
      image: PropTypes.string,
      themeBase: PropTypes.string,
      primaryColor: PropTypes.string,
      seconryColor: PropTypes.string,
      postback: PropTypes.string,
      enableCart: PropTypes.bool,
      onSuccess: PropTypes.func,
      onError: PropTypes.func,
      onClose: PropTypes.func,
    }).isRequired,
    formData: PropTypes.shape({
      customer: PropTypes.object,
      billing: PropTypes.object,
      shipping: PropTypes.object,
      items: PropTypes.arrayOf(PropTypes.object),
    }),
    transaction: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      defaultMethod: PropTypes.string.isRequired,
      paymentMethods: PropTypes.shape(),
    }),
  }).isRequired,
  base: PropTypes.string.isRequired,
  changeScreenSize: PropTypes.func.isRequired,
  targetElement: PropTypes.object.isRequired, // eslint-disable-line
  transition: PropTypes.func.isRequired,
  shipping: PropTypes.object, // eslint-disable-line
  customer: PropTypes.object.isRequired, // eslint-disable-line
  isBigScreen: PropTypes.bool,
  machineState: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
}

Checkout.defaultProps = {
  theme: {},
  shipping: {},
  apiData: {},
  isBigScreen: false,
}

const mapStateToProps = ({ screenSize, pageInfo }) => ({
  isBigScreen: screenSize.isBigScreen,
  shipping: pageInfo.shipping,
  billing: pageInfo.billing,
  customer: pageInfo.customer,
  payment: pageInfo.payment,
})

export default connect(
  mapStateToProps,
  {
    changeScreenSize,
  }
)(applyThemr(withStatechart(statechart)(Checkout)))
