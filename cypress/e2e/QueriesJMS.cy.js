Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Q is not a function')) {
    return false
  }
})

describe('JMS Form CSV Upload', () => {
  it('logs in and fills out JMS forms from CSV', () => {
    cy.viewport(1920, 1080)

    cy.visit('https://dev-myportal.davao-water.gov.ph/apps/')
    cy.wait(8000)

    // Login
    cy.get('[name="username"]').should('be.visible').type('001158')
    cy.get('[name="password"]').should('be.visible').type('1986!May20')

    cy.contains('button', 'SIGN IN')
      .should('be.visible')
      .click()

    cy.wait(5000)
  

    // Open Billing module
    cy.get('.sc-hmdnzv > :nth-child(4)')
      .scrollIntoView()
      .should('be.visible')
      .click()

    cy.wait(6000)
    

    // Click Billing and Collection
    cy.get(':nth-child(1) > .ant-btn')
      .should('be.visible')
      .click()

    cy.wait(4000)
    

    // Click System icon
   
      cy.get('.ant-menu-item-icon')
      .eq(0)
      .click()

    cy.wait(5000)

    cy.contains('a', 'Queries').click()
      .should('be.visible')
      .click()

    cy.wait(3000)
    cy.url().should('include', '/queries')
    cy.wait(2000)

    cy.contains('Customer Inquiry')
    .should('be.visible')
    .click()

    cy.wait(3000)

    cy.get('.ant-input', { timeout: 10000 })
    .scrollIntoView({ duration: 1000 })
    .should('be.visible')
    .click()
    .clear()
     .type('000001{enter}')

    cy.wait(4000)

    cy.get('[data-row-key="10-032450-5"] > :nth-child(2)')
    .should('be.visible')
    .dblclick()

      cy.wait(4000)

       cy.contains('JMS Transactions')
        .should('be.visible')
          .click()


        cy.wait(2000)

 })
})
