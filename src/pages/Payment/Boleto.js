import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ThemeConsumer,
} from 'former-kit'
import {
  __,
  always,
  assoc,
  divide,
  ifElse,
  isNil,
  multiply,
  path,
  pipe,
} from 'ramda'

import {
  NavigationBar,
} from '../../components'
import {
  addPageInfo,
  decrementFinalAmount,
} from '../../actions'
import {
  formatToBRL,
} from './../../utils/masks/'
import BoletoDark from '../../../src/images/boleto-dark.svg'

const consumeTheme = ThemeConsumer('UIBoletoPage')

class Boleto extends React.PureComponent {
  componentDidMount = () => {
    const {
      handleDecrementFinalAmount,
      transaction,
    } = this.props

    const amount = path([
      'amount',
    ], transaction)
    const discountType = path([
      'paymentConfig',
      'boleto',
      'discount',
      'type',
    ], transaction)
    const discountValue = path([
      'paymentConfig',
      'boleto',
      'discount',
      'value',
    ], transaction)
    let value = discountValue

    if (discountType === 'percentage') {
      value = pipe(
        divide(__, 100),
        multiply(amount)
      )(discountValue)
    }

    if (value) {
      handleDecrementFinalAmount(value)
    }
  }

  getSubtitle =(
    path([
      'paymentConfig',
      'boleto',
      'subtitle',
    ])
  )

  getValueToPayText = ifElse(
    pipe(
      path([
        'paymentConfig',
        'boleto',
        'discount',
        'value',
      ]),
      isNil,
    ),
    always('Valor a pagar'),
    always('Valor com desconto')
  )

  handleClick = () => {
    const errors = {}
    const paymentConfig = path(['transaction', 'paymentConfig'], this.props)
    const values = { boleto: true }
    const type = 'boleto'

    const method = assoc(
      'type',
      type,
      paymentConfig.boleto,
    )

    const payment = {
      method,
      type,
      info: {},
    }

    this.props.handlePageChange({
      page: 'payment',
      pageInfo: payment,
    })

    this.props.handleSubmit(values, errors)
  }

  render () {
    const {
      finalAmount,
      handlePreviousButton,
      theme,
      transaction,
    } = this.props
    const subtitle = this.getSubtitle(transaction)

    return (
      <section className={theme.wrapper}>
        <header className={theme.header}>
          <h1 className={theme.title}>boleto bancário</h1>
          {
            subtitle &&
            <h2 className={theme.subtitle}>{ subtitle }</h2>
          }
        </header>
        <div className={theme.content}>
          <BoletoDark className={theme.icon} />
          <h3 className={theme.amountTitle}>
            {this.getValueToPayText(transaction)}
          </h3>
          <span className={theme.amount}>{formatToBRL(finalAmount)}</span>
          <p className={theme.warning}>
            Ao continuar, seu boleto bancário será criado para
            que você faça o pagamento</p>
        </div>
        <footer className={theme.footer}>
          <NavigationBar
            handlePreviousButton={handlePreviousButton}
            handleNextButton={this.handleClick}
            prevTitle="Ops, voltar"
            nextTitle={`Pagar ${formatToBRL(finalAmount)}`}
          />
        </footer>
      </section>
    )
  }
}


Boleto.propTypes = {
  finalAmount: PropTypes.number.isRequired,
  handleDecrementFinalAmount: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePreviousButton: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    amount: PropTypes.string,
    amountTitle: PropTypes.string,
    content: PropTypes.string,
    footer: PropTypes.string,
    header: PropTypes.string,
    icon: PropTypes.string,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    warning: PropTypes.string,
    wrapper: PropTypes.string,
  }).isRequired,
  transaction: PropTypes.shape({
    amount: PropTypes.number,
    paymentConfig: PropTypes.shape({
      boleto: PropTypes.shape({
        subtitle: PropTypes.string,
        discount: PropTypes.shape({
          type: PropTypes.string,
          value: PropTypes.number,
        }),
      }),
    }),
    paymentMethods: PropTypes.arrayOf(PropTypes.array),
  }).isRequired,
}

const mapStateToProps = ({ transactionValues }) => ({
  finalAmount: transactionValues.finalAmount,
})

const mapDispatchToProps = {
  handleDecrementFinalAmount: decrementFinalAmount,
  handlePageChange: addPageInfo,
}

export default
connect(mapStateToProps, mapDispatchToProps)(consumeTheme(Boleto))