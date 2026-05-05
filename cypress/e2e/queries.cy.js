describe('Login Test - MyPortal', () => {

  it('logs in successfully', () => {

    //  cy.viewport(1920, 1080) 
    cy.visit('https://dev-myportal.davao-water.gov.ph/apps/')
    cy.wait(8000)

    // Username
    cy.get('[name="username"]')
      .should('be.visible')
      .type('001158')

    cy.wait(5000)

    // Password
    cy.get('[name="password"]')
      .should('be.visible')
      .type('1986!May20')

    cy.wait(5000)

    // Sign in
    cy.contains('button', 'SIGN IN').click()
    cy.wait(5000)

    // Click Billing module
    cy.get('.sc-hmdnzv > :nth-child(4)')
      .scrollIntoView({ duration: 4000 })
      .should('be.visible')
      .click()

    cy.wait(3000)

    // Click Enter/Open billing button
    cy.get(':nth-child(1) > .ant-btn')
      .click()

    cy.wait(5000)

    
    cy.get('.ant-menu-item-icon')
      .eq(0)
      .click()

    cy.wait(5000)

   
    cy.get('.ant-menu-submenu-popup')
      .contains('Queries')
      .click()

    cy.wait(3000)
    cy.url().should('include', '/queries')
    cy.wait(2000)

    cy.contains('Customer Inquiry')
    .should('be.visible')
    .click()

    cy.wait(3000)

    cy.wait(3000)

    cy.get('.ant-input', { timeout: 10000 })
    .scrollIntoView({ duration: 1000 })
    .should('be.visible')
    .click()
    .clear()
     .type('000001{enter}')

    cy.wait(4000)

cy.contains('td', 'EL COMPANIA DE JULIO,INC.', { timeout: 10000 })
  .closest('tr')
  .scrollIntoView()
  .should('be.visible')
 

cy.wait(3800)

// Validate Customer Transaction Records computation
cy.get('.ant-table-tbody tr', { timeout: 10000 }).then(($rows) => {
  const failedRows = []

  let previousBalance = null

  cy.wrap($rows).each(($row, index) => {
    const cells = [...$row.find('td')].map(td => td.innerText.trim())

    // Adjust indexes based on your table columns:
    const date = cells[0]
    const transactionDescription = cells[1]
    const orNumber = cells[2]
    const readingDate = cells[3]
    const reading = cells[4]
    const consumption = cells[5]
    const debitText = cells[6]
    const creditText = cells[7]
    const balanceText = cells[8]

    const debit = parseFloat(debitText.replace(/,/g, '')) || 0
    const credit = parseFloat(creditText.replace(/,/g, '')) || 0
    const balance = parseFloat(balanceText.replace(/,/g, '')) || 0

    if (index === 0) {
      previousBalance = balance
      return
    }

    const expectedBalance = Number((previousBalance + debit - credit).toFixed(2))
    const actualBalance = Number(balance.toFixed(2))

    if (expectedBalance !== actualBalance) {
      failedRows.push({
        row: index + 1,
        date,
        transactionDescription,
        orNumber,
        debit,
        credit,
        previousBalance,
        expectedBalance,
        actualBalance,
        status: 'FAILED'
      })
    }

    previousBalance = balance
  }).then(() => {
    if (failedRows.length > 0) {
      const csvHeader = [
        'Row',
        'Date',
        'Transaction Description',
        'OR Number',
        'Debit',
        'Credit',
        'Previous Balance',
        'Expected Balance',
        'Actual Balance',
        'Status'
      ].join(',')

      const csvRows = failedRows.map(row => [
        row.row,
        row.date,
        `"${row.transactionDescription}"`,
        row.orNumber,
        row.debit,
        row.credit,
        row.previousBalance,
        row.expectedBalance,
        row.actualBalance,
        row.status
      ].join(','))

      const csvContent = [csvHeader, ...csvRows].join('\n')

      cy.writeFile('cypress/reports/failed-computation.csv', csvContent)

      throw new Error('Wrong computation found. Check cypress/reports/failed-computation.csv')
    } else {
      cy.log('All transaction computations are correct.')
    }
  })
})

  })

})


