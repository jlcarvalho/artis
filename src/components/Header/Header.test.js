import React from 'react'
import { mount } from 'enzyme'

import Header from './index'
import { ProgressBar } from '..'
import steps from '../../containers/Checkout/steps'

describe('Header', () => {
  it('should mount', () => {
    const component = mount(
      <Header />
    )

    expect(component.find('img')).toHaveLength(0)
  })

  it('should filter visible steps', () => {
    const activeStep = 'billing'

    const component = mount(
      <Header
        steps={steps}
        activeStep={activeStep}
      />
    )

    expect(component.find(ProgressBar).props().steps).toHaveLength(5)
  })

  it('should calculate progress 40 percent', () => {
    const activeStep = 'billing'

    const component = mount(
      <Header
        steps={steps}
        activeStep={activeStep}
      />
    )

    expect(component.find(ProgressBar).props().percentage).toBe(40)
  })

  it('should calculate progress 100 percent', () => {
    const activeStep = 'confirmation'

    const component = mount(
      <Header
        steps={steps}
        activeStep={activeStep}
      />
    )

    expect(component.find(ProgressBar).props().percentage).toBe(100)
  })
})