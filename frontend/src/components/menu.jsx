import { createSignal, createEffect } from "solid-js";
import { clickOutside, handleKeyDown } from "../utils";

/**
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {boolean} props.open
 * @param {number} props.x
 * @param {number} props.y
 * @param {Function} props.on关闭
 * @param {Object[]} props.options
 */
export function Menu(props) {
	const [confirmationPromptCb, set确认ationPromptCb] = createSignal(null);
	let menuRef;
	let confirmBtnRef;

	function close() {
		set确认ationPromptCb(null);
		props.on关闭();
	}

	function handleOptionClick(option, focus) {
		if (option.requires确认ation) {
			set确认ationPromptCb(() => option.onClick);
			if (focus) {
				setTimeout(() => {
					confirmBtnRef.focus();
				}, 0);
			}
			return;
		}
		option.onClick();
		props.on关闭();
	}

	function handleOption确认ation(e) {
		e.stopImmediatePropagation();
		confirmationPromptCb()();
		set确认ationPromptCb(null);
		props.on关闭();
	}

	createEffect(() => {
		if (props.open) {
			menuRef.children[0].focus();
		}
	});

	return (
		<Show when={props.open}>
			<div
				popover
				id={props.id}
				ref={(el) => {
					menuRef = el;
				}}
				class="popup"
				use:clickOutside={close}
				style={{
					top: `${props.y}px`,
					left: `${props.x}px`,
				}}
			>
				<Show
					when={confirmationPromptCb()}
					fallback={props.options.map((option) => (
						<button
							type="button"
							popoverTarget={option.popoverTarget}
							onClick={() => handleOptionClick(option)}
							onKeyDown={(e) =>
								handleKeyDown(
									e,
									() => handleOptionClick(option, true),
									props.on关闭,
								)
							}
						>
							{option.label}
						</button>
					))}
				>
					<button
						ref={(el) => {
							confirmBtnRef = el;
						}}
						type="button"
						onClick={handleOption确认ation}
						onKeyDown={(e) =>
							handleKeyDown(e, () => handleOption确认ation(e), close)
						}
					>
						确认
					</button>
					<button
						type="button"
						onClick={close}
						onKeyDown={(e) => handleKeyDown(e, close, close)}
					>
						取消
					</button>
				</Show>
			</div>
		</Show>
	);
}
