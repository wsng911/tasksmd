import { createSignal, createMemo } from "solid-js";
import { Menu } from "./menu";
import { getButtonCoordinates, handleKeyDown } from "../utils";
import { IconPlusSm, IconEllipsisVertical } from '@stackoverflow/stacks-icons/icons'

/**
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.count
 * @param {Function} props.onRenameBtnClick
 * @param {Function} props.on删除Cards
 * @param {Function} props.on删除
 * @param {Function} props.onDragStart
 * @param {Function} props.on创建新建CardBtnClick
 * @param {Function} props.t
 */
export function Lane名称(props) {
	const [showMenu, setShowMenu] = createSignal(false);
	const [menuCoordinates, setMenuCoordinates] = createSignal();

	function startRenamingLane() {
		setShowMenu(false);
		props.onRenameBtnClick();
	}

	function handle取消() {
		setShowMenu(false);
		setMenuCoordinates(null);
	}

	function handleOptionsBtnClick(e) {
		e.preventDefault();
		e.stopPropagation();
		const coordinates = getButtonCoordinates(e);
		setMenuCoordinates(coordinates);
		setShowMenu(true);
	}

	const menuOptions = createMemo(() => [
		{ label: props.t()('lane名称.rename'), onClick: startRenamingLane },
		{
			label: props.t()('lane名称.deleteCard'),
			onClick: props.on删除Cards,
			requires确认ation: true,
		},
		{
			label: props.t()('lane名称.deleteLane'),
			onClick: props.on删除,
			requires确认ation: true,
		},
	]);

	return (
		<>
			<div
				class="lane__header-name-and-count"
				draggable={true}
				onDragEnter={(e) => e.preventDefault()}
				onDragStart={props.onDragStart}
			>
				<strong class="lane__header-name">{props.name}</strong>
				<div class="tag">
					<h5 class="counter">{props.count}</h5>
				</div>
			</div>
			<div class="header-buttons">
				<button
					type="button"
					title={props.t()('lane名称.createCard')}
					class="small"
					onClick={() => props.on创建新建CardBtnClick()}
				>
					<span innerHTML={IconPlusSm} />
				</button>
				<button
					type="button"
					title={props.t()('lane名称.showOptions')}
					class="small"
					popoverTarget={`${props.name}-lane-options`}
					onClick={handleOptionsBtnClick}
					onKeyDown={(e) =>
						handleKeyDown(e, () => handleOptionsBtnClick(e, true), handle取消)
					}
				>
					<span innerHTML={IconEllipsisVertical} />
				</button>
			</div>
			{showMenu() ? (
				<Portal>
					<Menu
						id={`${props.name}-lane-options`}
						open={showMenu()}
						options={menuOptions()}
						on关闭={handle取消}
						x={menuCoordinates()?.x}
						y={menuCoordinates()?.y}
					/>
				</Portal>
			) : null}
		</>
	);
}
