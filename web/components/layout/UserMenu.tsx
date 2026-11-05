"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Link } from "@/i18n/navigation";
import { getUserInitials } from "@/lib/userInitials";
import type { AuthUser } from "@/store/api";

const ROW_SELECTOR = ".menu-item, .sign-out-row";
const UNREAD_MESSAGES = 3;

type UserMenuProps = {
  user: AuthUser;
  isLoggingOut: boolean;
  onLogout: () => void;
};

type MenuLink = {
  key: string;
  href: string;
  icon: typeof UserRound;
  shortcut?: string[];
  isNew?: boolean;
};

export function UserMenu({ user, isLoggingOut, onLogout }: UserMenuProps) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(-1);

  const displayName = user.name?.trim() || user.email;
  const initials = getUserInitials(user.name, user.email);

  const menuLinks: MenuLink[] = [
    {
      key: "myProfile",
      href: "/panelim",
      icon: UserRound,
      shortcut: ["⌘", "⇧", "P"],
    },
    {
      key: "accountSettings",
      href: "/panelim/ayarlar",
      icon: Settings,
      shortcut: ["⌘", ","],
    },
    { key: "billing", href: "/packages", icon: CreditCard },
    { key: "helpCenter", href: "/sss", icon: HelpCircle },
    {
      key: "whatsNew",
      href: "/#announcements",
      icon: Sparkles,
      isNew: true,
    },
  ];

  const clearPlate = useCallback(() => {
    const plate = plateRef.current;
    const nav = navRef.current;
    if (plate) {
      plate.classList.remove("on");
    }
    if (nav) {
      nav.querySelectorAll(ROW_SELECTOR).forEach((row) => {
        row.classList.remove("is-active");
      });
    }
    activeIndexRef.current = -1;
  }, []);

  const movePlateTo = useCallback((row: HTMLElement) => {
    const nav = navRef.current;
    const plate = plateRef.current;
    if (!nav || !plate) {
      return;
    }

    const rows = Array.from(nav.querySelectorAll<HTMLElement>(ROW_SELECTOR));
    const to = rows.indexOf(row);
    if (to < 0) {
      return;
    }

    const from = activeIndexRef.current;
    const delay = from < 0 ? 0 : Math.min(Math.abs(to - from) * 40, 160);
    plate.style.setProperty("--dm-ink-delay", `${delay}ms`);
    plate.style.width = `${row.offsetWidth}px`;
    plate.style.height = `${row.offsetHeight}px`;
    plate.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
    plate.classList.add("on");

    rows.forEach((item, index) => {
      item.classList.toggle("is-active", index === to);
    });
    activeIndexRef.current = to;
  }, []);

  useEffect(() => {
    if (!open) {
      clearPlate();
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearPlate, open]);

  useEffect(() => {
    const nav = navRef.current;
    if (!open || !nav) {
      return;
    }

    function handlePointerOver(event: PointerEvent) {
      const row = (event.target as HTMLElement | null)?.closest(ROW_SELECTOR);
      if (row instanceof HTMLElement && nav?.contains(row)) {
        movePlateTo(row);
      }
    }

    function handleFocusIn(event: FocusEvent) {
      const row = (event.target as HTMLElement | null)?.closest(ROW_SELECTOR);
      if (
        row instanceof HTMLElement &&
        nav?.contains(row) &&
        row.matches(":focus-visible")
      ) {
        movePlateTo(row);
      }
    }

    function handlePointerLeave() {
      clearPlate();
    }

    nav.addEventListener("pointerover", handlePointerOver);
    nav.addEventListener("focusin", handleFocusIn);
    nav.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      nav.removeEventListener("pointerover", handlePointerOver);
      nav.removeEventListener("focusin", handleFocusIn);
      nav.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [clearPlate, movePlateTo, open]);

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="account-trigger-group">
        <IconButton label={t("search")}>
          <Search className="size-4.5" strokeWidth={1.75} aria-hidden />
        </IconButton>

        <span className="bar-badged">
          <IconButton label={t("messages")}>
            <MessageSquareText
              className="size-4.5"
              strokeWidth={1.75}
              aria-hidden
            />
          </IconButton>
          {UNREAD_MESSAGES > 0 ? (
            <>
              <span className="bar-badge" aria-hidden="true">
                {UNREAD_MESSAGES}
              </span>
              <span className="sr-only">
                {t("unreadMessages", { count: UNREAD_MESSAGES })}
              </span>
            </>
          ) : null}
        </span>

        <IconButton label={t("notifications")}>
          <Bell className="size-4.5" strokeWidth={1.75} aria-hidden />
        </IconButton>

        <button
          type="button"
          className="profile-trigger"
          id="profile-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={displayName}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={handleTriggerKeyDown}
        >
          <Avatar className="size-8 rounded-full">
            <AvatarFallback className="rounded-full text-[0.65rem]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>

      {open ? (
        <div id={menuId} className="account-dropdown" role="presentation">
          <div className="account-dropdown__user">
            <div className="relative shrink-0">
              <Avatar className="size-11 rounded-full">
                <AvatarFallback className="rounded-full text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-(--account-surface)"
                aria-hidden
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-(--account-text)">
                {displayName}
              </p>
              {user.name?.trim() ? (
                <p className="truncate text-xs text-(--account-text-dim)">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <nav
            ref={navRef}
            id="dropdown-nav"
            className="account-dropdown__nav"
            aria-label={t("profileMenu")}
          >
            <div className="dm-plate" ref={plateRef} aria-hidden />

            {menuLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  role="menuitem"
                  className="menu-item"
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    className="menu-item__icon"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="menu-item__label">{t(item.key)}</span>
                  {item.isNew ? (
                    <span className="menu-item__new">
                      <span className="menu-item__new-dot" aria-hidden />
                      {t("newBadge")}
                    </span>
                  ) : null}
                  {item.shortcut ? (
                    <span className="menu-item__shortcut" aria-hidden>
                      {item.shortcut.map((key) => (
                        <kbd key={key} className="menu-item__key">
                          {key}
                        </kbd>
                      ))}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            <div className="account-dropdown__divider" />

            <button
              type="button"
              role="menuitem"
              className="sign-out-row"
              disabled={isLoggingOut}
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <LogOut
                className="menu-item__icon"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="menu-item__label">{t("logout")}</span>
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button type="button" className="account-icon-btn" aria-label={label}>
      {children}
    </button>
  );
}
