import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Boleto extends PureComponent { //eslint-disable-line
  render () {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox={`0 0 ${this.props.viewBox[0]} ${this.props.viewBox[1]}`}
      >
        <defs>
          <linearGradient
            id="barcode-a"
            x1="889.376%"
            x2="0%"
            y1="17.381%"
            y2="100%"
          >
            <stop offset="0%" stopColor={this.props.gradient.initial} />
            <stop offset="100%" stopColor={this.props.gradient.final} />
          </linearGradient>
          <linearGradient
            id="barcode-b"
            x1="366.071%"
            x2="0%"
            y1="-146.973%"
            y2="100%"
          >
            <stop offset="0%" stopColor={this.props.gradient.initial} />
            <stop offset="100%" stopColor={this.props.gradient.final} />
          </linearGradient>
        </defs>
        <g fill={this.props.fill} fillRule="evenodd">
          <path
            fillRule="nonzero"
            d="M4.78125,36 L46.21875,36 C48.8484375,36 51,33.6966825 51,30.8815166 L51,12.9668246 L38.8875,0 L4.78125,0 C2.1515625,0 0,2.30331754 0,5.11848341 L0,30.7962085 C0,33.6966825 2.1515625,36 4.78125,36 Z M39.365625,2.98578199 L48.290625,12.5402844 L42.553125,12.5402844 C40.8,12.5402844 39.365625,11.0047393 39.365625,9.12796209 L39.365625,2.98578199 Z M1.59375,5.11848341 C1.59375,3.24170616 3.028125,1.70616114 4.78125,1.70616114 L37.771875,1.70616114 L37.771875,9.04265403 C37.771875,11.8578199 39.9234375,14.1611374 42.553125,14.1611374 L49.40625,14.1611374 L49.40625,30.7962085 C49.40625,32.6729858 47.971875,34.2085308 46.21875,34.2085308 L4.78125,34.2085308 C3.028125,34.2085308 1.59375,32.6729858 1.59375,30.7962085 L1.59375,5.11848341 Z" //eslint-disable-line
          />
          <rect
            width="3.984"
            height="7.2"
            x="8.766"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="2.391"
            height="7.2"
            x="14.344"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="2.391"
            height="7.2"
            x="34.266"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="3.188"
            height="7.2"
            x="18.328"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="3.188"
            height="7.2"
            x="39.047"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="2.391"
            height="7.2"
            x="22.313"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="3.188"
            height="7.2"
            x="25.5"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="1.594"
            height="7.2"
            x="4.781"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="1.594"
            height="7.2"
            x="30.281"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <rect
            width="1.594"
            height="7.2"
            x="44.625"
            y="24"
            fill="url(#barcode-a)"
            fillRule="nonzero"
          />
          <path
            fill="url(#barcode-b)"
            fillRule="nonzero"
            d="M31.828236 6.4L5.62488896 6.4C5.15835662 6.4 4.78125 6.7584 4.78125 7.2 4.78125 7.6416 5.15835662 8 5.62488896 8L31.828236 8C32.2947684 8 32.671875 7.6416 32.671875 7.2 32.671875 6.7584 32.2947684 6.4 31.828236 6.4zM26.2703787 11.2L5.6046213 11.2C5.14929697 11.2 4.78125 11.5584 4.78125 12 4.78125 12.4416 5.14929697 12.8 5.6046213 12.8L26.2703787 12.8C26.725703 12.8 27.09375 12.4416 27.09375 12 27.09375 11.5584 26.725703 11.2 26.2703787 11.2zM6.375 16L5.578125 16C5.13745313 16 4.78125 16.3584 4.78125 16.8 4.78125 17.2416 5.13745313 17.6 5.578125 17.6L6.375 17.6C6.81567188 17.6 7.171875 17.2416 7.171875 16.8 7.171875 16.3584 6.81567188 16 6.375 16zM11.15625 16L9.5625 16C9.12182812 16 8.765625 16.3584 8.765625 16.8 8.765625 17.2416 9.12182812 17.6 9.5625 17.6L11.15625 17.6C11.5969219 17.6 11.953125 17.2416 11.953125 16.8 11.953125 16.3584 11.5969219 16 11.15625 16zM15.9375 16L15.140625 16C14.6999531 16 14.34375 16.3584 14.34375 16.8 14.34375 17.2416 14.6999531 17.6 15.140625 17.6L15.9375 17.6C16.3781719 17.6 16.734375 17.2416 16.734375 16.8 16.734375 16.3584 16.3781719 16 15.9375 16zM20.71875 16L19.125 16C18.6843281 16 18.328125 16.3584 18.328125 16.8 18.328125 17.2416 18.6843281 17.6 19.125 17.6L20.71875 17.6C21.1594219 17.6 21.515625 17.2416 21.515625 16.8 21.515625 16.3584 21.1594219 16 20.71875 16zM23.3404687 16.2233962C23.1962344 16.3763522 23.109375 16.5856604 23.109375 16.7949686 23.109375 17.0042767 23.1962344 17.2135849 23.3404687 17.3665409 23.4910781 17.5114465 23.6990625 17.6 23.90625 17.6 24.1134375 17.6 24.320625 17.5114465 24.4720313 17.3665409 24.6154688 17.2135849 24.703125 17.0042767 24.703125 16.7949686 24.703125 16.5856604 24.6154688 16.3763522 24.4720313 16.2233962 24.1692187 15.9255346 23.6265469 15.9255346 23.3404687 16.2233962z" //eslint-disable-line
          />
        </g>
      </svg>
    )
  }
}

Boleto.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  gradient: PropTypes.shape({
    initial: PropTypes.string.isRequired,
    final: PropTypes.string.isRequired,
  }).isRequired,
}

export default Boleto
