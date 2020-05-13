import faker from 'faker/locale/pt_BR'
import cpf from 'cpf'

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
        cy.contains('span', ticket)
      })
  })

  it('Returns to the the waiting room', () => {
    cy.createPatient().then((patient) => {
      cy.visit('/patient')
      cy.get('#ticket').type(patient.ticket)
      cy.get('button.primary').click()

      cy.location('pathname', { timeout: 5000 })
        .should((pathname) => {
          expect(pathname).to.eq(`/patient/${patient.ticket}`)
        })
        .then(() => {
          cy.contains('span', patient.ticket)
        })
    })
  })

  it('Register a patient with UNexisting CEP', () => {
    cy.visit('/screening-room')

    cy.contains('.v-card__text', 'Termos de uso para utilizadores')
    cy.get('.v-card__actions > .v-btn').click()

    cy.get('input[id="name"]').type(faker.name.findName())
    cy.get('input[id="age"]').type(faker.random.number(120))
    cy.get('input[id="cpf"]').type(cpf.generate())
    cy.get('input[id="cep"]').type('11111-111')

    cy.contains(
      'div',
      'Não existe uma instalação ativa para o CEP informado.',
      { timeout: 5000 }
    )
  })
})
