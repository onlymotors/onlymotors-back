# OnlyMotors - Repositório da Aplicação Back-End

Essa é a aplicação que registra, atualiza ou busca requisições no banco enviadas pelos usuários através das aplicações Front-End: Web ou Mobile Android.

# 📦 Repositórios integrantes do projeto

| Repositório                                                              | Descrição                          |
| ------------------------------------------------------------------------ | ---------------------------------- |
| [onlymotors-docs](https://github.com/onlymotors/onlymotors-docs)    | Apresentação e documentação        |
| [onlymotors-front-web](https://github.com/onlymotors/onlymotors-front-web)    | Aplicação Front-End Web            |
| [onlymotors-front-mobile](https://github.com/onlymotors/onlymotors-front-mobile) | Aplicação Front-End Mobile Android |
| [onlymotors-back](https://github.com/onlymotors/onlymotors-back)         | Aplicação Back-End                 |


# ⚙️ Instruções de Instalação e Uso

<ul>
<li><b>Banco de dados</b></li>
<ul>
<li>Baixe e instale o banco de dados MongoDB:</li>
<a href="https://www.mongodb.com/try/download/community">MongoDB Community</a>
</ul>
</ul>

<ul>
<li><b>Node.js</b></li>
<ul>
<li>Baixe e instale o ambiente de excecução Node.js:</li>
<a href="https://nodejs.org/en/download">Node.js</a>
</ul>
</ul>

<ul>
<li><b>Dependências</b></li>
<ul>
<li>Abra o terminal na raiz desse repositório e instale as dependências necessárias:
<br/>

```bash
$ npm install
```

</li>
</ul>
</ul>

<ul>
<li><b>Criação das Variáveis</b></li>
<ul>
<li>Crie um arquivo <b>.env</b> e configure as variáveis a seguir:
<br/>

```bash
GOOGLE_USER=endereço_do_gmail 
GOOGLE_PASSWORD=senha_para_do_gmail_informado
AUTH_SECRET=chave_para_criação_do_token
CRYPTO_SECRET=chave_para_criptografar_os_dados
NODE_TLS_REJECT_UNAUTHORIZED=0
```

</li>
</ul>
<ul>
<li>Configure um serviço no Firebase e gere uma chave que deve ser armazenada no seguinte endereço e com o nome: <b>./src/config/onlymotorsConnect.json</b>. Essa chave será utilizada para o serviço de upload de imagens.
<br/>


</li>
</ul>
</ul>



<ul>
<li><b>Execute a aplicação</b></li>
<ul>
<li>Abra o terminal na raiz desse repositório e execute o comando:
<br/>

```bash
$ npm start
```

</li>
</ul>
  
  
</ul>


