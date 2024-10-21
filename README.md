1. 使用 nest g exam-system 创建
2. 使用 nest g app user 创建微服务其中一个模块
3. 分别创建 analyse, answer，exam
4. 修改端口，在对应模块的 main.ts 中修改
5. 启动 npm run start:dev user,npm run start exam,npm run start:dev answer
6. 访问 http://localhost:3000/user/ 访问 http://localhost:3001/analyse/
7. 在根目录安装微服务的包 `cnpm install @nestjs/microservices --save`

