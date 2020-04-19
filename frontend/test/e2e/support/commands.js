import faker from 'faker/locale/pt_BR'
import cpf from 'cpf'

Cypress.Commands.add('registerPatient', ({ cep = '55555-550' } = {}) => {
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
  cy.get('input[id="cep"]').type(cep)

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
})

Cypress.Commands.add(
  'login',
  (username = Cypress.env('username'), password = Cypress.env('password')) => {
    const token = btoa(`${username}:${password}`)

    cy.window()
      .its('localStorage')
      .invoke('setItem', 'auth._refresh_token.local', 'false')
      .invoke('setItem', 'auth.strategy', 'local')
      .invoke('setItem', 'auth._token.local', `Basic ${token}`)

    return Promise.resolve(token)
  }
)

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.clearLocalStorage()

  cy.visit('/login')
})
