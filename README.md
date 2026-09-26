# 盲文点字学习训练器

纯前端盲文点字学习与练习工具，支持点阵字符卡片、听写练习、错题本和学习进度统计，数据存 IndexedDB。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20111>



## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`



## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Zustand + IndexedDB |
| 后端 | - |
| 数据库 | 本地模拟数据 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `braille-trainer`
- `FRONTEND_PORT`: 前端端口，默认 `20111`


## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: braille-trainer`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-braille-trainer}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- PracticeMode: constants/PracticeMode、types/PracticeMode、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- SymbolCategory: constants/SymbolCategory、types/SymbolCategory、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- MasteryLevel: constants/MasteryLevel、types/MasteryLevel、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- MistakeReason（漏点/多点/混合，练习判定新增）: constants/MistakeReason、types/MistakeReason、utils/braillePattern、constructors/AnswerRecordConstructor、pages/PracticePage、pages/MistakesPage。

## 练习模式的输入 / 判定 / 记录三层划分

- 输入层：`hooks/useSixDotInput.ts`（六点草稿状态）+ `components/practice/SixDotInput.tsx`（六个可点位置）。换题或“再试一次”时草稿由输入层 `clear` 清掉，未提交点阵不入库。
- 判定层：`utils/braillePattern.ts`（点阵解析、漏点 `missingDots`/多点 `extraDots` 比较、错题归类）+ `hooks/useBraillePattern.ts`（纯派生判定）。
- 编排层：`hooks/usePracticeRun.ts` 实现“第一遍答错可再试、第二遍无论对错都保存、仍错把两遍答案写入错题本”的两遍状态机；统计由 `hooks/usePracticeSession.ts` 汇总，只认已提交记录。
- 记录保存层：`db/indexeddb.ts`（IndexedDB 事务）+ `api/AnswerRecord.ts`、`api/PracticeSession.ts` + `stores/AnswerRecordStore.ts`、`stores/PracticeSessionStore.ts`。离开练习页时按已提交记录汇总会话并保存。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
