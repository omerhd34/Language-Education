"use client";

type AuthRememberMeProps = {
  id?: string;
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function AuthRememberMe({
  id = "rememberme",
  checked,
  label,
  onChange,
}: AuthRememberMeProps) {
  return (
    <label className="remember" htmlFor={id}>
      <input
        type="checkbox"
        name="rememberme"
        id={id}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="remember-box" aria-hidden />
      <span className="remember-text">{label}</span>
    </label>
  );
}
