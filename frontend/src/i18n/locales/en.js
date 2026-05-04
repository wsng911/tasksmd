export default {
	common: {
		confirm: "确认", cancel: "取消", card: "Card", lane: "Lane", noTagsFound: "否 tags found", close: "关闭",
	},
	header: {
		searchPlaceholder: "搜索", filterByTag: "Filter by tag", filter否ne: "否 filter",
		sortBy: "Sort by",
		sort: { manually: "Manually", nameAsc: "名称 (A-Z)", nameDesc: "名称 (Z-A)", tagsAsc: "Tags (A-Z)", tagsDesc: "Tags (Z-A)", dueAsc: "Due {{date}}", dueDesc: "Due {{date}}", last更新d: "Last updated", createdFirst: "创建d first" },
		viewMode: "View mode",
		view: { extended: "Extended", regular: "Regular", compact: "Compact", tight: "Tight" },
		newLane: "新建 lane", selectCards: "Select cards", exitSelection: "Exit selection", locale: "Language",
	},
	card: { due: "Due {{date}}" },
	card名称: { rename: "Rename", delete: "删除", showOptions: "Show options" },
	lane名称: { rename: "Rename", deleteCard: "删除 card", deleteLane: "删除 lane", createCard: "创建 card", showOptions: "Show options" },
	expandedCard: {
		addTag: "添加 tag", changeColor: "Change color", deleteTag: "删除 tag", dueDate: "Due date",
		minimize: "Minimize", expand: "Expand", colorOption: "Color {{n}}", rename: "Click to rename",
		tagError: { duplicate: "Duplicate tag" },
	},
	bulk: {
		selected: "{{count}} card selected", selected_plural: "{{count}} cards selected",
		addTags: "添加 tags", removeTags: "移除 tags", setDueDate: "Set due date", delete: "删除", clearSelection: "Clear selection",
		tag搜索Placeholder: "搜索 tags", removeTagPlaceholder: "移除 tag", createTag: '创建 "{{tag}}"',
		delete确认: "删除 selected?", delete确认_plural: "删除 selected?",
	},
	validation: {
		mustHave名称: "名称 is required", hiddenByDot: "Hidden by dot", duplicate名称: "Duplicate name",
		forbiddenChars: "Forbidden characters", noMdExtension: "否 .md extension", prohibited名称: "Prohibited name",
	},
	keyboard: { title: "Keyboard Shortcuts", sections: { navigation: "Navigation", card操作: "Card actions", general: "General" }, shortcuts: {} },
}
