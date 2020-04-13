// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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
