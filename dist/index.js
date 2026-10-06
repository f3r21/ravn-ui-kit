import { clsx as e } from "clsx";
import { twMerge as t } from "tailwind-merge";
import { Fragment as n, jsx as r, jsxs as i } from "react/jsx-runtime";
import { DismissButton as a, FocusScope as o, HiddenSelect as s, Overlay as c, useButton as l, useCalendar as u, useCalendarCell as d, useCalendarGrid as f, useCheckbox as p, useDialog as m, useField as h, useListBox as g, useMenu as _, useMenuItem as v, useMenuTrigger as y, useModalOverlay as b, useObjectRef as x, useOption as S, useOverlay as C, usePopover as w, useSelect as T, useTab as E, useTabList as D, useTabPanel as O, useTextField as k, useToast as A, useToastRegion as j } from "react-aria";
import M, { Fragment as N, createContext as P, useContext as F, useEffect as I, useId as ee, useMemo as L, useRef as R, useState as z } from "react";
import { Item as te, useCalendarState as ne, useListState as re, useMenuTriggerState as ie, useOverlayTriggerState as ae, useSelectState as oe, useTabListState as se, useToastState as ce, useToggleState as le, useTreeState as ue } from "react-stately";
import { createCalendar as de, fromDate as fe, getLocalTimeZone as pe, isSameMonth as me, toCalendarDate as he, today as ge } from "@internationalized/date";
import { createPortal as _e } from "react-dom";
//#region src/utils/cn.ts
function B(...n) {
	return t(e(n));
}
//#endregion
//#region src/utils/format-points.ts
var ve = (e) => `${e} ${e === 1 ? "Pt" : "Pts"}`, ye = (e) => `${e} ${e === 1 ? "Point" : "Points"}`, be = {
	normal: "neutral",
	soon: "yellow",
	overdue: "red"
}, xe = {
	normal: "",
	soon: "due soon",
	overdue: "overdue"
}, Se = {
	BACKLOG: "neutral",
	TODO: "neutral",
	IN_PROGRESS: "yellow",
	DONE: "green",
	CANCELLED: "red"
};
function Ce(e) {
	return Se[e];
}
//#endregion
//#region src/components/icons/icons.tsx
function V({ children: e, ...t }) {
	let n = t["aria-label"] != null || t["aria-labelledby"] != null;
	return /* @__PURE__ */ r("svg", {
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		...n ? { role: "img" } : { "aria-hidden": !0 },
		...t,
		children: e
	});
}
function we(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 18 4",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z",
			fill: "currentColor"
		})
	});
}
function Te(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20.506 19.253",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z",
			fill: "currentColor"
		})
	});
}
function Ee(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 11.7382 12.6733",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z",
			fill: "currentColor"
		})
	});
}
function De(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 12 13.3333",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z",
			fill: "currentColor"
		})
	});
}
function Oe(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 13.3333 13.3333",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z",
			fill: "currentColor"
		})
	});
}
function ke(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 18 18",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z",
			fill: "currentColor"
		})
	});
}
function Ae(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 18 16",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z",
			fill: "currentColor"
		})
	});
}
function je(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 14 14",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z",
			fill: "currentColor"
		})
	});
}
function Me(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20.314 20.314",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z",
			fill: "currentColor"
		})
	});
}
function Ne(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20 21",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z",
			fill: "currentColor"
		})
	});
}
function H(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20 18",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0V0ZM7 8V6H5V8H3V10H5V12H7V10H9V8H7ZM11 8V10H17V8H11Z",
			fill: "currentColor"
		})
	});
}
function Pe(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 16 21",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z",
			fill: "currentColor"
		})
	});
}
function Fe(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20.7988 20.7998",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z",
			fill: "currentColor"
		})
	});
}
function Ie(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 20 20",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z",
			fill: "currentColor"
		})
	});
}
function Le(e) {
	return /* @__PURE__ */ i(V, {
		viewBox: "0 0 40 40",
		...e,
		children: [/* @__PURE__ */ r("g", {
			transform: "translate(0 2)",
			children: /* @__PURE__ */ r("path", {
				d: "M30.4218 24.5565C35.7216 23.1082 39.6183 18.2592 39.6183 12.5C39.6183 5.71624 34.214 0.194797 27.477 0.00660328V0H8.06627H0L6.69512 8.33114H8.06627V8.33334H27.181C29.4535 8.36636 31.2857 10.2186 31.2857 12.4989C31.2857 14.8002 29.4204 16.6656 27.1194 16.6656H24.0811H13.3913L28.9285 36H39.6172L30.4218 24.5565Z",
				fill: "currentColor"
			})
		}), /* @__PURE__ */ r("g", {
			transform: "translate(3.5 27)",
			children: /* @__PURE__ */ r("path", {
				d: "M5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11Z",
				fill: "currentColor"
			})
		})]
	});
}
function Re(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: /* @__PURE__ */ r("path", { d: "m15.5 5-7 7 7 7" })
	});
}
function ze(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: /* @__PURE__ */ r("path", { d: "m8.5 5 7 7-7 7" })
	});
}
function U(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: /* @__PURE__ */ r("path", { d: "m5 8.5 7 7 7-7" })
	});
}
function Be(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: /* @__PURE__ */ r("path", { d: "m18 5-7 7 7 7M12 5l-7 7 7 7" })
	});
}
function Ve(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: /* @__PURE__ */ r("path", { d: "m6 5 7 7-7 7M12 5l7 7-7 7" })
	});
}
function He(e) {
	return /* @__PURE__ */ r(V, {
		viewBox: "0 0 14 14",
		...e,
		children: /* @__PURE__ */ r("path", {
			d: "M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z",
			fill: "currentColor"
		})
	});
}
//#endregion
//#region src/components/button/button.tsx
function Ue({ variant: e = "secondary", isSelected: t = !1, children: n, className: i, isDisabled: a, role: o, "aria-checked": s, ref: c, ...u }) {
	let d = x(c), { buttonProps: f } = l({
		...u,
		isDisabled: a
	}, d), p = {
		primary: "bg-primary-4 text-main border border-transparent",
		secondary: t ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
	};
	return /* @__PURE__ */ r("button", {
		...f,
		role: o,
		"aria-checked": s,
		ref: d,
		className: B("inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none", p[e], i),
		children: /* @__PURE__ */ r("span", {
			className: "w-6 h-6 shrink-0 flex items-center justify-center",
			children: n
		})
	});
}
//#endregion
//#region src/components/button/text-button.tsx
function We({ variant: e = "primary", isSelected: t = !1, className: n, isDisabled: i, ref: a, ...o }) {
	let s = x(a), { buttonProps: c } = l({
		...o,
		isDisabled: i
	}, s), u = {
		primary: B("text-main", i ? "bg-primary-2" : t ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"),
		secondary: i ? "bg-transparent text-muted" : t ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2 hover:text-neutral-5"
	};
	return /* @__PURE__ */ r("button", {
		...c,
		ref: s,
		className: B("inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:pointer-events-none", u[e], n),
		children: o.children
	});
}
//#endregion
//#region src/components/form-field/form-field.tsx
function W() {
	return /* @__PURE__ */ r("span", {
		"aria-hidden": "true",
		className: "text-danger-text ml-0.5",
		children: "*"
	});
}
var Ge = "text-body-m font-semibold text-main font-sans", Ke = "sr-only";
function G(e) {
	return e ? Ge : Ke;
}
var qe = "text-xs text-muted-on-dark font-sans", Je = "text-xs text-danger-text font-sans";
function K({ description: e, error: t, descriptionProps: n, errorMessageProps: i, className: a, ref: o, ...s }) {
	return t ? /* @__PURE__ */ r("span", {
		...s,
		...i,
		ref: o,
		className: B(Je, a),
		children: t
	}) : e ? /* @__PURE__ */ r("span", {
		...s,
		...n,
		ref: o,
		className: B(qe, a),
		children: e
	}) : null;
}
function Ye({ label: e, isLabelVisible: t = !1, description: n, error: a, isRequired: o = !1, children: s, className: c, ref: l, ...u }) {
	let { labelProps: d, fieldProps: f, descriptionProps: p, errorMessageProps: m } = h({
		...u,
		label: e,
		description: n,
		errorMessage: a,
		isInvalid: !!a
	});
	return /* @__PURE__ */ i("div", {
		ref: l,
		className: B("flex flex-col gap-1.5", c),
		children: [
			e ? /* @__PURE__ */ i("label", {
				...d,
				className: G(t),
				children: [e, o ? /* @__PURE__ */ r(W, {}) : null]
			}) : null,
			s({
				...f,
				...o ? { "aria-required": !0 } : {},
				...a ? { "aria-invalid": !0 } : {}
			}),
			/* @__PURE__ */ r(K, {
				description: n,
				error: a,
				descriptionProps: p,
				errorMessageProps: m
			})
		]
	});
}
//#endregion
//#region src/components/input/input.tsx
function Xe({ label: e, isLabelVisible: t = !1, error: n, description: a, className: o, ref: s, ...c }) {
	let l = x(s), { labelProps: u, inputProps: d, descriptionProps: f, errorMessageProps: p } = k({
		...c,
		label: e,
		description: a,
		isInvalid: !!n,
		errorMessage: n
	}, l);
	return /* @__PURE__ */ i("div", {
		className: "flex flex-col gap-1.5 w-full",
		children: [
			e ? /* @__PURE__ */ i("label", {
				...u,
				className: G(t),
				children: [e, c.isRequired ? /* @__PURE__ */ r(W, {}) : null]
			}) : null,
			/* @__PURE__ */ r("input", {
				...d,
				ref: l,
				className: B("h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted-on-light transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral", n && "border-danger-5 focus-visible:outline-danger-text", o)
			}),
			/* @__PURE__ */ r(K, {
				description: a,
				error: n,
				descriptionProps: f,
				errorMessageProps: p
			})
		]
	});
}
//#endregion
//#region src/components/top-nav/search-bar.tsx
function Ze({ placeholder: e = "Search...", value: t, onChange: n, onSubmit: a, label: o = "Search", id: s, className: c, ref: l }) {
	let [u, d] = z(""), f = t !== void 0, p = f ? t : u, m = x(l), { inputProps: h } = k({
		value: p,
		onChange: (e) => {
			f || d(e), n?.(e);
		},
		onKeyDown: (e) => {
			e.key === "Enter" && a?.(p);
		},
		"aria-label": o,
		id: s,
		type: "search",
		placeholder: e
	}, m);
	return /* @__PURE__ */ i("div", {
		className: B("inline-flex items-center gap-6 min-w-0", c),
		children: [/* @__PURE__ */ r(Me, { className: "w-6 h-6 text-muted shrink-0" }), /* @__PURE__ */ r("input", {
			...h,
			ref: m,
			className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted-on-dark font-sans min-w-0 rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
		})]
	});
}
//#endregion
//#region src/components/avatar/avatar.tsx
function q({ src: e, name: t, fallbackLabel: n = "Unassigned", size: i = "md", className: a, ref: o, ...s }) {
	let c = {
		sm: "w-8 h-8 text-xs font-semibold",
		md: "w-10 h-10 text-sm font-semibold",
		lg: "w-12 h-12 text-base font-bold"
	}, l = (e) => {
		if (!e) return "?";
		let t = e.trim().split(" ");
		return t.length >= 2 ? `${t[0][0]}${t[1][0]}`.toUpperCase() : t[0].substring(0, 2).toUpperCase();
	}, u = t || n;
	return /* @__PURE__ */ r("div", {
		...s,
		ref: o,
		role: "img",
		"aria-label": u,
		title: u,
		className: B("relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-neutral-5 select-none shrink-0", c[i], a),
		children: e ? /* @__PURE__ */ r("img", {
			src: e,
			alt: "",
			className: "w-full h-full object-cover"
		}) : /* @__PURE__ */ r("span", { children: l(t) })
	});
}
//#endregion
//#region src/components/top-nav/top-nav.tsx
function Qe({ searchValue: e, searchPlaceholder: t, onSearchChange: n, onSearchSubmit: a, searchLabel: o, clearSearchLabel: s = "Clear search", icon: c, onNotificationsClick: l, notificationsLabel: u = "Notifications", userName: d, userAvatar: f, userSlot: p, actions: m, className: h, ref: g, ..._ }) {
	let [v, y] = z(""), b = e !== void 0, x = b ? e : v, S = (e) => {
		b || y(e), n?.(e);
	}, C = () => {
		b || y(""), n?.("");
	};
	return /* @__PURE__ */ i("header", {
		..._,
		ref: g,
		className: B("flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md", h),
		children: [/* @__PURE__ */ r(Ze, {
			placeholder: t,
			value: x,
			onChange: S,
			onSubmit: a,
			label: o,
			className: "flex-1"
		}), /* @__PURE__ */ i("div", {
			className: "flex items-center gap-6 shrink-0",
			children: [
				x ? /* @__PURE__ */ r("button", {
					type: "button",
					onClick: C,
					"aria-label": s,
					className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
					children: /* @__PURE__ */ r(He, { className: "w-full h-full" })
				}) : null,
				l ? /* @__PURE__ */ r("button", {
					type: "button",
					onClick: l,
					"aria-label": u,
					className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
					children: c ?? /* @__PURE__ */ r(Ne, { className: "w-full h-full" })
				}) : /* @__PURE__ */ r("span", {
					className: "w-6 h-6 text-muted shrink-0",
					children: c ?? /* @__PURE__ */ r(Ne, { className: "w-full h-full" })
				}),
				m,
				p ?? (d || f ? /* @__PURE__ */ r(q, {
					src: f,
					name: d,
					size: "md"
				}) : null)
			]
		})]
	});
}
//#endregion
//#region src/components/tabs/tabs.tsx
function $e({ items: e, panels: t, defaultSelectedKey: n, selectedKey: a, onSelectionChange: o, label: s = "Tab navigation", className: c, ref: l, ...u }) {
	let d = L(() => new Map(e.map((e) => [e.id, e])), [e]), f = se({
		items: e,
		selectedKey: a,
		defaultSelectedKey: n ?? e[0]?.id,
		onSelectionChange: (e) => o?.(String(e)),
		children: (e) => /* @__PURE__ */ r(te, {
			textValue: e.label,
			children: e.label
		}, e.id)
	}), p = R(null), { tabListProps: m } = D({ "aria-label": s }, f, p);
	return /* @__PURE__ */ i("div", {
		...u,
		ref: l,
		className: B("flex flex-col", c),
		children: [/* @__PURE__ */ r("div", {
			...m,
			ref: p,
			className: "flex items-end",
			children: [...f.collection].map((e) => /* @__PURE__ */ r(et, {
				item: e,
				state: f,
				icon: d.get(String(e.key))?.icon
			}, e.key))
		}), t ? /* @__PURE__ */ r(tt, {
			state: f,
			panels: t
		}) : null]
	});
}
function et({ item: e, state: t, icon: n }) {
	let a = R(null), { tabProps: o, isSelected: s } = E({ key: e.key }, t, a);
	return /* @__PURE__ */ i("button", {
		...o,
		ref: a,
		type: "button",
		className: B("relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2", s ? "text-interactive-text" : "text-muted-on-dark hover:text-main"),
		children: [
			n ? /* @__PURE__ */ r("span", {
				className: "text-base leading-none",
				children: n
			}) : null,
			e.rendered ?? e.textValue,
			s ? /* @__PURE__ */ r("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
		]
	});
}
function tt({ state: e, panels: t }) {
	let n = R(null), { tabPanelProps: i } = O({}, e, n), a = e.selectedKey == null ? "" : String(e.selectedKey);
	return /* @__PURE__ */ r("div", {
		...i,
		ref: n,
		className: "flex-1",
		children: t[a] ?? null
	});
}
//#endregion
//#region src/components/tabs/segmented-control.tsx
function nt({ options: e, value: t, defaultValue: n, onChange: a, label: o = "View", className: s, ref: c, ...l }) {
	let [u, d] = M.useState(n ?? e[0]?.id ?? ""), f = t !== void 0, p = f ? t : u, m = R([]), h = (e) => {
		f || d(e), a?.(e);
	}, g = (t) => {
		let n = e.findIndex((e) => e.id === p);
		if (n === -1) return;
		let r;
		switch (t.key) {
			case "ArrowRight":
			case "ArrowDown":
				r = (n + 1) % e.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				r = (n - 1 + e.length) % e.length;
				break;
			case "Home":
				r = 0;
				break;
			case "End":
				r = e.length - 1;
				break;
			default: return;
		}
		t.preventDefault();
		let i = e[r];
		h(i.id), m.current[r]?.focus();
	};
	return /* @__PURE__ */ r("div", {
		...l,
		ref: c,
		role: "radiogroup",
		"aria-label": o,
		className: B("inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10", s),
		children: e.map((e, t) => {
			let n = p === e.id;
			return /* @__PURE__ */ i("button", {
				ref: (e) => {
					m.current[t] = e;
				},
				type: "button",
				role: "radio",
				"aria-checked": n,
				tabIndex: n ? 0 : -1,
				onClick: () => h(e.id),
				onKeyDown: g,
				className: B("inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2", n ? "bg-neutral-2 text-neutral-5 shadow-small" : ""),
				children: [e.icon ? /* @__PURE__ */ r("span", {
					className: "text-base leading-none",
					children: e.icon
				}) : null, e.label]
			}, e.id);
		})
	});
}
//#endregion
//#region src/components/card/card.tsx
var rt = "bg-surface-panel text-main rounded-sm border border-transparent shadow-xs transition-all";
function J({ children: e, as: t, isInteractive: n = !1, className: i, ref: a, ...o }) {
	return /* @__PURE__ */ r(t ?? "div", {
		...o,
		ref: a,
		className: B(rt, "flex flex-col gap-4 p-4", n && "hover:border-subtle select-none", i),
		children: e
	});
}
function it({ children: e, className: t, ref: n, ...i }) {
	return /* @__PURE__ */ r("div", {
		...i,
		ref: n,
		className: B("flex items-center gap-2", t),
		children: e
	});
}
function at({ children: e, className: t, ref: n, ...i }) {
	return /* @__PURE__ */ r("div", {
		...i,
		ref: n,
		className: B("flex flex-col gap-4 flex-1 min-w-0", t),
		children: e
	});
}
function ot({ children: e, className: t, ref: n, ...i }) {
	return /* @__PURE__ */ r("div", {
		...i,
		ref: n,
		className: B("flex items-center gap-2 mt-auto", t),
		children: e
	});
}
J.Header = it, J.Body = at, J.Footer = ot;
//#endregion
//#region src/components/tag/tag.tsx
function Y({ accent: e = "neutral", appearance: t = "solid", icon: n, children: a, onRemove: o, removeLabel: s = "Remove tag", className: c, ref: l, ...u }) {
	let d = {
		neutral: {
			solid: "bg-neutral-2/10 text-main",
			outline: "border border-neutral-1 text-main"
		},
		red: {
			solid: "bg-primary-4/10 text-primary-2",
			outline: "border border-primary-2 text-primary-2"
		},
		green: {
			solid: "bg-secondary-4/10 text-secondary-2",
			outline: "border border-secondary-2 text-secondary-2"
		},
		yellow: {
			solid: "bg-tertiary-4/10 text-tertiary-4",
			outline: "border border-tertiary-4 text-tertiary-4"
		},
		blue: {
			solid: "bg-blue/10 text-main",
			outline: "border border-blue text-main"
		}
	};
	return /* @__PURE__ */ i("span", {
		...u,
		ref: l,
		className: B("inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none", t === "outline" ? d[e].outline : d[e].solid, c),
		children: [
			n ? /* @__PURE__ */ r("span", {
				className: "flex items-center justify-center w-6 h-6 shrink-0",
				children: n
			}) : null,
			a,
			o ? /* @__PURE__ */ r("button", {
				type: "button",
				onClick: o,
				"aria-label": s,
				className: "hover:bg-neutral-5/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
				children: "×"
			}) : null
		]
	});
}
//#endregion
//#region src/components/card/project-info.tsx
function X({ title: e, icon: t, onTitleClick: n, headingLevel: a = 3, titleId: o, className: s, ref: c, ...l }) {
	let u = `h${a}`;
	return /* @__PURE__ */ i("div", {
		...l,
		ref: c,
		className: B("flex items-center gap-2 w-full", s),
		children: [/* @__PURE__ */ r(u, {
			id: o,
			className: B("flex-1 min-w-0 text-body-l font-semibold text-main font-sans", !n && "truncate"),
			children: n ? /* @__PURE__ */ r("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation(), n();
				},
				className: "inline-block max-w-full truncate align-bottom text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
				children: e
			}) : e
		}), t ? /* @__PURE__ */ r("span", {
			className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted",
			children: t
		}) : null]
	});
}
//#endregion
//#region src/components/card/task-meta-badges.tsx
function st({ badges: e, className: t, ref: n, ...a }) {
	return /* @__PURE__ */ r("div", {
		...a,
		ref: n,
		className: B("flex flex-wrap items-center gap-4", t),
		children: e.map((e, t) => /* @__PURE__ */ i("span", {
			"aria-hidden": e.decorative || void 0,
			className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
			children: [
				e.decorative ? null : /* @__PURE__ */ r("span", {
					className: "sr-only",
					children: e.label
				}),
				e.count === void 0 ? null : /* @__PURE__ */ r("span", {
					className: "tabular-nums",
					"aria-hidden": !0,
					children: e.count
				}),
				/* @__PURE__ */ r("span", {
					className: "w-6 h-6 shrink-0",
					"aria-hidden": !0,
					children: e.icon
				})
			]
		}, e.decorative ? `decorative-${t}` : e.label))
	});
}
//#endregion
//#region src/components/card/due-date-urgency-state.tsx
function ct({ urgency: e, labels: t }) {
	let n = t?.[e] ?? xe[e];
	return n ? /* @__PURE__ */ i("span", {
		className: "sr-only",
		children: [", ", n]
	}) : null;
}
//#endregion
//#region src/components/card/task-card.tsx
function lt({ title: e, points: t, formatPoints: n = ve, dueDateText: a, dueDateUrgency: o = "normal", dueDateUrgencyLabel: s, tags: c = [], assigneeName: l, assigneeAvatar: u, metaBadges: d = [], actions: f, icon: p, headingLevel: m = 3, titleId: h, className: g, onPress: _, ref: v, ...y }) {
	let b = ee(), x = h ?? b;
	return /* @__PURE__ */ i(J, {
		...y,
		as: "article",
		isInteractive: !0,
		"aria-labelledby": x,
		onClick: _,
		ref: v,
		className: B(_ && "cursor-pointer", g),
		children: [
			f ? /* @__PURE__ */ i("div", {
				className: "flex items-start gap-2",
				children: [/* @__PURE__ */ r(X, {
					title: e,
					icon: p,
					onTitleClick: _,
					headingLevel: m,
					titleId: x,
					className: "flex-1 min-w-0"
				}), /* @__PURE__ */ r("div", {
					className: "shrink-0",
					onClick: (e) => e.stopPropagation(),
					children: f
				})]
			}) : /* @__PURE__ */ r(X, {
				title: e,
				icon: p,
				onTitleClick: _,
				headingLevel: m,
				titleId: x
			}),
			t !== void 0 || a ? /* @__PURE__ */ i("div", {
				className: "flex items-center justify-between gap-2",
				children: [t === void 0 ? null : /* @__PURE__ */ r("span", {
					className: "text-body-m font-semibold text-main font-sans",
					children: n(t)
				}), a ? /* @__PURE__ */ i(Y, {
					accent: be[o],
					icon: /* @__PURE__ */ r(Te, { className: "size-6" }),
					children: [a, /* @__PURE__ */ r(ct, {
						urgency: o,
						labels: s
					})]
				}) : null]
			}) : null,
			c.length > 0 ? /* @__PURE__ */ r("div", {
				className: "flex flex-wrap items-center gap-2",
				children: c.map((e, t) => /* @__PURE__ */ r(Y, {
					accent: e.accent || "neutral",
					className: B("uppercase", e.className),
					children: e.label
				}, t))
			}) : null,
			/* @__PURE__ */ i("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ i("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ r(q, {
						src: u,
						name: l,
						size: "sm"
					}), l ? /* @__PURE__ */ r("span", {
						className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]",
						children: l
					}) : null]
				}), d.length > 0 ? /* @__PURE__ */ r(st, { badges: d }) : null]
			})
		]
	});
}
//#endregion
//#region src/components/skeleton/skeleton.tsx
function Z({ className: e, ref: t, ...n }) {
	return /* @__PURE__ */ r("div", {
		...n,
		ref: t,
		"aria-hidden": !0,
		className: B("motion-safe:animate-pulse rounded-sm bg-neutral-3", e)
	});
}
//#endregion
//#region src/components/empty-state/empty-state.tsx
function ut({ title: e, description: t, icon: n, action: a, label: o = "No results", className: s, ref: c, ...l }) {
	return /* @__PURE__ */ i("div", {
		...l,
		ref: c,
		role: "group",
		"aria-label": o,
		className: B("flex flex-col items-center gap-2 rounded-sm border border-dashed border-subtle/20", "px-6 py-10 text-center font-sans", s),
		children: [
			n ? /* @__PURE__ */ r("span", {
				className: "flex items-center justify-center w-12 h-12 shrink-0 text-muted",
				children: n
			}) : null,
			/* @__PURE__ */ r("p", {
				className: "text-body-m font-semibold text-main",
				children: e
			}),
			t ? /* @__PURE__ */ r("p", {
				className: "text-body-m text-muted-on-dark",
				children: t
			}) : null,
			a
		]
	});
}
//#endregion
//#region src/components/card/task-list-view.tsx
function dt() {
	return /* @__PURE__ */ i("div", {
		className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent",
		children: [
			/* @__PURE__ */ r(Z, { className: "h-6 w-3/4" }),
			/* @__PURE__ */ i("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ r(Z, { className: "h-6 w-16" }), /* @__PURE__ */ r(Z, { className: "h-6 w-20 rounded" })]
			}),
			/* @__PURE__ */ r("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ i("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ r(Z, { className: "w-8 h-8 rounded-full" }), /* @__PURE__ */ r(Z, { className: "h-3 w-20" })]
				})
			})
		]
	});
}
function ft({ title: e, icon: t, tasks: a, isLoading: o = !1, emptyTitle: s = "No tasks in this view", emptyDescription: c, emptyAction: l, empty: u, headingLevel: d = 3, label: f, className: p, ref: m, ...h }) {
	return /* @__PURE__ */ i(f ? "section" : "div", {
		...h,
		ref: m,
		"aria-label": f,
		className: B("flex flex-col gap-4 w-full", p),
		children: [/* @__PURE__ */ r(X, {
			title: e,
			icon: t,
			headingLevel: d
		}), o ? /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r(dt, {}),
			/* @__PURE__ */ r(dt, {}),
			/* @__PURE__ */ r(dt, {})
		] }) : a.length === 0 ? u ?? /* @__PURE__ */ r(ut, {
			title: s,
			description: c,
			action: l
		}) : a.map((e, t) => /* @__PURE__ */ r(lt, {
			...e,
			className: "w-full"
		}, t))]
	});
}
//#endregion
//#region src/components/card/task-table.tsx
var pt = {
	name: 500,
	tags: 168,
	estimation: 140,
	assignee: 168,
	dueDate: 132
}, mt = ({ className: e }) => /* @__PURE__ */ r("svg", {
	className: e,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	"aria-hidden": !0,
	children: /* @__PURE__ */ r("rect", {
		x: "4",
		y: "4",
		width: "16",
		height: "16",
		rx: "3"
	})
}), Q = "text-body-m font-normal text-main font-sans", ht = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function gt({ date: e, dueDateUrgency: t = "normal", dueDateUrgencyLabel: n, className: a, ref: o, ...s }) {
	let c = {
		normal: "text-main",
		soon: "text-tertiary-4",
		overdue: "text-primary-2"
	};
	return /* @__PURE__ */ i("span", {
		...s,
		ref: o,
		className: B(Q, c[t], a),
		children: [e, /* @__PURE__ */ r(ct, {
			urgency: t,
			labels: n
		})]
	});
}
function _t({ name: e, avatarSrc: t, unassignedLabel: n = "Unassigned", className: a, ref: o, ...s }) {
	return /* @__PURE__ */ i("div", {
		...s,
		ref: o,
		className: B("flex items-center gap-2 min-w-0", a),
		children: [/* @__PURE__ */ r(q, {
			src: t,
			name: e,
			fallbackLabel: n,
			size: "sm"
		}), e ? /* @__PURE__ */ r("span", {
			className: B(Q, "truncate"),
			children: e
		}) : null]
	});
}
function vt({ points: e, formatPoints: t = ye, className: n, ref: i, ...a }) {
	return /* @__PURE__ */ r("span", {
		...a,
		ref: i,
		className: B(Q, "tabular-nums", n),
		children: t(e)
	});
}
function yt({ labels: e, className: t, ref: n, ...i }) {
	return /* @__PURE__ */ r("div", {
		...i,
		ref: n,
		className: B("flex flex-wrap items-center gap-2", t),
		children: e.map((e, t) => /* @__PURE__ */ r(Y, {
			accent: e.accent ?? "neutral",
			className: B("uppercase", e.className),
			children: e.label
		}, t))
	});
}
var bt = {
	neutral: "bg-neutral-2",
	red: "bg-primary-4",
	green: "bg-secondary-4",
	yellow: "bg-tertiary-4",
	blue: "bg-blue"
};
function xt({ index: e, title: t, accent: n = "neutral", reactions: a = [], isSelected: o = !1, onChange: s, isSelectable: c = !0, selectLabel: l, detailsLabel: u = "Details", headingLevel: d, tags: f = [], estimationPoints: p, formatPoints: m, assigneeName: h, assigneeAvatar: g, unassignedLabel: _, dueDate: v, dueDateUrgency: y = "normal", dueDateUrgencyLabel: b, actions: x, columns: S, columnLabels: C, onPress: w, onViewDetails: T, className: E, ref: D, ...O }) {
	let k = kt(S, C), A = {
		index: e,
		title: t,
		accent: n,
		reactions: a,
		isSelected: o,
		onChange: s,
		isSelectable: c,
		selectLabel: l,
		detailsLabel: u,
		headingLevel: d,
		tags: f,
		estimationPoints: p,
		formatPoints: m,
		assigneeName: h,
		assigneeAvatar: g,
		unassignedLabel: _,
		dueDate: v,
		dueDateUrgency: y,
		dueDateUrgencyLabel: b,
		actions: x,
		onPress: w,
		onViewDetails: T
	}, j = (e) => e.stopPropagation(), M = d ? `h${d}` : null, N = M ? "inline-block max-w-full align-bottom" : "flex-1 min-w-0", P = w ? /* @__PURE__ */ r("button", {
		type: "button",
		onClick: (e) => {
			j(e), w();
		},
		className: B(Q, N, "truncate text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1"),
		children: t
	}) : /* @__PURE__ */ r("span", {
		className: B(Q, N, "truncate"),
		children: t
	}), F = {
		name: /* @__PURE__ */ i("div", {
			className: "flex items-center gap-2 h-full",
			children: [
				/* @__PURE__ */ r("span", { className: B("w-1 h-full shrink-0", bt[n]) }),
				c ? /* @__PURE__ */ i("label", {
					onClick: j,
					className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-1",
					children: [/* @__PURE__ */ r("input", {
						type: "checkbox",
						className: "sr-only",
						checked: o,
						onChange: (e) => s?.(e.target.checked),
						"aria-label": l ?? `Select ${t}`
					}), /* @__PURE__ */ r(mt, { className: B("w-6 h-6 text-main transition-opacity", o ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100") })]
				}) : null,
				/* @__PURE__ */ r("span", {
					className: B(Q, "shrink-0 tabular-nums"),
					children: String(e).padStart(2, "0")
				}),
				M ? /* @__PURE__ */ r(M, {
					className: B(Q, "flex-1 min-w-0"),
					children: P
				}) : P,
				a.map((e, t) => /* @__PURE__ */ i("span", {
					"aria-hidden": e.decorative || void 0,
					className: B(Q, "inline-flex items-center gap-1 shrink-0"),
					children: [
						e.decorative ? null : /* @__PURE__ */ r("span", {
							className: "sr-only",
							children: e.label
						}),
						e.count === void 0 ? null : /* @__PURE__ */ r("span", {
							className: "tabular-nums",
							"aria-hidden": !0,
							children: e.count
						}),
						/* @__PURE__ */ r("span", {
							className: "w-6 h-6 shrink-0",
							"aria-hidden": !0,
							children: e.icon
						})
					]
				}, e.decorative ? `decorative-${t}` : e.label)),
				T ? /* @__PURE__ */ i("button", {
					type: "button",
					onClick: (e) => {
						j(e), T();
					},
					className: B(Q, "inline-flex items-center gap-1 shrink-0 hover:text-interactive-text transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs"),
					children: [/* @__PURE__ */ r("span", { children: u }), /* @__PURE__ */ r(ze, { className: "w-4 h-4" })]
				}) : null,
				x ? /* @__PURE__ */ r("div", {
					className: "shrink-0",
					onClick: j,
					children: x
				}) : null
			]
		}),
		tags: /* @__PURE__ */ r("div", {
			className: "flex items-center gap-2 h-full",
			children: f.length > 0 ? /* @__PURE__ */ r(yt, { labels: f }) : null
		}),
		estimation: /* @__PURE__ */ r("div", {
			className: "flex items-center gap-2 h-full",
			children: p === void 0 ? null : /* @__PURE__ */ r(vt, {
				points: p,
				formatPoints: m
			})
		}),
		assignee: /* @__PURE__ */ r("div", {
			className: "flex items-center gap-2 h-full",
			children: /* @__PURE__ */ r(_t, {
				name: h,
				avatarSrc: g,
				unassignedLabel: _
			})
		}),
		dueDate: /* @__PURE__ */ r("div", {
			className: "flex items-center gap-2 h-full",
			children: v ? /* @__PURE__ */ r(gt, {
				date: v,
				dueDateUrgency: y,
				dueDateUrgencyLabel: b
			}) : null
		})
	};
	return /* @__PURE__ */ r("tr", {
		...O,
		onClick: w,
		ref: D,
		className: B("group", w && "cursor-pointer", E),
		children: k.map((e, t) => /* @__PURE__ */ r("td", {
			className: B(ht, e.key === "name" ? "pl-0 pr-4" : "pl-2 pr-4", t === 0 && "border-l"),
			style: { width: e.width },
			children: e.renderCell ? e.renderCell(A) : F[e.key]
		}, e.key))
	});
}
function St({ columns: e }) {
	let t = {
		name: /* @__PURE__ */ r(Z, { className: "h-4 w-full" }),
		tags: /* @__PURE__ */ r(Z, { className: "h-6 w-16 rounded" }),
		estimation: /* @__PURE__ */ r(Z, { className: "h-4 w-16" }),
		assignee: /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r(Z, { className: "w-8 h-8 rounded-full shrink-0" }), /* @__PURE__ */ r(Z, { className: "h-4 w-20" })] }),
		dueDate: /* @__PURE__ */ r(Z, { className: "h-4 w-20" })
	};
	return /* @__PURE__ */ r("tr", { children: e.map((e, n) => /* @__PURE__ */ r("td", {
		className: B(ht, "pl-4 pr-4", n === 0 && "border-l"),
		style: { width: e.width },
		children: /* @__PURE__ */ r("div", {
			className: "flex items-center gap-2 h-full",
			children: t[e.key] ?? /* @__PURE__ */ r(Z, { className: "h-4 w-16" })
		})
	}, e.key)) });
}
function Ct({ level: e, children: t }) {
	let n = `h${e}`;
	return /* @__PURE__ */ r(n, {
		className: "flex-1 min-w-0",
		children: t
	});
}
function wt({ title: e, isExpanded: t, onToggle: n }) {
	return /* @__PURE__ */ i("button", {
		type: "button",
		onClick: n,
		"aria-expanded": t,
		className: "flex items-center gap-2 min-w-0 max-w-full text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1",
		children: [/* @__PURE__ */ r(U, { className: B("w-6 h-6 shrink-0 text-muted transition-transform", !t && "-rotate-90") }), /* @__PURE__ */ r("span", {
			className: "truncate text-body-l font-semibold text-main font-sans",
			children: e
		})]
	});
}
var Tt = {
	name: "# Task Name",
	tags: "Task Tags",
	estimation: "Estimate",
	assignee: "Task Assign Name",
	dueDate: "Due Date"
}, Et = [
	"name",
	"tags",
	"estimation",
	"assignee",
	"dueDate"
];
function Dt(e) {
	return "renderCell" in e;
}
var Ot = Et.map((e) => ({ key: e }));
function kt(e, t) {
	return (e ?? Ot).map((e) => Dt(e) ? {
		key: e.key,
		label: e.label,
		width: e.width,
		renderCell: e.renderCell
	} : {
		key: e.key,
		label: e.label ?? t?.[e.key] ?? Tt[e.key],
		width: e.width ?? pt[e.key]
	});
}
function At({ groups: e, isLoading: t = !1, emptyTitle: n = "No tasks yet", emptyDescription: a, emptyAction: o, empty: s, columnLabels: c, columns: l, className: u, ref: d, ...f }) {
	let p = kt(l, c), m = p.reduce((e, t) => e + t.width, 0), [h, g] = z(() => /* @__PURE__ */ new Set()), _ = (e) => {
		g((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : n.add(e), n;
		});
	};
	return /* @__PURE__ */ r("div", {
		...f,
		ref: d,
		className: B("w-full overflow-x-auto", "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full", u),
		children: /* @__PURE__ */ i("div", {
			className: "flex flex-col gap-4",
			style: { minWidth: m },
			children: [/* @__PURE__ */ r("div", {
				className: "flex",
				children: p.map(({ key: e, label: t, width: n }, i) => /* @__PURE__ */ r("div", {
					className: B(ht, "px-4", i === 0 && "border-l rounded-l-4", i === p.length - 1 && "rounded-r-4"),
					style: { width: n },
					children: /* @__PURE__ */ r("span", {
						className: B(Q, "whitespace-nowrap"),
						children: t
					})
				}, e))
			}), t ? /* @__PURE__ */ i("table", {
				className: "border-collapse table-fixed",
				children: [/* @__PURE__ */ r("colgroup", { children: p.map(({ key: e, width: t }) => /* @__PURE__ */ r("col", { style: { width: t } }, e)) }), /* @__PURE__ */ r("tbody", { children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ r(St, { columns: p }, t)) })]
			}) : e.length === 0 ? s ?? /* @__PURE__ */ r(ut, {
				title: n,
				description: a,
				action: o
			}) : e.map((e, t) => {
				let n = !h.has(t);
				return /* @__PURE__ */ i("table", {
					className: "border-collapse table-fixed",
					children: [/* @__PURE__ */ r("colgroup", { children: p.map(({ key: e, width: t }) => /* @__PURE__ */ r("col", { style: { width: t } }, e)) }), /* @__PURE__ */ i("tbody", { children: [/* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", {
						colSpan: p.length,
						className: "p-0 border border-neutral-3",
						children: /* @__PURE__ */ i("div", {
							className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4",
							children: [/* @__PURE__ */ r(Ct, {
								level: e.headingLevel ?? 3,
								children: /* @__PURE__ */ r(wt, {
									title: e.title,
									isExpanded: n,
									onToggle: () => _(t)
								})
							}), e.actions]
						})
					}) }), n ? e.rows.map((e, t) => /* @__PURE__ */ r(xt, {
						...e,
						columns: l,
						columnLabels: c
					}, t)) : null] })]
				}, t);
			})]
		})
	});
}
//#endregion
//#region src/components/popover/popover.tsx
function $({ isOpen: e, onClose: t, triggerRef: n, dismissExemptRef: s, children: c, className: l, ref: u, ...d }) {
	let f = x(u), { overlayProps: p } = C({
		isOpen: e,
		onClose: t,
		isDismissable: !0,
		shouldCloseOnInteractOutside: (e) => !n?.current?.contains(e) && !s?.current?.contains(e)
	}, f);
	return e ? /* @__PURE__ */ r(o, {
		restoreFocus: !0,
		autoFocus: !0,
		children: /* @__PURE__ */ i("div", {
			...p,
			...d,
			ref: f,
			role: "dialog",
			className: l,
			children: [
				/* @__PURE__ */ r(a, { onDismiss: t }),
				c,
				/* @__PURE__ */ r(a, { onDismiss: t })
			]
		})
	}) : null;
}
//#endregion
//#region src/components/popover/floating-popover.tsx
function jt({ state: e, children: t, className: n, ref: s, ...l }) {
	let u = x(s), { popoverProps: d, underlayProps: f } = w({
		...l,
		popoverRef: u
	}, e);
	return /* @__PURE__ */ i(c, { children: [/* @__PURE__ */ r("div", {
		...f,
		className: "fixed inset-0"
	}), /* @__PURE__ */ r(o, {
		restoreFocus: !0,
		children: /* @__PURE__ */ i("div", {
			...d,
			ref: u,
			onKeyDownCapture: (t) => {
				t.key === "Escape" && (t.stopPropagation(), e.close());
			},
			className: B("z-popover bg-surface-overlay rounded-sm border border-subtle shadow-xl", n),
			children: [
				/* @__PURE__ */ r(a, { onDismiss: () => e.close() }),
				t,
				/* @__PURE__ */ r(a, { onDismiss: () => e.close() })
			]
		})
	})] });
}
//#endregion
//#region src/components/listbox/list-box.tsx
function Mt({ state: e, className: t, ref: n, ...i }) {
	let a = x(n), { listBoxProps: o } = g(i, e, a);
	return /* @__PURE__ */ r("ul", {
		...o,
		ref: a,
		className: B("max-h-64 min-w-40 overflow-auto py-2 outline-none", t),
		children: [...e.collection].map((t) => /* @__PURE__ */ r(Nt, {
			item: t,
			state: e
		}, t.key))
	});
}
function Nt({ item: e, state: t }) {
	let n = R(null), { optionProps: a, isSelected: o, isFocused: s, isDisabled: c } = S({ key: e.key }, t, n);
	return /* @__PURE__ */ i("li", {
		...a,
		ref: n,
		className: B("flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer", s && "bg-neutral-4 outline-solid outline-2 -outline-offset-2 outline-interactive-text", o ? "text-interactive-text font-semibold" : "text-main", c && "cursor-not-allowed opacity-50"),
		children: [/* @__PURE__ */ r("span", { children: e.rendered }), o ? /* @__PURE__ */ r("span", {
			"aria-hidden": "true",
			children: "✓"
		}) : null]
	});
}
//#endregion
//#region src/components/select/select.tsx
function Pt({ isLabelVisible: e = !1, placeholder: t, icon: n, error: a, description: o, className: c, ref: u, ...d }) {
	let f = oe(d), p = x(u), { labelProps: m, triggerProps: h, valueProps: g, menuProps: _, descriptionProps: v, errorMessageProps: y } = T({
		...d,
		description: o,
		errorMessage: a,
		isInvalid: !!a
	}, f, p), { buttonProps: b } = l(h, p);
	return /* @__PURE__ */ i("div", {
		className: B("inline-flex flex-col gap-1.5", c),
		children: [
			d.label ? /* @__PURE__ */ i("span", {
				...m,
				className: G(e),
				children: [d.label, d.isRequired ? /* @__PURE__ */ r(W, {}) : null]
			}) : null,
			/* @__PURE__ */ r(s, {
				state: f,
				triggerRef: p,
				label: d.label,
				name: d.name
			}),
			/* @__PURE__ */ i("button", {
				...b,
				ref: p,
				type: "button",
				className: B("inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none", f.selectedItem ? "text-main" : "text-muted-on-dark", a && "ring-1 ring-danger-text focus-visible:outline-danger-text"),
				children: [
					n,
					/* @__PURE__ */ r("span", {
						...g,
						className: "flex-1 text-left truncate",
						children: f.selectedItem ? f.selectedItem.rendered : t
					}),
					/* @__PURE__ */ r(U, { className: "w-3 h-3 shrink-0" })
				]
			}),
			/* @__PURE__ */ r(K, {
				description: o,
				error: a,
				descriptionProps: v,
				errorMessageProps: y
			}),
			f.isOpen ? /* @__PURE__ */ r(jt, {
				state: f,
				triggerRef: p,
				placement: "bottom start",
				children: /* @__PURE__ */ r(Mt, {
					..._,
					state: f
				})
			}) : null
		]
	});
}
//#endregion
//#region src/components/select/multi-select.tsx
function Ft({ label: e, placeholder: t, icon: n, isDisabled: a, error: o, description: s, className: c, ref: u, ...d }) {
	let f = ae({}), p = x(u), m = re({
		...d,
		selectionMode: "multiple",
		selectionBehavior: "toggle"
	}), { fieldProps: g, descriptionProps: _, errorMessageProps: v } = h({
		label: e,
		description: s,
		errorMessage: o,
		isInvalid: !!o
	}), { buttonProps: y } = l({
		onPress: () => f.toggle(),
		isDisabled: a,
		"aria-label": e
	}, p), b = [...m.collection].filter((e) => m.selectionManager.isSelected(e.key));
	return /* @__PURE__ */ i("div", {
		className: B("inline-flex flex-col gap-1.5", c),
		children: [
			/* @__PURE__ */ i("button", {
				...y,
				ref: p,
				type: "button",
				"aria-haspopup": "listbox",
				"aria-expanded": f.isOpen,
				"aria-describedby": g["aria-describedby"],
				className: B("inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none", b.length > 0 ? "text-main" : "text-muted-on-dark", o && "ring-1 ring-danger-text focus-visible:outline-danger-text"),
				children: [
					n,
					/* @__PURE__ */ r("span", {
						className: "flex-1 text-left truncate",
						children: b.length > 0 ? b.map((e, t) => /* @__PURE__ */ i(N, { children: [t > 0 ? ", " : null, e.rendered] }, e.key)) : t
					}),
					/* @__PURE__ */ r(U, { className: "w-3 h-3 shrink-0" })
				]
			}),
			/* @__PURE__ */ r(K, {
				description: s,
				error: o,
				descriptionProps: _,
				errorMessageProps: v
			}),
			f.isOpen ? /* @__PURE__ */ r(jt, {
				state: f,
				triggerRef: p,
				placement: "bottom start",
				children: /* @__PURE__ */ r(Mt, {
					"aria-label": e,
					state: m,
					autoFocus: !0
				})
			}) : null
		]
	});
}
//#endregion
//#region src/components/menu/menu.tsx
function It({ label: e, triggerContent: t, isDisabled: a, triggerClassName: o, ref: s, ...c }) {
	let u = ie({}), d = x(s), { menuTriggerProps: f, menuProps: p } = y({ isDisabled: a }, u, d), { buttonProps: m } = l({
		...f,
		isDisabled: a,
		"aria-label": e
	}, d);
	return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("button", {
		...m,
		ref: d,
		type: "button",
		className: B("cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none", o),
		children: t
	}), u.isOpen ? /* @__PURE__ */ r(jt, {
		state: u,
		triggerRef: d,
		placement: "bottom end",
		children: /* @__PURE__ */ r(Lt, {
			...p,
			...c,
			autoFocus: c.autoFocus ?? u.focusStrategy ?? !0,
			onClose: () => u.close()
		})
	}) : null] });
}
function Lt({ children: e, onAction: t, onClose: n, ...i }) {
	let a = ue({
		...i,
		children: e,
		selectionMode: "none"
	}), o = R(null), { menuProps: s } = _({
		...i,
		onAction: t,
		onClose: n
	}, a, o);
	return /* @__PURE__ */ r("ul", {
		...s,
		ref: o,
		className: "max-h-64 min-w-40 overflow-auto py-2 outline-none",
		children: [...a.collection].map((e) => /* @__PURE__ */ r(Rt, {
			item: e,
			state: a,
			onClose: n
		}, e.key))
	});
}
function Rt({ item: e, state: t, onClose: n }) {
	let i = R(null), { menuItemProps: a, isFocused: o, isDisabled: s } = v({
		key: e.key,
		onClose: n
	}, t, i);
	return /* @__PURE__ */ r("li", {
		...a,
		ref: i,
		className: B("text-body-m font-sans cursor-pointer px-4 py-1.5 text-main", o && "bg-neutral-4 outline-solid outline-2 -outline-offset-2 outline-interactive-text", s && "cursor-not-allowed opacity-50"),
		children: e.rendered
	});
}
//#endregion
//#region src/components/modal/modal.tsx
function zt({ title: e, isOpen: t, onClose: n, children: a, className: s, role: c = "dialog", isDismissable: l = !0, closeLabel: u = "Close modal", ref: d, ...f }) {
	let p = x(d), h = R(null), g = ae({
		isOpen: t,
		onOpenChange: (e) => {
			e || n();
		}
	}), { modalProps: _, underlayProps: v } = b({
		isDismissable: l,
		isKeyboardDismissDisabled: !l
	}, g, p), { dialogProps: y, titleProps: S, contentProps: C } = m({ role: c }, h);
	return t ? /* @__PURE__ */ r("div", {
		...v,
		className: "fixed inset-0 z-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
		children: /* @__PURE__ */ r(o, {
			contain: !0,
			restoreFocus: !0,
			autoFocus: !0,
			children: /* @__PURE__ */ r("div", {
				...f,
				..._,
				ref: p,
				className: B("w-full max-w-md", s),
				children: /* @__PURE__ */ i("div", {
					...y,
					ref: h,
					className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
					children: [/* @__PURE__ */ i("div", {
						className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4",
						children: [/* @__PURE__ */ r("h2", {
							...S,
							className: "font-sans font-bold text-base text-main",
							children: e
						}), /* @__PURE__ */ r("button", {
							type: "button",
							onClick: n,
							"aria-label": u,
							className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(He, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ r("div", {
						...C,
						className: "px-4 py-4",
						children: a
					})]
				})
			})
		})
	}) : null;
}
function Bt(e = !1) {
	let t = ae({ defaultOpen: e });
	return {
		isOpen: t.isOpen,
		open: t.open,
		close: t.close,
		toggle: t.toggle
	};
}
//#endregion
//#region src/components/datepicker/datepicker-menu.tsx
function Vt(e, t) {
	return he(fe(e, t));
}
function Ht(e, t) {
	return e.toDate(t);
}
function Ut({ value: e, defaultValue: t, onChange: n, onClose: a, triggerRef: o, dismissExemptRef: s, timeZone: c = pe(), label: d = "Date picker", previousYearLabel: f = "Previous year", previousMonthLabel: p = "Previous month", nextMonthLabel: m = "Next month", nextYearLabel: h = "Next year", todayLabel: g = "Today", className: _, ref: v }) {
	let y = e === void 0 ? { defaultValue: t ? Vt(t, c) : null } : { value: Vt(e, c) }, b = ne({
		...y,
		onChange: (e) => n?.(Ht(e, c)),
		createCalendar: de,
		locale: "en-US",
		firstDayOfWeek: "sun",
		weeksInMonth: 6
	}), { calendarProps: x, prevButtonProps: S, nextButtonProps: C } = u({ "aria-label": d }, b), w = R(null), T = R(null), { buttonProps: E } = l(S, w), { buttonProps: D } = l(C, T), O = () => {
		let e = ge(c);
		b.setFocusedDate(e), b.selectDate(e);
	};
	return /* @__PURE__ */ i($, {
		isOpen: !0,
		onClose: a,
		ref: v,
		triggerRef: o,
		dismissExemptRef: s,
		"aria-label": d,
		className: B("flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none", _),
		children: [
			/* @__PURE__ */ i("div", {
				...x,
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ i("div", {
						className: "flex items-center justify-between px-2 py-[9px] h-10",
						children: [
							/* @__PURE__ */ i("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ r("button", {
									type: "button",
									onClick: () => b.focusPreviousSection(!0),
									"aria-label": f,
									className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
									children: /* @__PURE__ */ r(Be, { className: "w-4 h-4" })
								}), /* @__PURE__ */ r("button", {
									...E,
									ref: w,
									"aria-label": p,
									className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
									children: /* @__PURE__ */ r(Re, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ r("span", {
								className: "font-sans font-semibold text-body-sm text-main",
								children: b.visibleRange.start.toDate(c).toLocaleDateString("en-US", {
									month: "long",
									year: "numeric",
									timeZone: c
								})
							}),
							/* @__PURE__ */ i("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ r("button", {
									...D,
									ref: T,
									"aria-label": m,
									className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
									children: /* @__PURE__ */ r(ze, { className: "w-4 h-4" })
								}), /* @__PURE__ */ r("button", {
									type: "button",
									onClick: () => b.focusNextSection(!0),
									"aria-label": h,
									className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
									children: /* @__PURE__ */ r(Ve, { className: "w-4 h-4" })
								})]
							})
						]
					}),
					/* @__PURE__ */ r("div", { className: "h-px w-full bg-neutral-2" }),
					/* @__PURE__ */ r(Wt, { state: b })
				]
			}),
			/* @__PURE__ */ r("div", { className: "h-px w-full bg-neutral-2" }),
			/* @__PURE__ */ r("div", {
				className: "flex items-center justify-center py-[9px] h-10",
				children: /* @__PURE__ */ r("button", {
					type: "button",
					onClick: O,
					className: "text-body-sm font-normal font-sans text-interactive-text hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
					children: g
				})
			})
		]
	});
}
function Wt({ state: e }) {
	let { gridProps: t, headerProps: n, weekDays: a, weeksInMonth: o } = f({ weekdayStyle: "short" }, e), s = e.visibleRange.start;
	return /* @__PURE__ */ i("div", {
		...t,
		className: "flex flex-col px-3 py-2",
		children: [/* @__PURE__ */ r("div", {
			...n,
			className: "grid grid-cols-7",
			children: a.map((e, t) => /* @__PURE__ */ r("span", {
				className: "text-center text-body-sm font-normal text-main font-sans",
				children: e
			}, t))
		}), Array.from({ length: o }, (t, n) => /* @__PURE__ */ r("div", {
			role: "row",
			className: "grid grid-cols-7",
			children: e.getDatesInWeek(n).map((t, n) => t ? /* @__PURE__ */ r(Gt, {
				state: e,
				date: t,
				currentMonth: s
			}, t.toString()) : /* @__PURE__ */ r("div", {
				role: "gridcell",
				"aria-hidden": "true"
			}, n))
		}, n))]
	});
}
function Gt({ state: e, date: t, currentMonth: n }) {
	let i = R(null), a = !me(t, n), { cellProps: o, buttonProps: s, isSelected: c, isDisabled: l, formattedDate: u } = d({
		date: t,
		isOutsideMonth: a
	}, e, i);
	return /* @__PURE__ */ r("div", {
		...o,
		className: "flex items-center justify-center my-[3px]",
		children: /* @__PURE__ */ r("div", {
			...s,
			ref: i,
			className: B("flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text", l ? "text-muted cursor-default" : c ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"),
			children: u
		})
	});
}
//#endregion
//#region src/components/modal/estimate-modal.tsx
var Kt = [
	1,
	2,
	3,
	5,
	8
];
function qt({ value: e, onAction: t, onClose: n, triggerRef: a, dismissExemptRef: o, formatPoints: s = ye, label: c = "Estimate", className: l, ref: u }) {
	return /* @__PURE__ */ i($, {
		isOpen: !0,
		onClose: n,
		ref: u,
		triggerRef: a,
		dismissExemptRef: o,
		"aria-label": c,
		className: B("flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm", l),
		children: [/* @__PURE__ */ r("div", {
			className: "flex items-center h-8 px-4",
			children: /* @__PURE__ */ r("span", {
				className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate",
				children: c
			})
		}), Kt.map((n) => /* @__PURE__ */ i("button", {
			type: "button",
			onClick: () => t(n),
			"aria-pressed": e === n,
			className: B("flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2", e === n ? "bg-neutral-2 text-neutral-5" : "hover:bg-neutral-2 hover:text-neutral-5"),
			children: [/* @__PURE__ */ r("span", {
				className: "w-6 h-6 shrink-0",
				children: /* @__PURE__ */ r(H, { className: "size-6" })
			}), /* @__PURE__ */ r("span", {
				className: "whitespace-nowrap",
				children: s(n)
			})]
		}, n))]
	});
}
//#endregion
//#region src/components/avatar/user-row.tsx
function Jt({ name: e, role: t, avatarSrc: n, size: a = "md", isOnline: o = !1, className: s, onPress: c, ref: l, ...u }) {
	let d = {
		sm: "text-[10px]",
		md: "text-xs",
		lg: "text-sm"
	};
	return /* @__PURE__ */ i(c ? "button" : "div", {
		...u,
		type: c ? "button" : void 0,
		onClick: c,
		ref: l,
		className: B("flex items-center gap-2 px-4 py-1 min-w-0", c && "cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-sm", s),
		children: [/* @__PURE__ */ i("div", {
			className: "relative shrink-0",
			children: [/* @__PURE__ */ r(q, {
				src: n,
				name: e,
				size: a
			}), o ? /* @__PURE__ */ r("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null]
		}), /* @__PURE__ */ i("div", {
			className: "flex flex-col min-w-0",
			children: [/* @__PURE__ */ r("span", {
				className: "font-sans font-normal text-body-m text-main truncate",
				children: e
			}), t ? /* @__PURE__ */ r("span", {
				className: B("font-sans text-muted-on-dark truncate leading-tight", d[a]),
				children: t
			}) : null]
		})]
	});
}
//#endregion
//#region src/components/modal/assignee-modal.tsx
function Yt({ assignees: e, onAction: t, onClose: n, triggerRef: a, dismissExemptRef: o, label: s = "Assignee", className: c, ref: l }) {
	return /* @__PURE__ */ i($, {
		isOpen: !0,
		onClose: n,
		triggerRef: a,
		dismissExemptRef: o,
		"aria-label": s,
		ref: l,
		className: B("flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm", c),
		children: [/* @__PURE__ */ r("div", {
			className: "flex items-center h-8 px-4",
			children: /* @__PURE__ */ r("span", {
				className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate",
				children: s
			})
		}), e.map((e) => /* @__PURE__ */ r("button", {
			type: "button",
			onClick: () => t(e),
			className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
			children: /* @__PURE__ */ r(Jt, {
				name: e.name,
				role: e.role,
				avatarSrc: e.avatarSrc,
				size: "sm"
			})
		}, e.id))]
	});
}
//#endregion
//#region src/components/modal/label-modal.tsx
function Xt({ labels: e, onAction: t, onClose: n, triggerRef: a, dismissExemptRef: o, label: s = "Label", className: c, ref: l }) {
	return /* @__PURE__ */ i($, {
		isOpen: !0,
		onClose: n,
		ref: l,
		triggerRef: a,
		dismissExemptRef: o,
		"aria-label": s,
		className: B("flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm", c),
		children: [/* @__PURE__ */ r("div", {
			className: "flex items-center h-8 px-4",
			children: /* @__PURE__ */ r("span", {
				className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate",
				children: s
			})
		}), e.map((e) => /* @__PURE__ */ r("button", {
			type: "button",
			onClick: () => t(e),
			className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
			children: /* @__PURE__ */ r(Y, {
				accent: e.accent ?? "neutral",
				children: e.text
			})
		}, e.id))]
	});
}
//#endregion
//#region src/components/modal/add-task-modal.tsx
var Zt = {
	title: "Task name",
	estimate: "Estimate",
	assignee: "Assignee",
	label: "Label",
	dueDate: "Due date",
	cancel: "Cancel",
	submit: "Create Task"
};
function Qt({ isOpen: e, onClose: t, assignees: n = [], labels: a = [], onSubmit: o, defaultTitle: s = "", defaultDueDate: c, defaultPoints: l, defaultAssignee: u, defaultLabel: d, copy: f, formatDueDate: p = (e) => e.toLocaleDateString("en-US"), className: m, ref: h, ...g }) {
	let _ = {
		...Zt,
		...f
	}, [v, y] = M.useState(s), [b, x] = M.useState(c), [S, C] = M.useState(l), [w, T] = M.useState(u), [E, D] = M.useState(d), [O, k] = M.useState(null), A = (e) => k((t) => t === e ? null : e), j = (e) => k((t) => t === e ? null : t), N = M.useRef(null), P = M.useRef(null), F = M.useRef(null), I = M.useRef(null), ee = M.useRef(null), L = () => {
		y(s), x(c), C(l), T(u), D(d), k(null);
	}, [R, z] = M.useState(e);
	if (e !== R && (z(e), e && L()), !e) return null;
	let te = (e) => {
		e.preventDefault(), v.trim() && (o?.({
			title: v.trim(),
			dueDate: b,
			points: S,
			assignee: w,
			label: E
		}), L(), t());
	}, ne = () => {
		L(), t();
	};
	return /* @__PURE__ */ i("form", {
		...g,
		onSubmit: te,
		ref: h,
		className: B("flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm", m),
		children: [
			/* @__PURE__ */ r("input", {
				autoFocus: !0,
				value: v,
				onChange: (e) => y(e.target.value),
				placeholder: _.title,
				"aria-label": _.title,
				className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted-on-dark font-sans rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
			}),
			/* @__PURE__ */ i("div", {
				ref: N,
				className: "flex flex-wrap items-center gap-4 w-full",
				children: [
					/* @__PURE__ */ i("div", {
						className: "relative",
						children: [S === void 0 ? /* @__PURE__ */ r("button", {
							ref: P,
							type: "button",
							onClick: () => A("estimate"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "estimate",
							className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(Y, {
								icon: /* @__PURE__ */ r(H, { className: "size-6" }),
								children: _.estimate
							})
						}) : /* @__PURE__ */ i("button", {
							ref: P,
							type: "button",
							onClick: () => A("estimate"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "estimate",
							className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: [
								/* @__PURE__ */ r("span", {
									className: "w-6 h-6 shrink-0",
									children: /* @__PURE__ */ r(H, { className: "size-6" })
								}),
								S,
								" Point",
								S === 1 ? "" : "s"
							]
						}), O === "estimate" ? /* @__PURE__ */ r(qt, {
							value: S,
							onAction: (e) => {
								C(e), k(null);
							},
							dismissExemptRef: N,
							onClose: () => j("estimate"),
							triggerRef: P,
							className: "absolute top-full left-0 mt-1 z-nested"
						}) : null]
					}),
					/* @__PURE__ */ i("div", {
						className: "relative",
						children: [w ? /* @__PURE__ */ i("button", {
							ref: F,
							type: "button",
							onClick: () => A("assignee"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "assignee",
							className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: [/* @__PURE__ */ r(q, {
								src: w.avatarSrc,
								name: w.name,
								size: "sm"
							}), w.name]
						}) : /* @__PURE__ */ r("button", {
							ref: F,
							type: "button",
							onClick: () => A("assignee"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "assignee",
							className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(Y, {
								icon: /* @__PURE__ */ r(Pe, { className: "size-6" }),
								children: _.assignee
							})
						}), O === "assignee" ? /* @__PURE__ */ r(Yt, {
							assignees: n,
							onAction: (e) => {
								T(e), k(null);
							},
							dismissExemptRef: N,
							onClose: () => j("assignee"),
							triggerRef: F,
							className: "absolute top-full left-0 mt-1 z-nested"
						}) : null]
					}),
					/* @__PURE__ */ i("div", {
						className: "relative",
						children: [E ? /* @__PURE__ */ r("button", {
							ref: I,
							type: "button",
							onClick: () => A("label"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "label",
							className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(Y, {
								accent: E.accent ?? "neutral",
								children: E.text
							})
						}) : /* @__PURE__ */ r("button", {
							ref: I,
							type: "button",
							onClick: () => A("label"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "label",
							className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(Y, {
								icon: /* @__PURE__ */ r(Fe, { className: "size-6" }),
								children: _.label
							})
						}), O === "label" ? /* @__PURE__ */ r(Xt, {
							labels: a,
							onAction: (e) => {
								D(e), k(null);
							},
							dismissExemptRef: N,
							onClose: () => j("label"),
							triggerRef: I,
							className: "absolute top-full left-0 mt-1 z-nested"
						}) : null]
					}),
					/* @__PURE__ */ i("div", {
						className: "relative",
						children: [/* @__PURE__ */ r("button", {
							ref: ee,
							type: "button",
							onClick: () => A("date"),
							"aria-haspopup": "dialog",
							"aria-expanded": O === "date",
							className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
							children: /* @__PURE__ */ r(Y, {
								icon: /* @__PURE__ */ r(Ie, { className: "size-6" }),
								children: b ? p(b) : _.dueDate
							})
						}), O === "date" ? /* @__PURE__ */ r(Ut, {
							value: b,
							onChange: (e) => {
								x(e), k(null);
							},
							dismissExemptRef: N,
							onClose: () => j("date"),
							triggerRef: ee,
							className: "absolute top-full left-0 mt-1 z-nested"
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ i("div", {
				className: "flex items-center gap-6",
				children: [/* @__PURE__ */ r(We, {
					variant: "secondary",
					onPress: ne,
					children: _.cancel
				}), /* @__PURE__ */ r(We, {
					variant: "primary",
					type: "submit",
					isDisabled: !v.trim(),
					children: _.submit
				})]
			})
		]
	});
}
//#endregion
//#region src/components/badge/badge.tsx
function $t({ tone: e = "neutral", children: t, className: n, ref: i, ...a }) {
	let o = {
		neutral: "bg-surface-neutral text-neutral-4 border-subtle",
		success: "bg-success-1 text-neutral-4 border-success-2",
		warning: "bg-warning-1 text-warning-6 border-warning-2",
		danger: "bg-danger-1 text-danger-6 border-danger-2"
	};
	return /* @__PURE__ */ r("span", {
		...a,
		ref: i,
		className: B("inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans", o[e], n),
		children: t
	});
}
//#endregion
//#region src/components/toast/toast.tsx
var en = P(null);
function tn() {
	let e = F(en);
	if (!e) throw Error("useToast must be used within a ToastProvider");
	return e;
}
var nn = 5e3, rn = {
	neutral: "bg-surface-overlay text-main border border-subtle/10",
	success: "bg-success-4 text-neutral-5",
	warning: "bg-warning-5 text-neutral-5",
	danger: "bg-danger-4 text-neutral-5"
};
function an({ toast: e, state: t, closeLabel: n }) {
	let a = R(null), o = R(null), { toastProps: s, contentProps: c, titleProps: u, closeButtonProps: d } = A({ toast: e }, t, a), { buttonProps: f } = l(d, o);
	return /* @__PURE__ */ i("div", {
		...s,
		ref: a,
		className: B("pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-sm shadow-elevation", "text-body-m font-semibold font-sans", rn[e.content.tone]),
		children: [/* @__PURE__ */ r("div", {
			...c,
			children: /* @__PURE__ */ r("span", {
				...u,
				children: e.content.message
			})
		}), /* @__PURE__ */ r("button", {
			...f,
			ref: o,
			"aria-label": n,
			className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2",
			children: /* @__PURE__ */ r(He, { className: "size-4" })
		})]
	});
}
function on({ state: e, label: t, closeLabel: n }) {
	let i = R(null), { regionProps: a } = j({ "aria-label": t }, e, i);
	return _e(/* @__PURE__ */ r("div", {
		...a,
		ref: i,
		className: "pointer-events-none fixed right-4 bottom-4 z-toast flex flex-col gap-2",
		children: e.visibleToasts.map((t) => /* @__PURE__ */ r(an, {
			toast: t,
			state: e,
			closeLabel: n
		}, t.key))
	}), document.body);
}
function sn({ children: e, duration: t = nn, maxVisibleToasts: n = 4, label: a = "Notifications", closeLabel: o = "Dismiss" }) {
	let s = ce({ maxVisibleToasts: n }), c = R(s);
	I(() => {
		c.current = s;
	}, [s]);
	let l = R(t);
	I(() => {
		l.current = t;
	}, [t]);
	let u = L(() => ({ show: (e, t, n) => c.current.add({
		tone: e,
		message: t
	}, { timeout: n?.timeout === null ? 0 : n?.timeout ?? l.current }) }), []);
	return /* @__PURE__ */ i(en.Provider, {
		value: u,
		children: [e, s.visibleToasts.length > 0 ? /* @__PURE__ */ r(on, {
			state: s,
			label: a,
			closeLabel: o
		}) : null]
	});
}
//#endregion
//#region src/components/tag/label-checkbox.tsx
function cn({ children: e, isSelected: t, defaultSelected: n = !1, onChange: a, isDisabled: o = !1, isIndeterminate: s = !1, error: c, description: l, isRequired: u = !1, label: d, className: f, ref: m }) {
	let g = le({
		isSelected: t,
		defaultSelected: n,
		onChange: a
	}), _ = x(m), { fieldProps: v, descriptionProps: y, errorMessageProps: b } = h({
		description: l,
		errorMessage: c,
		isInvalid: !!c
	}), { inputProps: S, labelProps: C } = p({
		isSelected: g.isSelected,
		isIndeterminate: s,
		isDisabled: o,
		isRequired: u,
		isInvalid: !!c,
		"aria-label": d ?? (typeof e == "string" ? e : "Checkbox")
	}, g, _), w = /* @__PURE__ */ i("label", {
		...C,
		className: B("inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-2", o && "opacity-50 cursor-not-allowed", f),
		children: [
			/* @__PURE__ */ r("input", {
				...S,
				ref: _,
				"aria-describedby": v["aria-describedby"],
				className: "sr-only"
			}),
			/* @__PURE__ */ i("svg", {
				className: B("w-6 h-6 shrink-0", c ? "text-danger-text" : "text-main"),
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.5,
				"aria-hidden": !0,
				children: [/* @__PURE__ */ r("rect", {
					x: "4",
					y: "4",
					width: "16",
					height: "16",
					rx: "3"
				}), g.isSelected && !s ? /* @__PURE__ */ r("path", {
					d: "M8 12.5 11 15.5 16 9.5",
					strokeWidth: 2,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}) : s ? /* @__PURE__ */ r("path", {
					d: "M8 12h8",
					strokeWidth: 2,
					strokeLinecap: "round"
				}) : null]
			}),
			/* @__PURE__ */ i("span", {
				className: "text-body-m font-normal font-sans text-main",
				children: [e, u ? /* @__PURE__ */ r(W, {}) : null]
			})
		]
	});
	return !c && !l ? w : /* @__PURE__ */ i("div", {
		className: "inline-flex flex-col gap-1",
		children: [w, /* @__PURE__ */ r("span", {
			className: "px-4",
			children: /* @__PURE__ */ r(K, {
				description: l,
				error: c,
				descriptionProps: y,
				errorMessageProps: b
			})
		})]
	});
}
//#endregion
//#region src/components/datepicker/datepicker.tsx
function ln({ label: e, isLabelVisible: t = !1, error: n, description: a, className: o, ref: s, ...c }) {
	let l = x(s), { labelProps: u, inputProps: d, descriptionProps: f, errorMessageProps: p } = k({
		...c,
		label: e,
		description: a,
		type: "date",
		isInvalid: !!n,
		errorMessage: n
	}, l);
	return /* @__PURE__ */ i("div", {
		className: "flex flex-col gap-1.5 w-full",
		children: [
			e ? /* @__PURE__ */ i("label", {
				...u,
				className: G(t),
				children: [e, c.isRequired ? /* @__PURE__ */ r(W, {}) : null]
			}) : null,
			/* @__PURE__ */ r("input", {
				...d,
				ref: l,
				type: "date",
				className: B("self-start inline-flex items-center h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold text-main [color-scheme:dark] font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none", n && "ring-1 ring-danger-text focus-visible:outline-danger-text", o)
			}),
			/* @__PURE__ */ r(K, {
				description: a,
				error: n,
				descriptionProps: f,
				errorMessageProps: p
			})
		]
	});
}
//#endregion
//#region src/components/sidebar/sidebar-item.tsx
function un({ icon: e, label: t, isActive: n = !1, badgeCount: a, onPress: o, className: s, ref: c, ...l }) {
	return /* @__PURE__ */ i("button", {
		...l,
		type: "button",
		onClick: o,
		ref: c,
		"aria-current": n ? "page" : void 0,
		className: B("relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2", n ? "text-interactive-text bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive-text", s),
		children: [
			e ? /* @__PURE__ */ r("span", {
				className: "flex items-center justify-center w-6 h-6 shrink-0",
				children: e
			}) : null,
			/* @__PURE__ */ r("span", {
				className: "flex-1 truncate",
				children: t
			}),
			a === void 0 ? null : /* @__PURE__ */ r("span", {
				className: B("px-2 py-0.5 text-xs font-bold rounded-full shrink-0", n ? "bg-interactive-text text-neutral-5" : "bg-neutral-3 text-main"),
				children: a
			}),
			/* @__PURE__ */ r("span", { className: B("w-1 h-full shrink-0 bg-primary-4 transition-opacity", n ? "opacity-100" : "opacity-0") })
		]
	});
}
//#endregion
//#region src/components/sidebar/application-sidebar.tsx
function dn({ logo: e, items: t, label: n = "Main navigation", className: a, ref: o, ...s }) {
	return /* @__PURE__ */ i("nav", {
		...s,
		ref: o,
		"aria-label": n,
		className: B("flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0", a),
		children: [e ? /* @__PURE__ */ r("div", {
			className: "flex justify-center pt-3 h-24 shrink-0",
			children: e
		}) : null, /* @__PURE__ */ r("div", {
			className: "flex flex-col gap-2 flex-1 overflow-y-auto",
			children: t.map((e, t) => /* @__PURE__ */ r(un, { ...e }, t))
		})]
	});
}
//#endregion
//#region src/components/layout/view-switcher.tsx
function fn({ value: e, onChange: t, leftIcon: n, rightIcon: a, leftLabel: o, rightLabel: s, label: c = "View", className: l, ref: u, ...d }) {
	let f = R(null), p = R(null), m = (e) => {
		t?.(e), (e === "left" ? f : p).current?.focus();
	}, h = (t) => {
		let n;
		switch (t.key) {
			case "ArrowRight":
			case "ArrowDown":
			case "ArrowLeft":
			case "ArrowUp":
				n = e === "left" ? "right" : "left";
				break;
			case "Home":
				n = "left";
				break;
			case "End":
				n = "right";
				break;
			default: return;
		}
		t.preventDefault(), m(n);
	};
	return /* @__PURE__ */ i("div", {
		...d,
		ref: u,
		role: "radiogroup",
		"aria-label": c,
		className: B("flex items-center w-20 h-10 bg-surface-shell rounded-sm", l),
		children: [/* @__PURE__ */ r(Ue, {
			ref: f,
			variant: "secondary",
			role: "radio",
			"aria-checked": e === "left",
			excludeFromTabOrder: e !== "left",
			isSelected: e === "left",
			"aria-label": o,
			onKeyDown: h,
			onPress: () => m("left"),
			children: n
		}), /* @__PURE__ */ r(Ue, {
			ref: p,
			variant: "secondary",
			role: "radio",
			"aria-checked": e === "right",
			excludeFromTabOrder: e !== "right",
			isSelected: e === "right",
			"aria-label": s,
			onKeyDown: h,
			onPress: () => m("right"),
			children: a
		})]
	});
}
//#endregion
//#region src/components/layout/app-shell.tsx
function pn({ logo: e, sidebarItems: t, sidebar: n, topNavProps: a, topNav: o, topBar: s, children: c, className: l, ref: u, ...d }) {
	let f = n === void 0 ? t ? /* @__PURE__ */ r(dn, {
		logo: e,
		items: t,
		className: "self-stretch"
	}) : null : n, p = o === void 0 ? /* @__PURE__ */ r(Qe, { ...a }) : o;
	return /* @__PURE__ */ i("div", {
		...d,
		ref: u,
		className: B("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l),
		children: [f, /* @__PURE__ */ i("div", {
			className: "flex flex-col gap-8 flex-1 min-w-0",
			children: [p, /* @__PURE__ */ i("div", {
				className: "flex flex-col gap-4",
				children: [s ? /* @__PURE__ */ r("div", {
					className: "flex items-start justify-between gap-6",
					children: s
				}) : null, c]
			})]
		})]
	});
}
//#endregion
export { Qt as AddTaskModal, Te as AlarmIcon, pn as AppShell, dn as ApplicationSidebar, Pe as AssigneeIcon, Yt as AssigneeModal, _t as AssigneeNameCell, Ee as AttachmentIcon, q as Avatar, $t as Badge, Ne as BellIcon, Ue as Button, Ie as CalendarIcon, J as Card, at as CardBody, ot as CardFooter, it as CardHeader, Be as ChevronDoubleLeftIcon, Ve as ChevronDoubleRightIcon, U as ChevronDownIcon, Re as ChevronLeftIcon, ze as ChevronRightIcon, He as CloseIcon, Oe as CommentIcon, Ot as DEFAULT_COLUMNS, be as DUE_DATE_URGENCY_COLOR, xe as DUE_DATE_URGENCY_LABEL, Ut as DatePickerMenu, ln as Datepicker, gt as DueDateCell, ut as EmptyState, qt as EstimateModal, vt as EstimationCell, qe as FIELD_DESCRIPTION_CLASS, Je as FIELD_ERROR_CLASS, Ge as FIELD_LABEL_CLASS, Ke as FIELD_LABEL_HIDDEN_CLASS, K as FieldMessages, jt as FloatingPopover, Ye as FormField, ke as GridViewIcon, Xe as Input, cn as LabelCheckbox, Fe as LabelIcon, Xt as LabelModal, Mt as ListBox, Ae as ListViewIcon, Le as LogoMark, It as Menu, we as MenuDotsIcon, zt as Modal, Ft as MultiSelect, je as PlusIcon, H as PointsIcon, $ as Popover, X as ProjectInfo, W as RequiredIndicator, Ze as SearchBar, Me as SearchIcon, nt as SegmentedControl, Pt as Select, un as SidebarItem, Z as Skeleton, De as SubtaskIcon, Se as TASK_STATUS_INDICATOR_COLOR, $e as Tabs, Y as Tag, yt as TagCell, lt as TaskCard, ft as TaskListView, st as TaskMetaBadges, At as TaskTable, xt as TaskTableRow, We as TextButton, sn as ToastProvider, Qe as TopNav, Jt as UserRow, fn as ViewSwitcher, B as cn, G as fieldLabelClass, ye as formatPointsLong, ve as formatPointsShort, kt as resolveColumns, Ce as statusToIndicatorColor, Bt as useModalState, tn as useToast };
