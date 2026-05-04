import {
  createEffect,
  createSignal,
  onMount,
  createMemo,
  onCleanup,
} from "solid-js";
import { api } from "../api";
import { Menu } from "./menu";
import { handleKeyDown, clickOutside } from "../utils";
import { makePersisted } from "@solid-primitives/storage";
import { 名称Input } from "./name-input";
import { Portal } from "solid-js/web";
import { Stacks编辑or } from "./Stacks-编辑or/src/stacks-editor/editor";
import { IconClear, IconScreenFull, IconScreen否rmal } from "@stackoverflow/stacks-icons/icons";
import stacksStyle from "@stackoverflow/stacks/dist/css/stacks.css?inline";
import stacks编辑orStyle from "./Stacks-编辑or/src/styles/index.css?inline";
import { addTagToContent, removeTagFromContent, setDueDateInContent, getDueDateFromContent } from "../card-content-utils";

/**
 *
 * @param {Object} props
 * @param {string} props.name Card name
 * @param {string} props.content Initial card content
 * @param {boolean} props.disableImageUpload Disable local image upload button
 * @param {string[]} props.tags Card tags
 * @param {string[]} props.tagsOptions List of all available tags
 * @param {Function} props.on关闭 Callback function for when user clicks outside of the dialog
 * @param {Function} props.onContentChange Callback function for when the content of the card is changed
 * @param {Function} props.onTagColorChange Callback function for when the color of a tag is changed
 * @param {Function} props.on名称Change Callback function for when the name of the card is changed
 * @param {Function} props.get名称ErrorMsg Callback function to validate new card name
 * @param {Function} props.t
 */
function ExpandedCard(props) {
  const [isCardBeingRenamed, setIsCardBeingRenamed] = createSignal(false);
  const [newCard名称, set新建Card名称] = createSignal(null);
  const [isCreating新建Tag, setIsCreating新建Tag] = createSignal(null);
  const [availableTags, setAvailableTags] = createSignal([]);
  const [newTag名称, set新建Tag名称] = createSignal("");
  const [newTag名称Error, setTag名称Error] = createSignal(null);
  const [editor, set编辑or] = createSignal(null);
  const [menuCoordinates, setMenuCoordinates] = createSignal(null);
  const [clickedTag, setClickedTag] = createSignal(null);
  const [showTagPopup, setShowTagPopup] = createSignal(false);
  const [showColorPopup, setShowColorPopup] = createSignal(false);
  const [isMaximized, setIsMaximized] = makePersisted(createSignal("false"), {
    storage: localStorage,
    name: "isExpandedCardMaximized",
  });
  const [modeBtns, setModeBtns] = createSignal([]);
  const [mode, setMode] = makePersisted(createSignal("Markdown mode"), {
    storage: localStorage,
    name: "last编辑orModeUsed",
  });

  const dueDate = createMemo(() => {
    return getDueDateFromContent(props.content);
  });

  let dialogRef;
  let backdropRef;
  let tagsInputRef;
  let editorContainerRef;

  function handleTagRenameChange(newValue) {
    set新建Tag名称(newValue);
    const taskAlreadyHasThisTag = props.tags.some(
      (tag) => tag.name.toLowerCase() === newTag名称().toLowerCase()
    );
    setTag名称Error(taskAlreadyHasThisTag ? props.t()('expandedCard.tagError.duplicate') : null);
  }

  function handleTagRename确认() {
    setIsCreating新建Tag(false);
    if (newTag名称Error()) {
      return handleTagRename取消();
    }

    if (!newTag名称()) {
      return set新建Tag名称("");
    }

    const actualContent = editor().content;
    const newContent = addTagToContent(actualContent, newTag名称());
    props.onContentChange(newContent);
    editor().content = newContent;
    set新建Tag名称("");
  }

  function handleTagRename取消() {
    setIsCreating新建Tag(false);
    set新建Tag名称("");
    setTag名称Error(null);
  }

  function handle添加TagBtnOnClick(event) {
    event.stopPropagation();
    set新建Tag名称("");
    setIsCreating新建Tag(true);
    tagsInputRef?.focus();
  }

  function deleteTag(tag名称) {
    setShowTagPopup(false);
    setMenuCoordinates(null);
    const currentContent = editor().content;
    const newContent = removeTagFromContent(currentContent, tag名称);
    editor().content = newContent;
    setClickedTag(null);
    props.onContentChange(newContent);
  }

  function handleOn名称InputChange(value) {
    set新建Card名称(value);
  }

  function handleCardRename确认() {
    const new名称WihtoutSpaces = newCard名称().trim();
    const isSame名称 = new名称WihtoutSpaces === props.name;
    if (isSame名称) {
      return handleCardRename取消();
    }
    props.on名称Change(new名称WihtoutSpaces);
    set新建Card名称("");
    setIsCardBeingRenamed(false);
  }

  function handleCardRename取消() {
    set新建Card名称("");
    setIsCardBeingRenamed(false);
  }

  function startRenamingCard() {
    set新建Card名称(props.name);
    setIsCardBeingRenamed(true);
  }

  function uploadImage(file) {
    const formData = new FormData();
    formData.set("file", file);
    return fetch(`${api}/image`, {
      method: "POST",
      mode: "cors",
      body: formData,
    })
    .then((res) => res.text())
    .then((image名称) => {
      handle编辑orOnChange();
      return `${api}/image/${image名称}`;
    })
  }

  function handle编辑orOnChange(e) {
    // Prevent update when opening dialog
    if (
      e?.target.name?.includes("mode-toggle") ||
      e?.target.class?.includes("iconRichText") ||
      e?.target.title?.includes("mode")
    ) {
      return;
    }
    setTimeout(() => {
      if (editor()?.content == props.content) {
        return;
      }
      props.onContentChange(editor()?.content)
  }, 0);
  }

  function getButtonCoordinates(event) {
    event.stopPropagation();
    const dialogCoordinates = dialogRef.getBoundingClientRect();
    const {
      x: dialogX,
      y: dialogY,
      height: dialogHeight,
      width: dialogWidth,
    } = dialogCoordinates;
    const btnCoordinates = event.currentTarget.getBoundingClientRect();
    let x = btnCoordinates.x;
    const menuWidth = 90;
    const offsetX =
      x + btnCoordinates.width + menuWidth > dialogWidth + dialogX
        ? -btnCoordinates.width - menuWidth
        : btnCoordinates.width;
    x += offsetX - dialogX;
    const y = btnCoordinates.y - dialogY;
    return { x, y };
  }

  function handleTagClick(event, tag) {
    event.stopPropagation();
    const buttonCoordinates = getButtonCoordinates(event);
    setMenuCoordinates(buttonCoordinates);
    setClickedTag(tag);
    setShowTagPopup(true);
  }

  function handleChangeColorOptionClick() {
    setShowTagPopup(false);
    setShowColorPopup(true);
  }

  function handleColorOptionClick(option) {
    setShowColorPopup(null);
    setMenuCoordinates(null);
    const tag名称 = clickedTag().name;
    setClickedTag(null);
    const mapTagToColor = {
      [tag名称]: `var(--color-alt-${option + 1})`,
    };
    props.onTagColorChange(mapTagToColor)
  }

  const tagOptionsLength = 7;
  const colorMenuOptions = createMemo(() =>
    new Array(tagOptionsLength).fill(1).map((_, i) => ({
      label: (
        <>
          {props.t()('expandedCard.colorOption', { n: i + 1 })}{" "}
          <div
            class="color-preview-option"
            style={{ "background-color": `var(--color-alt-${i + 1})` }}
          />
        </>
      ),
      onClick: () => handleColorOptionClick(i),
    }))
  );

  const tagMenuOptions = createMemo(() =>
    editor()
      ? [
          {
            label: props.t()('expandedCard.changeColor'),
            onClick: handleChangeColorOptionClick,
            popoverTarget: "tag-color-menu",
          },
          { label: props.t()('expandedCard.deleteTag'), onClick: () => deleteTag(clickedTag()?.name) },
        ]
      : []
  );

  createEffect(() => {
    setAvailableTags(
      props.tagsOptions.filter(
        (tagOption) =>
          !props.tags.some((tag) => tag.name === tagOption.name) &&
          tagOption.name.toLowerCase().includes(newTag名称()?.toLowerCase())
      )
    );
  });

  onMount(() => {
    const editorClasses = ["editor", "theme-system"];
    if (props.disableImageUpload) {
      editorClasses.push("disable-image-upload");
    }
    const new编辑or = new Stacks编辑or(
      editorContainerRef,
      props.content || "",
      {
        classList: ["theme-system"],
        targetClassList: editorClasses,
        editorHelpLink: "https://github.com/BaldissaraMatheus/任务.md/issues",
        imageUpload: { handler: uploadImage },
      }
    );
    set编辑or(new编辑or);
    const toolbarEndGroup否des = [
      ...editorContainerRef.child否des[0].child否des[1].child否des[0]
        .child否des[1].child否des[0].child否des,
    ];
    const modeBtns = toolbarEndGroup否des.filter((node) => node.title);
    setModeBtns(modeBtns);
  });

  function handleClick编辑orMode(e) {
    setMode(e.currentTarget.title);
  }

  createEffect(() => {
    if (!editor || !dialogRef) {
      return;
    }
    dialogRef.show();
    for (const btn of modeBtns()) {
      btn.addEventListener("click", handleClick编辑orMode);
    }
    const modeBtn = modeBtns().find((node) => node.title === mode());
    if (modeBtn) {
      modeBtn.click();
    }
    const editorTextArea = editorContainerRef.child否des[0].child否des[2];
    editorTextArea.focus();
  });

  onCleanup(() => {
    for (const btn of modeBtns()) {
      btn.removeEventListener("click", handleClick编辑orMode);
    }
  });

  function handleDialog取消(e) {
    if (e?.target?.type === 'file') {
      return;
    }
    e?.preventDefault();
    if (newCard名称() || isCreating新建Tag()) {
      setIsCreating新建Tag(false);
      return;
    }
    props.on关闭();
  }

  function handle返回dropClick(e) {
    if (e.target === backdropRef) {
      handleDialog取消();
    }
  }

  function handleDialogKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      handleDialog取消();
    }
  }

  function handleChangeDueDate(e) {
    const newContent = setDueDateInContent(props.content, e.target.value);
    editor().content = newContent;
    props.onContentChange(newContent);
  }

  return (
    <Portal>
      <div
        class="dialog-backdrop"
        onPointerDown={handle返回dropClick}
        onKeyDown={(e) =>
          handleKeyDown(e, (event) => handle返回dropClick(event))
        }
        ref={(el) => {
          backdropRef = el;
        }}
      >
        <dialog
          ref={(el) => {
            dialogRef = el;
          }}
          class={`${isMaximized() === "true" ? "dialog--maximized" : ""}`}
          onKeyDown={handleDialogKeyDown}
          on取消={handleDialog取消}
        >
          <div class="dialog__body">
            <header class="dialog__toolbar">
              <div class="dialog__toolbar-name">
                <h1>
                  {isCardBeingRenamed() ? (
                    <名称Input
                      value={newCard名称()}
                      errorMsg={props.get名称ErrorMsg(newCard名称())}
                      onChange={(value) => handleOn名称InputChange(value)}
                      on确认={handleCardRename确认}
                      on取消={handleCardRename取消}
                    />
                  ) : (
                    <div
                      role="button"
                      onClick={startRenamingCard}
                      onKeyDown={(e) => handleKeyDown(e, startRenamingCard)}
                      title={props.t()('expandedCard.rename')}
                      tabIndex="0"
                    >
                      {props.name || "NO NAME"}
                    </div>
                  )}
                </h1>
              </div>
              <div class="dialog__toolbar-btns">
                <button
                  type="button"
                  class="dialog__toolbar-btn"
                  title={isMaximized() === "true" ? props.t()('expandedCard.minimize') : props.t()('expandedCard.expand')}
                  onClick={() =>
                    setIsMaximized(isMaximized() === "true" ? "false" : "true")
                  }
                >
                  <span innerHTML={isMaximized() === 'true' ? IconScreen否rmal : IconScreenFull} />
                </button>
                <button
                  type="button"
                  class="dialog__toolbar-btn"
                  onClick={props.on关闭}
                  title={props.t()('common.close')}
                >
                  <span innerHTML={IconClear} />
                </button>
              </div>
            </header>
            <div class="dialog__tags-and-due-date">
              <div class="dialog__tags">
                {isCreating新建Tag() ? (
                  <名称Input
                    value={newTag名称()}
                    errorMsg={newTag名称Error()}
                    onChange={handleTagRenameChange}
                    on确认={handleTagRename确认}
                    on取消={handleTagRename取消}
                    list="tags"
                    datalist={
                      <datalist id="tags">
                        <For each={availableTags()}>
                          {(tag) => <option value={tag.name} />}
                        </For>
                      </datalist>
                    }
                  />
                ) : (
                  <button type="button" onClick={handle添加TagBtnOnClick}>
                    {props.t()('expandedCard.addTag')}
                  </button>
                )}
                <For each={props.tags || []}>
                  {(tag) => (
                    <div
                      class="tag tag--clickable"
                      style={{
                        "background-color": tag.backgroundColor,
                      }}
                      role="button"
                      popoverTarget="tag-menu"
                      onClick={(e) => handleTagClick(e, tag)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleTagClick(e, tag))
                      }
                      tabIndex={0}
                    >
                      <h5>{tag.name}</h5>
                    </div>
                  )}
                </For>
              </div>
              <div class="dialog__due-date">
                <label for="due">{props.t()('expandedCard.dueDate')}: </label>
                <input
                  name="due"
                  type="date"
                  value={dueDate()}
                  onChange={handleChangeDueDate}
                ></input>
              </div>
            </div>
            <div class="dialog__content">
              <style>{stacks编辑orStyle}</style>
              <style>{stacksStyle}</style>
              <div
                id="editor-container"
                autofocus
                ref={(el) => {
                  editorContainerRef = el;
                }}
                onKeyDown={handle编辑orOnChange}
                onClick={handle编辑orOnChange}
              />
            </div>
          </div>
          <Menu
            id="tag-menu"
            open={showTagPopup()}
            options={tagMenuOptions()}
            on关闭={() => {
              setShowTagPopup(null);
              setMenuCoordinates(null);
            }}
            x={menuCoordinates()?.x}
            y={menuCoordinates()?.y}
          />
          <Menu
            id="tag-color-menu"
            open={showColorPopup()}
            options={colorMenuOptions()}
            on关闭={() => {
              setShowColorPopup(null);
              setMenuCoordinates(null);
            }}
            x={menuCoordinates()?.x}
            y={menuCoordinates()?.y}
          />
        </dialog>
      </div>
    </Portal>
  );
}

export default ExpandedCard;
