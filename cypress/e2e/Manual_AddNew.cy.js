describe('template spec', () => {
 it('logs in successfully', () => {

    cy.viewport(1920, 1080) 
    cy.visit('https://dev-myportal.davao-water.gov.ph/apps/')
    cy.wait(8000)

    // Username
    cy.get('[name="username"]', {delay:2000})
      .should('be.visible')
      .type('001158')

    cy.wait(2000)

    // Password
    cy.get('[name="password"]', {delay:2000})
      .should('be.visible')
      .type('1986!May20')

    cy.wait(2000)

    // Sign in
    cy.contains('button', 'SIGN IN').click()
    cy.wait(5000)

    // Click Billing module
    cy.get('.sc-hmdnzv > :nth-child(4)')
      .scrollIntoView({ duration: 5000 })
      .should('be.visible')
      .click()

    cy.wait(5000)

    //Click Billing and Collection
     cy.get(':nth-child(1) > .ant-btn').click()
     cy.wait(3000)

    //Click System Icon 
    cy.get('.active > .ant-flex').click()
    cy.wait(5000)

      cy.contains('.ant-menu-title-content a', 'Billing')
    .should('be.visible')
    .click()
     cy.wait(2000)

    cy.contains('Billing Parameters')
    .should('be.visible')
    .click()
     cy.wait(2000)

    cy.get('.ant-space-item > .ant-btn')
    .should('be.visible')
    .click()
     cy.wait(2000)

    cy.get('#billingSchedulerForm_readingDate')
    .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

     cy.get('#billingSchedulerForm_billingDate')
    .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

      cy.get('#billingSchedulerForm_finalNoticeDate')
    .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

       cy.get('#billingSchedulerForm_finalNoticeDate')
    .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)


     cy.get('#billingSchedulerForm_dueDate')
     .should('be.visible')
    .type('0205{enter}')
     cy.wait(3000)

     cy.get('#billingSchedulerForm_bankDate')
    .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

     cy.get('#billingSchedulerForm_penaltyDate')
     .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

    cy.get('#billingSchedulerForm_regularBillDate')
     .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

     cy.get('#billingSchedulerForm_previousReadingDate')
      .should('be.visible')
    .type('0205{enter}')
     cy.wait(2000)

     cy.get('#billingSchedulerForm_zoneNumber')
      .should('be.visible')
    .type('2{enter}')
     cy.wait(2000)

     cy.get('.ant-modal-footer > .ant-btn-default').click()
     cy.wait(2000)

     











  })
})