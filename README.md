# Shop-NodeJS-Prisma

#### !!!!!! Em desenvolvimento !!!!!!

Dentro do projeto:
```bash
docker-compose up -d --build
```
```bash
docker-compose exec back-end npx prisma migrate dev --name init
```
```bash
docker-compose exec back-end node prisma/seed.js
```
Caso não tenha o Docker instalado:<br>
(back-end)
```bash
npm install && cd back-end && npm install && npx prisma migrate dev --name init
&& node prisma/seed.js && npm run dev
```
(front-end)
```bash
cd front-end && npm install && npm run dev
```
Caso não tenha o Docker instalado:<br>
(back-end)
```bash
npm install && cd back-end && npm install && npx prisma migrate dev --name init
&& node prisma/seed.js && npm run dev
```
(front-end)
```bash
cd front-end && npm install && npm run dev
```

http://localhost:80

## <b>Visão geral:</b><br>
![image](https://github.com/user-attachments/assets/52835c11-ff77-412a-930d-dd57c871d1ff)<br>
![image](https://github.com/user-attachments/assets/1da79183-c2e0-4e90-9a3a-5d8f717e7f93)


![](https://img.shields.io/badge/SEGURANÇA:-e41a43?style=for-the-badge&Color=white) <br>
✅ Proteção contra ataques DoS (Denial of Service)<br/>
✅ Proteção contra ataques de Brute Force<br/>
✅ Proteção contra SQL Injection<br/>
✅ Proteção contra CSRF<br/>
✅ Proteção contra XSS

A combinação de jwtMiddleware e csrfMiddleware fornece uma proteção robusta contra ataques.
Um atacante precisaria tanto de um token JWT válido quanto de um token CSRF válido para realizar ações nas rotas do carrinho.

O arquivo de configuração do Nginx (nginx.conf) direciona as requisições que começam com /api para o servidor back-end.<br>
O arquivo <b>index.js</b> do back-end define as rotas que o servidor back-end irá responder quando receber essas requisições.

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

Algumas rotas usam o jwtMiddleware para permitir o acesso apenas à usuários autenticados, o authMiddleware é opcional.

![image](https://github.com/user-attachments/assets/a4ed773c-625b-4526-b702-34ad44c692d4)

<b>A Proteção contra DoS (Denial of Service)</b> está implementada no arquivo <b>nginx.conf</b><br>

O <b>limit_req_zone</b> define que cada endereço IP pode fazer até 10 requisições por segundo, no caso do <b>limit_conn_zone</b> é definido que cada IP pode fazer até 10 conexões por segundo.<br>
Se um IP exceder esse limite, as requisições adicionais serão tratadas de acordo com a configuração do <b>limit_req</b>

![image](https://github.com/user-attachments/assets/cb2ee999-2a8c-491f-8c2f-86dd29356462)
![image](https://github.com/user-attachments/assets/24140802-b9af-4d11-be9f-c832961e7e57)

<b>burst=20</b> permite que até 20 requisições sejam aceitas em um curto período de tempo, além do limite de taxa de 10 requisições por segundo.<br>
<b>nodelay</b> define que tudo que exceder o burst será rejeitado imediatamente.
<hr>

O arquivo <b>simple_http_stress.js</b> pode ser usado para testar a quantidade de requisições GET ao servidor, enquanto o arquivo <b>tcp_syn_flooder.py</b> simula um SYN Flood.<br>

Enquanto o <b>simple_http_stress.js</b> atua na camada 7 (Aplicação), que depende do servidor responder, o <b>tcp_syn_flooder.py</b> atua nas camadas 3 e 4 do modelo OSI (Rede e Transporte), enviando pacotes TCP SYN diretamente ao host-alvo sem depender de uma resposta do servidor, o que torna o ataque mais efetivo e difícil de mitigar usando regras convencionais de firewall ou bloqueios por aplicação.

![image](https://github.com/user-attachments/assets/48f865a7-ec9d-4b3c-8a35-f57383cc5d30)
![image](https://github.com/user-attachments/assets/ea1b8755-ef18-475a-9f67-c763a4d05e2b)


Observação: As medidas de proteção contra DoS implementadas podem ser eficazes se o ataque for originado de um único IP ou um número limitado, porém quando se trata de DDoS a recomendação é o uso de Firewall e CDN.

![image](https://github.com/user-attachments/assets/d39e6243-f9e9-4666-8eb0-5b5d2ce84a37)


<hr/>

![image](https://github.com/user-attachments/assets/7078b944-c21f-4298-a8c2-64f8bf1b1326)
