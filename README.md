# Shop-NodeJS-Prisma

#### !!!!!! Em desenvolvimento !!!!!!

Dentro do projeto:
```bash
docker-compose up -d --build
```
```bash
docker-compose exec back-end npx prisma migrate dev --name init
```
http://localhost:80

## <b>Visão geral:</b><br>

![](https://img.shields.io/badge/SEGURANÇA:-e41a43?style=for-the-badge&Color=white) <br>
✅ Proteção contra ataques de Brute Force<br/>
✅ Proteção contra SQL Injection<br/>
✅ Proteção contra CSRF<br/>
✅ Proteção contra XSS

A combinação de jwtMiddleware e csrfMiddleware fornece uma proteção robusta contra ataques.
Um atacante precisaria tanto de um token JWT válido quanto de um token CSRF válido para realizar ações nas rotas do carrinho.

O arquivo de configuração do Nginx (nginx.conf) direciona as requisições que começam com /api para o servidor back-end.<br>
O arquivo index.js do back-end define as rotas que o servidor back-end irá responder quando receber essas requisições.

![image](https://github.com/user-attachments/assets/a6b96f92-9a9d-4bec-8553-3a2ec326181e)

<b>/api/login (POST)</b>: <br/>
Rota para autenticação de usuários. Usa o loginLimiter e validateLogin do loginGuard middleware para limitar as tentativas de login e validação de dados.<br>

<b>/api/register (POST)</b>: <br/>
Rota para registro de novos usuários. Usa o validateRegister do loginGuard middleware para validar dados ao registrar usuário, impedindo usernames com menos de 4 caracteres e senhas com menos de 8.

<b>/api/logout (POST)</b>: <br/>
Rota para remover os cookies e desautenticar o usuário.

<b>/api/csrf-token (GET)</b>: <br/>
Rota que gera o token CSRF apenas à usuários autenticados.

![image](https://github.com/user-attachments/assets/2ae96b16-318e-47dd-a809-a301403b1d24)
![image](https://github.com/user-attachments/assets/eca81370-79f3-4531-b287-a9bec7fe0d9c)

O authMiddleware é opcional, algumas rotas usam o jwtMiddleware para permitir o acesso apenas à usuários autenticados.

![image](https://github.com/user-attachments/assets/a4ed773c-625b-4526-b702-34ad44c692d4)


![image](https://github.com/user-attachments/assets/7078b944-c21f-4298-a8c2-64f8bf1b1326)
