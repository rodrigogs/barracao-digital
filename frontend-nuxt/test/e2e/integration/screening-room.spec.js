describe('Screening rooom screen', () => {
  it('Register a patient', () => {
    cy.visit('/screening-room')

    cy.contains('p', 'Adesão para pacientes')
    cy.get('button').click()

    cy.get('input[id="name"]').type('John Doe')
    cy.get('input[id="age"]').type('30')
    cy.get('input[id="cpf"]').type('652.192.799-04')
    cy.get('input[id="cep"]').type('88330-000')

    cy.get('button#myDataBtn').click()

    cy.get('input[id="meds"]').type('AAS')
    cy.get('input[id="allergies"]').type('Dipirona')
    cy.get('input[id="covenant"]').type('UNIMED')

    cy.get('button#medicalInformationsBtn').click()

    cy.get('input[id="phone"]').type('(48) 3333-4444')
    cy.get('input[id="email"]').type('john.doe@gmail.com')
    cy.get('input[id="whatsapp"]').type('(48) 3333-4444')
    cy.get('input[id="telegram"]').type('(48) 3333-4444')
    cy.get('input[id="hangout"]').type('(48) 3333-4444')
    cy.get('input[id="skype"]').type('john.doe@gmail.com')

    cy.get('button#contactBtn').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/patient/')
  })
})
