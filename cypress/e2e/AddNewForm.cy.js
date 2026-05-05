import Papa from 'papaparse'

describe('Billing Schedule CSV Upload', () => {
  it('logs in and adds billing schedules from CSV', () => {
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

    cy.wait(5000)

    // Click Billing and Collection
    cy.get(':nth-child(1) > .ant-btn')
      .should('be.visible')
      .click()

    cy.wait(3000)

    // Click System menu icon
    cy.get('.active > .ant-flex')
      .should('be.visible')
      .click()

    cy.wait(3000)

    // Click Billing menu
    cy.contains('.ant-menu-title-content a', 'Billing')
      .should('be.visible')
      .click()

    cy.wait(2000)

    // Click Billing Parameters
    cy.contains('Billing Parameters')
      .should('be.visible')
      .click()

    cy.wait(2000)

    // Read CSV
    cy.readFile('cypress/fixtures/billing-schedules.csv').then((csvText) => {
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      })

      const rows = parsed.data

      // Converts 525 to 0525, 618 to 0618, but keeps 1225 as 1225
      const fix = (val) => {
        if (!val) return ''

        return String(val)
          .trim()
          .replace('.0', '')
          .padStart(4, '0')
      }

      rows.forEach((row) => {
        cy.log(`Adding Billing Schedule for Zone ${row.zoneNumber}`)
        cy.log(`Reading Date Fixed: ${fix(row.readingDate)}`)
        cy.log(`Billing Date Fixed: ${fix(row.billingDate)}`)

        // Wait for notification to disappear before clicking Add
        cy.get('body').then(($body) => {
          if ($body.find('.ant-notification-notice').length > 0) {
            cy.get('.ant-notification-notice', { timeout: 10000 })
              .should('not.exist')
          }
        })

        // Open Add Schedule modal
        cy.contains('button', 'Add a Schedule')
          .should('be.visible')
          .click({ force: true })

        // Reading Date
        cy.get('#billingSchedulerForm_readingDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.readingDate)}{enter}`, { force: true })

        // Billing Date
        cy.get('#billingSchedulerForm_billingDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.billingDate)}{enter}`, { force: true })

        // Payment of Final Notice
        cy.get('#billingSchedulerForm_finalNoticeDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.finalNoticeDate)}{enter}`, { force: true })

        // Due Date
        cy.get('#billingSchedulerForm_dueDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.dueDate)}{enter}`, { force: true })

        // Last Day Bank Payment
        cy.get('#billingSchedulerForm_bankDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.bankDate)}{enter}`, { force: true })

        // First Day Surcharge
        cy.get('#billingSchedulerForm_penaltyDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.penaltyDate)}{enter}`, { force: true })

        // Regular Bill Date
        cy.get('#billingSchedulerForm_regularBillDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.regularBillDate)}{enter}`, { force: true })

        // Previous Reading Date
        cy.get('#billingSchedulerForm_previousReadingDate')
          .should('be.visible')
          .clear({ force: true })
          .type(`${fix(row.previousReadingDate)}{enter}`, { force: true })

        // Zone Number - do NOT use fix here
        cy.get('#billingSchedulerForm_zoneNumber')
          .should('be.visible')
          .click({ force: true })
          .clear({ force: true })
          .type(`${String(row.zoneNumber).trim()}{enter}`, { force: true })

        // Save
        cy.contains('.ant-modal-footer button', 'Save')
          .should('be.visible')
          .click({ force: true })

        // Click confirmation/create button if it appears
        cy.get('body').then(($body) => {
          if ($body.find('.ant-row > .ant-btn-primary').length > 0) {
            cy.get('.ant-row > .ant-btn-primary')
              .should('be.visible')
              .click({ force: true })
          }
        })

        // Wait for modal to close
        cy.contains('.ant-modal-content', 'Add Billing Parameters', { timeout: 10000 })
          .should('not.exist')

        // Wait for notification after save
        cy.get('body').then(($body) => {
          if ($body.find('.ant-notification-notice').length > 0) {
            cy.get('.ant-notification-notice', { timeout: 10000 })
              .should('not.exist')
          }
        })
      })
    })
  })
})