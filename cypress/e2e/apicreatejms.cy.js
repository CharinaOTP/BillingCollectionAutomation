const fs = require('fs')
const csv = require('csv-parser')
const axios = require('axios')

const BASE_URL =
  'https://dev-api3.davao-water.gov.ph/dcwd-erp-billing-collection'

const TOKEN =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYWVhOTEwMy0wNzI3LTQzNjgtODg4Ni1hZTcwZGJmYjU2ZDUiLCJzdWIiOiIyIiwibmFtZSI6IjAwMTE1OCIsInJvbGUiOiJCaWxsaW5nIEFkbWluIiwibmJmIjoxNzc5MjUzOTE5LCJleHAiOjE3Nzk4NTg3MTksImlhdCI6MTc3OTI1MzkxOSwiaXNzIjoiZXJwQkNBQVBJIiwiYXVkIjoiZXJwQkNBQVBJIn0.AHEjScYDiBfHJpDBPg-tEGBm4Og_rFvstTMHJrXo2eUDUiGUSwkywzPjHhj7m1OhI9aJ8xP40UJjS9DV4GQZtA'

// Convert CSV date to API datetime
function toApiDate(value) {
  const raw = String(value || '').trim().padStart(8, '0')

  const day = raw.substring(0, 2)
  const month = raw.substring(2, 4)
  const year = raw.substring(4, 8)

  return `${year}-${month}-${day}T00:00:00`
}

const rows = []

fs.createReadStream('jms_create.csv')
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row)
  })
  .on('end', async () => {
    console.log(`Found ${rows.length} rows\n`)

    for (const row of rows) {
      try {
        const jmsCode = String(row.jmsCode || '')
          .trim()
          .padStart(4, '0')

        const employeeId = String(row.employee || '')
          .trim()
          .padStart(5, '0')

        const bodyData = {
          accountNumber: String(row.accountNumber || '').trim(),
          contactNumber: String(row.contactNumber || '').trim(),
          contactPerson: String(row.contactPerson || '').trim(),

          office: String(row.office || '').trim(),
          mode: String(row.mode || '').trim(),
          waterSourceCode: String(row.waterSource || '').trim(),

          jmsCode: jmsCode,
          area: String(row.area || '').trim(),
          transactionCategory: String(
            row.transactionCategory || ''
          ).trim(),

          problemDetails: String(
            row.detailedConcern || ''
          ).trim(),

          assessment: String(row.assessment || '').trim(),

          employeeId: employeeId,

          dispatchedAt: toApiDate(row.dispatchedAt),
          respondedAt: toApiDate(row.respondedAt),
          completedAt: toApiDate(row.completedAt),
          feedbackAt: toApiDate(row.feedbackAt),

          result: String(row.result || '').trim(),
          remarks: String(row.remarks || '').trim(),

          statusCode: String(row.status || '').trim(),
        }

        console.log('\n========================')
        console.log('CREATING JMS')
        console.log(bodyData)

        const response = await axios.post(
          `${BASE_URL}/api/v1/jms/job-management/create`,
          bodyData,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        )

        console.log(`SUCCESS: ${response.status}`)
        console.log(response.data)
      } catch (error) {
        console.log('\nFAILED')

        if (error.response) {
          console.log('STATUS:', error.response.status)
          console.log('ERROR:', error.response.data)
        } else {
          console.log(error.message)
        }
      }
    }

    console.log('\nDONE')
  })