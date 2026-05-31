## Sobre esta Pasta

Esta pasta reúne os arquivos exportados pelo Figma Make durante o desenvolvimento do projeto **HelpHope**.

O objetivo desta organização é disponibilizar o código da versão final do protótipo utilizado como base para o desenvolvimento do sistema.

---

## Estrutura

```text
codigo-figma/
├── README.md
└── Versao-Final/
```

---

## Versao-Final

A pasta **Versao-Final** contém os arquivos exportados da versão final do projeto.

### Arquivos Principais

* `src/` — código-fonte da aplicação;
* `index.html` — arquivo principal;
* `package.json` — dependências e scripts do projeto;
* `vite.config.ts` — configuração do Vite;
* `postcss.config.mjs` — configuração do PostCSS;
* `default_shadcn_theme.css` — tema visual utilizado;
* `ATTRIBUTIONS.md` — atribuições do projeto;
* `pnpm-workspace.yaml` — configuração do workspace.

---

## Observação Importante

O Figma permite visualizar e restaurar versões anteriores do projeto, porém não disponibiliza de forma prática a exportação individual do código-fonte de cada versão sem restaurar o arquivo principal.

Para evitar riscos de sobrescrever ou comprometer a versão final já concluída, optou-se por não restaurar versões anteriores do projeto.

Por esse motivo, este repositório disponibiliza apenas o código exportado da versão final do protótipo.
