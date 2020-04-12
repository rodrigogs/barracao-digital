describe('Home page', () => {
  it('Visits index page', () => {
    cy.visit('/');
    cy.contains('p', 'Durante epidemias uma das maneiras de diminuir a lotação dos hospitais é criar barracões de atendimento.');
    cy.contains('p', 'No Barracão Digital o paciente com sintomas de coronavírus pode ser avaliado por um médico voluntário via chamada de video ou de telefone.');
    cy.contains('a', 'Entrar na sala de espera de triagem');
    cy.contains('a', 'Já tenho uma senha de retorno');
  });
});
