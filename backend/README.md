### BackEnd

RESTful API que disponibiliza os endpoints úteis para o acesso a informação contida num ficheiro SAF-T.

- [Node.js](https://nodejs.org/en/) - API framework
- [Express.js](https://expressjs.com/) - definição de rotas para pedidos HTTP
- [Mongoose](https://mongoosejs.com/) - base de dados

## SAF-T

Um ficheiro SAF-T deverá ser carregado para a API antes de ser possível a sua utilização. É disponibilizado um endpoint de *upload* para o efeito.

Depois de recebido, é realizado um *parsing* do conteúdo do ficheiro sendo posteriormente modelado para a *base de dados*.

A estrutura do SAF-T pode ser vista nos links seguintes:

- [Documentação](https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Portaria_302_2016.pdf)
- [XSD Schema](https://info.portaldasfinancas.gov.pt/apps/saft-pt04/saftpt1.04_01.xsd)

### SETUP

Antes de mais deverá verificar se a variáveis de ambiente JAVA_HOME e Path estão definidas com o path para a diretoria e a pasta 'bin/' do JDK, respetivamente.

```
$ JAVA_HOME = path_to_jdk_directory (ex.: C:\Program Files\Java\jdk_1.8.0_152)
```
```
$ Path = path_to_jdk_bin_directory (ex.: ...;C:\Program Files\Java\jdk_1.8.0_152\bin;...)
```

*sem a devida configuração do Java, não será possível validar o SAF-T PT com o respetivo Schema*

Deverá ser aberta uma consola do sistema na *root directory* do projeto e executadas as seguintes linhas.

- Instalar todas as dependências
```
$ npm install
```
- Colocar o servidor em produção
```
$ npm start
```