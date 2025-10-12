import { Turnstile } from "@marsidev/react-turnstile";
import { forwardRef, useId, useImperativeHandle, useRef } from "react";

export function useTurnstileRef() {
  const ref = useRef<{ reset: () => void }>(null);
  return ref;
}

export default forwardRef((props: { onChange?: (value: string) => void }, ref) => {
  const childRef = useRef<any>(null);
  const id = useId();

  useImperativeHandle(ref, () => ({
    reset: () => childRef.current?.reset(),
  }));

  return (
    <Turnstile
      id={id}
      ref={childRef}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
      onExpire={() => childRef.current?.reset()}
      onSuccess={(token) => props.onChange?.(token)}
    ></Turnstile>
  );
});
