import { clsx as De } from "clsx";
import { twMerge as Ie } from "tailwind-merge";
import { jsx as e, jsxs as u, Fragment as re } from "react/jsx-runtime";
import { useObjectRef as D, useButton as z, useField as ie, useTextField as oe, useTabList as Re, useTab as Be, useTabPanel as Oe, useOverlay as Ee, FocusScope as ae, DismissButton as J, usePopover as Ae, Overlay as Ze, useListBox as je, useOption as Fe, useSelect as _e, HiddenSelect as ze, useMenuTrigger as Ue, useMenu as We, useMenuItem as $e, useModalOverlay as Ke, useDialog as Ge, useCalendar as Ye, useCalendarGrid as qe, useCalendarCell as Xe, useToastRegion as Je, useToast as Qe, useCheckbox as et } from "react-aria";
import T, { useState as ce, useMemo as ye, useRef as M, useId as tt, Fragment as nt, useEffect as be, useContext as st, createContext as lt } from "react";
import { useTabListState as rt, Item as it, useSelectState as ot, useOverlayTriggerState as ue, useListState as at, useMenuTriggerState as ct, useTreeState as ut, useCalendarState as dt, useToastState as ft, useToggleState as mt } from "react-stately";
import { createCalendar as pt, getLocalTimeZone as bt, toCalendarDate as ht, fromDate as xt, today as vt, isSameMonth as gt } from "@internationalized/date";
import { createPortal as yt } from "react-dom";
function f(...t) {
  return Ie(De(t));
}
const Ct = (t) => `${t} ${t === 1 ? "Pt" : "Pts"}`, Ce = (t) => `${t} ${t === 1 ? "Point" : "Points"}`, Nt = {
  normal: "neutral",
  soon: "yellow",
  overdue: "red"
}, wt = {
  normal: "",
  soon: "due soon",
  overdue: "overdue"
}, kt = {
  BACKLOG: "neutral",
  TODO: "neutral",
  IN_PROGRESS: "yellow",
  DONE: "green",
  CANCELLED: "red"
};
function On(t) {
  return kt[t];
}
function L({ children: t, ...s }) {
  const n = s["aria-label"] != null || s["aria-labelledby"] != null;
  return /* @__PURE__ */ e(
    "svg",
    {
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...n ? { role: "img" } : { "aria-hidden": !0 },
      ...s,
      children: t
    }
  );
}
function En(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 18 4", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z",
      fill: "currentColor"
    }
  ) });
}
function Lt(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20.506 19.253", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z",
      fill: "currentColor"
    }
  ) });
}
function An(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 11.7382 12.6733", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z",
      fill: "currentColor"
    }
  ) });
}
function Zn(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 12 13.3333", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z",
      fill: "currentColor"
    }
  ) });
}
function jn(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 13.3333 13.3333", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z",
      fill: "currentColor"
    }
  ) });
}
function Fn(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 18 18", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z",
      fill: "currentColor"
    }
  ) });
}
function _n(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 18 16", ...t, children: /* @__PURE__ */ e("path", { d: "M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z", fill: "currentColor" }) });
}
function zn(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 14 14", ...t, children: /* @__PURE__ */ e("path", { d: "M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z", fill: "currentColor" }) });
}
function Mt(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20.314 20.314", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z",
      fill: "currentColor"
    }
  ) });
}
function he(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20 21", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z",
      fill: "currentColor"
    }
  ) });
}
function se(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20 18", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0V0ZM7 8V6H5V8H3V10H5V12H7V10H9V8H7ZM11 8V10H17V8H11Z",
      fill: "currentColor"
    }
  ) });
}
function Vt(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 16 21", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z",
      fill: "currentColor"
    }
  ) });
}
function Ht(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20.7988 20.7998", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z",
      fill: "currentColor"
    }
  ) });
}
function Pt(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 20 20", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z",
      fill: "currentColor"
    }
  ) });
}
function Un(t) {
  return /* @__PURE__ */ u(L, { viewBox: "0 0 40 40", ...t, children: [
    /* @__PURE__ */ e("g", { transform: "translate(0 2)", children: /* @__PURE__ */ e(
      "path",
      {
        d: "M30.4218 24.5565C35.7216 23.1082 39.6183 18.2592 39.6183 12.5C39.6183 5.71624 34.214 0.194797 27.477 0.00660328V0H8.06627H0L6.69512 8.33114H8.06627V8.33334H27.181C29.4535 8.36636 31.2857 10.2186 31.2857 12.4989C31.2857 14.8002 29.4204 16.6656 27.1194 16.6656H24.0811H13.3913L28.9285 36H39.6172L30.4218 24.5565Z",
        fill: "currentColor"
      }
    ) }),
    /* @__PURE__ */ e("g", { transform: "translate(3.5 27)", children: /* @__PURE__ */ e(
      "path",
      {
        d: "M5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11Z",
        fill: "currentColor"
      }
    ) })
  ] });
}
function St(t) {
  return /* @__PURE__ */ e(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...t,
      children: /* @__PURE__ */ e("path", { d: "m15.5 5-7 7 7 7" })
    }
  );
}
function Ne(t) {
  return /* @__PURE__ */ e(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...t,
      children: /* @__PURE__ */ e("path", { d: "m8.5 5 7 7-7 7" })
    }
  );
}
function de(t) {
  return /* @__PURE__ */ e(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...t,
      children: /* @__PURE__ */ e("path", { d: "m5 8.5 7 7 7-7" })
    }
  );
}
function Tt(t) {
  return /* @__PURE__ */ e(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...t,
      children: /* @__PURE__ */ e("path", { d: "m18 5-7 7 7 7M12 5l-7 7 7 7" })
    }
  );
}
function Dt(t) {
  return /* @__PURE__ */ e(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...t,
      children: /* @__PURE__ */ e("path", { d: "m6 5 7 7-7 7M12 5l7 7-7 7" })
    }
  );
}
function fe(t) {
  return /* @__PURE__ */ e(L, { viewBox: "0 0 14 14", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z",
      fill: "currentColor"
    }
  ) });
}
function xe({
  variant: t = "secondary",
  isSelected: s = !1,
  children: n,
  className: l,
  isDisabled: r,
  role: i,
  "aria-checked": o,
  ref: a,
  ...c
}) {
  const d = D(a), { buttonProps: p } = z({ ...c, isDisabled: r }, d);
  return /* @__PURE__ */ e(
    "button",
    {
      ...p,
      role: i,
      "aria-checked": o,
      ref: d,
      className: f(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: s ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[t],
        l
      ),
      children: /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0 flex items-center justify-center", children: n })
    }
  );
}
function ve({
  variant: t = "primary",
  isSelected: s = !1,
  className: n,
  isDisabled: l,
  ref: r,
  ...i
}) {
  const o = D(r), { buttonProps: a } = z({ ...i, isDisabled: l }, o), c = {
    primary: f(
      "text-main",
      l ? "bg-primary-2" : s ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: l ? "bg-transparent text-muted" : s ? "bg-neutral-3 text-main" : (
      // `hover:text-neutral-5` alongside the hover fill: white on a solid `neutral-2`
      // is 2.94:1, so the label has to move with the background. Invisible to a
      // static-story axe pass, which is why it went unrecorded.
      "bg-transparent text-main hover:bg-neutral-2 hover:text-neutral-5"
    )
  };
  return /* @__PURE__ */ e(
    "button",
    {
      ...a,
      ref: o,
      className: f(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:pointer-events-none",
        c[t],
        n
      ),
      children: i.children
    }
  );
}
function Y() {
  return /* @__PURE__ */ e("span", { "aria-hidden": "true", className: "text-danger-text ml-0.5", children: "*" });
}
const It = "text-body-m font-semibold text-main font-sans", Rt = "sr-only";
function Q(t) {
  return t ? It : Rt;
}
const Bt = "text-xs text-muted-on-dark font-sans", Ot = "text-xs text-danger-text font-sans";
function K({
  description: t,
  error: s,
  descriptionProps: n,
  errorMessageProps: l,
  className: r,
  ref: i,
  ...o
}) {
  return s ? /* @__PURE__ */ e("span", { ...o, ...l, ref: i, className: f(Ot, r), children: s }) : t ? /* @__PURE__ */ e(
    "span",
    {
      ...o,
      ...n,
      ref: i,
      className: f(Bt, r),
      children: t
    }
  ) : null;
}
function Wn({
  label: t,
  isLabelVisible: s = !1,
  description: n,
  error: l,
  isRequired: r = !1,
  children: i,
  className: o,
  ref: a,
  ...c
}) {
  const { labelProps: d, fieldProps: p, descriptionProps: m, errorMessageProps: v } = ie({
    ...c,
    label: t,
    description: n,
    errorMessage: l,
    isInvalid: !!l
  });
  return /* @__PURE__ */ u("div", { ref: a, className: f("flex flex-col gap-1.5", o), children: [
    t ? /* @__PURE__ */ u("label", { ...d, className: Q(s), children: [
      t,
      r ? /* @__PURE__ */ e(Y, {}) : null
    ] }) : null,
    i({
      ...p,
      ...r ? { "aria-required": !0 } : {},
      ...l ? { "aria-invalid": !0 } : {}
    }),
    /* @__PURE__ */ e(
      K,
      {
        description: n,
        error: l,
        descriptionProps: m,
        errorMessageProps: v
      }
    )
  ] });
}
function $n({
  label: t,
  isLabelVisible: s = !1,
  error: n,
  description: l,
  className: r,
  ref: i,
  ...o
}) {
  const a = D(i), { labelProps: c, inputProps: d, descriptionProps: p, errorMessageProps: m } = oe(
    { ...o, label: t, description: l, isInvalid: !!n, errorMessage: n },
    a
  );
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-1.5 w-full", children: [
    t ? /* @__PURE__ */ u("label", { ...c, className: Q(s), children: [
      t,
      o.isRequired ? /* @__PURE__ */ e(Y, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(
      "input",
      {
        ...d,
        ref: a,
        className: f(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted-on-light transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          n && "border-danger-5 focus-visible:outline-danger-text",
          r
        )
      }
    ),
    /* @__PURE__ */ e(
      K,
      {
        description: l,
        error: n,
        descriptionProps: p,
        errorMessageProps: m
      }
    )
  ] });
}
function Et({
  placeholder: t = "Search...",
  value: s,
  onChange: n,
  onSubmit: l,
  label: r = "Search",
  id: i,
  className: o,
  ref: a
}) {
  const [c, d] = ce(""), p = s !== void 0, m = p ? s : c, v = D(a), { inputProps: C } = oe(
    {
      value: m,
      onChange: (h) => {
        p || d(h), n == null || n(h);
      },
      onKeyDown: (h) => {
        h.key === "Enter" && (l == null || l(m));
      },
      "aria-label": r,
      id: i,
      // Makes the element a `searchbox` rather than a `textbox`, which is what a screen
      // reader announces and what a consumer's `getByRole('searchbox')` finds. It also
      // opts the field into the platform's search affordances — including WebKit's native
      // clear button, suppressed below because `TopNav` renders its own.
      type: "search",
      placeholder: t
    },
    v
  );
  return /* @__PURE__ */ u("div", { className: f("inline-flex items-center gap-6 min-w-0", o), children: [
    /* @__PURE__ */ e(Mt, { className: "w-6 h-6 text-muted shrink-0" }),
    /* @__PURE__ */ e(
      "input",
      {
        ...C,
        ref: v,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted-on-dark font-sans min-w-0 rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
      }
    )
  ] });
}
function q({
  src: t,
  name: s,
  fallbackLabel: n = "Unassigned",
  size: l = "md",
  className: r,
  ref: i,
  ...o
}) {
  const a = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold"
  }, c = (p) => {
    if (!p) return "?";
    const m = p.trim().split(" ");
    return m.length >= 2 ? `${m[0][0]}${m[1][0]}`.toUpperCase() : m[0].substring(0, 2).toUpperCase();
  }, d = s || n;
  return /* @__PURE__ */ e(
    "div",
    {
      ...o,
      ref: i,
      role: "img",
      "aria-label": d,
      title: d,
      className: f(
        // The initials are `neutral-5` on the `primary-1` tint, **not** the `primary-4`
        // they used to be. That pairing measured 2.61:1 and was the single largest
        // accessibility defect in the kit: 46 of the 131 colour-contrast violations an
        // axe pass over the built Storybook reported came from this one class, because
        // an avatar renders in almost every composed story.
        //
        // Unlike the kit's other AA deviations there is nothing to trade away here. The
        // design has **no** initials treatment at all — every exported Avatar frame is
        // image-filled (see the size note below), so `bg-primary-1 text-primary-4` was an
        // engineering invention rather than something Figma draws. `neutral-5` is the
        // colour this kit already uses for text on a light surface (`Input`'s value,
        // `--color-surface-neutral` at 15.40:1), and it clears **10.50:1** on the tint.
        //
        // The tint itself is unchanged, so an avatar still reads as the same pink circle.
        // `text-neutral-5` stays a raw ramp class rather than `text-surface-shell`: that
        // alias names a *background* role, and this is a foreground.
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-neutral-5 select-none shrink-0",
        a[l],
        r
      ),
      children: t ? (
        // `alt=""`, deliberately. The wrapper above already carries the name; an `alt` here
        // would have the avatar announced twice, and as "image, Alice" rather than "Alice".
        /* @__PURE__ */ e("img", { src: t, alt: "", className: "w-full h-full object-cover" })
      ) : /* @__PURE__ */ e("span", { children: c(s) })
    }
  );
}
function At({
  searchValue: t,
  searchPlaceholder: s,
  onSearchChange: n,
  onSearchSubmit: l,
  searchLabel: r,
  clearSearchLabel: i = "Clear search",
  icon: o,
  onNotificationsClick: a,
  notificationsLabel: c = "Notifications",
  userName: d,
  userAvatar: p,
  userSlot: m,
  actions: v,
  className: C,
  ref: h,
  ...x
}) {
  const [b, y] = ce(""), g = t !== void 0, N = g ? t : b, k = (V) => {
    g || y(V), n == null || n(V);
  }, P = () => {
    g || y(""), n == null || n("");
  };
  return /* @__PURE__ */ u(
    "header",
    {
      ...x,
      ref: h,
      className: f(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        C
      ),
      children: [
        /* @__PURE__ */ e(
          Et,
          {
            placeholder: s,
            value: N,
            onChange: k,
            onSubmit: l,
            label: r,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ u("div", { className: "flex items-center gap-6 shrink-0", children: [
          N ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: P,
              "aria-label": i,
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
              children: /* @__PURE__ */ e(fe, { className: "w-full h-full" })
            }
          ) : null,
          a ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: a,
              "aria-label": c,
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
              children: o ?? /* @__PURE__ */ e(he, { className: "w-full h-full" })
            }
          ) : /* @__PURE__ */ e("span", { className: "w-6 h-6 text-muted shrink-0", children: o ?? /* @__PURE__ */ e(he, { className: "w-full h-full" }) }),
          v,
          m ?? (d || p ? /* @__PURE__ */ e(q, { src: p, name: d, size: "md" }) : null)
        ] })
      ]
    }
  );
}
function Kn({
  items: t,
  panels: s,
  defaultSelectedKey: n,
  selectedKey: l,
  onSelectionChange: r,
  label: i = "Tab navigation",
  className: o,
  ref: a,
  ...c
}) {
  var C;
  const d = ye(() => new Map(t.map((h) => [h.id, h])), [t]), p = rt({
    items: t,
    selectedKey: l,
    defaultSelectedKey: n ?? ((C = t[0]) == null ? void 0 : C.id),
    onSelectionChange: (h) => r == null ? void 0 : r(String(h)),
    children: (h) => /* @__PURE__ */ e(it, { textValue: h.label, children: h.label }, h.id)
  }), m = M(null), { tabListProps: v } = Re({ "aria-label": i }, p, m);
  return /* @__PURE__ */ u("div", { ...c, ref: a, className: f("flex flex-col", o), children: [
    /* @__PURE__ */ e("div", { ...v, ref: m, className: "flex items-end", children: [...p.collection].map((h) => {
      var x;
      return /* @__PURE__ */ e(
        Zt,
        {
          item: h,
          state: p,
          icon: (x = d.get(String(h.key))) == null ? void 0 : x.icon
        },
        h.key
      );
    }) }),
    s ? /* @__PURE__ */ e(jt, { state: p, panels: s }) : null
  ] });
}
function Zt({ item: t, state: s, icon: n }) {
  const l = M(null), { tabProps: r, isSelected: i } = Be({ key: t.key }, s, l);
  return /* @__PURE__ */ u(
    "button",
    {
      ...r,
      ref: l,
      type: "button",
      className: f(
        // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
        // vertical padding around the label) -- was symmetric py-3.5.
        // Horizontal padding (px-5) is kept: Figma's own value there
        // is 0px, but that's an artifact of a fixed-width (120px)
        // demo box, not a real horizontal-padding spec for
        // arbitrary-length labels.
        "relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
        // `-text`, not the bare `text-interactive`: a tab label is text, and primary-4 as
        // text clears 4.5:1 on no surface in this palette (2.86 / 3.51 / 4.02 over
        // overlay / panel / shell). `primary-2` clears all three at 5.43 / 6.67 / 7.63.
        // The 2px indicator below stays primary-4 — that is a non-text boundary at 3:1,
        // and it is no longer the only selection signal anyway.
        // The unselected label is `muted-on-dark`, not `muted`. `Tabs` paints no
        // background of its own, so it has no way to know what it sits on — and
        // `neutral-2` clears AA on a panel (4.58:1) and the shell (5.25:1) but manages
        // only 3.73:1 on `surface-overlay`. A tab strip inside a modal is an ordinary
        // thing for a consumer to build. Same rule as FIELD_DESCRIPTION_CLASS and
        // `UserRow`: `--color-muted` only where the surface is known.
        i ? "text-interactive-text" : "text-muted-on-dark hover:text-main"
      ),
      children: [
        n ? /* @__PURE__ */ e("span", { className: "text-base leading-none", children: n }) : null,
        t.rendered ?? t.textValue,
        i ? /* @__PURE__ */ e("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
      ]
    }
  );
}
function jt({ state: t, panels: s }) {
  const n = M(null), { tabPanelProps: l } = Oe({}, t, n), r = t.selectedKey != null ? String(t.selectedKey) : "";
  return /* @__PURE__ */ e("div", { ...l, ref: n, className: "flex-1", children: s[r] ?? null });
}
function Gn({
  options: t,
  value: s,
  defaultValue: n,
  onChange: l,
  label: r = "View",
  className: i,
  ref: o,
  ...a
}) {
  var x;
  const [c, d] = T.useState(n ?? ((x = t[0]) == null ? void 0 : x.id) ?? ""), p = s !== void 0, m = p ? s : c, v = M([]), C = (b) => {
    p || d(b), l == null || l(b);
  }, h = (b) => {
    var k;
    const y = t.findIndex((P) => P.id === m);
    if (y === -1) return;
    let g = null;
    switch (b.key) {
      case "ArrowRight":
      case "ArrowDown":
        g = (y + 1) % t.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        g = (y - 1 + t.length) % t.length;
        break;
      case "Home":
        g = 0;
        break;
      case "End":
        g = t.length - 1;
        break;
      default:
        return;
    }
    b.preventDefault();
    const N = t[g];
    C(N.id), (k = v.current[g]) == null || k.focus();
  };
  return /* @__PURE__ */ e(
    "div",
    {
      ...a,
      ref: o,
      role: "radiogroup",
      "aria-label": r,
      className: f("inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10", i),
      children: t.map((b, y) => {
        const g = m === b.id;
        return /* @__PURE__ */ u(
          "button",
          {
            ref: (N) => {
              v.current[y] = N;
            },
            type: "button",
            role: "radio",
            "aria-checked": g,
            tabIndex: g ? 0 : -1,
            onClick: () => C(b.id),
            onKeyDown: h,
            className: f(
              "inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
              // The active label is `neutral-5`, not the white Figma draws. That is the
              // one deviation in this component and the ratio is why: white on the
              // `neutral-2` pill measures 2.94:1. The pill's fill is untouched — this is
              // the same trade `Tag` and `Badge` take, keeping the design's fill and
              // moving the label, and `neutral-5` on `neutral-2` clears 5.25:1.
              //
              // It does cost the spec's "identical label colour in both states,
              // selection carried by the fill alone" (see the doc comment above). The
              // fill still carries it; the label now agrees with it rather than being
              // the only thing at 2.94:1.
              g ? "bg-neutral-2 text-neutral-5 shadow-small" : ""
            ),
            children: [
              b.icon ? /* @__PURE__ */ e("span", { className: "text-base leading-none", children: b.icon }) : null,
              b.label
            ]
          },
          b.id
        );
      })
    }
  );
}
const Ft = "bg-surface-panel text-main rounded-sm border border-transparent shadow-xs transition-all";
function ee({ children: t, as: s, isInteractive: n = !1, className: l, ref: r, ...i }) {
  return /* @__PURE__ */ e(
    s ?? "div",
    {
      ...i,
      ref: r,
      className: f(
        Ft,
        "flex flex-col gap-4 p-4",
        // No border is ever drawn on the card in the export, so the resting border is
        // transparent — kept as a real border utility rather than removed, so the hover
        // reveal has something to change rather than shifting the layout by 1px.
        n && "hover:border-subtle select-none",
        l
      ),
      children: t
    }
  );
}
function _t({
  children: t,
  className: s,
  ref: n,
  ...l
}) {
  return /* @__PURE__ */ e("div", { ...l, ref: n, className: f("flex items-center gap-2", s), children: t });
}
function zt({
  children: t,
  className: s,
  ref: n,
  ...l
}) {
  return /* @__PURE__ */ e("div", { ...l, ref: n, className: f("flex flex-col gap-4 flex-1 min-w-0", s), children: t });
}
function Ut({
  children: t,
  className: s,
  ref: n,
  ...l
}) {
  return /* @__PURE__ */ e("div", { ...l, ref: n, className: f("flex items-center gap-2 mt-auto", s), children: t });
}
ee.Header = _t;
ee.Body = zt;
ee.Footer = Ut;
function j({
  accent: t = "neutral",
  appearance: s = "solid",
  icon: n,
  children: l,
  onRemove: r,
  removeLabel: i = "Remove tag",
  className: o,
  ref: a,
  ...c
}) {
  const d = {
    neutral: {
      solid: "bg-neutral-2/10 text-main",
      outline: "border border-neutral-1 text-main"
    },
    // text-primary-2 kept raw here, not aliased to `text-interactive-text` — this is Tag's
    // own categorical red, not an interactive affordance; aliasing it would wrongly imply
    // every red tag is interactive.
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
  return /* @__PURE__ */ u(
    "span",
    {
      ...c,
      ref: a,
      className: f(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        s === "outline" ? d[t].outline : d[t].solid,
        o
      ),
      children: [
        n ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: n }) : null,
        l,
        r ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: r,
            "aria-label": i,
            className: "hover:bg-neutral-5/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
            children: "×"
          }
        ) : null
      ]
    }
  );
}
function le({
  title: t,
  icon: s,
  onTitleClick: n,
  headingLevel: l = 3,
  titleId: r,
  className: i,
  ref: o,
  ...a
}) {
  const c = `h${l}`;
  return /* @__PURE__ */ u("div", { ...a, ref: o, className: f("flex items-center gap-2 w-full", i), children: [
    /* @__PURE__ */ e(
      c,
      {
        id: r,
        className: f(
          "flex-1 min-w-0 text-body-l font-semibold text-main font-sans",
          !n && "truncate"
        ),
        children: n ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: (d) => {
              d.stopPropagation(), n();
            },
            className: "inline-block max-w-full truncate align-bottom text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
            children: t
          }
        ) : t
      }
    ),
    s ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: s }) : null
  ] });
}
function Wt({ badges: t, className: s, ref: n, ...l }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ e("div", { ...l, ref: n, className: f("flex flex-wrap items-center gap-4", s), children: t.map((r, i) => /* @__PURE__ */ u(
      "span",
      {
        "aria-hidden": r.decorative || void 0,
        className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
        children: [
          r.decorative ? null : /* @__PURE__ */ e("span", { className: "sr-only", children: r.label }),
          r.count !== void 0 ? /* @__PURE__ */ e("span", { className: "tabular-nums", "aria-hidden": !0, children: r.count }) : null,
          /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: r.icon })
        ]
      },
      r.decorative ? `decorative-${i}` : r.label
    )) })
  );
}
function we({ urgency: t, labels: s }) {
  const n = (s == null ? void 0 : s[t]) ?? wt[t];
  return n ? /* @__PURE__ */ u("span", { className: "sr-only", children: [
    ", ",
    n
  ] }) : null;
}
function $t({
  title: t,
  points: s,
  formatPoints: n = Ct,
  dueDateText: l,
  dueDateUrgency: r = "normal",
  dueDateUrgencyLabel: i,
  tags: o = [],
  assigneeName: a,
  assigneeAvatar: c,
  metaBadges: d = [],
  actions: p,
  icon: m,
  headingLevel: v = 3,
  titleId: C,
  className: h,
  onPress: x,
  ref: b,
  ...y
}) {
  const g = tt(), N = C ?? g;
  return (
    // The whole card stays clickable for a pointer user, but it is deliberately no longer an
    // ARIA button. `role="button"` + `tabIndex={0}` here made the card one control whose
    // accessible name was its entire text content ("Fix bug 5 Pts OVERDUE BUG Fernando Ramirez
    // 12 comments"), and put every interactive child it may hold — a removable `Tag`, a future
    // footer action — inside a button, which is invalid. The keyboard and screen-reader
    // affordance is now the title button `ProjectInfo` renders below, named by the task title;
    // this handler is the redundant pointer target beside it, which is what the two rules
    // suppressed here exist to catch when it is the *only* thing on offer. Same treatment as
    // `TaskTableRow`, which had no keyboard path at all.
    //
    //
    // It is an `<article>` rather than a `<div>`, and that is additive to the decision
    // above rather than a reversal of it: an article is a landmark-like container, not a
    // control, so it names the card for a screen reader's article navigation without
    // making it one focusable thing whose name is its whole text content. `aria-labelledby`
    // points at the title heading `ProjectInfo` renders, which is why that component gained
    // a `titleId`.
    //
    // The chrome now comes from `Card` rather than being restated here (#98). It was
    // `p-4 bg-surface-panel rounded-sm border-transparent shadow-xs hover:border-subtle` —
    // the same string `Card` now carries, which is the point: two card surfaces that could
    // drift apart independently was #15's actual complaint, and a component cannot drift from
    // a constant it reads. `card.test.tsx` asserts the two compute the same background and
    // radius, so a change to one that does not reach the other fails.
    //
    // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
    // `rounded-lg` here previously resolved to this project's --radius-lg (24px), far too
    // round. That evidence is what settled #98 in this direction rather than the other.
    //
    // No `focus-visible:outline-*` anywhere here: the card is not focusable, so those
    // utilities could never match. The ring lives on the title button that replaced them.
    //
    // The `jsx-a11y/click-events-have-key-events` and `no-noninteractive-element-interactions`
    // disables that used to sit here are **gone, and their absence is not a fix.** jsx-a11y
    // only lints JSX host elements, so once this became `<Card>` the rules stopped applying —
    // eslint flagged the directives as unused, which is the only reason this is visible at all.
    // The `onClick`-on-a-non-interactive-element question did not go away; it moved inside
    // `Card`, where the element is a dynamic `<Component>` and jsx-a11y cannot see it either.
    // What actually answers it is unchanged and is the reason the disables were acceptable
    // before: the keyboard and screen-reader path is the title `<button>` `ProjectInfo`
    // renders, and this handler is the redundant pointer target beside it.
    /* @__PURE__ */ u(
      ee,
      {
        ...y,
        as: "article",
        isInteractive: !0,
        "aria-labelledby": N,
        onClick: x,
        ref: b,
        className: f(x && "cursor-pointer", h),
        children: [
          p ? /* @__PURE__ */ u("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ e(
              le,
              {
                title: t,
                icon: m,
                onTitleClick: x,
                headingLevel: v,
                titleId: N,
                className: "flex-1 min-w-0"
              }
            ),
            /* @__PURE__ */ e("div", { className: "shrink-0", onClick: (k) => k.stopPropagation(), children: p })
          ] }) : /* @__PURE__ */ e(
            le,
            {
              title: t,
              icon: m,
              onTitleClick: x,
              headingLevel: v,
              titleId: N
            }
          ),
          s !== void 0 || l ? /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-2", children: [
            s !== void 0 ? (
              // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
              // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
              /* @__PURE__ */ e("span", { className: "text-body-m font-semibold text-main font-sans", children: n(s) })
            ) : null,
            l ? (
              // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
              // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
              // of a bespoke span gets typography/spacing/color right for free.
              /* @__PURE__ */ u(
                j,
                {
                  accent: Nt[r],
                  icon: /* @__PURE__ */ e(Lt, { className: "size-6" }),
                  children: [
                    l,
                    /* @__PURE__ */ e(we, { urgency: r, labels: i })
                  ]
                }
              )
            ) : null
          ] }) : null,
          o.length > 0 ? /* @__PURE__ */ e("div", { className: "flex flex-wrap items-center gap-2", children: o.map((k, P) => (
            // `uppercase` as a class, never `t.label.toUpperCase()` (#102). A screen reader
            // spells out a string that is literally capitalised and reads a CSS-uppercased one
            // normally, so transforming the string would trade an accessibility property for a
            // visual one. `t.className` is merged last, and `cn()` is `twMerge`, so
            // `normal-case` from a consumer wins.
            /* @__PURE__ */ e(j, { accent: k.accent || "neutral", className: f("uppercase", k.className), children: k.label }, P)
          )) }) : null,
          /* @__PURE__ */ u("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ e(q, { src: c, name: a, size: "sm" }),
              a ? /* @__PURE__ */ e("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: a }) : null
            ] }),
            d.length > 0 ? /* @__PURE__ */ e(Wt, { badges: d }) : null
          ] })
        ]
      }
    )
  );
}
function I({ className: t, ref: s, ...n }) {
  return /* @__PURE__ */ e(
    "div",
    {
      ...n,
      ref: s,
      "aria-hidden": !0,
      className: f("motion-safe:animate-pulse rounded-sm bg-neutral-3", t)
    }
  );
}
function ke({
  title: t,
  description: s,
  icon: n,
  action: l,
  label: r = "No results",
  className: i,
  ref: o,
  ...a
}) {
  return /* @__PURE__ */ u(
    "div",
    {
      ...a,
      ref: o,
      role: "group",
      "aria-label": r,
      className: f(
        "flex flex-col items-center gap-2 rounded-sm border border-dashed border-subtle/20",
        "px-6 py-10 text-center font-sans",
        i
      ),
      children: [
        n ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-12 h-12 shrink-0 text-muted", children: n }) : null,
        /* @__PURE__ */ e("p", { className: "text-body-m font-semibold text-main", children: t }),
        s ? /* @__PURE__ */ e("p", { className: "text-body-m text-muted-on-dark", children: s }) : null,
        l
      ]
    }
  );
}
function ne() {
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ e(I, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e(I, { className: "h-6 w-16" }),
      /* @__PURE__ */ e(I, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ e("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e(I, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ e(I, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function Yn({
  title: t,
  icon: s,
  tasks: n,
  isLoading: l = !1,
  emptyTitle: r = "No tasks in this view",
  emptyDescription: i,
  emptyAction: o,
  empty: a,
  headingLevel: c = 3,
  label: d,
  className: p,
  ref: m,
  ...v
}) {
  return /* @__PURE__ */ u(
    d ? "section" : "div",
    {
      ...v,
      ref: m,
      "aria-label": d,
      className: f("flex flex-col gap-4 w-full", p),
      children: [
        /* @__PURE__ */ e(le, { title: t, icon: s, headingLevel: c }),
        l ? /* @__PURE__ */ u(re, { children: [
          /* @__PURE__ */ e(ne, {}),
          /* @__PURE__ */ e(ne, {}),
          /* @__PURE__ */ e(ne, {})
        ] }) : n.length === 0 ? a ?? /* @__PURE__ */ e(ke, { title: r, description: i, action: o }) : n.map((h, x) => /* @__PURE__ */ e($t, { ...h, className: "w-full" }, x))
      ]
    }
  );
}
const Kt = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, Gt = ({ className: t }) => /* @__PURE__ */ e(
  "svg",
  {
    className: t,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": !0,
    children: /* @__PURE__ */ e("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" })
  }
), R = "text-body-m font-normal text-main font-sans", me = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function Yt({
  date: t,
  dueDateUrgency: s = "normal",
  dueDateUrgencyLabel: n,
  className: l,
  ref: r,
  ...i
}) {
  return /* @__PURE__ */ u("span", { ...i, ref: r, className: f(R, {
    normal: "text-main",
    soon: "text-tertiary-4",
    // `primary-2`, not the `primary-4` this was. A cell renders on `surface-panel`, where
    // primary-4 as text measures 3.51:1 — under AA, and five of the kit's 131 contrast
    // violations. primary-4 clears 4.5:1 on nothing in this palette, so there was no
    // surface-side fix; primary-2 is 6.67:1 here.
    //
    // Still a raw ramp class rather than the `text-interactive-text` alias: this is a
    // status/urgency signal, not an interactive affordance, and the alias would
    // misrepresent its role even though it resolves to the same value. It stays in step
    // with the `Tag` version of the same signal, whose red label is now primary-2 too —
    // `DUE_DATE_URGENCY_COLOR` keeps the mapping shared, but the colours are applied to
    // different properties so there is no class to share.
    overdue: "text-primary-2"
  }[s], l), children: [
    t,
    /* @__PURE__ */ e(we, { urgency: s, labels: n })
  ] });
}
function qt({
  name: t,
  avatarSrc: s,
  unassignedLabel: n = "Unassigned",
  className: l,
  ref: r,
  ...i
}) {
  return /* @__PURE__ */ u("div", { ...i, ref: r, className: f("flex items-center gap-2 min-w-0", l), children: [
    /* @__PURE__ */ e(q, { src: s, name: t, fallbackLabel: n, size: "sm" }),
    t ? /* @__PURE__ */ e("span", { className: f(R, "truncate"), children: t }) : null
  ] });
}
function Xt({
  points: t,
  formatPoints: s = Ce,
  className: n,
  ref: l,
  ...r
}) {
  return /* @__PURE__ */ e("span", { ...r, ref: l, className: f(R, "tabular-nums", n), children: s(t) });
}
function Jt({ labels: t, className: s, ref: n, ...l }) {
  return /* @__PURE__ */ e("div", { ...l, ref: n, className: f("flex flex-wrap items-center gap-2", s), children: t.map((r, i) => (
    // Same class, same reason, same override as `TaskCard` — see `TaskTag.className`.
    /* @__PURE__ */ e(j, { accent: r.accent ?? "neutral", className: f("uppercase", r.className), children: r.label }, i)
  )) });
}
const Qt = {
  neutral: "bg-neutral-2",
  red: "bg-primary-4",
  green: "bg-secondary-4",
  yellow: "bg-tertiary-4",
  blue: "bg-blue"
};
function en({
  index: t,
  title: s,
  accent: n = "neutral",
  reactions: l = [],
  isSelected: r = !1,
  onChange: i,
  isSelectable: o = !0,
  selectLabel: a,
  detailsLabel: c = "Details",
  headingLevel: d,
  tags: p = [],
  estimationPoints: m,
  formatPoints: v,
  assigneeName: C,
  assigneeAvatar: h,
  unassignedLabel: x,
  dueDate: b,
  dueDateUrgency: y = "normal",
  dueDateUrgencyLabel: g,
  actions: N,
  columns: k,
  columnLabels: P,
  onPress: V,
  onViewDetails: F,
  className: _,
  ref: B,
  ...S
}) {
  const O = Le(k, P), E = {
    index: t,
    title: s,
    accent: n,
    reactions: l,
    isSelected: r,
    onChange: i,
    isSelectable: o,
    selectLabel: a,
    detailsLabel: c,
    headingLevel: d,
    tags: p,
    estimationPoints: m,
    formatPoints: v,
    assigneeName: C,
    assigneeAvatar: h,
    unassignedLabel: x,
    dueDate: b,
    dueDateUrgency: y,
    dueDateUrgencyLabel: g,
    actions: N,
    onPress: V,
    onViewDetails: F
  }, A = (w) => w.stopPropagation(), Z = d ? `h${d}` : null, W = Z ? "inline-block max-w-full align-bottom" : "flex-1 min-w-0", $ = V ? /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      onClick: (w) => {
        A(w), V();
      },
      className: f(
        R,
        W,
        "truncate text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1"
      ),
      children: s
    }
  ) : /* @__PURE__ */ e("span", { className: f(R, W, "truncate"), children: s }), G = {
    name: /* @__PURE__ */ u("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ e("span", { className: f("w-1 h-full shrink-0", Qt[n]) }),
      o ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        /* @__PURE__ */ u(
          "label",
          {
            onClick: A,
            className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-1",
            children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only",
                  checked: r,
                  onChange: (w) => i == null ? void 0 : i(w.target.checked),
                  "aria-label": a ?? `Select ${s}`
                }
              ),
              /* @__PURE__ */ e(
                Gt,
                {
                  className: f(
                    "w-6 h-6 text-main transition-opacity",
                    r ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  )
                }
              )
            ]
          }
        )
      ) : null,
      /* @__PURE__ */ e("span", { className: f(R, "shrink-0 tabular-nums"), children: String(t).padStart(2, "0") }),
      Z ? /* @__PURE__ */ e(Z, { className: f(R, "flex-1 min-w-0"), children: $ }) : $,
      l.map((w, U) => /* @__PURE__ */ u(
        "span",
        {
          "aria-hidden": w.decorative || void 0,
          className: f(R, "inline-flex items-center gap-1 shrink-0"),
          children: [
            w.decorative ? null : /* @__PURE__ */ e("span", { className: "sr-only", children: w.label }),
            w.count !== void 0 ? /* @__PURE__ */ e("span", { className: "tabular-nums", "aria-hidden": !0, children: w.count }) : null,
            /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: w.icon })
          ]
        },
        w.decorative ? `decorative-${U}` : w.label
      )),
      F ? /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          onClick: (w) => {
            A(w), F();
          },
          className: f(
            R,
            // `hover:text-interactive-text`, not `hover:text-interactive`: this is a
            // text label, and hovering it used to drop it to 3.51:1 on the panel it
            // sits on. A hover state is invisible to a static-story axe pass, so this
            // one was found by reading rather than by measuring.
            "inline-flex items-center gap-1 shrink-0 hover:text-interactive-text transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs"
          ),
          children: [
            /* @__PURE__ */ e("span", { children: c }),
            /* @__PURE__ */ e(Ne, { className: "w-4 h-4" })
          ]
        }
      ) : null,
      N ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        /* @__PURE__ */ e("div", { className: "shrink-0", onClick: A, children: N })
      ) : null
    ] }),
    tags: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: p.length > 0 ? /* @__PURE__ */ e(Jt, { labels: p }) : null }),
    estimation: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: m !== void 0 ? /* @__PURE__ */ e(Xt, { points: m, formatPoints: v }) : null }),
    assignee: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ e(
      qt,
      {
        name: C,
        avatarSrc: h,
        unassignedLabel: x
      }
    ) }),
    dueDate: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: b ? /* @__PURE__ */ e(
      Yt,
      {
        date: b,
        dueDateUrgency: y,
        dueDateUrgencyLabel: g
      }
    ) : null })
  };
  return (
    // The row-wide handler is a pointer convenience only. A `<tr>` cannot be the control
    // itself — giving it `role="button"` would strip its `row` role and break the table it
    // has to live in — so the keyboard and screen-reader affordance is the title button in
    // the Task Name cell below, exactly as `TaskCard` now does it. Before that button
    // existed this handler was the only way to open a task from the table, and it was
    // unreachable without a pointer: no `role`, no `tabIndex`, no `onKeyDown`.
    /* @__PURE__ */ e(
      "tr",
      {
        ...S,
        onClick: V,
        ref: B,
        className: f("group", V && "cursor-pointer", _),
        children: O.map((w, U) => /* @__PURE__ */ e(
          "td",
          {
            className: f(
              me,
              // Task Name's left padding is 0 so the accent stripe sits flush against the edge
              // (Figma: padding 4px 16px 4px 0px); every other cell takes pl-2.
              w.key === "name" ? "pl-0 pr-4" : "pl-2 pr-4",
              // `border-l` belongs to whichever column is FIRST, not to `name`. Those were the
              // same thing while the order was fixed, and a consumer who reorders is exactly the
              // case where they stop being.
              U === 0 && "border-l"
            ),
            style: { width: w.width },
            children: w.renderCell ? w.renderCell(E) : G[w.key]
          },
          w.key
        ))
      }
    )
  );
}
function tn({ columns: t }) {
  const s = {
    name: /* @__PURE__ */ e(I, { className: "h-4 w-full" }),
    tags: /* @__PURE__ */ e(I, { className: "h-6 w-16 rounded" }),
    estimation: /* @__PURE__ */ e(I, { className: "h-4 w-16" }),
    assignee: /* @__PURE__ */ u(re, { children: [
      /* @__PURE__ */ e(I, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ e(I, { className: "h-4 w-20" })
    ] }),
    dueDate: /* @__PURE__ */ e(I, { className: "h-4 w-20" })
  };
  return /* @__PURE__ */ e("tr", { children: t.map((n, l) => /* @__PURE__ */ e(
    "td",
    {
      className: f(me, "pl-4 pr-4", l === 0 && "border-l"),
      style: { width: n.width },
      children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: s[n.key] ?? /* @__PURE__ */ e(I, { className: "h-4 w-16" }) })
    },
    n.key
  )) });
}
function nn({ level: t, children: s }) {
  const n = `h${t}`;
  return /* @__PURE__ */ e(n, { className: "flex-1 min-w-0", children: s });
}
function sn({
  title: t,
  isExpanded: s,
  onToggle: n
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      onClick: n,
      "aria-expanded": s,
      className: "flex items-center gap-2 min-w-0 max-w-full text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1",
      children: [
        /* @__PURE__ */ e(
          de,
          {
            className: f(
              "w-6 h-6 shrink-0 text-muted transition-transform",
              !s && "-rotate-90"
            )
          }
        ),
        /* @__PURE__ */ e("span", { className: "truncate text-body-l font-semibold text-main font-sans", children: t })
      ]
    }
  );
}
const ln = {
  name: "# Task Name",
  tags: "Task Tags",
  estimation: "Estimate",
  assignee: "Task Assign Name",
  dueDate: "Due Date"
}, rn = ["name", "tags", "estimation", "assignee", "dueDate"];
function on(t) {
  return "renderCell" in t;
}
const an = rn.map((t) => ({ key: t }));
function Le(t, s) {
  return (t ?? an).map(
    (n) => on(n) ? { key: n.key, label: n.label, width: n.width, renderCell: n.renderCell } : {
      key: n.key,
      label: n.label ?? (s == null ? void 0 : s[n.key]) ?? ln[n.key],
      width: n.width ?? Kt[n.key]
    }
  );
}
function qn({
  groups: t,
  isLoading: s = !1,
  emptyTitle: n = "No tasks yet",
  emptyDescription: l,
  emptyAction: r,
  empty: i,
  columnLabels: o,
  columns: a,
  className: c,
  ref: d,
  ...p
}) {
  const m = Le(a, o), v = m.reduce((b, y) => b + y.width, 0), [C, h] = ce(() => /* @__PURE__ */ new Set()), x = (b) => {
    h((y) => {
      const g = new Set(y);
      return g.has(b) ? g.delete(b) : g.add(b), g;
    });
  };
  return /* @__PURE__ */ e(
    "div",
    {
      ...p,
      ref: d,
      className: f(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        c
      ),
      children: /* @__PURE__ */ u("div", { className: "flex flex-col gap-4", style: { minWidth: v }, children: [
        /* @__PURE__ */ e("div", { className: "flex", children: m.map(({ key: b, label: y, width: g }, N) => /* @__PURE__ */ e(
          "div",
          {
            className: f(
              me,
              "px-4",
              N === 0 && "border-l rounded-l-4",
              N === m.length - 1 && "rounded-r-4"
            ),
            style: { width: g },
            children: /* @__PURE__ */ e("span", { className: f(R, "whitespace-nowrap"), children: y })
          },
          b
        )) }),
        s ? /* @__PURE__ */ u("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ e("colgroup", { children: m.map(({ key: b, width: y }) => /* @__PURE__ */ e("col", { style: { width: y } }, b)) }),
          /* @__PURE__ */ e("tbody", { children: Array.from({ length: 5 }).map((b, y) => /* @__PURE__ */ e(tn, { columns: m }, y)) })
        ] }) : t.length === 0 ? i ?? /* @__PURE__ */ e(ke, { title: n, description: l, action: r }) : t.map((b, y) => {
          const g = !C.has(y);
          return /* @__PURE__ */ u("table", { className: "border-collapse table-fixed", children: [
            /* @__PURE__ */ e("colgroup", { children: m.map(({ key: N, width: k }) => /* @__PURE__ */ e("col", { style: { width: k } }, N)) }),
            /* @__PURE__ */ u("tbody", { children: [
              /* @__PURE__ */ e("tr", { children: /* @__PURE__ */ e("td", { colSpan: m.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
                /* @__PURE__ */ e(nn, { level: b.headingLevel ?? 3, children: /* @__PURE__ */ e(
                  sn,
                  {
                    title: b.title,
                    isExpanded: g,
                    onToggle: () => x(y)
                  }
                ) }),
                b.actions
              ] }) }) }),
              g ? b.rows.map((N, k) => (
                // The table's column set wins over anything on the row: a row inside a
                // table that disagreed with its own header is not a configuration worth
                // supporting, and spreading `row` first would allow exactly that. Both go
                // through `resolveColumns`, so the row cannot resolve them differently.
                /* @__PURE__ */ e(
                  en,
                  {
                    ...N,
                    columns: a,
                    columnLabels: o
                  },
                  k
                )
              )) : null
            ] })
          ] }, y);
        })
      ] })
    }
  );
}
function te({
  isOpen: t,
  onClose: s,
  triggerRef: n,
  dismissExemptRef: l,
  children: r,
  className: i,
  ref: o,
  ...a
}) {
  const c = D(o), { overlayProps: d } = Ee(
    {
      isOpen: t,
      onClose: s,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (p) => {
        var m, v;
        return !((m = n == null ? void 0 : n.current) != null && m.contains(p)) && !((v = l == null ? void 0 : l.current) != null && v.contains(p));
      }
    },
    c
  );
  return t ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ e(ae, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ u("div", { ...d, ...a, ref: c, role: "dialog", className: i, children: [
      /* @__PURE__ */ e(J, { onDismiss: s }),
      r,
      /* @__PURE__ */ e(J, { onDismiss: s })
    ] }) })
  ) : null;
}
function pe({
  state: t,
  children: s,
  className: n,
  ref: l,
  ...r
}) {
  const i = D(l), { popoverProps: o, underlayProps: a } = Ae({ ...r, popoverRef: i }, t);
  return /* @__PURE__ */ u(Ze, { children: [
    /* @__PURE__ */ e("div", { ...a, className: "fixed inset-0" }),
    /* @__PURE__ */ e(ae, { restoreFocus: !0, children: /* @__PURE__ */ u(
      "div",
      {
        ...o,
        ref: i,
        onKeyDownCapture: (c) => {
          c.key === "Escape" && (c.stopPropagation(), t.close());
        },
        className: f(
          "z-popover bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          n
        ),
        children: [
          /* @__PURE__ */ e(J, { onDismiss: () => t.close() }),
          s,
          /* @__PURE__ */ e(J, { onDismiss: () => t.close() })
        ]
      }
    ) })
  ] });
}
function Me({
  state: t,
  className: s,
  ref: n,
  ...l
}) {
  const r = D(n), { listBoxProps: i } = je(l, t, r);
  return /* @__PURE__ */ e(
    "ul",
    {
      ...i,
      ref: r,
      className: f("max-h-64 min-w-40 overflow-auto py-2 outline-none", s),
      children: [...t.collection].map((o) => /* @__PURE__ */ e(cn, { item: o, state: t }, o.key))
    }
  );
}
function cn({ item: t, state: s }) {
  const n = M(null), { optionProps: l, isSelected: r, isFocused: i, isDisabled: o } = Fe(
    { key: t.key },
    s,
    n
  );
  return /* @__PURE__ */ u(
    "li",
    {
      ...l,
      ref: n,
      className: f(
        "flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer",
        // Focus and selection are independent states with independent
        // styling — merging them would leave a keyboard user with no way
        // to tell which option their arrow keys are actually on.
        //
        // The fill alone was not enough to tell them, though. `bg-neutral-4` on the
        // popover's `surface-overlay` measures **1.23:1**, and 1.00:1 if a consumer puts
        // a bare ListBox on a panel — an invisible keyboard focus indicator, and the `<li>`
        // carried `outline-none` so there was no other affordance either. That is 2.4.7,
        // and it survived a pass whose whole subject was focus rings, because arrow-key
        // focus inside a popover is not something a static story shows.
        //
        // The fill stays as the quiet selection-independent cue and an inset ring carries
        // the visibility (5.43:1 on an overlay). `outline-solid` is explicit for the same
        // reason it is on `LabelCheckbox`; `outline-none` is gone rather than overridden,
        // because it sets `--tw-outline-style: none` and would suppress the ring outright.
        i && "bg-neutral-4 outline-solid outline-2 -outline-offset-2 outline-interactive-text",
        // `-text`, not the bare `text-interactive`: this is the one place the accent is
        // used as *text* on a dark surface, and primary-4 measures 2.86:1 on the
        // popover's `surface-overlay`. See `tokens.css`'s contrast-safe roles.
        r ? "text-interactive-text font-semibold" : "text-main",
        o && "cursor-not-allowed opacity-50"
      ),
      children: [
        /* @__PURE__ */ e("span", { children: t.rendered }),
        r ? /* @__PURE__ */ e("span", { "aria-hidden": "true", children: "✓" }) : null
      ]
    }
  );
}
function Xn({
  isLabelVisible: t = !1,
  placeholder: s,
  icon: n,
  error: l,
  description: r,
  className: i,
  ref: o,
  ...a
}) {
  const c = ot(a), d = D(o), { labelProps: p, triggerProps: m, valueProps: v, menuProps: C, descriptionProps: h, errorMessageProps: x } = _e(
    { ...a, description: r, errorMessage: l, isInvalid: !!l },
    c,
    d
  ), { buttonProps: b } = z(m, d);
  return /* @__PURE__ */ u("div", { className: f("inline-flex flex-col gap-1.5", i), children: [
    a.label ? /* @__PURE__ */ u("span", { ...p, className: Q(t), children: [
      a.label,
      a.isRequired ? /* @__PURE__ */ e(Y, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(ze, { state: c, triggerRef: d, label: a.label, name: a.name }),
    /* @__PURE__ */ u(
      "button",
      {
        ...b,
        ref: d,
        type: "button",
        className: f(
          // The design's chip, not a light field. Figma draws every dropdown trigger in
          // this system as the same "Tag" atom — `rgba(148,151,154,0.1)` (neutral-2 at
          // 10%), 4px radius, 32px tall, 4px/16px padding, white 15px/600 label — over a
          // dark surface (`Dashboard Add Task/Add Task Modal00.md:78-140`: the four
          // pickers on the `#393D41` card, and the same chip again in the Edit Task
          // modal). These are `Tag`'s own `variant="neutral"` values, so a trigger and
          // the chips beside it line up at exactly 32px.
          //
          // This was `bg-surface-neutral` — white — which put five near-white pills on
          // the consuming app's dark board. It came from `1afb406`, which correctly
          // fixed invisible white-on-white *value* text by moving the trigger's interior
          // to `Input`'s light-surface colours; the surface underneath that fix was
          // borrowed from `Input` rather than checked against the design. `Input` is
          // genuinely a light field. A dropdown trigger is not.
          //
          // Contrast recomputed for this surface — the 10% fill composites, so every
          // ratio is against the composited chip, not the bare token, on
          // overlay/panel/shell. `styles/contrast.test.ts` pins all of it:
          //   value       `text-main`           9.52 / 11.54 / 13.20:1
          //   placeholder `text-muted-on-dark`  4.61 /  5.33 /  5.88:1
          // `text-muted` is the obvious choice for a dimmed placeholder and is what the
          // consuming app used pre-migration; it measures 3.24 / 3.93 / 4.49:1 here and
          // fails AA on all three. `muted-on-dark` composites against whatever it lands
          // on, so it carries the empty state instead.
          "inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          c.selectedItem ? "text-main" : "text-muted-on-dark",
          // A `ring`, not a `border`: the design gives this chip no boundary at all, so
          // an invalid one has to appear out of nothing. A border would add 2px to a
          // control whose height the design fixes at 32px, nudging the whole filter row
          // at the moment a form is reporting an error. `ring-1` is a box-shadow and
          // costs no layout.
          //
          // `danger-text` (danger-3), not the `danger-5` `Input` and `Datepicker` use.
          // Their invalid border survives 1.4.11 on the strength of the white field
          // interior it separates from the container (4.29:1) — see `FIELD_ERROR_CLASS`,
          // which says so explicitly. This trigger has no white interior any more, and
          // danger-5 measures 2.55:1 on `surface-overlay`, the modal card a task form
          // actually sits on. danger-3 clears 3:1 on both adjacent colours everywhere:
          // 4.91:1 against the chip and 5.65:1 against the surface, at the tightest.
          //
          // The invalid *focus ring* is `danger-text` too, and used to be `danger-5` on
          // this very line — the same 2.55:1 the paragraph above rejects, one line later.
          // It hid because `cn()` is tailwind-merge: `focus-visible:outline-danger-5` here
          // silently drops the `focus-visible:outline-interactive-text` set in the base
          // string, so the error state quietly *downgraded* the ring from 5.43:1 to
          // 2.55:1. Four controls had it — this one, `MultiSelect`, `Input`, `Datepicker`
          // — and all four are `danger-text` now, 5.65 / 6.94 / 7.95:1.
          l && "ring-1 ring-danger-text focus-visible:outline-danger-text"
        ),
        children: [
          n,
          /* @__PURE__ */ e("span", { ...v, className: "flex-1 text-left truncate", children: c.selectedItem ? c.selectedItem.rendered : s }),
          /* @__PURE__ */ e(de, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ e(
      K,
      {
        description: r,
        error: l,
        descriptionProps: h,
        errorMessageProps: x
      }
    ),
    c.isOpen ? /* @__PURE__ */ e(pe, { state: c, triggerRef: d, placement: "bottom start", children: /* @__PURE__ */ e(Me, { ...C, state: c }) }) : null
  ] });
}
function Jn({
  label: t,
  placeholder: s,
  icon: n,
  isDisabled: l,
  error: r,
  description: i,
  className: o,
  ref: a,
  ...c
}) {
  const d = ue({}), p = D(a), m = at({
    ...c,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { fieldProps: v, descriptionProps: C, errorMessageProps: h } = ie({
    label: t,
    description: i,
    errorMessage: r,
    isInvalid: !!r
  }), { buttonProps: x } = z(
    { onPress: () => d.toggle(), isDisabled: l, "aria-label": t },
    p
  ), b = [...m.collection].filter(
    (y) => m.selectionManager.isSelected(y.key)
  );
  return /* @__PURE__ */ u("div", { className: f("inline-flex flex-col gap-1.5", o), children: [
    /* @__PURE__ */ u(
      "button",
      {
        ...x,
        ref: p,
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": d.isOpen,
        "aria-describedby": v["aria-describedby"],
        className: f(
          // The design's chip, identical to `Select`'s trigger — see that component for
          // the full derivation, the measured ratios, and why the white surface this
          // replaces was wrong. Identical on purpose: the two sit side by side in a
          // filter row, and nothing about holding a set rather than a scalar should make
          // this control a different height or shape.
          "inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          b.length > 0 ? "text-main" : "text-muted-on-dark",
          r && "ring-1 ring-danger-text focus-visible:outline-danger-text"
        ),
        children: [
          n,
          /* @__PURE__ */ e("span", { className: "flex-1 text-left truncate", children: b.length > 0 ? b.map((y, g) => /* @__PURE__ */ u(nt, { children: [
            g > 0 ? ", " : null,
            y.rendered
          ] }, y.key)) : s }),
          /* @__PURE__ */ e(de, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ e(
      K,
      {
        description: i,
        error: r,
        descriptionProps: C,
        errorMessageProps: h
      }
    ),
    d.isOpen ? /* @__PURE__ */ e(pe, { state: d, triggerRef: p, placement: "bottom start", children: /* @__PURE__ */ e(Me, { "aria-label": t, state: m, autoFocus: !0 }) }) : null
  ] });
}
function Qn({
  label: t,
  triggerContent: s,
  isDisabled: n,
  triggerClassName: l,
  ref: r,
  ...i
}) {
  const o = ct({}), a = D(r), { menuTriggerProps: c, menuProps: d } = Ue(
    { isDisabled: n },
    o,
    a
  ), { buttonProps: p } = z(
    { ...c, isDisabled: n, "aria-label": t },
    a
  );
  return /* @__PURE__ */ u(re, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        ...p,
        ref: a,
        type: "button",
        className: f(
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          l
        ),
        children: s
      }
    ),
    o.isOpen ? /* @__PURE__ */ e(pe, { state: o, triggerRef: a, placement: "bottom end", children: /* @__PURE__ */ e(
      un,
      {
        ...d,
        ...i,
        autoFocus: i.autoFocus ?? o.focusStrategy ?? !0,
        onClose: () => o.close()
      }
    ) }) : null
  ] });
}
function un({ children: t, onAction: s, onClose: n, ...l }) {
  const r = ut({ ...l, children: t, selectionMode: "none" }), i = M(null), { menuProps: o } = We({ ...l, onAction: s, onClose: n }, r, i);
  return /* @__PURE__ */ e("ul", { ...o, ref: i, className: "max-h-64 min-w-40 overflow-auto py-2 outline-none", children: [...r.collection].map((a) => /* @__PURE__ */ e(dn, { item: a, state: r, onClose: n }, a.key)) });
}
function dn({ item: t, state: s, onClose: n }) {
  const l = M(null), { menuItemProps: r, isFocused: i, isDisabled: o } = $e(
    { key: t.key, onClose: n },
    s,
    l
  );
  return /* @__PURE__ */ e(
    "li",
    {
      ...r,
      ref: l,
      className: f(
        "text-body-m font-sans cursor-pointer px-4 py-1.5 text-main",
        // Same defect and same fix as `ListBox` — see its comment for the reasoning.
        // `bg-neutral-4` on the menu's `surface-overlay` is 1.23:1, so the highlight was
        // effectively invisible, and `outline-none` left nothing else. This matters more
        // here than anywhere: the app's task-card menu is the sole entry point to
        // Edit/Delete, and this kit has already lost that focus indicator once.
        i && "bg-neutral-4 outline-solid outline-2 -outline-offset-2 outline-interactive-text",
        o && "cursor-not-allowed opacity-50"
      ),
      children: t.rendered
    }
  );
}
function es({
  title: t,
  isOpen: s,
  onClose: n,
  children: l,
  className: r,
  role: i = "dialog",
  isDismissable: o = !0,
  closeLabel: a = "Close modal",
  ref: c,
  ...d
}) {
  const p = D(c), m = M(null), v = ue({
    isOpen: s,
    onOpenChange: (g) => {
      g || n();
    }
  }), { modalProps: C, underlayProps: h } = Ke(
    { isDismissable: o, isKeyboardDismissDisabled: !o },
    v,
    p
  ), { dialogProps: x, titleProps: b, contentProps: y } = Ge({ role: i }, m);
  return s ? /* @__PURE__ */ e(
    "div",
    {
      ...h,
      className: "fixed inset-0 z-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ e(ae, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ e(
        "div",
        {
          ...d,
          ...C,
          ref: p,
          className: f("w-full max-w-md", r),
          children: /* @__PURE__ */ u(
            "div",
            {
              ...x,
              ref: m,
              className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
              children: [
                /* @__PURE__ */ u("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
                  /* @__PURE__ */ e("h2", { ...b, className: "font-sans font-bold text-base text-main", children: t }),
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      onClick: n,
                      "aria-label": a,
                      className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                      children: /* @__PURE__ */ e(fe, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ e("div", { ...y, className: "px-4 py-4", children: l })
              ]
            }
          )
        }
      ) })
    }
  ) : null;
}
function ts(t = !1) {
  const s = ue({ defaultOpen: t });
  return {
    isOpen: s.isOpen,
    open: s.open,
    close: s.close,
    toggle: s.toggle
  };
}
function ge(t, s) {
  return ht(xt(t, s));
}
function fn(t, s) {
  return t.toDate(s);
}
function mn({
  value: t,
  defaultValue: s,
  onChange: n,
  onClose: l,
  triggerRef: r,
  dismissExemptRef: i,
  timeZone: o = bt(),
  label: a = "Date picker",
  previousYearLabel: c = "Previous year",
  previousMonthLabel: d = "Previous month",
  nextMonthLabel: p = "Next month",
  nextYearLabel: m = "Next year",
  todayLabel: v = "Today",
  className: C,
  ref: h
}) {
  const x = t !== void 0 ? { value: ge(t, o) } : { defaultValue: s ? ge(s, o) : null }, b = dt({
    ...x,
    onChange: (B) => n == null ? void 0 : n(fn(B, o)),
    createCalendar: pt,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: y, prevButtonProps: g, nextButtonProps: N } = Ye(
    { "aria-label": a },
    b
  ), k = M(null), P = M(null), { buttonProps: V } = z(g, k), { buttonProps: F } = z(N, P), _ = () => {
    const B = vt(o);
    b.setFocusedDate(B), b.selectDate(B);
  };
  return /* @__PURE__ */ u(
    te,
    {
      isOpen: !0,
      onClose: l,
      ref: h,
      triggerRef: r,
      dismissExemptRef: i,
      "aria-label": a,
      className: f(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        C
      ),
      children: [
        /* @__PURE__ */ u("div", { ...y, className: "flex flex-col", children: [
          /* @__PURE__ */ u("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ u("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => b.focusPreviousSection(!0),
                  "aria-label": c,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ e(Tt, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  ...V,
                  ref: k,
                  "aria-label": d,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ e(St, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ e("span", { className: "font-sans font-semibold text-body-sm text-main", children: b.visibleRange.start.toDate(o).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: o }) }),
            /* @__PURE__ */ u("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  ...F,
                  ref: P,
                  "aria-label": p,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ e(Ne, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => b.focusNextSection(!0),
                  "aria-label": m,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ e(Dt, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ e("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ e(pn, { state: b })
        ] }),
        /* @__PURE__ */ e("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ e("div", { className: "flex items-center justify-center py-[9px] h-10", children: /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: _,
            className: "text-body-sm font-normal font-sans text-interactive-text hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
            children: v
          }
        ) })
      ]
    }
  );
}
function pn({ state: t }) {
  const { gridProps: s, headerProps: n, weekDays: l, weeksInMonth: r } = qe(
    { weekdayStyle: "short" },
    t
  ), i = t.visibleRange.start;
  return /* @__PURE__ */ u("div", { ...s, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ e("div", { ...n, className: "grid grid-cols-7", children: l.map((o, a) => /* @__PURE__ */ e("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: o }, a)) }),
    Array.from({ length: r }, (o, a) => /* @__PURE__ */ e("div", { role: "row", className: "grid grid-cols-7", children: t.getDatesInWeek(a).map(
      (c, d) => c ? /* @__PURE__ */ e(
        bn,
        {
          state: t,
          date: c,
          currentMonth: i
        },
        c.toString()
      ) : /* @__PURE__ */ e("div", { role: "gridcell", "aria-hidden": "true" }, d)
    ) }, a))
  ] });
}
function bn({
  state: t,
  date: s,
  currentMonth: n
}) {
  const l = M(null), r = !gt(s, n), { cellProps: i, buttonProps: o, isSelected: a, isDisabled: c, formattedDate: d } = Xe(
    { date: s, isOutsideMonth: r },
    t,
    l
  );
  return /* @__PURE__ */ e("div", { ...i, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ e(
    "div",
    {
      ...o,
      ref: l,
      className: f(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text",
        c ? "text-muted cursor-default" : a ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: d
    }
  ) });
}
const hn = [1, 2, 3, 5, 8];
function xn({
  value: t,
  onAction: s,
  onClose: n,
  triggerRef: l,
  dismissExemptRef: r,
  formatPoints: i = Ce,
  label: o = "Estimate",
  className: a,
  ref: c
}) {
  return /* @__PURE__ */ u(
    te,
    {
      isOpen: !0,
      onClose: n,
      ref: c,
      triggerRef: l,
      dismissExemptRef: r,
      "aria-label": o,
      className: f(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        a
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: o }) }),
        hn.map((d) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            onClick: () => s(d),
            "aria-pressed": t === d,
            className: f(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
              // `text-neutral-5` wherever the row's fill is a solid `neutral-2`: white on
              // that fill is 2.94:1, and it applies to the hover state as much as the
              // selected one. Only the selected case was visible to axe — a static story
              // has no hover.
              t === d ? "bg-neutral-2 text-neutral-5" : "hover:bg-neutral-2 hover:text-neutral-5"
            ),
            children: [
              /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ e(se, { className: "size-6" }) }),
              /* @__PURE__ */ e("span", { className: "whitespace-nowrap", children: i(d) })
            ]
          },
          d
        ))
      ]
    }
  );
}
function vn({
  name: t,
  role: s,
  avatarSrc: n,
  size: l = "md",
  isOnline: r = !1,
  className: i,
  onPress: o,
  ref: a,
  ...c
}) {
  const d = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ u(
    o ? "button" : "div",
    {
      ...c,
      type: o ? "button" : void 0,
      onClick: o,
      ref: a,
      className: f(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        o && "cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-sm",
        i
      ),
      children: [
        /* @__PURE__ */ u("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ e(q, { src: n, name: t, size: l }),
          r ? /* @__PURE__ */ e("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ u("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ e("span", { className: "font-sans font-normal text-body-m text-main truncate", children: t }),
          s ? /* @__PURE__ */ e(
            "span",
            {
              className: f(
                "font-sans text-muted-on-dark truncate leading-tight",
                d[l]
              ),
              children: s
            }
          ) : null
        ] })
      ]
    }
  );
}
function gn({
  assignees: t,
  onAction: s,
  onClose: n,
  triggerRef: l,
  dismissExemptRef: r,
  label: i = "Assignee",
  className: o,
  ref: a
}) {
  return /* @__PURE__ */ u(
    te,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: l,
      dismissExemptRef: r,
      "aria-label": i,
      ref: a,
      className: f(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: i }) }),
        t.map((c) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => s(c),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ e(vn, { name: c.name, role: c.role, avatarSrc: c.avatarSrc, size: "sm" })
          },
          c.id
        ))
      ]
    }
  );
}
function yn({
  labels: t,
  onAction: s,
  onClose: n,
  triggerRef: l,
  dismissExemptRef: r,
  label: i = "Label",
  className: o,
  ref: a
}) {
  return /* @__PURE__ */ u(
    te,
    {
      isOpen: !0,
      onClose: n,
      ref: a,
      triggerRef: l,
      dismissExemptRef: r,
      "aria-label": i,
      className: f(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: i }) }),
        t.map((c) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => s(c),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ e(j, { accent: c.accent ?? "neutral", children: c.text })
          },
          c.id
        ))
      ]
    }
  );
}
const Cn = {
  title: "Task name",
  estimate: "Estimate",
  assignee: "Assignee",
  label: "Label",
  dueDate: "Due date",
  cancel: "Cancel",
  submit: "Create Task"
};
function ns({
  isOpen: t,
  onClose: s,
  assignees: n = [],
  labels: l = [],
  onSubmit: r,
  defaultTitle: i = "",
  defaultDueDate: o,
  defaultPoints: a,
  defaultAssignee: c,
  defaultLabel: d,
  copy: p,
  formatDueDate: m = (x) => x.toLocaleDateString("en-US"),
  className: v,
  ref: C,
  ...h
}) {
  const x = { ...Cn, ...p }, [b, y] = T.useState(i), [g, N] = T.useState(o), [k, P] = T.useState(a), [V, F] = T.useState(c), [_, B] = T.useState(d), [S, O] = T.useState(null), E = (H) => O((X) => X === H ? null : H), A = (H) => O((X) => X === H ? null : X), Z = T.useRef(null), W = T.useRef(null), $ = T.useRef(null), G = T.useRef(null), w = T.useRef(null), U = () => {
    y(i), N(o), P(a), F(c), B(d), O(null);
  }, [He, Pe] = T.useState(t);
  if (t !== He && (Pe(t), t && U()), !t) return null;
  const Se = (H) => {
    H.preventDefault(), b.trim() && (r == null || r({ title: b.trim(), dueDate: g, points: k, assignee: V, label: _ }), U(), s());
  }, Te = () => {
    U(), s();
  };
  return /* @__PURE__ */ u(
    "form",
    {
      ...h,
      onSubmit: Se,
      ref: C,
      className: f(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        v
      ),
      children: [
        /* @__PURE__ */ e(
          "input",
          {
            autoFocus: !0,
            value: b,
            onChange: (H) => y(H.target.value),
            placeholder: x.title,
            "aria-label": x.title,
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted-on-dark font-sans rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
          }
        ),
        /* @__PURE__ */ u("div", { ref: Z, className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ u("div", { className: "relative", children: [
            k === void 0 ? /* @__PURE__ */ e(
              "button",
              {
                ref: W,
                type: "button",
                onClick: () => E("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "estimate",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(j, { icon: /* @__PURE__ */ e(se, { className: "size-6" }), children: x.estimate })
              }
            ) : /* @__PURE__ */ u(
              "button",
              {
                ref: W,
                type: "button",
                onClick: () => E("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ e(se, { className: "size-6" }) }),
                  k,
                  " Point",
                  k !== 1 ? "s" : ""
                ]
              }
            ),
            S === "estimate" ? /* @__PURE__ */ e(
              xn,
              {
                value: k,
                onAction: (H) => {
                  P(H), O(null);
                },
                dismissExemptRef: Z,
                onClose: () => A("estimate"),
                triggerRef: W,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            V ? /* @__PURE__ */ u(
              "button",
              {
                ref: $,
                type: "button",
                onClick: () => E("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ e(q, { src: V.avatarSrc, name: V.name, size: "sm" }),
                  V.name
                ]
              }
            ) : /* @__PURE__ */ e(
              "button",
              {
                ref: $,
                type: "button",
                onClick: () => E("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "assignee",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(j, { icon: /* @__PURE__ */ e(Vt, { className: "size-6" }), children: x.assignee })
              }
            ),
            S === "assignee" ? /* @__PURE__ */ e(
              gn,
              {
                assignees: n,
                onAction: (H) => {
                  F(H), O(null);
                },
                dismissExemptRef: Z,
                onClose: () => A("assignee"),
                triggerRef: $,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            _ ? /* @__PURE__ */ e(
              "button",
              {
                ref: G,
                type: "button",
                onClick: () => E("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(j, { accent: _.accent ?? "neutral", children: _.text })
              }
            ) : /* @__PURE__ */ e(
              "button",
              {
                ref: G,
                type: "button",
                onClick: () => E("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(j, { icon: /* @__PURE__ */ e(Ht, { className: "size-6" }), children: x.label })
              }
            ),
            S === "label" ? /* @__PURE__ */ e(
              yn,
              {
                labels: l,
                onAction: (H) => {
                  B(H), O(null);
                },
                dismissExemptRef: Z,
                onClose: () => A("label"),
                triggerRef: G,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            /* @__PURE__ */ e(
              "button",
              {
                ref: w,
                type: "button",
                onClick: () => E("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": S === "date",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(j, { icon: /* @__PURE__ */ e(Pt, { className: "size-6" }), children: g ? m(g) : x.dueDate })
              }
            ),
            S === "date" ? /* @__PURE__ */ e(
              mn,
              {
                value: g,
                onChange: (H) => {
                  N(H), O(null);
                },
                dismissExemptRef: Z,
                onClose: () => A("date"),
                triggerRef: w,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ u("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ e(ve, { variant: "secondary", onPress: Te, children: x.cancel }),
          /* @__PURE__ */ e(ve, { variant: "primary", type: "submit", isDisabled: !b.trim(), children: x.submit })
        ] })
      ]
    }
  );
}
function ss({ tone: t = "neutral", children: s, className: n, ref: l, ...r }) {
  return /* @__PURE__ */ e(
    "span",
    {
      ...r,
      ref: l,
      className: f(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans",
        {
          neutral: "bg-surface-neutral text-neutral-4 border-subtle",
          success: "bg-success-1 text-neutral-4 border-success-2",
          warning: "bg-warning-1 text-warning-6 border-warning-2",
          danger: "bg-danger-1 text-danger-6 border-danger-2"
        }[t],
        n
      ),
      children: s
    }
  );
}
const Ve = lt(null);
function ls() {
  const t = st(Ve);
  if (!t)
    throw new Error("useToast must be used within a ToastProvider");
  return t;
}
const Nn = 5e3, wn = {
  neutral: "bg-surface-overlay text-main border border-subtle/10",
  success: "bg-success-4 text-neutral-5",
  warning: "bg-warning-5 text-neutral-5",
  // `bg-danger-4 text-neutral-5`, not the `bg-danger text-main` this was. Danger was the
  // odd one out in this map — the only tone inverting the pattern, a dark fill with white
  // text — and it was the only one that failed: white on `danger-5` is **4.29:1**, under
  // AA. It also never appeared in any audit, because no story renders a toast without a
  // click and the sweep only ever saw static stories.
  //
  // Moving the label to `neutral-5` on the same fill does not help (3.59:1); the fill has
  // to move. `danger-4` (#FF7875) clears **6.01:1** with `neutral-5` and puts danger on
  // the same footing as its neighbours: a saturated fill with dark text.
  danger: "bg-danger-4 text-neutral-5"
};
function kn({
  toast: t,
  state: s,
  closeLabel: n
}) {
  const l = M(null), r = M(null), { toastProps: i, contentProps: o, titleProps: a, closeButtonProps: c } = Qe(
    { toast: t },
    s,
    l
  ), { buttonProps: d } = z(c, r);
  return /* @__PURE__ */ u(
    "div",
    {
      ...i,
      ref: l,
      className: f(
        "pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-sm shadow-elevation",
        "text-body-m font-semibold font-sans",
        wn[t.content.tone]
      ),
      children: [
        /* @__PURE__ */ e("div", { ...o, children: /* @__PURE__ */ e("span", { ...a, children: t.content.message }) }),
        /* @__PURE__ */ e(
          "button",
          {
            ...d,
            ref: r,
            "aria-label": n,
            className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2",
            children: /* @__PURE__ */ e(fe, { className: "size-4" })
          }
        )
      ]
    }
  );
}
function Ln({
  state: t,
  label: s,
  closeLabel: n
}) {
  const l = M(null), { regionProps: r } = Je({ "aria-label": s }, t, l);
  return yt(
    /* @__PURE__ */ e(
      "div",
      {
        ...r,
        ref: l,
        className: "pointer-events-none fixed right-4 bottom-4 z-toast flex flex-col gap-2",
        children: t.visibleToasts.map((i) => /* @__PURE__ */ e(kn, { toast: i, state: t, closeLabel: n }, i.key))
      }
    ),
    document.body
  );
}
function rs({
  children: t,
  duration: s = Nn,
  maxVisibleToasts: n = 4,
  label: l = "Notifications",
  closeLabel: r = "Dismiss"
}) {
  const i = ft({ maxVisibleToasts: n }), o = M(i);
  be(() => {
    o.current = i;
  }, [i]);
  const a = M(s);
  be(() => {
    a.current = s;
  }, [s]);
  const c = ye(
    () => ({
      show: (d, p, m) => o.current.add(
        { tone: d, message: p },
        // `undefined` in `options.timeout` means "not specified, use the default";
        // an explicit `null` means "stay until dismissed", which react-stately
        // expresses as a timeout of 0.
        {
          timeout: (m == null ? void 0 : m.timeout) === null ? 0 : (m == null ? void 0 : m.timeout) ?? a.current
        }
      )
    }),
    []
  );
  return /* @__PURE__ */ u(Ve.Provider, { value: c, children: [
    t,
    i.visibleToasts.length > 0 ? /* @__PURE__ */ e(Ln, { state: i, label: l, closeLabel: r }) : null
  ] });
}
function is({
  children: t,
  isSelected: s,
  defaultSelected: n = !1,
  onChange: l,
  isDisabled: r = !1,
  isIndeterminate: i = !1,
  error: o,
  description: a,
  isRequired: c = !1,
  label: d,
  className: p,
  ref: m
}) {
  const v = mt({
    isSelected: s,
    defaultSelected: n,
    onChange: l
  }), C = D(m), { fieldProps: h, descriptionProps: x, errorMessageProps: b } = ie({
    description: a,
    errorMessage: o,
    isInvalid: !!o
  }), { inputProps: y, labelProps: g } = et(
    {
      isSelected: v.isSelected,
      isIndeterminate: i,
      isDisabled: r,
      isRequired: c,
      isInvalid: !!o,
      "aria-label": d ?? (typeof t == "string" ? t : "Checkbox")
    },
    v,
    C
  ), N = /* @__PURE__ */ u(
    "label",
    {
      ...g,
      className: f(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        // `has-[:focus-visible]:outline-solid` is load-bearing, not decoration. The real
        // checkbox is `sr-only`, so the ring has to be drawn on this label via `:has()` —
        // and under the `has-` variant, `outline-2`'s `outline-style:
        // var(--tw-outline-style)` does not resolve to `solid` the way it does under
        // `focus-visible:`. The width and the colour compute, and nothing paints: this
        // control had **no visible focus indicator at all**, a 2.4.7 failure rather than a
        // contrast one. Verified at the pixel level in a real browser — zero ring pixels
        // before, 1604 after — and `getComputedStyle` was no help, reporting a colour for
        // an outline that was never drawn. Same trap as the `outline-none` bug this kit
        // already paid for once; see `button.tsx`. Do not drop `outline-solid` as redundant.
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-2",
        r && "opacity-50 cursor-not-allowed",
        p
      ),
      children: [
        /* @__PURE__ */ e(
          "input",
          {
            ...y,
            ref: C,
            "aria-describedby": h["aria-describedby"],
            className: "sr-only"
          }
        ),
        /* @__PURE__ */ u(
          "svg",
          {
            className: f("w-6 h-6 shrink-0", o ? "text-danger-text" : "text-main"),
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.5,
            "aria-hidden": !0,
            children: [
              /* @__PURE__ */ e("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }),
              v.isSelected && !i ? /* @__PURE__ */ e(
                "path",
                {
                  d: "M8 12.5 11 15.5 16 9.5",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ) : i ? /* @__PURE__ */ e("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ u("span", { className: "text-body-m font-normal font-sans text-main", children: [
          t,
          c ? /* @__PURE__ */ e(Y, {}) : null
        ] })
      ]
    }
  );
  return !o && !a ? N : /* @__PURE__ */ u("div", { className: "inline-flex flex-col gap-1", children: [
    N,
    /* @__PURE__ */ e("span", { className: "px-4", children: /* @__PURE__ */ e(
      K,
      {
        description: a,
        error: o,
        descriptionProps: x,
        errorMessageProps: b
      }
    ) })
  ] });
}
function os({
  label: t,
  isLabelVisible: s = !1,
  error: n,
  description: l,
  className: r,
  ref: i,
  ...o
}) {
  const a = D(i), { labelProps: c, inputProps: d, descriptionProps: p, errorMessageProps: m } = oe(
    { ...o, label: t, description: l, type: "date", isInvalid: !!n, errorMessage: n },
    a
  );
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-1.5 w-full", children: [
    t ? /* @__PURE__ */ u("label", { ...c, className: Q(s), children: [
      t,
      o.isRequired ? /* @__PURE__ */ e(Y, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(
      "input",
      {
        ...d,
        ref: a,
        type: "date",
        className: f(
          // The design's chip, not a light field — the same correction `Select` took, for the
          // same reason and from the same source. `Add Task Modal00.md:78-140` draws the modal's
          // four pickers as the `Tag` atom on the dark card: `rgba(148, 151, 154, 0.1)` (neutral-2
          // at 10%), 32px tall, 4px/16px padding, and a 24×24 `/* Vector */` glyph filled
          // `#FFFFFF`. `Datepicker.md` carries no white surface at all — its only four `#FFFFFF`
          // blocks are `/* Vector */` glyphs, and its surfaces are `#222528` and `#2C2F33`.
          //
          // **`[color-scheme:dark]` is load-bearing and is not a browser workaround.** This is a
          // native `<input type="date">`, so the calendar-picker glyph is drawn by the user agent,
          // not by this file, and the UA picks its colour from `color-scheme`. Measured in Chrome
          // on the app shell: on this chip with `color-scheme` unset the glyph renders near-black
          // and is effectively invisible; with `color-scheme: dark` it renders white. White-on-dark
          // is what the export above specifies, so this property is how a native control is made to
          // draw the design rather than a trick to rescue a recolour.
          //
          // Nothing in this repo could have caught the invisible-glyph state: the glyph is UA-drawn
          // and has no token, so `contrast.test.ts` cannot measure it even in principle. The white
          // field surface was the only reason it was legible before.
          // `self-start` sizes the chip to its content instead of letting it stretch. The wrapper
          // is `flex flex-col w-full`, so without it a flex item fills the column — measured at
          // **1390px** on the story, against `Select`'s content-sized **151px** for the same chip
          // classes. A 32px-tall band spanning the form is neither the old white field nor the
          // design's chip. An explicit width still wins, so a caller passing one is unaffected.
          //
          // **Content-sized is a deliberate deviation from the export's literal `width: 128px`,
          // not an omission — do not "correct" it to `w-32`.** That value was transcribed from
          // Figma, where the font was present; this kit ships none of `--font-sans`'s three
          // families, so on a Linux runner the same string renders wider and a fixed box clips
          // it. That is #20, and it has already cost this repo once: `EstimateModal`'s header
          // measured 86.5px on macOS and 105.5px on CI against an 88px box. A date value is
          // locale-formatted on top of that — `dd/mm/yyyy` and `mm/dd/yyyy` differ, and a
          // long-form locale differs more. Sizing to content is what makes the box follow the
          // text instead of the text overflowing the box.
          "self-start inline-flex items-center h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold text-main [color-scheme:dark] font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          // A `ring`, not a `border`, and `danger-text` rather than `danger-5` — both for the
          // reasons `select.tsx` sets out at length. `danger-5`'s invalid border survived 1.4.11
          // only on the strength of the white interior it separated from the container; this
          // control no longer has one, and `danger-5` measures 2.55:1 on `surface-overlay`.
          n && "ring-1 ring-danger-text focus-visible:outline-danger-text",
          r
        )
      }
    ),
    /* @__PURE__ */ e(
      K,
      {
        description: l,
        error: n,
        descriptionProps: p,
        errorMessageProps: m
      }
    )
  ] });
}
function Mn({
  icon: t,
  label: s,
  isActive: n = !1,
  badgeCount: l,
  onPress: r,
  className: i,
  ref: o,
  ...a
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      ...a,
      type: "button",
      onClick: r,
      ref: o,
      "aria-current": n ? "page" : void 0,
      className: f(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
        // `-text`, not the bare `text-interactive`, on both the active and the hover
        // label: an item's label is text, and primary-4 as text clears 4.5:1 nowhere
        // (2.86 / 3.51 / 4.02). The sidebar is `surface-panel`, so the active item was
        // 3.51:1. `primary-2` measures 6.67:1 there, and 6.02:1 at the far end of the
        // gradient where the label sits on a 10% primary-4 wash — both clear. The wash
        // itself is unchanged: it is decoration, not a boundary, and the label carries
        // the state.
        n ? "text-interactive-text bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive-text",
        i
      ),
      children: [
        t ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: t }) : null,
        /* @__PURE__ */ e("span", { className: "flex-1 truncate", children: s }),
        l !== void 0 ? /* @__PURE__ */ e(
          "span",
          {
            className: f(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              // The active badge was `bg-primary-4 text-main` — white on the brand red at
              // **3.83:1**, the same failing pairing as the primary CTA but on text the
              // CTA's documented exemption does not cover. axe files it under `incomplete`
              // rather than `violations` (messageKey `shortTextContent`: a two-digit count
              // might be decorative), which is why a violations-only sweep never saw it.
              //
              // Unlike the CTA there is nothing to preserve: `badgeCount` has no
              // ground-truth basis at all — no export shows a count on this component, as
              // the doc comment above says — so it is an opt-in addition rather than
              // something Figma draws. And no label colour rescues `primary-4`; the fill had
              // to move. `interactive-text` with `neutral-5` clears **7.63:1** and keeps the
              // badge in the same accent family as the active label beside it.
              n ? "bg-interactive-text text-neutral-5" : "bg-neutral-3 text-main"
            ),
            children: l
          }
        ) : null,
        /* @__PURE__ */ e(
          "span",
          {
            className: f(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              n ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function Vn({
  logo: t,
  items: s,
  label: n = "Main navigation",
  className: l,
  ref: r,
  ...i
}) {
  return /* @__PURE__ */ u(
    "nav",
    {
      ...i,
      ref: r,
      "aria-label": n,
      className: f(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        l
      ),
      children: [
        t ? /* @__PURE__ */ e("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: t }) : null,
        /* @__PURE__ */ e("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: s.map((o, a) => /* @__PURE__ */ e(Mn, { ...o }, a)) })
      ]
    }
  );
}
function as({
  value: t,
  onChange: s,
  leftIcon: n,
  rightIcon: l,
  leftLabel: r,
  rightLabel: i,
  label: o = "View",
  className: a,
  ref: c,
  ...d
}) {
  const p = M(null), m = M(null), v = (h) => {
    var x;
    s == null || s(h), (x = (h === "left" ? p : m).current) == null || x.focus();
  }, C = (h) => {
    let x;
    switch (h.key) {
      // With exactly two options, "next" and "previous" are the same move — both wrap, the
      // same way SegmentedControl's modular arithmetic does at length 2.
      case "ArrowRight":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowUp":
        x = t === "left" ? "right" : "left";
        break;
      case "Home":
        x = "left";
        break;
      case "End":
        x = "right";
        break;
      default:
        return;
    }
    h.preventDefault(), v(x);
  };
  return /* @__PURE__ */ u(
    "div",
    {
      ...d,
      ref: c,
      role: "radiogroup",
      "aria-label": o,
      className: f("flex items-center w-20 h-10 bg-surface-shell rounded-sm", a),
      children: [
        /* @__PURE__ */ e(
          xe,
          {
            ref: p,
            variant: "secondary",
            role: "radio",
            "aria-checked": t === "left",
            excludeFromTabOrder: t !== "left",
            isSelected: t === "left",
            "aria-label": r,
            onKeyDown: C,
            onPress: () => v("left"),
            children: n
          }
        ),
        /* @__PURE__ */ e(
          xe,
          {
            ref: m,
            variant: "secondary",
            role: "radio",
            "aria-checked": t === "right",
            excludeFromTabOrder: t !== "right",
            isSelected: t === "right",
            "aria-label": i,
            onKeyDown: C,
            onPress: () => v("right"),
            children: l
          }
        )
      ]
    }
  );
}
function cs({
  logo: t,
  sidebarItems: s,
  sidebar: n,
  topNavProps: l,
  topNav: r,
  topBar: i,
  children: o,
  className: a,
  ref: c,
  ...d
}) {
  const p = n !== void 0 ? n : s ? /* @__PURE__ */ e(Vn, { logo: t, items: s, className: "self-stretch" }) : null, m = r !== void 0 ? r : /* @__PURE__ */ e(At, { ...l });
  return /* @__PURE__ */ u(
    "div",
    {
      ...d,
      ref: c,
      className: f("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", a),
      children: [
        p,
        /* @__PURE__ */ u("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
          m,
          /* @__PURE__ */ u("div", { className: "flex flex-col gap-4", children: [
            i ? /* @__PURE__ */ e("div", { className: "flex items-start justify-between gap-6", children: i }) : null,
            o
          ] })
        ] })
      ]
    }
  );
}
export {
  ns as AddTaskModal,
  Lt as AlarmIcon,
  cs as AppShell,
  Vn as ApplicationSidebar,
  Vt as AssigneeIcon,
  gn as AssigneeModal,
  qt as AssigneeNameCell,
  An as AttachmentIcon,
  q as Avatar,
  ss as Badge,
  he as BellIcon,
  xe as Button,
  Pt as CalendarIcon,
  ee as Card,
  zt as CardBody,
  Ut as CardFooter,
  _t as CardHeader,
  Tt as ChevronDoubleLeftIcon,
  Dt as ChevronDoubleRightIcon,
  de as ChevronDownIcon,
  St as ChevronLeftIcon,
  Ne as ChevronRightIcon,
  fe as CloseIcon,
  jn as CommentIcon,
  an as DEFAULT_COLUMNS,
  Nt as DUE_DATE_URGENCY_COLOR,
  wt as DUE_DATE_URGENCY_LABEL,
  mn as DatePickerMenu,
  os as Datepicker,
  Yt as DueDateCell,
  ke as EmptyState,
  xn as EstimateModal,
  Xt as EstimationCell,
  Bt as FIELD_DESCRIPTION_CLASS,
  Ot as FIELD_ERROR_CLASS,
  It as FIELD_LABEL_CLASS,
  Rt as FIELD_LABEL_HIDDEN_CLASS,
  K as FieldMessages,
  pe as FloatingPopover,
  Wn as FormField,
  Fn as GridViewIcon,
  $n as Input,
  is as LabelCheckbox,
  Ht as LabelIcon,
  yn as LabelModal,
  Me as ListBox,
  _n as ListViewIcon,
  Un as LogoMark,
  Qn as Menu,
  En as MenuDotsIcon,
  es as Modal,
  Jn as MultiSelect,
  zn as PlusIcon,
  se as PointsIcon,
  te as Popover,
  le as ProjectInfo,
  Y as RequiredIndicator,
  Et as SearchBar,
  Mt as SearchIcon,
  Gn as SegmentedControl,
  Xn as Select,
  Mn as SidebarItem,
  I as Skeleton,
  Zn as SubtaskIcon,
  kt as TASK_STATUS_INDICATOR_COLOR,
  Kn as Tabs,
  j as Tag,
  Jt as TagCell,
  $t as TaskCard,
  Yn as TaskListView,
  Wt as TaskMetaBadges,
  qn as TaskTable,
  en as TaskTableRow,
  ve as TextButton,
  rs as ToastProvider,
  At as TopNav,
  vn as UserRow,
  as as ViewSwitcher,
  f as cn,
  Q as fieldLabelClass,
  Ce as formatPointsLong,
  Ct as formatPointsShort,
  Le as resolveColumns,
  On as statusToIndicatorColor,
  ts as useModalState,
  ls as useToast
};
