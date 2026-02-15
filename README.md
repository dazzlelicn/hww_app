# HWW App (Full-stack prototype)

基于前端原型扩展为可运行的完整系统：
- 前端（React + Vite）
- 后端（Node.js + Express + Prisma）
- 数据库（PostgreSQL for ECS, SQLite for local quick start）
- ECS 部署脚本（Docker Compose）

## 1. 本地开发

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 2. Docker 一键运行

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/health

## 3. 阿里云 ECS 部署建议

1. 把仓库代码上传到 ECS。
2. 执行：
```bash
bash scripts/deploy_ecs.sh
```
3. 放通 80、5173、4000（按需）和 5432（建议仅内网）。
4. 生产环境建议：
   - 修改 JWT_SECRET。
   - 修改 PostgreSQL 用户名/密码。
   - 使用阿里云 SLB + HTTPS。

## 4. 现有功能

- 用户注册/登录
- 认证后访问功能管理面板
- 新增功能项、启用/禁用开关
- 前后端鉴权联动
