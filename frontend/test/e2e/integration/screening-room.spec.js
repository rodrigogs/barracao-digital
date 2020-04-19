import faker from 'faker/locale/pt_BR'
import cpf from 'cpf'

describe('Screening rooom screen', () => {
  it('Register a patient with existing CEP', () => {
    const randomWords = faker.random
      .words(3)
      .split(' ')
      .join(', ')
    const phone = faker.phone.phoneNumber('(##) ####-####')

    cy.visit('/screening-room')

    cy.contains('.v-card__text', 'Termos de uso para utilizadores')
    cy.get('.v-card__actions > .v-btn').click()

    cy.get('input[id="name"]').type(faker.name.findName())
    cy.get('input[id="age"]').type(faker.random.number(120))
    cy.get('input[id="cpf"]').type(cpf.generate())
    cy.get('input[id="cep"]').type('55555-550')

    cy.get('button#myDataBtn').click()

    cy.get('input[id="meds"]').type(randomWords)
    cy.get('input[id="allergies"]').type(randomWords)
    cy.get('input[id="covenant"]').type('UNIMED')

    cy.get('button#medicalInformationsBtn').click()

    cy.get('input[id="phone"]').type(phone)
    cy.get('input[id="email"]').type(faker.internet.email())
    cy.get('input[id="whatsapp"]').type(phone)
    cy.get('input[id="telegram"]').type(phone)
    cy.get('input[id="hangout"]').type(phone)
    cy.get('input[id="skype"]').type(faker.internet.userName())

    cy.get('button#contactBtn').click()

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
})
