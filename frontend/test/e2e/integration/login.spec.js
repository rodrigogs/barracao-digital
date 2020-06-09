import patientsFixture from '../fixtures/patients.json'

describe('Login screen', () => {
  it('Logs in as a doctor', () => {
    const docPath = `facilities/${Cypress.env('cep')}/patients`

    cy.callFirestore('delete', docPath, { recursive: true })
    patientsFixture.items.forEach((patient) => {
      cy.callFirestore('add', docPath, {
        ...patient,
        createdAt: Date.now(),
      })
    })

    cy.visit('/login')

    cy.get('input[type="text"]').type(Cypress.env('username'))
    cy.get('input[type="password"]').type(Cypress.env('password'))

    cy.get('button.primary').click()

    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/doctor/')
      .then(() => {
        cy.get('#cy-doctor-status').then(($element) => {
          if ($element.text() === 'Ficar online') {
            $element.click()
          }
        })

        cy.get('tbody > tr').should('have.length', 5)
      })
  })
})
