import { onMount } from "solid-js";
import { handleKeyDown, clickOutside } from "../utils";

/**
 *
 * @param {Object} props
 * @param {string} props.errorMsg
 * @param {string} props.value
 * @param {string} props.class
 * @param {Function} props.onChange
 * @param {Function} props.on取消
 * @param {Function} props.on确认
 * @param {HTMLElement} props.datalist
 * @param {string} props.list
 * @returns
 */
export function 名称Input(props) {
	let inputRef;

	onMount(() => {
		inputRef.focus();
		inputRef.setSelectionRange(0, props.value.length);
	});

	function handle确认() {
		if (props.errorMsg || !props.value) {
			props.on取消();
			return;
		}
		props.on确认();
	}

	function handleClick(e) {
		e.stopPropagation();
	}

	return (
		<div class="input-and-error-msg">
			<input
				ref={(el) => {
					inputRef = el;
				}}
				type="text"
				class={`${props.class ||  ''} ${props.errorMsg ? "input-error" : ""}`}
				value={props.value}
				onInput={(e) => props.onChange(e.target.value)}
				onFocusOut={handle确认}
				use:clickOutside={handle确认}
				onKeyDown={(e) => handleKeyDown(e, handle确认, props.on取消)}
				onClick={handleClick}
				list={props.list || ''}
			/>
			{props.datalist || null}
			{props.errorMsg ? <span class="error-msg">{props.errorMsg}</span> : <></>}
		</div>
	);
}
