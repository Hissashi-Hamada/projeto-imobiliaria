# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e5]:
      - link "Tavares Corretora de Imóveis" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]: Tavares Corretora de Imóveis
      - navigation "Principal" [ref=e9]:
        - link "Vitrine" [ref=e10] [cursor=pointer]:
          - /url: /imoveis
        - link "Meu Perfil" [ref=e11] [cursor=pointer]:
          - /url: /profile
  - generic [ref=e15]:
    - heading "Entrar" [level=2] [ref=e16]
    - paragraph [ref=e17]: Acesse sua conta para salvar favoritos e falar com o vendedor.
    - generic [ref=e18]:
      - generic [ref=e19]:
        - text: Email
        - textbox "voce@exemplo.com" [ref=e20]: admin@imobiliaria.test
      - generic [ref=e21]:
        - text: Senha
        - generic [ref=e22]:
          - textbox "Sua senha" [ref=e23]: Demo@12345
          - button "Mostrar senha" [ref=e24] [cursor=pointer]: Mostrar
      - button "Entrando..." [disabled] [ref=e25]
```