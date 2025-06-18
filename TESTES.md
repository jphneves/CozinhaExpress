# Testes Manuais - CozinhaExpress

Este documento descreve os cenários de testes manuais realizados no aplicativo CozinhaExpress, um app de receitas desenvolvido com React Native e Expo. Os testes cobrem as principais funcionalidades do app para garantir que ele funcione conforme esperado.

## Cenário 1: Login de Usuário
- **Objetivo**: Verificar se um usuário registrado consegue fazer login com credenciais corretas.
- **Passos**:
  1. Abrir o aplicativo CozinhaExpress no dispositivo ou emulador android.
  2. Na tela de autenticação, inserir um e-mail registrado (ex.: `teste@exemplo.com`).
  3. Inserir a senha correta correspondente ao e-mail.
  4. Clicar no botão "Entrar".
- **Resultado Esperado**: O usuário é redirecionado para a tela principal de receitas, com a lista de receitas sendo exibida.
- **Resultado Obtido**: A ser preenchido após o teste. Exemplo: "Login realizado com sucesso, tela de receitas exibida.
- **Status**: Funcional.

## Cenário 2: Busca de Receitas por Ingrediente
- **Objetivo**: Verificar se o app retorna receitas corretas ao buscar por um ingrediente específico.
- **Passos**:
  1. Fazer login no aplicativo com credenciais válidas.
  2. Na tela principal de receitas, localizar o campo de busca por ingrediente.
  3. Digitar um ingrediente (ex.: "chicken") no campo de busca.
  4. Clicar no botão "Buscar" ou pressionar "Enter" no teclado.
- **Resultado Esperado**: O app exibe uma lista de receitas que contêm o ingrediente buscado (ex.: receitas com frango). Se não houver resultados, a lista deve estar vazia.
- **Resultado Obtido**: A ser preenchido após o teste. Exemplo: "Receitas com frango exibidas corretamente.
- **Status**: Funcional.

## Cenário 3: Alteração de Senha do Usuário
- **Objetivo**: Verificar se um usuário pode alterar sua senha com sucesso.
- **Passos**:
  1. Fazer login no aplicativo com credenciais válidas.
  2. Navegar até a aba "Usuário" no menu inferior.
  3. Clicar no botão "Alterar Senha".
  4. Inserir a senha atual no primeiro prompt.
  5. Inserir uma nova senha (com pelo menos 6 caracteres) no segundo prompt.
  6. Confirmar a alteração.
- **Resultado Esperado**: Uma mensagem de sucesso é exibida ("Senha alterada com sucesso!"), e o usuário pode fazer login novamente com a nova senha.
- **Resultado Obtido**: Senha alterada com sucesso, login com nova senha funcionou.
- **Status**: Funcional.

**Última Atualização**: Funcionalidades OK (17/06/2025)