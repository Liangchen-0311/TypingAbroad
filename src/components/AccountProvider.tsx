"use client";

import { LogOut, Smartphone, UserRound, X } from "lucide-react";
import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  cloudbaseAuthIsConfigured,
  getCloudbaseApp,
  getCloudbaseAuthHeaders,
} from "@/lib/cloudbaseClient";

interface AccountUser {
  id: string;
  phone: string;
}

type AccountDialogStep = "phone" | "code";

interface AccountContextValue {
  user: AccountUser | null;
  loading: boolean;
  configured: boolean;
  openAccount: () => void;
  signOut: () => Promise<void>;
  getAuthHeaders: () => Promise<Record<string, string>>;
}

const AccountContext = createContext<AccountContextValue>({
  user: null,
  loading: true,
  configured: false,
  openAccount: () => undefined,
  signOut: async () => undefined,
  getAuthHeaders: async () => ({}),
});

function normalizeUser(value: unknown): AccountUser | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as {
    id?: unknown;
    uid?: unknown;
    phone?: unknown;
    phone_number?: unknown;
  };
  const id = typeof candidate.id === "string"
    ? candidate.id
    : typeof candidate.uid === "string"
      ? candidate.uid
      : "";
  const phone = typeof candidate.phone === "string"
    ? candidate.phone
    : typeof candidate.phone_number === "string"
      ? candidate.phone_number
      : "";
  return id ? { id, phone } : null;
}

function displayPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^86/, "");
  return digits.length === 11 ? `${digits.slice(0, 3)} **** ${digits.slice(-4)}` : "Signed in";
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const configured = cloudbaseAuthIsConfigured();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<AccountDialogStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const verifyOtpRef = useRef<((params: { token: string | number }) => Promise<unknown>) | null>(null);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const auth = getCloudbaseApp().auth;
    let active = true;

    void auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(normalizeUser(data.user ?? data.session?.user));
      setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });

    const subscription = auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(normalizeUser(session?.user));
      setLoading(false);
    }).data.subscription;

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const resetDialog = useCallback(() => {
    setStep("phone");
    setPhone("");
    setCode("");
    setMessage("");
    setBusy(false);
    verifyOtpRef.current = null;
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    resetDialog();
  }, [resetDialog]);

  const openAccount = useCallback(() => {
    resetDialog();
    setDialogOpen(true);
  }, [resetDialog]);

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = phone.replace(/\D/g, "");
    if (!/^1[3-9]\d{9}$/.test(normalized)) {
      setMessage("请输入有效的中国大陆手机号码。");
      return;
    }
    if (!configured) {
      setMessage("账号服务尚未完成配置，请稍后再试。");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await getCloudbaseApp().auth.signInWithOtp({
        phone: normalized,
        options: { shouldCreateUser: true },
      });
      if (error || !data.verifyOtp) throw error ?? new Error("OTP_NOT_AVAILABLE");
      verifyOtpRef.current = data.verifyOtp;
      setStep("code");
      setMessage("验证码已发送，有效期内请完成登录。");
    } catch {
      setMessage("验证码暂时无法发送，请稍后重试。");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = code.replace(/\D/g, "");
    if (normalized.length < 4 || !verifyOtpRef.current) {
      setMessage("请输入短信中的验证码。");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await verifyOtpRef.current({ token: normalized });
      const result = response as { data?: { user?: unknown; session?: { user?: unknown } }; error?: unknown };
      if (result.error) throw result.error;
      const nextUser = normalizeUser(result.data?.user ?? result.data?.session?.user);
      if (!nextUser) throw new Error("USER_NOT_RETURNED");
      setUser(nextUser);
      closeDialog();
    } catch {
      setMessage("验证码不正确或已过期，请重新获取。");
    } finally {
      setBusy(false);
    }
  };

  const signOut = useCallback(async () => {
    if (configured) await getCloudbaseApp().auth.signOut();
    setUser(null);
    closeDialog();
  }, [closeDialog, configured]);

  const value = useMemo<AccountContextValue>(() => ({
    user,
    loading,
    configured,
    openAccount,
    signOut,
    getAuthHeaders: getCloudbaseAuthHeaders,
  }), [configured, loading, openAccount, signOut, user]);

  return (
    <AccountContext.Provider value={value}>
      {children}
      {dialogOpen && (
        <div className="account-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}>
          <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
            <header>
              <div>
                <span>{user ? "Your account" : "TypeAbroad account"}</span>
                <h2 id="account-dialog-title">{user ? "Membership & progress" : "Sign in with your phone"}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Close account dialog" onClick={closeDialog}>
                <X aria-hidden="true" />
              </button>
            </header>

            {user ? (
              <div className="account-dialog__signed-in">
                <UserRound aria-hidden="true" />
                <div><span>Signed in as</span><strong>{displayPhone(user.phone)}</strong></div>
                <p>Your membership and payment orders are securely linked to this account.</p>
                <button className="secondary-button" type="button" onClick={() => void signOut()}>
                  <LogOut aria-hidden="true" /> Sign out
                </button>
              </div>
            ) : step === "phone" ? (
              <form className="account-dialog__form" onSubmit={sendCode}>
                <p>登录后，会员权益会跟随你的账号，也可以在其他设备上继续使用。</p>
                <label htmlFor="account-phone"><span>中国大陆手机号</span></label>
                <div className="account-phone-field">
                  <span>+86</span>
                  <input id="account-phone" type="tel" inputMode="numeric" autoComplete="tel" autoFocus value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="138 0000 0000" />
                </div>
                <button className="primary-button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send verification code"}</button>
                {message && <p className="account-dialog__message" aria-live="polite">{message}</p>}
              </form>
            ) : (
              <form className="account-dialog__form" onSubmit={verifyCode}>
                <Smartphone aria-hidden="true" />
                <p>验证码已发送至 +86 {phone}。</p>
                <label htmlFor="account-code"><span>短信验证码</span></label>
                <input id="account-code" type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="请输入验证码" />
                <button className="primary-button" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
                <button className="text-button" type="button" onClick={() => { setStep("phone"); setCode(""); setMessage(""); }}>Use another number</button>
                {message && <p className="account-dialog__message" aria-live="polite">{message}</p>}
              </form>
            )}
          </section>
        </div>
      )}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
