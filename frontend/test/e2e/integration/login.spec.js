describe('Login screen', () => {
  it('Logs in as a doctor', () => {
    cy.server()
    cy.fixture('patients').as('patientsJSON')
    cy.route('GET', `${Cypress.env('apiUrl')}/patients/**`, '@patientsJSON').as(
      'getPatients'
    )

    cy.visit('/login')

    cy.get('input[type="text"]').type(Cypress.env('username'))
    cy.get('input[type="password"]').type(Cypress.env('password'))

    cy.get('button.primary').click()

    cy.location('pathname', { timeout: 10000 }).should('eq', '/doctor/')

    cy.wait('@getPatients').then(({ response }) => {
      const patients = response.body.items
      cy.get('tbody > tr').should('have.length', patients.length)
    })
  })
})
