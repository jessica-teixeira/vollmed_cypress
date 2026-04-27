# 🚀 Como Fazer Deploy no Render

## 📋 Pré-requisitos

- Conta no Render.com
- Reposório Git com o projeto
- Render.yaml configurado ✅

## 🎯 Passo a Passo

### 1. **Fazer Push das Mudanças**

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. **Criar Web Services no Render**

#### Backend API:
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique "New +" → "Web Service"
3. Conecte seu repositório Git
4. **Configurações:**
   - **Name**: `vollmed-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: `Starter`
5. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `8080`
6. Clique "Create Web Service"

#### Frontend Web:
1. Clique "New +" → "Static Site"
2. **Configurações:**
   - **Name**: `vollmed-frontend`
   - **Build Command**: `cd web && npm install && npm run build`
   - **Publish Directory**: `web/build`
3. Clique "Create Static Site"

### 3. **Configurar Variáveis de Ambiente**

No Backend Service, adicione:
```
NODE_ENV=production
PORT=8080
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=your-secret-key
```

### 4. **Aguardar Deploy**

- O Render irá automaticamente fazer o build e deploy
- Aguarde os status "Live" nos serviços
- Verifique os logs se houver erros

### 5. **Testar Aplicação**

**Backend URL:** `https://vollmed-backend.onrender.com`
**Frontend URL:** `https://vollmed-frontend.onrender.com`

#### Testes:
```bash
# Testar API
curl https://vollmed-backend.onrender.com/

# Testar Login
curl -X POST https://vollmed-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"clinica@gmail.com","senha":"4321"}'
```

## 🔧 Troubleshooting

### Erros Comuns:

1. **"Command start not found"**
   - ✅ Já corrigido no package.json

2. **"Port already in use"**
   - Render usa porta dinâmica, ignore o PORT fixo

3. **"Database connection failed"**
   - Configure DATABASE_URL nas variáveis de ambiente

4. **"Build failed"**
   - Verifique se todos os package.json estão corretos

### Logs:
- No Dashboard Render → Service → Logs
- Use logs para debugar problemas

## 📊 Monitoramento

- **Health Checks**: Configure endpoints `/health`
- **Metrics**: Use painel do Render
- **Alerts**: Configure notificações de erro

## 🔄 Deploy Automático

O Render automaticamente:
- Faz deploy quando há push no main
- Redeploy quando há mudanças
- Mantém versões anteriores

## 🎉 Pronto!

Após o deploy, você terá:
- ✅ Backend API rodando
- ✅ Frontend estático servido  
- ✅ Deploy automático configurado
- ✅ Logs e monitoramento

---

**Precisa de ajuda?** Verifique os logs no Render Dashboard ou revise as configurações acima.
