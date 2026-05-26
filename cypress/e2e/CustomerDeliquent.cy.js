import Papa from 'papaparse'

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
     .type('213178{enter}')

    cy.wait(4000)

   
  cy.get('[data-row-key="02-213178-5"] > :nth-child(3)', { timeout: 10000 })
  .should('be.visible')
  .dblclick();
      cy.wait(4000)


       cy.contains('JMS Transactions')
        .should('be.visible')
          .click()

        cy.get('.ant-row > .ant-btn')
        .should('be.visible')
        .click()
       

          // READ CSV HERE
            cy.fixture('customerdeliquent.csv').then((csvData) => {
              Papa.parse(csvData, {
              header: true,
              skipEmptyLines: true,

              complete: (result) => {

              result.data.forEach((row) => {
            
                cy.wait(2000)
                
        // Account Number
          cy.get('#accountNumber')
          .should('be.visible')
          .clear()
          .type(`${row.accountNumber}{enter}`, {delay:300})
    

        // Contact Number
          cy.get('#contactNumber')
          .should('be.visible')
          .clear()
          .type(`${row.contactNumber}{enter}`, {delay:200})

          cy.get('input#contactPerson')
          .should('be.enabled')
            .focus()
            .clear()
          .type(row.contactPerson, { delay: 200 })


          // Office dropdown from CSV
          cy.get('.ant-select-selector')
          .eq(1)
          .click()

          cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
          .contains('.ant-select-item-option-content', row.office)
          .click()
      

          //Select Mode
          cy.contains('label', 'Mode')
          .parents('.ant-form-item')
          .find('.ant-select-selector')
          .click()

          cy.contains('.ant-select-item-option-content', row.mode)
          .click()


          // Select Water Source from CSV
              const waterSource = String(row.waterSource || '').trim();

                cy.get('#waterSourceCode')
                 .parents('.ant-select')
                .find('.ant-select-selector')
                 .should('be.visible')
                   .click();

                  cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
                    .contains('.ant-select-item-option-content', waterSource)
                    .should('be.visible')
                    .click();
          

// JMS Code from CSV, example: 100 -> 0100
const jmsCode = String(row.jmsCode || '').trim().padStart(4, '0');

cy.get('#lU_JmsCodeId')
  .should('be.visible')
  .click()
  .clear()
  .type(jmsCode, { delay: 200 });

// Frontend shows: "0100 - Service Line Leak"
// CSV only has: "0100"
cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
  .contains('.ant-select-item-option-content', new RegExp(`^${jmsCode}`))
  .should('be.visible')
  .click();

          // Select Area from CSV: North or South
          cy.get(':nth-child(5) > :nth-child(1) > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
         .should('be.visible')
          .click()
           .type(`${row.area}{enter}`, { delay: 200 });
          

          //Select Transaction Category
          cy.get(':nth-child(5) > :nth-child(2) > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')

          // Detailed Concern
          cy.get('#problemDetails')
          .should('be.visible')
          .clear()
          .type(row.detailedConcern)

 

          // Assessment
          cy.get('#assessment')
          .should('be.visible')
          .clear()
          .type(row.assessment)

         // Employee ID from CSV
const employee = String(row.employee || '').trim().padStart(6, '0');

cy.get('#employeeId')
  .should('be.visible')
  .click()
  .clear()
  .type(employee, { delay: 200 });

// If frontend shows "02651 - Employee Name"
cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
  .contains('.ant-select-item-option-content', new RegExp(`^${employee}`))
  .should('be.visible')
  .click();
       

       // Dispatch
const dispatchDate = String(row.dispatchedAt).padStart(4, '0');

cy.get('[style="flex: 1 1 0%; display: flex; gap: 4px; padding-left: 8px;"] > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker')
  .should('be.visible')
  .click()
  .type(`${dispatchDate}{enter}`, { delay: 300 });


// Responded
const respondedDate = String(row.respondedAt).padStart(4, '0');

cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker')
  .should('be.visible')
  .click()
  .type(`${respondedDate}{enter}`, { delay: 300 });


// Completed
const completedDate = String(row.completedAt).padStart(4, '0');

cy.get(':nth-child(3) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker')
  .should('be.visible')
  .click()
  .type(`${completedDate}{enter}`, { delay: 300 });


// Feedback
const feedbackDate = String(row.feedbackAt).padStart(4, '0');

cy.get(':nth-child(4) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker')
  .should('be.visible')
  .click()
  .type(`${feedbackDate}{enter}`, { delay: 300 });

           //Result
           cy.get('#result')
           .should('be.visible')  
            .click()
           .type(`${row.result}{enter}`, { delay: 400 });

        // Remarks
        cy.get('#remarks')
          .should('be.visible')
          .clear()
          .type(row.remarks)

            
          const status = String(row.status || '').trim();

              cy.get('#statusCode')
              .parents('.ant-select')
              .find('.ant-select-selector')
              .should('be.visible')
              .click();

            cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
              .contains('.ant-select-item-option-content', status)
              .click();

      

      cy.wait(3000)
        //Create Maintenance Order
        cy.get('.ant-modal-footer > :nth-child(2)')
         .should('be.visible')
        .click()

        //Fill out the removed meter
       cy.get('input[id="maintenanceOrder_removedMeterActionTaken_meterNumber"]')
        .should('be.visible')
        .click()
        .type('520123456J')

                
      cy.get('input[id="maintenanceOrder_removedMeterActionTaken_meterType"]')
      .should('be.visible')
      .click()
      .type('SEOCHANG')

      cy.get('input[id="maintenanceOrder_removedMeterActionTaken_meterReading"]')
      .should('be.visible')
      .click()
      .type('143')

      cy.get('#maintenanceOrder_remarks')
      .should('be.visible')
      .click()
      .type('For Review.')

      cy.get('#maintenanceOrder_result')
      .should('be.visible')
      .click()
      .type('For Completion')


      // Approved by
cy.get('#maintenanceOrder_approvedBy')
  .should('be.visible')
  .click()
  .type('002651', { delay: 200 });

cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
  .contains('.ant-select-item-option-content', '002651')
  .click();


// Investigator Employee ID
cy.get('#maintenanceOrder_investigatorEmployeeId')
  .should('be.visible')
  .click()
  .type('002651', { delay: 200 });

cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
  .contains('.ant-select-item-option-content', '002651')
  .click();
              //Representative

              cy.get('#maintenanceOrder_representative')
               .should('be.visible')
               .click()
               .type('CHARINA CASTILLANO', { delay: 200 });


       // Save
        cy.contains('button', 'Save')
          .should('be.visible')
          .click()

        cy.wait(3000)

        cy.contains('button', 'Yes')
        .should('be.visible')
        .click()
        cy.wait(3000)

        cy.contains('button', 'Cancel').click()

        cy.get('[data-row-key="2026052600135"] > :nth-child(4)')
        .should('be.visible')
        .dblclick()
        cy.wait(6000)

          })
        }
        })
      })
    })
})
