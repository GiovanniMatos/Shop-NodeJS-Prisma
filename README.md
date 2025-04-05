# Shop-NodeJS-Prisma

### !!!!!! Em desenvolvimento !!!!!!

Dentro do projeto:
```bash
docker-compose up -d --build
```
```bash
docker-compose exec back-end npx prisma migrate dev --name init
```
http://localhost:80

<b>Visão geral:</b><br>
O arquivo de configuração do Nginx (nginx.conf) direciona as requisições que começam com /api para o servidor back-end.<br>
O arquivo index.js do back-end define as rotas que o servidor back-end irá responder quando receber essas requisições.

![image](https://github.com/user-attachments/assets/a6b96f92-9a9d-4bec-8553-3a2ec326181e)

<b>/api/login (POST)</b>: Rota para autenticação de usuários. Usa o loginLimiter middleware para limitar as tentativas de login.<br>
<b>/api/register (POST)</b>: Rota para registro de novos usuários.

![image](https://github.com/user-attachments/assets/c98396d2-c215-4ce3-a1f0-6a7495bf4e32)

O authMiddleware é opcional, algumas rotas usam o jwtMiddleware para permitir o acesso apenas à usuários autenticados.

![image](https://github.com/user-attachments/assets/f8c383bd-977c-4734-814e-107c00c09b28)

![image](https://github.com/user-attachments/assets/7078b944-c21f-4298-a8c2-64f8bf1b1326)
