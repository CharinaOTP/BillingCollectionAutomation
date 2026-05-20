import Papa from 'papaparse'

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
    

    // Click JMS menu icon
    cy.get('[path="/apps/csms/bca2/main-billing/jms"] > .ant-menu-submenu-title > .ant-menu-title-content > a > .ant-flex')
      .should('be.visible')
      .click()

    cy.wait(3000)
   

    // Click JMS Maintenance Card
    cy.contains('JMS Maintenance')
      .should('be.visible')
      .click({ force: true })

    cy.wait(3000)


    // Read CSV
    cy.fixture('jms_form.csv').then((csvData) => {
      const parsed = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      })

      parsed.data.forEach((row) => {
        // Click Create button
        cy.get('.ant-btn-primary')
          .contains('Create')
          .should('be.visible')
          .click()
       

        // Account Number
          cy.get('#accountNumber')
          .should('be.visible')
          .clear()
          .type(`${row.accountNumber}{enter}`, {delay:200})
    

        // Contact Number
          cy.get('#contactNumber')
          .should('be.visible')
          .clear()
          .type(`${row.contactNumber}{enter}`, {delay:200})

          // Contact Number
         cy.get('#contactPerson')
          .should('be.visible')
          .clear()
          .type(`${row.contactPerson}{enter}`, {delay:200})


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
          
          // //Select Water Source
        
          // cy.contains('Water Source')
          // .parents('.ant-form-item')
          // .find('.ant-select-selector')
          // .click()


          // cy.contains('.ant-select-item-option-content', row.waterSource)
          // .click()
          // cy.wait(3000)


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
       
           // // Employee
        //   // Convert CSV value like 2651 -> 02651
        //   const employee = String(row.employee).padStart(5, '0')

        //   // Open Employee dropdown
        //   cy.get('.ant-select-selector')
        //   .eq(0)
        //    .click()

        //     // Select matching employee from dropdown
        //     cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        //     .contains('.ant-select-item-option-content', employee)
        //     .click()


// // Dispatch
// cy.get('[style="flex: 1 1 0%; display: flex; gap: 4px; padding-left: 8px;"] > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker')
//   .should('be.visible')
//   .click()
//   .type(`${dispatchDate}{enter}`, { delay: 200 });

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

        // Status
          // cy.get(':nth-child(8) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
          //   .should('be.visible')  
          //   .click()
          //  .type(`${row.status}{enter}`, { delay: 200 });
          // Select Status from CSV
            
          const status = String(row.status || '').trim();

              cy.get('#statusCode')
              .parents('.ant-select')
              .find('.ant-select-selector')
              .should('be.visible')
              .click();

            cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
              .contains('.ant-select-item-option-content', status)
              .click();

      
        // Save
        cy.contains('button', 'Save')
          .should('be.visible')
          .click()

        cy.wait(3000)

        //Click LUP to push through

        cy.get('.ant-row > .ant-btn-primary')
        .should('be.visible')
        .click()

        cy.wait(2000)

        //Close Form 
        cy.get('.ant-modal-footer > .ant-btn-default')
        .should('be.visible')
        .click()
        
      })
    })
  })
})