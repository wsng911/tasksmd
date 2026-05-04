# Tasks.md

基于 Markdown 文件的自托管任务看板，无需数据库。

## 功能特性

- 看板视图
- Markdown 文件存储
- 无数据库依赖
- 拖拽排序
- 中文界面

## 快速部署

```bash
docker run -d -p 8080:8080 -v $(pwd)/tasks:/tasks --name tasksmd wsng911/tasksmd:latest
```

访问 `http://localhost:8080`
