# tasksmd Prompts

> 项目：BaldissaraMatheus/Tasks.md
> 技术栈：Vue 3 + Vite 前端，Node.js + Koa 后端，Markdown 文件存储，无数据库依赖

---

## 功能迭代

**1. 添加任务截止日期功能**
在 Tasks.md 中为任务添加截止日期支持。在 Markdown 文件的 frontmatter 中存储截止日期字段，在任务卡片上显示截止日期，支持按截止日期排序，临近截止时显示警告颜色。

**2. 支持任务标签过滤**
在 Tasks.md 中添加标签过滤功能。用户可以在任务中添加 `#标签` 格式的标签，在看板顶部显示所有标签列表，点击标签只显示包含该标签的任务卡片，支持多标签组合过滤。

**3. 添加任务搜索功能**
在 Tasks.md 中添加全文搜索功能，支持搜索任务标题和内容。搜索框放置在页面顶部，实时过滤显示匹配的任务卡片，高亮显示匹配的关键词。

**4. 支持子任务（Checklist）**
在 Tasks.md 中添加子任务支持，允许在任务内容中使用 Markdown 复选框语法（`- [ ] 子任务`）创建子任务列表。在任务卡片上显示子任务完成进度（如 2/5），点击可展开查看子任务列表。

**5. 添加任务归档功能**
在 Tasks.md 中添加任务归档功能。用户可以将已完成的任务归档，归档的任务移动到 `_archive` 目录，在看板中默认隐藏，通过切换按钮可以查看归档任务，防止看板过于拥挤。

---

## Bug 修复

**6. 修复任务内容包含特殊字符时保存失败**
在 Tasks.md 中，当任务内容包含 YAML frontmatter 特殊字符（如冒号、引号）时，保存时会导致 frontmatter 解析错误。请对 frontmatter 字段值进行正确的 YAML 转义处理。

**7. 修复拖拽任务到其他列时偶发位置错误**
在 Tasks.md 的看板视图中，将任务从一列拖拽到另一列时，偶尔会插入到错误的位置。请检查拖拽排序逻辑中的索引计算，确保在快速拖拽时位置计算的准确性。

**8. 修复多用户同时编辑同一任务时内容覆盖**
在 Tasks.md 中，当两个用户同时打开并编辑同一个任务时，后保存的会覆盖先保存的内容。请添加文件修改时间检查，在保存前验证文件是否被其他用户修改，冲突时提示用户。

**9. 修复任务文件名包含中文时无法访问**
在 Tasks.md 中，当任务标题包含中文字符时，生成的 Markdown 文件名可能导致 URL 编码问题，使任务无法正常访问。请对文件名进行 URL 安全编码，或将中文文件名转换为拼音/UUID。

**10. 修复看板列顺序在刷新后重置**
在 Tasks.md 中，用户调整看板列的顺序后，刷新页面会恢复到默认顺序。请将列顺序配置持久化到 `/config` 目录的配置文件中，页面加载时读取保存的顺序。

---

## 重构

**11. 将文件操作封装为统一的 FileService**
Tasks.md 的后端中，Markdown 文件的读写操作分散在多个路由处理函数中。请创建统一的 `FileService` 类，封装文件的 CRUD 操作、frontmatter 解析、文件名生成等逻辑。

**12. 将前端状态管理迁移到 Pinia**
Tasks.md 前端使用 Vue 3 的 Composition API 管理状态，随着功能增加变得分散。请将看板数据、列配置、当前编辑任务等全局状态迁移到 Pinia store，统一管理。

---

## 测试

**13. 为任务 CRUD API 编写集成测试**
使用 Jest + Supertest 为 Tasks.md 的任务管理 API 编写集成测试，覆盖：创建任务（生成 Markdown 文件）、获取任务列表、更新任务内容、移动任务到其他列、删除任务。使用临时目录隔离测试数据。

**14. 为 Markdown frontmatter 解析编写单元测试**
为 Tasks.md 的 frontmatter 解析工具函数编写单元测试，覆盖：标准 frontmatter 解析、缺失 frontmatter 的处理、特殊字符转义、多行内容、嵌套对象。

**15. 为看板拖拽功能编写 E2E 测试**
使用 Playwright 为 Tasks.md 编写端到端测试，覆盖：创建任务、在列内拖拽排序、跨列拖拽移动、验证文件系统中任务文件的位置变化。

---

## 代码理解

**16. 解释 Tasks.md 的文件系统存储架构**
在 Tasks.md 中，任务数据完全存储在 Markdown 文件中。请解释目录结构（列对应目录、任务对应文件）、frontmatter 的字段定义、文件命名规则、如何通过文件系统操作实现任务的 CRUD 和排序。

**17. 解释 Tasks.md 的实时更新机制**
在 Tasks.md 中，当后端文件发生变化时，前端如何感知并更新看板？是使用轮询、WebSocket 还是 Server-Sent Events？如何处理多用户同时操作时的并发冲突？

---

## DevOps

**18. 编写 GitHub Actions 多架构构建流水线**
为 Tasks.md 编写 `.github/workflows/docker-build.yml`，实现推送 main 分支时自动构建多架构（amd64/arm64）Docker 镜像并推送到 Docker Hub，使用 npm 缓存加速构建。

**19. 编写 docker-compose.yml 生产部署配置**
为 Tasks.md 编写 `docker-compose.yml`，包含：tasksmd 服务（映射 8080 端口）、任务目录挂载（`./tasks:/tasks`）、配置目录挂载（`./config:/config`）、环境变量配置（BASE_PATH）、自动重启策略。

**20. 编写任务数据备份脚本**
为 Tasks.md 编写自动备份脚本，定期将 `/tasks` 目录打包为 ZIP 文件，保留最近 7 天的备份，支持通过环境变量配置备份目录，并在备份完成后输出文件数量和总大小。

---

## 构建与截图命令

**构建截图：**
```bash
cd /path/to/tasksmd && docker build -t tasksmd-test .
```

**网页截图：**
```bash
docker run -d -p 8080:8080 --name tasksmd-test tasksmd-test && sleep 5 && open http://localhost:8080
```

**清理：**
```bash
docker rm -f tasksmd-test && docker rmi tasksmd-test
```
