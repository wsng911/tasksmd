import { createSignal, Show, For, onMount, onCleanup, createEffect } from "solid-js";

/**
 * @param {Object} props
 * @param {number} props.selectedCount - Number of selected cards
 * @param {Function} props.on删除 - Callback for bulk delete
 * @param {Function} props.on添加Tags - Callback for bulk add tags
 * @param {Function} props.on移除Tags - Callback for bulk remove tags
 * @param {Function} props.onSetDueDate - Callback for bulk set due date
 * @param {Function} props.onClearSelection - Callback to clear selection
 * @param {string[]} props.tagsOptions - Available tag options (all tags in project)
 * @param {string[]} props.tagsOnSelectedCards - Tags that exist on selected cards
 * @param {Function} props.t
 */
export function BulkOperationsToolbar(props) {
  const [showTagMenu, setShowTagMenu] = createSignal(false);
  const [show移除TagMenu, setShow移除TagMenu] = createSignal(false);
  const [showDueDateInput, setShowDueDateInput] = createSignal(false);
  const [tag搜索Query, setTag搜索Query] = createSignal("");
  const [removeTag搜索Query, set移除Tag搜索Query] = createSignal("");
  const [dueDate, setDueDate] = createSignal("");

  let dueDateRef;
  let tag搜索InputRef;
  let tagDropdownRef;
  let removeTagDropdownRef;
  let removeTag搜索InputRef;

  // Click outside to close tag dropdown
  onMount(() => {
    const handleClickOutside = (event) => {
      // Check if clicking on backdrop
      if (event.target.classList.contains('bulk-operations-toolbar__dropdown-backdrop')) {
        setShowTagMenu(false);
        setTag搜索Query("");
        setShow移除TagMenu(false);
        set移除Tag搜索Query("");
        return;
      }
      
      if (tagDropdownRef && !tagDropdownRef.contains(event.target)) {
        setShowTagMenu(false);
        setTag搜索Query("");
      }
      if (removeTagDropdownRef && !removeTagDropdownRef.contains(event.target)) {
        setShow移除TagMenu(false);
        set移除Tag搜索Query("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  const filteredTags = () => {
    if (!props.tagsOptions) return [];
    if (!tag搜索Query()) return props.tagsOptions;
    return props.tagsOptions.filter((tag) =>
      tag.toLowerCase().includes(tag搜索Query().toLowerCase())
    );
  };

  const filtered移除Tags = () => {
    if (!props.tagsOnSelectedCards) return [];
    if (!removeTag搜索Query()) return props.tagsOnSelectedCards;
    return props.tagsOnSelectedCards.filter((tag) =>
      tag.toLowerCase().includes(removeTag搜索Query().toLowerCase())
    );
  };

  const show创建Option = () => {
    const query = tag搜索Query().trim();
    if (!query) return false;
    // Show create option if the query doesn't exactly match any existing tag
    return !props.tagsOptions?.some(
      (tag) => tag.toLowerCase() === query.toLowerCase()
    );
  };

  function handle添加Tag(tag名称) {
    props.on添加Tags(tag名称);
    setTag搜索Query("");
    setTimeout(() => tag搜索InputRef?.focus(), 0);
  }

  function handle创建And添加Tag() {
    const tag名称 = tag搜索Query().trim();
    if (tag名称) {
      props.on添加Tags(tag名称);
      setTag搜索Query("");
      setTimeout(() => tag搜索InputRef?.focus(), 0);
    }
  }

  function handle移除Tag(tag名称) {
    props.on移除Tags(tag名称);
    set移除Tag搜索Query("");
    setTimeout(() => removeTag搜索InputRef?.focus(), 0);
  }

  function handleSetDueDate() {
    if (dueDate()) {
      props.onSetDueDate(dueDate());
      setDueDate("");
      setShowDueDateInput(false);
    }
  }

  function handle删除() {
    const confirmed = window.confirm(
      props.t()(props.selectedCount !== 1 ? 'bulk.delete确认_plural' : 'bulk.delete确认')
    );
    if (confirmed) {
      props.on删除();
    }
  }

  createEffect(() => {
    if (show移除TagMenu() && (!props.tagsOnSelectedCards || props.tagsOnSelectedCards.length === 0)) {
      setShow移除TagMenu(false);
      set移除Tag搜索Query("");
    }
  });

  return (
    <div class="bulk-operations-toolbar">
      <div class="bulk-operations-toolbar__content">
        <span class="bulk-operations-toolbar__count">
          {props.t()(props.selectedCount !== 1 ? 'bulk.selected_plural' : 'bulk.selected', { count: props.selectedCount })}
        </span>
        <Show when={props.selectedCount > 0}>
          <button
            class="bulk-operations-toolbar__button"
            onClick={() => {
              const nextShowTagMenu = !showTagMenu();
              setShowTagMenu(nextShowTagMenu);
              if (nextShowTagMenu) {
                setShow移除TagMenu(false);
                set移除Tag搜索Query("");
                setShowDueDateInput(false);
                setDueDate("");
                setTimeout(() => tag搜索InputRef?.focus(), 0);
              } else {
                setTag搜索Query("");
              }
            }}
          >
            {props.t()('bulk.addTags')}
          </button>

          <button
            class="bulk-operations-toolbar__button"
            onClick={() => {
              const nextShow移除TagMenu = !show移除TagMenu();
              setShow移除TagMenu(nextShow移除TagMenu);
              if (nextShow移除TagMenu) {
                setShowTagMenu(false);
                setTag搜索Query("");
                setShowDueDateInput(false);
                setDueDate("");
                setTimeout(() => removeTag搜索InputRef?.focus(), 0);
              } else {
                set移除Tag搜索Query("");
              }
            }}
            disabled={!props.tagsOnSelectedCards || props.tagsOnSelectedCards.length === 0}
          >
            {props.t()('bulk.removeTags')}
          </button>

          <button
            class="bulk-operations-toolbar__button"
            onClick={() => {
              const nextShowDueDate = !showDueDateInput();
              setShowDueDateInput(nextShowDueDate);
              if (nextShowDueDate) {
                setShowTagMenu(false);
                setTag搜索Query("");
                setShow移除TagMenu(false);
                set移除Tag搜索Query("");
                setTimeout(() => dueDateRef?.focus(), 0);
              } else {
                setDueDate("");
              }
            }}
          >
            {props.t()('bulk.setDueDate')}
          </button>

          <button
            class="bulk-operations-toolbar__button bulk-operations-toolbar__button--danger"
            onClick={handle删除}
          >
            {props.t()('bulk.delete')}
          </button>

          <button
            class="bulk-operations-toolbar__button bulk-operations-toolbar__button--secondary"
            onClick={props.onClearSelection}
          >
            {props.t()('bulk.clearSelection')}
          </button>
        </Show>  
      </div>

      <Show when={showTagMenu()}>
        <div class="bulk-operations-toolbar__dropdown-backdrop" />
        <div class="bulk-operations-toolbar__dropdown" ref={tagDropdownRef}>
          <input
            type="text"
            class="bulk-operations-toolbar__search-input"
            placeholder={props.t()('bulk.tag搜索Placeholder')}
            value={tag搜索Query()}
            onInput={(e) => setTag搜索Query(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && show创建Option()) {
                handle创建And添加Tag();
              } else if (e.key === "Escape") {
                setShowTagMenu(false);
                setTag搜索Query("");
              }
            }}
            ref={tag搜索InputRef}
          />
          <div class="bulk-operations-toolbar__dropdown-list">
            <Show when={show创建Option()}>
              <button
                class="bulk-operations-toolbar__dropdown-item bulk-operations-toolbar__dropdown-item--create"
                onClick={handle创建And添加Tag}
              >
                <span class="bulk-operations-toolbar__create-icon">+</span>
                {props.t()('bulk.createTag', { tag: tag搜索Query() })}
              </button>
            </Show>
            <For each={filteredTags()}>
              {(tag) => (
                <button
                  class="bulk-operations-toolbar__dropdown-item"
                  onClick={() => handle添加Tag(tag)}
                >
                  {tag}
                </button>
              )}
            </For>
            <Show when={filteredTags().length === 0 && !show创建Option()}>
              <div class="bulk-operations-toolbar__dropdown-empty">
                {props.t()('common.noTagsFound')}
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={show移除TagMenu()}>
        <div class="bulk-operations-toolbar__dropdown-backdrop" />
        <div class="bulk-operations-toolbar__dropdown" ref={removeTagDropdownRef}>
          <input
            type="text"
            class="bulk-operations-toolbar__search-input"
            placeholder={props.t()('bulk.removeTagPlaceholder')}
            value={removeTag搜索Query()}
            onInput={(e) => set移除Tag搜索Query(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShow移除TagMenu(false);
                set移除Tag搜索Query("");
              }
            }}
            ref={removeTag搜索InputRef}
          />
          <div class="bulk-operations-toolbar__dropdown-list">
            <For each={filtered移除Tags()}>
              {(tag) => (
                <button
                  class="bulk-operations-toolbar__dropdown-item"
                  onClick={() => handle移除Tag(tag)}
                >
                  {tag}
                </button>
              )}
            </For>
            <Show when={filtered移除Tags().length === 0}>
              <div class="bulk-operations-toolbar__dropdown-empty">
                {props.t()('common.noTagsFound')}
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={showDueDateInput()}>
        <div class="bulk-operations-toolbar__dropdown-backdrop" />
        <div class="bulk-operations-toolbar__date-picker">
          <input
            type="date"
            class="bulk-operations-toolbar__date-input"
            value={dueDate()}
            onInput={(e) => setDueDate(e.target.value)}
            ref={dueDateRef}
          />
          <button
            class="bulk-operations-toolbar__button"
            onClick={handleSetDueDate}
          >
            {props.t()('common.confirm')}
          </button>
          <button
            class="bulk-operations-toolbar__button bulk-operations-toolbar__button--secondary"
            onClick={() => {
              setShowDueDateInput(false);
              setDueDate("");
            }}
          >
            {props.t()('common.cancel')}
          </button>
        </div>
      </Show>
    </div>
  );
}
