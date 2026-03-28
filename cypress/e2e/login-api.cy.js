describe('Testes em API', () => {
  beforeEach(function () {
    cy.fixture('especialistas.json').as('especialistas')
  })

  context('Testes em rotas com usuário autorizado', () => {
    beforeEach(() => {
      // Realiza o login para obter o token de autorização
      cy.loginApi(Cypress.env('email'), Cypress.env('senha'))
    })

    it('Deve cadastrar especialista com sucesso', function () {
      const especialista = this.especialistas.especialistas[0]
      const emailUnico = `doc_${Date.now()}@teste.com`
      const crmUnico = Math.floor(Math.random() * 1000000).toString()

      return cy
        .authRequest({
          method: 'POST',
          url: Cypress.env('api_especialista'),
          body: {
            nome: especialista.nome,
            email: emailUnico,
            crm: crmUnico,
            senha: especialista.senha,
            especialidade: especialista.especialidade,
            telefone: especialista.telefone,
            endereco: {
              cep: especialista.cep.toString(),
              rua: especialista.rua,
              numero: especialista.numero,
              complemento: especialista.complemento,
              estado: especialista.estado
            }
          }
        })
        .then(response => {
          // A API do backend retorna 201 Created para sucesso
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('id')
          expect(response.body.nome).to.eq(especialista.nome)
          expect(response.body.email).to.eq(emailUnico)
        })
    })

    it('Não deve cadastrar especialista com CRM duplicado', function () {
      const especialista = this.especialistas.especialistas[0]
      
      // Primeiro cadastro para garantir que o CRM existe
      cy.authRequest({
        method: 'POST',
        url: Cypress.env('api_especialista'),
        body: {
          nome: especialista.nome,
          email: `unique_${Date.now()}@teste.com`,
          crm: especialista.crm.toString(),
          senha: especialista.senha,
          especialidade: especialista.especialidade,
          telefone: especialista.telefone,
          endereco: {
            cep: especialista.cep.toString(),
            rua: especialista.rua,
            numero: especialista.numero,
            complemento: especialista.complemento,
            estado: especialista.estado
          }
        }
      }).then(() => {
        // Segunda tentativa com o mesmo CRM
        cy.authRequest({
          method: 'POST',
          url: Cypress.env('api_especialista'),
          body: {
            nome: "Outro Nome",
            email: `other_${Date.now()}@teste.com`,
            crm: especialista.crm.toString(),
            senha: especialista.senha,
            especialidade: especialista.especialidade,
            telefone: especialista.telefone,
            endereco: {
              cep: especialista.cep.toString(),
              rua: especialista.rua,
              numero: especialista.numero,
              complemento: especialista.complemento,
              estado: especialista.estado
            }
          },
          failOnStatusCode: false
        }).then(response => {
          // O backend retorna 422 para CRM duplicado
          expect(response.status).to.eq(422)
          expect(response.body.message).to.eq('Crm já cadastrado')
        })
      })
    })
  })

  context('Requisições clínica', () => {
    it('Deve cadastrar clínica com sucesso', function () {
      const especialista = this.especialistas.especialistas[1]
      const emailUnico = `clinic_${Date.now()}@teste.com`

      return cy
        .request({
          method: 'POST',
          url: Cypress.env('api_clinica'),
          body: {
            nome: "Clínica Teste " + Date.now(),
            email: emailUnico,
            senha: "senhaSegura123",
            endereco: {
              cep: "12345678",
              rua: "Rua das Clínicas",
              numero: 100,
              complemento: "Sala 1",
              estado: "SP"
            }
          }
        })
        .then(response => {
          // O backend de clínica retorna 200 (res.json) e não 201
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('id')
          expect(response.body.email).to.eq(emailUnico)
        })
    })

    it('Não deve cadastrar clínica sem campos obrigatórios', () => {
      return cy
        .request({
          method: 'POST',
          url: Cypress.env('api_clinica'),
          body: {
            nome: 'Clínica Incompleta'
            // Faltam email, senha, endereco
          },
          failOnStatusCode: false
        })
        .then(response => {
          // O backend valida campos obrigatórios e retorna 400
          expect(response.status).to.eq(400)
          expect(response.body).to.be.a('string')
        })
    })
  })
})
