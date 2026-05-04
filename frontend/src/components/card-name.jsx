import { createSignal, createMemo } from "solid-js";
import { Menu } from "./menu";
import { getButtonCoordinates, handleKeyDown } from "../utils";
import { Portal } from "solid-js/web";
import { IconEllipsisVertical } from '@stackoverflow/stacks-icons/icons'

/**
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {boolean} props.hasContent
 * @param {Function} props.onRenameBtnClick
 * @param {Function} props.on删除
 * @param {Function} props.t
 */
export function Card名称(props) {
	const [showMenu, setShowMenu] = createSignal(false);
	const [menuCoordinates, setMenuCoordinates] = createSignal();

	function startRenamingCard() {
		setShowMenu(false);
		props.onRenameBtnClick();
	}

	function handleMenu关闭() {
		setShowMenu(false);
		setMenuCoordinates(null);
	}

	const menuOptions = createMemo(() => [
		{ label: props.t()('card名称.rename'), onClick: startRenamingCard },
		{
			label: props.t()('card名称.delete'),
			onClick: props.on删除,
			requires确认ation: true,
		},
	]);

	function handleClickCardOptions(event, focus) {
		const coordinates = getButtonCoordinates(event);
		setMenuCoordinates(coordinates);
		setShowMenu(true);
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();
	}

	function handle取消() {
		setShowMenu(false);
	}

	return (
		<>
			<div class="card__name">
				{props.hasContent ? "\uD83D\uDCDD " : ""}
				{props.name}
			</div>
			<div class="header-buttons">
				<button
					type="button"
					title={props.t()('card名称.showOptions')}
					class="small"
					popoverTarget={`${props.name}-card-options`}
					onClick={handleClickCardOptions}
					onKeyDown={(e) =>
						handleKeyDown(
							e,
							() => handleClickCardOptions(e, true),
							handle取消,
						)
					}
				>
					<span innerHTML={IconEllipsisVertical} />
				</button>
			</div>
			{showMenu() ? (
				<Portal>
					<Menu
						id={`${props.name}-card-options`}
						open={showMenu()}
						options={menuOptions()}
						on关闭={handleMenu关闭}
						x={menuCoordinates()?.x}
						y={menuCoordinates()?.y}
					/>
				</Portal>
			) : null}
		</>
	);
}
