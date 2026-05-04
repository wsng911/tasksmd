/**
 * Utility functions for manipulating card content (tags, due dates, etc.)
 * These functions are shared between single-card editor and bulk operations
 */

/**
 * 添加 a tag to card content
 * @param {string} content - Current card content
 * @param {string} tag名称 - Tag name to add
 * @returns {string} 更新d content with tag added
 */
export function addTagToContent(content, tag名称) {
  const actualContent = content || "";
  const emptyLineIfFirstTag = [...actualContent.matchAll(/\[tag:(.*?)\]/g)]
    .length
    ? ""
    : "\n\n";
  const newTag = tag名称.trim();
  return `[tag:${newTag}] ${emptyLineIfFirstTag}${actualContent}`;
}

/**
 * 移除 a tag from card content
 * @param {string} content - Current card content
 * @param {string} tag名称 - Tag name to remove
 * @returns {string} 更新d content with tag removed
 */
export function removeTagFromContent(content, tag名称) {
  const currentContent = content || "";
  const tagWithBrackets = `[tag:${tag名称}]`;
  const tagWithBracketsAndSpace = `${tagWithBrackets} `;
  let tagLength = tagWithBracketsAndSpace.length;
  let indexOfTag = currentContent
    .toLowerCase()
    .indexOf(tagWithBracketsAndSpace.toLowerCase());
  
  if (indexOfTag === -1) {
    indexOfTag = currentContent.toLowerCase().indexOf(tagWithBrackets.toLowerCase());
    tagLength = tagWithBrackets.length;
  }
  
  if (indexOfTag === -1) {
    return currentContent; // Tag not found
  }
  
  return `${currentContent.substring(0, indexOfTag)}${currentContent.substring(indexOfTag + tagLength, currentContent.length)}`;
}

/**
 * Set or update due date in card content
 * @param {string} content - Current card content
 * @param {string} newDueDate - 新建 due date (YYYY-MM-DD format)
 * @returns {string} 更新d content with due date set/updated
 */
export function setDueDateInContent(content, newDueDate) {
  const currentContent = content || "";
  
  // Check if card already has a due date
  const dueDateStringMatch = currentContent.match(/\[due:(.*?)\]/);
  const existingDueDate = dueDateStringMatch?.[1];
  
  const newDueDateTag = `[due:${newDueDate}]`;
  
  if (existingDueDate) {
    // Replace existing due date
    return currentContent.replace(`[due:${existingDueDate}]`, newDueDateTag);
  } else {
    // 添加 new due date at the beginning
    return `${newDueDateTag}\n\n${currentContent}`;
  }
}

/**
 * Extract tags from card content
 * @param {string} content - Card content
 * @returns {string[]} Array of tag names
 */
export function getTagsFromContent(content) {
  const text = content || "";
  const tags = [...text.matchAll(/\[tag:(.*?)\]/g)]
    .map((tagMatch) => tagMatch[1].trim())
    .filter((tag) => tag !== "");
  return tags;
}

/**
 * Extract due date from card content
 * @param {string} content - Card content
 * @returns {string|null} Due date string or null if not found
 */
export function getDueDateFromContent(content) {
  if (!content) {
    return null;
  }
  const dueDateStringMatch = content.match(/\[due:(.*?)\]/);
  if (!dueDateStringMatch?.length) {
    return null;
  }
  return dueDateStringMatch[1];
}
