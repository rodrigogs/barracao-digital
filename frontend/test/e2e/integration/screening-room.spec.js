describe('Screening rooom screen', () => {
  it('Register a patient with existing CEP', () => {
    cy.registerPatient({ cep: '55555-550' })

    cy.location('pathname', { timeout: 10000 })
      .should((pathname) => {
        const ticket = pathname.split('/')[2]
        expect(pathname).to.eq(`/patient/${ticket}`)
      })
      .then((pathname) => {
        const ticket = pathname.split('/')[2]
        cy.contains('p', 'Sua senha de retorno é')
        cy.contains('p', ticket)
      })
  })

  it('Register a patient with UNexisting CEP', () => {
    cy.registerPatient({ cep: '11111-111' })

    cy.location('pathname', { timeout: 10000 })
      .should((pathname) => {
        const ticket = pathname.split('/')[2]
        expect(pathname).to.eq(`/patient/${ticket}`)
      })
      .then(() => {
        cy.contains(
          'h3',
          'Infelizmente não encontramos nenhum barracão digital disponível para a sua área.'
        )
      })
  })
})
