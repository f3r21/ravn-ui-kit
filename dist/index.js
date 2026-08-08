import { clsx as Le } from "clsx";
import { twMerge as Me } from "tailwind-merge";
import { jsx as e, jsxs as c, Fragment as me } from "react/jsx-runtime";
import H, { useRef as y, useState as pe, useMemo as be, useId as Ve, Fragment as He, useEffect as oe, useContext as Se, createContext as Te } from "react";
import { useButton as Z, useField as ee, useTextField as te, useTabList as De, useTab as Ie, useTabPanel as Re, useOverlay as je, FocusScope as ne, DismissButton as U, usePopover as Be, Overlay as Ze, useListBox as Ee, useOption as Oe, useSelect as Ae, HiddenSelect as Fe, useMenuTrigger as _e, useMenu as ze, useMenuItem as Ue, useModalOverlay as We, useDialog as $e, useCalendar as Ke, useCalendarGrid as Ge, useCalendarCell as qe, useToastRegion as Ye, useToast as Xe, useCheckbox as Je } from "react-aria";
import { useTabListState as Qe, Item as et, useSelectState as tt, useOverlayTriggerState as le, useListState as nt, useMenuTriggerState as lt, useTreeState as st, useCalendarState as rt, useToastState as it, useToggleState as at } from "react-stately";
import { createCalendar as ot, getLocalTimeZone as ct, toCalendarDate as ut, fromDate as dt, today as ft, isSameMonth as mt } from "@internationalized/date";
import { createPortal as pt } from "react-dom";
function f(...t) {
  return Me(Le(t));
}
const bt = (t) => `${t} ${t === 1 ? "Pt" : "Pts"}`, he = (t) => `${t} ${t === 1 ? "Point" : "Points"}`, ht = {
  normal: "neutral",
  soon: "yellow",
  overdue: "red"
}, xt = {
  normal: "",
  soon: "due soon",
  overdue: "overdue"
};
function w({ children: t, ...n }) {
  const l = n["aria-label"] != null || n["aria-labelledby"] != null;
  return /* @__PURE__ */ e(
    "svg",
    {
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...l ? { role: "img" } : { "aria-hidden": !0 },
      ...n,
      children: t
    }
  );
}
function vn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 18 4", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z",
      fill: "currentColor"
    }
  ) });
}
function vt(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20.506 19.253", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z",
      fill: "currentColor"
    }
  ) });
}
function gn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 11.7382 12.6733", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z",
      fill: "currentColor"
    }
  ) });
}
function yn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 12 13.3333", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z",
      fill: "currentColor"
    }
  ) });
}
function Nn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 13.3333 13.3333", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z",
      fill: "currentColor"
    }
  ) });
}
function Cn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 18 18", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z",
      fill: "currentColor"
    }
  ) });
}
function wn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 18 16", ...t, children: /* @__PURE__ */ e("path", { d: "M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z", fill: "currentColor" }) });
}
function kn(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 14 14", ...t, children: /* @__PURE__ */ e("path", { d: "M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z", fill: "currentColor" }) });
}
function gt(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20.314 20.314", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z",
      fill: "currentColor"
    }
  ) });
}
function ce(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20 21", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z",
      fill: "currentColor"
    }
  ) });
}
function J(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20 18", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0V0ZM7 8V6H5V8H3V10H5V12H7V10H9V8H7ZM11 8V10H17V8H11Z",
      fill: "currentColor"
    }
  ) });
}
function yt(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 16 21", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z",
      fill: "currentColor"
    }
  ) });
}
function Nt(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20.7988 20.7998", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z",
      fill: "currentColor"
    }
  ) });
}
function Ct(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 20 20", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z",
      fill: "currentColor"
    }
  ) });
}
function Pn(t) {
  return /* @__PURE__ */ c(w, { viewBox: "0 0 40 40", ...t, children: [
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
function wt(t) {
  return /* @__PURE__ */ e(
    w,
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
function xe(t) {
  return /* @__PURE__ */ e(
    w,
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
function se(t) {
  return /* @__PURE__ */ e(
    w,
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
function kt(t) {
  return /* @__PURE__ */ e(
    w,
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
function Pt(t) {
  return /* @__PURE__ */ e(
    w,
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
function re(t) {
  return /* @__PURE__ */ e(w, { viewBox: "0 0 14 14", ...t, children: /* @__PURE__ */ e(
    "path",
    {
      d: "M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z",
      fill: "currentColor"
    }
  ) });
}
function ue({
  variant: t = "secondary",
  isSelected: n = !1,
  children: l,
  className: s,
  isDisabled: a,
  role: i,
  "aria-checked": o,
  ...r
}) {
  const u = y(null), { buttonProps: d } = Z({ ...r, isDisabled: a }, u);
  return /* @__PURE__ */ e(
    "button",
    {
      ...d,
      role: i,
      "aria-checked": o,
      ref: u,
      className: f(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: n ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[t],
        s
      ),
      children: /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0 flex items-center justify-center", children: l })
    }
  );
}
function de({
  variant: t = "primary",
  isSelected: n = !1,
  className: l,
  isDisabled: s,
  ...a
}) {
  const i = y(null), { buttonProps: o } = Z({ ...a, isDisabled: s }, i), r = {
    primary: f(
      "text-main",
      s ? "bg-primary-2" : n ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: s ? "bg-transparent text-muted" : n ? "bg-neutral-3 text-main" : (
      // `hover:text-neutral-5` alongside the hover fill: white on a solid `neutral-2`
      // is 2.94:1, so the label has to move with the background. Invisible to a
      // static-story axe pass, which is why it went unrecorded.
      "bg-transparent text-main hover:bg-neutral-2 hover:text-neutral-5"
    )
  };
  return /* @__PURE__ */ e(
    "button",
    {
      ...o,
      ref: i,
      className: f(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:pointer-events-none",
        r[t],
        l
      ),
      children: a.children
    }
  );
}
function F() {
  return /* @__PURE__ */ e("span", { "aria-hidden": "true", className: "text-danger-text ml-0.5", children: "*" });
}
const Lt = "text-body-m font-semibold text-main font-sans", Mt = "sr-only";
function W(t) {
  return t ? Lt : Mt;
}
const Vt = "text-xs text-muted-on-dark font-sans", Ht = "text-xs text-danger-text font-sans";
function E({
  description: t,
  error: n,
  descriptionProps: l,
  errorMessageProps: s
}) {
  return n ? /* @__PURE__ */ e("span", { ...s, className: Ht, children: n }) : t ? /* @__PURE__ */ e("span", { ...l, className: Vt, children: t }) : null;
}
function Ln({
  label: t,
  isLabelVisible: n = !1,
  description: l,
  error: s,
  isRequired: a = !1,
  children: i,
  className: o,
  ...r
}) {
  const { labelProps: u, fieldProps: d, descriptionProps: b, errorMessageProps: m } = ee({
    ...r,
    label: t,
    description: l,
    errorMessage: s,
    isInvalid: !!s
  });
  return /* @__PURE__ */ c("div", { className: f("flex flex-col gap-1.5", o), children: [
    t ? /* @__PURE__ */ c("label", { ...u, className: W(n), children: [
      t,
      a ? /* @__PURE__ */ e(F, {}) : null
    ] }) : null,
    i({
      ...d,
      ...a ? { "aria-required": !0 } : {},
      ...s ? { "aria-invalid": !0 } : {}
    }),
    /* @__PURE__ */ e(
      E,
      {
        description: l,
        error: s,
        descriptionProps: b,
        errorMessageProps: m
      }
    )
  ] });
}
function Mn({
  label: t,
  isLabelVisible: n = !1,
  error: l,
  description: s,
  className: a,
  ...i
}) {
  const o = y(null), { labelProps: r, inputProps: u, descriptionProps: d, errorMessageProps: b } = te(
    { ...i, label: t, description: s, isInvalid: !!l, errorMessage: l },
    o
  );
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-1.5 w-full", children: [
    t ? /* @__PURE__ */ c("label", { ...r, className: W(n), children: [
      t,
      i.isRequired ? /* @__PURE__ */ e(F, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(
      "input",
      {
        ...u,
        ref: o,
        className: f(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted-on-light transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          l && "border-danger-5 focus-visible:outline-danger-text",
          a
        )
      }
    ),
    /* @__PURE__ */ e(
      E,
      {
        description: s,
        error: l,
        descriptionProps: d,
        errorMessageProps: b
      }
    )
  ] });
}
function St({
  placeholder: t = "Search...",
  value: n,
  onChange: l,
  onSubmit: s,
  label: a = "Search",
  id: i,
  className: o
}) {
  const [r, u] = pe(""), d = n !== void 0, b = d ? n : r, m = y(null), { inputProps: p } = te(
    {
      value: b,
      onChange: (x) => {
        d || u(x), l == null || l(x);
      },
      onKeyDown: (x) => {
        x.key === "Enter" && (s == null || s(b));
      },
      "aria-label": a,
      id: i,
      // Makes the element a `searchbox` rather than a `textbox`, which is what a screen
      // reader announces and what a consumer's `getByRole('searchbox')` finds. It also
      // opts the field into the platform's search affordances — including WebKit's native
      // clear button, suppressed below because `TopNav` renders its own.
      type: "search",
      placeholder: t
    },
    m
  );
  return /* @__PURE__ */ c("div", { className: f("inline-flex items-center gap-6 min-w-0", o), children: [
    /* @__PURE__ */ e(gt, { className: "w-6 h-6 text-muted shrink-0" }),
    /* @__PURE__ */ e(
      "input",
      {
        ...p,
        ref: m,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted-on-dark font-sans min-w-0 rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
      }
    )
  ] });
}
function _({
  src: t,
  name: n,
  fallbackLabel: l = "Unassigned",
  size: s = "md",
  className: a
}) {
  const i = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold"
  }, o = (u) => {
    if (!u) return "?";
    const d = u.trim().split(" ");
    return d.length >= 2 ? `${d[0][0]}${d[1][0]}`.toUpperCase() : d[0].substring(0, 2).toUpperCase();
  }, r = n || l;
  return /* @__PURE__ */ e(
    "div",
    {
      role: "img",
      "aria-label": r,
      title: r,
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
        i[s],
        a
      ),
      children: t ? (
        // `alt=""`, deliberately. The wrapper above already carries the name; an `alt` here
        // would have the avatar announced twice, and as "image, Alice" rather than "Alice".
        /* @__PURE__ */ e("img", { src: t, alt: "", className: "w-full h-full object-cover" })
      ) : /* @__PURE__ */ e("span", { children: o(n) })
    }
  );
}
function Tt({
  searchValue: t,
  searchPlaceholder: n,
  onSearchChange: l,
  onSearchSubmit: s,
  searchLabel: a,
  clearSearchLabel: i = "Clear search",
  icon: o,
  onNotificationsClick: r,
  notificationsLabel: u = "Notifications",
  userName: d,
  userAvatar: b,
  userSlot: m,
  actions: p,
  className: x
}) {
  const [h, v] = pe(""), g = t !== void 0, N = g ? t : h, C = (T) => {
    g || v(T), l == null || l(T);
  }, P = () => {
    g || v(""), l == null || l("");
  };
  return /* @__PURE__ */ c(
    "header",
    {
      className: f(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        x
      ),
      children: [
        /* @__PURE__ */ e(
          St,
          {
            placeholder: n,
            value: N,
            onChange: C,
            onSubmit: s,
            label: a,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-6 shrink-0", children: [
          N ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: P,
              "aria-label": i,
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ e(re, {})
            }
          ) : null,
          r ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: r,
              "aria-label": u,
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: o ?? /* @__PURE__ */ e(ce, {})
            }
          ) : /* @__PURE__ */ e("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: o ?? /* @__PURE__ */ e(ce, {}) }),
          p,
          m ?? (d || b ? /* @__PURE__ */ e(_, { src: b, name: d, size: "md" }) : null)
        ] })
      ]
    }
  );
}
function Vn({
  items: t,
  panels: n,
  defaultSelectedKey: l,
  selectedKey: s,
  onSelectionChange: a,
  label: i = "Tab navigation",
  className: o
}) {
  var m;
  const r = be(() => new Map(t.map((p) => [p.id, p])), [t]), u = Qe({
    items: t,
    selectedKey: s,
    defaultSelectedKey: l ?? ((m = t[0]) == null ? void 0 : m.id),
    onSelectionChange: (p) => a == null ? void 0 : a(String(p)),
    children: (p) => /* @__PURE__ */ e(et, { textValue: p.label, children: p.label }, p.id)
  }), d = y(null), { tabListProps: b } = De({ "aria-label": i }, u, d);
  return /* @__PURE__ */ c("div", { className: f("flex flex-col", o), children: [
    /* @__PURE__ */ e("div", { ...b, ref: d, className: "flex items-end", children: [...u.collection].map((p) => {
      var x;
      return /* @__PURE__ */ e(
        Dt,
        {
          item: p,
          state: u,
          icon: (x = r.get(String(p.key))) == null ? void 0 : x.icon
        },
        p.key
      );
    }) }),
    n ? /* @__PURE__ */ e(It, { state: u, panels: n }) : null
  ] });
}
function Dt({ item: t, state: n, icon: l }) {
  const s = y(null), { tabProps: a, isSelected: i } = Ie({ key: t.key }, n, s);
  return /* @__PURE__ */ c(
    "button",
    {
      ...a,
      ref: s,
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
        l ? /* @__PURE__ */ e("span", { className: "text-base leading-none", children: l }) : null,
        t.rendered ?? t.textValue,
        i ? /* @__PURE__ */ e("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
      ]
    }
  );
}
function It({ state: t, panels: n }) {
  const l = y(null), { tabPanelProps: s } = Re({}, t, l), a = t.selectedKey != null ? String(t.selectedKey) : "";
  return /* @__PURE__ */ e("div", { ...s, ref: l, className: "flex-1", children: n[a] ?? null });
}
function Hn({
  options: t,
  value: n,
  defaultValue: l,
  onChange: s,
  label: a = "View",
  className: i
}) {
  var x;
  const [o, r] = H.useState(l ?? ((x = t[0]) == null ? void 0 : x.id) ?? ""), u = n !== void 0, d = u ? n : o, b = y([]), m = (h) => {
    u || r(h), s == null || s(h);
  }, p = (h) => {
    var C;
    const v = t.findIndex((P) => P.id === d);
    if (v === -1) return;
    let g = null;
    switch (h.key) {
      case "ArrowRight":
      case "ArrowDown":
        g = (v + 1) % t.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        g = (v - 1 + t.length) % t.length;
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
    h.preventDefault();
    const N = t[g];
    m(N.id), (C = b.current[g]) == null || C.focus();
  };
  return /* @__PURE__ */ e(
    "div",
    {
      role: "radiogroup",
      "aria-label": a,
      className: f("inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10", i),
      children: t.map((h, v) => {
        const g = d === h.id;
        return /* @__PURE__ */ c(
          "button",
          {
            ref: (N) => {
              b.current[v] = N;
            },
            type: "button",
            role: "radio",
            "aria-checked": g,
            tabIndex: g ? 0 : -1,
            onClick: () => m(h.id),
            onKeyDown: p,
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
              h.icon ? /* @__PURE__ */ e("span", { className: "text-base leading-none", children: h.icon }) : null,
              h.label
            ]
          },
          h.id
        );
      })
    }
  );
}
function Sn({ children: t, className: n, ...l }) {
  return /* @__PURE__ */ e(
    "div",
    {
      ...l,
      className: f(
        "p-5 bg-surface-neutral border border-subtle rounded-lg shadow-xs transition-shadow hover:shadow-sm",
        n
      ),
      children: t
    }
  );
}
function B({
  variant: t = "neutral",
  outline: n = !1,
  icon: l,
  children: s,
  onRemove: a,
  removeLabel: i = "Remove tag",
  className: o
}) {
  const r = {
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
  return /* @__PURE__ */ c(
    "span",
    {
      className: f(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        n ? r[t].outline : r[t].solid,
        o
      ),
      children: [
        l ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: l }) : null,
        s,
        a ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: a,
            "aria-label": i,
            className: "hover:bg-neutral-5/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
            children: "×"
          }
        ) : null
      ]
    }
  );
}
function Q({
  title: t,
  icon: n,
  onTitleClick: l,
  headingLevel: s = 3,
  titleId: a,
  className: i
}) {
  const o = `h${s}`;
  return /* @__PURE__ */ c("div", { className: f("flex items-center gap-2 w-full", i), children: [
    /* @__PURE__ */ e(
      o,
      {
        id: a,
        className: f(
          "flex-1 min-w-0 text-body-l font-semibold text-main font-sans",
          !l && "truncate"
        ),
        children: l ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: (r) => {
              r.stopPropagation(), l();
            },
            className: "inline-block max-w-full truncate align-bottom text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
            children: t
          }
        ) : t
      }
    ),
    n ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: n }) : null
  ] });
}
function Rt({ badges: t, className: n }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ e("div", { className: f("flex flex-wrap items-center gap-4", n), children: t.map((l, s) => /* @__PURE__ */ c(
      "span",
      {
        "aria-hidden": l.decorative || void 0,
        className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
        children: [
          l.decorative ? null : /* @__PURE__ */ e("span", { className: "sr-only", children: l.label }),
          l.count !== void 0 ? /* @__PURE__ */ e("span", { className: "tabular-nums", "aria-hidden": !0, children: l.count }) : null,
          /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: l.icon })
        ]
      },
      l.decorative ? `decorative-${s}` : l.label
    )) })
  );
}
function ve({ urgency: t, labels: n }) {
  const l = (n == null ? void 0 : n[t]) ?? xt[t];
  return l ? /* @__PURE__ */ c("span", { className: "sr-only", children: [
    ", ",
    l
  ] }) : null;
}
function jt({
  title: t,
  points: n,
  formatPoints: l = bt,
  dueDateText: s,
  dueDateUrgency: a = "normal",
  dueDateUrgencyLabel: i,
  tags: o = [],
  assigneeName: r,
  assigneeAvatar: u,
  metaBadges: d = [],
  actions: b,
  icon: m,
  headingLevel: p = 3,
  titleId: x,
  className: h,
  onClick: v
}) {
  const g = Ve(), N = x ?? g;
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    /* @__PURE__ */ c(
      "article",
      {
        "aria-labelledby": N,
        onClick: v,
        className: f(
          // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
          // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
          // No border is ever rendered on the card in the export, so the resting border is transparent
          // (kept as a real border utility, not removed, so the hover reveal below still works).
          //
          // No `focus-visible:outline-*` here any more: the card is not focusable, so those
          // utilities could never match. The ring lives on the title button that replaced them.
          "flex flex-col gap-4 p-4 bg-surface-panel text-main rounded-sm border border-transparent shadow-xs hover:border-subtle transition-all select-none",
          v && "cursor-pointer",
          h
        ),
        children: [
          b ? /* @__PURE__ */ c("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ e(
              Q,
              {
                title: t,
                icon: m,
                onTitleClick: v,
                headingLevel: p,
                titleId: N,
                className: "flex-1 min-w-0"
              }
            ),
            /* @__PURE__ */ e("div", { className: "shrink-0", onClick: (C) => C.stopPropagation(), children: b })
          ] }) : /* @__PURE__ */ e(
            Q,
            {
              title: t,
              icon: m,
              onTitleClick: v,
              headingLevel: p,
              titleId: N
            }
          ),
          n !== void 0 || s ? /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-2", children: [
            n !== void 0 ? (
              // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
              // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
              /* @__PURE__ */ e("span", { className: "text-body-m font-semibold text-main font-sans", children: l(n) })
            ) : null,
            s ? (
              // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
              // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
              // of a bespoke span gets typography/spacing/color right for free.
              /* @__PURE__ */ c(
                B,
                {
                  variant: ht[a],
                  icon: /* @__PURE__ */ e(vt, { className: "size-6" }),
                  children: [
                    s,
                    /* @__PURE__ */ e(ve, { urgency: a, labels: i })
                  ]
                }
              )
            ) : null
          ] }) : null,
          o.length > 0 ? /* @__PURE__ */ e("div", { className: "flex flex-wrap items-center gap-2", children: o.map((C, P) => (
            // `uppercase` as a class, never `t.label.toUpperCase()` (#102). A screen reader
            // spells out a string that is literally capitalised and reads a CSS-uppercased one
            // normally, so transforming the string would trade an accessibility property for a
            // visual one. `t.className` is merged last, and `cn()` is `twMerge`, so
            // `normal-case` from a consumer wins.
            /* @__PURE__ */ e(
              B,
              {
                variant: C.variant || "neutral",
                className: f("uppercase", C.className),
                children: C.label
              },
              P
            )
          )) }) : null,
          /* @__PURE__ */ c("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ e(_, { src: u, name: r, size: "sm" }),
              r ? /* @__PURE__ */ e("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: r }) : null
            ] }),
            d.length > 0 ? /* @__PURE__ */ e(Rt, { badges: d }) : null
          ] })
        ]
      }
    )
  );
}
function I({ className: t }) {
  return /* @__PURE__ */ e(
    "div",
    {
      "aria-hidden": !0,
      className: f("motion-safe:animate-pulse rounded-sm bg-neutral-3", t)
    }
  );
}
function ge({
  title: t,
  description: n,
  icon: l,
  action: s,
  label: a = "No results",
  className: i
}) {
  return /* @__PURE__ */ c(
    "div",
    {
      role: "group",
      "aria-label": a,
      className: f(
        "flex flex-col items-center gap-2 rounded-sm border border-dashed border-subtle/20",
        "px-6 py-10 text-center font-sans",
        i
      ),
      children: [
        l ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-12 h-12 shrink-0 text-muted [&>svg]:w-full [&>svg]:h-full", children: l }) : null,
        /* @__PURE__ */ e("p", { className: "text-body-m font-semibold text-main", children: t }),
        n ? /* @__PURE__ */ e("p", { className: "text-body-m text-muted-on-dark", children: n }) : null,
        s
      ]
    }
  );
}
function X() {
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ e(I, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e(I, { className: "h-6 w-16" }),
      /* @__PURE__ */ e(I, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ e("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e(I, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ e(I, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function Tn({
  title: t,
  icon: n,
  tasks: l,
  isLoading: s = !1,
  emptyTitle: a = "No tasks in this view",
  emptyDescription: i,
  emptyAction: o,
  empty: r,
  headingLevel: u = 3,
  label: d,
  className: b
}) {
  return /* @__PURE__ */ c(d ? "section" : "div", { "aria-label": d, className: f("flex flex-col gap-4 w-full", b), children: [
    /* @__PURE__ */ e(Q, { title: t, icon: n, headingLevel: u }),
    s ? /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ e(X, {}),
      /* @__PURE__ */ e(X, {}),
      /* @__PURE__ */ e(X, {})
    ] }) : l.length === 0 ? r ?? /* @__PURE__ */ e(ge, { title: a, description: i, action: o }) : l.map((p, x) => /* @__PURE__ */ e(jt, { ...p, className: "w-full" }, x))
  ] });
}
const S = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, Bt = ({ className: t }) => /* @__PURE__ */ e(
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
), j = "text-body-m font-normal text-main font-sans", R = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function Zt({ date: t, urgency: n = "normal", urgencyLabel: l }) {
  return /* @__PURE__ */ c("span", { className: f(j, {
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
  }[n]), children: [
    t,
    /* @__PURE__ */ e(ve, { urgency: n, labels: l })
  ] });
}
function Et({ name: t, avatarSrc: n }) {
  return /* @__PURE__ */ c("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ e(_, { src: n, name: t, size: "sm" }),
    /* @__PURE__ */ e("span", { className: f(j, "truncate"), children: t })
  ] });
}
function Ot({ points: t, formatPoints: n = he }) {
  return /* @__PURE__ */ e("span", { className: f(j, "tabular-nums"), children: n(t) });
}
function At({ labels: t }) {
  return /* @__PURE__ */ e("div", { className: "flex flex-wrap items-center gap-2", children: t.map((n, l) => (
    // Same class, same reason, same override as `TaskCard` — see `TaskTag.className`.
    /* @__PURE__ */ e(B, { variant: n.variant ?? "neutral", className: f("uppercase", n.className), children: n.label }, l)
  )) });
}
const Ft = {
  neutral: "bg-neutral-2",
  red: "bg-primary-4",
  green: "bg-secondary-4",
  yellow: "bg-tertiary-4",
  blue: "bg-blue"
};
function _t({
  index: t,
  title: n,
  indicatorColor: l = "green",
  reactions: s = [],
  isSelected: a = !1,
  onSelectedChange: i,
  isSelectable: o = !0,
  selectLabel: r,
  headingLevel: u,
  tags: d = [],
  estimationPoints: b,
  formatPoints: m,
  assigneeName: p,
  assigneeAvatar: x,
  dueDate: h,
  dueDateUrgency: v = "normal",
  dueDateUrgencyLabel: g,
  actions: N,
  onClick: C,
  onViewDetails: P
}) {
  const T = (L) => L.stopPropagation(), k = u ? `h${u}` : null, D = k ? "inline-block max-w-full align-bottom" : "flex-1 min-w-0", V = C ? /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      onClick: (L) => {
        T(L), C();
      },
      className: f(
        j,
        D,
        "truncate text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1"
      ),
      children: n
    }
  ) : /* @__PURE__ */ e("span", { className: f(j, D, "truncate"), children: n });
  return (
    // The row-wide handler is a pointer convenience only. A `<tr>` cannot be the control
    // itself — giving it `role="button"` would strip its `row` role and break the table it
    // has to live in — so the keyboard and screen-reader affordance is the title button in
    // the Task Name cell below, exactly as `TaskCard` now does it. Before that button
    // existed this handler was the only way to open a task from the table, and it was
    // unreachable without a pointer: no `role`, no `tabIndex`, no `onKeyDown`.
    /* @__PURE__ */ c("tr", { onClick: C, className: f("group", C && "cursor-pointer"), children: [
      /* @__PURE__ */ e("td", { className: f(R, "pl-0 pr-4 border-l"), style: { width: S.name }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
        /* @__PURE__ */ e("span", { className: f("w-1 h-full shrink-0", Ft[l]) }),
        o ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          /* @__PURE__ */ c(
            "label",
            {
              onClick: T,
              className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-interactive-text has-[:focus-visible]:outline-offset-1",
              children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "checkbox",
                    className: "sr-only",
                    checked: a,
                    onChange: (L) => i == null ? void 0 : i(L.target.checked),
                    "aria-label": r ?? `Select ${n}`
                  }
                ),
                /* @__PURE__ */ e(
                  Bt,
                  {
                    className: f(
                      "w-6 h-6 text-main transition-opacity",
                      a ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    )
                  }
                )
              ]
            }
          )
        ) : null,
        /* @__PURE__ */ e("span", { className: f(j, "shrink-0 tabular-nums"), children: String(t).padStart(2, "0") }),
        k ? /* @__PURE__ */ e(k, { className: f(j, "flex-1 min-w-0"), children: V }) : V,
        s.map((L) => /* @__PURE__ */ c(
          "span",
          {
            className: f(j, "inline-flex items-center gap-1 shrink-0"),
            children: [
              /* @__PURE__ */ e("span", { className: "tabular-nums", children: L.count }),
              /* @__PURE__ */ e("span", { children: L.emoji })
            ]
          },
          L.emoji
        )),
        P ? /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: (L) => {
              T(L), P();
            },
            className: f(
              j,
              // `hover:text-interactive-text`, not `hover:text-interactive`: this is a
              // text label, and hovering it used to drop it to 3.51:1 on the panel it
              // sits on. A hover state is invisible to a static-story axe pass, so this
              // one was found by reading rather than by measuring.
              "inline-flex items-center gap-1 shrink-0 hover:text-interactive-text transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs"
            ),
            children: [
              /* @__PURE__ */ e("span", { children: "Details" }),
              /* @__PURE__ */ e(xe, { className: "w-4 h-4" })
            ]
          }
        ) : null,
        N ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          /* @__PURE__ */ e("div", { className: "shrink-0", onClick: T, children: N })
        ) : null
      ] }) }),
      /* @__PURE__ */ e("td", { className: f(R, "pl-2 pr-4"), style: { width: S.tags }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: d.length > 0 ? /* @__PURE__ */ e(At, { labels: d }) : null }) }),
      /* @__PURE__ */ e("td", { className: f(R, "pl-2 pr-4"), style: { width: S.estimation }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: b !== void 0 ? /* @__PURE__ */ e(Ot, { points: b, formatPoints: m }) : null }) }),
      /* @__PURE__ */ e("td", { className: f(R, "pl-2 pr-4"), style: { width: S.assignee }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: p ? /* @__PURE__ */ e(Et, { name: p, avatarSrc: x }) : null }) }),
      /* @__PURE__ */ e("td", { className: f(R, "pl-2 pr-4"), style: { width: S.dueDate }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: h ? /* @__PURE__ */ e(
        Zt,
        {
          date: h,
          urgency: v,
          urgencyLabel: g
        }
      ) : null }) })
    ] })
  );
}
function zt() {
  return /* @__PURE__ */ c("tr", { children: [
    /* @__PURE__ */ e("td", { className: f(R, "pl-4 pr-4 border-l"), style: { width: S.name }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ e(I, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ e("td", { className: f(R, "pl-4 pr-4"), style: { width: S.tags }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ e(I, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ e("td", { className: f(R, "pl-4 pr-4"), style: { width: S.estimation }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ e(I, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ e("td", { className: f(R, "pl-4 pr-4"), style: { width: S.assignee }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ e(I, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ e(I, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ e("td", { className: f(R, "pl-4 pr-4"), style: { width: S.dueDate }, children: /* @__PURE__ */ e("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ e(I, { className: "h-4 w-20" }) }) })
  ] });
}
function Ut({ level: t, children: n }) {
  const l = `h${t}`;
  return /* @__PURE__ */ e(l, { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: n });
}
const A = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function Dn({
  groups: t,
  isLoading: n = !1,
  emptyTitle: l = "No tasks yet",
  emptyDescription: s,
  emptyAction: a,
  empty: i,
  className: o
}) {
  return /* @__PURE__ */ e(
    "div",
    {
      className: f(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        o
      ),
      children: /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ e("div", { className: "flex", children: A.map(({ key: r, label: u }, d) => /* @__PURE__ */ e(
          "div",
          {
            className: f(
              R,
              "px-4",
              d === 0 && "border-l rounded-l-4",
              d === A.length - 1 && "rounded-r-4"
            ),
            style: { width: S[r] },
            children: /* @__PURE__ */ e("span", { className: j, children: u })
          },
          r
        )) }),
        n ? /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ e("colgroup", { children: A.map(({ key: r }) => /* @__PURE__ */ e("col", { style: { width: S[r] } }, r)) }),
          /* @__PURE__ */ e("tbody", { children: Array.from({ length: 5 }).map((r, u) => /* @__PURE__ */ e(zt, {}, u)) })
        ] }) : t.length === 0 ? i ?? /* @__PURE__ */ e(ge, { title: l, description: s, action: a }) : t.map((r, u) => /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ e("colgroup", { children: A.map(({ key: d }) => /* @__PURE__ */ e("col", { style: { width: S[d] } }, d)) }),
          /* @__PURE__ */ c("tbody", { children: [
            /* @__PURE__ */ e("tr", { children: /* @__PURE__ */ e("td", { colSpan: A.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ e(se, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ e(Ut, { level: r.headingLevel ?? 3, children: r.title }),
              r.actions
            ] }) }) }),
            r.rows.map((d, b) => /* @__PURE__ */ e(_t, { ...d }, b))
          ] })
        ] }, u))
      ] })
    }
  );
}
function $({
  isOpen: t,
  onClose: n,
  triggerRef: l,
  dismissExemptRef: s,
  role: a = "dialog",
  children: i,
  className: o,
  ...r
}) {
  const u = y(null), { overlayProps: d } = je(
    {
      isOpen: t,
      onClose: n,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (b) => {
        var m, p;
        return !((m = l == null ? void 0 : l.current) != null && m.contains(b)) && !((p = s == null ? void 0 : s.current) != null && p.contains(b));
      }
    },
    u
  );
  return t ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ e(ne, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ c("div", { ...d, ...r, ref: u, role: a, className: o, children: [
      /* @__PURE__ */ e(U, { onDismiss: n }),
      i,
      /* @__PURE__ */ e(U, { onDismiss: n })
    ] }) })
  ) : null;
}
function ie({
  state: t,
  children: n,
  popoverRef: l,
  className: s,
  ...a
}) {
  const i = y(null), o = l ?? i, { popoverProps: r, underlayProps: u } = Be({ ...a, popoverRef: o }, t);
  return /* @__PURE__ */ c(Ze, { children: [
    /* @__PURE__ */ e("div", { ...u, className: "fixed inset-0" }),
    /* @__PURE__ */ e(ne, { restoreFocus: !0, children: /* @__PURE__ */ c(
      "div",
      {
        ...r,
        ref: o,
        onKeyDownCapture: (d) => {
          d.key === "Escape" && (d.stopPropagation(), t.close());
        },
        className: f(
          "z-popover bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          s
        ),
        children: [
          /* @__PURE__ */ e(U, { onDismiss: () => t.close() }),
          n,
          /* @__PURE__ */ e(U, { onDismiss: () => t.close() })
        ]
      }
    ) })
  ] });
}
function ye({
  state: t,
  listBoxRef: n,
  className: l,
  ...s
}) {
  const a = y(null), i = n ?? a, { listBoxProps: o } = Ee(s, t, i);
  return /* @__PURE__ */ e(
    "ul",
    {
      ...o,
      ref: i,
      className: f("max-h-64 min-w-40 overflow-auto py-2 outline-none", l),
      children: [...t.collection].map((r) => /* @__PURE__ */ e(Wt, { item: r, state: t }, r.key))
    }
  );
}
function Wt({ item: t, state: n }) {
  const l = y(null), { optionProps: s, isSelected: a, isFocused: i, isDisabled: o } = Oe(
    { key: t.key },
    n,
    l
  );
  return /* @__PURE__ */ c(
    "li",
    {
      ...s,
      ref: l,
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
        a ? "text-interactive-text font-semibold" : "text-main",
        o && "cursor-not-allowed opacity-50"
      ),
      children: [
        /* @__PURE__ */ e("span", { children: t.rendered }),
        a ? /* @__PURE__ */ e("span", { "aria-hidden": "true", children: "✓" }) : null
      ]
    }
  );
}
function In({
  isLabelVisible: t = !1,
  placeholder: n,
  icon: l,
  error: s,
  description: a,
  className: i,
  ...o
}) {
  const r = tt(o), u = y(null), { labelProps: d, triggerProps: b, valueProps: m, menuProps: p, descriptionProps: x, errorMessageProps: h } = Ae(
    { ...o, description: a, errorMessage: s, isInvalid: !!s },
    r,
    u
  ), { buttonProps: v } = Z(b, u);
  return /* @__PURE__ */ c("div", { className: f("inline-flex flex-col gap-1.5", i), children: [
    o.label ? /* @__PURE__ */ c("span", { ...d, className: W(t), children: [
      o.label,
      o.isRequired ? /* @__PURE__ */ e(F, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(Fe, { state: r, triggerRef: u, label: o.label, name: o.name }),
    /* @__PURE__ */ c(
      "button",
      {
        ...v,
        ref: u,
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
          r.selectedItem ? "text-main" : "text-muted-on-dark",
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
          s && "ring-1 ring-danger-text focus-visible:outline-danger-text"
        ),
        children: [
          l,
          /* @__PURE__ */ e("span", { ...m, className: "flex-1 text-left truncate", children: r.selectedItem ? r.selectedItem.rendered : n }),
          /* @__PURE__ */ e(se, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ e(
      E,
      {
        description: a,
        error: s,
        descriptionProps: x,
        errorMessageProps: h
      }
    ),
    r.isOpen ? /* @__PURE__ */ e(ie, { state: r, triggerRef: u, placement: "bottom start", children: /* @__PURE__ */ e(ye, { ...p, state: r }) }) : null
  ] });
}
function Rn({
  label: t,
  placeholder: n,
  icon: l,
  isDisabled: s,
  error: a,
  description: i,
  className: o,
  ...r
}) {
  const u = le({}), d = y(null), b = nt({
    ...r,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { fieldProps: m, descriptionProps: p, errorMessageProps: x } = ee({
    label: t,
    description: i,
    errorMessage: a,
    isInvalid: !!a
  }), { buttonProps: h } = Z(
    { onPress: () => u.toggle(), isDisabled: s, "aria-label": t },
    d
  ), v = [...b.collection].filter(
    (g) => b.selectionManager.isSelected(g.key)
  );
  return /* @__PURE__ */ c("div", { className: f("inline-flex flex-col gap-1.5", o), children: [
    /* @__PURE__ */ c(
      "button",
      {
        ...h,
        ref: d,
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": u.isOpen,
        "aria-describedby": m["aria-describedby"],
        className: f(
          // The design's chip, identical to `Select`'s trigger — see that component for
          // the full derivation, the measured ratios, and why the white surface this
          // replaces was wrong. Identical on purpose: the two sit side by side in a
          // filter row, and nothing about holding a set rather than a scalar should make
          // this control a different height or shape.
          "inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          v.length > 0 ? "text-main" : "text-muted-on-dark",
          a && "ring-1 ring-danger-text focus-visible:outline-danger-text"
        ),
        children: [
          l,
          /* @__PURE__ */ e("span", { className: "flex-1 text-left truncate", children: v.length > 0 ? v.map((g, N) => /* @__PURE__ */ c(He, { children: [
            N > 0 ? ", " : null,
            g.rendered
          ] }, g.key)) : n }),
          /* @__PURE__ */ e(se, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ e(
      E,
      {
        description: i,
        error: a,
        descriptionProps: p,
        errorMessageProps: x
      }
    ),
    u.isOpen ? /* @__PURE__ */ e(ie, { state: u, triggerRef: d, placement: "bottom start", children: /* @__PURE__ */ e(ye, { "aria-label": t, state: b, autoFocus: !0 }) }) : null
  ] });
}
function jn({
  label: t,
  triggerContent: n,
  isDisabled: l,
  triggerClassName: s,
  ...a
}) {
  const i = lt({}), o = y(null), { menuTriggerProps: r, menuProps: u } = _e(
    { isDisabled: l },
    i,
    o
  ), { buttonProps: d } = Z(
    { ...r, isDisabled: l, "aria-label": t },
    o
  );
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ e(
      "button",
      {
        ...d,
        ref: o,
        type: "button",
        className: f(
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          s
        ),
        children: n
      }
    ),
    i.isOpen ? /* @__PURE__ */ e(ie, { state: i, triggerRef: o, placement: "bottom end", children: /* @__PURE__ */ e(
      $t,
      {
        ...u,
        ...a,
        autoFocus: a.autoFocus ?? i.focusStrategy ?? !0,
        onClose: () => i.close()
      }
    ) }) : null
  ] });
}
function $t({ children: t, onAction: n, onClose: l, ...s }) {
  const a = st({ ...s, children: t, selectionMode: "none" }), i = y(null), { menuProps: o } = ze({ ...s, onAction: n, onClose: l }, a, i);
  return /* @__PURE__ */ e("ul", { ...o, ref: i, className: "max-h-64 min-w-40 overflow-auto py-2 outline-none", children: [...a.collection].map((r) => /* @__PURE__ */ e(Kt, { item: r, state: a, onClose: l }, r.key)) });
}
function Kt({ item: t, state: n, onClose: l }) {
  const s = y(null), { menuItemProps: a, isFocused: i, isDisabled: o } = Ue(
    { key: t.key, onClose: l },
    n,
    s
  );
  return /* @__PURE__ */ e(
    "li",
    {
      ...a,
      ref: s,
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
function Bn({
  title: t,
  isOpen: n,
  onClose: l,
  children: s,
  width: a = "max-w-md",
  role: i = "dialog",
  isDismissable: o = !0,
  closeLabel: r = "Close modal"
}) {
  const u = y(null), d = y(null), b = le({
    isOpen: n,
    onOpenChange: (g) => {
      g || l();
    }
  }), { modalProps: m, underlayProps: p } = We(
    { isDismissable: o, isKeyboardDismissDisabled: !o },
    b,
    u
  ), { dialogProps: x, titleProps: h, contentProps: v } = $e({ role: i }, d);
  return n ? /* @__PURE__ */ e(
    "div",
    {
      ...p,
      className: "fixed inset-0 z-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ e(ne, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ e("div", { ...m, ref: u, className: f("w-full", a), children: /* @__PURE__ */ c(
        "div",
        {
          ...x,
          ref: d,
          className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
          children: [
            /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
              /* @__PURE__ */ e("h2", { ...h, className: "font-sans font-bold text-base text-main", children: t }),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: l,
                  "aria-label": r,
                  className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                  children: /* @__PURE__ */ e(re, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ e("div", { ...v, className: "px-4 py-4", children: s })
          ]
        }
      ) }) })
    }
  ) : null;
}
function Zn(t = !1) {
  const n = le({ defaultOpen: t });
  return {
    isOpen: n.isOpen,
    open: n.open,
    close: n.close,
    toggle: n.toggle
  };
}
function fe(t, n) {
  return ut(dt(t, n));
}
function Gt(t, n) {
  return t.toDate(n);
}
function qt({
  value: t,
  defaultValue: n,
  onChange: l,
  onClose: s,
  triggerRef: a,
  dismissExemptRef: i,
  timeZone: o = ct(),
  label: r = "Date picker",
  previousYearLabel: u = "Previous year",
  previousMonthLabel: d = "Previous month",
  nextMonthLabel: b = "Next month",
  nextYearLabel: m = "Next year",
  className: p
}) {
  const x = t !== void 0 ? { value: fe(t, o) } : { defaultValue: n ? fe(n, o) : null }, h = rt({
    ...x,
    onChange: (V) => l == null ? void 0 : l(Gt(V, o)),
    createCalendar: ot,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: v, prevButtonProps: g, nextButtonProps: N } = Ke(
    { "aria-label": r },
    h
  ), C = y(null), P = y(null), { buttonProps: T } = Z(g, C), { buttonProps: k } = Z(N, P), D = () => {
    const V = ft(o);
    h.setFocusedDate(V), h.selectDate(V);
  };
  return /* @__PURE__ */ c(
    $,
    {
      isOpen: !0,
      onClose: s,
      triggerRef: a,
      dismissExemptRef: i,
      "aria-label": r,
      className: f(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        p
      ),
      children: [
        /* @__PURE__ */ c("div", { ...v, className: "flex flex-col", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => h.focusPreviousSection(!0),
                  "aria-label": u,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ e(kt, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  ...T,
                  ref: C,
                  "aria-label": d,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ e(wt, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ e("span", { className: "font-sans font-semibold text-body-sm text-main", children: h.visibleRange.start.toDate(o).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: o }) }),
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  ...k,
                  ref: P,
                  "aria-label": b,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ e(xe, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => h.focusNextSection(!0),
                  "aria-label": m,
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ e(Pt, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ e("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ e(Yt, { state: h })
        ] }),
        /* @__PURE__ */ e("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ e("div", { className: "flex items-center justify-center py-[9px] h-10", children: /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: D,
            className: "text-body-sm font-normal font-sans text-interactive-text hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-xs",
            children: "Today"
          }
        ) })
      ]
    }
  );
}
function Yt({ state: t }) {
  const { gridProps: n, headerProps: l, weekDays: s, weeksInMonth: a } = Ge(
    { weekdayStyle: "short" },
    t
  ), i = t.visibleRange.start;
  return /* @__PURE__ */ c("div", { ...n, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ e("div", { ...l, className: "grid grid-cols-7", children: s.map((o, r) => /* @__PURE__ */ e("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: o }, r)) }),
    Array.from({ length: a }, (o, r) => /* @__PURE__ */ e("div", { role: "row", className: "grid grid-cols-7", children: t.getDatesInWeek(r).map(
      (u, d) => u ? /* @__PURE__ */ e(
        Xt,
        {
          state: t,
          date: u,
          currentMonth: i
        },
        u.toString()
      ) : /* @__PURE__ */ e("div", { role: "gridcell", "aria-hidden": "true" }, d)
    ) }, r))
  ] });
}
function Xt({
  state: t,
  date: n,
  currentMonth: l
}) {
  const s = y(null), a = !mt(n, l), { cellProps: i, buttonProps: o, isSelected: r, isDisabled: u, formattedDate: d } = qe(
    { date: n, isOutsideMonth: a },
    t,
    s
  );
  return /* @__PURE__ */ e("div", { ...i, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ e(
    "div",
    {
      ...o,
      ref: s,
      className: f(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text",
        u ? "text-muted cursor-default" : r ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: d
    }
  ) });
}
const Jt = [1, 2, 3, 5, 8];
function Qt({
  value: t,
  onSelect: n,
  onClose: l,
  triggerRef: s,
  dismissExemptRef: a,
  formatPoints: i = he,
  label: o = "Estimate",
  className: r
}) {
  return /* @__PURE__ */ c(
    $,
    {
      isOpen: !0,
      onClose: l,
      triggerRef: s,
      dismissExemptRef: a,
      "aria-label": o,
      className: f(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        r
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: o }) }),
        Jt.map((u) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => n(u),
            "aria-pressed": t === u,
            className: f(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
              // `text-neutral-5` wherever the row's fill is a solid `neutral-2`: white on
              // that fill is 2.94:1, and it applies to the hover state as much as the
              // selected one. Only the selected case was visible to axe — a static story
              // has no hover.
              t === u ? "bg-neutral-2 text-neutral-5" : "hover:bg-neutral-2 hover:text-neutral-5"
            ),
            children: [
              /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ e(J, { className: "size-6" }) }),
              /* @__PURE__ */ e("span", { className: "whitespace-nowrap", children: i(u) })
            ]
          },
          u
        ))
      ]
    }
  );
}
function en({
  name: t,
  role: n,
  avatarSrc: l,
  size: s = "md",
  isOnline: a = !1,
  className: i,
  onClick: o
}) {
  const r = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ c(
    o ? "button" : "div",
    {
      type: o ? "button" : void 0,
      onClick: o,
      className: f(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        o && "cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 rounded-sm",
        i
      ),
      children: [
        /* @__PURE__ */ c("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ e(_, { src: l, name: t, size: s }),
          a ? /* @__PURE__ */ e("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ c("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ e("span", { className: "font-sans font-normal text-body-m text-main truncate", children: t }),
          n ? /* @__PURE__ */ e(
            "span",
            {
              className: f(
                "font-sans text-muted-on-dark truncate leading-tight",
                r[s]
              ),
              children: n
            }
          ) : null
        ] })
      ]
    }
  );
}
function tn({
  assignees: t,
  onSelect: n,
  onClose: l,
  triggerRef: s,
  dismissExemptRef: a,
  label: i = "Assignee",
  className: o
}) {
  return /* @__PURE__ */ c(
    $,
    {
      isOpen: !0,
      onClose: l,
      triggerRef: s,
      dismissExemptRef: a,
      "aria-label": i,
      className: f(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: i }) }),
        t.map((r) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => n(r),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ e(en, { name: r.name, role: r.role, avatarSrc: r.avatarSrc, size: "sm" })
          },
          r.id
        ))
      ]
    }
  );
}
function nn({
  labels: t,
  onSelect: n,
  onClose: l,
  triggerRef: s,
  dismissExemptRef: a,
  label: i = "Label",
  className: o
}) {
  return /* @__PURE__ */ c(
    $,
    {
      isOpen: !0,
      onClose: l,
      triggerRef: s,
      dismissExemptRef: a,
      "aria-label": i,
      className: f(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ e("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ e("span", { className: "text-body-xl font-semibold text-muted-on-dark font-sans truncate", children: i }) }),
        t.map((r) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => n(r),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ e(B, { variant: r.variant ?? "neutral", children: r.text })
          },
          r.id
        ))
      ]
    }
  );
}
function En({
  isOpen: t,
  onClose: n,
  assignees: l = [],
  labels: s = [],
  onSubmit: a,
  defaultTitle: i = "",
  defaultDueDate: o,
  defaultPoints: r,
  defaultAssignee: u,
  defaultLabel: d,
  className: b
}) {
  const [m, p] = H.useState(i), [x, h] = H.useState(o), [v, g] = H.useState(r), [N, C] = H.useState(u), [P, T] = H.useState(d), [k, D] = H.useState(null), V = (M) => D((z) => z === M ? null : M), L = (M) => D((z) => z === M ? null : z), O = H.useRef(null), K = H.useRef(null), G = H.useRef(null), q = H.useRef(null), ae = H.useRef(null), Y = () => {
    p(i), h(o), g(r), C(u), T(d), D(null);
  }, [Ce, we] = H.useState(t);
  if (t !== Ce && (we(t), t && Y()), !t) return null;
  const ke = (M) => {
    M.preventDefault(), m.trim() && (a == null || a({ title: m.trim(), dueDate: x, points: v, assignee: N, label: P }), Y(), n());
  }, Pe = () => {
    Y(), n();
  };
  return /* @__PURE__ */ c(
    "form",
    {
      onSubmit: ke,
      className: f(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        b
      ),
      children: [
        /* @__PURE__ */ e(
          "input",
          {
            autoFocus: !0,
            value: m,
            onChange: (M) => p(M.target.value),
            placeholder: "Task name",
            "aria-label": "Task name",
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted-on-dark font-sans rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
          }
        ),
        /* @__PURE__ */ c("div", { ref: O, className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ c("div", { className: "relative", children: [
            v === void 0 ? /* @__PURE__ */ e(
              "button",
              {
                ref: K,
                type: "button",
                onClick: () => V("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "estimate",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(B, { icon: /* @__PURE__ */ e(J, { className: "size-6" }), children: "Estimate" })
              }
            ) : /* @__PURE__ */ c(
              "button",
              {
                ref: K,
                type: "button",
                onClick: () => V("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ e("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ e(J, { className: "size-6" }) }),
                  v,
                  " Point",
                  v !== 1 ? "s" : ""
                ]
              }
            ),
            k === "estimate" ? /* @__PURE__ */ e(
              Qt,
              {
                value: v,
                onSelect: (M) => {
                  g(M), D(null);
                },
                dismissExemptRef: O,
                onClose: () => L("estimate"),
                triggerRef: K,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            N ? /* @__PURE__ */ c(
              "button",
              {
                ref: G,
                type: "button",
                onClick: () => V("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 hover:text-neutral-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ e(_, { src: N.avatarSrc, name: N.name, size: "sm" }),
                  N.name
                ]
              }
            ) : /* @__PURE__ */ e(
              "button",
              {
                ref: G,
                type: "button",
                onClick: () => V("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "assignee",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(B, { icon: /* @__PURE__ */ e(yt, { className: "size-6" }), children: "Assignee" })
              }
            ),
            k === "assignee" ? /* @__PURE__ */ e(
              tn,
              {
                assignees: l,
                onSelect: (M) => {
                  C(M), D(null);
                },
                dismissExemptRef: O,
                onClose: () => L("assignee"),
                triggerRef: G,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            P ? /* @__PURE__ */ e(
              "button",
              {
                ref: q,
                type: "button",
                onClick: () => V("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(B, { variant: P.variant ?? "neutral", children: P.text })
              }
            ) : /* @__PURE__ */ e(
              "button",
              {
                ref: q,
                type: "button",
                onClick: () => V("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(B, { icon: /* @__PURE__ */ e(Nt, { className: "size-6" }), children: "Label" })
              }
            ),
            k === "label" ? /* @__PURE__ */ e(
              nn,
              {
                labels: s,
                onSelect: (M) => {
                  T(M), D(null);
                },
                dismissExemptRef: O,
                onClose: () => L("label"),
                triggerRef: q,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            /* @__PURE__ */ e(
              "button",
              {
                ref: ae,
                type: "button",
                onClick: () => V("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": k === "date",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2",
                children: /* @__PURE__ */ e(B, { icon: /* @__PURE__ */ e(Ct, { className: "size-6" }), children: x ? x.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            k === "date" ? /* @__PURE__ */ e(
              qt,
              {
                value: x,
                onChange: (M) => {
                  h(M), D(null);
                },
                dismissExemptRef: O,
                onClose: () => L("date"),
                triggerRef: ae,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ e(de, { variant: "secondary", onPress: Pe, children: "Cancel" }),
          /* @__PURE__ */ e(de, { variant: "primary", type: "submit", isDisabled: !m.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function On({ variant: t = "neutral", children: n, className: l }) {
  return /* @__PURE__ */ e(
    "span",
    {
      className: f(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans",
        {
          neutral: "bg-surface-neutral text-neutral-4 border-subtle",
          success: "bg-success-1 text-neutral-4 border-success-2",
          warning: "bg-warning-1 text-warning-6 border-warning-2",
          danger: "bg-danger-1 text-danger-6 border-danger-2"
        }[t],
        l
      ),
      children: n
    }
  );
}
const Ne = Te(null);
function An() {
  const t = Se(Ne);
  if (!t)
    throw new Error("useToast must be used within a ToastProvider");
  return t;
}
const ln = 5e3, sn = {
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
function rn({
  toast: t,
  state: n,
  closeLabel: l
}) {
  const s = y(null), a = y(null), { toastProps: i, contentProps: o, titleProps: r, closeButtonProps: u } = Xe(
    { toast: t },
    n,
    s
  ), { buttonProps: d } = Z(u, a);
  return /* @__PURE__ */ c(
    "div",
    {
      ...i,
      ref: s,
      className: f(
        "pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-sm shadow-elevation",
        "text-body-m font-semibold font-sans",
        sn[t.content.tone]
      ),
      children: [
        /* @__PURE__ */ e("div", { ...o, children: /* @__PURE__ */ e("span", { ...r, children: t.content.message }) }),
        /* @__PURE__ */ e(
          "button",
          {
            ...d,
            ref: a,
            "aria-label": l,
            className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2",
            children: /* @__PURE__ */ e(re, { className: "size-4" })
          }
        )
      ]
    }
  );
}
function an({
  state: t,
  label: n,
  closeLabel: l
}) {
  const s = y(null), { regionProps: a } = Ye({ "aria-label": n }, t, s);
  return pt(
    /* @__PURE__ */ e(
      "div",
      {
        ...a,
        ref: s,
        className: "pointer-events-none fixed right-4 bottom-4 z-toast flex flex-col gap-2",
        children: t.visibleToasts.map((i) => /* @__PURE__ */ e(rn, { toast: i, state: t, closeLabel: l }, i.key))
      }
    ),
    document.body
  );
}
function Fn({
  children: t,
  duration: n = ln,
  maxVisibleToasts: l = 4,
  label: s = "Notifications",
  closeLabel: a = "Dismiss"
}) {
  const i = it({ maxVisibleToasts: l }), o = y(i);
  oe(() => {
    o.current = i;
  }, [i]);
  const r = y(n);
  oe(() => {
    r.current = n;
  }, [n]);
  const u = be(
    () => ({
      show: (d, b, m) => o.current.add(
        { tone: d, message: b },
        // `undefined` in `options.timeout` means "not specified, use the default";
        // an explicit `null` means "stay until dismissed", which react-stately
        // expresses as a timeout of 0.
        {
          timeout: (m == null ? void 0 : m.timeout) === null ? 0 : (m == null ? void 0 : m.timeout) ?? r.current
        }
      )
    }),
    []
  );
  return /* @__PURE__ */ c(Ne.Provider, { value: u, children: [
    t,
    i.visibleToasts.length > 0 ? /* @__PURE__ */ e(an, { state: i, label: s, closeLabel: a }) : null
  ] });
}
function _n({
  children: t,
  isSelected: n,
  defaultSelected: l = !1,
  onChange: s,
  isDisabled: a = !1,
  isIndeterminate: i = !1,
  error: o,
  description: r,
  isRequired: u = !1,
  label: d,
  className: b
}) {
  const m = at({
    isSelected: n,
    defaultSelected: l,
    onChange: s
  }), p = y(null), { fieldProps: x, descriptionProps: h, errorMessageProps: v } = ee({
    description: r,
    errorMessage: o,
    isInvalid: !!o
  }), { inputProps: g, labelProps: N } = Je(
    {
      isSelected: m.isSelected,
      isIndeterminate: i,
      isDisabled: a,
      isRequired: u,
      isInvalid: !!o,
      "aria-label": d ?? (typeof t == "string" ? t : "Checkbox")
    },
    m,
    p
  ), C = /* @__PURE__ */ c(
    "label",
    {
      ...N,
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
        a && "opacity-50 cursor-not-allowed",
        b
      ),
      children: [
        /* @__PURE__ */ e(
          "input",
          {
            ...g,
            ref: p,
            "aria-describedby": x["aria-describedby"],
            className: "sr-only"
          }
        ),
        /* @__PURE__ */ c(
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
              m.isSelected && !i ? /* @__PURE__ */ e(
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
        /* @__PURE__ */ c("span", { className: "text-body-m font-normal font-sans text-main", children: [
          t,
          u ? /* @__PURE__ */ e(F, {}) : null
        ] })
      ]
    }
  );
  return !o && !r ? C : /* @__PURE__ */ c("div", { className: "inline-flex flex-col gap-1", children: [
    C,
    /* @__PURE__ */ e("span", { className: "px-4", children: /* @__PURE__ */ e(
      E,
      {
        description: r,
        error: o,
        descriptionProps: h,
        errorMessageProps: v
      }
    ) })
  ] });
}
function zn({
  label: t,
  isLabelVisible: n = !1,
  error: l,
  description: s,
  className: a,
  ...i
}) {
  const o = y(null), { labelProps: r, inputProps: u, descriptionProps: d, errorMessageProps: b } = te(
    { ...i, label: t, description: s, type: "date", isInvalid: !!l, errorMessage: l },
    o
  );
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-1.5 w-full", children: [
    t ? /* @__PURE__ */ c("label", { ...r, className: W(n), children: [
      t,
      i.isRequired ? /* @__PURE__ */ e(F, {}) : null
    ] }) : null,
    /* @__PURE__ */ e(
      "input",
      {
        ...u,
        ref: o,
        type: "date",
        className: f(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          l && "border-danger-5 focus-visible:outline-danger-text",
          a
        )
      }
    ),
    /* @__PURE__ */ e(
      E,
      {
        description: s,
        error: l,
        descriptionProps: d,
        errorMessageProps: b
      }
    )
  ] });
}
function on({
  icon: t,
  label: n,
  isActive: l = !1,
  badgeCount: s,
  onClick: a,
  className: i
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      onClick: a,
      "aria-current": l ? "page" : void 0,
      className: f(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2",
        // `-text`, not the bare `text-interactive`, on both the active and the hover
        // label: an item's label is text, and primary-4 as text clears 4.5:1 nowhere
        // (2.86 / 3.51 / 4.02). The sidebar is `surface-panel`, so the active item was
        // 3.51:1. `primary-2` measures 6.67:1 there, and 6.02:1 at the far end of the
        // gradient where the label sits on a 10% primary-4 wash — both clear. The wash
        // itself is unchanged: it is decoration, not a boundary, and the label carries
        // the state.
        l ? "text-interactive-text bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive-text",
        i
      ),
      children: [
        t ? /* @__PURE__ */ e("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: t }) : null,
        /* @__PURE__ */ e("span", { className: "flex-1 truncate", children: n }),
        s !== void 0 ? /* @__PURE__ */ e(
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
              l ? "bg-interactive-text text-neutral-5" : "bg-neutral-3 text-main"
            ),
            children: s
          }
        ) : null,
        /* @__PURE__ */ e(
          "span",
          {
            className: f(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              l ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function cn({
  logo: t,
  items: n,
  label: l = "Main navigation",
  className: s
}) {
  return /* @__PURE__ */ c(
    "nav",
    {
      "aria-label": l,
      className: f(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        s
      ),
      children: [
        t ? /* @__PURE__ */ e("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: t }) : null,
        /* @__PURE__ */ e("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: n.map((a, i) => /* @__PURE__ */ e(on, { ...a }, i)) })
      ]
    }
  );
}
function Un({
  value: t,
  onChange: n,
  leftIcon: l,
  rightIcon: s,
  leftLabel: a,
  rightLabel: i,
  label: o = "View",
  className: r
}) {
  const u = y(null), d = (m) => {
    var p, x;
    n == null || n(m), (x = (p = u.current) == null ? void 0 : p.querySelectorAll("button")[m === "left" ? 0 : 1]) == null || x.focus();
  }, b = (m) => {
    let p;
    switch (m.key) {
      // With exactly two options, "next" and "previous" are the same move — both wrap, the
      // same way SegmentedControl's modular arithmetic does at length 2.
      case "ArrowRight":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowUp":
        p = t === "left" ? "right" : "left";
        break;
      case "Home":
        p = "left";
        break;
      case "End":
        p = "right";
        break;
      default:
        return;
    }
    m.preventDefault(), d(p);
  };
  return /* @__PURE__ */ c(
    "div",
    {
      ref: u,
      role: "radiogroup",
      "aria-label": o,
      className: f("flex items-center w-20 h-10 bg-surface-shell rounded-sm", r),
      children: [
        /* @__PURE__ */ e(
          ue,
          {
            variant: "secondary",
            role: "radio",
            "aria-checked": t === "left",
            excludeFromTabOrder: t !== "left",
            isSelected: t === "left",
            "aria-label": a,
            onKeyDown: b,
            onPress: () => d("left"),
            children: l
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            variant: "secondary",
            role: "radio",
            "aria-checked": t === "right",
            excludeFromTabOrder: t !== "right",
            isSelected: t === "right",
            "aria-label": i,
            onKeyDown: b,
            onPress: () => d("right"),
            children: s
          }
        )
      ]
    }
  );
}
function Wn({
  logo: t,
  sidebarItems: n,
  sidebar: l,
  topNavProps: s,
  topNav: a,
  topBar: i,
  children: o,
  className: r
}) {
  const u = l !== void 0 ? l : n ? /* @__PURE__ */ e(cn, { logo: t, items: n, className: "self-stretch" }) : null, d = a !== void 0 ? a : /* @__PURE__ */ e(Tt, { ...s });
  return /* @__PURE__ */ c(
    "div",
    {
      className: f("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", r),
      children: [
        u,
        /* @__PURE__ */ c("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
          d,
          /* @__PURE__ */ c("div", { className: "flex flex-col gap-4", children: [
            i ? /* @__PURE__ */ e("div", { className: "flex items-start justify-between gap-6", children: i }) : null,
            o
          ] })
        ] })
      ]
    }
  );
}
export {
  En as AddTaskModal,
  vt as AlarmIcon,
  Wn as AppShell,
  cn as ApplicationSidebar,
  yt as AssigneeIcon,
  tn as AssigneeModal,
  Et as AssigneeNameCell,
  gn as AttachmentIcon,
  _ as Avatar,
  On as Badge,
  ce as BellIcon,
  ue as Button,
  Ct as CalendarIcon,
  Sn as Card,
  kt as ChevronDoubleLeftIcon,
  Pt as ChevronDoubleRightIcon,
  se as ChevronDownIcon,
  wt as ChevronLeftIcon,
  xe as ChevronRightIcon,
  re as CloseIcon,
  Nn as CommentIcon,
  ht as DUE_DATE_URGENCY_COLOR,
  xt as DUE_DATE_URGENCY_LABEL,
  qt as DatePickerMenu,
  zn as Datepicker,
  Zt as DueDateCell,
  ge as EmptyState,
  Qt as EstimateModal,
  Ot as EstimationCell,
  Vt as FIELD_DESCRIPTION_CLASS,
  Ht as FIELD_ERROR_CLASS,
  Lt as FIELD_LABEL_CLASS,
  Mt as FIELD_LABEL_HIDDEN_CLASS,
  E as FieldMessages,
  ie as FloatingPopover,
  Ln as FormField,
  Cn as GridViewIcon,
  Mn as Input,
  _n as LabelCheckbox,
  Nt as LabelIcon,
  nn as LabelModal,
  ye as ListBox,
  wn as ListViewIcon,
  Pn as LogoMark,
  jn as Menu,
  vn as MenuDotsIcon,
  Bn as Modal,
  Rn as MultiSelect,
  kn as PlusIcon,
  J as PointsIcon,
  $ as Popover,
  Q as ProjectInfo,
  F as RequiredIndicator,
  St as SearchBar,
  gt as SearchIcon,
  Hn as SegmentedControl,
  In as Select,
  on as SidebarItem,
  I as Skeleton,
  yn as SubtaskIcon,
  Vn as Tabs,
  B as Tag,
  At as TagCell,
  jt as TaskCard,
  Tn as TaskListView,
  Rt as TaskMetaBadges,
  Dn as TaskTable,
  _t as TaskTableRow,
  de as TextButton,
  Fn as ToastProvider,
  Tt as TopNav,
  en as UserRow,
  Un as ViewSwitcher,
  f as cn,
  W as fieldLabelClass,
  he as formatPointsLong,
  bt as formatPointsShort,
  Zn as useModalState,
  An as useToast
};
